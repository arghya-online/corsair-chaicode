import { corsair } from "@/src/server/corsair";

type Tenant = ReturnType<typeof corsair.withTenant>;

// ─── Helper: simplify a calendar event for the LLM context window ────────────
function simplifyEvent(ev: any) {
  const d = ev.data ?? ev ?? {};
  const start = d.start ?? null;
  const end = d.end ?? null;
  const startStr = start?.dateTime ?? start?.date ?? "";
  const endStr = end?.dateTime ?? end?.date ?? "";
  const summary = (d.summary ?? "(no title)").slice(0, 80);
  const desc = (d.description ?? "").slice(0, 120);
  const attendees = (d.attendees ?? [])
    .slice(0, 5)
    .map((a: any) => a.email ?? a);
  return {
    id: ev.entity_id ?? d.id ?? ev.id ?? "",
    summary,
    start: startStr,
    end: endStr,
    location: (d.location ?? "").slice(0, 60),
    description: desc,
    attendees,
    hangoutLink: d.hangoutLink ?? null,
    calendarId: d.calendarId ?? "primary",
  };
}

// ─── Helper: get local timezone offset dynamically ───────────────────────────
function getLocalTimezoneOffset() {
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const mins = String(absOffset % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

// ─── Helper: normalize date-time strings to full ISO 8601 with offset ────────
function normalizeDateTime(dt: string): string {
  if (!dt) return "";
  let normalized = dt.trim();
  // If just a date (YYYY-MM-DD), add time
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    normalized = `${normalized}T09:00:00`;
  }
  // If it has time but no timezone offset, append the local offset of the server/user
  if (normalized.includes("T") && !/[Zz]$|[-+]\d{2}:?\d{2}$/.test(normalized)) {
    normalized = `${normalized}${getLocalTimezoneOffset()}`;
  }
  return normalized;
}

export const calendarToolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "list_upcoming_events",
      description:
        "List upcoming Google Calendar events. Returns events from today onwards. Use this to check the user's schedule, meetings, or agenda.",
      parameters: {
        type: "object",
        properties: {
          days: {
            type: "number",
            description: "Number of days ahead to look (default 7, max 30)",
          },
          limit: {
            type: "number",
            description: "Max events to return (default 10)",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_calendar_events",
      description:
        "Search Google Calendar events by title, description, or location keyword.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search keyword, e.g. 'standup', 'meeting', 'dentist'",
          },
          limit: { type: "number", description: "Max results (default 5)" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_calendar_event",
      description:
        "Create a new Google Calendar event. Use this when the user asks to schedule a meeting, add a reminder, block time, or create any calendar entry. Create the event immediately once you have the title, date, and time.",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "Event title/name",
          },
          description: {
            type: "string",
            description: "Event notes or agenda (optional)",
          },
          location: {
            type: "string",
            description: "Physical or virtual location (optional)",
          },
          start_datetime: {
            type: "string",
            description:
              "Start date and time in ISO 8601 format, e.g. '2026-06-17T10:00:00'. For all-day events use 'YYYY-MM-DD'.",
          },
          end_datetime: {
            type: "string",
            description:
              "End date and time in ISO 8601 format, e.g. '2026-06-17T11:00:00'. Defaults to 1 hour after start if not specified.",
          },
          attendees: {
            type: "array",
            items: { type: "string" },
            description: "List of attendee email addresses (optional)",
          },
          all_day: {
            type: "boolean",
            description:
              "True if this is an all-day event (no specific time). Use YYYY-MM-DD format for dates.",
          },
        },
        required: ["summary", "start_datetime"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "delete_calendar_event",
      description:
        "Delete a Google Calendar event by its ID. Only call after the user has explicitly confirmed deletion.",
      parameters: {
        type: "object",
        properties: {
          event_id: {
            type: "string",
            description: "The ID of the event to delete",
          },
        },
        required: ["event_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_calendar_availability",
      description:
        "Check what time slots are free or busy in the calendar. Useful for finding a good time to schedule something.",
      parameters: {
        type: "object",
        properties: {
          from_date: {
            type: "string",
            description:
              "Start of the window in ISO 8601 format, e.g. '2026-06-17T00:00:00Z'",
          },
          to_date: {
            type: "string",
            description:
              "End of the window in ISO 8601 format, e.g. '2026-06-17T23:59:59Z'",
          },
        },
        required: ["from_date", "to_date"],
      },
    },
  },
];

export const calendarToolImplementations: Record<
  string,
  (tenant: Tenant, args: any) => Promise<any>
> = {
  // ── List upcoming events ── calls the live API directly for fresh data ──────
  list_upcoming_events: async (tenant, { days = 7, limit = 10 }) => {
    try {
      const cappedDays = Math.min(Number(days) || 7, 30);
      const cappedLimit = Math.min(Number(limit) || 10, 15);
      const now = new Date();
      const future = new Date(now.getTime() + cappedDays * 24 * 60 * 60 * 1000);

      // Call the live API to get fresh data (avoids stale DB)
      const result = await tenant.googlecalendar.api.events.getMany({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: future.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: cappedLimit,
      });

      const items = ((result as any)?.items ?? []).slice(0, cappedLimit);

      if (items.length === 0) {
        return {
          events: [],
          message: `No events found in the next ${cappedDays} days.`,
        };
      }

      return {
        events: items.map((ev: any) => simplifyEvent({ data: ev, ...ev })),
        count: items.length,
      };
    } catch (err: unknown) {
      // Fall back to DB if live API fails
      try {
        const now = new Date();
        const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const dbResults = await tenant.googlecalendar.db.events.search({
          data: {},
          limit: 200,
        });
        const items = (dbResults as any[])
          .map(simplifyEvent)
          .filter((ev) => {
            if (!ev.start) return false;
            const t = new Date(ev.start).getTime();
            return t >= now.getTime() && t <= future.getTime();
          })
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          )
          .slice(0, 10);
        return { events: items, count: items.length, source: "db_fallback" };
      } catch {
        return { error: err.message ?? "Failed to fetch events" };
      }
    }
  },

  // ── Search events ──────────────────────────────────────────────────────────
  search_calendar_events: async (tenant, { query, limit = 5 }) => {
    try {
      // Use the live API with the q parameter for text search
      const result = await tenant.googlecalendar.api.events.getMany({
        calendarId: "primary",
        q: String(query),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: Math.min(Number(limit) || 5, 10),
      });

      const items = ((result as any)?.items ?? []).slice(0, 8);
      return {
        events: items.map((ev: any) => simplifyEvent({ data: ev, ...ev })),
        count: items.length,
      };
    } catch (err: unknown) {
      return { error: err.message ?? "Search failed" };
    }
  },

  // ── Create event ── uses the CORRECT Corsair schema: { event: {...} } ──────
  create_calendar_event: async (
    tenant,
    {
      summary,
      description,
      location,
      start_datetime,
      end_datetime,
      attendees,
      all_day,
    },
  ) => {
    try {
      const isAllDay =
        all_day || /^\d{4}-\d{2}-\d{2}$/.test(String(start_datetime));

      let startPayload: any;
      let endPayload: any;

      if (isAllDay) {
        const startDate = String(start_datetime).slice(0, 10);
        const endDate = end_datetime
          ? String(end_datetime).slice(0, 10)
          : startDate;
        startPayload = { date: startDate };
        endPayload = { date: endDate };
      } else {
        const startIso = normalizeDateTime(String(start_datetime));
        const endIso = end_datetime
          ? normalizeDateTime(String(end_datetime))
          : new Date(
              new Date(startIso).getTime() + 60 * 60 * 1000,
            ).toISOString();

        startPayload = { dateTime: startIso };
        endPayload = { dateTime: endIso };
      }

      // Build the event object — Corsair expects { event: {...}, calendarId?: string }
      const eventBody: any = {
        summary: String(summary).trim(),
        start: startPayload,
        end: endPayload,
      };

      if (description) eventBody.description = String(description).trim();
      if (location) eventBody.location = String(location).trim();
      if (attendees?.length) {
        eventBody.attendees = (attendees as string[]).map((e) => ({
          email: e,
        }));
      }

      // ✅ Correct Corsair API shape: { calendarId, event: { ... } }
      const result = await tenant.googlecalendar.api.events.create({
        calendarId: "primary",
        event: eventBody,
      });

      return {
        success: true,
        event_id: (result as any)?.id ?? "unknown",
        summary,
        start: start_datetime,
        end: end_datetime ?? "(1 hour after start)",
        link: (result as any)?.htmlLink ?? null,
        message: `✅ "${summary}" has been added to your Google Calendar.`,
      };
    } catch (err: unknown) {
      return {
        error: err.message ?? "Failed to create event",
        details: String(err),
      };
    }
  },

  // ── Delete event ── Corsair eventsDelete uses { id } not { eventId } ───────
  delete_calendar_event: async (tenant, { event_id }) => {
    try {
      await tenant.googlecalendar.api.events.delete({
        id: String(event_id),
        calendarId: "primary",
      });
      return {
        success: true,
        message: `✅ Event has been deleted from your Google Calendar.`,
      };
    } catch (err: unknown) {
      return { error: err.message ?? "Failed to delete event" };
    }
  },

  // ── Availability ────────────────────────────────────────────────────────────
  get_calendar_availability: async (tenant, { from_date, to_date }) => {
    try {
      const ensureIso = (dt: string) =>
        /T/.test(dt) ? dt : `${dt}T00:00:00.000Z`;

      const result = await tenant.googlecalendar.api.calendar.getAvailability({
        timeMin: ensureIso(String(from_date)),
        timeMax: ensureIso(String(to_date)),
        items: [{ id: "primary" }],
      });

      return { availability: result };
    } catch (err: unknown) {
      return { error: err.message ?? "Failed to fetch availability" };
    }
  },
};

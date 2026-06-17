import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { getCurrentUser } from "@/src/actions/auth";
import prisma from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Corsair has an authorized account for this tenant and Google Calendar integration
    const hasCalAccount = await prisma.corsairAccount.findFirst({
      where: {
        tenantId: user.id,
        integration: {
          name: "googlecalendar",
        },
      },
    });

    if (!hasCalAccount) {
      return NextResponse.json(
        {
          error:
            "Integration 'googlecalendar' not configured or authorized for this user.",
        },
        { status: 400 },
      );
    }

    const tenant = await getTenant();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() ?? "";
    const calendarId = searchParams.get("calendarId")?.trim() ?? "";
    const fromDate = searchParams.get("from")?.trim() ?? "";
    const toDate = searchParams.get("to")?.trim() ?? "";

    let results: any[];

    if (query) {
      const [bySummary, byDescription, byLocation] = await Promise.all([
        tenant.googlecalendar.db.events.search({
          data: { summary: { contains: query } },
          limit: 100,
        }),
        tenant.googlecalendar.db.events.search({
          data: { description: { contains: query } },
          limit: 100,
        }),
        tenant.googlecalendar.db.events.search({
          data: { location: { contains: query } },
          limit: 100,
        }),
      ]);
      results = [...bySummary, ...byDescription, ...byLocation];
    } else if (calendarId) {
      results = await tenant.googlecalendar.db.events.search({
        data: { calendarId: { equals: calendarId } },
        limit: 250,
      });
    } else {
      results = await tenant.googlecalendar.db.events.search({
        data: {},
        limit: 250,
      });
    }

    // Deduplicate by entity_id
    const seen = new Map<string, any>();
    for (const ev of results) {
      const key = ev.entity_id ?? ev.id;
      if (!key) continue;
      const existing = seen.get(key);
      if (!existing || new Date(ev.updatedAt) > new Date(existing.updatedAt)) {
        seen.set(key, ev);
      }
    }

    // Shape response
    const events = Array.from(seen.values()).map((ev) => {
      const d = ev.data ?? {};
      return {
        id: ev.entity_id ?? d.id ?? ev.id,
        entityId: ev.entity_id ?? ev.id,
        summary: d.summary ?? ev.summary ?? "(no title)",
        description: d.description ?? ev.description ?? "",
        location: d.location ?? ev.location ?? "",
        start: d.start ?? ev.start ?? null,
        end: d.end ?? ev.end ?? null,
        colorId: d.colorId ?? ev.colorId ?? null,
        status: d.status ?? ev.status ?? "confirmed",
        htmlLink: d.htmlLink ?? ev.htmlLink ?? "",
        hangoutLink: d.hangoutLink ?? ev.hangoutLink ?? null,
        attendees: d.attendees ?? ev.attendees ?? [],
        organizer: d.organizer ?? ev.organizer ?? null,
        calendarId: d.calendarId ?? ev.calendarId ?? "primary",
        recurringEventId: d.recurringEventId ?? ev.recurringEventId ?? null,
        allDay: !d.start?.dateTime && !!d.start?.date,
        updatedAt: ev.updatedAt ?? ev.createdAt,
        created: d.created ?? ev.created ?? null,
      };
    });

    // Sort by start time
    events.sort((a, b) => {
      const aTime = a.start?.dateTime ?? a.start?.date ?? "";
      const bTime = b.start?.dateTime ?? b.start?.date ?? "";
      return new Date(aTime).getTime() - new Date(bTime).getTime();
    });

    // Optional date-range filter
    const filtered =
      fromDate || toDate
        ? events.filter((ev) => {
            const evStart = new Date(
              ev.start?.dateTime ?? ev.start?.date ?? 0,
            ).getTime();
            const from = fromDate ? new Date(fromDate).getTime() : 0;
            const to = toDate ? new Date(toDate).getTime() : Infinity;
            return evStart >= from && evStart <= to;
          })
        : events;

    return NextResponse.json({ events: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/calendar/events GET]", err);
    return NextResponse.json(
      { error: message ?? "Internal server error" },
      { status: 500 },
    );
  }
}

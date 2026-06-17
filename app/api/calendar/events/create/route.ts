import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { getCurrentUser } from "@/src/actions/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      summary,
      description,
      location,
      start,
      end,
      attendees,
      colorId,
      calendarId = "primary",
      timeZone = "UTC",
    } = body;

    if (!summary?.trim()) {
      return NextResponse.json(
        { error: "Event title (summary) is required." },
        { status: 400 },
      );
    }
    if (!start || !end) {
      return NextResponse.json(
        { error: "Event start and end times are required." },
        { status: 400 },
      );
    }

    const tenant = await getTenant();

    // Build the event body for Google Calendar API
    const eventBody: Record<string, any> = {
      summary: summary.trim(),
      description: description ?? "",
      location: location ?? "",
      start: start.date
        ? { date: start.date }
        : { dateTime: start.dateTime, timeZone },
      end: end.date ? { date: end.date } : { dateTime: end.dateTime, timeZone },
    };

    if (attendees?.length) {
      eventBody.attendees = attendees.map((email: string) => ({ email }));
    }
    if (colorId) {
      eventBody.colorId = colorId;
    }

    // ✅ Corsair API shape: { calendarId, event: { ... } }
    const result = await tenant.googlecalendar.api.events.create({
      calendarId,
      event: eventBody,
    });

    return NextResponse.json({ event: result, success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/calendar/events/create POST]", err);
    return NextResponse.json(
      { error: message ?? "Failed to create event" },
      { status: 500 },
    );
  }
}

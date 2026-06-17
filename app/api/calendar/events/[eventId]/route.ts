import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { getCurrentUser } from "@/src/actions/auth";

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

// PUT /api/calendar/events/[eventId] — update an event
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await context.params;
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

    const tenant = await getTenant();

    const patchBody: Record<string, any> = {};
    if (summary !== undefined) patchBody.summary = summary;
    if (description !== undefined) patchBody.description = description;
    if (location !== undefined) patchBody.location = location;
    if (colorId !== undefined) patchBody.colorId = colorId;
    if (start !== undefined) {
      patchBody.start = start.date
        ? { date: start.date }
        : { dateTime: start.dateTime, timeZone };
    }
    if (end !== undefined) {
      patchBody.end = end.date
        ? { date: end.date }
        : { dateTime: end.dateTime, timeZone };
    }
    if (attendees !== undefined) {
      patchBody.attendees = attendees.map((email: string) => ({ email }));
    }

    // ✅ Corsair schema: { id, event: {...} }
    const result = await tenant.googlecalendar.api.events.update({
      calendarId,
      id: decodeURIComponent(eventId),
      event: patchBody,
    });

    return NextResponse.json({ event: result, success: true });
  } catch (err: unknown) {
    if (err.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/calendar/events/[eventId] PUT]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to update event" },
      { status: 500 },
    );
  }
}

// DELETE /api/calendar/events/[eventId] — delete an event
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await context.params;
    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get("calendarId") ?? "primary";

    const tenant = await getTenant();

    // ✅ Corsair schema: { id } not { eventId }
    await tenant.googlecalendar.api.events.delete({
      id: decodeURIComponent(eventId),
      calendarId,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/calendar/events/[eventId] DELETE]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to delete event" },
      { status: 500 },
    );
  }
}

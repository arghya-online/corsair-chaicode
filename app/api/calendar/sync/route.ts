import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { getCurrentUser } from "@/src/actions/auth";

// POST /api/calendar/sync — Fetches latest events from Google Calendar API and syncs to local DB
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await getTenant();

    // Pull events using getMany — Corsair syncs them into the local DB
    const result = await tenant.googlecalendar.api.events.getMany({
      calendarId: "primary",
      maxResults: 250,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // last 30 days
      timeMax: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // next 90 days
    } as any);

    const count = (result as any)?.items?.length ?? 0;
    return NextResponse.json({
      success: true,
      count,
      message: `Synced ${count} event(s).`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/calendar/sync POST]", err);
    return NextResponse.json(
      { error: message ?? "Sync failed" },
      { status: 500 },
    );
  }
}

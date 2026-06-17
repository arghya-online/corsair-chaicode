import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { getCurrentUser } from "@/src/actions/auth";

// GET /api/calendar/availability — Get free/busy availability windows
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") ?? new Date().toISOString();
    const to =
      searchParams.get("to") ??
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const tenant = await getTenant();

    const result = await tenant.googlecalendar.api.calendar.getAvailability({
      timeMin: from,
      timeMax: to,
      items: [{ id: "primary" }],
    } as any);

    return NextResponse.json({ availability: result });
  } catch (err: unknown) {
    if (err.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/calendar/availability GET]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch availability" },
      { status: 500 },
    );
  }
}

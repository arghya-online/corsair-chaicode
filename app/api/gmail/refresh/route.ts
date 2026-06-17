import { NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";

export async function POST() {
  try {
    const tenant = await getTenant();

    // 1. Fetch latest 20 message IDs from Gmail
    const listResult = await tenant.gmail.api.messages.list({ maxResults: 20 });
    const messages = listResult?.messages ?? [];

    // 2. Fetch full details for each message in parallel (automatically caches them to database)
    if (messages.length > 0) {
      await Promise.all(
        messages.map(async (msg: any) => {
          if (!msg.id) return;
          try {
            await tenant.gmail.api.messages.get({ id: msg.id, format: "full" });
          } catch (e) {
            console.error(`Failed to sync message ${msg.id}:`, e);
          }
        }),
      );
    }

    return NextResponse.json({ success: true, count: messages.length });
  } catch (err: unknown) {
    if (err.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/gmail/refresh]", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}

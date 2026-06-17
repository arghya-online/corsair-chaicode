import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { extractPlainBody, getHeader } from "@/src/server/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tenant = await getTenant();

    // 1. Try Corsair's local DB cache first
    const cached = await tenant.gmail.db.messages.search({
      entity_id: { equals: id },
      limit: 1,
    } as any);

    if (cached.length > 0) {
      const msg = cached[0];
      const d = msg.data ?? {};

      // If we have a body stored in the cache, return it directly
      if (d.body || d.snippet) {
        return NextResponse.json({
          id: msg.entity_id ?? id,
          subject: d.subject ?? "(no subject)",
          from: d.from ?? "",
          to: d.to ?? "",
          snippet: d.snippet ?? "",
          body: d.body ?? d.snippet ?? "",
          internalDate: d.internalDate ?? null,
          labelIds: d.labelIds ?? [],
          threadId: d.threadId ?? null,
        });
      }
    }

    // 2. Fall back to live Gmail API fetch
    const full = await tenant.gmail.api.messages.get({ id, format: "full" });

    const headers = full?.payload?.headers ?? [];
    const subject = getHeader(headers, "Subject") || "(no subject)";
    const from = getHeader(headers, "From");
    const to = getHeader(headers, "To");
    const body = extractPlainBody(full?.payload) || full?.snippet || "";

    return NextResponse.json({
      id: full?.id ?? id,
      subject,
      from,
      to,
      snippet: full?.snippet ?? "",
      body,
      internalDate: full?.internalDate ?? null,
      labelIds: full?.labelIds ?? [],
      threadId: full?.threadId ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/gmail/message/[id]]", err);
    return NextResponse.json(
      { error: message ?? "Internal server error" },
      { status: 500 },
    );
  }
}

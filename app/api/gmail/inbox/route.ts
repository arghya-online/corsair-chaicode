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

    // Check if Corsair has an authorized account for this tenant and Gmail integration
    const hasGmailAccount = await prisma.corsairAccount.findFirst({
      where: {
        tenantId: user.id,
        integration: {
          name: "gmail",
        },
      },
    });

    if (!hasGmailAccount) {
      return NextResponse.json(
        {
          error:
            "Integration 'gmail' not configured or authorized for this user.",
        },
        { status: 400 },
      );
    }

    const tenant = await getTenant();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() ?? "";

    let results: any[];

    if (query) {
      // Search by snippet OR subject OR from (run parallel searches and merge)
      const [bySnippet, bySubject, byFrom] = await Promise.all([
        tenant.gmail.db.messages.search({
          snippet: { contains: query },
          limit: 50,
        } as any),
        tenant.gmail.db.messages.search({
          subject: { contains: query },
          limit: 50,
        } as any),
        tenant.gmail.db.messages.search({
          from: { contains: query },
          limit: 50,
        } as any),
      ]);
      results = [...bySnippet, ...bySubject, ...byFrom];
    } else {
      results = await tenant.gmail.db.messages.search({ limit: 50 } as any);
    }

    // Deduplicate by entity_id, keep the latest updatedAt
    const seen = new Map<string, any>();
    for (const msg of results) {
      const key = msg.entity_id ?? msg.id;
      if (!key) continue;
      const existing = seen.get(key);
      if (!existing || new Date(msg.updatedAt) > new Date(existing.updatedAt)) {
        seen.set(key, msg);
      }
    }

    // Sort newest-first by updatedAt
    const sorted = Array.from(seen.values()).sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.createdAt).getTime() -
        new Date(a.updatedAt ?? a.createdAt).getTime(),
    );

    // Shape the response - pull fields from either top-level or nested `data`
    const messages = sorted.map((msg) => {
      const d = msg.data ?? {};
      return {
        id: msg.entity_id ?? d.id ?? msg.id,
        entityId: msg.entity_id ?? msg.id,
        subject: d.subject ?? msg.subject ?? "(no subject)",
        from: d.from ?? msg.from ?? "",
        snippet: d.snippet ?? msg.snippet ?? "",
        internalDate: d.internalDate ?? null,
        updatedAt: msg.updatedAt ?? msg.createdAt,
        labelIds: d.labelIds ?? [],
        threadId: d.threadId ?? null,
      };
    });

    return NextResponse.json({ messages });
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/gmail/inbox]", err);
    return NextResponse.json(
      { error: message ?? "Internal server error" },
      { status: 500 },
    );
  }
}

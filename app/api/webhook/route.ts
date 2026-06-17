import { NextRequest, NextResponse } from "next/server";
import { processWebhook } from "corsair";
import { corsair } from "@/src/server/corsair";

// POST /api/webhook — Handles incoming Corsair webhook events
// Register this URL in your Google Calendar push notification subscription
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const headers = Object.fromEntries(request.headers);
    const body = await request.json().catch(() => ({}));

    const result = await processWebhook(corsair, headers, body);

    // processWebhook returns a WebhookResponse — extract its status and body
    // and wrap in a standard NextResponse to satisfy Next.js route type constraints
    const webhookRes = result.response as any;
    if (webhookRes && typeof webhookRes.status === "number") {
      let responseBody: any = {};
      try {
        if (typeof webhookRes.json === "function") {
          responseBody = await webhookRes.json();
        } else if (typeof webhookRes.text === "function") {
          responseBody = await webhookRes.text();
        }
      } catch {
        // ignore parse errors; body may already be consumed
      }
      return NextResponse.json(
        typeof responseBody === "string"
          ? { message: responseBody }
          : (responseBody ?? {}),
        { status: webhookRes.status ?? 200 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    console.error("[/api/webhook POST]", err);
    return NextResponse.json(
      { error: message ?? "Webhook processing failed" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { encodeRawEmail } from "@/src/server/lib/email";

export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant();
    const body = await request.json();
    const {
      to,
      subject,
      body: emailBody,
    } = body as {
      to: string;
      subject: string;
      body: string;
    };

    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, body" },
        { status: 400 },
      );
    }

    const raw = encodeRawEmail({ to, subject, body: emailBody });

    const result = await tenant.gmail.api.messages.send({ raw });

    return NextResponse.json({
      success: true,
      messageId: result?.id ?? null,
    });
  } catch (err: unknown) {
    if (err.message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/gmail/send]", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}

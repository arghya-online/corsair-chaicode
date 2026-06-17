import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/src/server/lib/tenant";
import { runChat } from "@/src/server/ai/chat-handler";
import { getCurrentUser } from "@/src/actions/auth";

// Per-user rate limiter: max 10 requests per minute (to protect Gemini 15 RPM limits)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const limit = 10;
  const windowMs = 60 * 1000;

  const record = rateLimits.get(userId);
  if (!record || now > record.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return { allowed: true };
}

// Simple prompt injection and safety guardrail check
function checkGuardrails(messageContent: string): {
  safe: boolean;
  reason?: string;
} {
  const lower = messageContent.toLowerCase();

  // Basic check for common prompt injection/override phrases
  const injectionKeywords = [
    "ignore previous instructions",
    "ignore the instructions above",
    "override system prompt",
    "you are now a developer",
    "system prompt",
    "jailbreak",
  ];

  for (const keyword of injectionKeywords) {
    if (lower.includes(keyword)) {
      return {
        safe: false,
        reason:
          "Security violation: Direct system prompt modification detected.",
      };
    }
  }

  return { safe: true };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Rate Limiting
    const limitCheck = checkRateLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${limitCheck.retryAfter} seconds before sending another message.`,
        },
        { status: 429 },
      );
    }

    const tenant = await getTenant();
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid message history" },
        { status: 400 },
      );
    }

    // 1.5 Enforce Plan-Based Chat Limits
    const plan = user.plan || "free";
    const userMessageCount = messages.filter((m: any) => m.role === "user").length;

    if (plan === "free" && userMessageCount > 4) {
      return NextResponse.json(
        { error: "Plan limit reached: The Base plan is limited to 4 chats (messages) in active memory. Upgrade to Alpha or Gama plan to send more chats." },
        { status: 403 }
      );
    }

    if (plan === "alpha" && userMessageCount > 20) {
      return NextResponse.json(
        { error: "Plan limit reached: The Alpha plan is limited to 20 chats (messages) in active memory. Upgrade to Gama plan for unlimited chats." },
        { status: 403 }
      );
    }

    // 2. Limit Conversation History size (Guardrail to prevent huge payloads / token limit hits)
    const maxHistory = 12;
    const trimmedMessages = messages.slice(-maxHistory);

    // 3. Input Guardrails on the latest message
    const lastUserMessage = trimmedMessages
      .filter((m: any) => m.role === "user")
      .pop();
    if (lastUserMessage && typeof lastUserMessage.content === "string") {
      const guardrailResult = checkGuardrails(lastUserMessage.content);
      if (!guardrailResult.safe) {
        return NextResponse.json(
          { error: guardrailResult.reason },
          { status: 400 },
        );
      }
    }

    const systemMessage = {
      role: "system" as const,
      content: `You are Zentra, an intelligent AI assistant connected to the user's Gmail and Google Calendar via Corsair.
Today is ${new Date().toDateString()}. Current time: ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}.

You have access to the following capabilities:

--- GMAIL ---
- list_recent_emails: Fetch recent emails
- search_emails: Search inbox by keyword
- get_email_body: Read the full content of an email
- send_email: Send an email (only after user confirms the draft)

--- GOOGLE CALENDAR ---
- list_upcoming_events: Show the user's upcoming meetings/events/reminders
- search_calendar_events: Find events by title, description, or keyword
- create_calendar_event: Add a new event, meeting, or reminder to Google Calendar
- delete_calendar_event: Remove an event (only after user confirms)
- get_calendar_availability: Check free/busy time slots

--- RULES ---
1. Always use tools to fetch REAL data. Never invent or hallucinate email or calendar details.
2. For EMAIL drafts: write the full subject and body yourself based on the user's brief, show it, and ask for confirmation BEFORE calling send_email.
3. For CALENDAR EVENTS: when the user asks to "add a reminder", "schedule a meeting", "block time", or "create an event" — use create_calendar_event immediately. You may ask for clarification (like the date/time) if it's missing, but once you have the details, create it right away without excessive confirmation steps for simple reminders.
4. For DELETIONS: always confirm with the user before calling delete_calendar_event or permanently removing anything.
5. When showing upcoming events, format them clearly with date, time, and title. Use a readable format like "Mon Jun 17 · 10:00 AM — Standup Meeting".
6. Be concise, friendly, and proactive. If the user says "remind me X" without a time, ask what time/day they want it.`,
    };

    const result = await runChat([systemMessage, ...trimmedMessages], tenant, plan);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? (err as Error).message : undefined;
    if (message === "Not authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[/api/chat] error:", err);
    return NextResponse.json(
      { error: message ?? "Internal error" },
      { status: 500 },
    );
  }
}

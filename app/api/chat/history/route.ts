import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/actions/auth";
import prisma from "@/src/lib/prisma";

// GET /api/chat/history — Load the user's most recent conversation
export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await prisma.agentConversation.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversation) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({
      id: conversation.id,
      messages: conversation.messages as any[],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : undefined;
    console.error("[/api/chat/history GET]", err);
    return NextResponse.json(
      { error: message ?? "Failed to load history" },
      { status: 500 },
    );
  }
}

// POST /api/chat/history — Save or update the user's conversation
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, conversationId } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 },
      );
    }

    // Keep only user/assistant messages (strip tool calls) and cap at 100 messages
    const cleanMessages = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .slice(-100);

    let conversation;

    if (conversationId) {
      // Ensure the conversation exists and belongs to the authenticated user
      const existing = await prisma.agentConversation.findFirst({
        where: { id: conversationId, userId: user.id },
      });
      if (!existing) {
        return NextResponse.json(
          { error: "Conversation not found or unauthorized" },
          { status: 404 },
        );
      }

      // Update existing conversation
      conversation = await prisma.agentConversation.update({
        where: { id: conversationId },
        data: { messages: cleanMessages },
      });
    } else {
      // Check if the user already has a conversation, update it or create new
      const existing = await prisma.agentConversation.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });

      if (existing) {
        conversation = await prisma.agentConversation.update({
          where: { id: existing.id },
          data: { messages: cleanMessages },
        });
      } else {
        conversation = await prisma.agentConversation.create({
          data: {
            userId: user.id,
            messages: cleanMessages,
          },
        });
      }
    }

    return NextResponse.json({ id: conversation.id, saved: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : undefined;
    console.error("[/api/chat/history POST]", err);
    return NextResponse.json(
      { error: message ?? "Failed to save history" },
      { status: 500 },
    );
  }
}

// DELETE /api/chat/history — Clear the conversation history
export async function DELETE(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.agentConversation.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ cleared: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : undefined;
    console.error("[/api/chat/history DELETE]", err);
    return NextResponse.json(
      { error: message ?? "Failed to clear history" },
      { status: 500 },
    );
  }
}

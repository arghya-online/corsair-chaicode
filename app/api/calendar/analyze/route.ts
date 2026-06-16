import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/actions/auth";
import { genAI, CHAT_MODEL } from "@/src/server/ai/gemini";
import prisma from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, summary, description, location, start, end } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: CHAT_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are Zentra AI, an intelligent co-pilot for email and scheduling.
      Analyze this calendar event and generate a structured JSON response.

      EVENT DETAILS:
      Summary: ${summary}
      Description: ${description || "No description provided"}
      Location: ${location || "No location provided"}
      Start: ${start}
      End: ${end}

      INSTRUCTIONS:
      1. Provide a concise 2-sentence preparation briefing note for this meeting.
      2. Suggest 2 actionable recommendations/checklist tasks for the user prior to this meeting.
      3. Suggest 2 post-meeting action item templates.

      Return ONLY a JSON object matching this structure:
      {
        "prepNotes": "2-sentence preparation note",
        "preActions": ["Pre-action item 1", "Pre-action item 2"],
        "postActions": ["Post-action item 1", "Post-action item 2"]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("[/api/calendar/analyze]", err);
    return NextResponse.json(
      {
        prepNotes: "Prepare notes and review agendas.",
        preActions: ["Review description", "Set up meeting space"],
        postActions: ["Send follow-up notes", "Log action items"]
      },
      { status: 200 } // Return fallback gracefully
    );
  }
}
export const dynamic = "force-dynamic";

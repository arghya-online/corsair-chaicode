import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/actions/auth";
import { genAI, CHAT_MODEL } from "@/src/server/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailId, subject, from, body } = await request.json();
    if (!emailId) {
      return NextResponse.json({ error: "Missing emailId" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: CHAT_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are Zentra AI, an intelligent co-pilot for email and scheduling.
      Analyze the following email and generate a structured JSON response.

      EMAIL DETAILS:
      From: ${from}
      Subject: ${subject}
      Body: ${body}

      INSTRUCTIONS:
      1. Provide a concise, clear 2-sentence summary of the email content.
      2. Identify the key people involved or mentioned in the email.
      3. Suggest 3 short, contextual, and professional response templates that the user can click to write a reply. Keep them under 30 words each.
      4. Suggest up to 2 actionable next items/checklist tasks for the user.

      Return ONLY a JSON object matching this structure:
      {
        "summary": "2-sentence summary",
        "keyPeople": ["Name 1", "Name 2"],
        "suggestedReplies": [
          "Brief suggested reply 1",
          "Brief suggested reply 2",
          "Brief suggested reply 3"
        ],
        "nextActions": ["Action task 1", "Action task 2"]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("[/api/gmail/analyze]", err);
    return NextResponse.json(
      {
        summary: "Could not generate AI summary.",
        keyPeople: [],
        suggestedReplies: ["Acknowledge email", "Schedule follow-up", "Politely decline"],
        nextActions: ["Mark as read"]
      },
      { status: 200 } // Return fallback gracefully
    );
  }
}
export const dynamic = "force-dynamic";

import { genAI, CHAT_MODEL } from "./gemini";
import {
  toolDefinitions as gmailToolDefs,
  toolImplementations as gmailToolImpls,
} from "./tools/gmail-tools";
import {
  calendarToolDefinitions,
  calendarToolImplementations,
} from "./tools/calendar-tools";
import type { corsair } from "@/src/server/corsair";
import type { Content } from "@google/generative-ai";

type Tenant = ReturnType<typeof corsair.withTenant>;

const allToolDefinitions = [...gmailToolDefs, ...calendarToolDefinitions];
const allToolImplementations = {
  ...gmailToolImpls,
  ...calendarToolImplementations,
};

function getToolNameForCallId(toolCallId: string, messages: any[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.tool_calls) {
      const found = msg.tool_calls.find((tc: any) => tc.id === toolCallId);
      if (found) return found.function.name;
    }
  }
  return "unknown_tool";
}

interface MappedHistory {
  contents: Content[];
  systemInstruction?: string;
}

function mapMessagesToGemini(messages: any[]): MappedHistory {
  const contents: Content[] = [];
  let systemInstruction: string | undefined = undefined;

  for (const msg of messages) {
    if (msg.role === "system") {
      systemInstruction = msg.content;
      continue;
    }

    if (msg.role === "user") {
      contents.push({
        role: "user",
        parts: [{ text: msg.content }],
      });
      continue;
    }

    if (msg.role === "assistant") {
      const parts: any[] = [];
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      if (msg.tool_calls?.length) {
        for (const tc of msg.tool_calls) {
          parts.push({
            functionCall: {
              name: tc.function.name,
              args: JSON.parse(tc.function.arguments || "{}"),
            },
          });
        }
      }
      contents.push({
        role: "model",
        parts,
      });
      continue;
    }

    if (msg.role === "tool") {
      contents.push({
        role: "function",
        parts: [
          {
            functionResponse: {
              name:
                msg.name ?? getToolNameForCallId(msg.tool_call_id, messages),
              response: JSON.parse(msg.content || "{}"),
            },
          },
        ],
      });
      continue;
    }
  }

  return { contents, systemInstruction };
}

function mapOpenAiToolsToGemini(openaiTools: any[]): any[] {
  const mapParameters = (param: any): any => {
    if (!param) return undefined;
    const mapped: any = { ...param };
    if (typeof param.type === "string") {
      mapped.type = param.type.toUpperCase();
    }
    if (param.properties) {
      mapped.properties = {};
      for (const key of Object.keys(param.properties)) {
        mapped.properties[key] = mapParameters(param.properties[key]);
      }
    }
    if (param.items) {
      mapped.items = mapParameters(param.items);
    }
    return mapped;
  };

  return [
    {
      functionDeclarations: openaiTools.map((def) => ({
        name: def.function.name,
        description: def.function.description,
        parameters: mapParameters(def.function.parameters),
      })),
    },
  ];
}

async function generateContentWithRetry(
  model: any,
  params: any,
  retries = 5,
  delay = 2000,
): Promise<any> {
  try {
    return await model.generateContent(params);
  } catch (err: unknown) {
    const errMsg = String(err);
    const isRateLimit =
      (err as any).status === 429 ||
      errMsg.includes("429") ||
      (err as Error).message?.includes("429") ||
      (err as Error).message?.toLowerCase().includes("quota") ||
      (err as Error).message?.toLowerCase().includes("limit") ||
      (err as Error).message?.toLowerCase().includes("exhausted");

    if (isRateLimit && retries > 0) {
      console.warn(
        `[Gemini 429] Rate limited. Retrying in ${delay}ms... (${retries} retries left). Error: ${(err as Error).message ?? errMsg}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return generateContentWithRetry(
        model,
        params,
        retries - 1,
        Math.min(delay * 2, 10000),
      );
    }
    throw err;
  }
}

export async function runChat(messages: any[], tenant: Tenant, userPlan: string = "free") {
  const convo = [...messages];

  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
  });

  const allowedToolDefs = userPlan === "free"
    ? gmailToolDefs
    : [...gmailToolDefs, ...calendarToolDefinitions];

  const geminiTools = mapOpenAiToolsToGemini(allowedToolDefs);

  for (let i = 0; i < 8; i++) {
    // Map current history to Gemini contents format
    const { contents, systemInstruction } = mapMessagesToGemini(convo);

    const response = await generateContentWithRetry(model, {
      contents,
      systemInstruction,
      tools: geminiTools,
    });

    let text = "";
    try {
      text = response.response.text();
    } catch {
      // Empty text is normal when only function calls are returned
    }

    const functionCalls = response.response.functionCalls();

    const toolCalls = functionCalls?.map((fc: any, index: number) => ({
      id: `call_${Date.now()}_${index}`,
      type: "function" as const,
      function: {
        name: fc.name,
        arguments: JSON.stringify(fc.args),
      },
    }));

    const responseMessage = {
      role: "assistant" as const,
      content: text || null,
      tool_calls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined,
    };

    convo.push(responseMessage);

    if (!toolCalls?.length) {
      return { reply: text, messages: convo };
    }

    for (const call of toolCalls) {
      const fn = allToolImplementations[call.function?.name];
      let result;
      const isCalendarTool = calendarToolDefinitions.some(d => d.function.name === call.function?.name);
      if (userPlan === "free" && isCalendarTool) {
        result = { error: "Google Calendar access is blocked on the Base Plan. Please upgrade to Alpha or Gama plan to use Google Calendar sync features." };
      } else {
        try {
          const args = JSON.parse(call.function?.arguments || "{}");
          result = fn
            ? await fn(tenant, args)
            : { error: `Unknown tool: ${call.function?.name}` };
        } catch (err: unknown) {
          result = { error: (err as Error).message };
        }
      }
      convo.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  return {
    reply: "Sorry, I couldn't finish that — try rephrasing.",
    messages: convo,
  };
}

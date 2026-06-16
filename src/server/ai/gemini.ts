import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables.");
}

// Initialize the official Google Generative AI SDK
export const genAI = new GoogleGenerativeAI(geminiKey);

// Use gemini-2.5-flash exclusively
export const CHAT_MODEL = "gemini-2.5-flash";

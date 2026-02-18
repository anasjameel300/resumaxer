
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Constants ---
export const FAST_MODEL = "gemini-2.5-flash-lite"; // Fast tasks
export const POWER_MODEL = "gemini-2.5-flash"; // Power/Complex tasks

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing. AI features will fail.");
}

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

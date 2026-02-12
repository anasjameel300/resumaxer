import OpenAI from 'openai';

// --- Constants ---
export const FAST_MODEL = "google/gemini-2.0-flash-001";
export const POWER_MODEL = "deepseek/deepseek-r1";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Resumaxer';

if (!OPENROUTER_API_KEY) {
  console.warn("OpenRouter API Key is missing. AI features will fail.");
}

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
  dangerouslyAllowBrowser: true // Not recommended for production, but okay if used in API routes only
});

export const completion = async (model: string, messages: any[], response_format: any = { type: "text" }) => {
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages,
            response_format: response_format
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        throw error;
    }
};

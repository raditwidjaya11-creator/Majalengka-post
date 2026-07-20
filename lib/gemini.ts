import { GoogleGenAI } from "@google/genai";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. Gemini client will be null.");
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
    return null;
  }
}

async function callGeminiWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const isTransient = 
        err?.status === 503 || 
        err?.status === 429 || 
        (err?.message && (
          err.message.includes("503") || 
          err.message.includes("429") || 
          err.message.includes("high demand") || 
          err.message.includes("UNAVAILABLE")
        ));
      
      if (isTransient && attempt < retries) {
        console.log(`Gemini service busy (status ${err?.status || "503/429"}). Retrying in ${delayMs}ms... (Attempt ${attempt}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed after retries");
}

export async function generateContentWithFallback(
  contents: any,
  config?: any,
  models = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"]
): Promise<any> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error("GEMINI_API_KEY is missing or invalid. Client could not be initialized.");
  }
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[Gemini Router] Running generation with model: ${model}`);
      const response = await callGeminiWithRetry(() =>
        client.models.generateContent({
          model,
          contents,
          config,
        }),
        2,
        800
      );
      console.log(`[Gemini Router] Successfully generated using model: ${model}`);
      return response;
    } catch (err: any) {
      console.log(`[Gemini Router] Model ${model} is busy (status ${err?.status || "503/429"}). Trying next fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models failed.");
}

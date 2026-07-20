import { runChatAI } from "../../services/chat.js";

export default async function handler(req: any, res: any) {
  console.log("[API LOG] POST /api/gemini/chat called");
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Messages array is required." });
    }

    const result = await runChatAI(messages);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in chat AI API handler:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
}

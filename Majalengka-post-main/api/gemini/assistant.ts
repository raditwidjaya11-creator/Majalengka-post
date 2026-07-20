import { runAssistantCommand } from "../../services/assistant.js";

export default async function handler(req: any, res: any) {
  console.log("[API LOG] POST /api/gemini/assistant called");
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
    const { action, text, options } = req.body || {};

    if (!text) {
      return res.status(400).json({ success: false, error: "Text is required." });
    }

    const result = await runAssistantCommand(action, text, options);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in assistant API handler:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
}

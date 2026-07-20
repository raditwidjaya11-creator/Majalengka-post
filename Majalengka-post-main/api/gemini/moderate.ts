import { moderateComment } from "../../services/moderate.js";

export default async function handler(req: any, res: any) {
  console.log("[API LOG] POST /api/gemini/moderate called");
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }
    const { commentText } = req.body || {};
    if (!commentText) {
      return res.status(400).json({ success: false, error: "Comment text is required." });
    }

    const result = await moderateComment(commentText);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in moderation handler:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
}

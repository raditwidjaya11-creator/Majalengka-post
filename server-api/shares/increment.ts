import { incrementShareCountDb } from "../../lib/supabase-service.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { articleId, platform } = req.body || {};
  if (!articleId || !platform) {
    return res.status(400).json({ success: false, error: "articleId and platform are required." });
  }

  try {
    const shares = await incrementShareCountDb(articleId, platform);
    return res.status(200).json({ success: true, shares });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

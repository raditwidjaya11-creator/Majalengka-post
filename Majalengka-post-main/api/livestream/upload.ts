import { uploadVideoDb } from "../../lib/supabase-service.js";
import { UPLOADS_DIR } from "../../lib/vercel-storage.js";
import path from "path";
import fs from "fs";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { videoData, fileName } = req.body || {};
  if (!videoData || !fileName) {
    return res.status(400).json({ success: false, error: "videoData (base64) and fileName are required" });
  }

  try {
    const base64Data = videoData.replace(/^data:video\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    // Try Supabase Storage first
    try {
      const publicUrl = await uploadVideoDb(buffer, fileName, "video/mp4");
      if (publicUrl) {
        return res.status(200).json({ success: true, url: publicUrl });
      }
    } catch (dbErr: any) {
      console.warn("[Upload API] Supabase storage failed, trying local fallback:", dbErr.message || dbErr);
    }

    // Local /tmp write fallback for offline local testing
    const ext = path.extname(fileName) || ".mp4";
    const baseName = "stream_video_" + Date.now() + ext;
    const targetPath = path.join(UPLOADS_DIR, baseName);
    
    fs.writeFileSync(targetPath, buffer);
    const fileUrl = `/uploads/${baseName}`;
    return res.status(200).json({ success: true, url: fileUrl, note: "Uploaded to local fallback filesystem." });
  } catch (err: any) {
    console.error("Video upload error in Vercel API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

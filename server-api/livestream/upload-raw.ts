import { uploadVideoDb } from "../../lib/supabase-service.js";
import { UPLOADS_DIR } from "../../lib/vercel-storage.js";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable default parsing to receive raw streaming body
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const rawFileNameHeader = req.headers["x-file-name"] as string;
    const fileName = rawFileNameHeader ? decodeURIComponent(rawFileNameHeader) : "stream_video.mp4";

    // Read the incoming request stream into a unified buffer
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      return res.status(400).json({ success: false, error: "No video stream content received" });
    }

    // Try Supabase Storage first
    try {
      const publicUrl = await uploadVideoDb(buffer, fileName, "video/mp4");
      if (publicUrl) {
        return res.status(200).json({ success: true, url: publicUrl });
      }
    } catch (dbErr: any) {
      console.warn("[Upload Raw API] Supabase storage failed, trying local fallback:", dbErr.message || dbErr);
    }

    // Local /tmp write fallback for offline local testing
    const ext = path.extname(fileName) || ".mp4";
    const baseName = "stream_video_" + Date.now() + ext;
    const targetPath = path.join(UPLOADS_DIR, baseName);
    
    fs.writeFileSync(targetPath, buffer);
    const fileUrl = `/uploads/${baseName}`;
    return res.status(200).json({ success: true, url: fileUrl, note: "Uploaded to local fallback filesystem." });
  } catch (err: any) {
    console.error("Raw video upload error in Vercel API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

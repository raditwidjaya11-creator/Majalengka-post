import { getUploadFilePath } from "../lib/vercel-storage.js";
import path from "path";
import fs from "fs";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
}

export default async function handler(req: any, res: any) {
  try {
    const filename = req.query.filename || req.params.filename;
    if (!filename) {
      return res.status(400).send("Filename is required");
    }
    
    // Resolve clean path
    const safeFilename = path.basename(filename);
    const filePath = getUploadFilePath(safeFilename);
    const contentType = getMimeType(safeFilename);
    
    if (filePath && fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      
      // Handle HTTP Range requests for video streaming compatibility
      const range = req.headers.range;
      if (range && contentType.startsWith("video/")) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        
        const file = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": contentType,
        });
        return file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": stat.size,
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        });
        return fs.createReadStream(filePath).pipe(res);
      }
    }
    
    // If image file is missing, redirect to Unsplash news default fallback
    if (contentType.startsWith("image/")) {
      return res.redirect("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
    }

    return res.status(404).send("File not found");
  } catch (err: any) {
    console.error("Error serving upload in Vercel API:", err);
    return res.status(500).send(err.message);
  }
}

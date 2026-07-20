import { UPLOADS_DIR } from "../lib/vercel-storage.js";
import path from "path";
import fs from "fs";

export default async function handler(req: any, res: any) {
  try {
    const { filename } = req.query;
    if (!filename) {
      return res.status(400).send("Filename is required");
    }
    
    // Resolve clean path to prevent path traversal vulnerabilities
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      
      // Handle HTTP Range requests for video streaming compatibility (crucial for iOS Safari!)
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        
        const file = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        });
        return file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": stat.size,
          "Content-Type": "video/mp4",
        });
        return fs.createReadStream(filePath).pipe(res);
      }
    }
    
    return res.status(404).send("File not found");
  } catch (err: any) {
    console.error("Error serving upload in Vercel API:", err);
    return res.status(500).send(err.message);
  }
}

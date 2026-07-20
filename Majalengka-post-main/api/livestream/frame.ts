import { getLiveCameraFrame, setLiveCameraFrame } from "../../lib/vercel-storage.js";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      return res.status(200).json({ success: true, frame: getLiveCameraFrame() });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else if (req.method === "POST") {
    const { frame } = req.body || {};
    if (frame === undefined) {
      return res.status(400).json({ success: false, error: "frame body parameter is required" });
    }
    try {
      setLiveCameraFrame(frame);
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

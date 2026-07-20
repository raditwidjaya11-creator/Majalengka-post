import { getSeoSettingsDb, updateSeoSettingsDb } from "../../lib/supabase-service.js";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const settings = await getSeoSettingsDb();
      return res.status(200).json({ success: true, settings });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const updated = await updateSeoSettingsDb(req.body);
      return res.status(200).json({ success: true, settings: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

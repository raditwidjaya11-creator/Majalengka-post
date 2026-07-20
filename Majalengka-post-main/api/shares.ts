import { getShareCountsDb } from "../lib/supabase-service.js";

export default async function handler(req: any, res: any) {
  try {
    const shares = await getShareCountsDb();
    return res.status(200).json({ success: true, shares });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default function handler(req: any, res: any) {
  console.log("[API LOG] GET /api/health called");
  try {
    return res.status(200).json({
      success: true,
      status: "ok",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in health handler:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

import { fetchArticles } from "../lib/db.js";

export default async function handler(req: any, res: any) {
  console.log("[API LOG] GET /api/articles called");
  try {
    const articles = await fetchArticles();
    return res.status(200).json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (err: any) {
    console.error("Error in articles handler:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

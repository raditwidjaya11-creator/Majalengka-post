import { generateGoogleNewsSitemapXML } from "../services/seo.js";

export default async function handler(req: any, res: any) {
  console.log("[API LOG] GET /news-sitemap.xml called");

  const host = req.headers.host || "www.majalengkapost.web.id";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const xml = await generateGoogleNewsSitemapXML(baseUrl);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600");
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error("Error generating news-sitemap.xml:", err);
    return res.status(500).send("Error generating Google News sitemap");
  }
}

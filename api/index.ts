import fs from "fs";
import path from "path";
import { getSeoSettingsDb } from "../lib/supabase-service.js";
import { handleSEORouting } from "../server/middleware/seo.js";

export default async function handler(req: any, res: any) {
  console.log("[API LOG] GET /api/index (SEO router) called with URL:", req.url);
  try {
    const host = req.headers.host || "www.majalengkapost.web.id";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${protocol}://${host}`;

    // Fetch Google Site Verification code from database or env variables
    let googleSiteVerification = "";
    try {
      const seoSettings = await getSeoSettingsDb();
      googleSiteVerification = seoSettings?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
    } catch (err) {
      console.warn("[SEO Router] Failed to load SEO verification settings, falling back to process.env:", err);
      googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
    }

    // Read pre-compiled index.html template with robust path resolution to prevent 500 crashes and MIME type errors
    let html = "";
    const pathsToTry = [
      path.join(process.cwd(), "api", "index-template.html"),
      path.join(__dirname, "index-template.html"),
      path.join(__dirname, "..", "api", "index-template.html"),
      path.join(process.cwd(), "dist", "index.html"),
      path.join(__dirname, "..", "dist", "index.html"),
      path.join(process.cwd(), "index.html"),
      path.join(__dirname, "..", "index.html")
    ];

    for (const p of pathsToTry) {
      try {
        if (fs.existsSync(p)) {
          html = fs.readFileSync(p, "utf-8");
          console.log("[SEO Router] Successfully loaded index template from:", p);
          break;
        }
      } catch (err) {
        console.warn(`[SEO Router] Failed checking path: ${p}`, err);
      }
    }

    if (!html) {
      console.warn("[SEO Router] No index template found in any paths. Using default HTML shell.");
      html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Majalengka Post</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
    }

    // Resolve original request path in Vercel environment
    const urlPath = req.headers["x-forwarded-url"] || req.headers["x-matched-path"] || req.url || "/";
    console.log("[SEO Router] Resolved original path for matching:", urlPath);

    // Extract pathname portion to ignore query params during routing
    const parsedUrl = new URL(urlPath, baseUrl);
    const pathname = parsedUrl.pathname;

    const getTemplateHtml = () => html;

    const seoResult = await handleSEORouting(pathname, baseUrl, getTemplateHtml, googleSiteVerification);

    if (seoResult) {
      // ETag Cache Validation
      if (req.headers["if-none-match"] === seoResult.etag) {
        return res.status(304).end();
      }

      res.setHeader("Cache-Control", seoResult.cacheControl);
      res.setHeader("ETag", seoResult.etag);
      res.setHeader("Content-Type", "text/html");
      return res.status(seoResult.status).send(seoResult.html);
    }

    // Fallback: If nothing matched, send standard page
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);

  } catch (error: any) {
    console.error("Error in SEO router handler:", error);
    return res.status(500).send("Internal Server Error during HTML generation");
  }
}

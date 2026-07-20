import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module path resolution shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all non-serverless handlers with .js extension for ES Module compatibility
import healthHandler from "../server-api/health.js";
import articlesHandler from "../server-api/articles.js";
import newsDigestHandler from "../server-api/news-digest.js";
import robotsHandler from "../server-api/robots.js";
import sitemapHandler from "../server-api/sitemap.js";
import googleVerifyHandler from "../server-api/google-verify.js";
import uploadsHandler from "../server-api/uploads.js";
import assistantHandler from "../server-api/gemini/assistant.js";
import moderateHandler from "../server-api/gemini/moderate.js";
import chatHandler from "../server-api/gemini/chat.js";
import uploadRawHandler from "../server-api/livestream/upload-raw.js";
import uploadHandler from "../server-api/livestream/upload.js";
import frameHandler from "../server-api/livestream/frame.js";
import settingsHandler from "../server-api/livestream/settings.js";
import valasLatestHandler from "../server-api/valas/latest.js";
import supabaseConfigHandler from "../server-api/supabase/config.js";
import sharesHandler from "../server-api/shares.js";
import sharesIncrementHandler from "../server-api/shares/increment.js";
import seoSettingsHandler from "../server-api/seo/settings.js";

import { getSeoSettingsDb } from "../lib/supabase-service.js";
import { handleSEORouting } from "../server/middleware/seo.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Internal API routes mapping
app.all("/api/health", healthHandler);
app.all("/api/supabase/config", supabaseConfigHandler);
app.all("/api/valas/latest", valasLatestHandler);
app.all("/api/news/digest", newsDigestHandler);
app.all("/api/news-digest", newsDigestHandler);
app.all("/api/articles", articlesHandler);
app.all("/api/gemini/assistant", assistantHandler);
app.all("/api/gemini/moderate", moderateHandler);
app.all("/api/gemini/chat", chatHandler);
app.all("/api/livestream/upload-raw", uploadRawHandler);
app.all("/api/livestream/upload", uploadHandler);
app.all("/api/livestream/frame", frameHandler);
app.all("/api/livestream/settings", settingsHandler);
app.all("/api/seo/settings", seoSettingsHandler);
app.all("/api/shares/increment", sharesIncrementHandler);
app.all("/api/shares", sharesHandler);
app.all("/api/uploads", uploadsHandler);
app.all("/uploads/:filename", uploadsHandler);

// SEO Files routes
app.all("/robots.txt", robotsHandler);
app.all("/sitemap.xml", sitemapHandler);
app.all("/google:hash.html", googleVerifyHandler);

// Dynamic/SEO Pages fallback handler
app.all("*", async (req, res) => {
  // Safe exit for unhandled API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, error: `API endpoint ${req.path} not found` });
  }

  try {
    const host = req.headers.host || "www.majalengkapost.web.id";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${protocol}://${host}`;

    // Fetch Google Site Verification code
    let googleSiteVerification = "";
    try {
      const seoSettings = await getSeoSettingsDb();
      googleSiteVerification = seoSettings?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
    } catch (err) {
      googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
    }

    // Read index-template.html
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
          break;
        }
      } catch (err) {
        // Continue trying other paths
      }
    }

    if (!html) {
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

    // Resolve original path
    const urlPath = String(req.headers["x-forwarded-url"] || req.headers["x-matched-path"] || req.url || "/");
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

    // Standard fallback
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (error: any) {
    console.error("Error in SEO fallback handler:", error);
    return res.status(500).send("Internal Server Error during HTML generation");
  }
});

export default app;

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module path resolution shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all non-serverless handlers with .js extension for ES Module compatibility
import healthHandler from "../server-api/health.js";
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
import {
  fetchArticles,
  upsertArticles,
  deleteArticle,
  fetchBanners,
  upsertBanners,
  deleteBanner,
  fetchOpeningBanners,
  upsertOpeningBanners,
  deleteOpeningBanner,
  fetchMediaItems,
  upsertMediaItems,
  deleteMediaItem,
  fetchPoll,
  upsertPoll,
  fetchCompanyProfiles,
  upsertCompanyProfile,
  fetchValasRates,
  upsertValasRates
} from "../lib/db.js";
import { handleSEORouting } from "../server/middleware/seo.js";
import { html as compiledHtml } from "./template.js";

const app = express();

// Restore original request URL from Vercel's rewrite headers or query parameters to allow routing inside Express
app.use((req, res, next) => {
  let originalUrl: string | undefined = undefined;

  // 1. Check if we passed it in custom query parameter (most reliable)
  if (req.query && req.query.__vercel_original_path) {
    originalUrl = String(req.query.__vercel_original_path);
    // Remove the temporary query parameter so it doesn't pollute the route parameters
    delete req.query.__vercel_original_path;
  }

  // 2. Check x-forwarded-url header
  if (!originalUrl && req.headers["x-forwarded-url"]) {
    originalUrl = String(req.headers["x-forwarded-url"]);
  }

  // 3. Fallback to x-matched-path (only if it is not /api/index to avoid loops)
  if (!originalUrl && req.headers["x-matched-path"]) {
    const matched = String(req.headers["x-matched-path"]);
    if (!matched.endsWith("/api/index") && !matched.endsWith("/api/index.ts")) {
      originalUrl = matched;
    }
  }

  if (originalUrl) {
    console.log(`Vercel Rewrite: Original URL restored to: ${originalUrl} (was: ${req.url})`);
    req.url = originalUrl;
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static assets from the compiled "dist" directory
app.use(express.static(path.join(process.cwd(), "dist")));

// Internal API routes mapping
app.all("/api/health", healthHandler);
app.all("/api/debug-fs", (req, res) => {
  const safeReaddir = (dir: string) => {
    try {
      if (fs.existsSync(dir)) {
        return fs.readdirSync(dir);
      }
      return ["Does not exist"];
    } catch (err: any) {
      return ["Error: " + err.message];
    }
  };
  res.json({
    cwd: process.cwd(),
    dirname: __dirname,
    rootFiles: safeReaddir(process.cwd()),
    apiFiles: safeReaddir(path.join(process.cwd(), "api")),
    distFiles: safeReaddir(path.join(process.cwd(), "dist")),
    distAssetsFiles: safeReaddir(path.join(process.cwd(), "dist", "assets")),
    vercelOutputFiles: safeReaddir(path.join(process.cwd(), ".vercel")),
  });
});
app.all("/api/supabase/config", supabaseConfigHandler);
app.all("/api/valas/latest", valasLatestHandler);
app.all("/api/news/digest", newsDigestHandler);
app.all("/api/news-digest", newsDigestHandler);
// Articles API
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await fetchArticles();
    return res.json({ success: true, count: articles.length, articles });
  } catch (err: any) {
    console.error("Error fetching articles in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/articles", async (req, res) => {
  try {
    const { articles } = req.body || {};
    if (!Array.isArray(articles)) {
      return res.status(400).json({ success: false, error: "articles must be an array." });
    }
    await upsertArticles(articles);
    return res.json({ success: true, message: "Articles upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting articles in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/articles/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteArticle(id);
    return res.json({ success: true, message: "Article deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting article in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Banners API
app.get("/api/banners", async (req, res) => {
  try {
    const banners = await fetchBanners();
    return res.json({ success: true, count: banners.length, banners });
  } catch (err: any) {
    console.error("Error fetching banners in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/banners", async (req, res) => {
  try {
    const { banners } = req.body || {};
    if (!Array.isArray(banners)) {
      return res.status(400).json({ success: false, error: "banners must be an array." });
    }
    await upsertBanners(banners);
    return res.json({ success: true, message: "Banners upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting banners in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/banners/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteBanner(id);
    return res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting banner in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Opening Banners API
app.get("/api/opening-banners", async (req, res) => {
  try {
    const banners = await fetchOpeningBanners();
    return res.json({ success: true, count: banners.length, banners });
  } catch (err: any) {
    console.error("Error fetching opening banners in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/opening-banners", async (req, res) => {
  try {
    const { banners } = req.body || {};
    if (!Array.isArray(banners)) {
      return res.status(400).json({ success: false, error: "banners must be an array." });
    }
    await upsertOpeningBanners(banners);
    return res.json({ success: true, message: "Opening banners upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting opening banners in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/opening-banners/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteOpeningBanner(id);
    return res.json({ success: true, message: "Opening banner deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting opening banner in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Media API
app.get("/api/media", async (req, res) => {
  try {
    const media = await fetchMediaItems();
    return res.json({ success: true, count: media.length, media });
  } catch (err: any) {
    console.error("Error fetching media items in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/media", async (req, res) => {
  try {
    const { media } = req.body || {};
    if (!Array.isArray(media)) {
      return res.status(400).json({ success: false, error: "media must be an array." });
    }
    await upsertMediaItems(media);
    return res.json({ success: true, message: "Media items upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting media items in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/media/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteMediaItem(id);
    return res.json({ success: true, message: "Media item deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting media item in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Polls API
app.get("/api/polls", async (req, res) => {
  try {
    const poll = await fetchPoll();
    return res.json({ success: true, poll });
  } catch (err: any) {
    console.error("Error fetching poll in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/polls", async (req, res) => {
  try {
    const { poll } = req.body || {};
    if (!poll) {
      return res.status(400).json({ success: false, error: "poll object is required." });
    }
    await upsertPoll(poll);
    return res.json({ success: true, message: "Poll upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting poll in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Company Info / Profiles API
app.get(["/api/company-info", "/api/company-profiles"], async (req, res) => {
  try {
    const profiles = await fetchCompanyProfiles();
    return res.json({ success: true, count: profiles.length, profiles });
  } catch (err: any) {
    console.error("Error fetching company profiles in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post(["/api/company-info", "/api/company-profiles"], async (req, res) => {
  try {
    const { profile } = req.body || {};
    if (!profile) {
      return res.status(400).json({ success: false, error: "profile object is required." });
    }
    await upsertCompanyProfile(profile);
    return res.json({ success: true, message: "Company profile upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting company profile in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Valas Rates API
app.post("/api/valas/rates", async (req, res) => {
  try {
    const { rates } = req.body || {};
    if (!Array.isArray(rates)) {
      return res.status(400).json({ success: false, error: "rates must be an array." });
    }
    await upsertValasRates(rates);
    return res.json({ success: true, message: "Valas rates upserted successfully" });
  } catch (err: any) {
    console.error("Error upserting valas rates in serverless API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
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

// Static Public & Dist Assets (PWA Icons, Manifest, SW, Images)
app.get([
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/favicon.png",
  "/manifest.json",
  "/sw.js",
  "/logo.jpg",
  "/default-news.jpg",
  "/default-share.jpg"
], (req, res) => {
  const filename = path.basename(req.path);
  const possiblePaths = [
    path.join(process.cwd(), "public", filename),
    path.join(process.cwd(), "dist", filename),
    path.join(__dirname, "..", "public", filename),
    path.join(__dirname, "..", "dist", filename)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      if (filename.endsWith(".json")) res.setHeader("Content-Type", "application/json");
      else if (filename.endsWith(".png")) res.setHeader("Content-Type", "image/png");
      else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) res.setHeader("Content-Type", "image/jpeg");
      else if (filename.endsWith(".ico")) res.setHeader("Content-Type", "image/x-icon");
      else if (filename.endsWith(".js")) res.setHeader("Content-Type", "application/javascript");
      return res.sendFile(p);
    }
  }
  return res.status(404).send("File not found");
});

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
    let html = compiledHtml || "";
    const pathAttempts: string[] = [];

    if (!html) {
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
          const exists = fs.existsSync(p);
          pathAttempts.push(`${p} (${exists ? "EXISTS" : "MISSING"})`);
          if (exists) {
            html = fs.readFileSync(p, "utf-8");
            console.log(`Successfully loaded HTML template from file: ${p}`);
            break;
          }
        } catch (err: any) {
          pathAttempts.push(`${p} (ERROR: ${err.message})`);
        }
      }
    } else {
      console.log("Successfully loaded HTML template from compiled build-time template.");
    }

    if (!html) {
      console.warn("Could not find index-template.html in compiled template or any of the paths. Attempts: " + JSON.stringify(pathAttempts));
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
    const urlPath = String(req.headers["x-forwarded-url"] || req.url || "/");
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

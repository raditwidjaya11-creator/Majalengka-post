import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import http from "http";
import { WebSocketServer, WebSocket as WSWebSocket } from "ws";
import { createServer as createViteServer } from "vite";
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
} from "./lib/db";
import { runAssistantCommand } from "./services/assistant";
import { runChatAI } from "./services/chat";
import { moderateComment } from "./services/moderate";
import { generateNewsDigest } from "./services/newsDigest";
import newsDigestHandler from "./server-api/news-digest";
import { getLatestRates } from "./services/valas";
import valasLatestHandler from "./server-api/valas/latest";
import { slugify, injectSEOMetadata, injectGeneralSEOMetadata, generateSitemapXML, generateRobotsTxt } from "./services/seo";
import { handleSEORouting } from "./server/middleware/seo";
import {
  UPLOADS_DIR,
  getUploadFilePath,
  getLiveCameraFrame,
  setLiveCameraFrame
} from "./lib/vercel-storage";
import {
  getLiveStreamSettingsDb,
  updateLiveStreamSettingsDb,
  getShareCountsDb,
  incrementShareCountDb,
  uploadVideoDb,
  getSeoSettingsDb,
  updateSeoSettingsDb
} from "./lib/supabase-service";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve public directory static assets (manifest, icons, images)
app.use(express.static(path.join(process.cwd(), "public"), { maxAge: "1d" }));

// Helper to determine the current protocol and host for local or deployment environments
function getBaseUrl(req: express.Request): string {
  const host = req.headers.host || `localhost:${PORT}`;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  return `${protocol}://${host}`;
}

// ==========================
// API ROUTES
// ==========================

// 1. Assistant Editorial Route
app.post("/api/gemini/assistant", async (req, res) => {
  const { action, text, options } = req.body || {};
  if (!text) {
    return res.status(400).json({ success: false, error: "Text is required." });
  }
  try {
    const result = await runAssistantCommand(action, text, options);
    return res.json(result);
  } catch (err: any) {
    console.error("Error in local assistant API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 1b. Chat AI Route
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: "Messages array is required." });
  }
  try {
    const result = await runChatAI(messages);
    return res.json(result);
  } catch (err: any) {
    console.error("Error in local chat AI API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Comments Moderation
app.post("/api/gemini/moderate", async (req, res) => {
  const { commentText } = req.body || {};
  if (!commentText) {
    return res.status(400).json({ success: false, error: "Comment text is required." });
  }
  try {
    const result = await moderateComment(commentText);
    return res.json(result);
  } catch (err: any) {
    console.error("Error in local moderation API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. News Digest
app.get(["/api/news/digest", "/api/news-digest"], newsDigestHandler);

// 4. Kurs Valas Rates
app.get("/api/valas/latest", valasLatestHandler);

// 5. Health Check
app.get("/api/health", (req, res) => {
  return res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// 5b. Supabase Runtime Config Delivery
app.get("/api/supabase/config", (req, res) => {
  return res.json({
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  });
});

// 6. Fetch Articles
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await fetchArticles();
    return res.json({ success: true, count: articles.length, articles });
  } catch (err: any) {
    console.error("Error in local articles API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6a. Upsert Articles
app.post("/api/articles", async (req, res) => {
  try {
    const { articles } = req.body || {};
    if (!Array.isArray(articles)) {
      return res.status(400).json({ success: false, error: "articles must be an array." });
    }
    await upsertArticles(articles);
    return res.json({ success: true, message: "Articles upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert articles API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6b. Delete Article
app.post("/api/articles/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteArticle(id);
    return res.json({ success: true, message: "Article deleted successfully" });
  } catch (err: any) {
    console.error("Error in delete article API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6c. Fetch Banners
app.get("/api/banners", async (req, res) => {
  try {
    const banners = await fetchBanners();
    return res.json({ success: true, count: banners.length, banners });
  } catch (err: any) {
    console.error("Error in fetch banners API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6d. Upsert Banners
app.post("/api/banners", async (req, res) => {
  try {
    const { banners } = req.body || {};
    if (!Array.isArray(banners)) {
      return res.status(400).json({ success: false, error: "banners must be an array." });
    }
    await upsertBanners(banners);
    return res.json({ success: true, message: "Banners upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert banners API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6e. Delete Banner
app.post("/api/banners/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteBanner(id);
    return res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err: any) {
    console.error("Error in delete banner API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6f. Fetch Opening Banners
app.get("/api/opening-banners", async (req, res) => {
  try {
    const banners = await fetchOpeningBanners();
    return res.json({ success: true, count: banners.length, banners });
  } catch (err: any) {
    console.error("Error in fetch opening banners API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6g. Upsert Opening Banners
app.post("/api/opening-banners", async (req, res) => {
  try {
    const { banners } = req.body || {};
    if (!Array.isArray(banners)) {
      return res.status(400).json({ success: false, error: "banners must be an array." });
    }
    await upsertOpeningBanners(banners);
    return res.json({ success: true, message: "Opening banners upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert opening banners API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6h. Delete Opening Banner
app.post("/api/opening-banners/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteOpeningBanner(id);
    return res.json({ success: true, message: "Opening banner deleted successfully" });
  } catch (err: any) {
    console.error("Error in delete opening banner API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6f. Fetch Media Items
app.get("/api/media", async (req, res) => {
  try {
    const media = await fetchMediaItems();
    return res.json({ success: true, count: media.length, media });
  } catch (err: any) {
    console.error("Error in fetch media API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6g. Upsert Media Items
app.post("/api/media", async (req, res) => {
  try {
    const { media } = req.body || {};
    if (!Array.isArray(media)) {
      return res.status(400).json({ success: false, error: "media must be an array." });
    }
    await upsertMediaItems(media);
    return res.json({ success: true, message: "Media items upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert media API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6h. Delete Media Item
app.post("/api/media/delete", async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required." });
    }
    await deleteMediaItem(id);
    return res.json({ success: true, message: "Media item deleted successfully" });
  } catch (err: any) {
    console.error("Error in delete media API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6i. Fetch Active Poll
app.get("/api/polls", async (req, res) => {
  try {
    const poll = await fetchPoll();
    return res.json({ success: true, poll });
  } catch (err: any) {
    console.error("Error in fetch poll API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6j. Upsert Poll
app.post("/api/polls", async (req, res) => {
  try {
    const { poll } = req.body || {};
    if (!poll) {
      return res.status(400).json({ success: false, error: "poll object is required." });
    }
    await upsertPoll(poll);
    return res.json({ success: true, message: "Poll upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert poll API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6k. Fetch Company Info / Profiles
app.get("/api/company-info", async (req, res) => {
  try {
    const profiles = await fetchCompanyProfiles();
    return res.json({ success: true, count: profiles.length, profiles });
  } catch (err: any) {
    console.error("Error in fetch company info API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6l. Upsert Company Profile Item
app.post("/api/company-info", async (req, res) => {
  try {
    const { profile } = req.body || {};
    if (!profile) {
      return res.status(400).json({ success: false, error: "profile object is required." });
    }
    await upsertCompanyProfile(profile);
    return res.json({ success: true, message: "Company profile upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert company info API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6m. Upsert Valas Rates
app.post("/api/valas/rates", async (req, res) => {
  try {
    const { rates } = req.body || {};
    if (!Array.isArray(rates)) {
      return res.status(400).json({ success: false, error: "rates must be an array." });
    }
    await upsertValasRates(rates);
    return res.json({ success: true, message: "Valas rates upserted successfully" });
  } catch (err: any) {
    console.error("Error in upsert valas rates API:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Persistent Share Counts Service
app.get("/api/shares", async (req, res) => {
  try {
    const shares = await getShareCountsDb();
    return res.json({ success: true, shares });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/shares/increment", async (req, res) => {
  const { articleId, platform } = req.body || {};
  if (!articleId || !platform) {
    return res.status(400).json({ success: false, error: "articleId and platform are required." });
  }
  try {
    const shares = await incrementShareCountDb(articleId, platform);
    return res.json({ success: true, shares });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
// ==========================
// 8. Persistent Live Streaming & Real Camera Sync Service
// ==========================

// GET Live Stream Settings
app.get("/api/livestream/settings", async (req, res) => {
  try {
    const settings = await getLiveStreamSettingsDb();
    return res.json({ success: true, settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST Update Live Stream Settings
app.post("/api/livestream/settings", async (req, res) => {
  try {
    const updated = await updateLiveStreamSettingsDb(req.body);
    return res.json({ success: true, settings: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET SEO Settings
app.get("/api/seo/settings", async (req, res) => {
  try {
    const settings = await getSeoSettingsDb();
    return res.json({ success: true, settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST Update SEO Settings
app.post("/api/seo/settings", async (req, res) => {
  try {
    const updated = await updateSeoSettingsDb(req.body);
    return res.json({ success: true, settings: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST Broadcast Live Camera Frame (Webcam)
app.post("/api/livestream/frame", (req, res) => {
  const { frame } = req.body || {};
  if (frame === undefined) {
    return res.status(400).json({ success: false, error: "frame body parameter is required" });
  }
  try {
    setLiveCameraFrame(frame);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET Current Live Camera Frame (Webcam)
app.get("/api/livestream/frame", (req, res) => {
  try {
    return res.json({ success: true, frame: getLiveCameraFrame() });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Create uploads directory and serve statically
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create UPLOADS_DIR:", err);
  }
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Dynamic endpoint to guarantee serving of files on serverless setups like Vercel
app.get("/uploads/:filename", (req, res) => {
  try {
    const safeFilename = path.basename(req.params.filename);
    const filePath = getUploadFilePath(safeFilename);
    if (filePath && fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    const ext = path.extname(safeFilename).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".webp" || ext === ".gif" || ext === ".svg") {
      return res.redirect("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800");
    }
    return res.status(404).send("File not found");
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
});

// POST Upload Livestream Video (Base64 fallback)
app.post("/api/livestream/upload", async (req, res) => {
  const { videoData, fileName } = req.body || {};
  if (!videoData || !fileName) {
    return res.status(400).json({ success: false, error: "videoData (base64) and fileName are required" });
  }
  try {
    const base64Data = videoData.replace(/^data:video\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Try Supabase Storage upload
    try {
      const publicUrl = await uploadVideoDb(buffer, fileName, "video/mp4");
      if (publicUrl) {
        return res.json({ success: true, url: publicUrl });
      }
    } catch (dbErr: any) {
      console.warn("[Express Server Upload] Supabase storage upload failed, falling back to local files:", dbErr.message || dbErr);
    }

    // Local fallback
    const ext = path.extname(fileName) || ".mp4";
    const baseName = "stream_video_" + Date.now() + ext;
    const targetPath = path.join(UPLOADS_DIR, baseName);
    
    fs.writeFileSync(targetPath, buffer);
    const fileUrl = `/uploads/${baseName}`;
    return res.json({ success: true, url: fileUrl, note: "Uploaded to local fallback filesystem." });
  } catch (err: any) {
    console.error("Video upload error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST Upload Livestream Video (Raw Binary, fast & efficient for large files up to 100MB)
app.post("/api/livestream/upload-raw", express.raw({ type: "*/*", limit: "100mb" }), async (req, res) => {
  try {
    const rawFileNameHeader = req.headers["x-file-name"] as string;
    const fileName = rawFileNameHeader ? decodeURIComponent(rawFileNameHeader) : "stream_video.mp4";
    
    if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ success: false, error: "No video stream content received" });
    }

    // Try Supabase Storage upload
    try {
      const publicUrl = await uploadVideoDb(req.body, fileName, "video/mp4");
      if (publicUrl) {
        return res.json({ success: true, url: publicUrl });
      }
    } catch (dbErr: any) {
      console.warn("[Express Server Upload Raw] Supabase storage upload failed, falling back to local files:", dbErr.message || dbErr);
    }

    // Local fallback
    const ext = path.extname(fileName) || ".mp4";
    const baseName = "stream_video_" + Date.now() + ext;
    const targetPath = path.join(UPLOADS_DIR, baseName);
    
    fs.writeFileSync(targetPath, req.body);
    const fileUrl = `/uploads/${baseName}`;
    return res.json({ success: true, url: fileUrl, note: "Uploaded to local fallback filesystem." });
  } catch (err: any) {
    console.error("Raw video upload error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
// MIDDLEWARES & STATICS
// ==========================

async function startServer() {
  let vite: any = null;

  // SEO: robots.txt
  app.get("/robots.txt", (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.type("text/plain");
    res.send(generateRobotsTxt(baseUrl));
  });

  // SEO: sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = getBaseUrl(req);
      const xml = await generateSitemapXML(baseUrl);
      res.type("application/xml");
      res.send(xml);
    } catch (err: any) {
      console.error("Error in local sitemap.xml route:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Dedicated Explicit Route for /artikel/:slug
  app.get("/artikel/:slug", async (req, res, next) => {
    try {
      const slug = decodeURIComponent(req.params.slug);
      const baseUrl = getBaseUrl(req);
      
      // Query the database/Supabase for the article
      const articlesList = await fetchArticles();
      const article = articlesList.find((art: any) => slugify(art.title) === slug);

      if (!article) {
        return next(); // Fallback to index.html or 404
      }

      // Parse article details
      const title = article.seo?.title ? `${article.seo.title} | Majalengka Post` : `${article.title} | Majalengka Post`;
      const summary = article.seo?.description || article.summary || "Berita terpercaya dari Majalengka Post.";
      const author = article.author || "Redaksi Majalengka Post";
      const date = article.date ? new Date(article.date).toISOString() : new Date().toISOString();
      const keywords = article.seo?.keywords || (Array.isArray(article.tags) ? article.tags.join(", ") : "") || "majalengka, berita, majalengka post";
      
      let image = article.coverImage;
      if (!image || image.trim() === "") {
        image = `${baseUrl}/default-news.jpg`;
      } else if (!image.startsWith("http")) {
        const cleanPath = image.startsWith("/") ? image : `/${image}`;
        image = `${baseUrl}${cleanPath}`;
      }

      // Read template string
      let rawHtml = "";
      if (process.env.NODE_ENV !== "production" && vite) {
        const rawHtmlFile = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        rawHtml = await vite.transformIndexHtml(req.url, rawHtmlFile);
      } else {
        const prodTemplatePath = path.join(process.cwd(), "dist", "index.html");
        if (fs.existsSync(prodTemplatePath)) {
          rawHtml = fs.readFileSync(prodTemplatePath, "utf-8");
        } else {
          rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        }
      }

      // Generate meta tags
      const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${summary}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="canonical" href="${baseUrl}/artikel/${slug}" />
      `;

      // Generate Open Graph and Twitter Card tags
      let imageType = "image/jpeg";
      if (image.toLowerCase().endsWith(".png")) {
        imageType = "image/png";
      } else if (image.toLowerCase().endsWith(".webp")) {
        imageType = "image/webp";
      }

      const ogTags = `
    <!-- Schema.org / Microdata (WhatsApp Fallback) -->
    <meta itemprop="name" content="${title}" />
    <meta itemprop="description" content="${summary}" />
    <meta itemprop="image" content="${image}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Majalengka Post" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${summary}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:url" content="${baseUrl}/artikel/${slug}" />
    <meta property="og:locale" content="id_ID" />
    <meta property="article:published_time" content="${date}" />
    <meta property="article:modified_time" content="${date}" />
    <meta property="article:author" content="${author}" />
    <meta property="article:section" content="${article.category || "Berita"}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${summary}" />
    <meta name="twitter:image" content="${image}" />
      `;

      // Generate JSON-LD Schema
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "image": [image],
        "datePublished": date,
        "dateModified": date,
        "author": [{
          "@type": "Person",
          "name": author,
          "url": `${baseUrl}/artikel/${slug}`
        }],
        "publisher": {
          "@type": "Organization",
          "name": "Majalengka Post",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.jpg`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/artikel/${slug}`
        }
      };

      const jsonLd = `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
      `;

      // Fetch Google Site Verification code
      let googleSiteVerification = "";
      try {
        const seoSettings = await getSeoSettingsDb();
        googleSiteVerification = seoSettings?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
      } catch (err) {
        googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
      }
      const verifyTag = googleSiteVerification ? `\n    <meta name="google-site-verification" content="${googleSiteVerification}" />` : "";

      const combinedTags = `${metaTags}${ogTags}${jsonLd}${verifyTag}`;

      // Inject metadata tags manually by string replacement
      let processedHtml = rawHtml.replace(/<title>.*?<\/title>/gi, "");
      processedHtml = processedHtml.replace(/<html([^>]*)>/gi, (match, p1) => {
        let attrs = p1;
        if (!attrs.includes("lang=")) {
          attrs += ' lang="id"';
        } else {
          attrs = attrs.replace(/lang="[^"]*"/gi, 'lang="id"');
        }
        if (!attrs.includes("prefix=")) {
          attrs += ' prefix="og: https://ogp.me/ns#"';
        }
        return `<html${attrs}>`;
      });
      processedHtml = processedHtml.replace("</head>", `${combinedTags}\n</head>`);

      // Compute ETag
      const hash = crypto.createHash("sha1").update(processedHtml).digest("base64");
      const etag = `W/"${hash}"`;

      // ETag Validation
      if (req.headers["if-none-match"] === etag) {
        return res.status(304).end();
      }

      // Cache control header: Always revalidate, but allow public CDNs to cache
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      res.setHeader("ETag", etag);
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(processedHtml);

    } catch (err) {
      console.error("[Explicit Artikel Route Error] Failed rendering page:", err);
      next();
    }
  });

  // SEO Pages Route with ETag and Cache-Control
  app.get([
    "/",
    "/berita/:slug",
    "/kategori/:name",
    "/terms",
    "/privacy-policy"
  ], async (req, res, next) => {
    try {
      const baseUrl = getBaseUrl(req);
      const urlPath = req.path;
      
      // Fetch Google Site Verification code
      let googleSiteVerification = "";
      try {
        const seoSettings = await getSeoSettingsDb();
        googleSiteVerification = seoSettings?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
      } catch (err) {
        googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION || process.env.VITE_GOOGLE_SITE_VERIFICATION || "";
      }

      const getTemplateHtml = async () => {
        if (process.env.NODE_ENV !== "production" && vite) {
          const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
          return await vite.transformIndexHtml(req.url, rawHtml);
        } else {
          const prodTemplatePath = path.join(process.cwd(), "dist", "index.html");
          if (fs.existsSync(prodTemplatePath)) {
            return fs.readFileSync(prodTemplatePath, "utf-8");
          }
          return "";
        }
      };

      const seoResult = await handleSEORouting(urlPath, baseUrl, getTemplateHtml, googleSiteVerification);

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
    } catch (err) {
      console.error("[SEO Middleware Error] Failed rendering page:", err);
    }
    next();
  });

  // Manage live chat messages in memory for both WebSocket and HTTP REST polling fallback
  const globalChatHistory: Array<{
    id: number;
    name: string;
    text: string;
    time: string;
    likes?: number;
    replyTo?: { id: number; name: string; text: string };
  }> = [
    { id: 1, name: "Ahmad_Majalengka", text: "Selamat pagi Majalengka Post! Terus suarakan berita kredibel.", time: "09:00", likes: 3 },
    { id: 2, name: "Siti_Jatiwangi", text: "Kondisi cuaca di Jatiwangi hari ini sangat cerah, salam hangat.", time: "09:01", likes: 1 },
    { id: 3, name: "Budi_Kadipaten", text: "Kabar Tol Cipali seksi Kertajati bagaimana ya?", time: "09:02", likes: 0 },
    { id: 4, name: "Rina_Talaga", text: "Menunggu liputan langsung dari lokasi bencana.", time: "09:03", likes: 2, replyTo: { id: 3, name: "Budi_Kadipaten", text: "Kabar Tol Cipali seksi Kertajati bagaimana ya?" } }
  ];

  let activeViewersCount = 1340;

  // GET Live Chat History & Viewers (HTTP REST Polling fallback)
  app.get("/api/live-chat", (req, res) => {
    return res.json({
      success: true,
      history: globalChatHistory,
      viewers: activeViewersCount
    });
  });

  // POST New Live Chat Message (HTTP REST)
  app.post("/api/live-chat/message", (req, res) => {
    const { name, text, replyTo } = req.body || {};
    if (!text) {
      return res.status(400).json({ success: false, error: "Teks pesan diperlukan" });
    }

    const timeNow = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const newChat = {
      id: Date.now(),
      name: (name || "Anonim").trim().substring(0, 30),
      text: String(text).trim().substring(0, 500),
      time: timeNow,
      likes: 0,
      replyTo: replyTo ? {
        id: Number(replyTo.id),
        name: String(replyTo.name).trim().substring(0, 30),
        text: String(replyTo.text).trim().substring(0, 150)
      } : undefined
    };

    globalChatHistory.push(newChat);
    if (globalChatHistory.length > 100) {
      globalChatHistory.shift();
    }

    return res.json({ success: true, chat: newChat });
  });

  // POST Like Live Chat Message (HTTP REST)
  app.post("/api/live-chat/like", (req, res) => {
    const { msgId } = req.body || {};
    const target = globalChatHistory.find(c => c.id === Number(msgId));
    if (target) {
      target.likes = (target.likes || 0) + 1;
      return res.json({ success: true, msgId: target.id, likes: target.likes });
    }
    return res.status(404).json({ success: false, error: "Pesan tidak ditemukan" });
  });

  // Setup Hot Module Replacement/Middleware or Production static serving
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Vite] Development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[Express] Production static server loaded from dist.");
  }

  if (!process.env.VERCEL) {
    const server = http.createServer(app);

    // Setup WebSocket Server for real-time live chat
    const wss = new WebSocketServer({ noServer: true });

    // Track active connection count
    let activeWSConnections = 0;

    wss.on("connection", (ws) => {
      activeWSConnections++;
      activeViewersCount = 1340 + activeWSConnections;

      // Send initial history and viewer counts to client
      ws.send(JSON.stringify({ type: "init", history: globalChatHistory, viewers: activeViewersCount }));

      // Broadcast updated viewers to all clients
      broadcast({ type: "viewers", viewers: activeViewersCount });

      ws.on("message", (messageData) => {
        try {
          const parsed = JSON.parse(messageData.toString());
          if (parsed.type === "message" && parsed.text && parsed.name) {
            const timeNow = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
            const newChat = {
              id: Date.now(),
              name: parsed.name.trim().substring(0, 30) || "Anonim",
              text: parsed.text.trim().substring(0, 500),
              time: timeNow,
              likes: 0,
              replyTo: parsed.replyTo ? {
                id: Number(parsed.replyTo.id),
                name: String(parsed.replyTo.name).trim().substring(0, 30),
                text: String(parsed.replyTo.text).trim().substring(0, 150)
              } : undefined
            };

            globalChatHistory.push(newChat);
            if (globalChatHistory.length > 100) {
              globalChatHistory.shift();
            }

            broadcast({ type: "message", chat: newChat });
          } else if (parsed.type === "like" && parsed.msgId) {
            const target = globalChatHistory.find(c => c.id === Number(parsed.msgId));
            if (target) {
              target.likes = (target.likes || 0) + 1;
              broadcast({ type: "like", msgId: target.id, likes: target.likes });
            }
          } else if (parsed.type === "reaction" && parsed.emoji) {
            broadcast({ type: "reaction", emoji: parsed.emoji, id: Date.now() + Math.random() });
          }
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      });

      ws.on("close", () => {
        activeWSConnections = Math.max(0, activeWSConnections - 1);
        activeViewersCount = 1340 + activeWSConnections;
        broadcast({ type: "viewers", viewers: activeViewersCount });
      });
    });

    function broadcast(data: any) {
      const payload = JSON.stringify(data);
      wss.clients.forEach((client) => {
        if (client.readyState === WSWebSocket.OPEN) {
          client.send(payload);
        }
      });
    }

    server.on("upgrade", (request, socket, head) => {
      const upgradeHeader = request.headers.upgrade ? String(request.headers.upgrade).toLowerCase() : "";
      if (upgradeHeader === "websocket") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Express & WebSocket server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;


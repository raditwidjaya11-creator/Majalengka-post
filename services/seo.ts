import fs from "fs";
import path from "path";
import { fetchArticles } from "../lib/db.js";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function injectSEOMetadata(html: string, article: any, baseUrl: string, googleSiteVerification?: string) {
  const slug = slugify(article.title);
  const articleUrl = `${baseUrl}/artikel/${slug}`;
  const title = `${article.title} | Majalengka Post`;
  const description = article.summary || article.subTitle || "Berita terpercaya dari Majalengka Post.";
  const keywords = (article.seo?.keywords || (Array.isArray(article.tags) ? article.tags.join(", ") : "") || "majalengka, berita, majalengka post");
  
  // Thumbnail handling
  let imageUrl = article.coverImage;
  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl = `${baseUrl}/default-share.jpg`; // Fallback
  } else if (!imageUrl.startsWith("http")) {
    const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    imageUrl = `${baseUrl}${cleanPath}`;
  }

  let imageType = "image/jpeg";
  if (imageUrl.toLowerCase().endsWith(".png")) {
    imageType = "image/png";
  } else if (imageUrl.toLowerCase().endsWith(".webp")) {
    imageType = "image/webp";
  } else if (imageUrl.toLowerCase().endsWith(".gif")) {
    imageType = "image/gif";
  }

  const imageWidth = "1200";
  const imageHeight = "630";

  const authorName = article.author || "Redaksi Majalengka Post";
  const datePublished = article.date ? new Date(article.date).toISOString() : new Date().toISOString();
  
  // Custom SEO tags from article if they exist
  const finalTitle = article.seo?.title ? `${article.seo.title} | Majalengka Post` : title;
  const finalDescription = article.seo?.description || description;

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [imageUrl],
    "datePublished": datePublished,
    "dateModified": datePublished,
    "author": [{
      "@type": "Person",
      "name": authorName,
      "url": baseUrl
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
      "@id": articleUrl
    }
  };

  const verificationTag = googleSiteVerification ? `\n    <meta name="google-site-verification" content="${googleSiteVerification}" />` : "";

  const seoMetaTags = `
    <title>${finalTitle}</title>
    <meta name="description" content="${finalDescription}" />
    <meta name="keywords" content="${keywords}" />
    <link rel="canonical" href="${articleUrl}" />${verificationTag}
    
    <!-- Schema.org / Microdata (WhatsApp Fallback) -->
    <meta itemprop="name" content="${finalTitle}" />
    <meta itemprop="description" content="${finalDescription}" />
    <meta itemprop="image" content="${imageUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Majalengka Post" />
    <meta property="og:title" content="${finalTitle}" />
    <meta property="og:description" content="${finalDescription}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="${imageWidth}" />
    <meta property="og:image:height" content="${imageHeight}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:locale" content="id_ID" />
    <meta property="article:published_time" content="${datePublished}" />
    <meta property="article:modified_time" content="${datePublished}" />
    <meta property="article:author" content="${authorName}" />
    <meta property="article:section" content="${article.category || "Berita"}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${finalTitle}" />
    <meta name="twitter:description" content="${finalDescription}" />
    <meta name="twitter:image" content="${imageUrl}" />

    <!-- Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  `;

  // Remove existing title tag if any to avoid duplicates
  let processedHtml = html.replace(/<title>.*?<\/title>/gi, "");
  
  // Add prefix and lang to html tag for Open Graph parse rate on Facebook/WhatsApp
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
  
  // Inject into <head>
  processedHtml = processedHtml.replace("</head>", `${seoMetaTags}\n</head>`);
  
  return processedHtml;
}

export function injectGeneralSEOMetadata(
  html: string, 
  baseUrl: string, 
  googleSiteVerification?: string,
  options?: { title?: string; description?: string; path?: string; imageUrl?: string }
) {
  const title = options?.title || "Majalengka Post - Portal Berita Terpercaya";
  const description = options?.description || "Majalengka Post menyajikan berita terkini, akurat, dan terpercaya seputar Majalengka, Jawa Barat, Nasional, Politik, dan Ekonomi.";
  const pathPart = options?.path || "";
  const canonicalUrl = `${baseUrl}${pathPart.startsWith("/") ? pathPart : "/" + pathPart}`;
  
  let imageUrl = options?.imageUrl || `${baseUrl}/default-share.jpg`;
  if (!imageUrl.startsWith("http")) {
    const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    imageUrl = `${baseUrl}${cleanPath}`;
  }

  let imageType = "image/jpeg";
  if (imageUrl.toLowerCase().endsWith(".png")) {
    imageType = "image/png";
  } else if (imageUrl.toLowerCase().endsWith(".webp")) {
    imageType = "image/webp";
  }

  const imageWidth = "1200";
  const imageHeight = "630";

  const verificationTag = googleSiteVerification ? `\n    <meta name="google-site-verification" content="${googleSiteVerification}" />` : "";

  const seoMetaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />${verificationTag}
    
    <!-- Schema.org / Microdata (WhatsApp Fallback) -->
    <meta itemprop="name" content="${title}" />
    <meta itemprop="description" content="${description}" />
    <meta itemprop="image" content="${imageUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Majalengka Post" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="${imageWidth}" />
    <meta property="og:image:height" content="${imageHeight}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:locale" content="id_ID" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;

  let processedHtml = html.replace(/<title>.*?<\/title>/gi, "");
  
  // Add prefix and lang to html tag for Open Graph parse rate on Facebook/WhatsApp
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

  processedHtml = processedHtml.replace("</head>", `${seoMetaTags}\n</head>`);
  return processedHtml;
}

export async function generateSitemapXML(baseUrl: string): Promise<string> {
  const articlesList = await fetchArticles();
  
  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Add categories
  const categories = ["Nasional", "Politik", "Pemerintahan", "Daerah", "Hukum", "Kriminal", "Ekonomi", "Bisnis", "Teknologi", "Religi"];
  categories.forEach(cat => {
    sitemapIndex += `  <url>
    <loc>${baseUrl}/?kategori=${encodeURIComponent(cat.toLowerCase())}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  // Add articles
  articlesList.forEach((art: any) => {
    const slug = slugify(art.title);
    sitemapIndex += `  <url>
    <loc>${baseUrl}/artikel/${slug}</loc>
    <lastmod>${art.date || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  sitemapIndex += `</urlset>`;
  return sitemapIndex;
}

export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
}

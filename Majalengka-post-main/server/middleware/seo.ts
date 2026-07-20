import crypto from "crypto";
import { fetchArticles } from "../../lib/db.js";
import { slugify } from "../utils/slugify.js";
import { generateMetaTags } from "../seo/meta.js";
import { generateOpenGraphTags } from "../seo/open-graph.js";
import { generateNewsArticleJsonLd, generateWebSiteJsonLd } from "../seo/json-ld.js";
import { injectMetadataToTemplate } from "../template/html.js";

// Generate ETag helper for caching
export function generateETag(content: string): string {
  const hash = crypto.createHash("sha1").update(content).digest("base64");
  return `W/"${hash}"`;
}

export interface SEORouteResult {
  status: number;
  html: string;
  etag: string;
  cacheControl: string;
}

/**
 * Common router function that processes incoming request paths and generates SEO-optimized HTML.
 * Used by both local Express server and Vercel serverless handlers.
 */
export async function handleSEORouting(
  urlPath: string,
  baseUrl: string,
  getTemplateHtml: () => string | Promise<string>,
  googleSiteVerification?: string
): Promise<SEORouteResult | null> {
  const rawHtml = await getTemplateHtml();
  if (!rawHtml) {
    return null;
  }

  // Set default cache headers: Always revalidate, but allow public CDNs to cache
  const defaultCacheControl = "public, max-age=0, must-revalidate";

  // 1. Article matching: /artikel/:slug or /berita/:slug
  const articleMatch = urlPath.match(/^\/(artikel|berita)\/([^/?#]+)/);
  if (articleMatch) {
    const slug = decodeURIComponent(articleMatch[2]);
    const articlesList = await fetchArticles();
    const article = articlesList.find((art: any) => slugify(art.title) === slug);

    if (article) {
      const articleUrl = `${baseUrl}/artikel/${slug}`;
      const title = article.seo?.title ? `${article.seo.title} | Majalengka Post` : `${article.title} | Majalengka Post`;
      const description = article.seo?.description || article.summary || article.subTitle || "Berita terpercaya dari Majalengka Post.";
      const keywords = article.seo?.keywords || (Array.isArray(article.tags) ? article.tags.join(", ") : "") || "majalengka, berita, majalengka post";
      const authorName = article.author || "Redaksi Majalengka Post";
      const datePublished = article.date ? new Date(article.date).toISOString() : new Date().toISOString();
      
      // Fallback news sharing image
      let imageUrl = article.coverImage;
      if (!imageUrl || imageUrl.trim() === "") {
        imageUrl = `${baseUrl}/default-news.jpg`;
      } else if (!imageUrl.startsWith("http")) {
        const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
        imageUrl = `${baseUrl}${cleanPath}`;
      }

      // 1. Core Meta Tags
      const metaTags = generateMetaTags({
        title,
        description,
        canonicalUrl: articleUrl,
        keywords,
        author: authorName,
      });

      // 2. Open Graph & Twitter Card Tags
      const ogTags = generateOpenGraphTags({
        title,
        description,
        url: articleUrl,
        imageUrl,
        type: "article",
        siteName: "Majalengka Post",
        publishedTime: datePublished,
        authorName,
        section: article.category || "Berita",
        tags: Array.isArray(article.tags) ? article.tags : [],
      });

      // 3. Schema.org NewsArticle JSON-LD
      const jsonLd = generateNewsArticleJsonLd({
        headline: article.title,
        imageUrl,
        datePublished,
        dateModified: datePublished,
        authorName,
        articleUrl,
        publisherLogoUrl: `${baseUrl}/logo.jpg`,
      });

      // Verification tag
      const verifyTag = googleSiteVerification ? `\n    <meta name="google-site-verification" content="${googleSiteVerification}" />` : "";

      // Combine tags
      const combinedTags = `${metaTags}${ogTags}${jsonLd}${verifyTag}`;
      const completeHtml = injectMetadataToTemplate(rawHtml, combinedTags);
      const etag = generateETag(completeHtml);

      return {
        status: 200,
        html: completeHtml,
        etag,
        cacheControl: defaultCacheControl,
      };
    }
  }

  // 2. Category matching: /kategori/:name
  const categoryMatch = urlPath.match(/^\/kategori\/([^/?#]+)/);
  if (categoryMatch) {
    const catRaw = decodeURIComponent(categoryMatch[1]);
    const catName = catRaw.charAt(0).toUpperCase() + catRaw.slice(1).toLowerCase();
    const categoryUrl = `${baseUrl}/kategori/${catRaw.toLowerCase()}`;
    const title = `Kategori ${catName} | Majalengka Post`;
    const description = `Kumpulan berita terbaru dan terpercaya dari kategori ${catName} di Majalengka Post.`;
    const imageUrl = `${baseUrl}/default-news.jpg`;

    const metaTags = generateMetaTags({
      title,
      description,
      canonicalUrl: categoryUrl,
    });

    const ogTags = generateOpenGraphTags({
      title,
      description,
      url: categoryUrl,
      imageUrl,
      type: "website",
    });

    const jsonLd = generateWebSiteJsonLd(baseUrl, title, description);
    const verifyTag = googleSiteVerification ? `\n    <meta name="google-site-verification" content="${googleSiteVerification}" />` : "";

    const combinedTags = `${metaTags}${ogTags}${jsonLd}${verifyTag}`;
    const completeHtml = injectMetadataToTemplate(rawHtml, combinedTags);
    const etag = generateETag(completeHtml);

    return {
      status: 200,
      html: completeHtml,
      etag,
      cacheControl: defaultCacheControl,
    };
  }

  // 3. Syarat & Ketentuan: /terms
  if (urlPath === "/terms") {
    const pageUrl = `${baseUrl}/terms`;
    const title = "Syarat & Ketentuan | Majalengka Post";
    const description = "Syarat dan ketentuan penggunaan layanan portal berita online Majalengka Post.";
    const imageUrl = `${baseUrl}/default-news.jpg`;

    const metaTags = generateMetaTags({
      title,
      description,
      canonicalUrl: pageUrl,
    });

    const ogTags = generateOpenGraphTags({
      title,
      description,
      url: pageUrl,
      imageUrl,
      type: "website",
    });

    const combinedTags = `${metaTags}${ogTags}`;
    const completeHtml = injectMetadataToTemplate(rawHtml, combinedTags);
    const etag = generateETag(completeHtml);

    return {
      status: 200,
      html: completeHtml,
      etag,
      cacheControl: defaultCacheControl,
    };
  }

  // 4. Kebijakan Privasi: /privacy-policy
  if (urlPath === "/privacy-policy") {
    const pageUrl = `${baseUrl}/privacy-policy`;
    const title = "Kebijakan Privasi | Majalengka Post";
    const description = "Kebijakan privasi dan perlindungan data pengguna layanan portal berita online Majalengka Post.";
    const imageUrl = `${baseUrl}/default-news.jpg`;

    const metaTags = generateMetaTags({
      title,
      description,
      canonicalUrl: pageUrl,
    });

    const ogTags = generateOpenGraphTags({
      title,
      description,
      url: pageUrl,
      imageUrl,
      type: "website",
    });

    const combinedTags = `${metaTags}${ogTags}`;
    const completeHtml = injectMetadataToTemplate(rawHtml, combinedTags);
    const etag = generateETag(completeHtml);

    return {
      status: 200,
      html: completeHtml,
      etag,
      cacheControl: defaultCacheControl,
    };
  }

  // 5. Home route: /
  if (urlPath === "/" || urlPath === "/index.html") {
    const pageUrl = `${baseUrl}/`;
    const title = "Majalengka Post - Portal Berita Terpercaya";
    const description = "Majalengka Post menyajikan berita terkini, akurat, dan terpercaya seputar Majalengka, Jawa Barat, Nasional, Politik, dan Ekonomi.";
    const imageUrl = `${baseUrl}/default-news.jpg`;

    const metaTags = generateMetaTags({
      title,
      description,
      canonicalUrl: pageUrl,
    });

    const ogTags = generateOpenGraphTags({
      title,
      description,
      url: pageUrl,
      imageUrl,
      type: "website",
    });

    const jsonLd = generateWebSiteJsonLd(baseUrl, title, description);
    const verifyTag = googleSiteVerification ? `\n    <meta name="google-site-verification" content="${googleSiteVerification}" />` : "";

    const combinedTags = `${metaTags}${ogTags}${jsonLd}${verifyTag}`;
    const completeHtml = injectMetadataToTemplate(rawHtml, combinedTags);
    const etag = generateETag(completeHtml);

    return {
      status: 200,
      html: completeHtml,
      etag,
      cacheControl: defaultCacheControl,
    };
  }

  return null;
}

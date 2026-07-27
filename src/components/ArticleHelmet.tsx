import React from "react";
import { Helmet } from "react-helmet-async";
import { Article } from "../types";
import { slugify } from "../utils/slugify";
import logoImg from "../assets/logo.png";

interface ArticleHelmetProps {
  article: Article;
  customCanonical?: string;
}

export const ArticleHelmet: React.FC<ArticleHelmetProps> = ({ article, customCanonical }) => {
  const getSiteOrigin = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    return "https://www.majalengkapost.web.id";
  };

  const origin = getSiteOrigin();
  const slug = slugify(article.title);
  const canonicalUrl = customCanonical || `${origin}/artikel/${slug}`;

  const title = article.seo?.title || article.title;
  const helmetTitle = `${title} | Majalengka Post`;
  const description =
    article.seo?.description || article.summary || article.subTitle || "Berita terpercaya dan terkini dari Majalengka Post.";
  const keywords =
    article.seo?.keywords || (Array.isArray(article.tags) ? article.tags.join(", ") : "") || "majalengka, berita, majalengka post";

  let coverImage = article.coverImage || "/default-share.jpg";
  if (coverImage && !coverImage.startsWith("http") && !coverImage.startsWith("/")) {
    coverImage = `/${coverImage}`;
  }
  const fullImageUrl = coverImage.startsWith("http") ? coverImage : `${origin}${coverImage}`;

  const resolvedLogoUrl = logoImg.startsWith("http") ? logoImg : `${origin}${logoImg.startsWith("/") ? "" : "/"}${logoImg}`;

  const formatDateToIso = (dateStr?: string) => {
    if (!dateStr) return new Date().toISOString();
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  const publishedIso = formatDateToIso(article.date);
  const modifiedIso = formatDateToIso(article.updatedAt || article.date);

  // JSON-LD NewsArticle Schema
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": article.title.substring(0, 110),
    "description": description,
    "image": [fullImageUrl],
    "datePublished": publishedIso,
    "dateModified": modifiedIso,
    "author": [
      {
        "@type": "Person",
        "name": article.author || "Redaksi Majalengka Post",
        "jobTitle": "Jurnalis / Redaksi",
        "url": article.author
          ? `${origin}/#author-${slugify(article.author)}`
          : `${origin}/#author-redaksi`,
        "sameAs": [
          `${origin}/`,
          "https://facebook.com/majalengkapost",
          "https://twitter.com/majalengkapost",
          "https://instagram.com/majalengkapost"
        ]
      }
    ],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "@id": `${origin}/#organization`,
      "name": "Majalengka Post",
      "url": `${origin}/`,
      "logo": {
        "@type": "ImageObject",
        "url": resolvedLogoUrl
      },
      "sameAs": [
        "https://facebook.com/majalengkapost",
        "https://twitter.com/majalengkapost",
        "https://instagram.com/majalengkapost"
      ]
    },
    "sameAs": [
      canonicalUrl,
      "https://facebook.com/majalengkapost",
      "https://twitter.com/majalengkapost",
      "https://instagram.com/majalengkapost"
    ],
    "keywords": keywords,
    "articleBody": article.content || "",
    "wordCount": article.content ? article.content.trim().split(/\s+/).length : 0,
    "isAccessibleForFree": "True",
    "inLanguage": "id-ID"
  };

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": `${origin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category || "Berita",
        "item": `${origin}/?category=${encodeURIComponent(article.category || "Berita")}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{helmetTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={article.author || "Redaksi Majalengka Post"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Majalengka Post" />
      <meta property="og:title" content={helmetTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="id_ID" />
      <meta property="article:published_time" content={publishedIso} />
      <meta property="article:modified_time" content={modifiedIso} />
      <meta property="article:author" content={article.author || "Redaksi Majalengka Post"} />
      <meta property="article:section" content={article.category || "Berita"} />
      {Array.isArray(article.tags) &&
        article.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@majalengkapost" />
      <meta name="twitter:creator" content={article.author ? `@${slugify(article.author)}` : "@majalengkapost"} />
      <meta name="twitter:title" content={helmetTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(newsArticleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default ArticleHelmet;

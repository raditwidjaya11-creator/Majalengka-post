export interface OpenGraphConfig {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  type?: "article" | "website";
  siteName?: string;
  publishedTime?: string;
  authorName?: string;
  section?: string;
  tags?: string[];
}

export function generateOpenGraphTags(config: OpenGraphConfig): string {
  const type = config.type || "website";
  const siteName = config.siteName || "Majalengka Post";
  
  // Format the image URL
  let imageUrl = config.imageUrl;
  
  // Determine image content-type
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

  let articleMetaTags = "";
  if (type === "article") {
    if (config.publishedTime) {
      articleMetaTags += `\n    <meta property="article:published_time" content="${config.publishedTime}" />`;
      articleMetaTags += `\n    <meta property="article:modified_time" content="${config.publishedTime}" />`;
    }
    if (config.authorName) {
      articleMetaTags += `\n    <meta property="article:author" content="${config.authorName}" />`;
    }
    if (config.section) {
      articleMetaTags += `\n    <meta property="article:section" content="${config.section}" />`;
    }
    if (config.tags && config.tags.length > 0) {
      config.tags.forEach(tag => {
        articleMetaTags += `\n    <meta property="article:tag" content="${tag}" />`;
      });
    }
  }

  return `
    <!-- Schema.org / Microdata (WhatsApp Fallback) -->
    <meta itemprop="name" content="${config.title}" />
    <meta itemprop="description" content="${config.description}" />
    <meta itemprop="image" content="${imageUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${config.title}" />
    <meta property="og:description" content="${config.description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="${imageWidth}" />
    <meta property="og:image:height" content="${imageHeight}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:url" content="${config.url}" />
    <meta property="og:locale" content="id_ID" />${articleMetaTags}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${config.title}" />
    <meta name="twitter:description" content="${config.description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `;
}

export interface NewsArticleJsonLdConfig {
  headline: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  articleUrl: string;
}

export function generateNewsArticleJsonLd(config: NewsArticleJsonLdConfig): string {
  const publisherName = config.publisherName || "Majalengka Post";
  const publisherLogoUrl = config.publisherLogoUrl || "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": config.headline,
    "image": [config.imageUrl],
    "datePublished": config.datePublished,
    "dateModified": config.dateModified,
    "author": [{
      "@type": "Person",
      "name": config.authorName,
      "url": config.articleUrl
    }],
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogoUrl
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": config.articleUrl
    }
  };

  return `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  `;
}

export function generateWebSiteJsonLd(baseUrl: string, title: string, description: string): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Majalengka Post",
    "url": baseUrl,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  `;
}

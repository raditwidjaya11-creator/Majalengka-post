export interface SEOMetaConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  author?: string;
  robots?: string;
  themeColor?: string;
}

export function generateMetaTags(config: SEOMetaConfig): string {
  const robots = config.robots || "index, follow, max-image-preview:large";
  const author = config.author || "Redaksi Majalengka Post";
  const keywords = config.keywords || "majalengka, berita, majalengka post, portal berita";
  const themeColor = config.themeColor || "#0f172a"; // Slate-900 matching the theme

  return `
    <title>${config.title}</title>
    <meta name="description" content="${config.description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />
    <meta name="robots" content="${robots}" />
    <meta name="theme-color" content="${themeColor}" />
    <link rel="canonical" href="${config.canonicalUrl}" />
  `;
}

/**
 * Injects SEO tags, Open Graph, Twitter Cards, and JSON-LD structured data into the index.html template.
 */
export function injectMetadataToTemplate(html: string, seoTags: string): string {
  // Remove existing title tags if any to avoid duplication
  let processedHtml = html.replace(/<title>.*?<\/title>/gi, "");
  
  // Inject lang="id" and prefix="og: https://ogp.me/ns#" into the <html> tag for absolute compliance
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

  // Inject computed SEO tags right before </head>
  processedHtml = processedHtml.replace("</head>", `${seoTags}\n</head>`);
  
  return processedHtml;
}

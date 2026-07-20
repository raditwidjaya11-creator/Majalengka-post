/**
 * Converts a string into a clean, URL-friendly slug.
 */
export function slugify(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, "");  // trim leading and trailing hyphens
}

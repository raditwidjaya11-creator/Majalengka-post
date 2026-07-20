import { createClient } from "@supabase/supabase-js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default async function handler(req: any, res: any) {
  console.log("[API LOG] GET /api/sitemap.xml called");

  const host = req.headers.host || "www.majalengkapost.web.id";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const baseUrl = `${protocol}://${host}`;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

  let articles: any[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from("articles")
        .select("title, date")
        .eq("status", "PUBLISHED")
        .order("date", { ascending: false });

      if (!error && data) {
        articles = data;
      } else if (error) {
        console.error("Supabase query error in sitemap.xml.ts:", error);
      }
    } catch (err) {
      console.error("Error querying articles for sitemap.xml.ts:", err);
    }
  }

  // Generate XML string
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  if (articles.length > 0) {
    articles.forEach((art) => {
      if (art.title) {
        const slug = slugify(art.title);
        let lastmodDate = new Date().toISOString().split('T')[0];
        if (art.date) {
          try {
            const parsedDate = new Date(art.date);
            if (!isNaN(parsedDate.getTime())) {
              lastmodDate = parsedDate.toISOString().split('T')[0];
            }
          } catch (e) {
            console.error("Error parsing date for sitemap entry:", e);
          }
        }
        xml += `
  <url>
    <loc>${baseUrl}/artikel/${slug}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });
  }

  xml += `
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(xml);
}

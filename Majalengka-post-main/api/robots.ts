export default async function handler(req: any, res: any) {
  console.log("[API LOG] GET /api/robots.txt called");
  
  const robotsTxtContent = `User-agent: *
Allow: /
Sitemap: https://www.majalengkapost.web.id/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400"); // cache for 1 day
  return res.status(200).send(robotsTxtContent);
}

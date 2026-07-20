export default async function handler(req: any, res: any) {
  const hash = req.query?.hash || req.params?.hash || req.url?.match(/\/google([a-f0-9]+)\.html/)?.[1] || "";
  
  if (!hash) {
    return res.status(404).send("Verification hash not provided");
  }

  const content = `google-site-verification: google${hash}.html`;
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(content);
}

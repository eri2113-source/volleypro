// Vercel Serverless Function - Robots.txt
export default function handler(req, res) {
  const robotsTxt = `# VolleyPro - Robots.txt
User-agent: *
Allow: /

Sitemap: https://voleypro.net/sitemap.xml

Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(robotsTxt);
}
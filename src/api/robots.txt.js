export default function handler(req, res) {
  const robots = `# VolleyPro - Robots.txt
User-agent: *
Allow: /

Sitemap: https://voleypro.net/sitemap.xml

Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(robots);
}

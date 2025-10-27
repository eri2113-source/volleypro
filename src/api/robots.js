// Vercel Serverless Function - Robots.txt
module.exports = (req, res) => {
  const robotsTxt = `# VolleyPro - Robots.txt
User-agent: *
Allow: /

Sitemap: https://voleypro.net/sitemap.xml

Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(robotsTxt);
};
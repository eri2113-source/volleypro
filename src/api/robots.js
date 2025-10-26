// Vercel Serverless Function - SINTAXE CORRETA!
module.exports = (req, res) => {
  const robotsTxt = `# VolleyPro - Robots.txt
User-agent: *
Allow: /

Sitemap: https://volleypro-zw96.vercel.app/sitemap.xml

Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).end(robotsTxt);
};

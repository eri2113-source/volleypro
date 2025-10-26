// Vercel Serverless Function - SINTAXE CORRETA!
module.exports = (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://volleypro-zw96.vercel.app/</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://volleypro-zw96.vercel.app/#feed</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://volleypro-zw96.vercel.app/#showcase</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://volleypro-zw96.vercel.app/#teams</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://volleypro-zw96.vercel.app/#tournaments</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://volleypro-zw96.vercel.app/#lives</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://volleypro-zw96.vercel.app/#monetization</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).end(sitemap);
};

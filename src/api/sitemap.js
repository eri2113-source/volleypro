export default function handler(request, response) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://voleypro.net/</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#feed</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#showcase</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#teams</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#tournaments</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#lives</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#monetization</loc>
    <lastmod>2025-10-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  response.status(200).send(sitemap);
}
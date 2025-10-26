// Vercel Serverless Function para servir sitemap.xml
// Esta é a ÚNICA forma 100% garantida de funcionar na Vercel!

export default function handler(req, res) {
  // Sitemap HARDCODED (garantido!)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Feed -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#feed</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Atletas / Vitrine -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#showcase</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Times -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#teams</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Torneios -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#tournaments</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Lives / Transmissões -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#lives</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Planos / Monetização -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#monetization</loc>
    <lastmod>2025-10-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>`;

  // Headers corretos
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Retornar sitemap
  res.status(200).send(sitemap);
}

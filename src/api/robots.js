// Vercel Serverless Function para servir robots.txt
// Esta é a ÚNICA forma 100% garantida de funcionar na Vercel!

export default function handler(req, res) {
  // robots.txt HARDCODED (garantido!)
  const robotsTxt = `# VolleyPro - Robots.txt
# Permitir todos os crawlers

User-agent: *
Allow: /

# Sitemap
Sitemap: https://volleypro-zw96.vercel.app/sitemap.xml

# Crawl-delay para não sobrecarregar
Crawl-delay: 1`;

  // Headers corretos
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Retornar robots.txt
  res.status(200).send(robotsTxt);
}

// Vercel Serverless Function para servir robots.txt
export default function handler(req, res) {
  // robots.txt estático inline
  const robotsTxt = `# VolleyPro - Rede Social de Vôlei
User-agent: *
Allow: /
Sitemap: https://volleypro-zw96.vercel.app/sitemap.xml

# Bloquear URLs privadas
Disallow: /admin
Disallow: /api/
Disallow: /*?clear_cache=`;

  // Headers corretos
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Retornar robots.txt
  res.status(200).send(robotsTxt);
}

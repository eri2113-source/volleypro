// ✅ VERCEL EDGE FUNCTION - Robots.txt 100% PÚBLICO
// Acesso: https://volleypro-zw96.vercel.app/robots.txt
// Redireciona automaticamente para /api/robots.txt (configurado no vercel.json)

export const config = {
  runtime: 'edge',
};

export default function handler() {
  const robots = `# VolleyPro - Rede Social de Vôlei
User-agent: *
Allow: /
Sitemap: https://volleypro-zw96.vercel.app/sitemap.xml

# Bloquear URLs privadas
Disallow: /admin
Disallow: /api/
Disallow: /*?clear_cache=
`;

  return new Response(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

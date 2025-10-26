// Vercel Function para servir robots.txt
// Acesso: https://volleypro-zw96.vercel.app/api/robots.txt

export const config = {
  runtime: 'edge',
};

export default function handler() {
  const robots = `# VolleyPro - Rede Social de Vôlei
User-agent: *
Allow: /
Sitemap: https://volleypro-zw96.vercel.app/api/sitemap.xml

# Bloquear URLs privadas
Disallow: /admin
Disallow: /api/
Disallow: /*?clear_cache=
`;

  return new Response(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

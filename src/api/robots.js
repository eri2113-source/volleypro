export default function handler(request, response) {
  const robotsTxt = `# VolleyPro - Robots.txt
User-agent: *
Allow: /

Sitemap: https://voleypro.net/sitemap.xml

Crawl-delay: 1`;

  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  response.status(200).send(robotsTxt);
}
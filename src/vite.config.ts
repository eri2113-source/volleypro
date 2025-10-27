import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Plugin para injetar Google Tag Manager no HTML
function injectGTM() {
  return {
    name: 'inject-gtm',
    transformIndexHtml(html: string) {
      console.log('🔥 Plugin GTM: Injetando código...');
      
      // GTM Script para o <head>
      const gtmScript = `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MV9D2M4P');</script>
    <!-- End Google Tag Manager -->`;

      // GTM noscript para o <body>
      const gtmNoscript = `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MV9D2M4P"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

      // Injetar no <head> antes do </head>
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${gtmScript}\n  </head>`);
        console.log('✅ GTM Script injetado no <head>');
      } else {
        console.error('❌ Tag </head> não encontrada!');
      }
      
      // Injetar no <body> logo após <body>
      if (html.includes('<body>')) {
        html = html.replace('<body>', `<body>\n    ${gtmNoscript}`);
        console.log('✅ GTM Noscript injetado no <body>');
      } else {
        console.error('❌ Tag <body> não encontrada!');
      }
      
      // Verificar se GTM foi realmente injetado
      if (html.includes('GTM-MV9D2M4P')) {
        console.log('🎉 GTM-MV9D2M4P confirmado no HTML final!');
      } else {
        console.error('❌ ERRO: GTM-MV9D2M4P NÃO está no HTML!');
      }
      
      return html;
    }
  };
}

// Plugin para gerar sitemap.xml e robots.txt durante o build
function generateSEOFiles() {
  return {
    name: 'generate-seo-files',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      
      // Gerar sitemap.xml
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://voleypro.net/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#feed</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#showcase</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#teams</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#tournaments</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#lives</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://voleypro.net/#monetization</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

      // Gerar robots.txt
      const robots = `# VolleyPro - Robots.txt
User-agent: *
Allow: /

Sitemap: https://voleypro.net/sitemap.xml

Crawl-delay: 1`;

      // Escrever arquivos no dist
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);
      
      console.log('✅ sitemap.xml gerado em /dist');
      console.log('✅ robots.txt gerado em /dist');
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectGTM(), generateSEOFiles()],
  publicDir: 'public',  // Garante que public/ seja copiado para dist/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-avatar'],
          'supabase': ['@supabase/supabase-js'],
          'livekit': ['@livekit/components-react', 'livekit-client'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});

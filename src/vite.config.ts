import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

// Plugin para copiar sitemap e robots.txt FORÇADAMENTE
function copySEOFiles() {
  return {
    name: 'copy-seo-files',
    writeBundle() {
      try {
        console.log('🔄 Copiando arquivos SEO...');
        
        // Garantir que dist/ existe
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
          console.log('✅ Diretório dist/ criado');
        }
        
        // Copiar sitemap.xml
        if (existsSync('public/sitemap.xml')) {
          copyFileSync('public/sitemap.xml', 'dist/sitemap.xml');
          console.log('✅ sitemap.xml copiado para dist/');
        } else {
          console.error('❌ public/sitemap.xml NÃO EXISTE!');
        }
        
        // Copiar robots.txt
        if (existsSync('public/robots.txt')) {
          copyFileSync('public/robots.txt', 'dist/robots.txt');
          console.log('✅ robots.txt copiado para dist/');
        } else {
          console.error('❌ public/robots.txt NÃO EXISTE!');
        }
        
        console.log('🎉 Arquivos SEO copiados com sucesso!');
      } catch (e) {
        console.error('❌ Erro ao copiar arquivos SEO:', e);
      }
    }
  };
}

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectGTM(), copySEOFiles()],
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
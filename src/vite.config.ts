import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Plugin para injetar Google Tag Manager no HTML
function injectGTM() {
  return {
    name: 'inject-gtm',
    transformIndexHtml(html: string) {
      // GTM Script para o <head>
      const gtmScript = `
    <!-- Google Tag Manager -->
    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MV9D2M4P');
    </script>
    <!-- End Google Tag Manager -->
    
    <!-- Inicializar dataLayer ANTES do bloqueio -->
    <script>
      window.dataLayer = window.dataLayer || [];
    </script>`;

      // GTM noscript para o <body>
      const gtmNoscript = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MV9D2M4P"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    `;

      // Injetar no <head> antes do </head>
      html = html.replace('</head>', `${gtmScript}\n  </head>`);
      
      // Injetar no <body> logo após <body>
      html = html.replace('<body>', `<body>\n    ${gtmNoscript}`);
      
      return html;
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectGTM()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
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
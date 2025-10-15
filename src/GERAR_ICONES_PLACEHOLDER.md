# 🎨 Gerar Ícones Placeholder Temporários

## Se você não tem os ícones ainda, pode usar este código SVG temporário:

### Criar arquivos manualmente:

Salve este SVG como base e converta para PNG nos tamanhos necessários:

```svg
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0066ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0052cc;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="80" fill="url(#grad)"/>
  
  <!-- Volleyball -->
  <circle cx="256" cy="256" r="180" fill="white" opacity="0.95"/>
  
  <!-- Volleyball lines -->
  <path d="M 256 76 Q 200 200 256 256 Q 312 200 256 76" fill="none" stroke="#0066ff" stroke-width="8"/>
  <path d="M 256 436 Q 200 312 256 256 Q 312 312 256 436" fill="none" stroke="#0066ff" stroke-width="8"/>
  <path d="M 76 256 Q 180 200 256 256 Q 180 312 76 256" fill="none" stroke="#0066ff" stroke-width="8"/>
  <path d="M 436 256 Q 332 200 256 256 Q 332 312 436 256" fill="none" stroke="#0066ff" stroke-width="8"/>
  
  <!-- Text VP -->
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="#0066ff" text-anchor="middle" dominant-baseline="middle">VP</text>
</svg>
```

## Opção Rápida: Usar um gerador online

### 1. PWA Builder (Recomendado)
https://www.pwabuilder.com/imageGenerator

### 2. RealFaviconGenerator
https://realfavicongenerator.net/

### 3. Favicon.io
https://favicon.io/favicon-generator/

## Tamanhos necessários:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Todos devem estar na pasta `/public/`

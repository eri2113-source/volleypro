#!/bin/bash
set -e

echo "🚀 Iniciando build personalizado para Cloudflare Pages..."

# Remove package-lock.json se existir
if [ -f "package-lock.json" ]; then
  echo "🗑️ Removendo package-lock.json..."
  rm -f package-lock.json
fi

# Instala dependências sem package-lock
echo "📦 Instalando dependências com --legacy-peer-deps..."
npm install --legacy-peer-deps --no-package-lock

# Build do projeto
echo "🔨 Executando build do Vite..."
npm run build

echo "✅ Build concluído com sucesso!"

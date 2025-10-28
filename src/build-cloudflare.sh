#!/bin/bash

# Script de build para Cloudflare Pages - VolleyPro
# Este script garante que o build funcione sem package-lock.json

echo "🏐 VolleyPro - Iniciando build para Cloudflare Pages..."

# Remove package-lock.json se existir (evita conflitos com npm ci)
if [ -f "package-lock.json" ]; then
    echo "🗑️  Removendo package-lock.json..."
    rm -f package-lock.json
fi

# Instala dependências com npm install (não npm ci)
echo "📦 Instalando dependências..."
npm install

# Executa o build
echo "🔨 Compilando projeto..."
npm run build

echo "✅ Build concluído com sucesso!"

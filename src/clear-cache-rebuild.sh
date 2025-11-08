#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  🧹 Limpar Cache e Rebuild"
echo "════════════════════════════════════════════════════════"
echo ""

echo "🗑️  Removendo cache do Vite..."
rm -rf node_modules/.vite
rm -rf dist

echo "✅ Cache removido!"
echo ""

echo "🔄 Reiniciando servidor de desenvolvimento..."
echo ""
echo "Pressione Ctrl+C para parar o servidor quando terminar"
echo ""

npm run dev

#!/bin/bash

echo "🚀 ADICIONANDO MENU ANÚNCIOS NA SIDEBAR"
echo ""
echo "✅ Adicionando arquivos ao Git..."
git add .

echo "✅ Criando commit..."
git commit -m "fix: adiciona menu Anúncios na sidebar (Megaphone icon)"

echo "✅ Enviando para GitHub..."
git push origin main --force

echo ""
echo "🎉 PRONTO!"
echo ""
echo "⏰ Aguarde 3-5 minutos para a Vercel fazer o deploy"
echo "🌐 Teste depois em: https://volleypro-zw96.vercel.app"
echo "🔓 Use aba anônima (Ctrl + Shift + N) para evitar cache"
echo ""
echo "✨ Agora deve aparecer 'Anúncios' no menu lateral!"

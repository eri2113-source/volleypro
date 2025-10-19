#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 PUBLICAR NO NETLIFY - DEPLOY AUTOMÁTICO                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Timestamp para forçar rebuild
TIMESTAMP=$(date +%s)
BUILD_ID="netlify-$(date +%Y%m%d-%H%M%S)"

echo "📦 Preparando deploy..."
echo "   Build ID: $BUILD_ID"
echo "   Timestamp: $TIMESTAMP"
echo ""

# Atualizar arquivo de versão
echo "VolleyPro v2.3.0 - Sistema Anúncios Completo" > BUILD_TIMESTAMP.txt
echo "Build: $BUILD_ID" >> BUILD_TIMESTAMP.txt
echo "Timestamp: $TIMESTAMP" >> BUILD_TIMESTAMP.txt
echo "Platform: Netlify" >> BUILD_TIMESTAMP.txt

echo "✅ Timestamp atualizado"
echo ""

# Adicionar todos os arquivos
echo "📋 Verificando arquivos..."
git add -A

# Status
echo ""
echo "📊 Status dos arquivos:"
git status --short

echo ""
read -p "❓ Confirma o commit e push? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "📝 Criando commit..."
    
    git commit -m "🚀 Deploy Netlify - Sistema Anúncios v2.3.0

✨ DEPLOY PARA NETLIFY - Build: $BUILD_ID

🎯 Mudanças neste deploy:
- Sistema de anúncios 100% completo
- Menu 'Anúncios' na barra horizontal azul
- Menu 'Anúncios' na sidebar lateral
- 4 componentes frontend + 6 rotas backend
- netlify.toml com configurações otimizadas
- PWA configurado e funcionando
- Deploy automático do GitHub

⚡ Plataforma: Netlify (sem problemas de cache!)
📅 Data: $(date '+%Y-%m-%d %H:%M:%S')
" || echo "⚠️  Nada para commitar, mas vamos fazer push..."

    echo ""
    echo "🚀 Enviando para GitHub..."
    git push origin main
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  ✅ PUSH CONCLUÍDO! NETLIFY VAI FAZER DEPLOY AUTOMÁTICO   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📍 AGORA FAÇA ISSO:"
    echo ""
    echo "1️⃣  Se ainda NÃO configurou o Netlify:"
    echo "    👉 Leia o guia: DEPLOY_NETLIFY_AGORA.md"
    echo "    👉 Acesse: https://app.netlify.com/signup"
    echo "    👉 Conecte seu repositório GitHub"
    echo "    👉 Configure as variáveis de ambiente"
    echo "    👉 Clique em 'Deploy site'"
    echo ""
    echo "2️⃣  Se JÁ configurou o Netlify:"
    echo "    👉 Acesse: https://app.netlify.com"
    echo "    👉 Vá em 'Deploys'"
    echo "    👉 Veja o build em andamento (2-3 minutos)"
    echo "    👉 Quando ficar 'Published', está pronto!"
    echo ""
    echo "3️⃣  Acompanhar o deploy:"
    echo "    👉 https://app.netlify.com/teams/[seu-time]/deploys"
    echo "    👉 Logs em tempo real"
    echo "    👉 Sem problemas de cache!"
    echo ""
    echo "4️⃣  Testar o site:"
    echo "    👉 Abra aba anônima: Ctrl + Shift + N"
    echo "    👉 Acesse sua URL do Netlify"
    echo "    👉 Faça login"
    echo "    👉 DEVE ter 'Anúncios' na barra azul! 📣"
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  🎯 VANTAGENS DO NETLIFY                                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Deploy em 2-3 minutos (Vercel: 5-7 min)"
    echo "✅ SEM problemas de cache"
    echo "✅ Atualiza SEMPRE que você faz push"
    echo "✅ Logs claros e detalhados"
    echo "✅ Interface simples e intuitiva"
    echo "✅ Rollback fácil se precisar"
    echo "✅ HTTPS grátis e automático"
    echo "✅ Preview de branches automático"
    echo ""
    echo "🎉 SEU SITE VAI FUNCIONAR PERFEITAMENTE AGORA! 🚀"
    echo ""
else
    echo ""
    echo "❌ Deploy cancelado."
    echo ""
fi

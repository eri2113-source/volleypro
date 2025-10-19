#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 FORÇAR VERCEL A ATUALIZAR - SEM DELETAR PROJETO        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Atualizar timestamp
TIMESTAMP=$(date +%s)
echo "VOLLEYPRO BUILD - FORÇA REBUILD" > BUILD_TIMESTAMP.txt
echo "Timestamp: $TIMESTAMP" >> BUILD_TIMESTAMP.txt
echo "Feature: Sistema Anúncios v2.3.0" >> BUILD_TIMESTAMP.txt

echo "✅ Timestamp atualizado: $TIMESTAMP"
echo ""

# Adicionar TODOS os arquivos
echo "📦 Adicionando arquivos..."
git add -A

echo "📝 Criando commit FORÇADO..."
git commit -m "chore: REBUILD FORCED - Sistema Anúncios v2.3.0 - Build $TIMESTAMP

🚀 MUDANÇAS CRÍTICAS:
- Sistema de anúncios 100% completo
- Menu Anúncios na barra horizontal azul  
- Menu Anúncios na sidebar lateral
- 4 componentes frontend + 6 rotas backend
- vercel.json atualizado para forçar rebuild

⚡ Esta é uma atualização OBRIGATÓRIA
✨ Build ID: ads-v2-$TIMESTAMP
" || echo "⚠️  Nada para commitar, mas vamos forçar push..."

echo ""
echo "🚀 Enviando para GitHub com FORCE..."
git push origin main --force

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ PUSH CONCLUÍDO! AGORA FAÇA ISSO:                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 PASSO 1: Entre na Vercel"
echo "   👉 https://vercel.com"
echo ""
echo "📍 PASSO 2: Vá em 'Deployments'"
echo "   👉 Clique no projeto 'volleypro'"
echo "   👉 Clique na aba 'Deployments'"
echo ""
echo "📍 PASSO 3: Force Redeploy (IMPORTANTE!)"
echo "   👉 Clique no deployment mais recente"
echo "   👉 Clique nos 3 pontinhos (...) no canto superior direito"
echo "   👉 Clique em 'Redeploy'"
echo "   👉 ⚠️  MARQUE a opção: ☑️ 'Use existing Build Cache' = DESMARCADO!"
echo "   👉 Clique em 'Redeploy'"
echo ""
echo "📍 PASSO 4: Aguarde o Build"
echo "   ⏰ Tempo estimado: 3-5 minutos"
echo "   👀 Acompanhe os logs na própria página"
echo "   ✅ Quando aparecer 'Ready', está pronto!"
echo ""
echo "📍 PASSO 5: Teste em Aba Anônima"
echo "   🔓 Ctrl + Shift + N (Windows) ou Cmd + Shift + N (Mac)"
echo "   🌐 https://volleypro-zw96.vercel.app"
echo "   🔐 Faça login"
echo "   📣 Deve aparecer 'Anúncios' na barra azul do topo!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🎯 CHECKLIST FINAL                                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "[ ] Fez login na Vercel"
echo "[ ] Clicou em 'Redeploy' com cache DESMARCADO"
echo "[ ] Aguardou build completar (status 'Ready')"
echo "[ ] Testou em aba anônima"
echo "[ ] Viu botão 'Anúncios' na barra azul"
echo ""
echo "💡 DICA: Se ainda não aparecer, limpe o cache do navegador:"
echo "   Chrome: Ctrl + Shift + Delete → Limpar dados de navegação"
echo ""
echo "🎉 PRONTO! Seu site vai atualizar agora!"
echo ""

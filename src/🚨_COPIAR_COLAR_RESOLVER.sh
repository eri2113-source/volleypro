#!/bin/bash

echo "🚨 ===== DEPLOY URGENTE - RESOLVER INSCRIÇÃO ====="
echo ""

# Adicionar arquivos com logs
git add components/TournamentSquadSelectionModal.tsx
git add lib/api.ts

# Commit
git commit -m "🚨 URGENTE LMV: Adiciona logs detalhados para debug de inscrição

PROBLEMA: Times não conseguem se inscrever no torneio
SOLUÇÃO: Logs super detalhados em 3 pontos críticos

LOGS ADICIONADOS:
- Frontend (TournamentSquadSelectionModal): logs passo a passo
- API (lib/api.ts): logs de request/response
- Backend (já tinha): logs de processamento

PRÓXIMO PASSO:
1. Deploy (2 min)
2. Limpar cache (Ctrl+Shift+R)
3. Abrir Console (F12)
4. Tentar inscrever
5. Copiar TODOS os logs e enviar

Com os logs vou descobrir o problema EXATO!"

# Push
echo ""
echo "🚀 Fazendo push..."
git push

echo ""
echo "✅ Deploy iniciado!"
echo ""
echo "⏱️ Aguardar 2-3 minutos para build completar"
echo ""
echo "📋 CHECKLIST:"
echo "   1. ⏰ Aguardar build (https://vercel.com)"
echo "   2. 🧹 Limpar cache: Ctrl+Shift+R"
echo "   3. 🔍 Abrir Console: F12"
echo "   4. 🎯 Tentar inscrever time"
echo "   5. 📸 Copiar TODOS os logs"
echo "   6. 📤 Enviar logs + print"
echo ""
echo "🆘 OU USE O TESTE MANUAL:"
echo "   Veja arquivo: 🆘_TESTE_IMEDIATO_SEM_DEPLOY.md"

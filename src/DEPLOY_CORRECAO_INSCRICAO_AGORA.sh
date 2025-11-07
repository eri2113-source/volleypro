#!/bin/bash

echo "🚀 ===== DEPLOY CORREÇÃO INSCRIÇÃO DE TIMES ====="
echo ""
echo "📦 Arquivos alterados:"
echo "   ✅ components/TournamentSquadSelectionModal.tsx"
echo "   ✅ components/TournamentDetailsModal.tsx"
echo ""

# Adicionar arquivos
git add components/TournamentSquadSelectionModal.tsx
git add components/TournamentDetailsModal.tsx
git add 🚀_INSCRICAO_TIMES_CORRIGIDA_3_BUGS.md
git add DEPLOY_CORRECAO_INSCRICAO_AGORA.sh

echo "📝 Criando commit..."
git commit -m "🐛 URGENTE: Corrige 3 bugs críticos na inscrição de times

PROBLEMAS RESOLVIDOS:
1. Inscrição automática invisível (usuários não viam feedback)
2. Modal fechava rápido demais (500ms → 800ms)
3. Race condition no reload (adicionado delay de 300ms)

MELHORIAS:
- Usuário agora clica em botão visível 'Inscrever Agora'
- Feedback visual claro durante inscrição (loading state)
- Toast de sucesso visível por tempo suficiente
- Logs detalhados para debug
- Mensagens de erro mais claras

IMPACTO:
- Resolve reclamações de 'não consigo inscrever time'
- Melhora UX drasticamente
- Facilita debug de problemas futuros"

echo ""
echo "🚀 Fazendo push para Vercel..."
git push

echo ""
echo "✅ Deploy iniciado!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "   1. Aguardar 2-3 minutos para build completar"
echo "   2. Abrir https://voleypro.net"
echo "   3. Limpar cache (Ctrl+Shift+R)"
echo "   4. Testar inscrição de times"
echo "   5. Verificar logs no Console (F12)"
echo ""
echo "🆘 EM CASO DE PROBLEMAS:"
echo "   - Abrir Console (F12) e procurar logs com 🎯 e ✅"
echo "   - Compartilhar prints dos erros"
echo ""
echo "🎉 Boa sorte com os testes!"

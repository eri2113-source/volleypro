#!/bin/bash

echo ""
echo "🔥 CORRIGINDO ERROS CRÍTICOS"
echo "==========================="
echo ""
echo "❌ Erro 1: Sintaxe linha 4795 (backend)"
echo "❌ Erro 2: user.name undefined linha 4866"
echo "❌ Erro 3: teamData undefined linha 4801"
echo ""

node fix-syntax-errors.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Correções aplicadas!"
  echo ""
  echo "🚀 Fazendo commit..."
  git add -A
  git commit -m "🔥 FIX: Corrigido erro de sintaxe linha 4795 backend

- Removido escape \\n quebrado
- Simplificado teamData = team
- Corrigido user.name para team.name"
  
  echo ""
  echo "📤 Push para produção..."
  git push origin main
  
  echo ""
  echo "✅ DEPLOY INICIADO!"
  echo "⏰ Aguarde 2-3 minutos"
  echo ""
else
  echo ""
  echo "❌ ERRO! Veja detalhes acima."
  echo ""
fi

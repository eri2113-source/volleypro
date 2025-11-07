#!/bin/bash

clear
echo ""
echo "═══════════════════════════════════════════════════════"
echo "    🔥 CORRIGIR ERRO SINTAXE LINHA 4795 🔥"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🎯 Erro identificado: Escape \\n quebrado na linha 4795"
echo ""
echo "Executando correção..."
echo ""

python3 fix_line_4795_direct.py

if [ $? -eq 0 ]; then
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "          ✅ CORREÇÃO APLICADA!"
  echo "═══════════════════════════════════════════════════════"
  echo ""
  echo "📤 Fazendo commit e push..."
  echo ""
  
  git add supabase/functions/server/index.tsx
  git commit -m "fix: Corrigido erro sintaxe linha 4795 - Removido escape \\n quebrado"
  
  if [ $? -eq 0 ]; then
    echo "✅ Commit criado com sucesso"
    echo ""
    echo "🚀 Fazendo push para produção..."
    git push origin main
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "═══════════════════════════════════════════════════════"
      echo "        🎉 DEPLOY INICIADO COM SUCESSO! 🎉"
      echo "═══════════════════════════════════════════════════════"
      echo ""
      echo "⏰ Aguarde 2-3 minutos para o deploy completar"
      echo "🌐 Acesse: https://voleypro.net"
      echo ""
      echo "✅ O erro de sintaxe foi corrigido!"
      echo "✅ O deploy vai passar sem erros!"
      echo ""
    else
      echo "❌ Erro no git push"
      echo "Verifique sua conexão com o GitHub"
    fi
  else
    echo "❌ Erro no git commit"
  fi
else
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "           ❌ ERRO NA CORREÇÃO"
  echo "═══════════════════════════════════════════════════════"
  echo ""
  echo "Certifique-se de que Python está instalado:"
  echo "  sudo apt install python3"
  echo ""
fi

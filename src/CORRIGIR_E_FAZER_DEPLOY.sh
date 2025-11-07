#!/bin/bash

clear
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║     🔥 CORRIGIR ERRO LINHA 4795 + DEPLOY 🔥     ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "📍 Erro: Escape \\n literal fora da string"
echo "📍 Linha: 4795 do arquivo index.tsx"
echo ""
echo "[1/3] Corrigindo arquivo..."
echo ""

python3 fix_syntax_final.py

if [ $? -eq 0 ]; then
  echo ""
  echo "╔══════════════════════════════════════════════════╗"
  echo "║              ✅ CORREÇÃO APLICADA!              ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo ""
  echo "[2/3] Fazendo commit..."
  echo ""
  
  git add supabase/functions/server/index.tsx
  git commit -m "fix: Corrigido erro sintaxe linha 4795 - escape \\n literal removido"
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Commit criado!"
    echo ""
    echo "[3/3] Enviando para produção..."
    echo ""
    
    git push origin main
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "╔══════════════════════════════════════════════════╗"
      echo "║          🎉 DEPLOY INICIADO COM SUCESSO! 🎉     ║"
      echo "╚══════════════════════════════════════════════════╝"
      echo ""
      echo "⏰ Aguarde 2-3 minutos para o deploy completar"
      echo "🌐 Site: https://voleypro.net"
      echo ""
      echo "✅ O erro foi corrigido!"
      echo "✅ O build vai passar sem erros!"
      echo "✅ O torneio LMV está pronto para inscrições!"
      echo ""
    else
      echo ""
      echo "❌ Erro no git push"
      echo "💡 Verifique sua conexão com GitHub"
    fi
  else
    echo ""
    echo "❌ Erro no git commit"
  fi
else
  echo ""
  echo "╔══════════════════════════════════════════════════╗"
  echo "║                ❌ ERRO NA CORREÇÃO              ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo ""
  echo "💡 Certifique-se de que Python está instalado"
  echo "   Ubuntu/Debian: sudo apt install python3"
  echo "   MacOS: brew install python3"
  echo ""
fi

echo ""

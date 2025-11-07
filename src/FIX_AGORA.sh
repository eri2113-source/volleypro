#!/bin/bash

clear
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   🔥 CORRIGIR LINHA 4795 - AGORA! 🔥      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

python3 fix_line_4795_now.py

if [ $? -eq 0 ]; then
  echo ""
  echo "╔════════════════════════════════════════════╗"
  echo "║         ✅ CORREÇÃO APLICADA!             ║"
  echo "╚════════════════════════════════════════════╝"
  echo ""
  echo "📤 Fazendo deploy..."
  echo ""
  
  git add supabase/functions/server/index.tsx
  git commit -m "fix: Corrigido escape \\n quebrado linha 4795"
  git push origin main
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║     🎉 DEPLOY CONCLUÍDO COM SUCESSO!      ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "⏰ Aguarde 2-3 minutos"
    echo "🌐 https://voleypro.net"
    echo ""
  fi
fi

#!/bin/bash

echo "========================================"
echo " 🚨 CORRIGINDO INSCRICAO LMV URGENTE"
echo "========================================"
echo ""

echo "[1/4] Corrigindo backend..."
python3 fix_user_name.py
if [ $? -ne 0 ]; then
    echo "❌ Erro ao corrigir backend"
    exit 1
fi
echo "✅ Backend corrigido!"
echo ""

echo "[2/4] Adicionando arquivos..."
git add -A
echo "✅ Arquivos adicionados!"
echo ""

echo "[3/4] Fazendo commit..."
git commit -m "🔥 URGENTE: Corrigido botão Inscrever Time - LMV hoje"
echo "✅ Commit realizado!"
echo ""

echo "[4/4] Enviando para produção..."
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Erro no push"
    exit 1
fi
echo ""

echo "========================================"
echo " ✅ DEPLOY INICIADO COM SUCESSO!"
echo "========================================"
echo ""
echo "📍 Acompanhe em: https://vercel.com/dashboard"
echo "📍 Site: https://voleypro.net"
echo ""
echo "⏱️  Aguarde 2-3 minutos para o deploy completar"
echo ""

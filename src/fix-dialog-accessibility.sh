#!/bin/bash

echo "🔍 Verificando acessibilidade dos Dialogs..."
echo ""

python3 verify-dialog-accessibility.py

echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

read -p "Deseja corrigir automaticamente? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo ""
    echo "🔧 Aplicando correções..."
    python3 fix-missing-descriptions.py
    
    echo ""
    echo "✅ Correções aplicadas!"
    echo ""
    echo "Próximos passos:"
    echo "1. Verifique os arquivos modificados"
    echo "2. Execute: git add -A"
    echo "3. Execute: git commit -m 'fix: adiciona DialogDescription faltantes'"
    echo "4. Execute: git push"
fi

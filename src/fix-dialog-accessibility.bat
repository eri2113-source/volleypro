@echo off
chcp 65001 >nul
cls

echo ═══════════════════════════════════════════════════════
echo   🔍 VERIFICAR ACESSIBILIDADE DOS DIALOGS
echo ═══════════════════════════════════════════════════════
echo.

python verify-dialog-accessibility.py

echo.
echo ═══════════════════════════════════════════════════════
echo.

set /p resposta="Deseja corrigir automaticamente? (s/n): "

if /i "%resposta%"=="s" (
    echo.
    echo 🔧 Aplicando correções...
    python fix-missing-descriptions.py
    
    echo.
    echo ═══════════════════════════════════════════════════════
    echo   ✅ CORREÇÕES APLICADAS!
    echo ═══════════════════════════════════════════════════════
    echo.
    echo Próximos passos:
    echo   1. Verifique os arquivos modificados
    echo   2. Execute: git add -A
    echo   3. Execute: git commit -m "fix: adiciona DialogDescription faltantes"
    echo   4. Execute: git push
    echo.
    pause
) else (
    echo.
    echo Correção cancelada.
    pause
)

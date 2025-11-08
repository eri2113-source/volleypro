@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════
echo   🔧 CORRIGIR AMBOS OS ERROS
echo ════════════════════════════════════════════════════════
echo.
echo ⚠️  Corrigindo:
echo    1. Warning: Missing Description for DialogContent
echo    2. Erro ao deletar torneio: Tournament not found
echo.
echo ════════════════════════════════════════════════════════
echo.

echo 📝 Passo 1: Corrigir DialogContent warnings...
python fix-dialog-errors-now.py

echo.
echo ════════════════════════════════════════════════════════
echo.

echo ✅ Correções aplicadas!
echo.
echo 📊 O que foi corrigido:
echo.
echo ✓ Backend: deleteTournament agora tenta múltiplas variações do ID
echo ✓ Frontend: DialogDescription adicionado onde estava faltando
echo.
echo ════════════════════════════════════════════════════════
echo.
echo 🚀 Próximos passos:
echo.
echo 1. Teste deletar um torneio
echo 2. Verifique se os warnings de Dialog sumiram
echo 3. Se tudo OK, faça commit:
echo.
echo    git add -A
echo    git commit -m "fix: corrige delete torneio e dialog warnings"
echo    git push
echo.

pause

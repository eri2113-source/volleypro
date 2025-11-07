@echo off
chcp 65001 > nul

echo.
echo 🚨 ====== DEPLOY URGENTE - INSCRIÇÃO LMV ======
echo.
echo ⚡ Corrigindo inscrição de times no torneio LMV...
echo.

:: Add arquivos
echo 📦 Adicionando arquivos...
git add components/TournamentDetailsModal.tsx

:: Commit
echo 💾 Criando commit...
git commit -m "🚨 URGENTE LMV: Inscrição direta sem modal - emergência dia do torneio"

:: Push
echo 🚀 Enviando para produção...
git push

echo.
echo ✅ ====== DEPLOY COMPLETO ======
echo.
echo ⏱️  Aguarde 2-3 minutos para o build terminar
echo 🔄 Depois, pressione Ctrl+Shift+R para limpar cache
echo 🏐 Então teste a inscrição no torneio LMV!
echo.
echo 📋 O que mudou:
echo    ✅ Inscrição agora é DIRETA (sem modal)
echo    ✅ 1 clique = time inscrito
echo    ✅ Funciona para TODOS os times
echo.
pause

@echo off
chcp 65001 >nul
cls
echo.
echo ════════════════════════════════════════════
echo    🔥 CORRIGIR ERRO E FAZER DEPLOY
echo ════════════════════════════════════════════
echo.
echo 🔍 Erro: Linha 4795 - escape \n quebrado
echo.

python fix_syntax_now.py

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ════════════════════════════════════════════
  echo    ✅ ARQUIVO CORRIGIDO!
  echo ════════════════════════════════════════════
  echo.
  echo 📤 Fazendo commit e push...
  echo.
  
  git add supabase/functions/server/index.tsx
  git commit -m "fix: Corrigido erro sintaxe linha 4795 - escape \n quebrado"
  git push origin main
  
  echo.
  echo ════════════════════════════════════════════
  echo    🚀 DEPLOY INICIADO!
  echo ════════════════════════════════════════════
  echo.
  echo ⏰ Aguarde 2-3 minutos para o deploy completar
  echo 🌐 Teste em: https://voleypro.net
  echo.
  
) else (
  echo.
  echo ════════════════════════════════════════════
  echo    ❌ ERRO AO CORRIGIR
  echo ════════════════════════════════════════════
  echo.
  echo Certifique-se de que Python está instalado
  echo Download: https://python.org/downloads
  echo.
)

pause

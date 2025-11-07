@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║   🔥 CORRIGIR ERRO BACKEND AGORA          ║
echo ╚════════════════════════════════════════════╝
echo.
echo Erro: Linha 4795 - escape \n quebrado
echo.

python fix_backend_now.py

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ╔════════════════════════════════════════════╗
  echo ║   ✅ CORREÇÃO APLICADA!                   ║
  echo ╚════════════════════════════════════════════╝
  echo.
  echo 🚀 Fazendo commit...
  git add supabase/functions/server/index.tsx
  git commit -m "🔥 FIX: Erro sintaxe linha 4795 backend - Removido escape \n quebrado - Simplificado teamData = team - Corrigido user.name undefined"
  
  echo.
  echo 📤 Push para produção...
  git push origin main
  
  echo.
  echo ╔════════════════════════════════════════════╗
  echo ║   ✅ DEPLOY INICIADO!                     ║
  echo ║   ⏰ Aguarde 2-3 minutos                  ║
  echo ║   🌐 https://voleypro.net                 ║
  echo ╚════════════════════════════════════════════╝
  echo.
) else (
  echo.
  echo ❌ ERRO! Instale Python: https://python.org
  echo.
)

pause

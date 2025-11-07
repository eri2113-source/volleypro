@echo off
chcp 65001 >nul
cls
echo.
echo ╔═══════════════════════════════════════╗
echo ║   🔥 CORRIGIR ERROS AGORA            ║
echo ╚═══════════════════════════════════════╝
echo.
echo Corrigindo 3 erros críticos:
echo.
echo   1. Sintaxe linha 4795 (\\n quebrado)
echo   2. teamData undefined (linha 4801)
echo   3. user.name crash (linha 4866)
echo.
echo Executando correção...
echo.

python fix_errors.py

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ╔═══════════════════════════════════════╗
  echo ║   ✅ CORREÇÕES APLICADAS             ║
  echo ╚═══════════════════════════════════════╝
  echo.
  echo Fazendo commit...
  git add supabase/functions/server/index.tsx
  git commit -m "🔥 FIX: 3 bugs críticos backend corrigidos - Linha 4795: sintaxe \\n quebrado - Linha 4801: teamData simplificado - Linha 4866: user.name crash corrigido"
  
  echo.
  echo Enviando para produção...
  git push origin main
  
  echo.
  echo ╔═══════════════════════════════════════╗
  echo ║   ✅ DEPLOY INICIADO!                ║
  echo ║   ⏰ Aguarde 2-3 minutos             ║
  echo ╚═══════════════════════════════════════╝
  echo.
  
) else (
  echo.
  echo ╔═══════════════════════════════════════╗
  echo ║   ❌ ERRO NA CORREÇÃO                ║
  echo ╚═══════════════════════════════════════╝
  echo.
  echo Tente:
  echo   1. Instalar Python: python.org
  echo   2. Ou editar manualmente o arquivo
  echo.
)

pause

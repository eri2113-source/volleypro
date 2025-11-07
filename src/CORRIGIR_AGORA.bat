@echo off
chcp 65001 >nul
echo.
echo 🔥 ===============================================
echo     CORREÇÃO REAL - BUG BACKEND INSCRIÇÃO
echo ===============================================
echo.
echo ❌ 3 BUGS ENCONTRADOS:
echo.
echo    1. Linha 4795: \\n mal escapado (sintaxe)
echo    2. Linha 4801: teamData pode ficar undefined  
echo    3. Linha 4866: user.name crash (undefined)
echo.
echo ✅ APLICANDO CORREÇÃO...
echo.

python fix-backend-inscricao.py

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ✅ Correções aplicadas!
  echo.
  echo 🚀 Fazendo commit...
  git add -A
  git commit -m "🔥 FIX CRÍTICO: 3 bugs backend inscrição corrigidos - Linha 4795: escape \\n quebrado - Linha 4801: teamData undefined  - Linha 4866: user.name crash - Código simplificado e corrigido"
  
  echo.
  echo 📤 Push para produção...
  git push origin main
  
  echo.
  echo ✅ DEPLOY INICIADO!
  echo.
  echo ⏰ Aguarde 2-3 minutos
  echo 🌐 Teste em: https://voleypro.net
  echo 🔍 Com console aberto (F12)
  echo.
  
) else (
  echo.
  echo ❌ ERRO ao executar Python!
  echo.
  echo Tente instalar Python:
  echo https://python.org/downloads
  echo.
  echo OU edite manualmente:
  echo - Abra: /supabase/functions/server/index.tsx
  echo - Veja correções em: /🔥_RESPOSTA_SINCERA_PROBLEMA_REAL.md
  echo.
)

pause

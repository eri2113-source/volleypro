@echo off
echo ========================================
echo  🚨 CORRIGINDO INSCRICAO LMV URGENTE
echo ========================================
echo.

echo [1/4] Corrigindo backend...
python fix_user_name.py
if errorlevel 1 (
    echo ❌ Erro ao corrigir backend
    pause
    exit /b 1
)
echo ✅ Backend corrigido!
echo.

echo [2/4] Adicionando arquivos...
git add -A
echo ✅ Arquivos adicionados!
echo.

echo [3/4] Fazendo commit...
git commit -m "🔥 URGENTE: Corrigido botão Inscrever Time - LMV hoje"
echo ✅ Commit realizado!
echo.

echo [4/4] Enviando para produção...
git push origin main
if errorlevel 1 (
    echo ❌ Erro no push
    pause
    exit /b 1
)
echo.

echo ========================================
echo  ✅ DEPLOY INICIADO COM SUCESSO!
echo ========================================
echo.
echo 📍 Acompanhe em: https://vercel.com/dashboard
echo 📍 Site: https://voleypro.net
echo.
echo ⏱️  Aguarde 2-3 minutos para o deploy completar
echo.
pause

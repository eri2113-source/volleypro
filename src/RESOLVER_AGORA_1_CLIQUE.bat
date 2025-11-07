@echo off
chcp 65001 > nul
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║     🚨 RESOLVER INSCRIÇÃO LMV - 1 CLIQUE                     ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📋 O QUE ESTE SCRIPT FAZ:
echo    ✅ Adiciona as correções ao Git
echo    ✅ Cria commit com inscrição direta
echo    ✅ Envia para GitHub
echo    ✅ Vercel faz deploy automático
echo.
echo ⚠️  CERTIFIQUE-SE:
echo    • Você está na pasta do projeto VolleyPro
echo    • Tem Git configurado
echo    • Está conectado ao GitHub
echo.
pause
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📦 PASSO 1/3: Adicionando arquivo ao Git...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git add components/TournamentDetailsModal.tsx
if errorlevel 1 (
    echo ❌ ERRO ao adicionar arquivo!
    pause
    exit /b 1
)
echo ✅ Arquivo adicionado com sucesso!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 💾 PASSO 2/3: Criando commit...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git commit -m "🚨 URGENTE LMV: Inscrição direta em 1 clique - torneio hoje!"
if errorlevel 1 (
    echo ❌ ERRO ao criar commit!
    echo.
    echo 💡 Possíveis causas:
    echo    • Não há mudanças para commitar
    echo    • Git não está configurado
    echo.
    pause
    exit /b 1
)
echo ✅ Commit criado com sucesso!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 PASSO 3/3: Enviando para GitHub e Vercel...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git push
if errorlevel 1 (
    echo ❌ ERRO ao enviar para GitHub!
    echo.
    echo 💡 Possíveis causas:
    echo    • Não está conectado ao GitHub
    echo    • Branch não existe no remoto
    echo.
    echo 🔧 Tente executar manualmente:
    echo    git push origin main
    echo.
    pause
    exit /b 1
)
echo ✅ Código enviado com sucesso!
echo.

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║     ✅ DEPLOY COMPLETO!                                      ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo ⏱️  PRÓXIMOS PASSOS (2-3 MINUTOS):
echo.
echo    1️⃣  Aguarde o build terminar no Vercel
echo       → Acesse: https://vercel.com
echo       → Veja o status do deploy
echo.
echo    2️⃣  Quando terminar, limpe o cache:
echo       → Pressione: Ctrl + Shift + R
echo       → Ou use: voleypro.net/?clear_cache=true
echo.
echo    3️⃣  Teste a inscrição:
echo       → Abra o torneio LMV
echo       → Clique em "Inscrever Meu Time"
echo       → Deve inscrever DIRETO (sem modal)!
echo.
echo 📊 LOGS QUE VÃO APARECER:
echo    🎯 ====== BOTÃO INSCREVER CLICADO ======
echo    🚨 INSCREVENDO DIRETAMENTE - EMERGÊNCIA LMV
echo    📝 Chamando API de inscrição...
echo    ✅ SUCESSO! Time inscrito!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause

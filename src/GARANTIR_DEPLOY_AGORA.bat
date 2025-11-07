@echo off
chcp 65001 > nul
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║     🚨 DEPLOY GARANTIDO - VERSÃO 14:30                       ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📝 O QUE ESTE SCRIPT FAZ:
echo    1️⃣  Mostra o status atual do Git
echo    2️⃣  Adiciona TODOS os arquivos modificados
echo    3️⃣  Cria commit com timestamp
echo    4️⃣  Faz push para GitHub
echo    5️⃣  Vercel faz deploy automático
echo.
pause
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📋 VERIFICANDO STATUS DO GIT...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git status
echo.
echo ⚠️  Você vê "modified: components/TournamentDetailsModal.tsx" acima?
echo    • SIM → Perfeito, vamos continuar!
echo    • NÃO → Algo está errado, pressione Ctrl+C para parar
echo.
pause
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📦 PASSO 1/4: Adicionando TODOS os arquivos...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git add -A
if errorlevel 1 (
    echo ❌ ERRO ao adicionar arquivos!
    pause
    exit /b 1
)
echo ✅ Todos os arquivos adicionados!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 💾 PASSO 2/4: Criando commit com timestamp...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git commit -m "🚨 LMV URGENTE [14:30]: Inscricao direta com logs detalhados - torneio HOJE!"
if errorlevel 1 (
    echo ⚠️  Nenhuma mudança para commitar OU erro no Git
    echo.
    echo 🔍 Verificando novamente o status:
    git status
    echo.
    pause
    exit /b 1
)
echo ✅ Commit criado com sucesso!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 PASSO 3/4: Enviando para GitHub (pode demorar 10-30s)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git push
if errorlevel 1 (
    echo ❌ ERRO ao enviar para GitHub!
    echo.
    echo 💡 Possíveis soluções:
    echo    1. Tente: git push origin main
    echo    2. Verifique sua conexão
    echo    3. Confirme que está logado no GitHub
    echo.
    pause
    exit /b 1
)
echo ✅ Código enviado para GitHub com sucesso!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ⏱️  PASSO 4/4: Vercel está fazendo o build...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    ✅ Push concluído!
echo    ⏰ Aguarde 2-3 minutos para o Vercel terminar o build
echo    🔗 Acompanhe em: https://vercel.com/seu-projeto/deployments
echo.

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║     ✅ DEPLOY INICIADO COM SUCESSO!                          ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo ⏱️  PRÓXIMOS PASSOS (AGUARDAR 2-3 MIN):
echo.
echo    1️⃣  Aguarde o build terminar no Vercel
echo       → Status: https://vercel.com
echo.
echo    2️⃣  Quando terminar, LIMPE O CACHE:
echo       → Feche TODAS as abas de voleypro.net
echo       → Abra nova aba ANÔNIMA (Ctrl + Shift + N)
echo       → Acesse: https://voleypro.net
echo       → Ou pressione: Ctrl + Shift + Del e limpe tudo
echo.
echo    3️⃣  Abra o Console (F12) e teste:
echo       → Clique em Torneios
echo       → Abra o LMV
echo       → Clique em "Inscrever Meu Time"
echo.
echo    4️⃣  DEVE APARECER NO CONSOLE:
echo       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo       🎯 ====== BOTÃO INSCREVER CLICADO [VERSÃO 14:30] ======
echo       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo       📊 Estado atual: {...}
echo.
echo       🚨 MODO: INSCRICÃO DIRETA (SEM MODAL)
echo       🚨 EMERGÊNCIA: TORNEIO LMV HOJE
echo.
echo       ⏳ PASSO 1: Preparando inscrição...
echo       📝 PASSO 2: Chamando API registerSquad...
echo.
echo       ✅ ===== SUCESSO! TIME INSCRITO! =====
echo       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🔍 SE NÃO APARECER "[VERSÃO 14:30]":
echo    • O cache não foi limpo corretamente
echo    • Use aba anônima: Ctrl + Shift + N
echo    • Ou limpe todo o cache: Ctrl + Shift + Del
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause

@echo off
chcp 65001 > nul
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║               🔥 DEPLOY VISUAL - VOCÊ VAI VER!               ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 O QUE MUDOU:
echo.
echo    O botão vai mudar de:
echo    ❌ "Inscrever Meu Time"
echo.
echo    Para:
echo    ✅ "✅ INSCREVER AGORA (1 CLIQUE)"
echo.
echo    Assim você VAI VER se atualizou ou não!
echo.
pause
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📦 PASSO 1/3: Adicionando arquivo...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git add components/TournamentDetailsModal.tsx
if errorlevel 1 (
    echo ❌ ERRO! Você está na pasta correta?
    echo 💡 Execute este script dentro da pasta do projeto VolleyPro
    pause
    exit /b 1
)
echo ✅ Arquivo adicionado!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 💾 PASSO 2/3: Criando commit...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git commit -m "INSCRICAO DIRETA LMV - BOTAO VISIVEL 14:45"
if errorlevel 1 (
    echo ❌ ERRO ao criar commit!
    echo.
    echo 💡 Isso pode significar:
    echo    • Não há mudanças para commitar
    echo    • O arquivo não foi modificado
    echo.
    pause
    exit /b 1
)
echo ✅ Commit criado!
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 PASSO 3/3: Enviando para GitHub...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git push
if errorlevel 1 (
    echo ❌ ERRO ao enviar!
    echo.
    echo 💡 Tente manualmente:
    echo    git push origin main
    echo.
    pause
    exit /b 1
)
echo ✅ Enviado com sucesso!
echo.

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║               ✅ DEPLOY INICIADO COM SUCESSO!                ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo ⏱️  PRÓXIMOS PASSOS (2-3 MIN):
echo.
echo    1️⃣  Aguarde build terminar em: https://vercel.com
echo.
echo    2️⃣  Feche TODAS as abas de voleypro.net
echo.
echo    3️⃣  Abra aba ANÔNIMA:
echo       Windows: Ctrl + Shift + N
echo       Mac: Cmd + Shift + N
echo.
echo    4️⃣  Acesse: https://voleypro.net
echo.
echo    5️⃣  Vá em Torneios ^> Abra LMV
echo.
echo    6️⃣  PROCURE PELO BOTÃO:
echo.
echo       ┌─────────────────────────────────┐
echo       │ ✅ INSCREVER AGORA (1 CLIQUE)  │
echo       └─────────────────────────────────┘
echo.
echo       ↑↑↑ SE VER ESSE TEXTO = FUNCIONOU! ↑↑↑
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🔍 COMO TESTAR:
echo.
echo    ✅ DEU CERTO:
echo       Botão mostra: "✅ INSCREVER AGORA (1 CLIQUE)"
echo       Clica no botão → Inscreve DIRETO → Toast verde
echo.
echo    ❌ NÃO DEU CERTO:
echo       Botão mostra: "Inscrever Meu Time"
echo       Isso significa que o cache não foi limpo
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📸 Me envie print do botão depois!
echo.
pause

@echo off
echo ========================================
echo   INSCRICAO LMV - CONSERTANDO AGORA
echo ========================================
echo.
echo [1/3] Fazendo commit...
git add .
git commit -m "BOTAO VERDE INSCRICAO - CACHE BUSTER"
echo.
echo [2/3] Enviando para producao...
git push
echo.
echo [3/3] PRONTO!
echo.
echo ========================================
echo   AGUARDE 90 SEGUNDOS
echo ========================================
echo.
echo Depois:
echo   1. Va em https://voleypro.net
echo   2. Pressione Ctrl + Shift + Delete
echo   3. Limpe "Imagens e arquivos em cache"
echo   4. Feche e abra o navegador
echo   5. BOTAO VERDE "INSCREVER AGORA"
echo.
echo ========================================
pause

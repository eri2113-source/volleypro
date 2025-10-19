@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 🚀 SCRIPT DE PUBLICAÇÃO AUTOMÁTICA - VOLLEYPRO
REM Este script substitui o botão "Publicar" do Figma Make
REM Uso: Duplo clique em publicar.bat

title VolleyPro - Publicação Automática

echo.
echo 🏐 VolleyPro - Publicação Automática
echo ======================================
echo.

REM Verificar se há mudanças
git status -s >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Git não encontrado. Instale o Git primeiro.
    echo.
    pause
    exit /b 1
)

REM Verificar mudanças
for /f %%i in ('git status -s ^| find /c /v ""') do set count=%%i
if !count! equ 0 (
    echo ⚠️  Nenhuma mudança detectada para publicar.
    echo.
    pause
    exit /b 0
)

REM Mostrar arquivos modificados
echo 📝 Arquivos modificados:
git status -s
echo.

REM Pedir confirmação
set /p confirmacao="✅ Deseja publicar estas mudanças? (S/n): "
if /i not "!confirmacao!"=="S" if /i not "!confirmacao!"=="" (
    echo ❌ Publicação cancelada.
    pause
    exit /b 0
)

REM Pedir mensagem
set /p mensagem="💬 Mensagem da atualização (ou ENTER para usar padrão): "
if "!mensagem!"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set data=%%a/%%b/%%c
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set hora=%%a:%%b
    set "mensagem=Atualização automática - !data! !hora!"
)

echo.
echo 🔄 Publicando mudanças...
echo.

REM Adicionar todos os arquivos
echo 1/3 Adicionando arquivos...
git add .

REM Fazer commit
echo 2/3 Criando commit...
git commit -m "!mensagem!"

REM Fazer push
echo 3/3 Enviando para produção...
git push origin main

echo.
echo ✅ PUBLICAÇÃO CONCLUÍDA!
echo.
echo ⏱️  Seu site estará atualizado em 3-5 minutos em:
echo 🌐 https://volleypro-zw96.vercel.app
echo.
echo 💡 Dica: Limpe o cache do navegador (Ctrl+Shift+R) para ver as mudanças
echo.
pause

@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════
echo   🧹 Limpar Cache e Rebuild
echo ════════════════════════════════════════════════════════
echo.

echo 🗑️  Removendo cache do Vite...

if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo   ✓ Cache .vite removido
)

if exist "dist" (
    rmdir /s /q "dist"
    echo   ✓ Pasta dist removida
)

echo.
echo ✅ Cache removido!
echo.

echo 🔄 Reiniciando servidor de desenvolvimento...
echo.
echo Pressione Ctrl+C para parar o servidor quando terminar
echo.

npm run dev

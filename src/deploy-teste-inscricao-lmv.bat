@echo off
chcp 65001 >nul
echo.
echo 🚀 DEPLOY URGENTE - TESTE INSCRIÇÃO LMV
echo ========================================
echo.
echo 📝 Mensagem modal corrigida:
echo    ✅ 'Processando inscrição no torneio...'
echo    ✅ '⚡ Aguarde, registrando seu time...'
echo.
echo 🔧 Correções aplicadas:
echo    ✅ Removido setLoading duplicado
echo    ✅ Mensagens adequadas durante processo
echo    ✅ Logs detalhados mantidos
echo.

REM Adicionar todos os arquivos
git add -A

REM Commit
git commit -m "🔥 CORREÇÃO URGENTE: Modal inscrição torneio - mensagens corretas - ✅ Corrigido: Mensagem 'Processando inscrição no torneio...' durante loading - Visual '⚡ Aguarde, registrando seu time...' - Removido setLoading duplicado linha 125 - Logs super detalhados para debug em produção - 🎯 Para testar: 1. Abrir F12 (console) 2. Tentar inscrever time no LMV 3. Verificar mensagens e logs 4. Confirmar se inscrição completa"

REM Push
echo.
echo 📤 Fazendo push para produção...
git push origin main

echo.
echo ✅ DEPLOY CONCLUÍDO!
echo.
echo ⏰ PRÓXIMOS PASSOS:
echo 1. Aguardar 2-3 minutos para Vercel fazer deploy
echo 2. Acessar https://voleypro.net
echo 3. Abrir Console (F12)
echo 4. Testar inscrição no torneio LMV
echo.
echo 🔍 O QUE OBSERVAR NO CONSOLE:
echo    ✅ Se aparecer '✅ API RETORNOU SUCESSO' = FUNCIONOU!
echo    ❌ Se aparecer '❌ ERRO' = ver mensagem exata do erro
echo.
echo 📱 TESTE:
echo    1. Ir em Torneios
echo    2. Clicar em LMV
echo    3. Clicar 'Inscrever Time'
echo    4. Acompanhar modal e console
echo.
pause

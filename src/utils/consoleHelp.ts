/**
 * Mensagens de ajuda no console
 */

export function showConsoleHelp() {
  const styles = {
    title: 'color: #0066ff; font-size: 24px; font-weight: bold;',
    subtitle: 'color: #ff6b35; font-size: 16px; font-weight: bold;',
    success: 'color: #22c55e; font-weight: bold;',
    error: 'color: #ef4444; font-weight: bold;',
    info: 'color: #3b82f6;',
    warning: 'color: #f59e0b; font-weight: bold;',
    code: 'background: #f1f5f9; padding: 2px 6px; border-radius: 3px; color: #0f172a; font-family: monospace;'
  };

  console.clear();
  console.log('%c🏐 VolleyPro', styles.title);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('');
  
  console.log('%c📦 VERSÃO: 2.1.0-camera-fix', styles.success);
  console.log('%c✨ Correções de Câmera Implementadas!', styles.success);
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('%c🎥 O QUE FOI CORRIGIDO:', styles.subtitle);
  console.log('');
  console.log('  ✅ Teste de câmera ANTES de criar live');
  console.log('  ✅ Preview da câmera em tempo real');
  console.log('  ✅ Mensagens de erro claras e acionáveis');
  console.log('  ✅ Guia visual de como permitir câmera');
  console.log('  ✅ Detecção automática do navegador');
  console.log('  ✅ Sistema centralizado de permissões');
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('%c🧪 COMO TESTAR:', styles.subtitle);
  console.log('');
  console.log('  1️⃣  Vá para a seção %cLives', styles.info, styles.code);
  console.log('  2️⃣  Clique em %cIniciar Transmissão', styles.info, styles.code);
  console.log('  3️⃣  Preencha o título (ex: "Teste")');
  console.log('  4️⃣  Clique em %cIniciar Agora', styles.info, styles.code);
  console.log('  5️⃣  Você verá a tela de %cTESTE DE CÂMERA', styles.info, styles.code);
  console.log('  6️⃣  Clique em %cTestar Câmera', styles.info, styles.code);
  console.log('  7️⃣  Permita quando o navegador pedir');
  console.log('  8️⃣  ✅ Preview da câmera aparece!');
  console.log('  9️⃣  Live é criada automaticamente');
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('%c⚠️ NÃO VÊ AS MUDANÇAS?', styles.warning);
  console.log('');
  console.log('  🔧 Solução: Clique no botão %cLimpar Cache%c no canto inferior direito', styles.info, styles.code, styles.info);
  console.log('  🔄 Ou pressione: %cCtrl + Shift + R%c (Windows) ou %cCmd + Shift + R%c (Mac)', styles.info, styles.code, styles.info, styles.code, styles.info);
  console.log('  🗑️  Ou acesse: %c?clear_cache=true%c na URL', styles.info, styles.code, styles.info);
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('%c🐛 DEBUG:', styles.subtitle);
  console.log('');
  console.log('  📊 Para ver informações detalhadas:');
  console.log('    • Abra o componente %cVersionChecker%c (canto inferior direito)', '', styles.code, '');
  console.log('    • Verifique se a versão é %c2.1.0-camera-fix', '', styles.code);
  console.log('    • Se não for, clique em %cLimpar Cache', '', styles.code);
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('%c💡 DICA:', styles.info);
  console.log('  O botão de versão fica no canto inferior direito da tela');
  console.log('  Clique nele para ver informações e limpar cache');
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #e2e8f0;');
  console.log('');
}

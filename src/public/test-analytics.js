// 🧪 SCRIPT DE TESTE COMPLETO - GOOGLE ANALYTICS 4
// Cole este código no Console do navegador (F12)

console.log('%c🧪 TESTE COMPLETO GOOGLE ANALYTICS 4', 'background: #4285f4; color: white; font-size: 20px; padding: 10px;');
console.log('Executando verificações...\n');

// ==========================================
// 1️⃣ VERIFICAR GTAG
// ==========================================
console.log('%c1️⃣ Verificando gtag...', 'color: #fbbc04; font-size: 16px;');
if (typeof gtag === 'function') {
  console.log('%c   ✅ gtag está definido e funcionando!', 'color: #0f9d58;');
} else {
  console.log('%c   ❌ gtag NÃO está definido!', 'color: #db4437;');
  console.log('   Possível causa: Script do GA4 não carregou');
}

// ==========================================
// 2️⃣ VERIFICAR DATALAYER
// ==========================================
console.log('\n%c2️⃣ Verificando dataLayer...', 'color: #fbbc04; font-size: 16px;');
if (window.dataLayer && Array.isArray(window.dataLayer)) {
  console.log('%c   ✅ dataLayer existe!', 'color: #0f9d58;');
  console.log('   Total de eventos:', window.dataLayer.length);
  
  // Filtrar eventos
  const events = window.dataLayer.filter(item => item && item.event);
  if (events.length > 0) {
    console.log('%c   ✅ Eventos encontrados:', 'color: #0f9d58;');
    events.forEach(evt => {
      console.log(`      • ${evt.event}`, evt);
    });
  } else {
    console.log('%c   ⚠️  Nenhum evento encontrado ainda', 'color: #f4b400;');
  }
  
  // Verificar config do GA4
  const ga4Config = window.dataLayer.find(item => 
    Array.isArray(item) && item[0] === 'config' && item[1]?.includes('G-')
  );
  if (ga4Config) {
    console.log('%c   ✅ Configuração GA4 encontrada:', 'color: #0f9d58;');
    console.log('      ID:', ga4Config[1]);
    console.log('      Config:', ga4Config[2]);
  }
} else {
  console.log('%c   ❌ dataLayer NÃO existe!', 'color: #db4437;');
}

// ==========================================
// 3️⃣ VERIFICAR SCRIPTS CARREGADOS
// ==========================================
console.log('\n%c3️⃣ Verificando scripts do Google...', 'color: #fbbc04; font-size: 16px;');

const gtagScript = document.querySelector('script[src*="googletagmanager.com/gtag"]');
if (gtagScript) {
  console.log('%c   ✅ Script gtag.js carregado:', 'color: #0f9d58;');
  console.log('     ', gtagScript.src);
} else {
  console.log('%c   ❌ Script gtag.js NÃO encontrado!', 'color: #db4437;');
}

const gtmScript = document.querySelector('script[src*="gtm.js"]');
if (gtmScript) {
  console.log('%c   ✅ Script GTM carregado:', 'color: #0f9d58;');
  console.log('     ', gtmScript.src);
} else {
  console.log('%c   ⚠️  Script GTM não encontrado (pode estar inline)', 'color: #f4b400;');
}

// Verificar todos os scripts do Google
const allGoogleScripts = Array.from(document.scripts).filter(s => 
  s.src.includes('google')
);
if (allGoogleScripts.length > 0) {
  console.log(`\n   📦 Total de scripts do Google: ${allGoogleScripts.length}`);
  allGoogleScripts.forEach((s, i) => {
    console.log(`      ${i + 1}. ${s.src}`);
  });
}

// ==========================================
// 4️⃣ VERIFICAR COOKIES GA4
// ==========================================
console.log('\n%c4️⃣ Verificando cookies do GA4...', 'color: #fbbc04; font-size: 16px;');
const cookies = document.cookie.split(';').map(c => c.trim());
const ga4Cookies = cookies.filter(c => c.startsWith('_ga'));
if (ga4Cookies.length > 0) {
  console.log('%c   ✅ Cookies do GA4 encontrados:', 'color: #0f9d58;');
  ga4Cookies.forEach(c => console.log('     ', c.split('=')[0]));
} else {
  console.log('%c   ⚠️  Nenhum cookie do GA4 (normal em primeira visita)', 'color: #f4b400;');
}

// ==========================================
// 5️⃣ ENVIAR EVENTO DE TESTE
// ==========================================
console.log('\n%c5️⃣ Enviando evento de teste...', 'color: #fbbc04; font-size: 16px;');
if (typeof gtag === 'function') {
  try {
    const testEventName = 'verificacao_console_' + Date.now();
    gtag('event', testEventName, {
      'event_category': 'teste_analytics',
      'event_label': 'verificacao_completa',
      'value': 1,
      'timestamp': new Date().toISOString()
    });
    console.log('%c   ✅ Evento enviado com sucesso!', 'color: #0f9d58;');
    console.log('      Nome:', testEventName);
    console.log('      Verifique o dataLayer abaixo:');
    
    // Aguardar um pouco e mostrar dataLayer atualizado
    setTimeout(() => {
      console.log('\n   📊 dataLayer atualizado:');
      console.log(window.dataLayer);
    }, 100);
  } catch (error) {
    console.log('%c   ❌ Erro ao enviar evento:', 'color: #db4437;');
    console.error('     ', error);
  }
} else {
  console.log('%c   ❌ Não foi possível enviar evento (gtag não definido)', 'color: #db4437;');
}

// ==========================================
// 6️⃣ VERIFICAR NETWORK (REQUESTS)
// ==========================================
console.log('\n%c6️⃣ Verificação de Network', 'color: #fbbc04; font-size: 16px;');
console.log('   💡 Abra a aba "Network" no DevTools');
console.log('   💡 Filtre por "collect" ou "google-analytics"');
console.log('   💡 Recarregue a página para ver requests do GA4');
console.log('   ✅ Se houver requests para analytics.google.com = funcionando!');

// ==========================================
// 7️⃣ INFORMAÇÕES DO GA4
// ==========================================
console.log('\n%c7️⃣ Informações de configuração', 'color: #fbbc04; font-size: 16px;');
console.log('   📌 ID GA4:', 'G-34HHBM1L6C');
console.log('   📌 ID GTM:', 'GTM-MV9D2M4P');
console.log('   📌 URL:', window.location.href);
console.log('   📌 Hostname:', window.location.hostname);

// ==========================================
// 8️⃣ VERIFICAÇÃO FINAL
// ==========================================
console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #999;');
console.log('%c📋 RESULTADO FINAL', 'background: #4285f4; color: white; font-size: 18px; padding: 5px;');

let score = 0;
let total = 0;

// Check 1: gtag
total++;
if (typeof gtag === 'function') {
  console.log('%c✅ gtag funcionando', 'color: #0f9d58;');
  score++;
} else {
  console.log('%c❌ gtag NÃO funcionando', 'color: #db4437;');
}

// Check 2: dataLayer
total++;
if (window.dataLayer && window.dataLayer.length > 0) {
  console.log('%c✅ dataLayer populado', 'color: #0f9d58;');
  score++;
} else {
  console.log('%c❌ dataLayer vazio', 'color: #db4437;');
}

// Check 3: Script carregado
total++;
if (gtagScript) {
  console.log('%c✅ Script GA4 carregado', 'color: #0f9d58;');
  score++;
} else {
  console.log('%c❌ Script GA4 não carregado', 'color: #db4437;');
}

// Check 4: Eventos
total++;
const hasEvents = window.dataLayer && window.dataLayer.some(item => item && item.event);
if (hasEvents) {
  console.log('%c✅ Eventos sendo rastreados', 'color: #0f9d58;');
  score++;
} else {
  console.log('%c❌ Nenhum evento rastreado', 'color: #db4437;');
}

console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #999;');

const percentage = Math.round((score / total) * 100);
const status = percentage === 100 ? 'PERFEITO! ✨' : 
               percentage >= 75 ? 'BOM ✓' : 
               percentage >= 50 ? 'PARCIAL ⚠️' : 
               'PROBLEMA ❌';

console.log(`%c📊 PONTUAÇÃO: ${score}/${total} (${percentage}%)`, 'font-size: 18px; font-weight: bold;');
console.log(`%c🎯 STATUS: ${status}`, 'font-size: 16px;');

if (percentage === 100) {
  console.log('\n%c🎉 TUDO FUNCIONANDO PERFEITAMENTE!', 'background: #0f9d58; color: white; font-size: 16px; padding: 10px;');
  console.log('%cO Google Analytics 4 está instalado e funcionando corretamente!', 'color: #0f9d58;');
  console.log('\n📌 Próximos passos:');
  console.log('   1. Aguardar 1-2 minutos');
  console.log('   2. Abrir Google Analytics > Tempo Real');
  console.log('   3. Verificar se você aparece como usuário ativo');
} else if (percentage >= 75) {
  console.log('\n%c✓ QUASE LÁ!', 'background: #f4b400; color: white; font-size: 16px; padding: 10px;');
  console.log('%cA maioria das verificações passou. Pode ser questão de tempo.', 'color: #f4b400;');
  console.log('\n📌 Sugestões:');
  console.log('   1. Aguardar mais alguns minutos');
  console.log('   2. Recarregar a página (Ctrl+Shift+R)');
  console.log('   3. Executar este teste novamente');
} else {
  console.log('\n%c❌ PROBLEMAS DETECTADOS', 'background: #db4437; color: white; font-size: 16px; padding: 10px;');
  console.log('%cO Google Analytics não está funcionando corretamente.', 'color: #db4437;');
  console.log('\n📌 Soluções:');
  console.log('   1. Limpar cache do navegador (Ctrl+Shift+Delete)');
  console.log('   2. Desativar bloqueadores de anúncios');
  console.log('   3. Testar em modo anônimo');
  console.log('   4. Aguardar deploy completar');
  console.log('   5. Verificar se variáveis de ambiente estão corretas');
}

console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #999;');
console.log('%c💡 DICAS', 'font-size: 16px; font-weight: bold;');
console.log('• Para ver o dataLayer completo, digite: dataLayer');
console.log('• Para enviar evento manual, digite: gtag("event", "teste")');
console.log('• Para limpar console, digite: clear()');
console.log('• Para executar teste novamente, recarregue esta página');

console.log('\n%c🔗 LINKS ÚTEIS', 'font-size: 16px; font-weight: bold;');
console.log('• Google Analytics:', 'https://analytics.google.com/');
console.log('• Tempo Real:', 'https://analytics.google.com/analytics/web/#/realtime/');
console.log('• Tag Assistant:', 'https://tagassistant.google.com/');

console.log('\n%cTeste concluído! 🎉', 'color: #4285f4; font-size: 14px;');

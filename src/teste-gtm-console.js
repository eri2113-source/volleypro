// 🔍 TESTE AUTOMÁTICO DO GOOGLE TAG MANAGER
// Cole este código no Console do navegador (F12 > Console)
// no site: https://volleypro-zw96.vercel.app

console.clear();
console.log('%c🔍 DIAGNÓSTICO GOOGLE TAG MANAGER', 'font-size: 20px; font-weight: bold; color: #4285f4;');
console.log('');

// Teste 1: Verificar dataLayer
console.log('%c1️⃣ Testando window.dataLayer...', 'font-size: 16px; font-weight: bold;');
if (typeof window.dataLayer !== 'undefined') {
  console.log('%c✅ SUCESSO! dataLayer encontrado!', 'color: green; font-weight: bold;');
  console.log('Conteúdo:', window.dataLayer);
  console.log('Total de eventos:', window.dataLayer.length);
} else {
  console.log('%c❌ ERRO! dataLayer não encontrado!', 'color: red; font-weight: bold;');
  console.log('Isso significa que o GTM não foi carregado.');
}
console.log('');

// Teste 2: Verificar script GTM no HTML
console.log('%c2️⃣ Procurando scripts GTM no HTML...', 'font-size: 16px; font-weight: bold;');
const scripts = Array.from(document.scripts);
const gtmScripts = scripts.filter(s => s.src.includes('googletagmanager.com'));
if (gtmScripts.length > 0) {
  console.log('%c✅ SUCESSO! Script GTM encontrado!', 'color: green; font-weight: bold;');
  gtmScripts.forEach((script, i) => {
    console.log(`Script ${i + 1}:`, script.src);
  });
} else {
  console.log('%c❌ ERRO! Script GTM não encontrado!', 'color: red; font-weight: bold;');
  console.log('Verifique se o deploy foi feito corretamente.');
}
console.log('');

// Teste 3: Verificar ID do container
console.log('%c3️⃣ Verificando ID do container GTM...', 'font-size: 16px; font-weight: bold;');
const htmlContent = document.documentElement.outerHTML;
const gtmIdMatch = htmlContent.match(/GTM-[A-Z0-9]+/g);
if (gtmIdMatch && gtmIdMatch.includes('GTM-MV9D2M4P')) {
  console.log('%c✅ SUCESSO! ID GTM-MV9D2M4P encontrado!', 'color: green; font-weight: bold;');
  console.log('IDs encontrados:', gtmIdMatch);
} else if (gtmIdMatch) {
  console.log('%c⚠️ ATENÇÃO! ID diferente encontrado:', 'color: orange; font-weight: bold;');
  console.log('IDs encontrados:', gtmIdMatch);
  console.log('ID esperado: GTM-MV9D2M4P');
} else {
  console.log('%c❌ ERRO! Nenhum ID GTM encontrado!', 'color: red; font-weight: bold;');
  console.log('O código GTM não está no HTML.');
}
console.log('');

// Teste 4: Verificar iframe noscript
console.log('%c4️⃣ Verificando iframe noscript...', 'font-size: 16px; font-weight: bold;');
const noscriptIframe = Array.from(document.getElementsByTagName('noscript'))
  .some(ns => ns.textContent.includes('googletagmanager.com'));
if (noscriptIframe || htmlContent.includes('googletagmanager.com/ns.html')) {
  console.log('%c✅ SUCESSO! Iframe noscript encontrado!', 'color: green; font-weight: bold;');
} else {
  console.log('%c⚠️ Iframe noscript não encontrado', 'color: orange; font-weight: bold;');
  console.log('(Isso é normal se JavaScript está habilitado)');
}
console.log('');

// Teste 5: Verificar ambiente
console.log('%c5️⃣ Verificando ambiente...', 'font-size: 16px; font-weight: bold;');
const hostname = window.location.hostname;
const isProduction = hostname.includes('vercel.app');
const isFigmaMake = hostname.includes('figma');
if (isProduction) {
  console.log('%c✅ Você está em PRODUÇÃO (Vercel)!', 'color: green; font-weight: bold;');
  console.log('URL:', window.location.href);
} else if (isFigmaMake) {
  console.log('%c⚠️ ATENÇÃO! Você está no Figma Make!', 'color: orange; font-weight: bold;');
  console.log('O Google Ads só detecta tags em produção.');
  console.log('Acesse: https://volleypro-zw96.vercel.app');
} else {
  console.log('%c⚠️ Ambiente:', 'color: orange; font-weight: bold;');
  console.log('Hostname:', hostname);
}
console.log('');

// Resumo Final
console.log('%c📊 RESUMO FINAL:', 'font-size: 18px; font-weight: bold; color: #4285f4;');
console.log('');

let score = 0;
let total = 4;

if (typeof window.dataLayer !== 'undefined') score++;
if (gtmScripts.length > 0) score++;
if (gtmIdMatch && gtmIdMatch.includes('GTM-MV9D2M4P')) score++;
if (isProduction) score++;

if (score === total) {
  console.log('%c🎉 TUDO PERFEITO! GTM está funcionando 100%!', 'font-size: 16px; color: green; font-weight: bold; background: #e8f5e9; padding: 10px;');
  console.log('');
  console.log('✅ dataLayer: OK');
  console.log('✅ Script GTM: OK');
  console.log('✅ ID correto: GTM-MV9D2M4P');
  console.log('✅ Ambiente: Produção');
  console.log('');
  console.log('%c⏰ IMPORTANTE:', 'font-weight: bold;');
  console.log('O Google Ads pode levar até 24 horas para detectar a tag.');
  console.log('Sua tag está funcionando! Aguarde ou tente novamente mais tarde.');
} else if (score >= 2) {
  console.log('%c⚠️ GTM PARCIALMENTE INSTALADO', 'font-size: 16px; color: orange; font-weight: bold; background: #fff3e0; padding: 10px;');
  console.log('');
  console.log('Pontuação:', score + '/' + total);
  console.log('');
  console.log('Verifique os itens marcados com ❌ acima.');
} else {
  console.log('%c❌ GTM NÃO DETECTADO!', 'font-size: 16px; color: red; font-weight: bold; background: #ffebee; padding: 10px;');
  console.log('');
  console.log('Pontuação:', score + '/' + total);
  console.log('');
  console.log('🔧 AÇÕES NECESSÁRIAS:');
  console.log('1. Verifique se fez commit + push no GitHub');
  console.log('2. Aguarde 2-3 minutos após o push');
  console.log('3. Limpe o cache do navegador (Ctrl + Shift + Delete)');
  console.log('4. Abra em anônimo (Ctrl + Shift + N)');
  console.log('5. Force um novo deploy na Vercel');
}

console.log('');
console.log('%c📖 Mais ajuda: Leia o arquivo TESTE_GTM_PRODUCAO.md', 'color: #666;');
console.log('');

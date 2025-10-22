# ⚡ COMANDOS RÁPIDOS - TESTE GA4

## 🎯 COPIAR E COLAR NO CONSOLE

### **1️⃣ TESTE COMPLETO AUTOMÁTICO**

```javascript
fetch('https://volleypro-zw96.vercel.app/test-analytics.js').then(r => r.text()).then(eval);
```

---

### **2️⃣ VERIFICAÇÃO RÁPIDA (5 COMANDOS)**

```javascript
// Comando 1: Verificar gtag
console.log('1️⃣ gtag:', typeof gtag === 'function' ? '✅ OK' : '❌ ERRO');

// Comando 2: Verificar dataLayer
console.log('2️⃣ dataLayer:', window.dataLayer?.length > 0 ? `✅ ${window.dataLayer.length} eventos` : '❌ VAZIO');

// Comando 3: Ver eventos
console.log('3️⃣ Eventos:', dataLayer.filter(item => item?.event).map(e => e.event));

// Comando 4: Enviar teste
gtag('event', 'teste_console'); console.log('4️⃣ Evento enviado: ✅');

// Comando 5: Scripts carregados
console.log('5️⃣ Scripts:', document.querySelectorAll('script[src*="google"]').length, 'do Google');
```

---

### **3️⃣ UM LINER - STATUS COMPLETO**

```javascript
console.log(`%c📊 STATUS GA4\n\n✅ gtag: ${typeof gtag === 'function'}\n✅ dataLayer: ${window.dataLayer?.length || 0} eventos\n✅ Scripts: ${document.querySelectorAll('script[src*="google"]').length}\n✅ Cookies: ${document.cookie.includes('_ga') ? 'Sim' : 'Não'}\n\n${typeof gtag === 'function' && window.dataLayer?.length > 0 ? '🎉 FUNCIONANDO!' : '❌ PROBLEMA'}`, 'font-size: 16px; background: #f0f0f0; padding: 10px;');
```

---

### **4️⃣ VER TUDO DE UMA VEZ**

```javascript
console.table({
  'gtag definido': typeof gtag === 'function',
  'dataLayer existe': !!window.dataLayer,
  'Total eventos': window.dataLayer?.length || 0,
  'Scripts Google': document.querySelectorAll('script[src*="google"]').length,
  'Cookie _ga': document.cookie.includes('_ga'),
  'URL atual': window.location.href,
  'Hostname': window.location.hostname
});
```

---

### **5️⃣ ENVIAR EVENTO PERSONALIZADO**

```javascript
gtag('event', 'teste_manual_' + Date.now(), {
  event_category: 'verificacao',
  event_label: 'teste_console',
  value: 1,
  user_id: 'teste_' + Math.random().toString(36).substr(2, 9),
  timestamp: new Date().toISOString()
});
console.log('✅ Evento personalizado enviado! Verifique dataLayer:');
console.log(dataLayer.slice(-1)[0]);
```

---

### **6️⃣ VER ÚLTIMOS 5 EVENTOS**

```javascript
console.log('📊 Últimos 5 eventos:', dataLayer.slice(-5));
```

---

### **7️⃣ VERIFICAR NETWORK REQUESTS**

```javascript
// Execute este e depois olhe a aba Network
console.log('%c🌐 INSTRUÇÕES NETWORK', 'background: #4285f4; color: white; padding: 5px; font-size: 14px;');
console.log('1. Abra a aba "Network" no DevTools');
console.log('2. Filtre por: "collect" ou "google-analytics"');
console.log('3. Recarregue a página (Ctrl+R)');
console.log('4. Procure por requests para "analytics.google.com"');
console.log('5. ✅ Se houver requests = GA4 funcionando!');
```

---

### **8️⃣ LIMPAR CACHE E RECARREGAR**

```javascript
// CUIDADO: Vai recarregar a página!
if(confirm('⚠️ Isso vai recarregar a página e limpar o cache. Continuar?')) {
  console.log('🔄 Recarregando com cache limpo...');
  location.reload(true);
}
```

---

### **9️⃣ TESTE DE PAGEVIEW MANUAL**

```javascript
console.log('📄 Enviando pageview manual...');
gtag('event', 'page_view', {
  page_title: 'Teste Manual - ' + document.title,
  page_location: window.location.href,
  page_path: window.location.pathname,
  send_to: 'G-34HHBM1L6C'
});
console.log('✅ Pageview enviado! Aguarde 30s e verifique GA4 Tempo Real');
```

---

### **🔟 BENCHMARK COMPLETO**

```javascript
console.clear();
console.log('%c🚀 BENCHMARK GA4 - VOLLEYPRO', 'background: #0052cc; color: white; font-size: 20px; padding: 10px;');
console.log('\n');

const tests = {
  '1. gtag function': typeof gtag === 'function',
  '2. dataLayer array': Array.isArray(window.dataLayer),
  '3. dataLayer populated': window.dataLayer?.length > 0,
  '4. GTM script loaded': !!document.querySelector('script[src*="gtm.js"]'),
  '5. GA4 script loaded': !!document.querySelector('script[src*="gtag/js"]'),
  '6. Has events': window.dataLayer?.some(item => item?.event),
  '7. Has GA config': window.dataLayer?.some(item => Array.isArray(item) && item[1]?.includes('G-')),
  '8. Has cookies': document.cookie.includes('_ga'),
};

let passed = 0;
Object.entries(tests).forEach(([test, result]) => {
  console.log(`${result ? '✅' : '❌'} ${test}: ${result}`);
  if (result) passed++;
});

const score = Math.round((passed / Object.keys(tests).length) * 100);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`%c📊 PONTUAÇÃO: ${passed}/${Object.keys(tests).length} (${score}%)`, 'font-size: 16px; font-weight: bold;');

if (score === 100) {
  console.log('%c🎉 PERFEITO! GA4 100% FUNCIONAL!', 'background: #0f9d58; color: white; padding: 5px;');
} else if (score >= 75) {
  console.log('%c✓ BOM! Pequenos ajustes podem ser necessários', 'background: #f4b400; color: white; padding: 5px;');
} else if (score >= 50) {
  console.log('%c⚠️ PARCIAL. Aguarde alguns minutos ou limpe cache', 'background: #f4b400; color: white; padding: 5px;');
} else {
  console.log('%c❌ PROBLEMA. Verifique deploy e configurações', 'background: #db4437; color: white; padding: 5px;');
}

console.log('\n💡 Para detalhes, execute: fetch("https://volleypro-zw96.vercel.app/test-analytics.js").then(r=>r.text()).then(eval)');
```

---

## 📋 SEQUÊNCIA RECOMENDADA

Execute nesta ordem após o deploy:

1. **Aguardar 5 minutos** ⏱️
2. **Abrir o site** em uma aba
3. **F12** → Console
4. **Copiar comando 1** (Teste Completo Automático)
5. **Colar no Console**
6. **Enter** ⏎
7. **Ver resultado** 📊

---

## 🎯 O QUE CADA TESTE FAZ

| Comando | O que faz | Tempo |
|---------|-----------|-------|
| **1 - Teste Completo** | Executa 8 verificações automáticas | 3s |
| **2 - Verificação Rápida** | 5 checks básicos | 1s |
| **3 - One Liner** | Status resumido visual | Instantâneo |
| **4 - Ver Tudo** | Tabela com todas as informações | 1s |
| **5 - Evento Personalizado** | Envia evento e mostra no dataLayer | 1s |
| **6 - Últimos Eventos** | Mostra os 5 eventos mais recentes | Instantâneo |
| **7 - Network** | Instruções para verificar requests | Manual |
| **8 - Limpar Cache** | Recarrega com cache limpo | 2s |
| **9 - Pageview** | Envia pageview manual | 1s |
| **10 - Benchmark** | Teste completo com pontuação | 2s |

---

## ✅ RESULTADO ESPERADO

Quando funcionar 100%, você vai ver:

```
✅ gtag: OK
✅ dataLayer: 5 eventos
✅ Eventos: ['gtm.js', 'gtm.dom', 'gtm.load']
✅ Evento enviado: ✅
✅ Scripts: 2 do Google

📊 PONTUAÇÃO: 8/8 (100%)
🎉 PERFEITO! GA4 100% FUNCIONAL!
```

---

## 🚨 SE DER ERRO

### **"gtag is not defined"**
```javascript
console.log('❌ Erro: gtag não definido');
console.log('Soluções:');
console.log('1. Aguardar deploy completar (5 min)');
console.log('2. Limpar cache (Ctrl+Shift+Delete)');
console.log('3. Recarregar (Ctrl+Shift+R)');
console.log('4. Testar em modo anônimo');
```

### **"dataLayer is empty"**
```javascript
console.log('❌ Erro: dataLayer vazio');
console.log('Possíveis causas:');
console.log('1. Bloqueador de anúncios ativo');
console.log('2. GTM não carregou');
console.log('3. Deploy não completou');
console.log('\nSolução: Desative bloqueador e recarregue');
```

---

## 🔗 ATALHOS ÚTEIS

### **Abrir Google Analytics Tempo Real:**
```javascript
window.open('https://analytics.google.com/analytics/web/#/realtime/', '_blank');
console.log('✅ Google Analytics Tempo Real aberto em nova aba');
```

### **Abrir Tag Assistant:**
```javascript
window.open('https://tagassistant.google.com/', '_blank');
console.log('✅ Tag Assistant aberto em nova aba');
```

### **Copiar dataLayer para clipboard:**
```javascript
copy(dataLayer);
console.log('✅ dataLayer copiado! Cole em um editor para analisar');
```

---

**USE ESTES COMANDOS APÓS O DEPLOY! 🚀**

Salve esta página para referência rápida.

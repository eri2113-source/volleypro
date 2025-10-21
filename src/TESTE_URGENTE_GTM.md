# ⚡ TESTE URGENTE - GTM FUNCIONANDO?

## 🎯 **TESTE DE 30 SEGUNDOS:**

### **1. Abra em ANÔNIMO:**
```
Ctrl + Shift + N
```

### **2. Acesse:**
```
https://volleypro-zw96.vercel.app
```

### **3. Pressione F12 e cole TUDO isso no Console:**

```javascript
console.clear();
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');
console.log('%c🔍 DIAGNÓSTICO GTM VOLLEYPRO', 'font-size: 20px; font-weight: bold; color: #4285f4;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');
console.log('');

// Info básica
console.log('🌐 URL:', window.location.href);
console.log('📅 Data:', new Date().toLocaleString('pt-BR'));
console.log('');

// Teste 1: dataLayer
console.log('%c1️⃣ TESTE: window.dataLayer', 'font-weight: bold; font-size: 14px;');
if (typeof window.dataLayer !== 'undefined') {
  if (window.dataLayer.length > 0) {
    console.log('%c✅ SUCESSO!', 'color: green; font-weight: bold;');
    console.log('   Conteúdo:', window.dataLayer);
    console.log('   Total eventos:', window.dataLayer.length);
  } else {
    console.log('%c⚠️ VAZIO!', 'color: orange; font-weight: bold;');
    console.log('   dataLayer existe mas está vazio');
  }
} else {
  console.log('%c❌ FALHOU!', 'color: red; font-weight: bold;');
  console.log('   dataLayer não existe');
}
console.log('');

// Teste 2: Script GTM
console.log('%c2️⃣ TESTE: Script GTM carregado', 'font-weight: bold; font-size: 14px;');
const scripts = Array.from(document.scripts);
const gtmScripts = scripts.filter(s => s.src.includes('googletagmanager.com'));
if (gtmScripts.length > 0) {
  console.log('%c✅ SUCESSO!', 'color: green; font-weight: bold;');
  gtmScripts.forEach((s, i) => {
    console.log(`   Script ${i + 1}:`, s.src);
  });
} else {
  console.log('%c❌ FALHOU!', 'color: red; font-weight: bold;');
  console.log('   Nenhum script do GTM encontrado');
}
console.log('');

// Teste 3: ID no HTML
console.log('%c3️⃣ TESTE: ID GTM-MV9D2M4P no HTML', 'font-weight: bold; font-size: 14px;');
const html = document.documentElement.outerHTML;
const matches = html.match(/GTM-[A-Z0-9]+/g);
if (matches && matches.includes('GTM-MV9D2M4P')) {
  console.log('%c✅ SUCESSO!', 'color: green; font-weight: bold;');
  console.log('   IDs encontrados:', [...new Set(matches)]);
} else if (matches) {
  console.log('%c⚠️ ID DIFERENTE!', 'color: orange; font-weight: bold;');
  console.log('   IDs encontrados:', [...new Set(matches)]);
  console.log('   ID esperado: GTM-MV9D2M4P');
} else {
  console.log('%c❌ FALHOU!', 'color: red; font-weight: bold;');
  console.log('   Nenhum ID GTM encontrado no HTML');
}
console.log('');

// Teste 4: Código-fonte
console.log('%c4️⃣ TESTE: Ver código-fonte HTML', 'font-weight: bold; font-size: 14px;');
const headHTML = document.head.innerHTML;
const hasGTMInHead = headHTML.includes('googletagmanager.com/gtm.js');
const hasDataLayerInit = headHTML.includes('window.dataLayer');
if (hasGTMInHead && hasDataLayerInit) {
  console.log('%c✅ SUCESSO!', 'color: green; font-weight: bold;');
  console.log('   ✓ Script GTM no <head>');
  console.log('   ✓ dataLayer inicializado');
} else {
  console.log('%c❌ FALHOU!', 'color: red; font-weight: bold;');
  if (!hasGTMInHead) console.log('   ✗ Script GTM NÃO está no <head>');
  if (!hasDataLayerInit) console.log('   ✗ dataLayer NÃO inicializado');
}
console.log('');

// Teste 5: Network
console.log('%c5️⃣ TESTE: Requisições de rede', 'font-weight: bold; font-size: 14px;');
console.log('%c   Abra a aba Network e recarregue (Ctrl+Shift+R)', 'color: #666;');
console.log('%c   Procure por: gtm.js', 'color: #666;');
console.log('');

// RESUMO FINAL
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');
console.log('%c📊 RESUMO FINAL', 'font-size: 18px; font-weight: bold; color: #4285f4;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');
console.log('');

let score = 0;
if (typeof window.dataLayer !== 'undefined' && window.dataLayer.length > 0) score++;
if (gtmScripts.length > 0) score++;
if (matches && matches.includes('GTM-MV9D2M4P')) score++;
if (hasGTMInHead && hasDataLayerInit) score++;

console.log('Pontuação:', score + '/4');
console.log('');

if (score === 4) {
  console.log('%c🎉 PERFEITO! GTM 100% FUNCIONAL!', 'font-size: 16px; color: white; background: green; padding: 10px; font-weight: bold;');
  console.log('');
  console.log('✅ Todos os testes passaram!');
  console.log('✅ Tag está instalada corretamente!');
  console.log('✅ Google Ads vai detectar (pode levar horas)!');
  console.log('');
  console.log('🎯 PRÓXIMO PASSO:');
  console.log('   1. Aguarde 10-15 minutos');
  console.log('   2. Teste no Google Ads novamente');
  console.log('   3. Ou use Tag Assistant: https://tagassistant.google.com');
} else if (score >= 2) {
  console.log('%c⚠️ PARCIALMENTE FUNCIONAL', 'font-size: 16px; color: white; background: orange; padding: 10px; font-weight: bold;');
  console.log('');
  console.log('Alguns testes falharam. Veja os erros acima.');
  console.log('');
  console.log('🔧 POSSÍVEIS CAUSAS:');
  console.log('   - Deploy ainda não completou');
  console.log('   - Cache do navegador');
  console.log('   - Build do Vite com erro');
} else {
  console.log('%c❌ GTM NÃO DETECTADO!', 'font-size: 16px; color: white; background: red; padding: 10px; font-weight: bold;');
  console.log('');
  console.log('A maioria dos testes falhou.');
  console.log('');
  console.log('🆘 O QUE FAZER:');
  console.log('   1. Verifique se deploy foi feito (vercel.com/dashboard)');
  console.log('   2. Aguarde 2-3 minutos após push');
  console.log('   3. Limpe cache: Ctrl + Shift + Delete');
  console.log('   4. Recarregue: Ctrl + Shift + R');
  console.log('   5. Teste novamente');
}

console.log('');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');
console.log('');

// Retornar resultado simples
score === 4 ? '🎉 GTM OK!' : (score >= 2 ? '⚠️ GTM Parcial' : '❌ GTM Erro');
```

### **4. Tire um PRINT (screenshot) de TUDO que aparecer**

### **5. Me envie:**
- ✅ O print do console
- ✅ Qual foi o "RESUMO FINAL"
- ✅ A pontuação (X/4)

---

## 📸 **COMO TIRAR PRINT:**

```
Windows: Win + Shift + S (Recorte)
Mac: Cmd + Shift + 4

OU:

Print Screen (tecla)
Depois cole aqui: Ctrl + V
```

---

## 🎯 **INTERPRETAÇÃO RÁPIDA:**

### **Pontuação 4/4:**
```
🎉 TUDO PERFEITO!
   GTM funcionando!
   Aguarde Google Ads detectar
```

### **Pontuação 2-3/4:**
```
⚠️ PROBLEMA PARCIAL!
   Algo não está certo
   Me mostre o print
```

### **Pontuação 0-1/4:**
```
❌ GTM NÃO INSTALADO!
   Deploy não atualizou
   Ou erro no build
```

---

## 🔍 **TESTE VISUAL ALTERNATIVO:**

Se não conseguir usar o console:

```
1. No site aberto, pressione: Ctrl + U
2. Vai abrir o código-fonte
3. Pressione: Ctrl + F
4. Digite: GTM-MV9D2M4P
5. Quantas vezes aparece?

✅ 2 vezes = GTM instalado
❌ 0 vezes = GTM NÃO instalado
```

---

## ⏰ **IMPORTANTE:**

- Teste SEMPRE em **modo anônimo** (Ctrl + Shift + N)
- Se testou há pouco tempo, **aguarde 2-3 minutos**
- Se fez deploy há menos de 3 min, **aguarde mais um pouco**

---

**🚀 FAÇA O TESTE AGORA E ME MOSTRE O RESULTADO!**

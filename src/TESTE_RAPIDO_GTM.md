# ⚡ TESTE RÁPIDO - 1 MINUTO

## 🎯 **OBJETIVO:**
Verificar se o GTM está funcionando em produção após o deploy

---

## 📋 **COPIE E COLE NO CONSOLE:**

### **1. Abra o site em ANÔNIMO:**
```
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

### **2. Acesse:**
```
https://volleypro-zw96.vercel.app
```

### **3. Pressione F12 (Console)**

### **4. Cole este código:**

```javascript
// 🔍 TESTE RÁPIDO GTM
console.clear();
console.log('%c🔍 TESTE GTM', 'font-size: 20px; color: #4285f4; font-weight: bold;');

// Teste 1: dataLayer
if (typeof window.dataLayer !== 'undefined' && window.dataLayer.length > 0) {
  console.log('%c✅ SUCESSO! GTM FUNCIONANDO!', 'font-size: 16px; color: green; font-weight: bold; background: #e8f5e9; padding: 10px;');
  console.log('dataLayer:', window.dataLayer);
  console.log('Eventos:', window.dataLayer.length);
} else {
  console.log('%c❌ ERRO! GTM NÃO ENCONTRADO!', 'font-size: 16px; color: red; font-weight: bold; background: #ffebee; padding: 10px;');
  console.log('O deploy pode não ter terminado ainda.');
}

// Teste 2: Código HTML
const hasGTM = document.documentElement.outerHTML.includes('GTM-MV9D2M4P');
if (hasGTM) {
  console.log('%c✅ ID GTM-MV9D2M4P encontrado no HTML!', 'color: green; font-weight: bold;');
} else {
  console.log('%c❌ ID GTM-MV9D2M4P NÃO encontrado no HTML!', 'color: red; font-weight: bold;');
}

// Resultado
console.log('\n📊 RESUMO:');
if (typeof window.dataLayer !== 'undefined' && hasGTM) {
  console.log('🎉 TUDO OK! Pode verificar no Google Ads agora!');
} else {
  console.log('⏰ Aguarde mais 2 minutos e recarregue (Ctrl+Shift+R)');
}
```

---

## ✅ **RESULTADO ESPERADO:**

```
🔍 TESTE GTM

✅ SUCESSO! GTM FUNCIONANDO!
dataLayer: Array(2) [ {…}, {…} ]
Eventos: 2

✅ ID GTM-MV9D2M4P encontrado no HTML!

📊 RESUMO:
🎉 TUDO OK! Pode verificar no Google Ads agora!
```

---

## ❌ **SE DER ERRO:**

### **Erro: "GTM NÃO ENCONTRADO"**

**Causa:** Deploy ainda não terminou ou cache

**Solução:**
```
1. Aguarde 2 minutos
2. Pressione: Ctrl + Shift + R (recarregar)
3. Execute o teste de novo
```

### **Erro: "ID NÃO encontrado no HTML"**

**Causa:** Build do Vite não incluiu o GTM

**Solução:**
```
1. Verifique se fez PUSH no GitHub Desktop
2. Aguarde 3 minutos após o push
3. Force redeploy na Vercel
4. Teste novamente
```

---

## 🔍 **TESTE VISUAL (sem código):**

### **Método 1: Ver código-fonte**
```
1. Ctrl + U (View Source)
2. Ctrl + F
3. Procurar: GTM-MV9D2M4P
4. Deve aparecer 2 vezes
```

### **Método 2: Network Tab**
```
1. F12 > Network
2. Ctrl + Shift + R (recarregar)
3. Procurar: googletagmanager.com
4. Deve aparecer requisição para gtm.js
```

---

## 🎯 **VERIFICAR NO GOOGLE ADS:**

Depois que o teste der ✅, faça:

```
1. Google Ads
2. Ferramentas > Medição > Conversões
3. + Nova conversão > Website
4. Verificar tag
5. Cole: https://volleypro-zw96.vercel.app
6. Verificar
```

**Se AINDA não detectar:**
- ⏰ O Google pode ter cache (até 24h)
- ✅ Use Tag Assistant para confirmar
- ✅ Se dataLayer funciona = Tag OK!

---

## 🔗 **LINKS ÚTEIS:**

- **Tag Assistant:** https://tagassistant.google.com
- **GTM Debug:** https://tagmanager.google.com/debug
- **Seu Site:** https://volleypro-zw96.vercel.app

---

**⏱️ TEMPO TOTAL: 1 minuto!**

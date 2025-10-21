# 📸 PASSO A PASSO VISUAL - GTM

## 🎯 **3 PASSOS SIMPLES:**

---

## 🚀 **PASSO 1: COMMIT E PUSH (2 min)**

### **1.1 Abra o GitHub Desktop**
```
🖥️ Ícone do GitHub Desktop na sua área de trabalho
```

### **1.2 Você verá algo assim:**
```
┌─────────────────────────────────────┐
│ 📝 Changes (1)                      │
├─────────────────────────────────────┤
│ ✓ vite.config.ts                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Summary (required)                  │
│ [Digite aqui]                       │
└─────────────────────────────────────┘
```

### **1.3 Digite na caixa "Summary":**
```
🔥 Fix: Injeta GTM via plugin Vite
```

### **1.4 Clique no botão azul:**
```
┌─────────────────────────┐
│ Commit to main          │ ← CLIQUE AQUI
└─────────────────────────┘
```

### **1.5 Clique no botão "Push origin":**
```
┌─────────────────────────┐
│ ↑ Push origin           │ ← CLIQUE AQUI
└─────────────────────────┘
```

### **1.6 Aguarde aparecer:**
```
✓ Pushed successfully
```

### **1.7 AGUARDE 3 MINUTOS COMPLETOS!**
```
⏰ Tome um café... ☕
   (A Vercel está fazendo o build)
```

---

## 🧪 **PASSO 2: TESTAR (1 min)**

### **2.1 Abra o Chrome/Edge EM ANÔNIMO:**
```
Teclado: Ctrl + Shift + N

Ou clique:
Chrome: ⋮ (menu) > Nova janela anônima
Edge: ⋯ (menu) > Nova janela InPrivate
```

### **2.2 Cole esta URL na barra:**
```
https://volleypro-zw96.vercel.app
```

### **2.3 Pressione F12:**
```
Teclado: F12

Ou clique com botão direito > Inspecionar
```

### **2.4 Clique na aba "Console":**
```
┌─────────────────────────────────────┐
│ Elements  Console  Sources  ...    │ ← CLIQUE EM "Console"
├─────────────────────────────────────┤
│ >                                   │
│                                     │
└─────────────────────────────────────┘
```

### **2.5 Digite isto:**
```
window.dataLayer
```

### **2.6 Pressione Enter**

### **2.7 Veja o resultado:**

**✅ SE APARECER ISSO:**
```javascript
> window.dataLayer
< Array(2) [ {…}, {…} ]
  0: {gtm.start: 1729530000000, event: "gtm.js"}
  1: {event: "gtm.dom"}
  length: 2
```
**= 🎉 FUNCIONOU! GTM INSTALADO!**

**❌ SE APARECER ISSO:**
```javascript
> window.dataLayer
< undefined
```
**= ⏰ Aguarde mais 2 minutos e recarregue**

---

## 🔍 **PASSO 3: VERIFICAR CÓDIGO (30 seg)**

### **3.1 Com o site aberto, pressione:**
```
Teclado: Ctrl + U
```

### **3.2 Vai abrir o código-fonte:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    ...
  </head>
</html>
```

### **3.3 Pressione Ctrl + F e procure:**
```
GTM-MV9D2M4P
```

### **3.4 Deve aparecer destacado:**
```html
...
<script>
  ...GTM-MV9D2M4P...  ← 1ª ocorrência
</script>
...
<noscript>
  ...GTM-MV9D2M4P...  ← 2ª ocorrência
</noscript>
...
```

**✅ SE ENCONTRAR 2 VEZES = PERFEITO!**

---

## 📊 **RESUMO VISUAL:**

```
┌─────────────────────────────────────┐
│ 1️⃣ GITHUB DESKTOP                  │
│    ↓ Commit                         │
│    ↓ Push                           │
│    ✓ Aguarde 3 min                  │
├─────────────────────────────────────┤
│ 2️⃣ TESTE NO CONSOLE                │
│    ↓ Abrir anônimo                  │
│    ↓ F12 > Console                  │
│    ↓ window.dataLayer               │
│    ✓ Ver Array [...]                │
├─────────────────────────────────────┤
│ 3️⃣ VERIFICAR CÓDIGO                │
│    ↓ Ctrl + U                       │
│    ↓ Ctrl + F                       │
│    ↓ GTM-MV9D2M4P                   │
│    ✓ Aparece 2x                     │
└─────────────────────────────────────┘
```

---

## ✅ **CONFIRMAÇÃO DE SUCESSO:**

Você saberá que funcionou quando:

```
┌─ CHECKLIST ──────────────────────┐
│ [✓] Push no GitHub Desktop       │
│ [✓] Aguardou 3 minutos           │
│ [✓] window.dataLayer retorna     │
│     Array com dados              │
│ [✓] GTM-MV9D2M4P aparece 2x      │
│     no código-fonte              │
└──────────────────────────────────┘

= 🎉 GTM INSTALADO COM SUCESSO!
```

---

## 🎯 **TESTAR NO GOOGLE ADS:**

### **Depois que tudo der ✅:**

```
1. Abra: https://ads.google.com
2. Menu: Ferramentas e configurações
3. Clique: Medição > Conversões
4. Clique: + Nova conversão
5. Clique: Website
6. Clique: Verificar tag do Google
7. Cole: https://volleypro-zw96.vercel.app
8. Clique: Verificar
```

**✅ Deve aparecer:**
```
┌────────────────────────────────────┐
│ ✓ Tag do Google encontrada         │
│                                    │
│ Google Tag Manager                 │
│ GTM-MV9D2M4P                      │
└────────────────────────────────────┘
```

---

## ⚠️ **SE O GOOGLE ADS NÃO DETECTAR:**

### **Use o Tag Assistant:**

```
1. Abra: https://tagassistant.google.com
2. Cole: https://volleypro-zw96.vercel.app
3. Clique: Connect
4. Clique: Continue
```

**✅ Deve aparecer:**
```
┌────────────────────────────────────┐
│ ✓ GTM-MV9D2M4P                    │
│   Google Tag Manager               │
│   Container loaded successfully    │
└────────────────────────────────────┘
```

**Se aparecer aqui mas não no Google Ads:**
- ⏰ O Google tem cache (pode levar horas)
- ✅ Sua tag ESTÁ funcionando
- ✅ Tente novamente amanhã

---

## 🆘 **ATALHOS DE TECLADO:**

```
Ctrl + Shift + N  = Abrir anônimo
F12               = Abrir DevTools
Ctrl + U          = Ver código-fonte
Ctrl + F          = Procurar
Ctrl + Shift + R  = Recarregar (limpar cache)
Ctrl + Shift + Delete = Limpar cache
```

---

## 🔗 **LINKS IMPORTANTES:**

- **Seu Site:** https://volleypro-zw96.vercel.app
- **Tag Assistant:** https://tagassistant.google.com
- **Google Ads:** https://ads.google.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 💡 **DICA PRO:**

Se quiser um teste super rápido, cole isto no console:

```javascript
window.dataLayer ? '✅ GTM OK!' : '❌ GTM ERRO!'
```

Vai retornar:
- ✅ `"✅ GTM OK!"` = Funcionando
- ❌ `"❌ GTM ERRO!"` = Não funcionando

---

**🚀 COMECE AGORA PELO PASSO 1!**

# ⚡ 2 PASSOS - TAG GOOGLE FUNCIONA!

## 🎯 PROBLEMA

A tag **JÁ ESTÁ NO CÓDIGO** ✅  
Mas a **VERCEL NÃO ESTÁ CONFIGURADA** ❌

---

## ✅ PASSO 1: COMMIT (30 SEGUNDOS)

```bash
git add .
git commit -m "🎯 Tag Google Ads + Config Vercel build"
git push
```

---

## ✅ PASSO 2: CONFIGURAR VERCEL (2 MINUTOS)

### **Acesse:** https://vercel.com

### **1. Clique no projeto "volleypro"**

### **2. Clique em "Settings"** (menu superior)

### **3. Clique em "Build & Development Settings"** (menu lateral)

### **4. Configure:**

```
Output Directory:
┌──────────────────────────────┐
│ build                        │  ← DIGITE "build"
└──────────────────────────────┘
☑️ Override                      ← MARQUE ESTA CAIXA!
```

### **5. Clique em "Save"**

### **6. Force um novo deploy:**

**Opção A - Via Interface:**
- Deployments → 3 pontinhos → Redeploy
- **DESMARQUE** "Use existing Build Cache"
- Redeploy

**Opção B - Via Git:**
```bash
git commit --allow-empty -m "🔄 Force rebuild"
git push
```

---

## ⏱️ AGUARDAR 3 MINUTOS

Vercel vai:
1. ✅ Fazer build → pasta "build/"
2. ✅ Copiar index.html com tag
3. ✅ Publicar site

---

## ✅ TESTAR

### **1. Abrir:**
https://voleypro.net

### **2. Ver código-fonte:**
**Ctrl + U** (Windows) ou **Cmd + Option + U** (Mac)

### **3. Procurar:**
`AW-971142262`

**DEVE APARECER nas primeiras 10 linhas!** ✅

### **4. Console (F12):**
```javascript
console.log(window.dataLayer);  // ✅ Deve mostrar Array
console.log(typeof gtag);       // ✅ Deve mostrar "function"
```

---

## 🎯 GOOGLE ADS VAI DETECTAR!

**Acesse:** https://ads.google.com

**Vá em:** Ferramentas → Medição → Conversões → Configuração da tag

**Digite:** voleypro.net

**Resultado:**
```
✅ Tag detectada!
✅ ID: AW-971142262
✅ Status: Ativo
```

---

## 🔥 RESUMO

```
ANTES:
❌ Vercel usa pasta "dist"
❌ Google não detecta tag

DEPOIS:
✅ Vercel usa pasta "build"
✅ Tag aparece no HTML
✅ Google detecta em 15-30 min
```

---

## 📸 ONDE CONFIGURAR

**Vercel → Settings → Build & Development Settings:**

```
┌─────────────────────────────────────────┐
│  Framework Preset:                      │
│  [Vite]                                 │
│                                         │
│  Build Command:                         │
│  npm run build                          │
│                                         │
│  Output Directory:                      │
│  build              ← AQUI!!!          │
│  ☑️ Override                            │
│                                         │
│  [Save]                                 │
└─────────────────────────────────────────┘
```

---

## ✅ CHECKLIST

```
[ ] Commit + push feito
[ ] Vercel Settings aberto
[ ] Output Directory = "build"
[ ] Override marcado
[ ] Save clicado
[ ] Redeploy sem cache
[ ] Aguardou 3 minutos
[ ] Abriu voleypro.net
[ ] Viu código-fonte (Ctrl+U)
[ ] Tag aparece no HTML
[ ] Console mostra dataLayer
```

---

**FAÇA AGORA! LEVA 5 MINUTOS TOTAL!** 🚀

---

**Data:** 07/11/2025  
**Status:** ✅ PRONTO - SÓ CONFIGURAR VERCEL  
**Tempo:** 5 minutos

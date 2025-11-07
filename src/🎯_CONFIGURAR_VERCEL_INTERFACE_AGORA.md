# 🎯 CONFIGURAR VERCEL INTERFACE - PASSO A PASSO

## ⚠️ PROBLEMA IDENTIFICADO

A tag do Google Ads **JÁ ESTÁ NO CÓDIGO**, mas a Vercel precisa ser configurada **NA INTERFACE** para usar a pasta "build"!

---

## 🚀 FAZER AGORA - 2 PASSOS

### **PASSO 1: COMMIT O CÓDIGO** ✅

```bash
git add .
git commit -m "🎯 Tag Google Ads + Vercel config build"
git push
```

### **PASSO 2: CONFIGURAR VERCEL** 🔧

---

## 📱 CONFIGURAÇÃO NA VERCEL (INTERFACE)

### **1. Acessar Vercel**
https://vercel.com

### **2. Selecionar Projeto**
- Clicar em **"volleypro"** (ou nome do projeto)

### **3. Ir em Settings**
- Clicar em **"Settings"** no menu superior

### **4. Build & Development Settings**
- Clicar em **"Build & Development Settings"** no menu lateral

### **5. Alterar Configurações**

```
┌─────────────────────────────────────────────┐
│  🔧 Build & Development Settings           │
├─────────────────────────────────────────────┤
│                                             │
│  Framework Preset:                          │
│  [Vite ▼]                                  │
│                                             │
│  Build Command:                             │
│  npm run build                              │
│  ✅ Override: [X]                          │
│                                             │
│  Output Directory:                          │
│  build                    ← MUDAR AQUI!    │
│  ✅ Override: [X]                          │
│                                             │
│  Install Command:                           │
│  npm install                                │
│  ✅ Override: [X]                          │
│                                             │
│  [Save]                                     │
└─────────────────────────────────────────────┘
```

### **6. Marcar as Checkboxes "Override"**
- ✅ **Build Command Override**
- ✅ **Output Directory Override**  
- ✅ **Install Command Override**

### **7. Preencher:**
- **Build Command:** `npm run build`
- **Output Directory:** `build` ← **IMPORTANTE!**
- **Install Command:** `npm install`

### **8. Clicar em SAVE**

---

## 🔄 FORÇAR NOVO DEPLOY

### **Opção A: Via Interface (Recomendado)**

1. Ir em **"Deployments"**
2. Clicar nos **3 pontinhos** do deploy mais recente
3. Clicar em **"Redeploy"**
4. Marcar **"Use existing Build Cache"** = **NÃO** ❌
5. Clicar em **"Redeploy"**

### **Opção B: Via Git (Push Vazio)**

```bash
git commit --allow-empty -m "🔄 Forçar rebuild Vercel"
git push
```

---

## ⏱️ AGUARDAR BUILD (2-3 MINUTOS)

A Vercel vai:
1. ✅ Executar `npm run build`
2. ✅ Gerar pasta **"build/"**
3. ✅ Copiar index.html com tag do Google
4. ✅ Publicar em https://voleypro.net

---

## ✅ VERIFICAR APÓS DEPLOY

### **1. Acessar o Site**
https://voleypro.net

### **2. Ver Código-Fonte**
- Apertar: **Ctrl + U** (Windows/Linux)
- Ou: **Cmd + Option + U** (Mac)

### **3. Procurar a Tag**
- Procurar por: `AW-971142262`
- **Deve aparecer nas PRIMEIRAS LINHAS!**

```html
<head>
  <!-- Google tag (gtag.js) - Google Ads -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-971142262"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-971142262');
  </script>
  <!-- End Google Ads Tag -->
```

### **4. Testar no Console (F12)**

```javascript
// Verificar dataLayer
console.log(window.dataLayer);
// Resultado esperado: Array com eventos ✅

// Verificar gtag
console.log(typeof gtag);
// Resultado esperado: "function" ✅
```

---

## 🎯 TESTAR NO GOOGLE ADS

### **Passo 1: Google Ads**
https://ads.google.com

### **Passo 2: Ferramentas → Medição → Conversões**

### **Passo 3: Configuração da Tag**
- Clicar em **"Verificar se a tag foi instalada"**
- Digitar: `voleypro.net`
- Clicar em **"Testar"**

### **Resultado Esperado:**
```
✅ Tag do Google detectada!
✅ ID: AW-971142262
✅ Status: Ativa e funcionando
```

---

## 📊 VISUAL DO PROCESSO

```
┌─────────────────────────────────────┐
│  1. Fazer commit + push             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  2. Configurar Vercel Interface     │
│     Output Directory: build         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  3. Forçar Redeploy                 │
│     (Limpar cache)                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  4. Vercel executa build            │
│     Gera pasta "build/"             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  5. index.html com tag publicado    │
│     Tag no topo do <head>           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  6. Google detecta tag ✅           │
│     AW-971142262 ativo              │
└─────────────────────────────────────┘
```

---

## 🔍 SE A TAG AINDA NÃO FUNCIONAR

### **Verificar Logs de Build na Vercel:**

1. Ir em **"Deployments"**
2. Clicar no deploy mais recente
3. Clicar em **"Building"** → Ver logs

**Procurar por:**
```
✅ "vite build" executed successfully
✅ Build Completed in build/ [XX]s
✅ Output Directory: build
```

### **Se aparecer "dist" ao invés de "build":**
- ❌ Configuração não foi salva
- Voltar ao Passo 2 e configurar novamente

### **Limpar Cache do Navegador:**
```
Chrome/Edge:
Ctrl + Shift + Delete
→ Limpar tudo
→ "Todo o período"

Firefox:
Ctrl + Shift + Delete
→ Limpar cache
→ "Tudo"

Safari:
Cmd + Option + E
→ Limpar cache
```

---

## 📱 PASSO A PASSO COMPLETO

### **Agora (1 minuto):**
```bash
# 1. Commit
git add .
git commit -m "🎯 Tag Google Ads + Vercel config build"
git push
```

### **Interface Vercel (2 minutos):**
1. ✅ Acessar https://vercel.com
2. ✅ Projeto → Settings
3. ✅ Build & Development Settings
4. ✅ Output Directory = **build**
5. ✅ Marcar Override
6. ✅ Save
7. ✅ Deployments → Redeploy (sem cache)

### **Aguardar (3 minutos):**
- ⏱️ Build completo
- ⏱️ Deploy publicado

### **Testar (1 minuto):**
1. ✅ Abrir https://voleypro.net
2. ✅ Ctrl + U (ver fonte)
3. ✅ Procurar "AW-971142262"
4. ✅ F12 → console.log(window.dataLayer)

---

## ✅ CHECKLIST

```
[ ] Commit feito e push enviado
[ ] Vercel Settings acessado
[ ] Output Directory = "build"
[ ] Override marcado
[ ] Save clicado
[ ] Redeploy sem cache executado
[ ] Build concluído (logs verificados)
[ ] Site acessível
[ ] Código-fonte mostra tag
[ ] Console mostra dataLayer
[ ] Google Ads detecta tag
```

---

## 🎉 APÓS TUDO FUNCIONAR

### **Conversões que você poderá criar:**

1. **Cadastro de Usuário**
   - Evento: `sign_up`
   - Valor: R$ 5,00

2. **Criação de Time**
   - Evento: `create_team`
   - Valor: R$ 10,00

3. **Inscrição em Torneio**
   - Evento: `tournament_registration`
   - Valor: R$ 15,00

4. **Upgrade de Plano**
   - Evento: `purchase`
   - Valor: Dinâmico

5. **Criação de Torneio**
   - Evento: `create_tournament`
   - Valor: R$ 20,00

---

## 🚨 IMPORTANTE

A tag **JÁ ESTÁ NO CÓDIGO** ✅  
Falta apenas **CONFIGURAR A VERCEL** para usar "build" ⚙️

**Não mexa mais no código!**  
Só configure a interface da Vercel conforme este guia.

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Fazer commit + push (30 segundos)
2. ✅ Configurar Vercel interface (2 minutos)
3. ✅ Forçar redeploy (30 segundos)
4. ⏱️ Aguardar build (3 minutos)
5. ✅ Testar tag (1 minuto)
6. 🎉 Criar conversões no Google Ads!

---

**TEMPO TOTAL: ~7 MINUTOS**

---

**Data:** 07/11/2025  
**Status:** ✅ CÓDIGO PRONTO - FALTA CONFIGURAR VERCEL  
**Ação:** Configurar Output Directory na interface da Vercel

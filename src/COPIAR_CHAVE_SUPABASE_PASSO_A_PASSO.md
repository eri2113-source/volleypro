# 🔑 COPIAR CHAVE DO SUPABASE - PASSO A PASSO VISUAL

## ✅ PASSO 1: VOCÊ ESTÁ AQUI! ✅

Você está na página de **Projetos** do Supabase.

Vejo o projeto: **"Rede Social VolleyPro"** ✅

---

## 👉 PASSO 2: CLIQUE NO PROJETO

**CLIQUE EM QUALQUER LUGAR** do card verde:

```
┌─────────────────────────────────┐
│  Rede Social VolleyPro      →   │  ← CLIQUE AQUI!
│  AWS | sa-leste-1              │
└─────────────────────────────────┘
```

---

## 👉 PASSO 3: PROCURE O ÍCONE ⚙️ (Settings)

Após clicar no projeto, você verá um dashboard.

**NO MENU LATERAL ESQUERDO**, procure o ícone de **engrenagem** ⚙️

**CLIQUE** em **"Settings"** (Configurações)

---

## 👉 PASSO 4: CLIQUE EM "API"

Dentro de Settings, **NO MENU LATERAL ESQUERDO**, você verá várias opções:

```
⚙️ Settings
   • General
   • Database
   → API  ← CLIQUE AQUI!
   • Auth
   • Storage
   ...
```

**CLIQUE** em **"API"**

---

## 👉 PASSO 5: COPIAR A CHAVE

Na página API, você verá:

### Project URL (já temos essa!)
```
URL: https://walbxabxlcehyyagacw.supabase.co ✅
```

### Project API keys

Você verá **2 chaves**:

#### 1. service_role (secreta - NÃO COPIE!)
```
service_role
eyJhbGciOiJIUz... [HIDDEN]

❌ NÃO COPIE ESSA!
```

#### 2. anon public (pública - COPIE ESSA!)
```
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh... [LONGA]

✅ COPIE ESSA! (clique no ícone 📋)
```

**COPIE A CHAVE "anon public":**
- Clique no ícone **📋** (copiar) ao lado da chave
- OU selecione toda a chave e copie (Ctrl+C)

A chave é MUITO LONGA (200-300 caracteres)!

---

## ✅ PASSO 6: COLAR NA VERCEL

**Agora volte para a aba da Vercel** e:

1. Na seção **"Variáveis de ambiente"**, clique **"▼"** para expandir

2. Clique em **"+ Add New"**

3. Preencha:
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: (cole a chave que você copiou - Ctrl+V)
   Environment: ✅ Marque todas (Production, Preview, Development)
   ```

4. Clique para salvar a variável

---

## 📋 AS 2 VARIÁVEIS COMPLETAS

Depois de adicionar, você terá:

### Variável 1:
```
Name: VITE_SUPABASE_URL
Value: https://walbxabxlcehyyagacw.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua chave longa)
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## 🚀 DEPOIS DISSO: DEPLOY!

Com as 2 variáveis adicionadas:

1. ✅ Certifique-se que mudou "Other" para **"Vite"**
2. ✅ Role para baixo
3. ✅ Clique em **"Implantar"** (botão azul)
4. ✅ Aguarde 2-5 minutos
5. ✅ Copie a URL quando aparecer!

---

## 🎯 RESUMO VISUAL

```
1. Clique no card "Rede Social VolleyPro"
        ↓
2. Menu esquerdo → ⚙️ Settings
        ↓
3. Menu esquerdo → API
        ↓
4. Copie "anon public" (📋)
        ↓
5. Volte para Vercel
        ↓
6. Variáveis de ambiente → + Add New
        ↓
7. Name: VITE_SUPABASE_ANON_KEY
   Value: (cole a chave)
        ↓
8. Salve
        ↓
9. Implantar! 🚀
```

---

## ❓ EXEMPLO DA CHAVE

A chave "anon public" parece com isso (só maior):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGJ4YWJ4bGNlaHl5YWdhY3ciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODQxMjM0NSwiZXhwIjoyMDE0MDAyMzQ1fQ.abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

**Certifique-se de copiar TUDO!**

---

**👉 COMECE AGORA: CLIQUE NO CARD "Rede Social VolleyPro"!** 🚀

Me avise quando copiar a chave! 😊

# 🔑 ADICIONAR VARIÁVEIS DE AMBIENTE NA VERCEL - AGORA!

## 📋 O QUE FAZER AGORA:

Você está na página de configuração do projeto na Vercel. Precisa adicionar as 2 variáveis de ambiente ANTES de fazer o deploy.

---

## ✅ PASSO A PASSO:

### 1️⃣ **APAGAR a variável de exemplo**

Vejo que você tem uma variável:
```
EXEMPLO_NOME = I9JU23NF394R6HH
```

**APAGUE essa variável:**
- Clique no ícone de **lixeira** 🗑️ ou **"−"** ao lado dela
- Confirme a exclusão

---

### 2️⃣ **ADICIONAR a primeira variável**

1. **Clique em:** `+ Adicionar mais` (ou `+ Add New`)

2. **Preencha:**
   ```
   Chave: VITE_SUPABASE_URL
   Valor: https://walbxabxlcehyyagacw.supabase.co
   ```

3. **Marque TODOS os ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Clique em:** `Salvar` (ou `Save`)

---

### 3️⃣ **ADICIONAR a segunda variável**

1. **Clique em:** `+ Adicionar mais` (ou `+ Add New`) novamente

2. **Preencha:**
   ```
   Chave: VITE_SUPABASE_ANON_KEY
   Valor: (COLE A CHAVE LONGA QUE VOCÊ COPIOU DO SUPABASE)
   ```

   **A chave começa com:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   
   **É uma chave MUITO LONGA** (200-300 caracteres)!

3. **Marque TODOS os ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Clique em:** `Salvar` (ou `Save`)

---

## 📋 COMO DEVE FICAR:

Depois de adicionar as 2 variáveis, você deve ver:

```
Variáveis de ambiente (2)

Variável 1:
├─ Chave: VITE_SUPABASE_URL
├─ Valor: https://walbxabxlcehyyagacw.supabase.co
└─ Environment: Production, Preview, Development

Variável 2:
├─ Chave: VITE_SUPABASE_ANON_KEY
├─ Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (oculto)
└─ Environment: Production, Preview, Development
```

---

## 🔑 SE VOCÊ NÃO TEM MAIS A CHAVE ANON:

Caso você não tenha mais a chave `VITE_SUPABASE_ANON_KEY` copiada:

### 1️⃣ **Abra uma nova aba do navegador**

### 2️⃣ **Acesse:** https://supabase.com/dashboard

### 3️⃣ **Faça login** na sua conta Supabase

### 4️⃣ **Clique no projeto:** "Rede Social VolleyPro"

### 5️⃣ **No menu lateral ESQUERDO, clique em:** ⚙️ `Settings`

### 6️⃣ **No menu lateral ESQUERDO, clique em:** `API`

### 7️⃣ **Procure por:** "Project API keys"

### 8️⃣ **Copie a chave:** `anon public`

Ela se parece com isso:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGJ4YWJ4bGNlaHl5YWdhY3ciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODQxMjM0NSwiZXhwIjoyMDE0MDAyMzQ1fQ.abc123...
```

**COPIE TUDO!** (clique no ícone 📋)

### 9️⃣ **Volte para a aba da Vercel e cole**

---

## 🚀 DEPOIS DE ADICIONAR AS 2 VARIÁVEIS:

### 1️⃣ **Role a página para BAIXO**

### 2️⃣ **Procure o botão azul grande:**
```
🔵 Deploy
ou
🔵 Implantar
```

### 3️⃣ **CLIQUE nesse botão!**

### 4️⃣ **Aguarde 2-5 minutos**

A Vercel vai:
```
⏳ Installing dependencies...
⏳ Building application...
⏳ Deploying...
✅ Ready!
```

### 5️⃣ **Quando terminar:**
```
✅ Ready
🌐 https://volleypro-seu-usuario.vercel.app
[Visit] ← Clique e teste!
```

---

## 🎯 CHECKLIST ANTES DE CLICAR EM DEPLOY:

Marque cada item:

- [ ] ✅ Apaguei a variável de exemplo "EXEMPLO_NOME"
- [ ] ✅ Adicionei: `VITE_SUPABASE_URL` = `https://walbxabxlcehyyagacw.supabase.co`
- [ ] ✅ Adicionei: `VITE_SUPABASE_ANON_KEY` = (chave longa do Supabase)
- [ ] ✅ Marquei TODOS os ambientes (Production, Preview, Development)
- [ ] ✅ Salvei as 2 variáveis
- [ ] ✅ Vejo "2 variáveis" na seção
- [ ] ✅ AGORA posso clicar em "Deploy"!

---

## 📸 EXEMPLO VISUAL:

```
┌─────────────────────────────────────────────┐
│ Variáveis de ambiente (2)                   │
├─────────────────────────────────────────────┤
│                                             │
│ VITE_SUPABASE_URL                           │
│ https://walbxabxlcehyyagacw.supabase.co    │
│ Production, Preview, Development            │
│                                     [−]     │
│                                             │
│ VITE_SUPABASE_ANON_KEY                      │
│ eyJhbGci... (oculto)                       │
│ Production, Preview, Development            │
│                                     [−]     │
│                                             │
│ [+ Adicionar mais]                          │
└─────────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE:

**NÃO CLIQUE EM "DEPLOY" ATÉ ADICIONAR AS 2 VARIÁVEIS!**

Sem essas variáveis, o site vai:
- ❌ Falhar ao conectar com o Supabase
- ❌ Não permitir login
- ❌ Não carregar dados
- ❌ Ficar quebrado

---

## 🎯 RESUMO RÁPIDO:

```
1. Apagar variável de exemplo
2. + Adicionar mais → VITE_SUPABASE_URL
3. + Adicionar mais → VITE_SUPABASE_ANON_KEY
4. Marcar TODOS os ambientes (nas 2)
5. Salvar
6. Verificar que tem 2 variáveis
7. Clicar em Deploy
8. Aguardar 2-5 minutos
9. Site no ar! 🎉
```

---

**👉 COMECE AGORA ADICIONANDO AS VARIÁVEIS!** 🔑

**Me mostre um print quando as 2 variáveis estiverem adicionadas!** 📸

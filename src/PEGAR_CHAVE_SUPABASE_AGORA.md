# 🔑 PEGAR CHAVE DO SUPABASE - GUIA VISUAL

## 📸 BASEADO NA SUA TELA ATUAL

Você está em: **Supabase → Projetos**

Vejo o projeto: **"Rede Social VolleyPro"**

---

## ✅ PASSO 1: ABRIR O PROJETO

1. **Clique** no card **"Rede Social VolleyPro"**
   - É o card que mostra "AWS | sa-leste-1"
   - Clique em QUALQUER lugar do card

---

## ✅ PASSO 2: IR PARA SETTINGS

Após abrir o projeto, você verá o dashboard principal.

1. **No menu lateral ESQUERDO**, procure o ícone de **⚙️ engrenagem**
2. **Clique** em **"Settings"** (Configurações)

---

## ✅ PASSO 3: IR PARA API

Dentro de Settings:

1. **No menu lateral ESQUERDO**, procure **"API"**
2. **Clique** em **"API"**

---

## ✅ PASSO 4: COPIAR A CHAVE

Você verá uma página com várias informações. Procure por:

### Project URL (você já tem essa!)
```
https://walbxabxlcehyyagacw.supabase.co
```

### Project API keys

Você verá **DUAS** chaves:

#### 1. service_role (❌ NÃO COPIE ESSA!)
- **NÃO USE** esta chave no frontend!
- É apenas para o backend (servidor)

#### 2. anon public (✅ COPIE ESSA!)
- É uma chave **LONGA** começando com: `eyJ...`
- Pode ter 200-300 caracteres
- É SEGURA para usar no frontend

**COPIE A CHAVE "anon public":**
1. Clique no ícone de **copiar** 📋 ao lado da chave
2. OU selecione toda a chave e copie (Ctrl+C)

---

## ✅ PASSO 5: COLAR NA VERCEL

Agora volte para a aba da **Vercel** e:

1. Na seção **"Variáveis de ambiente"**, clique em **"+ Add New"**
2. **Name**: `VITE_SUPABASE_ANON_KEY`
3. **Value**: Cole a chave que você copiou (Ctrl+V)
4. **Environment**: Marque todas (Production, Preview, Development)
5. Clique para salvar

---

## 📋 RESUMO DAS 2 VARIÁVEIS

Você precisa adicionar na Vercel:

### Variável 1:
```
Name: VITE_SUPABASE_URL
Value: https://walbxabxlcehyyagacw.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

### Variável 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJ... (a chave longa que você copiou)
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## 🎯 DEPOIS DISSO

1. ✅ Certifique-se que mudou "Other" para **"Vite"**
2. ✅ Certifique-se que as 2 variáveis foram adicionadas
3. ✅ Clique em **"Implantar"** (Deploy)
4. ✅ Aguarde 2-5 minutos
5. ✅ Copie a URL quando terminar!

---

## 🚨 DICA IMPORTANTE

A chave "anon public" é LONGA! Exemplo:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGJ4YWJ4bGNlaHl5YWdhY3ciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODQxMjM0NSwiZXhwIjoyMDE0MDAyMzQ1fQ.abcdefghijklmnopqrstuvwxyz123456789
```

**Certifique-se de copiar TUDO!**

---

## 📸 ROTA COMPLETA

```
Supabase Dashboard
  ↓
Clique em "Rede Social VolleyPro"
  ↓
Menu lateral esquerdo → ⚙️ Settings
  ↓
Menu lateral esquerdo → API
  ↓
Procure "Project API keys"
  ↓
Copie "anon public" (📋)
  ↓
Cole na Vercel em VITE_SUPABASE_ANON_KEY
```

---

## ❓ FICOU ALGUMA DÚVIDA?

**Me diga:**
- Conseguiu abrir o projeto?
- Conseguiu encontrar Settings?
- Conseguiu encontrar API?
- Viu a chave "anon public"?

**Tire um print e me mostre se tiver dúvida!** 📸

---

**BOA SORTE! VOCÊ ESTÁ QUASE LÁ!** 🚀

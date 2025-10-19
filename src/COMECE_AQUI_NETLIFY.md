# 🎯 COMECE AQUI - NETLIFY EM 10 MINUTOS

## 🚀 3 PASSOS SIMPLES

### 1️⃣ COMMIT DO NETLIFY.TOML (1 minuto)

No **Codespaces**, execute:

```bash
git add netlify.toml
git commit -m "chore: add Netlify configuration"
git push origin main
```

✅ **Pronto!** Arquivo de configuração no GitHub.

---

### 2️⃣ CRIAR CONTA NETLIFY (5 minutos)

1. **Acesse:** https://app.netlify.com/signup
2. **Clique:** "Sign up with GitHub"
3. **Autorize** o Netlify
4. **Clique:** "Add new site" → "Import from GitHub"
5. **Selecione:** Seu repositório "volleypro"
6. **Configure:**
   - Build command: `npm run build` ✅ (já detecta)
   - Publish directory: `dist` ✅ (já detecta)
7. **IMPORTANTE:** Role para baixo e adicione as variáveis:
   ```
   VITE_SUPABASE_URL = (copie do Supabase)
   VITE_SUPABASE_ANON_KEY = (copie do Supabase)
   VITE_LIVEKIT_URL = (copie do LiveKit)
   ```
8. **Clique:** "Deploy site"

---

### 3️⃣ AGUARDAR E TESTAR (4 minutos)

1. **Aguarde** 2-3 minutos (veja os logs em tempo real)
2. Quando aparecer **"Site is live"**, copie a URL
3. **Abra aba anônima:** Ctrl + Shift + N
4. **Acesse** a URL do Netlify
5. **Faça login**
6. **DEVE TER "Anúncios" NA BARRA AZUL!** 📣

---

## 📍 ONDE PEGAR AS CHAVES?

### SUPABASE:
1. https://supabase.com/dashboard → Seu projeto
2. Settings → API
3. Copie:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** → VITE_SUPABASE_ANON_KEY

### LIVEKIT:
1. https://cloud.livekit.io/projects → Seu projeto
2. Settings
3. Copie:
   - **WebSocket URL** → VITE_LIVEKIT_URL

---

## 🎁 GUIAS COMPLETOS

- 📘 **Passo a passo detalhado:** `DEPLOY_NETLIFY_AGORA.md`
- 🎨 **Guia visual com prints:** `NETLIFY_SETUP_VISUAL.md`
- 🚀 **Script automático:** `bash publicar-netlify.sh`

---

## ❓ E SE DER ERRO?

### Build falhou?
- Veja os logs no Netlify (são super claros!)
- Geralmente é falta de variável de ambiente

### Site não funciona?
- Certifique-se que adicionou as 3 variáveis
- Teste em aba anônima (sem cache)

### Variável faltando?
1. Netlify → Site settings → Environment variables
2. Clique "Add variable"
3. Adicione a que falta
4. Clique "Trigger deploy"

---

## 🎊 VANTAGENS DO NETLIFY

✅ Deploy em **2-3 minutos** (Vercel: 5-7 min)  
✅ **SEM problemas de cache** (atualiza sempre!)  
✅ Interface **simples e clara**  
✅ Logs **detalhados e úteis**  
✅ Deploy **100% automático**  
✅ **Grátis** para sempre (100GB/mês)  
✅ HTTPS **automático**  
✅ **Rollback** em 1 clique  

---

## 🏁 RESUMO ULTRA-RÁPIDO

```bash
# 1. Commit do config
git add netlify.toml && git commit -m "chore: Netlify" && git push

# 2. Criar conta e conectar repo
https://app.netlify.com/signup → GitHub → Selecionar repo

# 3. Adicionar variáveis e deploy
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_LIVEKIT_URL → Deploy

# 4. Testar
Aguardar 3 min → Visit site → Login → ✅ Anúncios na barra azul!
```

---

**🚀 COMECE AGORA:** https://app.netlify.com/signup

**⏱️ TEMPO TOTAL:** 10 minutos

**💰 CUSTO:** R$ 0,00 (grátis para sempre!)

**🎯 RESULTADO:** Site funcionando 100% sem problemas de cache!

---

## 🎉 BOA SORTE!

Qualquer problema, veja os guias completos.

**Seu site vai funcionar perfeitamente no Netlify!** 💪

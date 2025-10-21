# 🚀 COMECE AQUI - Tag do Google

## ⚡ PROBLEMA
O Google Ads reclama: "A tag do Google não foi detectada"

## ✅ SOLUÇÃO
Já implementei o Google Tag Manager completo no VolleyPro!

---

## 🎯 O QUE VOCÊ PRECISA FAZER AGORA (10 MIN)

### 1️⃣ CRIAR CONTA NO GTM (5 min)
```
Acesse: https://tagmanager.google.com/
Criar conta > Nome: VolleyPro
Contêiner: volleypro-zw96.vercel.app
Plataforma: Web
```

**COPIE O ID:** `GTM-XXXXXXX` (ex: GTM-ABC123)

### 2️⃣ SUBSTITUIR NO CÓDIGO (2 min)

**Arquivo:** `/index.html`

**Procure:** `GTM-XXXXXXX` (2 ocorrências)  
**Substitua:** pelo seu ID (ex: `GTM-ABC123`)

**Linhas:** ~37 e ~45

### 3️⃣ FAZER DEPLOY (3 min)
```
GitHub Desktop > Commit > Push
Aguardar Vercel deploy (2-3 min)
```

### 4️⃣ TESTAR (1 min)
```
Abra: https://volleypro-zw96.vercel.app
Pressione: F12 > Console
Digite: window.dataLayer
Resultado esperado: Array [ {…} ]
```

✅ **PRONTO! O Google Ads detectará sua tag!**

---

## 📚 GUIAS COMPLETOS

- **Rápido (10 min):** `/INSTALAR_TAG_GOOGLE_AGORA.md`
- **Completo:** `/CONFIGURAR_GOOGLE_TAG_MANAGER.md`
- **Técnico:** `/GOOGLE_TAG_MANAGER_IMPLEMENTADO.md`

---

## 🎯 CONVERSÕES JÁ RASTREANDO

- ✅ Cadastro (sign_up)
- ✅ Login
- ✅ Compra de plano (purchase) ← **PRINCIPAL!**
- ✅ Clique em "Assinar" (begin_checkout)
- ✅ Visualização de planos

**Tudo automático! Só precisa configurar o ID do GTM!**

---

## ❓ DÚVIDAS?

**"Onde pego o ID?"** → https://tagmanager.google.com/ (após criar conta)  
**"Quantas vezes substituir?"** → 2 vezes no index.html  
**"Quando testar?"** → Após deploy (2-3 min)  
**"E se não funcionar?"** → Limpe cache (Ctrl+Shift+Delete) e teste em aba anônima

---

## ⏰ TEMPO TOTAL: 10 MINUTOS

| Passo | Tempo |
|-------|-------|
| Criar GTM | 5 min |
| Editar código | 2 min |
| Deploy | 3 min |

**COMECE AGORA! 💪**

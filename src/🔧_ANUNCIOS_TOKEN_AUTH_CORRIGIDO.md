# 🔧 ANÚNCIOS - TOKEN AUTH CORRIGIDO

## 🎯 PROBLEMA

**Erro 401 ao aprovar/rejeitar/deletar anúncios**

```
❌ POST .../ads/approve
Status: 401 (Unauthorized)
```

---

## ✅ SOLUÇÃO (APLICADA)

### **CAUSA:**
- Frontend usava `publicAnonKey`
- Backend requer `access_token` de usuário logado

### **CORREÇÃO:**
```tsx
// Adicionado helper:
const getAuthToken = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session.access_token;
};

// Usado em approve/reject/delete:
const token = await getAuthToken();
if (!token) {
  toast.error("❌ Precisa estar logado como Master Admin");
  return;
}

fetch(..., {
  headers: {
    Authorization: `Bearer ${token}`  // ← Token correto!
  }
});
```

---

## 🚀 FAZER AGORA

### **COMMIT:**

```
TÍTULO:
⚡ Anúncios - Token Auth Corrigido

DESCRIÇÃO:
- Erro 401 ao aprovar/rejeitar anúncios
- Usava publicAnonKey (errado)
- Agora usa access_token (correto)
- Validação de login adicionada

1 arquivo | Bug crítico admin
```

---

### **TESTAR:**

**Como Master Admin:**
- [ ] Aprovar anúncio ✅
- [ ] Rejeitar anúncio ✅
- [ ] Deletar anúncio ✅
- [ ] SEM erro 401 ✅

---

**DETALHES:** `⚡_ERRO_ANUNCIOS_CORRIGIDO_AGORA.md`

**COMMIT AGORA!** 🚀

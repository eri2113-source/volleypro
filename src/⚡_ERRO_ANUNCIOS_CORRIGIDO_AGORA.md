# ⚡ ERRO ANÚNCIOS CORRIGIDO - TOKEN AUTH

## 🎯 O PROBLEMA (DA IMAGEM)

**ERRO 401 UNAUTHORIZED ao aprovar/rejeitar anúncios:**

```
❌ Failed to load resource: net::ERR_UNAUTHORIZED_ERROR
❌ Erro ao aprovar anúncio: Error: Erro ao aprovar
```

**Console mostra:**
```
POST https://...supabase.co/functions/v1/make-server-0ea22bba/ads/approve
Status: 401 (Unauthorized)
```

---

## 🔍 CAUSA RAIZ

**AUTENTICAÇÃO INCORRETA:**

```tsx
// ANTES (❌):
const response = await fetch(
  `.../ads/approve`,
  {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,  // ← ERRADO!
    }
  }
);
```

### **PROBLEMA:**
- Rota `/ads/approve` usa `authMiddleware` no backend
- Requer **token de usuário logado** (access_token)
- Frontend estava enviando `publicAnonKey` (chave pública)
- Backend rejeitava: **401 Unauthorized**

### **BACKEND (linha 5817):**
```tsx
app.post('/make-server-0ea22bba/ads/approve', authMiddleware, async (c) => {
  // ↑ authMiddleware requer token de usuário!
```

---

## ✅ A SOLUÇÃO (APLICADA)

### **1. Adicionado helper `getAuthToken()`:**

```tsx
const getAuthToken = async () => {
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.access_token) {
      console.error('❌ Erro ao obter sessão:', error);
      return null;
    }
    
    return session.access_token; // ← Token correto!
  } catch (error) {
    console.error('❌ Erro ao obter token:', error);
    return null;
  }
};
```

---

### **2. Corrigido `handleApprove()`:**

**ANTES (❌):**
```tsx
const response = await fetch(
  `.../ads/approve`,
  {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,  // ← ERRADO!
    }
  }
);
```

**DEPOIS (✅):**
```tsx
const token = await getAuthToken();

if (!token) {
  toast.error("❌ Você precisa estar logado como Master Admin");
  return;
}

const response = await fetch(
  `.../ads/approve`,
  {
    headers: {
      Authorization: `Bearer ${token}`,  // ← CORRETO!
    }
  }
);
```

---

### **3. Corrigido `handleReject()`:**

**MESMA CORREÇÃO:**
```tsx
const token = await getAuthToken();

if (!token) {
  toast.error("❌ Você precisa estar logado como Master Admin");
  return;
}

const response = await fetch(
  `.../ads/reject`,
  {
    headers: {
      Authorization: `Bearer ${token}`,  // ← Agora usa token de usuário
    }
  }
);
```

---

### **4. Corrigido `handleDelete()`:**

**MESMA CORREÇÃO:**
```tsx
const token = await getAuthToken();

if (!token) {
  toast.error("❌ Você precisa estar logado como Master Admin");
  return;
}

const response = await fetch(
  `.../ads/delete`,
  {
    headers: {
      Authorization: `Bearer ${token}`,  // ← Token de usuário
    }
  }
);
```

---

### **5. Corrigido Warning de Acessibilidade:**

**ANTES (❌):**
```tsx
<AlertDialogContent aria-describedby="ad-action-description">
  <AlertDialogDescription id="ad-action-description">
```

**DEPOIS (✅):**
```tsx
<AlertDialogContent>
  <AlertDialogDescription>
```

**Removido:**
- `aria-describedby` (já é automático)
- `id` (não necessário)

---

## 📂 ARQUIVO MODIFICADO

**`components/AdsManagement.tsx`** ✅

**MUDANÇAS:**
1. ✅ Importado `createClient` do Supabase
2. ✅ Adicionado helper `getAuthToken()`
3. ✅ `handleApprove()` usa token de usuário
4. ✅ `handleReject()` usa token de usuário
5. ✅ `handleDelete()` usa token de usuário
6. ✅ Validação: mostra erro se não está logado
7. ✅ Melhor tratamento de erros (mostra mensagem do backend)
8. ✅ Warning de acessibilidade corrigido

---

## 🚀 FAZER AGORA

### **COMMIT:**

```
TÍTULO:
⚡ Erro Anúncios Corrigido - Token Auth

DESCRIÇÃO:
PROBLEMA:
- Erro 401 ao aprovar/rejeitar anúncios
- Frontend usava publicAnonKey incorretamente
- Backend requer token de usuário logado

SOLUÇÃO:
- Adicionado getAuthToken() helper
- Approve/Reject/Delete usam token de sessão
- Validação: requer login como Master Admin
- Warning acessibilidade AlertDialog corrigido

1 arquivo | Erro crítico gerenciamento
```

---

### **TESTAR:**

**1. Fazer login como Master Admin:**
- Usar sua conta master

**2. Ir em "Gerenciar Anúncios":**
- Aba "Pendentes"

**3. Aprovar um anúncio:**
- ✅ Deve aprovar SEM erro 401
- ✅ Toast: "✅ Anúncio aprovado!"
- ✅ Anúncio move para aba "Aprovados"

**4. Rejeitar um anúncio:**
- ✅ Deve rejeitar SEM erro 401
- ✅ Anúncio move para aba "Rejeitados"

**5. Deletar um anúncio:**
- ✅ Deve deletar SEM erro 401
- ✅ Anúncio some da lista

**6. Sem login:**
- ❌ Deve mostrar: "Você precisa estar logado como Master Admin"

---

## 🧪 CONSOLE ESPERADO

### **ANTES (❌):**
```javascript
POST .../ads/approve
Status: 401 (Unauthorized)
❌ Failed to load resource: net::ERR_UNAUTHORIZED_ERROR
❌ Erro ao aprovar anúncio: Error: Erro ao aprovar
```

### **DEPOIS (✅):**
```javascript
POST .../ads/approve
Status: 200 OK
✅ Anúncio aprovado com sucesso
{
  success: true,
  ad: { id: "...", status: "approved", ... }
}
```

---

## 💡 ENTENDENDO A DIFERENÇA

### **`publicAnonKey` (Chave Pública):**
```tsx
// USO CORRETO:
- Acessar dados públicos
- Rotas sem authMiddleware
- Exemplo: listar anúncios aprovados

// USO INCORRETO:
- Aprovar/Rejeitar/Deletar ❌
- Qualquer ação de admin ❌
```

### **`access_token` (Token de Usuário):**
```tsx
// USO CORRETO:
- Ações do usuário logado ✅
- Rotas com authMiddleware ✅
- Exemplo: aprovar anúncios ✅

// COMO OBTER:
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
const token = session.access_token;
```

---

## ⚠️ OUTRAS ROTAS QUE USAM authMiddleware

**VERIFICAR SE ESTÃO CORRETAS:**

```tsx
// Estas rotas TAMBÉM precisam de access_token:
- POST /ads/approve     ✅ CORRIGIDO
- POST /ads/reject      ✅ CORRIGIDO  
- DELETE /ads/delete    ✅ CORRIGIDO
- GET /admin/check-master
- DELETE /admin/posts/:postId
- DELETE /admin/tournaments/:tournamentId
- GET /admin/users
- DELETE /admin/users/:userId
```

**ROTAS PÚBLICAS (podem usar publicAnonKey):**
```tsx
- POST /ads/create      ✅ OK
- GET /ads/list         ✅ OK
- GET /ads/approved     ✅ OK
```

---

## ✅ RESUMO

**PROBLEMA:** 401 Unauthorized ao aprovar anúncios  
**CAUSA:** Usando publicAnonKey ao invés de access_token  
**SOLUÇÃO:** getAuthToken() + validação de login  
**ARQUIVO:** 1 modificado (AdsManagement.tsx)  
**URGÊNCIA:** CRÍTICA ⚠️

---

**COMMIT E PUSH AGORA!** 🚀

Depois teste:
- [ ] Aprovar anúncio funciona?
- [ ] Rejeitar anúncio funciona?
- [ ] Deletar anúncio funciona?
- [ ] Sem erro 401 no console?
- [ ] Toast de sucesso aparece?

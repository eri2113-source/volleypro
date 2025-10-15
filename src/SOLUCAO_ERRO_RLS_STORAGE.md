# 🔧 SOLUÇÃO: ERRO RLS STORAGE

## ❌ ERRO QUE VOCÊ ESTÁ VENDO:

```
StorageApiError: new row violates row-level security policy
```

**O QUE SIGNIFICA:**
O Supabase Storage tem **Row-Level Security (RLS)** ativado, mas as **políticas de acesso não foram configuradas**. Isso bloqueia qualquer upload de arquivo.

---

## ✅ SOLUÇÃO IMPLEMENTADA (AUTOMÁTICA)

### **O que foi feito:**

1. **Novo endpoint de upload:** `/upload-avatar`
   - Usa **service_role_key** do servidor
   - **Contorna RLS** (servidor tem permissão total)
   - Upload direto e seguro

2. **Componente atualizado:** `AvatarUpload.tsx`
   - Agora usa o endpoint do servidor
   - Melhor tratamento de erros
   - Mensagens claras

### **Como funciona agora:**

```
Frontend → Servidor → Supabase Storage
         (service_role)   (sem RLS)
```

**Vantagem:** Não precisa configurar RLS manualmente!

---

## 🧪 TESTE AGORA

### **Passo a passo:**

1. **Recarregue a página** (F5)
2. **Faça login**
3. **"Meu Perfil" → "Editar Perfil"**
4. **"Adicionar Foto"**
5. **Selecione uma imagem**
6. **Console (F12) deve mostrar:**
   ```
   📤 Iniciando upload via servidor...
   ✅ Upload concluído!
   🔗 URL pública: https://...
   ```

### **✅ SE FUNCIONAR:**
- Toast verde: "Foto atualizada com sucesso! 📸"
- Preview da foto aparece
- Clique "Salvar Alterações"
- Foto aparece em todo o site

### **❌ SE AINDA DER ERRO:**
- Copie TODOS os logs do Console (F12)
- Me envie
- Vou configurar RLS manualmente

---

## 🔐 CONFIGURAÇÃO MANUAL (SE NECESSÁRIO)

Se o upload via servidor não funcionar, você pode configurar RLS manualmente:

### **1. Acesse o Supabase Dashboard:**

```
https://supabase.com/dashboard/project/[SEU_PROJECT_ID]
```

### **2. Vá em Storage → Policies:**

```
Storage → Buckets → make-0ea22bba-avatars → Policies
```

### **3. Crie 3 Políticas:**

#### **POLÍTICA 1: Upload (INSERT)**

**Nome:** `Allow authenticated users to upload avatars`

**Operation:** INSERT

**Target roles:** `authenticated`

**Policy definition:**
```sql
(bucket_id = 'make-0ea22bba-avatars'::text)
```

**WITH CHECK expression:**
```sql
(bucket_id = 'make-0ea22bba-avatars'::text)
```

#### **POLÍTICA 2: Visualização (SELECT)**

**Nome:** `Allow public to view avatars`

**Operation:** SELECT

**Target roles:** `anon`, `authenticated`

**Policy definition:**
```sql
(bucket_id = 'make-0ea22bba-avatars'::text)
```

#### **POLÍTICA 3: Atualização (UPDATE)**

**Nome:** `Allow users to update their own avatars`

**Operation:** UPDATE

**Target roles:** `authenticated`

**Policy definition:**
```sql
(bucket_id = 'make-0ea22bba-avatars'::text)
```

**WITH CHECK expression:**
```sql
(bucket_id = 'make-0ea22bba-avatars'::text)
```

### **4. Salvar e Testar:**

Após criar as políticas:
1. Recarregue a página
2. Tente fazer upload novamente
3. Deve funcionar!

---

## 🎯 ALTERNATIVA: BUCKET PÚBLICO SEM RLS

Se quiser simplificar (menos seguro, mas funciona):

### **1. Supabase Dashboard:**

```
Storage → Buckets → make-0ea22bba-avatars
```

### **2. Desabilitar RLS:**

```
Configuration → Make bucket public ✅
```

### **3. Pros e Contras:**

**✅ PROS:**
- Funciona imediatamente
- Sem configuração de políticas
- Uploads diretos do frontend

**❌ CONTRAS:**
- Qualquer um pode fazer upload (risco de spam)
- Menos controle de segurança
- Recomendado apenas para testes

---

## 🔍 LOGS PARA DEBUG

Se continuar com erro, me envie estes logs do Console (F12):

### **Logs do Frontend:**
```javascript
📤 Iniciando upload via servidor...
// Deve aparecer:
✅ Upload concluído!
🔗 URL pública: https://...

// Se der erro:
❌ Erro completo ao fazer upload: ...
```

### **Logs do Servidor (Supabase Functions Logs):**
```
📸 Avatar upload request from user: [user-id]
📸 File type: image/jpeg
📸 File size: 123456
📸 Uploading to: avatars/user-123-456789.jpg
✅ File uploaded successfully
🔗 Public URL generated: https://...
```

### **Como acessar logs do servidor:**

1. **Supabase Dashboard**
2. **Edge Functions → make-server-0ea22bba → Logs**
3. **Procure por linhas com 📸**

---

## ✅ VERIFICAÇÃO FINAL

### **Checklist:**

- [ ] Endpoint `/upload-avatar` existe no servidor
- [ ] Servidor usa `service_role_key` (não anon_key)
- [ ] Frontend chama o endpoint correto
- [ ] Bucket `make-0ea22bba-avatars` existe
- [ ] Bucket é público OU tem políticas RLS configuradas
- [ ] Token de autenticação está sendo enviado

### **Teste Completo:**

```
1. F12 (Console aberto)
2. Login
3. Meu Perfil → Editar Perfil
4. Adicionar Foto
5. Selecionar imagem (< 5MB, JPG/PNG/WEBP)
6. Verificar logs:
   📤 Iniciando upload via servidor...
   [deve aparecer requisição para /upload-avatar]
   ✅ Upload concluído!
   🔗 URL pública: https://...
7. Toast verde
8. Preview aparece
9. Salvar
10. Foto aparece no perfil
```

---

## 🆘 AINDA COM ERRO?

Me envie:

### **1. Logs do Console (Frontend):**
```
Ctrl+A no Console → Copiar tudo
```

### **2. Logs do Servidor:**
```
Supabase → Edge Functions → Logs
Procure por 📸 e ❌
```

### **3. Configuração do Bucket:**
```
Supabase → Storage → make-0ea22bba-avatars → Settings
Captura de tela ou copie as configurações
```

### **4. Informações do erro:**
```
- Mensagem exata do erro
- Código HTTP (400, 403, 500, etc)
- Quando acontece (ao clicar "Adicionar Foto"? Ao fazer upload?)
```

---

## 💡 POR QUE ISSO ACONTECEU?

**Storage no Supabase:**
- Por padrão, **bloqueia tudo**
- Requer **políticas RLS** explícitas
- Ou uso de **service_role_key** (servidor)

**Nossa solução:**
- Servidor tem `service_role_key`
- Contorna RLS automaticamente
- Upload seguro e controlado

**Antes:**
```
Frontend → Supabase Storage
          ❌ RLS bloqueia
```

**Agora:**
```
Frontend → Servidor → Supabase Storage
          (service_role)  ✅ Permitido
```

---

## 🎉 RESULTADO ESPERADO

Quando funcionar:

✅ Upload rápido e sem erros
✅ Toast verde confirmando
✅ Preview instantâneo da foto
✅ Foto salva no perfil
✅ Foto aparece em todo o site
✅ URL pública acessível

**Teste agora e me avise! 📸**

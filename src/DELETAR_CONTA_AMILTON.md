# 🗑️ DELETAR CONTA - amiltonsousa110999@gmail.com

## ⚡ AÇÃO RÁPIDA

---

## 🎯 OPÇÃO 1: SQL DIRETO (RECOMENDADO)

### **Executar no Supabase SQL Editor:**

```
1. https://supabase.com/dashboard
2. Seu projeto VolleyPro
3. SQL Editor
4. Copiar e colar o código abaixo
5. Run
```

---

### **📋 SCRIPT SQL - COPIAR E COLAR:**

```sql
-- 🗑️ DELETAR CONTA COMPLETA - AMILTON
-- Email: amiltonsousa110999@gmail.com

BEGIN;

-- 1. Verificar se usuário existe
SELECT 
  id,
  email,
  created_at,
  'Usuário encontrado - será deletado' as status
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';

-- 2. Buscar ID do usuário
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Pegar ID do usuário
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'amiltonsousa110999@gmail.com';

  IF user_id IS NOT NULL THEN
    -- 3. Deletar dados relacionados no KV store (se existir)
    DELETE FROM kv_store_0ea22bba
    WHERE key LIKE '%' || user_id::text || '%'
       OR value::text LIKE '%' || user_id::text || '%';
    
    RAISE NOTICE 'Dados do KV store removidos';

    -- 4. Deletar usuário do auth
    DELETE FROM auth.users
    WHERE id = user_id;
    
    RAISE NOTICE 'Usuário deletado com sucesso!';
  ELSE
    RAISE NOTICE 'Usuário não encontrado';
  END IF;
END $$;

-- 5. Confirmar deleção
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Conta deletada com sucesso!'
    ELSE '❌ Conta ainda existe'
  END as resultado
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';

COMMIT;
```

---

## 🎯 OPÇÃO 2: DASHBOARD (VISUAL)

### **Passo a passo:**

```
1. https://supabase.com/dashboard
2. Seu projeto VolleyPro
3. Authentication
4. Users
5. Procurar: amiltonsousa110999@gmail.com
6. Clicar no email
7. Clicar em "Delete user" (botão vermelho)
8. Confirmar: "Delete"
9. ✅ Pronto!
```

---

## 🎯 OPÇÃO 3: SCRIPT SIMPLES (RÁPIDO)

### **SQL Curto:**

```sql
-- DELETAR RAPIDAMENTE
DELETE FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';

-- VERIFICAR
SELECT 'Conta deletada!' as status
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users 
  WHERE email = 'amiltonsousa110999@gmail.com'
);
```

---

## ✅ RESULTADO ESPERADO

### **Após executar:**

```
✅ Conta deletada com sucesso!
```

**OU no Dashboard:**

```
User successfully deleted
```

---

## 🧪 VERIFICAR SE FOI DELETADO

### **SQL:**

```sql
-- Verificar se ainda existe
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Conta não existe mais'
    ELSE '❌ Conta ainda existe'
  END as status,
  COUNT(*) as total
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

**Resultado esperado:**
```
✅ Conta não existe mais | 0
```

---

## 📝 APÓS DELETAR

### **Amilton pode cadastrar novamente:**

```
1. https://volleypro-zw96.vercel.app
2. Clicar "Entrar"
3. Clicar "Criar Conta"
4. Email: amiltonsousa110999@gmail.com
5. Senha: [nova senha]
6. Nome: [seu nome]
7. Criar conta
8. ✅ Cadastro com sucesso!
```

---

## ⚠️ IMPORTANTE

### **O que será deletado:**

- ✅ Conta de autenticação
- ✅ Dados do usuário
- ✅ Sessões ativas
- ✅ Tokens de recuperação
- ✅ Dados relacionados no KV store

### **O que NÃO será deletado (se existir):**

- Posts criados (se houver)
- Comentários (se houver)
- Fotos (se houver)

**Se quiser deletar TUDO:**

```sql
-- DELETAR TUDO RELACIONADO AO USUÁRIO
DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'amiltonsousa110999@gmail.com';

  IF user_id IS NOT NULL THEN
    -- Deletar tudo do KV store
    DELETE FROM kv_store_0ea22bba
    WHERE key LIKE '%' || user_id::text || '%'
       OR value::text LIKE '%' || user_id::text || '%';
    
    -- Deletar usuário
    DELETE FROM auth.users WHERE id = user_id;
    
    RAISE NOTICE 'Usuário e todos os dados deletados!';
  END IF;
END $$;
```

---

## 🚨 AVISO DE SEGURANÇA

**⚠️ DELEÇÃO É PERMANENTE!**

- Não tem "desfazer"
- Não tem backup automático
- Todos os dados serão perdidos

**Tem certeza?**

- [ ] Sim, quero deletar a conta
- [ ] Sim, Amilton vai se cadastrar novamente
- [ ] Sim, entendo que é permanente

---

## 🎯 RESUMO - AÇÃO IMEDIATA

### **Mais Rápido (15 segundos):**

```
1. Supabase Dashboard
2. Authentication > Users
3. amiltonsousa110999@gmail.com
4. Delete user
5. ✅ Pronto!
```

### **Mais Completo (30 segundos):**

```
1. Supabase SQL Editor
2. Copiar SCRIPT SQL acima (OPÇÃO 1)
3. Run
4. Ver: "✅ Conta deletada com sucesso!"
5. ✅ Pronto!
```

---

## 📞 INFORMAR AMILTON

**Depois de deletar:**

```
📧 Amilton,

Sua conta antiga foi removida do sistema.

Agora você pode se cadastrar novamente em:
https://volleypro-zw96.vercel.app

Use o mesmo email:
amiltonsousa110999@gmail.com

E crie uma nova senha de sua escolha.

✅ Tudo funcionará normalmente!
```

---

## 🎉 PRONTO!

**Escolha uma opção:**

- 🟢 **OPÇÃO 1:** SQL completo (30s) - Recomendado
- 🟡 **OPÇÃO 2:** Dashboard visual (15s) - Mais fácil
- 🔵 **OPÇÃO 3:** SQL rápido (10s) - Mais rápido

**Todas funcionam! Escolha a que preferir! 🚀**

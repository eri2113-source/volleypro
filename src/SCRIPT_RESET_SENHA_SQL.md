# 🔧 SCRIPT SQL - RESET SENHA AMILTON

## ⚡ EXECUTAR NO SUPABASE SQL EDITOR

---

## 📍 ONDE EXECUTAR

```
1. Abrir: https://supabase.com/dashboard
2. Selecionar projeto: VolleyPro
3. Menu lateral: SQL Editor
4. Ou: https://supabase.com/dashboard/project/SEU_PROJECT_ID/sql/new
```

---

## 🎯 OPÇÃO 1: VERIFICAR SE USUÁRIO EXISTE

### **Copiar e colar no SQL Editor:**

```sql
-- 🔍 VERIFICAR SE EMAIL EXISTE
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at,
  raw_user_meta_data->>'name' as nome
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

### **Resultado esperado:**

```
┌──────────────────────────────────────┬────────────────────────────┬─────────────────────┐
│ id                                   │ email                      │ created_at          │
├──────────────────────────────────────┼────────────────────────────┼─────────────────────┤
│ uuid-aqui                            │ amiltonsousa110999@...     │ 2024-12-XX XX:XX:XX │
└──────────────────────────────────────┴────────────────────────────┴─────────────────────┘
```

**Se retornar resultado:** ✅ Usuário existe, pode resetar senha  
**Se não retornar nada:** ❌ Email não cadastrado

---

## 🎯 OPÇÃO 2: VER TODOS OS DADOS DO USUÁRIO

```sql
-- 📊 INFORMAÇÕES COMPLETAS DO USUÁRIO
SELECT 
  id,
  email,
  created_at,
  updated_at,
  last_sign_in_at,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

**Informações úteis:**
- `email_confirmed_at`: Email foi confirmado?
- `recovery_sent_at`: Último email de recuperação enviado
- `last_sign_in_at`: Último login
- `raw_user_meta_data`: Nome, foto, etc.

---

## 🎯 OPÇÃO 3: RESETAR SENHA MANUALMENTE (AVANÇADO)

### **⚠️ CUIDADO: ISSO DEFINE UMA NOVA SENHA DIRETAMENTE**

```sql
-- 🔐 DEFINIR NOVA SENHA
-- ATENÇÃO: Execute apenas se souber o que está fazendo!

-- Senha temporária: VolleyPro@2025
-- Hash bcrypt gerado para esta senha

UPDATE auth.users
SET 
  encrypted_password = crypt('VolleyPro@2025', gen_salt('bf')),
  updated_at = now()
WHERE email = 'amiltonsousa110999@gmail.com';

-- Retornar confirmação
SELECT 
  email,
  'Senha resetada para: VolleyPro@2025' as mensagem,
  updated_at
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

**⚠️ IMPORTANTE:**
- Isso define a senha como `VolleyPro@2025`
- Informe o usuário da senha temporária
- Peça para trocar após o login

---

## 🎯 OPÇÃO 4: MARCAR EMAIL COMO CONFIRMADO

**Se o problema for email não confirmado:**

```sql
-- ✅ CONFIRMAR EMAIL MANUALMENTE
UPDATE auth.users
SET 
  email_confirmed_at = now(),
  updated_at = now()
WHERE email = 'amiltonsousa110999@gmail.com'
AND email_confirmed_at IS NULL;

-- Ver resultado
SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ Não confirmado'
  END as status
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

---

## 🎯 OPÇÃO 5: VER HISTÓRICO DE EMAILS ENVIADOS

```sql
-- 📧 VERIFICAR EMAILS DE RECUPERAÇÃO ENVIADOS
SELECT 
  email,
  recovery_sent_at,
  CASE 
    WHEN recovery_sent_at IS NULL THEN 'Nenhum email enviado'
    WHEN recovery_sent_at > (now() - interval '1 hour') THEN 'Email recente (< 1h)'
    WHEN recovery_sent_at > (now() - interval '24 hours') THEN 'Email nas últimas 24h'
    ELSE 'Email antigo'
  END as status_email,
  EXTRACT(EPOCH FROM (now() - recovery_sent_at)) / 60 as minutos_desde_ultimo_email
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

---

## 🎯 OPÇÃO 6: LIMPAR HISTÓRICO DE RECUPERAÇÃO

**Se precisar reenviar email e está dando erro de "email já enviado":**

```sql
-- 🔄 LIMPAR TIMESTAMP DE RECOVERY
UPDATE auth.users
SET 
  recovery_sent_at = NULL,
  updated_at = now()
WHERE email = 'amiltonsousa110999@gmail.com';

-- Confirmar
SELECT 
  email,
  'Recovery timestamp limpo - pode enviar novo email' as status
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

**Depois disso, pode enviar novo email via Dashboard ou site**

---

## 🎯 OPÇÃO 7: CRIAR SENHA FORTE PERSONALIZADA

```sql
-- 🔐 DEFINIR SENHA PERSONALIZADA
-- Substitua 'SUA_SENHA_AQUI' pela senha desejada

UPDATE auth.users
SET 
  encrypted_password = crypt('SUA_SENHA_AQUI', gen_salt('bf')),
  updated_at = now()
WHERE email = 'amiltonsousa110999@gmail.com';

-- Confirmar
SELECT 
  email,
  'Senha atualizada com sucesso!' as status,
  updated_at
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

**Exemplos de senhas fortes:**
- `Amilton#Volei2025`
- `VolleyPro@Amilton123`
- `Ace!Sousa#2025`

---

## 📋 SEQUÊNCIA RECOMENDADA

### **EXECUTE NESTA ORDEM:**

```sql
-- 1️⃣ VERIFICAR SE USUÁRIO EXISTE
SELECT email, created_at 
FROM auth.users 
WHERE email = 'amiltonsousa110999@gmail.com';

-- Se retornou resultado, continuar:

-- 2️⃣ VER STATUS DO EMAIL
SELECT 
  email,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'amiltonsousa110999@gmail.com';

-- 3️⃣ SE NECESSÁRIO: LIMPAR RECOVERY
UPDATE auth.users
SET recovery_sent_at = NULL
WHERE email = 'amiltonsousa110999@gmail.com';

-- 4️⃣ SE NECESSÁRIO: CONFIRMAR EMAIL
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'amiltonsousa110999@gmail.com'
AND email_confirmed_at IS NULL;

-- 5️⃣ DEFINIR NOVA SENHA (SE REALMENTE NECESSÁRIO)
UPDATE auth.users
SET encrypted_password = crypt('VolleyPro@2025', gen_salt('bf'))
WHERE email = 'amiltonsousa110999@gmail.com';

-- 6️⃣ CONFIRMAR MUDANÇAS
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmado,
  updated_at as ultima_atualizacao
FROM auth.users 
WHERE email = 'amiltonsousa110999@gmail.com';
```

---

## 🎯 SCRIPT COMPLETO (COPIAR E COLAR)

### **Para resetar senha rapidamente:**

```sql
-- ⚡ RESET RÁPIDO DE SENHA - AMILTON
-- Nova senha: VolleyPro@2025

BEGIN;

-- Verificar usuário
SELECT email, 'Usuário encontrado!' as status
FROM auth.users 
WHERE email = 'amiltonsousa110999@gmail.com';

-- Confirmar email (se não estiver)
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  recovery_sent_at = NULL,
  updated_at = now()
WHERE email = 'amiltonsousa110999@gmail.com';

-- Resetar senha
UPDATE auth.users
SET 
  encrypted_password = crypt('VolleyPro@2025', gen_salt('bf')),
  updated_at = now()
WHERE email = 'amiltonsousa110999@gmail.com';

-- Confirmar
SELECT 
  email,
  '✅ Senha resetada!' as status,
  'Nova senha: VolleyPro@2025' as nova_senha,
  email_confirmed_at IS NOT NULL as email_confirmado,
  updated_at as atualizado_em
FROM auth.users 
WHERE email = 'amiltonsousa110999@gmail.com';

COMMIT;
```

**Resultado esperado:**

```
┌────────────────────────────┬──────────────────┬───────────────────────────┐
│ email                      │ status           │ nova_senha                │
├────────────────────────────┼──────────────────┼───────────────────────────┤
│ amiltonsousa110999@...     │ ✅ Senha resetada│ VolleyPro@2025            │
└────────────────────────────┴──────────────────┴───────────────────────────┘
```

---

## ⚠️ IMPORTANTE - APÓS EXECUTAR

### **1. Informar o usuário:**

```
📧 Email: amiltonsousa110999@gmail.com
🔑 Senha temporária: VolleyPro@2025

⚠️ Por favor, faça login e TROQUE A SENHA imediatamente!

Login em: https://volleypro-zw96.vercel.app
```

### **2. Como o usuário troca a senha:**

```
1. Login com: amiltonsousa110999@gmail.com / VolleyPro@2025
2. Ir em: Meu Perfil > Editar
3. Trocar senha
4. Salvar
```

---

## 🚨 ERROS COMUNS

### **"function crypt does not exist"**

```sql
-- Instalar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Depois executar novamente o UPDATE
```

---

### **"permission denied for table auth.users"**

```
Solução:
- Executar no SQL Editor como ADMIN
- Ou usar o Dashboard do Supabase > Authentication
```

---

### **"email not found"**

```sql
-- Verificar variações do email
SELECT email 
FROM auth.users 
WHERE email ILIKE '%amilton%';

-- Ou buscar por domínio
SELECT email 
FROM auth.users 
WHERE email LIKE '%@gmail.com';
```

---

## 🎯 RESUMO - O QUE FAZER

### **CAMINHO MAIS SIMPLES:**

```
1. Executar OPÇÃO 1 (verificar se existe)
2. Se existir, executar SCRIPT COMPLETO
3. Informar nova senha ao usuário: VolleyPro@2025
4. Pedir para trocar após login
```

**Tempo: ~30 segundos**

---

### **CAMINHO MAIS SEGURO:**

```
1. Executar OPÇÃO 6 (limpar recovery)
2. Ir no Dashboard: Authentication > Users
3. Clicar no usuário
4. "Send password reset email"
5. Usuário recebe email e cria própria senha
```

**Tempo: ~2 minutos**

---

## ✅ PRONTO!

**Agora você pode:**
- ✅ Verificar se usuário existe
- ✅ Ver status do email
- ✅ Resetar senha manualmente
- ✅ Enviar email de recuperação
- ✅ Confirmar email
- ✅ Limpar histórico de recovery

**Escolha o método e execute! 🚀**

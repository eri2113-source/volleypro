# ⚡ RESET SENHA RÁPIDO - amiltonsousa110999@gmail.com

## 🎯 3 OPÇÕES (ESCOLHA UMA)

---

## 🟢 OPÇÃO 1: PELO SITE (MAIS SIMPLES)

### **O próprio Amilton faz:**

```
1. https://volleypro-zw96.vercel.app
2. Clicar "Entrar"
3. Clicar "Esqueci minha senha"
4. Digitar: amiltonsousa110999@gmail.com
5. Clicar "Enviar Link"
6. Verificar email (e spam)
7. Clicar no link do email
8. Criar nova senha
9. ✅ Pronto!
```

**Tempo:** 2 minutos  
**Segurança:** ✅ Alta  
**Requer:** Acesso ao email

---

## 🟡 OPÇÃO 2: VIA SUPABASE DASHBOARD

### **Você envia email de reset:**

```
1. https://supabase.com/dashboard
2. Seu projeto VolleyPro
3. Authentication > Users
4. Procurar: amiltonsousa110999@gmail.com
5. Clicar no email
6. "Send password reset email"
7. ✅ Email enviado!
```

**Amilton recebe email e cria nova senha**

**Tempo:** 1 minuto  
**Segurança:** ✅ Alta  
**Requer:** Você tem acesso ao Supabase

---

## 🔴 OPÇÃO 3: SQL DIRETO (EMERGÊNCIA)

### **Resetar senha via SQL:**

```
1. https://supabase.com/dashboard
2. Seu projeto > SQL Editor
3. Copiar e colar este código:
```

```sql
-- RESET RÁPIDO
UPDATE auth.users
SET encrypted_password = crypt('VolleyPro@2025', gen_salt('bf'))
WHERE email = 'amiltonsousa110999@gmail.com';

SELECT 'Senha resetada: VolleyPro@2025' as resultado;
```

```
4. Run (executar)
5. ✅ Senha alterada!
```

**Informar Amilton:**
- Email: `amiltonsousa110999@gmail.com`
- Senha: `VolleyPro@2025`
- Pedir para trocar após login

**Tempo:** 30 segundos  
**Segurança:** ⚠️ Média (você define a senha)  
**Requer:** Acesso ao SQL do Supabase

---

## 📋 QUAL USAR?

| Situação | Use |
|----------|-----|
| Amilton tem acesso ao email | OPÇÃO 1 |
| Você é admin, Amilton ocupado | OPÇÃO 2 |
| Emergência, precisa agora | OPÇÃO 3 |

---

## ✅ RECOMENDAÇÃO

**USE OPÇÃO 2:**
1. Rápido
2. Seguro
3. Amilton define própria senha

---

## 🚀 AÇÃO IMEDIATA

### **COPIAR E EXECUTAR:**

**No Supabase SQL Editor:**

```sql
-- Verificar se existe
SELECT email, created_at 
FROM auth.users 
WHERE email = 'amiltonsousa110999@gmail.com';

-- Se existir, resetar
UPDATE auth.users
SET encrypted_password = crypt('VolleyPro@2025', gen_salt('bf'))
WHERE email = 'amiltonsousa110999@gmail.com';

-- Confirmar
SELECT '✅ Senha: VolleyPro@2025' as resultado;
```

**Depois:**
```
📞 Informar Amilton:
   Email: amiltonsousa110999@gmail.com
   Senha: VolleyPro@2025
   Link: https://volleypro-zw96.vercel.app
```

---

## 🎉 PRONTO!

Escolha uma opção e execute! 🚀

**Qualquer dúvida:**
- 📄 Ver `/RESETAR_SENHA_AMILTON.md` (completo)
- 📄 Ver `/SCRIPT_RESET_SENHA_SQL.md` (SQL avançado)

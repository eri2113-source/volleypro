# 🗑️ DELETAR CONTA AMILTON - GUIA RÁPIDO

## ⚡ 2 OPÇÕES (ESCOLHA UMA)

---

## 🟢 OPÇÃO 1: DASHBOARD (15 SEGUNDOS)

### **Passo a passo visual:**

```
1. https://supabase.com/dashboard

2. Clicar no projeto "VolleyPro"

3. Menu lateral → Authentication → Users

4. Campo de busca → digitar:
   amiltonsousa110999@gmail.com

5. Clicar no email do usuário

6. Botão vermelho "Delete user"

7. Confirmar "Delete"

8. ✅ PRONTO!
```

**Tempo:** 15 segundos

---

## 🔵 OPÇÃO 2: SQL (10 SEGUNDOS)

### **Copiar e colar:**

```
1. https://supabase.com/dashboard

2. Clicar no projeto "VolleyPro"

3. Menu lateral → SQL Editor

4. Copiar e colar isto:
```

```sql
DELETE FROM auth.users WHERE email = 'amiltonsousa110999@gmail.com';
```

```
5. Clicar "Run"

6. ✅ PRONTO!
```

**Tempo:** 10 segundos

---

## ✅ VERIFICAR SE FOI DELETADO

### **SQL:**

```sql
SELECT COUNT(*) FROM auth.users WHERE email = 'amiltonsousa110999@gmail.com';
```

**Resultado esperado:** `0`

---

## 📧 INFORMAR AMILTON

```
Amilton,

Sua conta foi removida.

Agora você pode se cadastrar novamente:
👉 https://volleypro-zw96.vercel.app

Use:
📧 Email: amiltonsousa110999@gmail.com
🔑 Senha: [escolha uma nova senha]

✅ Tudo funcionará!
```

---

## 🎯 ESCOLHA SUA OPÇÃO

| Opção | Tempo | Dificuldade | Método |
|-------|-------|-------------|--------|
| **1** | 15s | ⭐ Fácil | Dashboard visual |
| **2** | 10s | ⭐⭐ Médio | SQL direto |

**Recomendação:** Use **OPÇÃO 1** se não sabe SQL, **OPÇÃO 2** se quer mais rápido.

---

## 🎉 PRONTO!

Depois de deletar, Amilton pode criar nova conta normalmente! 🚀

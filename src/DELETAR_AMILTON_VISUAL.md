# 🗑️ DELETAR CONTA AMILTON - VISUAL

## 📸 PASSO A PASSO COM IMAGENS

---

## 🎯 MÉTODO DASHBOARD (RECOMENDADO)

---

### **PASSO 1: Acessar Supabase**

```
🌐 URL: https://supabase.com/dashboard
```

```
┌────────────────────────────────────────┐
│  Supabase                              │
├────────────────────────────────────────┤
│                                        │
│  🔍 Search projects...                 │
│                                        │
│  📁 Your Projects:                     │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  VolleyPro                       │ │
│  │  Project ID: xxxxx               │ │
│  │  [Open] ← CLICAR AQUI            │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

### **PASSO 2: Ir para Authentication**

```
┌────────────────────────────────────────┐
│  VolleyPro                             │
├────────────────────────────────────────┤
│  Menu Lateral:                         │
│                                        │
│  📊 Dashboard                          │
│  🗄️  Database                          │
│  🔐 Authentication  ← CLICAR AQUI      │
│  📁 Storage                            │
│  ⚡ Edge Functions                     │
│  🔧 Settings                           │
└────────────────────────────────────────┘
```

---

### **PASSO 3: Ir para Users**

```
┌────────────────────────────────────────┐
│  Authentication                        │
├────────────────────────────────────────┤
│  Submenu:                              │
│                                        │
│  👥 Users        ← CLICAR AQUI         │
│  🔑 Policies                           │
│  🌐 Providers                          │
│  ⚙️  Settings                          │
└────────────────────────────────────────┘
```

---

### **PASSO 4: Buscar Usuário**

```
┌────────────────────────────────────────────────┐
│  Users                                         │
├────────────────────────────────────────────────┤
│  🔍 Search by email...                         │
│  [amiltonsousa110999@gmail.com    ] 🔍         │
│  ↑ DIGITAR E PRESSIONAR ENTER                  │
├────────────────────────────────────────────────┤
│  Results:                                      │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 📧 amiltonsousa110999@gmail.com          │ │
│  │ ID: uuid-xxxx-xxxx                       │ │
│  │ Created: 2024-12-XX                      │ │
│  │ ← CLICAR NO EMAIL                        │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

### **PASSO 5: Detalhes do Usuário**

```
┌────────────────────────────────────────────────┐
│  User Details                                  │
├────────────────────────────────────────────────┤
│  Email: amiltonsousa110999@gmail.com           │
│  User ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx │
│  Created at: 2024-12-XX XX:XX:XX               │
│  Last sign in: 2024-12-XX XX:XX:XX             │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │                                        │   │
│  │  [Update User]                         │   │
│  │                                        │   │
│  │  [🗑️  Delete User]  ← CLICAR AQUI     │   │
│  │  (botão vermelho)                      │   │
│  │                                        │   │
│  └────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

---

### **PASSO 6: Confirmar Deleção**

```
┌────────────────────────────────────────┐
│  ⚠️  Confirm Deletion                  │
├────────────────────────────────────────┤
│                                        │
│  Are you sure you want to delete       │
│  this user?                            │
│                                        │
│  Email: amiltonsousa110999@gmail.com   │
│                                        │
│  ⚠️ This action cannot be undone.      │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  [Cancel]     [Delete] ← CLICAR  │ │
│  │                (vermelho)        │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

### **PASSO 7: Sucesso!**

```
┌────────────────────────────────────────┐
│  ✅ Success!                           │
├────────────────────────────────────────┤
│                                        │
│  User successfully deleted.            │
│                                        │
│  Email: amiltonsousa110999@gmail.com   │
│                                        │
│  [OK]                                  │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎯 MÉTODO SQL (ALTERNATIVO)

---

### **PASSO 1: SQL Editor**

```
┌────────────────────────────────────────┐
│  VolleyPro                             │
├────────────────────────────────────────┤
│  Menu Lateral:                         │
│                                        │
│  📊 Dashboard                          │
│  🗄️  Database                          │
│  📝 SQL Editor    ← CLICAR AQUI        │
│  📁 Storage                            │
└────────────────────────────────────────┘
```

---

### **PASSO 2: Nova Query**

```
┌────────────────────────────────────────┐
│  SQL Editor                            │
├────────────────────────────────────────┤
│  [+ New Query]  ← CLICAR               │
└────────────────────────────────────────┘
```

---

### **PASSO 3: Copiar e Colar**

```
┌──────────────────────────────────────────────┐
│  SQL Query                                   │
├──────────────────────────────────────────────┤
│  1  DELETE FROM auth.users                   │
│  2  WHERE email = 'amiltonsousa110999@...'   │
│  3                                           │
│  ↑ COLAR O CÓDIGO AQUI                       │
│                                              │
│  [▶ Run]  ← CLICAR                           │
└──────────────────────────────────────────────┘
```

---

### **PASSO 4: Resultado**

```
┌──────────────────────────────────────────────┐
│  Query Results                               │
├──────────────────────────────────────────────┤
│  ✅ Success                                  │
│                                              │
│  DELETE 1                                    │
│                                              │
│  1 row affected                              │
└──────────────────────────────────────────────┘
```

---

## ✅ VERIFICAR DELEÇÃO

### **Rodar esta query:**

```sql
SELECT COUNT(*) as total
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';
```

### **Resultado esperado:**

```
┌───────┐
│ total │
├───────┤
│   0   │  ← ✅ Conta deletada!
└───────┘
```

**Se retornar 0:** ✅ Conta deletada com sucesso!  
**Se retornar 1:** ❌ Erro, conta ainda existe

---

## 📧 APÓS DELETAR - INFORMAR AMILTON

```
┌────────────────────────────────────────────────┐
│  📧 Mensagem para Amilton                      │
├────────────────────────────────────────────────┤
│                                                │
│  Olá Amilton,                                  │
│                                                │
│  Sua conta antiga foi removida do sistema.     │
│                                                │
│  Agora você pode se cadastrar novamente:       │
│  👉 https://volleypro-zw96.vercel.app          │
│                                                │
│  Use:                                          │
│  📧 Email: amiltonsousa110999@gmail.com        │
│  🔑 Senha: [escolha uma nova senha]            │
│  👤 Nome: [seu nome completo]                  │
│                                                │
│  ✅ O cadastro funcionará normalmente!         │
│                                                │
│  Qualquer dúvida, estou à disposição.          │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🎯 RESUMO VISUAL

### **OPÇÃO 1 - Dashboard:**

```
Supabase → VolleyPro → Authentication → Users
→ Buscar email → Clicar no usuário → Delete User
→ Confirmar → ✅ Pronto!
```

**Tempo:** ⏱️ 15-20 segundos

---

### **OPÇÃO 2 - SQL:**

```
Supabase → VolleyPro → SQL Editor → New Query
→ Colar código → Run → ✅ Pronto!
```

**Tempo:** ⏱️ 10-15 segundos

---

## ⚠️ LEMBRETE IMPORTANTE

```
┌────────────────────────────────────────┐
│  ⚠️  ATENÇÃO                           │
├────────────────────────────────────────┤
│                                        │
│  ✅ Deleção é PERMANENTE               │
│  ✅ Não tem "desfazer"                 │
│  ✅ Todos os dados serão perdidos      │
│  ✅ Amilton pode se cadastrar de novo  │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎉 PRONTO!

Escolha uma das opções e execute! Amilton poderá se cadastrar novamente normalmente! 🚀

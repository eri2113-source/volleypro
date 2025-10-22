# 🔐 RESETAR SENHA - amiltonsousa110999@gmail.com

## ⚡ 2 FORMAS DE RESETAR

---

## 🎯 FORMA 1: AUTOMÁTICA (RECOMENDADA)

### **O usuário faz pelo site:**

1. **Acessar:** https://volleypro-zw96.vercel.app
2. **Clicar em:** "Entrar"
3. **Clicar em:** "Esqueci minha senha"
4. **Digitar:** `amiltonsousa110999@gmail.com`
5. **Clicar em:** "Enviar Link de Recuperação"
6. **Verificar email** (incluindo SPAM)
7. **Clicar no link** do email
8. **Criar nova senha** (mínimo 6 caracteres)
9. ✅ **Pronto!**

**Vantagem:** Seguro, automático, funciona sempre

---

## 🔧 FORMA 2: MANUAL (ADMIN SUPABASE)

### **Você faz pelo Supabase:**

### **PASSO 1: Acessar Supabase**

```
1. Abrir: https://supabase.com/dashboard
2. Login com sua conta
3. Selecionar projeto VolleyPro
```

---

### **PASSO 2: Ir para Authentication**

```
Dashboard > Authentication > Users
```

Ou acesso direto:
```
https://supabase.com/dashboard/project/SEU_PROJECT_ID/auth/users
```

---

### **PASSO 3: Encontrar o Usuário**

```
1. Na lista de usuários, procurar por:
   Email: amiltonsousa110999@gmail.com

2. Ou usar o campo de busca no topo:
   🔍 [amiltonsousa110999@gmail.com]
```

---

### **PASSO 4: Opções de Reset**

Quando encontrar o usuário, você tem **3 opções**:

#### **OPÇÃO A: Enviar Email de Reset (Seguro)**

```
1. Clicar no email do usuário (abre detalhes)
2. Clicar no botão "Send password reset email"
3. ✅ Email de recuperação enviado

O usuário recebe email e cria nova senha
```

#### **OPÇÃO B: Definir Nova Senha (Direto)**

```
1. Clicar no email do usuário
2. Clicar em "Update user" ou ⋮ (três pontos)
3. Selecionar "Reset password"
4. Digitar nova senha temporária (ex: VolleyPro@2025)
5. Salvar
6. ✅ Senha alterada!

⚠️ IMPORTANTE: Informar o usuário da nova senha temporária
```

#### **OPÇÃO C: Deletar e Recriar (Último Caso)**

```
⚠️ SÓ USE SE AS OUTRAS OPÇÕES NÃO FUNCIONAREM

1. Anotar dados do usuário (nome, plano, etc.)
2. Deletar usuário
3. Usuário cria nova conta normalmente
4. Replicar dados manualmente (se necessário)
```

---

## 📋 PASSO A PASSO VISUAL - OPÇÃO A (RECOMENDADA)

### **1. Dashboard do Supabase**

```
┌─────────────────────────────────────────┐
│ VolleyPro                               │
│ ┌─────────────────────────────────────┐ │
│ │ 📊 Database                         │ │
│ │ 🔐 Authentication        ← CLICAR   │ │
│ │ 📁 Storage                          │ │
│ │ ⚡ Edge Functions                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### **2. Menu Authentication**

```
┌─────────────────────────────────────────┐
│ Authentication                          │
│ ┌─────────────────────────────────────┐ │
│ │ Users                   ← CLICAR    │ │
│ │ Policies                            │ │
│ │ Providers                           │ │
│ │ Rate Limits                         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### **3. Lista de Usuários**

```
┌────────────────────────────────────────────────┐
│ Users                          🔍 [Search...]  │
├────────────────────────────────────────────────┤
│ Email                    | Created    | Status │
├────────────────────────────────────────────────┤
│ amiltonsousa110999       | 2 days ago | Active │
│ @gmail.com               |            |        │
│ ↑ CLICAR AQUI                                  │
├────────────────────────────────────────────────┤
│ outro@email.com          | 5 days ago | Active │
└────────────────────────────────────────────────┘
```

---

### **4. Detalhes do Usuário**

```
┌────────────────────────────────────────────────┐
│ User Details                                   │
├────────────────────────────────────────────────┤
│ Email: amiltonsousa110999@gmail.com            │
│ ID: uuid-aqui                                  │
│ Created: 2024-12-XX                            │
│ Last sign in: 2024-12-XX                       │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ [Send password reset email]  ← CLICAR     │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ [Update user]                              │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ [Delete user]                              │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

### **5. Após Clicar "Send password reset email"**

```
┌────────────────────────────────────────────────┐
│ ✅ Success!                                    │
│                                                │
│ Password reset email sent to:                  │
│ amiltonsousa110999@gmail.com                   │
│                                                │
│ The user will receive an email with a link to  │
│ reset their password.                          │
│                                                │
│ [OK]                                           │
└────────────────────────────────────────────────┘
```

---

## 📧 O QUE ACONTECE DEPOIS

### **1. Email Enviado**

```
Para: amiltonsousa110999@gmail.com
De: noreply@supabase.com / auth@volleypro.com
Assunto: Reset Your Password

Olá,

Você solicitou a redefinição de senha da sua conta VolleyPro.

Clique no link abaixo para criar uma nova senha:

[Redefinir minha senha]
↓
https://volleypro-zw96.vercel.app/#reset-password?token=...

Este link é válido por 1 hora.

Se você não solicitou esta alteração, ignore este email.

---
VolleyPro - Rede Social do Vôlei
```

---

### **2. Usuário Clica no Link**

```
Navegador abre automaticamente:
https://volleypro-zw96.vercel.app/#reset-password

Tela aparece:
┌─────────────────────────────────────┐
│ 🔐 Redefinir Senha                  │
│                                     │
│ Nova senha:                         │
│ [••••••••••••] 👁                   │
│                                     │
│ Confirmar nova senha:               │
│ [••••••••••••] 👁                   │
│                                     │
│ Força: [████████] Forte ✅          │
│                                     │
│ [Redefinir Senha]                   │
└─────────────────────────────────────┘
```

---

### **3. Nova Senha Definida**

```
✅ Senha alterada com sucesso!

Agora você pode fazer login com sua nova senha.

[Voltar para Login]
```

---

### **4. Login com Nova Senha**

```
Email: amiltonsousa110999@gmail.com
Senha: [nova senha criada pelo usuário]

[Entrar]

✅ Login bem-sucedido!
```

---

## ⚠️ VERIFICAÇÕES IMPORTANTES

### **Antes de resetar, verificar:**

- [ ] Email está correto: `amiltonsousa110999@gmail.com`
- [ ] Usuário realmente esqueceu a senha
- [ ] Usuário tem acesso ao email
- [ ] Email não está bloqueado/desativado

### **Após enviar email:**

- [ ] Email foi enviado com sucesso (confirmação no Supabase)
- [ ] Usuário verificou caixa de entrada
- [ ] Usuário verificou SPAM
- [ ] Link não expirou (válido por 1h)

---

## 🚨 PROBLEMAS COMUNS

### **"Email não existe no sistema"**

```
Solução:
1. Verificar se email está correto
2. Buscar variações:
   - amiltonsousa110999@gmail.com
   - AMILTONSOUSA110999@gmail.com
   - amilton.sousa110999@gmail.com
3. Pedir para o usuário criar nova conta
```

---

### **"Email não chegou"**

```
Checklist:
1. Aguardar 5 minutos
2. Verificar pasta SPAM
3. Verificar caixa de entrada não está cheia
4. Gmail pode estar bloqueando (verificar configurações)
5. Tentar enviar novamente
```

---

### **"Link expirado"**

```
Solução:
1. Enviar novo email de reset
2. Pedir para clicar IMEDIATAMENTE no link
3. Link vale apenas 1 hora
```

---

### **"Erro ao enviar email"**

```
Possíveis causas:
1. Supabase Auth não configurado
2. SMTP não configurado
3. Email inválido
4. Limite de envios excedido

Solução:
1. Verificar configurações SMTP no Supabase
2. Aguardar alguns minutos e tentar novamente
3. Usar OPÇÃO B (definir senha manualmente)
```

---

## 🎯 RECOMENDAÇÃO FINAL

### **USE ESTA SEQUÊNCIA:**

```
1️⃣ PRIMEIRO: Pedir para o usuário tentar pelo site
   → https://volleypro-zw96.vercel.app
   → "Esqueci minha senha"
   
2️⃣ SE NÃO FUNCIONAR: Enviar email via Supabase Dashboard
   → Authentication > Users
   → "Send password reset email"
   
3️⃣ ÚLTIMO CASO: Definir senha manualmente
   → Update user > Reset password
   → Informar senha temporária ao usuário
   → Pedir para alterar depois do login
```

---

## 🔑 SENHA TEMPORÁRIA SUGERIDA

**Se precisar definir manualmente:**

```
VolleyPro@2025!
```

**OU:**

```
Volei#123456
```

**OU:**

```
Amilton@2025
```

**⚠️ IMPORTANTE:**
- Enviar senha por canal seguro (não por email público)
- Pedir para alterar após primeiro login
- Senha deve ter mínimo 6 caracteres

---

## 📞 PRÓXIMOS PASSOS

### **AGORA:**

1. ✅ Escolher método (FORMA 1 ou FORMA 2)
2. ✅ Executar conforme instruções acima
3. ✅ Confirmar com o usuário

### **APÓS RESET:**

1. ✅ Usuário testa novo login
2. ✅ Confirma que funcionou
3. ✅ Troca senha para uma personalizada (recomendado)

---

## 🎉 PRONTO!

**Opção mais rápida e segura:**

```
1. Você: Envia email de reset via Supabase Dashboard
2. Amilton: Recebe email
3. Amilton: Clica no link
4. Amilton: Cria nova senha
5. ✅ Feito!
```

**Tempo total: ~2 minutos**

---

**QUAL MÉTODO VOCÊ QUER USAR?**

A) 👤 Usuário faz pelo site (RECOMENDADO)  
B) 🔧 Você envia email via Supabase Dashboard  
C) 🔑 Você define senha manualmente  

# 📧 CONFIGURAR SMTP NO SUPABASE (OPCIONAL)

## 🎯 O QUE É ISSO?

O Supabase usa um servidor de email compartilhado por padrão, o que pode causar problemas com emails devolvidos.

**SMTP Customizado** = Usar seu próprio servidor de emails (mais confiável).

---

## 🤔 PRECISO FAZER ISSO?

**NÃO, se:**
- ✅ As correções de domínios fake já resolveram
- ✅ Taxa de bounce diminuiu
- ✅ Não recebeu novo aviso do Supabase

**SIM, se:**
- ❌ Continua recebendo avisos de bounce
- ❌ Quer controle total sobre emails
- ❌ Precisa de relatórios detalhados de envio

---

## 🔧 OPÇÕES DE PROVEDOR SMTP (GRÁTIS)

### **1. Resend** (RECOMENDADO)
- ✅ 100 emails/dia GRÁTIS
- ✅ Fácil de configurar
- ✅ Dashboard simples
- 👉 https://resend.com

### **2. SendGrid**
- ✅ 100 emails/dia GRÁTIS
- ⚠️ Configuração mais complexa
- 👉 https://sendgrid.com

### **3. Mailgun**
- ✅ 5.000 emails/mês GRÁTIS (primeiros 3 meses)
- ⚠️ Depois: 1.000/mês grátis
- 👉 https://mailgun.com

---

## 🚀 COMO CONFIGURAR (RESEND)

### **PASSO 1: Criar conta no Resend**

1. Ir em: https://resend.com
2. Clicar "Start Building"
3. Fazer signup (pode usar GitHub)

---

### **PASSO 2: Obter API Key**

1. Após login, ir em "API Keys" (menu lateral)
2. Clicar "Create API Key"
3. Nome: `VolleyPro`
4. Permission: `Sending access`
5. Clicar "Create"
6. **COPIAR A KEY** (aparece só uma vez!)

Exemplo: `re_123abc...xyz`

---

### **PASSO 3: Configurar no Supabase**

1. Ir em: https://supabase.com/dashboard/project/waibxabxlcbfyxyagaow/settings/auth

2. Scroll até **"SMTP Settings"**

3. Clicar **"Enable Custom SMTP"**

4. Preencher:

```
SMTP Host: smtp.resend.com
SMTP Port: 465
SMTP User: resend
SMTP Password: [COLAR SUA API KEY AQUI]

Sender name: VolleyPro
Sender email: noreply@voleypro.net
```

5. Clicar **"Save"**

---

### **PASSO 4: Verificar domínio (IMPORTANTE)**

Para emails `@voleypro.net` funcionarem:

1. No Resend, ir em "Domains"
2. Clicar "Add Domain"
3. Digitar: `voleypro.net`
4. Copiar os registros DNS mostrados
5. Ir no **Cloudflare** (ou onde seu DNS está)
6. Adicionar os registros DNS
7. Voltar no Resend e clicar "Verify"

**Registros típicos:**
```
Tipo: TXT
Nome: _resend
Valor: [código fornecido]

Tipo: CNAME  
Nome: resend._domainkey
Valor: [código fornecido]
```

---

### **PASSO 5: Testar**

1. No Supabase Auth, clicar "Send Test Email"
2. Digitar seu email real
3. Verificar se recebeu

✅ **FUNCIONOU!**

---

## ⚠️ OBSERVAÇÃO IMPORTANTE

**SE NÃO VERIFICAR O DOMÍNIO:**

Você só poderá enviar de:
- `onboarding@resend.dev` (email padrão do Resend)

**COM DOMÍNIO VERIFICADO:**

Você pode enviar de:
- `noreply@voleypro.net`
- `contato@voleypro.net`
- `suporte@voleypro.net`

---

## 🔄 DESATIVAR AUTO-CONFIRMAÇÃO

Se configurar SMTP, pode exigir confirmação de email:

**Arquivo:** `/supabase/functions/server/index.tsx`

**Mudar:**
```typescript
const { data, error } = await supabaseClient.auth.admin.createUser({
  email,
  password,
  email_confirm: false, // ← Mudar para FALSE
  user_metadata: { name, userType },
});
```

**RESULTADO:**
- Usuário recebe email de confirmação
- Precisa clicar no link para ativar conta
- Mais seguro!

---

## 📊 COMPARAÇÃO

| Item | Sem SMTP | Com SMTP |
|------|----------|----------|
| Confiabilidade | ⚠️ Média | ✅ Alta |
| Controle | ❌ Nenhum | ✅ Total |
| Relatórios | ❌ Não | ✅ Sim |
| Custo | ✅ Grátis | ✅ Grátis (até limite) |
| Setup | ✅ 0 min | ⚠️ 15-30 min |

---

## ✅ QUANDO FAZER ISSO?

**AGORA:** Se você quer profissionalismo máximo

**DEPOIS:** Se as correções de domínio fake já resolveram

---

## 🎯 RESUMO RÁPIDO

1. Criar conta no Resend (5 min)
2. Obter API Key (1 min)
3. Configurar no Supabase (5 min)
4. Verificar domínio no Cloudflare (10 min)
5. Testar (1 min)

**TOTAL:** ~20 minutos

---

## 📞 SE PRECISAR DE AJUDA

Me avise que eu configuro junto com você!

---

**DATA:** 07/11/2025  
**PRIORIDADE:** 🟡 MÉDIA (opcional, mas recomendado)

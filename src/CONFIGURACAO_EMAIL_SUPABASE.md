# 📧 Configuração de Email - Supabase Auth

## 🎯 Sistema de Recuperação de Senha

Este guia explica como configurar os emails de recuperação de senha no Supabase.

---

## ⚙️ CONFIGURAÇÃO PADRÃO

### **O Supabase já funciona automaticamente!**

✅ Por padrão, o Supabase já envia emails de recuperação de senha
✅ Não é necessário configurar nada inicialmente
✅ O template padrão já está pronto para uso

---

## 📨 EMAIL PADRÃO DO SUPABASE

### **Como funciona:**
1. Usuário solicita recuperação de senha
2. Supabase envia email automaticamente
3. Email contém link com token único
4. Link redireciona para: `https://seu-site.com/#reset-password`
5. Token expira em 1 hora

### **Informações do Email Padrão:**
- **Remetente:** `noreply@mail.app.supabase.io`
- **Assunto:** `Reset Your Password`
- **Idioma:** Inglês (padrão)

---

## 🎨 PERSONALIZAR EMAIL (OPCIONAL)

Se quiser personalizar o email de recuperação:

### **1. Acesse o Supabase Dashboard**
```
https://app.supabase.com
```

### **2. Navegue até Email Templates**
```
Projeto → Authentication → Email Templates
```

### **3. Selecione "Reset Password"**
```
┌─────────────────────────────┐
│  Email Templates            │
│                             │
│  • Confirm Signup           │
│  • Invite User              │
│  • Magic Link               │
│  • Reset Password  ← AQUI   │
│  • Change Email Address     │
└─────────────────────────────┘
```

### **4. Edite o Template**

**Template Básico em Português:**
```html
<h2>Redefinir Senha - VolleyPro</h2>

<p>Olá!</p>

<p>Você solicitou a recuperação da sua senha no VolleyPro.</p>

<p>Para criar uma nova senha, clique no botão abaixo:</p>

<p>
  <a 
    href="{{ .ConfirmationURL }}" 
    style="display: inline-block; padding: 12px 24px; background: #0066ff; color: white; text-decoration: none; border-radius: 6px;"
  >
    Redefinir minha senha
  </a>
</p>

<p><strong>⏰ Este link expira em 1 hora.</strong></p>

<p>Se você não solicitou esta recuperação, ignore este email.</p>

<hr>

<p style="color: #666; font-size: 12px;">
  🏐 VolleyPro - A rede social do vôlei<br>
  https://volleypro-zw96.vercel.app
</p>
```

**Template Profissional com Design:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0f7ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header com Gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066ff 0%, #ff6b35 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🏐 VolleyPro</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">A rede social do vôlei</p>
            </td>
          </tr>
          
          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px;">
              
              <h2 style="color: #0066ff; margin: 0 0 20px 0;">Redefinir Sua Senha</h2>
              
              <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                Olá!
              </p>
              
              <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                Você solicitou a recuperação da sua senha no <strong>VolleyPro</strong>.
              </p>
              
              <p style="color: #333; line-height: 1.6; margin: 0 0 30px 0;">
                Para criar uma nova senha, clique no botão abaixo:
              </p>
              
              <!-- Botão de Ação -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a 
                      href="{{ .ConfirmationURL }}" 
                      style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);"
                    >
                      🔐 Redefinir Minha Senha
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Aviso de Expiração -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background: #fff4e6; border-left: 4px solid #ff6b35; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #ff6b35;">
                      <strong>⏰ Atenção:</strong> Este link expira em <strong>1 hora</strong>.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                Se você não solicitou esta recuperação, ignore este email com segurança.
              </p>
              
              <p style="color: #666; line-height: 1.6; margin: 10px 0 0 0; font-size: 14px;">
                Sua conta permanece protegida e nenhuma alteração foi feita.
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>🏐 VolleyPro</strong> - A rede social do vôlei
              </p>
              
              <p style="margin: 0 0 15px 0; color: #999; font-size: 12px;">
                Conectando atletas, times e fãs de vôlei
              </p>
              
              <p style="margin: 0; color: #999; font-size: 12px;">
                <a href="https://volleypro-zw96.vercel.app" style="color: #0066ff; text-decoration: none;">
                  volleypro-zw96.vercel.app
                </a>
              </p>
              
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### **5. Salvar Template**
```
[Save] ← Clique para salvar
```

---

## 🔧 VARIÁVEIS DISPONÍVEIS

### **Variáveis do Supabase:**

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `{{ .ConfirmationURL }}` | Link de recuperação com token | `https://site.com/#reset-password?token=...` |
| `{{ .Email }}` | Email do usuário | `usuario@email.com` |
| `{{ .SiteURL }}` | URL do seu site | `https://volleypro-zw96.vercel.app` |
| `{{ .Token }}` | Token de recuperação | `abc123...` |
| `{{ .TokenHash }}` | Hash do token | `#token=abc123...` |

### **Como usar:**
```html
<p>Olá, {{ .Email }}!</p>
<a href="{{ .ConfirmationURL }}">Clique aqui</a>
<p>Volte para: {{ .SiteURL }}</p>
```

---

## 🎯 CONFIGURAR REDIRECT URL

### **Importante: URL de Redirecionamento**

No código já está configurado:
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(
  email,
  {
    redirectTo: `${window.location.origin}/#reset-password`,
  }
);
```

Isso garante que o usuário seja redirecionado para:
```
https://volleypro-zw96.vercel.app/#reset-password
```

### **Configurar no Supabase Dashboard:**

1. Acesse: **Authentication → URL Configuration**

2. Adicione em **Redirect URLs:**
```
https://volleypro-zw96.vercel.app/#reset-password
https://volleypro-zw96.vercel.app
```

3. Adicione em **Site URL:**
```
https://volleypro-zw96.vercel.app
```

---

## 📬 CONFIGURAR SMTP CUSTOMIZADO (OPCIONAL)

Por padrão, o Supabase usa seu próprio servidor de email. Se quiser usar seu próprio SMTP:

### **1. Acesse Project Settings**
```
Settings → Auth → SMTP Settings
```

### **2. Ative SMTP Customizado**
```
[x] Enable Custom SMTP
```

### **3. Configure as Credenciais**

**Para Gmail:**
```
Host: smtp.gmail.com
Port: 587
Username: seu@gmail.com
Password: [senha de app]
Sender Name: VolleyPro
Sender Email: noreply@volleypro.com
```

**Para SendGrid:**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [sua API key]
Sender Name: VolleyPro
Sender Email: noreply@volleypro.com
```

**Para Amazon SES:**
```
Host: email-smtp.us-east-1.amazonaws.com
Port: 587
Username: [SMTP username]
Password: [SMTP password]
Sender Name: VolleyPro
Sender Email: noreply@volleypro.com
```

### **4. Testar Configuração**
```
[Send Test Email] ← Clique para testar
```

---

## 🔒 CONFIGURAÇÕES DE SEGURANÇA

### **Rate Limiting (Limite de Taxa)**

O Supabase já protege contra spam:
- Máximo de 3 emails por hora por usuário
- Cooldown de 60 segundos entre solicitações
- Bloqueio temporário após tentativas excessivas

### **Expiração de Token**

Configuração padrão:
- **1 hora** para link de recuperação
- Token de uso único (invalida após uso)

### **Para alterar a expiração:**

1. Acesse: **Authentication → Settings**
2. Procure: **JWT Expiry**
3. Altere: `Password Recovery Token TTL`

```
Padrão: 3600 segundos (1 hora)
Mínimo: 300 segundos (5 minutos)
Máximo: 86400 segundos (24 horas)
```

---

## 🧪 TESTAR EMAILS

### **Como testar no desenvolvimento:**

1. **Usar Email Real:**
```typescript
await supabase.auth.resetPasswordForEmail('seu@email.com');
```
- Envie para seu próprio email
- Verifique recebimento
- Teste o link completo

2. **Verificar Logs:**
```
Supabase Dashboard → Logs → Auth Logs
```
- Veja todos emails enviados
- Identifique erros
- Monitore taxa de entrega

3. **Mode Debug:**
```typescript
// Ativar logs detalhados
localStorage.setItem('supabase.auth.debug', 'true');
```

---

## 📊 MONITORAMENTO

### **Métricas para Acompanhar:**

**No Supabase Dashboard:**
```
Authentication → Reports
```

Métricas disponíveis:
- Emails enviados (por dia/semana/mês)
- Taxa de entrega (%)
- Taxa de bounce (%)
- Emails abertos (se SMTP custom)
- Clicks no link (se SMTP custom)

---

## ⚠️ TROUBLESHOOTING

### **Email não é enviado:**

1. **Verificar configuração do projeto:**
   - Project Settings → API
   - Verificar se API está ativa
   - Verificar URL de redirecionamento

2. **Verificar email do usuário:**
   - Email está confirmado?
   - Email existe no banco?
   - Formato do email está correto?

3. **Verificar rate limiting:**
   - Aguardar 60 segundos entre tentativas
   - Máximo 3 tentativas por hora

4. **Verificar spam:**
   - Emails podem cair no spam
   - Configurar DMARC/SPF/DKIM

### **Link não funciona:**

1. **Token expirado:**
   - Link válido por apenas 1 hora
   - Solicitar novo link

2. **URL incorreta:**
   - Verificar Redirect URLs no Supabase
   - Verificar URL no código

3. **Token já usado:**
   - Cada token é de uso único
   - Solicitar novo link

---

## 📝 CHECKLIST DE CONFIGURAÇÃO

- [ ] Email template personalizado (opcional)
- [ ] Redirect URLs configuradas
- [ ] Site URL configurada
- [ ] SMTP customizado (opcional)
- [ ] Teste de envio realizado
- [ ] Teste de recuperação completa
- [ ] Verificar pasta de spam
- [ ] Monitoramento ativo

---

## 🎉 PRONTO!

Com essas configurações, o sistema de recuperação de senha está funcionando perfeitamente!

**Lembre-se:**
- ✅ Configuração padrão já funciona
- ✅ Personalização é opcional
- ✅ Sempre testar antes de publicar
- ✅ Monitorar métricas regularmente

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0.0

# 🔐 Configuração do Login com Google no VolleyPro

## ⚠️ IMPORTANTE
Para habilitar o login com Google, você precisa configurar o Google OAuth no Supabase Dashboard. Siga as etapas abaixo:

## 📋 Passo a Passo

### 1. Acesse o Console do Google Cloud
1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um projeto existente
3. Ative a API "Google+ API" (se não estiver ativa)

### 2. Configure as Credenciais OAuth
1. No menu lateral, vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Selecione **Web application** como tipo de aplicação
4. Configure:
   - **Name**: VolleyPro
   - **Authorized JavaScript origins**: 
     - `https://<seu-projeto>.supabase.co`
   - **Authorized redirect URIs**:
     - `https://<seu-projeto>.supabase.co/auth/v1/callback`
5. Clique em **CREATE**
6. Copie o **Client ID** e **Client Secret**

### 3. Configure o Supabase
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto VolleyPro
3. Vá em **Authentication** → **Providers**
4. Encontre **Google** na lista de providers
5. Clique para expandir as configurações
6. **Habilite** o provider Google
7. Cole o **Client ID** e **Client Secret** do Google Cloud
8. Configure a **Redirect URL** (já deve estar preenchida automaticamente)
9. Clique em **Save**

### 4. Teste o Login
1. Volte para o VolleyPro
2. Clique em "Entrar / Cadastrar"
3. Clique no botão "Continuar com Google"
4. Você será redirecionado para fazer login com sua conta Google
5. Após autorizar, você será redirecionado de volta ao VolleyPro já autenticado

## 🎯 Recursos Adicionais

- [Documentação Oficial do Supabase sobre Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Guia do Google Cloud sobre OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## ❓ Solução de Problemas

### Erro: "provider is not enabled"
**Solução**: Você precisa habilitar o Google Provider no Supabase Dashboard seguindo o passo 3 acima.

### Erro: "redirect_uri_mismatch"
**Solução**: Verifique se a URL de redirecionamento no Google Cloud Console corresponde exatamente à fornecida pelo Supabase.

### O botão não redireciona
**Solução**: Verifique o console do navegador para erros. Certifique-se de que as credenciais OAuth foram salvas corretamente no Supabase.

## 🏐 Pronto!
Após a configuração, seus usuários poderão fazer login com Google de forma rápida e segura!

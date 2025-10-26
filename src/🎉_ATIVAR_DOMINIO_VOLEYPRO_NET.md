# 🎉 ATIVAR DOMÍNIO voleypro.net

## 🎯 GUIA PASSO A PASSO (15 MINUTOS)

---

## 📋 PARTE 1: ADICIONAR DOMÍNIO NA VERCEL (5 MIN)

### 1️⃣ Acessar Vercel

```
1. Acesse: https://vercel.com
2. Faça login
3. Clique no seu projeto "VolleyPro"
```

### 2️⃣ Adicionar Domínio

```
1. Clique na aba "Settings" (engrenagem)
2. No menu lateral, clique em "Domains"
3. Clique no campo "Enter domain"
4. Digite: voleypro.net
5. Clique em "Add"
```

### 3️⃣ Adicionar WWW (Opcional mas Recomendado)

```
1. Repita o processo
2. Digite: www.voleypro.net
3. Clique em "Add"
4. Marque "Redirect to voleypro.net" ✅
```

---

## 📋 PARTE 2: CONFIGURAR DNS NO PROVEDOR (5 MIN)

A Vercel vai mostrar **INSTRUÇÕES ESPECÍFICAS** para seu domínio.

Você verá algo assim:

```
Configuração Necessária:

Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

### 🔧 ONDE CONFIGURAR DNS:

Depende de **onde você comprou o domínio**:

| Provedor | URL |
|----------|-----|
| **Registro.br** | https://registro.br/painel |
| **GoDaddy** | https://dcc.godaddy.com/domains |
| **Hostinger** | https://hpanel.hostinger.com |
| **Namecheap** | https://ap.www.namecheap.com |
| **Google Domains** | https://domains.google.com |

### 📝 PASSOS NO PROVEDOR:

```
1. Acesse o painel do seu provedor
2. Encontre "Gerenciar DNS" ou "DNS Settings"
3. Adicione os registros que a Vercel mostrou:
   
   ✅ Registro A:
      - Tipo: A
      - Nome/Host: @ (ou deixe em branco)
      - Valor: 76.76.21.21
      - TTL: 3600 (ou automático)
   
   ✅ Registro CNAME (se tiver www):
      - Tipo: CNAME
      - Nome/Host: www
      - Valor: cname.vercel-dns.com
      - TTL: 3600 (ou automático)

4. Salve as alterações
```

---

## 📋 PARTE 3: AGUARDAR PROPAGAÇÃO DNS

### ⏰ Tempo Normal:
- **Rápido**: 5-30 minutos
- **Médio**: 1-4 horas
- **Máximo**: até 48 horas

### ✅ Como Verificar:

```
1. Acesse: https://dnschecker.org
2. Digite: voleypro.net
3. Selecione tipo: A
4. Clique em "Search"
5. Veja se aparece o IP da Vercel (76.76.21.21)
```

### 🔄 Status na Vercel:

A Vercel vai mostrar:
- 🟡 **Pending** - Aguardando DNS
- 🟢 **Valid** - FUNCIONANDO! ✅

---

## 📋 PARTE 4: COMMIT E PUSH (2 MIN)

**Arquivos já atualizados com voleypro.net:**

```
✅ /api/sitemap.js
✅ /api/robots.js
✅ /public/sitemap.xml
✅ /public/robots.txt
✅ /index.html (meta tags, Schema.org)
```

**GitHub Desktop:**

```
Commit message:
"feat: atualizar URLs para domínio voleypro.net"

Passos:
1. Abra GitHub Desktop
2. Veja os 5 arquivos modificados
3. Commit com a mensagem acima
4. Push para GitHub
5. Vercel vai fazer deploy automático!
```

---

## 🎉 DEPOIS QUE ESTIVER ATIVO:

### ✅ Testar URLs:
```
https://voleypro.net
https://voleypro.net/sitemap.xml
https://voleypro.net/robots.txt
```

### ✅ Atualizar Google Search Console:
1. Acesse: https://search.google.com/search-console
2. Adicionar propriedade → voleypro.net
3. Verificar propriedade (Vercel já tem meta tag)
4. Enviar sitemap: voleypro.net/sitemap.xml

### ✅ Atualizar Google Analytics:
1. Google Analytics → Admin
2. Criar nova propriedade: voleypro.net
3. Ou manter a mesma (vai funcionar)

### ✅ Divulgar novo domínio!
- Redes sociais
- Grupos de vôlei
- Comunidades

---

## 🔥 VANTAGENS DO DOMÍNIO PRÓPRIO:

✅ **Mais profissional** - voleypro.net vs volleypro-zw96.vercel.app  
✅ **Mais fácil de lembrar** - URL curta e limpa  
✅ **Melhor para SEO** - Google prefere domínios próprios  
✅ **Mais confiável** - Passa credibilidade  
✅ **Permanente** - Não muda se trocar de hospedagem  

---

## ⚠️ PROBLEMAS COMUNS:

| Problema | Solução |
|----------|---------|
| "Invalid Configuration" | Verifique se os registros DNS estão corretos |
| "Pending" há 24h+ | Contate suporte do provedor |
| HTTPS não funciona | Aguarde, Vercel gera SSL automático (15-30 min) |
| www não redireciona | Configure CNAME para www |
| DNS não propaga | Use outro DNS: 8.8.8.8 (Google) |

---

## 📞 SUPORTE:

**Vercel:**
- https://vercel.com/support
- https://vercel.com/docs/concepts/projects/domains

**DNS Checker:**
- https://dnschecker.org

**Seu provedor de domínio:**
- Veja documentação específica do provedor

---

## 🎯 RESUMO EXECUTIVO:

```
1. ✅ Código já atualizado com voleypro.net!
2. 🔧 Você: Adicionar domínio na Vercel
3. 🔧 Você: Configurar DNS no provedor
4. 🔧 Você: Commit/Push no GitHub
5. ⏰ Aguardar propagação DNS (1-48h)
6. 🎉 voleypro.net no ar!
```

---

## 🚀 COMECE AGORA:

**PASSO 1:** https://vercel.com/dashboard  
**PASSO 2:** Configurar DNS no provedor do domínio  
**PASSO 3:** GitHub Desktop → Commit → Push  

**Depois disso é só aguardar! ⏰**

---

**BOA SORTE! 🎉**

O domínio próprio vai dar um up GIGANTE no profissionalismo do VolleyPro! 💪

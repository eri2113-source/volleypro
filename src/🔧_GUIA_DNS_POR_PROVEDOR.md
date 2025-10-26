# 🔧 GUIA DNS POR PROVEDOR

Instruções específicas para cada provedor de domínio.

---

## 🇧🇷 REGISTRO.BR (Mais comum no Brasil)

### 📍 Passo a Passo:

```
1. Acesse: https://registro.br
2. Faça login
3. Clique em "Meus Domínios"
4. Clique em "voleypro.net"
5. No menu lateral, clique em "DNS"
6. Clique em "Editar Zona"
7. Role até "Adicionar novo registro"
```

### ➕ Adicionar Registro A:

```
Tipo: A
Nome: @
Dados: 76.76.21.21
TTL: 3600
[Adicionar]
```

### ➕ Adicionar Registro CNAME:

```
Tipo: CNAME
Nome: www
Dados: cname.vercel-dns.com
TTL: 3600
[Adicionar]
```

### 💾 Salvar:

```
Role até o final e clique em "Salvar"
```

---

## 🌍 GODADDY

### 📍 Passo a Passo:

```
1. Acesse: https://dcc.godaddy.com
2. Faça login
3. Clique em "Meus Produtos"
4. Em "Domínios", clique em "DNS" ao lado de voleypro.net
```

### ➕ Adicionar Registro A:

```
1. Clique em "Adicionar" ou "Add"
2. Tipo: A
3. Nome: @ (ou deixe em branco)
4. Valor: 76.76.21.21
5. TTL: 1 hora (padrão)
6. Clique em "Salvar"
```

### ➕ Adicionar Registro CNAME:

```
1. Clique em "Adicionar" novamente
2. Tipo: CNAME
3. Nome: www
4. Valor: cname.vercel-dns.com
5. TTL: 1 hora
6. Clique em "Salvar"
```

---

## 🌐 HOSTINGER

### 📍 Passo a Passo:

```
1. Acesse: https://hpanel.hostinger.com
2. Faça login
3. Clique em "Domínios"
4. Clique em "voleypro.net"
5. No menu lateral, clique em "DNS / Name Servers"
6. Clique na aba "DNS Records"
```

### ➕ Adicionar Registro A:

```
1. Clique em "Add Record"
2. Type: A
3. Name: @ (ou deixe em branco)
4. Points to: 76.76.21.21
5. TTL: 3600
6. Clique em "Add Record"
```

### ➕ Adicionar Registro CNAME:

```
1. Clique em "Add Record" novamente
2. Type: CNAME
3. Name: www
4. Points to: cname.vercel-dns.com
5. TTL: 3600
6. Clique em "Add Record"
```

---

## 🦄 NAMECHEAP

### 📍 Passo a Passo:

```
1. Acesse: https://ap.www.namecheap.com
2. Faça login
3. No menu superior, clique em "Domain List"
4. Clique em "Manage" ao lado de voleypro.net
5. Clique na aba "Advanced DNS"
```

### ➕ Adicionar Registro A:

```
1. Em "Host Records", clique em "Add New Record"
2. Type: A Record
3. Host: @
4. Value: 76.76.21.21
5. TTL: Automatic
6. Clique no ✓ (check)
```

### ➕ Adicionar Registro CNAME:

```
1. Clique em "Add New Record" novamente
2. Type: CNAME Record
3. Host: www
4. Value: cname.vercel-dns.com
5. TTL: Automatic
6. Clique no ✓ (check)
```

### 💾 Salvar:

```
Clique em "Save all changes" no topo
```

---

## 📧 GOOGLE DOMAINS

### 📍 Passo a Passo:

```
1. Acesse: https://domains.google.com
2. Faça login
3. Clique em "voleypro.net"
4. No menu lateral, clique em "DNS"
5. Role até "Resource records"
```

### ➕ Adicionar Registro A:

```
1. Clique em "Manage custom records"
2. Clique em "Create new record"
3. Host name: @ (ou deixe em branco)
4. Type: A
5. TTL: 3600
6. Data: 76.76.21.21
7. Clique em "Add"
```

### ➕ Adicionar Registro CNAME:

```
1. Clique em "Create new record" novamente
2. Host name: www
3. Type: CNAME
4. TTL: 3600
5. Data: cname.vercel-dns.com
6. Clique em "Add"
```

---

## 🏢 LOCAWEB

### 📍 Passo a Passo:

```
1. Acesse: https://painel.locaweb.com.br
2. Faça login
3. Clique em "Domínios"
4. Clique em "voleypro.net"
5. Clique em "Zona DNS"
```

### ➕ Adicionar Registro A:

```
1. Clique em "Nova Entrada"
2. Tipo: A
3. Nome: @ (ou deixe vazio)
4. Valor: 76.76.21.21
5. TTL: 3600
6. Clique em "Adicionar"
```

### ➕ Adicionar Registro CNAME:

```
1. Clique em "Nova Entrada" novamente
2. Tipo: CNAME
3. Nome: www
4. Valor: cname.vercel-dns.com
5. TTL: 3600
6. Clique em "Adicionar"
```

---

## 📊 TABELA RESUMO:

| Provedor | Login | Onde Fica DNS |
|----------|-------|---------------|
| **Registro.br** | registro.br | Meus Domínios → DNS → Editar Zona |
| **GoDaddy** | dcc.godaddy.com | Meus Produtos → DNS |
| **Hostinger** | hpanel.hostinger.com | Domínios → DNS Records |
| **Namecheap** | namecheap.com | Domain List → Advanced DNS |
| **Google Domains** | domains.google.com | DNS → Custom records |
| **Locaweb** | painel.locaweb.com.br | Domínios → Zona DNS |

---

## ⚠️ AVISOS IMPORTANTES:

### 1️⃣ NÃO MEXA EM NAME SERVERS!

Se aparecer algo sobre "Name Servers" ou "Servidores DNS", **NÃO MUDE!**

Você só precisa adicionar **REGISTROS** DNS, não mudar os servidores.

### 2️⃣ PODE TER OUTROS REGISTROS

É normal já existir outros registros DNS na lista. **NÃO DELETE NADA!**

Apenas **ADICIONE** os 2 novos registros (A e CNAME).

### 3️⃣ ALGUNS PROVEDORES JÁ TÊM @ OU WWW

Se já existir um registro com:
- `@` tipo A → Edite ele e mude o IP para 76.76.21.21
- `www` tipo CNAME → Edite ele e mude para cname.vercel-dns.com

### 4️⃣ TTL PODE SER DIFERENTE

Alguns provedores usam:
- `3600` (1 hora)
- `Auto` (automático)
- `14400` (4 horas)

**Qualquer um desses funciona!**

---

## 🆘 AINDA ESTÁ DIFÍCIL?

### Me diga 3 coisas:

1. **Onde você comprou o domínio?**
   - Ex: "Comprei no GoDaddy"

2. **Conseguiu fazer login?**
   - ✅ Sim / ❌ Não

3. **O que você está vendo na tela?**
   - Ex: "Estou vendo uma lista de domínios"
   - Ex: "Não sei onde clicar"

**Com essas informações, posso te ajudar EXATAMENTE!** 😊

---

## 📸 QUER CAPTURAS DE TELA?

Se você me disser qual provedor você usa, posso te enviar:
- 🖼️ Capturas de tela
- 🎥 Link de vídeo tutorial
- 📝 Instruções ainda mais detalhadas

**Só me dizer qual é seu provedor!** 👍

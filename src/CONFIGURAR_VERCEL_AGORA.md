# ⚙️ CONFIGURAR VERCEL - PASSO A PASSO

## 📸 BASEADO NA SUA TELA ATUAL

Você está na tela de configuração! Veja o que fazer:

---

## ✅ PASSO 1: Predefinição de Estrutura

**IMPORTANTE!** Você marcou "Other" - MUDE PARA "Vite"!

1. **Clique** no dropdown "Other"
2. **Procure** e **selecione**: **Vite**
3. ✅ Deve aparecer o logo do Vite

**Por que?** O VolleyPro usa Vite como bundler!

---

## ✅ PASSO 2: Diretório Raiz

Já está correto: `./ `

**NÃO MUDE!** ✅

---

## ✅ PASSO 3: Configurações de compilação e saída

**CLIQUE** na seta **"Configurações de compilação e saída"** para expandir!

### Você deve ver estes campos:

#### Build Command (Comando de Build):
```
npm run build
```
✅ Deixe assim!

#### Output Directory (Diretório de Saída):
```
dist
```
✅ Deixe assim!

#### Install Command (Comando de Instalação):
```
npm install
```
✅ Deixe assim!

**Se a Vercel NÃO preencheu automaticamente após selecionar Vite:**
- Preencha manualmente com os valores acima!

---

## 🚨 PASSO 4: VARIÁVEIS DE AMBIENTE (MAIS IMPORTANTE!)

**CLIQUE** na seta **"Variáveis de ambiente"** para expandir!

### Você precisa adicionar 2 variáveis OBRIGATÓRIAS:

---

### Variável 1: VITE_SUPABASE_URL

1. **Clique** em "+ Add New"
2. **Name (Nome)**: `VITE_SUPABASE_URL`
3. **Value (Valor)**: `https://walbxabxlcehyyagacw.supabase.co`
4. **Environment**: Marque todas (Production, Preview, Development)

---

### Variável 2: VITE_SUPABASE_ANON_KEY

**VOCÊ PRECISA PEGAR ESSA CHAVE DO SUPABASE!**

#### Como pegar:

1. **Abra uma nova aba**: https://supabase.com/dashboard/project/walbxabxlcehyyagacw

2. **Clique** em "Settings" (⚙️ engrenagem no menu lateral esquerdo)

3. **Clique** em "API"

4. **Procure** por "Project API keys"

5. **Encontre** "anon public" - é uma chave LONGA começando com `eyJ...`

6. **Clique** no ícone de copiar (📋)

#### Agora adicione na Vercel:

1. **Clique** em "+ Add New" (ou "+ Add another")
2. **Name (Nome)**: `VITE_SUPABASE_ANON_KEY`
3. **Value (Valor)**: Cole a chave que você copiou
4. **Environment**: Marque todas (Production, Preview, Development)

---

### Variável 3: VITE_LIVEKIT_URL (OPCIONAL)

**APENAS se você já configurou LiveKit Cloud!**

Se não configurou, **PULE** esta variável por enquanto.

Se configurou:
1. **Clique** em "+ Add New"
2. **Name**: `VITE_LIVEKIT_URL`
3. **Value**: Sua URL do LiveKit (ex: `wss://seu-projeto.livekit.cloud`)
4. **Environment**: Marque todas

---

## ✅ PASSO 5: REVISAR TUDO

Antes de clicar em "Implantar", confira:

### Nome do Projeto:
```
✅ volleypro-vbgc (ou outro nome que você escolheu)
```

### Predefinição de Estrutura:
```
✅ Vite (NÃO "Other"!)
```

### Diretório Raiz:
```
✅ ./
```

### Build Command:
```
✅ npm run build
```

### Output Directory:
```
✅ dist
```

### Install Command:
```
✅ npm install
```

### Variáveis de Ambiente:
```
✅ VITE_SUPABASE_URL = https://walbxabxlcehyyagacw.supabase.co
✅ VITE_SUPABASE_ANON_KEY = eyJ... (chave longa do Supabase)
🟡 VITE_LIVEKIT_URL = (opcional)
```

---

## 🚀 PASSO 6: IMPLANTAR!

**TUDO CERTO?**

1. **Role para baixo** até o final da página
2. **Clique** no botão AZUL **"Implantar"** ou **"Deploy"**
3. **AGUARDE 2-5 minutos**

### O que vai acontecer:

```
⏳ Queued... (Aguardando na fila)
📦 Installing dependencies... (Instalando pacotes)
🔨 Building... (Fazendo o build)
📤 Uploading... (Enviando para produção)
✅ Ready! (PRONTO!)
```

---

## 🎉 QUANDO TERMINAR

Você verá uma tela de SUCESSO! 🎊

```
🎉 Congratulations!

Your project is successfully deployed.

Production: https://volleypro-vbgc.vercel.app
```

**COPIE ESSA URL!**

---

## 🧪 PRÓXIMO PASSO: TESTAR O PWA

Assim que tiver a URL:

### 1. Acesse o site:
```
https://volleypro-vbgc.vercel.app
```

### 2. Acesse o painel de testes PWA:
```
https://volleypro-vbgc.vercel.app/#pwa-test
```

**O que você DEVE ver:**

```
✅ Service Worker: Registrado e ativo
✅ Manifest.json: Encontrado e carregado
✅ Ícones: OK (8/8)
   ✅ 72x72
   ✅ 96x96
   ✅ 128x128
   ✅ 144x144
   ✅ 152x152
   ✅ 192x192
   ✅ 384x384
   ✅ 512x512

🎉 PWA 100% Configurado!
```

---

## 🐛 SE DER ERRO NO BUILD

### Erro: "Build failed" ou "Failed to compile"

**Causa**: Faltam variáveis de ambiente

**Solução**:
1. Na tela de erro, clique em "Back to Project"
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis que faltaram
4. Volte em **Deployments**
5. Clique nos **três pontos** (•••) do último deploy
6. Clique em **"Redeploy"**

### Erro: "Cannot find module"

**Causa**: Predefinição errada (você deixou "Other")

**Solução**:
1. Volte e **mude** para **Vite**
2. Verifique se Build Command é `npm run build`
3. Verifique se Output Directory é `dist`
4. Tente novamente

---

## 📋 CHECKLIST RÁPIDO

Antes de clicar em "Implantar", marque:

- [ ] Predefinição de Estrutura: **Vite** (NÃO "Other"!)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Variável `VITE_SUPABASE_URL` adicionada
- [ ] Variável `VITE_SUPABASE_ANON_KEY` adicionada (chave do Supabase!)
- [ ] Nome do projeto OK

---

## 🎯 RESUMO DO QUE FAZER AGORA

### 1️⃣ Mude "Other" para "Vite"

### 2️⃣ Expanda "Variáveis de ambiente"

### 3️⃣ Adicione as 2 variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (pegue do Supabase!)

### 4️⃣ Clique em "Implantar"

### 5️⃣ Aguarde 2-5 minutos

### 6️⃣ Copie a URL

### 7️⃣ Teste o PWA: `URL/#pwa-test`

---

## 📸 ME ENVIE DEPOIS

Quando terminar:

1. **Print da tela de sucesso** mostrando a URL
2. **Print do painel PWA** (#pwa-test) mostrando tudo verde
3. **A URL** do site (copie e cole aqui)

**QUERO COMEMORAR COM VOCÊ!** 🎉🏐

---

**BOA SORTE! VOCÊ ESTÁ MUITO PERTO!** 🚀

Qualquer erro, me mostre e eu te ajudo! 💪

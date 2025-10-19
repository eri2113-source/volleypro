# 🚀 GITHUB CODESPACES - PASSO A PASSO VISUAL

## 🎯 O QUE É CODESPACES?

**VS Code no navegador** - ambiente de desenvolvimento completo na nuvem!

```
┌────────────────────────────────────────────┐
│  VS Code no Navegador                      │
│  ✅ Editor de código                       │
│  ✅ Terminal integrado                     │
│  ✅ Git configurado                        │
│  ✅ Extensões do VS Code                   │
│  ✅ Grátis: 60 horas/mês                   │
└────────────────────────────────────────────┘
```

---

## 📋 PASSO 1: CRIAR REPOSITÓRIO GITHUB

### TELA 1: Criar repositório

```
1. Acesse: https://github.com/new

┌─────────────────────────────────────────────┐
│  📝 Create a new repository                 │
├─────────────────────────────────────────────┤
│                                             │
│  Owner: seu-usuario                         │
│                                             │
│  Repository name:                           │
│  [volleypro                ]                │
│                                             │
│  Description (optional):                    │
│  [Rede social completa para vôlei]         │
│                                             │
│  ○ Public    ● Private  ← RECOMENDADO      │
│                                             │
│  ☐ Add a README file                       │
│  ☐ Add .gitignore                          │
│  ☐ Choose a license                        │
│                                             │
│  [Create repository]  ← CLIQUE AQUI         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📦 PASSO 2: BAIXAR PROJETO DO FIGMA MAKE

### No Figma Make (onde você está):

```
┌─────────────────────────────────────────────┐
│  Figma Make - VolleyPro                     │
│  ┌──────────────────────────────┐           │
│  │                              │           │
│  │   Seu projeto aqui           │           │
│  │                              │           │
│  └──────────────────────────────┘           │
│                                             │
│  [Export Project] ou [Download] ← CLIQUE    │
└─────────────────────────────────────────────┘

Salva arquivo: volleypro.zip
```

### Extrair o ZIP:

```
Windows:
1. Clique direito no ZIP
2. "Extrair tudo..."
3. Escolha pasta (ex: Downloads\volleypro)
4. OK

Mac:
1. Clique duplo no ZIP
2. Pasta criada automaticamente

Linux:
unzip volleypro.zip -d volleypro/
```

---

## 📤 PASSO 3: UPLOAD PARA GITHUB

### OPÇÃO A: Upload Web (Mais fácil)

```
1. Vá em: https://github.com/seu-usuario/volleypro

┌─────────────────────────────────────────────┐
│  seu-usuario / volleypro                    │
├─────────────────────────────────────────────┤
│                                             │
│  Quick setup                                │
│                                             │
│  ...or create a new repository              │
│                                             │
│  ...or upload an existing file              │
│     ↑                                       │
│     └─ CLIQUE em "uploading an existing    │
│        file" (link azul)                    │
│                                             │
└─────────────────────────────────────────────┘
```

### TELA 2: Upload de arquivos

```
┌─────────────────────────────────────────────┐
│  Upload files to volleypro                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │   Drag files here to add them to     │ │
│  │   your repository                     │ │
│  │                                       │ │
│  │   or [choose your files]              │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ⚠️  IMPORTANTE:                            │
│  Arraste os ARQUIVOS de dentro da pasta,   │
│  NÃO a pasta inteira!                      │
│                                             │
└─────────────────────────────────────────────┘
```

### Como fazer:

```
1. Abra a pasta extraída (volleypro)
2. Selecione TODOS os arquivos de dentro:
   - Ctrl+A (Windows/Linux)
   - Cmd+A (Mac)
3. Arraste para a área do GitHub
4. Aguarde upload (pode demorar 5-10 min)
5. Scroll até o final da página
6. Clique "Commit changes"
```

---

## 💻 PASSO 4: CRIAR CODESPACE

### TELA 3: Abrir Codespaces

```
1. Vá em: https://github.com/seu-usuario/volleypro

┌─────────────────────────────────────────────┐
│  seu-usuario / volleypro                    │
├─────────────────────────────────────────────┤
│                                             │
│  [🟢 Code ▼]  ← CLIQUE AQUI                │
│  ┌───────────────────────────────────────┐ │
│  │ 📁 Local    ☁️  Codespaces            │ │
│  ├───────────────────────────────────────┤ │
│  │                                       │ │
│  │  No codespaces                        │ │
│  │                                       │ │
│  │  [+ Create codespace on main]         │ │
│  │         ↑                             │ │
│  │         └─ CLIQUE AQUI                │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### TELA 4: Criando Codespace (aguarde)

```
┌─────────────────────────────────────────────┐
│  🔧 Setting up your codespace...            │
├─────────────────────────────────────────────┤
│                                             │
│  ⏳ Creating container...                   │
│  ⏳ Installing extensions...                │
│  ⏳ Configuring environment...              │
│                                             │
│  ⏱️  This may take 1-2 minutes              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎉 PASSO 5: CODESPACE ABERTO!

### Interface do Codespace:

```
┌───────────────────────────────────────────────────────┐
│  File  Edit  View  Terminal  Help          [×]       │
├───────────┬───────────────────────────────────────────┤
│  📁 FILES │  📝 Editor                                │
│           │                                           │
│  ▼ src    │  // Seu código aqui                      │
│    App.tsx│                                           │
│  ▼ comp.. │                                           │
│    Feed.. │                                           │
│  package..│                                           │
│  README.. │                                           │
│           │                                           │
├───────────┴───────────────────────────────────────────┤
│  ⌨️  TERMINAL                                         │
│  $ _                                                  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Agora você tem:

- ✅ Editor de código (como VS Code)
- ✅ Terminal integrado (Git já configurado)
- ✅ Extensões automáticas
- ✅ Tudo pronto para trabalhar!

---

## 🔧 PASSO 6: FAZER MUDANÇAS

### Exemplo: Editar um arquivo

```
1. No painel FILES (esquerda), clique em App.tsx
2. Faça suas mudanças
3. Salve: Ctrl+S (Windows/Linux) ou Cmd+S (Mac)
4. Arquivo marcado com bolinha (não salvo) → sem bolinha (salvo)
```

---

## 📤 PASSO 7: PUBLICAR MUDANÇAS

### No terminal do Codespace:

```
$ git add .
$ git commit -m "feat: nova funcionalidade"
$ git push origin main
```

### Ou use a interface visual:

```
┌─────────────────────────────────────────────┐
│  📁 FILES                                   │
│  📝 SEARCH                                  │
│  🔀 SOURCE CONTROL  ← CLIQUE AQUI          │
│  🐛 DEBUG                                   │
│  🧩 EXTENSIONS                              │
└─────────────────────────────────────────────┘

Na aba SOURCE CONTROL:
1. Digite mensagem: "feat: nova funcionalidade"
2. Clique em "✓ Commit"
3. Clique em "⬆️ Push"
```

**PRONTO!** Netlify detecta e faz deploy automático! 🚀

---

## 🌐 PASSO 8: CONFIGURAR NETLIFY

### (Só precisa fazer 1 vez)

```
1. Acesse: https://app.netlify.com/signup
2. Sign up with GitHub
3. Add new site → Import from GitHub
4. Selecione: volleypro
5. Configure:
   Build: npm run build
   Publish: dist
6. Adicione variáveis:
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_LIVEKIT_URL
7. Deploy site
8. Aguarde 3 minutos
9. ✅ SITE NO AR!
```

---

## 🔄 WORKFLOW DIÁRIO

### De agora em diante:

```
┌──────────────────────────────────────┐
│  1. Teste no FIGMA MAKE              │
│     ↓                                │
│  2. Copie código testado             │
│     ↓                                │
│  3. Cole no CODESPACE                │
│     ↓                                │
│  4. git add/commit/push              │
│     ↓                                │
│  5. Netlify deploy (automático)      │
│     ↓                                │
│  6. ✅ SITE ATUALIZADO! (3 min)      │
└──────────────────────────────────────┘
```

---

## 💡 DICAS IMPORTANTES

### 1️⃣ SEMPRE ABRA O MESMO CODESPACE

```
Na próxima vez:
1. GitHub.com → Seu repositório
2. Code → Codespaces
3. Clique no codespace existente (não crie novo)
4. Ele abre instantaneamente!
```

### 2️⃣ LIMITE DE HORAS

```
Plano grátis: 60 horas/mês
Como economizar:
- ✅ Feche quando não estiver usando
- ✅ Codespace desliga após 30 min inativo
- ✅ 60h = ~2 horas por dia útil
```

### 3️⃣ FECHAR CODESPACE

```
Opção 1: Feche a aba do navegador
Opção 2: Menu (☰) → Stop Codespace
Opção 3: Espere 30 min (desliga sozinho)
```

### 4️⃣ DELETAR CODESPACE (se precisar)

```
1. GitHub.com → Codespaces
2. Clique nos 3 pontinhos
3. Delete
4. Crie novo quando precisar
```

---

## 📊 COMPARAÇÃO: CODESPACES vs LOCAL

| Recurso | Codespaces | PC Local |
|---------|------------|----------|
| Instalação | ✅ Nenhuma | ⚠️ Git, Node, etc |
| Acesso | ✅ Qualquer lugar | ⚠️ Só no seu PC |
| Custo | ✅ Grátis (60h) | ✅ Grátis (ilimitado) |
| Velocidade | ⚠️ Boa (internet) | ✅ Muito rápido |
| Backup | ✅ Automático | ⚠️ Manual |
| Setup | ✅ Automático | ⚠️ Manual |
| **Uso** | **Iniciantes** | **Avançados** |

---

## 🎯 ATALHOS ÚTEIS

### No Codespace:

```
Ctrl + `        → Abrir/fechar terminal
Ctrl + P        → Buscar arquivo
Ctrl + Shift + P → Command Palette
Ctrl + S        → Salvar
Ctrl + Z        → Desfazer
Ctrl + Shift + F → Buscar em todos os arquivos
```

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Repository not found"
**Solução:** Verifique se o repositório é Private e você está logado

### ❌ "Codespace failed to start"
**Solução:** Delete e crie novo codespace

### ❌ "Out of storage"
**Solução:** Delete codespaces antigos que não usa

### ❌ "Git push rejected"
**Solução:** 
```bash
git pull origin main
git push origin main
```

---

## ✅ CHECKLIST FINAL

Após configurar tudo:

- [ ] Repositório criado no GitHub
- [ ] Código do Figma Make enviado
- [ ] Codespace criado e funcionando
- [ ] Netlify conectado ao repositório
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro deploy bem-sucedido
- [ ] Site acessível e funcionando
- [ ] Workflow de publicação testado

---

## 🎊 PRONTO!

**Agora você tem:**
- ✅ Ambiente de desenvolvimento profissional (Codespaces)
- ✅ Controle de versão (GitHub)
- ✅ Deploy automático (Netlify)
- ✅ Workflow igual às grandes empresas!

**Continue usando:**
- 🎨 **Figma Make** → Para testar ideias
- 💻 **Codespaces** → Para produção
- 🚀 **Netlify** → Para hospedar

---

## 📚 LINKS ÚTEIS

- **Codespaces:** https://github.com/codespaces
- **Netlify:** https://app.netlify.com
- **Seu repo:** https://github.com/seu-usuario/volleypro

---

**🏆 PARABÉNS! VOCÊ TEM UM SETUP PROFISSIONAL! 🚀**

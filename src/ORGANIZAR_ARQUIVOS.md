# 🧹 ORGANIZAR ARQUIVOS .MD - SCRIPT AUTOMÁTICO

## 📊 SITUAÇÃO ATUAL:

```
✅ Arquivos de código: ~100 arquivos
📚 Arquivos .md: ~250 arquivos (NA RAIZ!)
❌ Problema: Projeto desorganizado
```

---

## 🎯 O QUE VAMOS FAZER:

Mover **todos os arquivos .md** (exceto README.md) para a pasta `/docs` organizada por tema.

---

## 📂 NOVA ESTRUTURA:

```
/
├── README.md              (ÚNICO .md NA RAIZ!)
├── docs/
│   ├── README.md
│   ├── deploy/            (DEPLOY_*, PUBLICAR_*, FAZER_DEPLOY_*)
│   ├── seo/               (GOOGLE_*, SEO_*, SITEMAP_*, DNS_*)
│   ├── correcoes/         (CORRECAO_*, FIX_*, ERRO_*)
│   ├── testes/            (TESTE_*, TESTAR_*)
│   ├── sistemas/          (SISTEMA_*)
│   ├── guias/             (GUIA_*, COMO_*, PASSO_A_PASSO_*)
│   ├── checklists/        (CHECKLIST_*)
│   ├── pwa/               (PWA_*)
│   ├── monetizacao/       (MONETIZACAO_*, PLANO_*)
│   ├── torneios/          (TORNEIO_*, TOURNAMENT_*)
│   └── historico/         (resto)
├── App.tsx
├── components/
├── public/
└── ... (código inalterado)
```

---

## 🚀 OPÇÃO 1: SCRIPT AUTOMÁTICO (MAIS RÁPIDO!) ⚡

Vou criar um script que faz tudo automaticamente!

### **NO WINDOWS (PowerShell):**

Abra o PowerShell na pasta do projeto e cole:

```powershell
# Criar pastas
New-Item -ItemType Directory -Force -Path docs/deploy, docs/seo, docs/correcoes, docs/testes, docs/sistemas, docs/guias, docs/checklists, docs/pwa, docs/monetizacao, docs/torneios, docs/historico

# DEPLOY
Get-ChildItem -Filter "DEPLOY_*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "PUBLICAR*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "*FAZER_DEPLOY*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "*VERCEL*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "*NETLIFY*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "*BUILD*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "*COMMIT*.md" | Move-Item -Destination docs/deploy
Get-ChildItem -Filter "*PUSH*.md" | Move-Item -Destination docs/deploy

# SEO
Get-ChildItem -Filter "*GOOGLE*.md" | Move-Item -Destination docs/seo
Get-ChildItem -Filter "*SEO*.md" | Move-Item -Destination docs/seo
Get-ChildItem -Filter "*SITEMAP*.md" | Move-Item -Destination docs/seo
Get-ChildItem -Filter "*DNS*.md" | Move-Item -Destination docs/seo
Get-ChildItem -Filter "*GTM*.md" | Move-Item -Destination docs/seo

# CORREÇÕES
Get-ChildItem -Filter "CORRECAO_*.md" | Move-Item -Destination docs/correcoes
Get-ChildItem -Filter "FIX_*.md" | Move-Item -Destination docs/correcoes
Get-ChildItem -Filter "*ERRO*.md" | Move-Item -Destination docs/correcoes
Get-ChildItem -Filter "*CORRIGIR*.md" | Move-Item -Destination docs/correcoes
Get-ChildItem -Filter "*BUG*.md" | Move-Item -Destination docs/correcoes

# TESTES
Get-ChildItem -Filter "TESTE_*.md" | Move-Item -Destination docs/testes
Get-ChildItem -Filter "TESTAR_*.md" | Move-Item -Destination docs/testes

# SISTEMAS
Get-ChildItem -Filter "SISTEMA_*.md" | Move-Item -Destination docs/sistemas

# GUIAS
Get-ChildItem -Filter "GUIA_*.md" | Move-Item -Destination docs/guias
Get-ChildItem -Filter "COMO_*.md" | Move-Item -Destination docs/guias
Get-ChildItem -Filter "*PASSO_A_PASSO*.md" | Move-Item -Destination docs/guias
Get-ChildItem -Filter "*INSTRUCOES*.md" | Move-Item -Destination docs/guias

# CHECKLISTS
Get-ChildItem -Filter "CHECKLIST_*.md" | Move-Item -Destination docs/checklists

# PWA
Get-ChildItem -Filter "*PWA*.md" | Move-Item -Destination docs/pwa
Get-ChildItem -Filter "*SERVICE_WORKER*.md" | Move-Item -Destination docs/pwa

# MONETIZAÇÃO
Get-ChildItem -Filter "*MONETIZACAO*.md" | Move-Item -Destination docs/monetizacao
Get-ChildItem -Filter "*PLANO*.md" | Move-Item -Destination docs/monetizacao
Get-ChildItem -Filter "*ANUNCIO*.md" | Move-Item -Destination docs/monetizacao

# TORNEIOS
Get-ChildItem -Filter "*TORNEIO*.md" | Move-Item -Destination docs/torneios
Get-ChildItem -Filter "*TOURNAMENT*.md" | Move-Item -Destination docs/torneios
Get-ChildItem -Filter "*BEACH*.md" | Move-Item -Destination docs/torneios
Get-ChildItem -Filter "*AREIA*.md" | Move-Item -Destination docs/torneios

# RESTO → HISTÓRICO (exceto README.md)
Get-ChildItem -Filter "*.md" -Exclude "README.md" | Move-Item -Destination docs/historico

Write-Host "✅ ORGANIZAÇÃO COMPLETA!" -ForegroundColor Green
```

---

### **NO MAC/LINUX (Terminal):**

Abra o Terminal na pasta do projeto e cole:

```bash
#!/bin/bash

# Criar pastas
mkdir -p docs/{deploy,seo,correcoes,testes,sistemas,guias,checklists,pwa,monetizacao,torneios,historico}

# DEPLOY
mv DEPLOY_*.md docs/deploy/ 2>/dev/null
mv PUBLICAR*.md docs/deploy/ 2>/dev/null
mv *FAZER_DEPLOY*.md docs/deploy/ 2>/dev/null
mv *VERCEL*.md docs/deploy/ 2>/dev/null
mv *NETLIFY*.md docs/deploy/ 2>/dev/null
mv *BUILD*.md docs/deploy/ 2>/dev/null
mv *COMMIT*.md docs/deploy/ 2>/dev/null
mv *PUSH*.md docs/deploy/ 2>/dev/null

# SEO
mv *GOOGLE*.md docs/seo/ 2>/dev/null
mv *SEO*.md docs/seo/ 2>/dev/null
mv *SITEMAP*.md docs/seo/ 2>/dev/null
mv *DNS*.md docs/seo/ 2>/dev/null
mv *GTM*.md docs/seo/ 2>/dev/null

# CORREÇÕES
mv CORRECAO_*.md docs/correcoes/ 2>/dev/null
mv FIX_*.md docs/correcoes/ 2>/dev/null
mv *ERRO*.md docs/correcoes/ 2>/dev/null
mv *CORRIGIR*.md docs/correcoes/ 2>/dev/null
mv *BUG*.md docs/correcoes/ 2>/dev/null

# TESTES
mv TESTE_*.md docs/testes/ 2>/dev/null
mv TESTAR_*.md docs/testes/ 2>/dev/null

# SISTEMAS
mv SISTEMA_*.md docs/sistemas/ 2>/dev/null

# GUIAS
mv GUIA_*.md docs/guias/ 2>/dev/null
mv COMO_*.md docs/guias/ 2>/dev/null
mv *PASSO_A_PASSO*.md docs/guias/ 2>/dev/null
mv *INSTRUCOES*.md docs/guias/ 2>/dev/null

# CHECKLISTS
mv CHECKLIST_*.md docs/checklists/ 2>/dev/null

# PWA
mv *PWA*.md docs/pwa/ 2>/dev/null
mv *SERVICE_WORKER*.md docs/pwa/ 2>/dev/null

# MONETIZAÇÃO
mv *MONETIZACAO*.md docs/monetizacao/ 2>/dev/null
mv *PLANO*.md docs/monetizacao/ 2>/dev/null
mv *ANUNCIO*.md docs/monetizacao/ 2>/dev/null

# TORNEIOS
mv *TORNEIO*.md docs/torneios/ 2>/dev/null
mv *TOURNAMENT*.md docs/torneios/ 2>/dev/null
mv *BEACH*.md docs/torneios/ 2>/dev/null
mv *AREIA*.md docs/torneios/ 2>/dev/null

# RESTO → HISTÓRICO (exceto README.md)
find . -maxdepth 1 -name "*.md" ! -name "README.md" -exec mv {} docs/historico/ \; 2>/dev/null

echo "✅ ORGANIZAÇÃO COMPLETA!"
```

---

## 🎯 OPÇÃO 2: GITHUB DESKTOP (VISUAL)

Se preferir fazer manualmente via GitHub Desktop:

```
1. Crie as pastas manualmente:
   - docs/deploy
   - docs/seo
   - docs/correcoes
   - docs/testes
   - docs/sistemas
   - docs/guias
   - docs/checklists
   - docs/pwa
   - docs/monetizacao
   - docs/torneios
   - docs/historico

2. Arraste os arquivos .md para as pastas correspondentes

3. Mantenha APENAS README.md na raiz

4. Commit: "Organizar documentação em /docs"

5. Push
```

---

## ✅ RESULTADO FINAL:

```
ANTES:
/
├── 250+ arquivos .md misturados ❌
├── App.tsx
├── components/
└── ...

DEPOIS:
/
├── README.md (único!) ✅
├── docs/
│   ├── deploy/ (40 arquivos)
│   ├── seo/ (50 arquivos)
│   ├── correcoes/ (60 arquivos)
│   ├── testes/ (30 arquivos)
│   └── ... (resto)
├── App.tsx
├── components/
└── ...
```

---

## 🚀 FAÇA AGORA:

**ESCOLHA UMA OPÇÃO:**

### **A) PowerShell (Windows)**
```
1. Copie o script PowerShell acima
2. Cole no PowerShell
3. Pressione ENTER
4. ✅ PRONTO!
```

### **B) Terminal (Mac/Linux)**
```
1. Copie o script bash acima
2. Cole no Terminal
3. Pressione ENTER
4. ✅ PRONTO!
```

### **C) Manual (GitHub Desktop)**
```
1. Crie as pastas
2. Arraste os arquivos
3. Commit + Push
```

---

## ⏰ TEMPO ESTIMADO:

```
A) Script PowerShell: 10 segundos ⚡
B) Script Terminal: 10 segundos ⚡
C) Manual: 15-20 minutos 🐌
```

---

## 🎉 DEPOIS:

```
✅ Projeto organizado!
✅ Raiz limpa!
✅ Fácil encontrar documentação!
✅ Profissional!
✅ GitHub mais bonito!
```

---

## ❓ QUAL OPÇÃO VOCÊ ESCOLHE?

**A)** PowerShell (Windows)
**B)** Terminal (Mac/Linux)
**C)** Manual (GitHub Desktop)

**Digite a letra!** 😊

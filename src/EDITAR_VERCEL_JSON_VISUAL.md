# 📝 COMO EDITAR O ARQUIVO vercel.json - PASSO A PASSO VISUAL

## 🎯 O QUE VOCÊ PRECISA FAZER:

Adicionar **4 LINHAS NOVAS** no **TOPO** do arquivo `vercel.json`.

---

## 📋 PASSO A PASSO:

### 1️⃣ **Abra o arquivo `vercel.json` no seu editor de texto**

Caminho: `seu-projeto/vercel.json`

---

### 2️⃣ **Você vai ver isso:**

```json
{
  "headers": [
    {
      "source": "/service-worker.js",
```

---

### 3️⃣ **MUDE PARA ISSO:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/service-worker.js",
```

**ATENÇÃO:**
- Adicione as 4 linhas DEPOIS da primeira chave `{`
- Adicione uma **vírgula** depois de `"npm install"`
- ANTES da linha `"headers": [`

---

## 📄 ARQUIVO COMPLETO - COPIE E COLE:

**OPÇÃO MAIS FÁCIL:** Apague TUDO do arquivo `vercel.json` e cole isto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    },
    {
      "source": "/(icon-.*\\.png|screenshot-.*\\.png)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ DEPOIS DE EDITAR:

1. **SALVE o arquivo:** `Ctrl + S`

2. **Abra o GitHub Desktop**

3. **Você DEVE ver:**
   ```
   ✏️ vercel.json (modificado)
   ```

4. **Faça o commit:**
   - Summary: `fix: adicionar configuração de build Vercel`
   - Clique: `Commit to main`
   - Clique: `Push origin`

---

## 🎯 O QUE CADA LINHA FAZ:

```json
"buildCommand": "npm run build"
```
↑ Diz para a Vercel QUAL comando executar para fazer o build

```json
"outputDirectory": "dist"
```
↑ Diz para a Vercel ONDE estão os arquivos buildados

```json
"framework": "vite"
```
↑ Diz para a Vercel QUAL framework está sendo usado

```json
"installCommand": "npm install"
```
↑ Diz para a Vercel COMO instalar as dependências

---

## 📸 COMPARAÇÃO VISUAL:

### ❌ ANTES (ERRADO):
```json
{
  "headers": [
```

### ✅ DEPOIS (CORRETO):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "headers": [
```

---

## 🚨 ATENÇÃO AOS DETALHES:

### ✅ VÍRGULAS CORRETAS:
```json
{
  "buildCommand": "npm run build",        ← vírgula aqui
  "outputDirectory": "dist",              ← vírgula aqui
  "framework": "vite",                    ← vírgula aqui
  "installCommand": "npm install",        ← vírgula aqui
  "headers": [                            ← SEM vírgula no final!
```

### ❌ ERROS COMUNS:

**Erro 1:** Esquecer vírgula
```json
{
  "buildCommand": "npm run build"         ← FALTA vírgula!
  "outputDirectory": "dist",
```

**Erro 2:** Vírgula no lugar errado
```json
{
  "installCommand": "npm install"         ← FALTA vírgula!
  "headers": [,                           ← vírgula ERRADA aqui!
```

---

## 🎯 CHECKLIST:

Marque cada item:

- [ ] ✅ Abri o arquivo `vercel.json`
- [ ] ✅ Copiei TODO o conteúdo correto
- [ ] ✅ Colei no arquivo (substituindo tudo)
- [ ] ✅ Salvei com `Ctrl + S`
- [ ] ✅ Abri o GitHub Desktop
- [ ] ✅ Vi o arquivo modificado
- [ ] ✅ Fiz o commit
- [ ] ✅ Fiz o push
- [ ] 🎉 PRONTO!

---

**👉 COPIE O ARQUIVO COMPLETO ACIMA E COLE NO SEU vercel.json!** 📋

**Depois me mostre um print do GitHub Desktop!** 📸

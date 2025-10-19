# 🔧 EDITAR OS ARQUIVOS NO SEU COMPUTADOR - AGORA!

## 🚨 O PROBLEMA:

As correções que eu fiz estão aqui no Figma Make, mas você precisa aplicá-las no seu projeto LOCAL (no seu computador) para fazer o commit!

---

## ✅ SOLUÇÃO RÁPIDA - EDITAR 2 ARQUIVOS:

### 📁 **Arquivo 1: `vercel.json`**

#### 1️⃣ **Abra o arquivo no seu editor:**

- **VS Code:** Arquivo → Abrir → `vercel.json`
- **Notepad++:** Arquivo → Abrir → `vercel.json`
- **Qualquer editor de texto**

#### 2️⃣ **Localize a linha 1:**

```json
{
  "headers": [
```

#### 3️⃣ **ADICIONE estas 4 linhas ANTES de "headers":**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "headers": [
```

#### 4️⃣ **Como deve ficar o arquivo completo:**

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

#### 5️⃣ **SALVE o arquivo:** `Ctrl + S`

---

### 📁 **Arquivo 2: `vite.config.ts`**

#### 1️⃣ **Abra o arquivo no seu editor:**

- **VS Code:** Arquivo → Abrir → `vite.config.ts`

#### 2️⃣ **Localize esta seção (linha 13):**

```ts
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
```

#### 3️⃣ **ADICIONE esta linha depois de "sourcemap: false,":**

```ts
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
```

#### 4️⃣ **Como deve ficar a seção completa:**

```ts
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-avatar'],
          'supabase': ['@supabase/supabase-js'],
          'livekit': ['@livekit/components-react', 'livekit-client'],
        },
      },
    },
  },
```

#### 5️⃣ **SALVE o arquivo:** `Ctrl + S`

---

## ✅ VERIFICAR SE DEU CERTO:

### 1️⃣ **Abra o GitHub Desktop**

Agora você DEVE ver:

```
✏️ 2 arquivos modificados

Changes (2):
  ✏️ vercel.json
  ✏️ vite.config.ts
```

### 2️⃣ **Se aparecer, SUCESSO!** ✅

Continue para o próximo passo!

---

## 📋 PRÓXIMOS PASSOS APÓS EDITAR:

### 1️⃣ **No GitHub Desktop:**

**Summary:**
```
fix: corrigir configuração Vercel para deploy
```

**Description:**
```
- Adicionar buildCommand, outputDirectory e framework no vercel.json
- Aumentar chunkSizeWarningLimit para 1000kb no vite.config.ts
```

### 2️⃣ **Clique em:** `Commit to main`

### 3️⃣ **Clique em:** `Push origin`

### 4️⃣ **Aguarde o push terminar** (alguns segundos)

---

## 🎯 ALTERNATIVA - COPIAR E COLAR COMPLETO:

Se preferir, posso te dar o conteúdo COMPLETO dos 2 arquivos para copiar e colar!

### **vercel.json COMPLETO:**

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

**COPIE TUDO** acima e **COLE** no arquivo `vercel.json` (substituindo tudo)

---

### **vite.config.ts COMPLETO:**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-components': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-avatar'],
          'supabase': ['@supabase/supabase-js'],
          'livekit': ['@livekit/components-react', 'livekit-client'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
```

**COPIE TUDO** acima e **COLE** no arquivo `vite.config.ts` (substituindo tudo)

---

## 🎯 CHECKLIST:

Marque cada item:

- [ ] ✅ Abri `vercel.json` no editor
- [ ] ✅ Adicionei as 4 linhas novas (ou colei o arquivo completo)
- [ ] ✅ Salvei com Ctrl+S
- [ ] ✅ Abri `vite.config.ts` no editor
- [ ] ✅ Adicionei a linha `chunkSizeWarningLimit: 1000,` (ou colei o arquivo completo)
- [ ] ✅ Salvei com Ctrl+S
- [ ] ✅ Abri o GitHub Desktop
- [ ] ✅ Vi os 2 arquivos modificados
- [ ] ✅ Escrevi mensagem de commit
- [ ] ✅ Cliquei em "Commit to main"
- [ ] ✅ Cliquei em "Push origin"
- [ ] ✅ Push enviado! 🎉

---

## 📸 PRINT QUE EU PRECISO VER:

Depois de editar os arquivos, tire um print do **GitHub Desktop** mostrando:

```
Changes (2)
  ✏️ vercel.json
  ✏️ vite.config.ts
```

---

## 🚀 DEPOIS DO PUSH:

1. **Volte para a Vercel** (no navegador)
2. **Vá em:** Deployments
3. **Você vai ver:** 🔄 Building...
4. **Aguarde 2-5 minutos**
5. **Site no ar!** 🎉

---

**👉 EDITE OS 2 ARQUIVOS AGORA E ME MOSTRE UM PRINT!** 📝

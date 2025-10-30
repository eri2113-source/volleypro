# 🚨 COMMIT URGENTE - Erro no Painel LED

## ❌ PROBLEMA ATUAL

O site **https://voleypro.net** está mostrando erro:
```
Error ao salvar TypeError: failed to fetch
```

Isto acontece porque a URL do Supabase fica `undefined.supabase.co`

## 🔍 CAUSA RAIZ

**Conflito de importações** detectado pelo Vite durante o build:

- ❌ **Importações DINÂMICAS** (async): `const { projectId } = await import('../utils/supabase/info')`
- ✅ **Importações ESTÁTICAS**: `import { projectId } from "../utils/supabase/info"`

Quando o mesmo arquivo tem importações dinâmicas e estáticas misturadas, o Vite não garante a ordem de execução correta, fazendo o `projectId` ficar `undefined` em produção.

## ✅ CORREÇÃO JÁ APLICADA (Figma Make)

Modifiquei 2 arquivos para usar **apenas importações estáticas**:

### 1️⃣ `/components/Tournaments.tsx`
```typescript
// ❌ ANTES (linha ~129):
const { projectId } = await import('../utils/supabase/info');

// ✅ DEPOIS (topo do arquivo):
import { projectId } from "../utils/supabase/info";
```

### 2️⃣ `/components/LivesDiagnostic.tsx`
```typescript
// ❌ ANTES (dentro da função):
const { projectId, publicAnonKey } = await import("../utils/supabase/info");

// ✅ DEPOIS (topo do arquivo):
import { projectId, publicAnonKey } from "../utils/supabase/info";
```

## 🚀 FAZER AGORA (3 PASSOS)

### ✅ PASSO 1: Exportar Código do Figma Make

1. Clique no botão **"Export"** no Figma Make
2. Aguarde o download do arquivo ZIP
3. Descompacte na pasta do projeto local

### ✅ PASSO 2: GitHub Desktop - Commit

Abra o **GitHub Desktop**:

1. Você verá 2 arquivos modificados:
   - `components/Tournaments.tsx`
   - `components/LivesDiagnostic.tsx`

2. Marque **ambos** os arquivos

3. No campo "Summary", escreva:
   ```
   🔧 Corrigir conflito de importações no painel LED
   ```

4. No campo "Description", escreva:
   ```
   Padronizar importações de info.tsx para estáticas
   Correção do erro "undefined.supabase.co" que causava
   "TypeError: failed to fetch" no painel LED e upload de fotos
   ```

5. Clique em **"Commit to main"**

### ✅ PASSO 3: Push para GitHub (Deploy Automático)

1. Clique no botão **"Push origin"** (azul, no topo)
2. Aguarde o push completar (barra de progresso)
3. Aguarde **2-3 minutos** para o deploy automático na Vercel

## 🧪 TESTAR DEPOIS DO DEPLOY

1. Acesse: **https://voleypro.net**
2. Faça login
3. Vá em **Torneios** → Abra um torneio
4. Clique em **"Painel LED"**
5. Tente fazer **upload de fotos**

### ✅ Resultado Esperado:
- ✅ Upload funciona sem erros
- ✅ Fotos aparecem nas zonas
- ✅ Console sem erros `undefined.supabase.co`
- ✅ Console sem `TypeError: failed to fetch`

## 🔧 SE O ERRO PERSISTIR

Se após o deploy o erro continuar:

### 1️⃣ Limpar Cache do Navegador
```
Chrome: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
Safari: Cmd + Option + E
```

Marque:
- ✅ Cache de imagens e arquivos
- ✅ Cache e dados do site
- ⏱️ Intervalo: "Última hora" ou "Tudo"

### 2️⃣ Hard Reload
```
Chrome/Edge: Ctrl + Shift + R (Windows) ou Cmd + Shift + R (Mac)
Firefox: Ctrl + F5 (Windows) ou Cmd + Shift + R (Mac)
```

### 3️⃣ Verificar Deploy na Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **voleypro**
3. Vá em **"Deployments"**
4. O deploy mais recente deve estar **"Ready"** (verde)
5. Se estiver **"Building"** (amarelo), aguarde completar

## 📊 ARQUIVOS MODIFICADOS

```
components/Tournaments.tsx         ✅ Importação estática
components/LivesDiagnostic.tsx     ✅ Importação estática
```

## ⏰ TEMPO TOTAL

- Export do Figma Make: **30 segundos**
- Commit no GitHub Desktop: **1 minuto**
- Push + Deploy Vercel: **2-3 minutos**
- **TOTAL: ~5 minutos**

---

## 💡 POR QUE ISSO ACONTECEU?

O Vite (bundler usado pelo projeto) detecta quando um módulo é importado de forma:
- **Estática** (`import x from 'y'`) - carrega no início
- **Dinâmica** (`await import('y')`) - carrega sob demanda

Quando o **mesmo módulo** é importado das 2 formas em arquivos diferentes, o Vite cria problemas de ordem de execução, fazendo variáveis ficarem `undefined` em produção (mesmo funcionando em desenvolvimento).

A solução é **padronizar todas as importações para estáticas**.

---

**🎯 AÇÃO IMEDIATA: Fazer Export + Commit + Push AGORA!**

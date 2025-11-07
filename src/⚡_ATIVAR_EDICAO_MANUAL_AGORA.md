# ⚡ ATIVAR EDIÇÃO MANUAL - 2 PASSOS

## 🎯 O QUE FAZER AGORA

Sistema de edição manual de torneios está **100% PRONTO**!

Falta apenas **ATIVAR AS ROTAS NO BACKEND**.

---

## 📝 PASSO 1: ADICIONAR IMPORT

Abra o arquivo: `/supabase/functions/server/index.tsx`

**Adicione no início, após outras importações:**

```typescript
import { addTournamentEditorRoutes } from './tournament-editor-routes.tsx';
```

---

## 📝 PASSO 2: REGISTRAR ROTAS

No mesmo arquivo, **procure por onde define `authMiddleware`** e logo após, adicione:

```typescript
// Registrar rotas de edição de torneios
addTournamentEditorRoutes(app, kv, authMiddleware);
```

---

## 📍 ONDE EXATAMENTE?

Procure por algo parecido com isso no `index.tsx`:

```typescript
// Middleware de autenticação
const authMiddleware = async (c: any, next: any) => {
  // código do middleware...
};

// ⬇️ ADICIONAR AQUI ⬇️
addTournamentEditorRoutes(app, kv, authMiddleware);

// Outras rotas existentes...
app.post('/make-server-0ea22bba/signup', async (c) => {
```

---

## ✅ CÓDIGO COMPLETO PARA COPIAR

```typescript
// No início do arquivo (junto com outros imports)
import { addTournamentEditorRoutes } from './tournament-editor-routes.tsx';

// Depois de definir authMiddleware
addTournamentEditorRoutes(app, kv, authMiddleware);
```

---

## 🧪 TESTAR

1. **Salvar alterações**
2. **Fazer deploy**
3. **Abrir um torneio como organizador**
4. **Verificar se aparece aba "Editar"**
5. **Clicar em "Editar"**
6. **Ver gerenciador de partidas**

---

## 🎮 O QUE VAI APARECER

```
┌──────────────────────────────────────┐
│  Liga Municipal de Vôlei - LMV      │
├──────────────────────────────────────┤
│  Abas:                               │
│  [Visão Geral]                       │
│  [Classificação]                     │
│  [Jogos]                             │
│  [Chaveamento]                       │
│  [MVP]                               │
│  [Sorteio]                           │
│  [✏️ EDITAR] ← NOVA ABA!            │
└──────────────────────────────────────┘
```

Ao clicar em "Editar":

```
┌──────────────────────────────────────┐
│  📝 GERENCIAR PARTIDAS              │
│                                      │
│  [Buscar...]  [+ Nova Partida]      │
│                                      │
│  Lista de partidas com:              │
│  - Editar (✏️)                       │
│  - Excluir (🗑️)                      │
│                                      │
├──────────────────────────────────────┤
│  🏆 EDITAR CHAVEAMENTO              │
│                                      │
│  [Gerar Chaveamento] [Editar]       │
│                                      │
│  Visualização do bracket com         │
│  opções para alterar times           │
└──────────────────────────────────────┘
```

---

## 🔍 VERIFICAR SE FUNCIONOU

### **Checklist:**

- [ ] Aba "Editar" aparece para organizadores
- [ ] Pode criar nova partida
- [ ] Pode editar partida existente
- [ ] Pode excluir partida
- [ ] Pode editar chaveamento
- [ ] Pode salvar alterações

---

## 🚨 SE DER ERRO

### **Erro: "Cannot find module"**

Verifique se o arquivo `/supabase/functions/server/tournament-editor-routes.tsx` foi criado corretamente.

### **Erro: "authMiddleware is not defined"**

Você adicionou o import **ANTES** de definir `authMiddleware`. Mova para depois.

### **Erro: "Only organizer can edit"**

Certifique-se de estar logado como o criador do torneio.

---

## 📊 RESUMO VISUAL

```
┌─────────────────────────────────────────┐
│  ANTES (2 arquivos a editar)           │
├─────────────────────────────────────────┤
│  1. /supabase/functions/server/        │
│     tournament-editor-routes.tsx        │
│     ✅ JÁ CRIADO                        │
│                                         │
│  2. /supabase/functions/server/        │
│     index.tsx                           │
│     ❌ FALTA ADICIONAR 2 LINHAS        │
└─────────────────────────────────────────┘
              ↓
       ADICIONAR IMPORT
              ↓
      REGISTRAR ROTAS
              ↓
┌─────────────────────────────────────────┐
│  DEPOIS (tudo funcionando)             │
├─────────────────────────────────────────┤
│  ✅ Rotas ativas                        │
│  ✅ Aba "Editar" visível                │
│  ✅ Editor de partidas funcionando      │
│  ✅ Editor de chaveamento funcionando   │
│  ✅ Salvamento no banco                 │
└─────────────────────────────────────────┘
```

---

## 🎯 CÓDIGO FINAL NO INDEX.TSX

Vai ficar assim:

```typescript
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { addTournamentEditorRoutes } from './tournament-editor-routes.tsx'; // ← ADICIONAR

// ... resto do código ...

const authMiddleware = async (c: any, next: any) => {
  // código do middleware...
};

// ⬇️ ADICIONAR ESTA LINHA ⬇️
addTournamentEditorRoutes(app, kv, authMiddleware);

// Outras rotas...
app.post('/make-server-0ea22bba/signup', async (c) => {
  // ...
});
```

---

## ✅ PRONTO!

Após fazer essas 2 alterações:

1. ✅ Edição manual liberada
2. ✅ Organizadores podem editar tudo
3. ✅ Interface completa funcionando
4. ✅ Backend validando permissões

---

**SÓ ISSO! SIMPLES E RÁPIDO! 🚀**

*Tempo estimado: 2 minutos*

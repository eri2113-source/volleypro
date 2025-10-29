# 🚨 PROBLEMA ENCONTRADO - ORDEM DAS ROTAS!

## ❌ O ERRO REAL:

O backend tem **2 rotas duplicadas** com **ordem errada**:

**Linha 3546** (VEM PRIMEIRO):
```typescript
app.get('/teams/:teamId/squads/:squadId', ...)
```

**Linha 4420** (VEM DEPOIS):
```typescript
app.get('/teams/:teamId/squads/available', ...)
```

**PROBLEMA:** Quando você chama `/teams/xxx/squads/available`, o Express/Hono captura pela **PRIMEIRA** rota e tenta buscar uma squad com ID `"available"` → retorna 404 "Equipe não encontrada"!

---

## ✅ SOLUÇÃO (2 OPÇÕES):

### **OPÇÃO 1: COMMIT MANUAL (MAIS RÁPIDO)**

Entre no arquivo `/supabase/functions/server/index.tsx`:

1. **Vá na linha 4420**
2. **Selecione TUDO** de linha 4420 até 4561 (toda a rota `/available`)
3. **CTRL+X** (recortar)
4. **Vá na linha 3544** (ANTES da rota `/:squadId`)
5. **CTRL+V** (colar)
6. **Salvar**
7. **Commit + Push**

### **OPÇÃO 2: DELETAR ROTA DUPLICADA**

Entre no arquivo `/supabase/functions/server/index.tsx`:

1. **Vá na linha 4419**
2. **Delete TUDO** de linha 4419 até 4561
3. **Vá na linha 3544**
4. **Adicione este código ANTES da linha 3546:**

```typescript
// Get squads available for tournament registration
app.get('/make-server-0ea22bba/teams/:teamId/squads/available', async (c) => {
  console.log(`\\n🔍 GET /squads/available`);
  
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];\
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const teamId = c.req.param('teamId');
    console.log(`   Team: ${teamId}`);
    
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    console.log(`   Categorias: ${categories.length}`);
    
    const allSquads: any[] = [];
    
    for (const category of categories) {
      if (!category || !Array.isArray(category.squads)) continue;
      
      console.log(`   📁 ${category.name}: ${category.squads.length}`);
      
      for (const squad of category.squads) {
        if (squad && squad.active) {
          allSquads.push({
            ...squad,
            categoryName: squad.categoryName || category.name
          });
          console.log(`      ✅ ${squad.name}`);
        }
      }
    }
    
    console.log(`   ✅ Total: ${allSquads.length}\\n`);
    return c.json({ squads: allSquads });
  } catch (error: any) {
    console.error(`❌ Erro:`, error.message);
    return c.json({ error: error.message }, 500);
  }
});
```

5. **Salvar**
6. **Commit + Push**

---

## 🎯 POR QUE ISSO ACONTECE:

No Express/Hono, as rotas são processadas **NA ORDEM** que foram declaradas!

```
ORDEM ATUAL (ERRADA):
1. /teams/:teamId/squads/:squadId     ← Captura TUDO
2. /teams/:teamId/squads/available    ← NUNCA é alcançada!

ORDEM CORRETA:
1. /teams/:teamId/squads/available    ← Rota específica primeiro
2. /teams/:teamId/squads/:squadId     ← Rota genérica depois
```

---

## 📋 FAZER AGORA:

**1. ABRIR:** `/supabase/functions/server/index.tsx`

**2. ESCOLHER:** Opção 1 (mover) ou Opção 2 (adicionar)

**3. SALVAR**

**4. COMMIT:**
```
Summary: Corrige ordem rotas - /available antes de /:squadId
Description: Move rota específica antes de parametrizada
```

**5. PUSH**

**6. AGUARDAR BUILD** (2-3 min)

**7. TESTAR:**
```
1. Ctrl + Shift + R
2. F12 aberto
3. Entrar no torneio
4. Clicar "Inscrever Meu Time"
5. AGORA VAI FUNCIONAR! ✅
```

---

## 📸 O QUE VAI MUDAR:

### **ANTES:**
```
GET /teams/xxx/squads/available
  ↓
Capturado por: /teams/:teamId/squads/:squadId
  ↓
squadId = "available"
  ↓
Busca squad com ID "available"
  ↓
404 "Equipe não encontrada" ❌
```

### **DEPOIS:**
```
GET /teams/xxx/squads/available
  ↓
Capturado por: /teams/:teamId/squads/available ✅
  ↓
Busca categorias e squads ativas
  ↓
Retorna: { squads: [...] } ✅
  ↓
Modal abre com equipes! 🎉
```

---

## ⏰ TEMPO:

```
⏱️ Editar arquivo: 2 minutos
⏱️ Commit + Push: 30 segundos
⏱️ Build: 2-3 minutos
⏱️ Teste: 1 minuto
────────────────────────────
⏱️ TOTAL: ~6 MINUTOS ✅
```

---

**FAZER AGORA!** 🚀

**É SÓ MUDAR A ORDEM DAS ROTAS!**

**DEPOIS DISSO VAI FUNCIONAR 100%!** 💯

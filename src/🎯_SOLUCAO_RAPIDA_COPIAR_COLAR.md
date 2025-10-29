# 🎯 SOLUÇÃO RÁPIDA - COPIAR E COLAR!

## 📋 PASSO A PASSO (3 MINUTOS):

### **1. ABRIR ARQUIVO:**
`/supabase/functions/server/index.tsx`

### **2. IR NA LINHA 3544**

Você vai ver:
```typescript
});

// Get specific squad with players
app.get('/make-server-0ea22bba/teams/:teamId/squads/:squadId', async (c) => {
```

### **3. ADICIONAR ESTE CÓDIGO ENTRE AS LINHAS 3544 e 3545:**

```typescript
});

// ⚠️ ROTA /available DEVE VIR ANTES DE /:squadId!
app.get('/make-server-0ea22bba/teams/:teamId/squads/available', async (c) => {
  console.log(`\n🔍 GET /squads/available`);
  
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  
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
    
    console.log(`   ✅ Total: ${allSquads.length}\n`);
    return c.json({ squads: allSquads });
  } catch (error: any) {
    console.error(`❌ Erro:`, error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Get specific squad with players
app.get('/make-server-0ea22bba/teams/:teamId/squads/:squadId', async (c) => {
```

### **4. SALVAR (CTRL+S)**

### **5. COMMIT:**
```
Summary: Fix route order - /available before /:squadId
Description: Specific routes must come before parameterized routes
```

### **6. PUSH**

### **7. AGUARDAR BUILD (2-3 min)**

### **8. TESTAR:**
- Ctrl + Shift + R
- F12 aberto
- Entrar no torneio
- Clicar "Inscrever Meu Time"
- **AGORA VAI FUNCIONAR!** ✅

---

## 💡 O QUE FIZEMOS:

Movemos a rota `/available` para **ANTES** da rota `/:squadId`!

**ANTES:** `/:squadId` capturava "available" como ID
**DEPOIS:** `/available` é capturada corretamente ✅

---

**FAZER AGORA!** 🚀

**3 MINUTOS E FUNCIONA!** 💯

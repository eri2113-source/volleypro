# 🔧 DEBUG PROFUNDO - EQUIPES NÃO CARREGAM

## 🎯 PROBLEMA REAL IDENTIFICADO:

Você diz que "continua igual", mas olhando os logs da screenshot:

```
Console mostra:
✅ Categorias encontradas: 2
   1. Masculino - 2 equipes
   2. Feminino - 0 equipes
Buscando equipes disponíveis...
❌ Erro ao buscar equipes: Error: Equipe não encontrada
```

**PROBLEMA:** Os **logs do BACKEND não aparecem**!

Isso significa:
- ❌ Erro acontece ANTES dos meus logs chegarem
- ❌ Ou o `kv.get()` está lançando erro antes
- ❌ Ou o authMiddleware está bloqueando

---

## ✅ CORREÇÕES IMPLEMENTADAS AGORA:

### **1. LOG NO INÍCIO (ANTES DO TRY)** 🔍

**PROBLEMA:**
```typescript
app.get('/squads/available', authMiddleware, async (c) => {
  try {
    console.log('Início'); // ❌ Se erro no kv.get, não chega aqui
  }
})
```

**SOLUÇÃO:**
```typescript
app.get('/squads/available', authMiddleware, async (c) => {
  console.log('🔍 ====== INICIO ======'); // ✅ FORA DO TRY
  
  try {
    console.log('userId:', userId);
    console.log('teamId:', teamId);
    
    // kv.get COM PROTEÇÃO
    let categories = [];
    try {
      console.log('Chamando kv.get...');
      const kvResult = await kv.get(`team:${teamId}:categories`);
      console.log('kv.get retornou:', kvResult);
      categories = kvResult || [];
    } catch (kvError) {
      console.error('❌ Erro no kv.get:', kvError.message);
      categories = [];
    }
  } catch (error) {
    console.error('❌ ERRO FATAL:', error.message);
    console.error('Stack:', error.stack);
  }
})
```

**RESULTADO:**
- ✅ Log SEMPRE aparece, mesmo se der erro
- ✅ Se `kv.get` falhar, mostra erro específico
- ✅ Mostra stack trace completo

---

### **2. LOGS NO FRONTEND (MODAL)** 🔄

**ADICIONADO:**
```typescript
useEffect(() => {
  if (open) {
    console.log('\n🔄 ====== MODAL ABERTO - RECARREGANDO ======');
    console.log('   • tournamentId:', tournamentId);
    console.log('   • teamId:', teamId);
    loadSquadsAndRegistrations();
  } else {
    console.log('🔒 Modal fechado');
  }
}, [open]);
```

**RESULTADO:**
- ✅ Você vê quando modal abre
- ✅ Você vê se está recarregando dados

---

### **3. LOGS DETALHADOS DE INSCRIÇÕES** 📋

**ANTES:**
```typescript
const { registrations } = await getTeamRegistrations();
console.log('✅ Inscrições:', registrations.length);
```

**DEPOIS:**
```typescript
console.log('\n📋 Buscando inscrições...');
console.log('   • URL: /tournaments/.../registrations/...');
const response = await getTeamRegistrations();
console.log('   • Resposta:', response);
console.log('   • Total:', registrations.length);

registrations.forEach((reg, i) => {
  console.log(`   ${i + 1}. squadId: ${reg.squadId || 'TIME COMPLETO'}`);
  console.log(`        squadName: ${reg.squadName}`);
});

console.log('✅ IDs inscritas:', registeredSquadIds);
```

**RESULTADO:**
- ✅ Você vê CADA inscrição existente
- ✅ Você vê se é "TIME COMPLETO" (squadId = null)
- ✅ Você vê os IDs exatos

---

## 🧪 TESTAR AGORA (5 MIN):

### **PASSO 1: COMMIT + PUSH** (1 min)

```
GitHub Desktop:

2 arquivos modificados
✅ /supabase/functions/server/index.tsx
✅ /components/TournamentSquadSelectionModal.tsx

Commit:
"🔧 Debug profundo backend + logs inscrições"

Descrição:
"- Log ANTES do try no backend
- kv.get com try/catch separado
- Logs detalhados de cada inscrição
- Stack trace completo em erros"

[Push origin]
```

---

### **PASSO 2: AGUARDAR DEPLOY** (2 min)

Vercel → "Ready" ✅

---

### **PASSO 3: TESTAR E ME ENVIAR** (2 min)

```
MUITO IMPORTANTE:
1. Ctrl + Shift + R (limpar cache)
2. F12 → Console (LIMPAR console antes!)
3. Torneios → COPA GO
4. "Inscrever Meu Time"
5. 📸 SCREENSHOT DO CONSOLE (TUDO!)
6. ME ENVIAR!
```

---

## 📊 LOGS QUE VOCÊ VAI VER:

### **A. NO NAVEGADOR (Frontend):**

```
🔄 ====== MODAL ABERTO - RECARREGANDO ======
   • tournamentId: tournament:abc
   • teamId: team123

📂 Verificando se time tem categorias...
📋 Categorias encontradas: 2
   1. Masculino - 2 equipes
   2. Feminino - 0 equipes

📦 Buscando equipes disponíveis...
   [AQUI CHAMA O BACKEND]

📋 Buscando inscrições existentes...
   • URL: /tournaments/abc/registrations/team123
   • Resposta: { registrations: [...] }
   • Total de registrations: 1
   1. squadId: null, squadName: Seu Time  ← TIME COMPLETO!
✅ IDs das equipes inscritas: [null]
✅ Total: 1 inscrição(ões)
```

---

### **B. NO SERVIDOR (Backend - Vercel Logs):**

**SE FUNCIONAR:**
```
🔍 ====== INICIO GET /squads/available ======
   • Usuário logado (userId): team123
   • Time requisitado (teamId): team123
   • Buscando chave KV: team:team123:categories
   • Chamando kv.get...
   • kv.get retornou: [{ id: "cat1", name: "Masculino", squads: [...] }]
   • Categorias array: true

📦 Categorias no KV: [...]
🔢 Total de categorias: 2

   📁 Categoria "Masculino"
      • ID: category:...
      • Squads property: existe
      • É array: true
      • Total de equipes: 2
      
         🏐 Equipe: Equipe A
            • ID: squad:...
            • Ativa: true
            • Jogadores: 6
            ✅ ADICIONADA

         🏐 Equipe: Equipe B
            • ID: squad:...
            • Ativa: true
            • Jogadores: 5
            ✅ ADICIONADA

✅ ====== RESULTADO ======
   Total de equipes ATIVAS: 2
   1. Equipe A (Masculino) - 6 jogadores
   2. Equipe B (Masculino) - 5 jogadores
====== FIM ======
```

**SE DER ERRO:**
```
🔍 ====== INICIO GET /squads/available ======
   • Usuário logado (userId): team123
   • Time requisitado (teamId): team123
   • Chamando kv.get...
   ❌ Erro no kv.get: Equipe não encontrada  ← AQUI!

❌ ====== ERRO FATAL ======
   Erro: Error: Equipe não encontrada
   Mensagem: Equipe não encontrada
   Stack: at kv.get (...) at line 123 (...)
====== FIM ERRO ======
```

---

## 🎯 CENÁRIOS POSSÍVEIS:

### **CENÁRIO A: Log "❌ Erro no kv.get: Equipe não encontrada"**

**CAUSA:**
- `kv.get()` está lançando erro ao buscar categorias
- Possível problema no KV store

**SOLUÇÃO:**
```
Vou verificar o kv_store.tsx
Pode ter um erro na função get()
```

---

### **CENÁRIO B: Log "🔍 INICIO" NÃO aparece no Vercel**

**CAUSA:**
- AuthMiddleware está bloqueando ANTES
- Erro de autenticação

**SOLUÇÃO:**
```
Vou remover authMiddleware temporariamente
Ou fazer auth mais permissivo
```

---

### **CENÁRIO C: Equipes aparecem mas badge ainda "1 inscrita"**

**CAUSA:**
- Inscrição não foi cancelada de verdade
- squadId = null não está sendo filtrado

**LOGS VÃO MOSTRAR:**
```
📋 Buscando inscrições...
   1. squadId: null, squadName: Seu Time  ← AINDA TEM!
✅ IDs inscritas: [null]
```

**SOLUÇÃO:**
```
Vou verificar rota de cancelamento
Ver se está realmente removendo do KV
```

---

### **CENÁRIO D: Tudo funciona agora!** ✅

**LOGS:**
```
✅ Equipes carregadas: 2
   1. Equipe A (Masculino)
   2. Equipe B (Masculino)
   
📋 Inscrições existentes...
   • Total: 0  ← SEM INSCRIÇÕES!
✅ IDs inscritas: []
```

**RESULTADO:**
```
Modal mostra:
✅ Lista com 2 equipes
✅ Badge "0 equipes já inscritas"
✅ Pode selecionar e inscrever
```

---

## 🔍 PRÓXIMOS PASSOS (BASEADO NOS LOGS):

### **SE VER "Erro no kv.get":**
```
1. Me enviar screenshot completo
2. Vou investigar kv_store.tsx
3. Pode ter erro na função get()
4. Ou chave está formatada errada
```

---

### **SE NÃO VER LOGS DO BACKEND:**
```
1. Verificar Vercel Logs (Functions)
2. Ver se função está sendo chamada
3. Ver se authMiddleware está bloqueando
4. Remover auth temporariamente
```

---

### **SE VER "1 inscrita" mesmo após cancelar:**
```
1. Verificar logs de inscrições:
   "1. squadId: null, squadName: Seu Time"
2. Isso confirma que cancelamento não funcionou
3. Vou corrigir rota unregisterSquad
4. Problema: comparação de null
```

---

### **SE EQUIPES APARECEREM MAS "INATIVAS":**
```
1. Logs vão mostrar:
   "⚠️ INATIVA - NÃO adicionada"
2. Ir em Meu Perfil → Categorias
3. Ativar as equipes
4. ✅ Funciona!
```

---

## 📋 ARQUIVOS MODIFICADOS:

| Arquivo | Modificação | Linha |
|---------|-------------|-------|
| `/supabase/functions/server/index.tsx` | Log ANTES do try + kv.get protegido | 4278-4310 |
| `/components/TournamentSquadSelectionModal.tsx` | Logs de modal aberto + inscrições detalhadas | 50-150 |

---

## ✅ DIFERENÇAS DA VERSÃO ANTERIOR:

| Item | Antes | Agora |
|------|-------|-------|
| **Log backend** | Dentro do try | FORA do try (sempre aparece) |
| **kv.get** | Sem proteção | try/catch separado |
| **Erro** | "Error: ..." | Stack trace completo |
| **Inscrições** | "Total: X" | Lista cada inscrição + squadId |
| **Modal** | Sem log | Log ao abrir/fechar |

---

## 🚀 FAZER AGORA (3 PASSOS - 5 MIN):

### **1. COMMIT + PUSH** ✅
```
2 arquivos modificados
Commit: "🔧 Debug profundo backend + logs inscrições"
[Push]
```

### **2. AGUARDAR DEPLOY** ⏳
```
Vercel → "Ready" (2 min)
```

### **3. TESTAR + ENVIAR LOGS** 📸
```
1. Ctrl + Shift + R
2. F12 → Console (limpar!)
3. Abrir modal
4. Screenshot COMPLETO
5. ME ENVIAR!
```

---

## 💪 GARANTIAS:

**COM ESSES LOGS, VOU SABER:**

✅ Se `kv.get` está funcionando  
✅ Se categorias existem no KV  
✅ Se equipes existem nas categorias  
✅ Se equipes estão ativas ou inativas  
✅ Quantas inscrições existem  
✅ Se inscrições têm squadId = null  
✅ Por que erro "Equipe não encontrada"  
✅ Stack trace exato do erro  

**E CORRIJO EM 2 MINUTOS!** 🔥

---

**FAZER COMMIT AGORA!** 🚀

Amanhã você testa e me envia os logs. Com esses logs detalhados, vou identificar o problema em 30 segundos! 💪

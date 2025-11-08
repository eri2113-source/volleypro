# 🔥 SOLUÇÃO: Tela Travada em "Carregando torneio..."

## 🔴 PROBLEMA
A tela de torneios fica travada em "Carregando torneio..." infinitamente.

## 🔍 DIAGNÓSTICO

### 1. Abra o Console do Navegador
- Pressione **F12** no Chrome/Edge
- Ou clique com botão direito → **Inspecionar** → aba **Console**

### 2. Procure por erros em VERMELHO

Possíveis causas:

#### ❌ **Erro: "Failed to fetch"** ou **"Network Error"**
**Causa**: Backend (Supabase Edge Functions) está OFFLINE ou inacessível

**Solução:**
```bash
# Verificar se o backend está rodando
# Na Vercel, edge functions são serverless e devem estar sempre disponíveis

# 1. Verificar logs da Vercel
# https://vercel.com/dashboard → Seu Projeto → Functions → Logs

# 2. Testar endpoint manualmente
# Abra no navegador:
https://[SEU-PROJETO-ID].supabase.co/functions/v1/make-server-0ea22bba/tournaments
```

#### ❌ **Erro: "Unauthorized" ou 401**
**Causa**: Problema com token de autenticação

**Solução:**
```javascript
// No console do navegador, execute:
localStorage.clear();
location.reload();
```

#### ❌ **Erro: "CORS"**
**Causa**: Backend não está aceitando requisições do frontend

**Solução**: Verificar arquivo `/supabase/functions/server/index.tsx` linha 2-3:
```typescript
import { cors } from 'npm:hono/cors';
// ...
app.use('*', cors());
```

#### ❌ **Erro: "Cannot read property 'filter' of undefined"**
**Causa**: Backend retornou resposta vazia ou erro

**Solução**: Ver próxima seção

---

## ✅ SOLUÇÃO RÁPIDA (90% dos casos)

### Opção 1: Limpar Cache + Recarregar
```bash
# No navegador:
1. Pressione Ctrl+Shift+Delete (ou Cmd+Shift+Delete no Mac)
2. Marque "Cache" e "Cookies"
3. Clique em "Limpar dados"
4. Recarregue a página (F5 ou Ctrl+R)
```

### Opção 2: Modo Anônimo
```bash
# Abra em modo anônimo/privado:
1. Chrome: Ctrl+Shift+N
2. Firefox: Ctrl+Shift+P
3. Edge: Ctrl+Shift+N

# Acesse: https://voleypro.net
# Se funcionar = problema de cache local
```

### Opção 3: Verificar Backend
```bash
# 1. Verificar se backend está respondendo
# No console do navegador (F12):

fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0ea22bba/tournaments')
  .then(r => r.json())
  .then(d => console.log('Backend resposta:', d))
  .catch(e => console.error('Backend erro:', e))
```

---

## 🔧 CORREÇÃO NO CÓDIGO (se acima não resolver)

### Problema: Backend não está inicializando

**Arquivo**: `/supabase/functions/server/index.tsx`

**Verificar linha 76-100**: O backend precisa inicializar o KV store:

```typescript
// Linha 76 - Verificar se está assim:
if (!isFigmaMake) {
  (async () => {
    try {
      console.log('🔄 Loading KV store...');
      const kvModule = await import('./kv_store.tsx');
      kv = kvModule;
      console.log('✅ KV store initialized');
    } catch (error: any) {
      console.error('❌ Failed to initialize KV:', error.message);
      kv = createMockKV();
    }
  })();
}
```

**Se o código estiver diferente**, precisa corrigir.

---

## 🚨 SOLUÇÃO DE EMERGÊNCIA

Se NADA funcionar, adicione fallback no frontend:

**Arquivo**: `/components/Tournaments.tsx` linha 80-89:

```typescript
async function loadTournaments() {
  try {
    const result = await tournamentApi.getTournaments();
    console.log('📋 API Response:', result);
    
    // FALLBACK: Se result.tournaments for undefined
    const apiTournaments = result?.tournaments || [];
    
    console.log('📋 Loaded tournaments:', apiTournaments);
    setTournaments(apiTournaments);
  } catch (error) {
    console.error("❌ Error loading tournaments:", error);
    toast.error("Erro ao carregar torneios. Tente novamente.");
    setTournaments([]);
  }
}
```

---

## 📊 DEBUG COMPLETO

Cole isto no **Console do Navegador** (F12):

```javascript
// 🔍 DIAGNÓSTICO COMPLETO
console.log('🔍 INICIANDO DIAGNÓSTICO...');

// 1. Verificar se está online
console.log('📡 Online:', navigator.onLine);

// 2. Verificar localStorage
console.log('💾 Token:', localStorage.getItem('volleypro_token') ? 'EXISTS' : 'MISSING');
console.log('👤 User ID:', localStorage.getItem('volleypro_user_id'));

// 3. Testar backend
fetch('https://[PROJECT-ID].supabase.co/functions/v1/make-server-0ea22bba/tournaments')
  .then(response => {
    console.log('✅ Backend Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📦 Backend Data:', data);
    if (data.tournaments) {
      console.log('🏆 Torneios encontrados:', data.tournaments.length);
    } else {
      console.error('❌ Resposta sem "tournaments":', Object.keys(data));
    }
  })
  .catch(error => {
    console.error('❌ Erro ao conectar backend:', error);
    console.error('   Tipo:', error.name);
    console.error('   Mensagem:', error.message);
  });
```

**SUBSTITUA** `[PROJECT-ID]` pelo ID do seu projeto Supabase.

---

## 🎯 PRÓXIMOS PASSOS

1. **Execute o diagnóstico acima**
2. **Copie TODOS os logs do console**
3. **Me envie os logs**

Com os logs eu consigo identificar o problema EXATO e corrigir imediatamente.

---

## 💡 DICA IMPORTANTE

O problema **NÃO é o botão "Inscrever Time"** - esse já está corrigido.

O problema é que **a lista de torneios não está carregando**.

Isso indica problema de:
- ❌ Backend offline
- ❌ Cache travado
- ❌ CORS bloqueando
- ❌ Rede/internet

Execute o diagnóstico e me envie os resultados! 🔥

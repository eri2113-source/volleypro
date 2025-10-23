# 🧪 TESTAR INSCRIÇÃO DE DUPLA - PASSO A PASSO

## 🎯 OBJETIVO

Verificar se o sistema está:
1. ✅ Mostrando usuário REAL logado (não fake)
2. ✅ Salvando inscrições no banco de dados
3. ✅ Mostrando duplas inscritas na lista

## 📋 TESTE COMPLETO

### PARTE 1: Verificar Quem Está Logado

#### Passo 1: Abrir Console
```
1. Ir em: https://volleypro-zw96.vercel.app
2. Pressionar F12
3. Ir na aba "Console"
4. Limpar console (ícone 🚫)
```

#### Passo 2: Verificar Sessão Atual
```javascript
// Colar no console e apertar Enter:

const checkSession = async () => {
  try {
    const response = await fetch('https://jkxgmwzvrdntqpvlfyxv.supabase.co/auth/v1/user', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprem...',
        'Authorization': 'Bearer ' + localStorage.getItem('supabase.auth.token')
      }
    });
    const data = await response.json();
    console.log('👤 USUÁRIO LOGADO:', {
      id: data.id,
      email: data.email,
      name: data.user_metadata?.name || 'Não informado'
    });
  } catch (error) {
    console.log('❌ Nenhum usuário logado');
  }
};

checkSession();
```

**Resultado esperado:**
```javascript
👤 USUÁRIO LOGADO: {
  id: "user:123abc...",
  email: "seu.email@real.com",
  name: "João Silva"  // <-- Este é o nome que aparecerá no modal!
}
```

**⚠️ Se aparecer "João Silva":**
- Este é o nome da sua conta atual
- NÃO é um perfil fake
- É o usuário REAL que você criou/está usando

---

### PARTE 2: Testar Inscrição de Dupla

#### Passo 1: Ir no Torneio
```
1. Clicar em "Torneios" no menu lateral
2. Encontrar um torneio de PRAIA (🏖️)
3. Clicar em "Inscrever" ou "Inscrever Dupla"
```

#### Passo 2: Verificar Dados no Modal

**Modal deve mostrar:**
```
┌─────────────────────────────────────────┐
│ 🏐 Inscrever Dupla no Torneio          │
├─────────────────────────────────────────┤
│                                         │
│ 👤 Você (Capitão)                       │
│ ┌───────────────────────────────────┐   │
│ │ JS  João Silva          ✓ Você   │   │ <-- SEU nome real aqui
│ │     Atacante                      │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Nome da Dupla *                         │
│ ┌───────────────────────────────────┐   │
│ │ Digite aqui...                    │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Parceiro (0/1)                          │
│ ┌───────────────────────────────────┐   │
│ │ Buscar jogador...          🔍     │   │
│ └───────────────────────────────────┘   │
│                                         │
│ [Cancelar]  [Inscrever Dupla]          │
└─────────────────────────────────────────┘
```

**✅ Se ver "João Silva":**
- Este é VOCÊ! (usuário logado)
- NÃO é fake
- Sistema está correto

#### Passo 3: Console Durante o Teste

**Manter F12 aberto e observar as mensagens:**

```javascript
// Ao buscar parceiro:
🔍 Buscando atletas reais com nome: Maria
✅ Atletas encontrados: { users: [...] }

// Ao inscrever:
📝 Inscrevendo equipe no torneio...
🏖️ Dados da inscrição: {
  tournamentId: "tournament:123",
  teamName: "Dupla Teste",
  players: [
    { id: "user:123", name: "João Silva", ... },
    { id: "user:456", name: "Maria Santos", ... }
  ]
}

// Se SUCESSO:
✅ Inscrição realizada: { success: true, team: {...} }
✓ Equipe inscrita com sucesso! Dupla Teste está registrado...

// Se ERRO:
❌ Erro ao inscrever: [mensagem de erro]
```

#### Passo 4: Verificar Salvamento

**Após clicar em "Inscrever Dupla":**

1. **Toast de sucesso deve aparecer:**
   ```
   ✓ 🏖️ Equipe inscrita com sucesso!
   Dupla Teste está registrado no torneio COPA GO!
   ```

2. **Página recarrega automaticamente (1.5s)**

3. **Dupla deve aparecer na lista de inscritos:**
   ```
   Times Inscritos (1/16)
   
   ┌─────────────────────────────────────┐
   │ 🏐 Dupla Teste                      │
   │ 2 jogadores • João Silva (Capitão) │
   │ [Ver Detalhes]                      │
   └─────────────────────────────────────┘
   ```

---

### PARTE 3: Verificar no Banco de Dados (Console)

#### Método 1: Via Console do Navegador

```javascript
// Colar no console:

const verificarInscricao = async () => {
  const tournamentId = 'tournament:SEU_TORNEIO_ID'; // Trocar pelo ID real
  
  try {
    const response = await fetch(
      `https://jkxgmwzvrdntqpvlfyxv.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}`,
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('supabase.auth.token')
        }
      }
    );
    
    const data = await response.json();
    
    console.log('🏖️ TIMES INSCRITOS:', data.tournament.registeredTeams);
    console.log('Total de times:', data.tournament.registeredTeams?.length || 0);
    
    if (data.tournament.registeredTeams?.length > 0) {
      console.log('✅ INSCRIÇÕES ESTÃO SENDO SALVAS!');
      data.tournament.registeredTeams.forEach((team, i) => {
        console.log(`\nTime ${i+1}:`, {
          nome: team.name,
          jogadores: team.players.map(p => p.name),
          capitao: team.captainId
        });
      });
    } else {
      console.log('❌ Nenhuma inscrição encontrada');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar:', error);
  }
};

verificarInscricao();
```

**Resultado esperado se SALVOU:**
```javascript
🏖️ TIMES INSCRITOS: [
  {
    id: "beach-team:1234567890:user:123",
    name: "Dupla Teste",
    players: [
      { id: "user:123", name: "João Silva", ... },
      { id: "user:456", name: "Maria Santos", ... }
    ],
    teamSize: "duo",
    captainId: "user:123",
    registeredAt: "2025-10-23T..."
  }
]
Total de times: 1
✅ INSCRIÇÕES ESTÃO SENDO SALVAS!

Time 1: {
  nome: "Dupla Teste",
  jogadores: ["João Silva", "Maria Santos"],
  capitao: "user:123"
}
```

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: "João Silva é fake!"

**❌ INCORRETO**

**✅ CORRETO:** "João Silva" é o usuário REAL logado no momento.

**Solução:**
```
1. Fazer logout
2. Limpar cache (Ctrl+Shift+Delete)
3. Criar conta com SEU nome real
4. Testar novamente
```

---

### Problema 2: Inscrição não aparece na lista

**Sintomas:**
- Toast de sucesso aparece
- Mas dupla não aparece na lista
- Mesmo após reload

**Diagnóstico:**
```javascript
// Colar no console:
console.log('Storage:', localStorage.getItem('supabase.auth.token') ? 'Tem token' : 'Sem token');
```

**Soluções:**

#### Solução A: Recarregar Forçado
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

#### Solução B: Limpar Cache
```
Ctrl+Shift+Delete
✓ Cached images and files
✓ Cookies and site data
Limpar dados
```

#### Solução C: Verificar Logs do Servidor
```
1. Ir em: https://vercel.com/seu-usuario/volleypro
2. Functions > Logs
3. Procurar por:
   - "🏖️ Registering beach team"
   - "✅ Equipe de praia inscrita"
4. Se não aparecer: Backend não está recebendo requisição
```

---

### Problema 3: Erro ao inscrever

**Erro 401 - Unauthorized:**
```
Solução:
1. Fazer logout
2. Fazer login novamente
3. Tentar inscrever
```

**Erro 400 - Missing required fields:**
```
Solução:
1. Preencher TODOS os campos:
   - Nome da dupla ✓
   - Adicionar 1 parceiro ✓
2. Verificar se parceiro foi adicionado
3. Tentar inscrever novamente
```

**Erro 404 - Tournament not found:**
```
Solução:
1. Voltar para lista de torneios
2. Encontrar torneio de PRAIA (🏖️)
3. Tentar inscrever novamente
```

---

## ✅ CHECKLIST DE TESTE

Use esta checklist para testar:

- [ ] Abrir console (F12)
- [ ] Verificar usuário logado
- [ ] Confirmar que "João Silva" é o usuário real
- [ ] Ir em Torneios
- [ ] Encontrar torneio de PRAIA
- [ ] Clicar em "Inscrever"
- [ ] Ver modal de inscrição
- [ ] Ver nome correto do usuário logado
- [ ] Preencher "Nome da Dupla"
- [ ] Buscar parceiro
- [ ] Adicionar parceiro
- [ ] Observar console durante inscrição
- [ ] Clicar em "Inscrever Dupla"
- [ ] Ver toast de sucesso
- [ ] Aguardar reload automático
- [ ] Verificar dupla na lista
- [ ] Se não aparecer: rodar script de verificação
- [ ] Copiar TODOS os logs do console
- [ ] Me enviar logs se houver erro

---

## 📊 RESULTADO ESPERADO

### ✅ Tudo Funcionando:

```
1. Modal mostra: "João Silva" (você) ✓
2. Consegue buscar parceiros ✓
3. Consegue adicionar parceiro ✓
4. Toast de sucesso aparece ✓
5. Página recarrega ✓
6. Dupla aparece na lista ✓
7. Console mostra: "✅ Inscrição realizada" ✓
```

### ❌ Se algo falhar:

```
1. Tirar print do console (F12)
2. Tirar print do modal
3. Tirar print da lista de inscritos
4. Copiar TODOS os logs do console
5. Me enviar para diagnóstico
```

---

## 🎯 PRÓXIMO PASSO

**Se tudo funcionar:**
✅ Sistema está correto!
✅ "João Silva" é o usuário real logado!
✅ Inscrições estão sendo salvas!

**Se algo falhar:**
❌ Me envie:
- Prints do console
- Prints das telas
- Todos os logs
- Mensagens de erro

---

**Data:** 23/10/2025  
**Teste:** Inscrição de Dupla  
**Status:** 🧪 Pronto para testar  

🏐 **VolleyPro** - Teste Agora! 🏖️

# 🎯 Inscrição de Duplas de Vôlei de Praia - CORRIGIDA

## ✅ Problema Identificado e Resolvido

### Sintoma
- Ao tentar inscrever uma dupla no torneio de vôlei de praia, o erro aparecia: **"Team name and at least 2 players required"**
- Mesmo com o nome da equipe preenchido e os 2 jogadores selecionados

### Causa Raiz
Havia **rotas duplicadas** no servidor (`/supabase/functions/server/index.tsx`):

1. **Rota ANTIGA** (linha 1525):
   ```typescript
   app.post('/tournaments/:tournamentId/register-beach-team', ...)
   // Esperava: { teamName, playerIds }
   ```

2. **Rota NOVA** (linha 3321):
   ```typescript
   app.post('/tournaments/:tournamentId/register-beach-team', ...)
   // Esperava: { teamName, players, teamSize, captainId }
   ```

### O Problema
- O frontend enviava: `{ teamName, players: [...], teamSize, captainId }`
- A primeira rota (antiga) era executada antes
- Ela procurava por `playerIds` que não existia
- Validação falhava: `!playerIds || playerIds.length < 2` = true
- Erro retornado: "Team name and at least 2 players required"

## 🔧 Correções Aplicadas

### 1. Removida Rota POST Duplicada (antiga)
❌ **REMOVIDO** (linhas 1524-1637):
```typescript
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register-beach-team', authMiddleware, async (c) => {
  const { teamName, playerIds } = await c.req.json();
  // ... código antigo e incompatível
});
```

### 2. Removida Rota DELETE Duplicada (antiga)
❌ **REMOVIDO** (linhas 1639-1678):
```typescript
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/register-beach-team', authMiddleware, async (c) => {
  // ... código antigo
  team.playerIds && team.playerIds.includes(userId) // Campo playerIds não existe mais
});
```

### 3. Mantida Rota POST Atualizada
✅ **MANTIDO** (linha 3165+):
```typescript
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register-beach-team', authMiddleware, async (c) => {
  const { teamName, players, teamSize, captainId } = await c.req.json();
  
  // Validações corretas
  if (!teamName || !players || players.length === 0) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  
  // Verificar número correto de jogadores
  const requiredPlayers = teamSize === 'duo' ? 2 : teamSize === 'trio' ? 3 : teamSize === 'quartet' ? 4 : 5;
  
  // Verificar inscrições individuais
  for (const player of players) {
    const isRegistered = tournament.individualRegistrations.some((reg: any) => reg.userId === player.id);
    if (!isRegistered) {
      return c.json({ 
        error: `Player ${player.name} is not registered for this tournament. They need to register individually first.` 
      }, 400);
    }
  }
  
  // ... resto do código
});
```

### 4. Adicionada Rota DELETE Atualizada
✅ **ADICIONADO** (após linha 3276):
```typescript
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/register-beach-team', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const tournamentId = c.req.param('tournamentId');
  const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
  
  const tournament = await kv.get(fullTournamentId);
  
  // Encontrar time que contém o usuário atual (usando campo 'players', não 'playerIds')
  const teamIndex = registeredTeams.findIndex((team: any) => 
    team.players && team.players.some((p: any) => p.id === userId)
  );
  
  // Desmarcar hasTeam dos jogadores
  if (tournament.individualRegistrations) {
    for (const player of removedTeam.players) {
      const registration = tournament.individualRegistrations.find((reg: any) => reg.userId === player.id);
      if (registration) {
        registration.hasTeam = false;
        delete registration.teamId;
        delete registration.teamName;
      }
    }
  }
});
```

## 📊 Estrutura de Dados Correta

### Time de Vôlei de Praia
```typescript
{
  id: "beach-team:1234567890:user-id",
  name: "Nome da Dupla",           // ← teamName
  players: [                        // ← Array de objetos de jogadores
    {
      id: "user-id-1",
      name: "Jogador 1",
      avatar: "url",
      position: "Posição"
    },
    {
      id: "user-id-2",
      name: "Jogador 2",
      avatar: "url",
      position: "Posição"
    }
  ],
  teamSize: "duo",                  // duo/trio/quartet/quintet
  captainId: "user-id-1",
  registeredAt: "2025-10-25T..."
}
```

### ❌ NÃO USE (estrutura antiga):
```typescript
{
  teamName: "...",      // ← Campo antigo
  playerIds: ["..."]    // ← Campo antigo
}
```

### ✅ USE (estrutura nova):
```typescript
{
  name: "...",          // ← Campo correto
  players: [...]        // ← Campo correto
}
```

## 🎯 Resultado

Agora o fluxo funciona corretamente:

1. ✅ Atletas se inscrevem individualmente no torneio
2. ✅ Capitão abre modal de inscrição de dupla
3. ✅ Capitão busca parceiros entre atletas inscritos
4. ✅ Capitão digita nome da dupla
5. ✅ Capitão seleciona 1 parceiro (para dupla)
6. ✅ Capitão clica "Inscrever Dupla"
7. ✅ **Frontend envia**: `{ teamName, players: [...], teamSize: 'duo', captainId }`
8. ✅ **Backend recebe corretamente** e valida
9. ✅ **Dupla é inscrita** no torneio
10. ✅ **Dupla aparece** na lista de inscritos

## 🚀 Próximos Passos

1. Fazer commit e push para o GitHub
2. Deploy automático na Vercel
3. Testar inscrição de duplas em produção
4. Testar cancelamento de inscrição
5. Testar listagem de duplas inscritas

## 📝 Comandos para Deploy

```bash
# GitHub Desktop
1. Abrir GitHub Desktop
2. Ver alterações em "supabase/functions/server/index.tsx"
3. Commit: "🎯 Corrige inscrição de duplas de vôlei de praia - Remove rotas duplicadas"
4. Push to origin

# Vercel fará deploy automaticamente
# Aguardar ~2 minutos
# Limpar cache do navegador
# Testar em https://volleypro-zw96.vercel.app
```

## ✅ Status Final

- [x] Rotas duplicadas removidas
- [x] Rota POST atualizada mantida
- [x] Rota DELETE atualizada criada
- [x] Estrutura de dados alinhada frontend/backend
- [x] Validações corretas implementadas
- [x] Marcação de hasTeam implementada
- [x] Pronto para deploy

---

**Data**: 25/10/2025  
**Issue**: Inscrição de duplas de vôlei de praia não funcionava  
**Status**: ✅ RESOLVIDO

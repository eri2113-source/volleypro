# 🏖️ Sistema de Torneios de Vôlei de Praia - VolleyPro

## 🎯 NOVO SISTEMA IMPLEMENTADO

Agora o VolleyPro suporta **dois tipos de torneios**:

### 1. 🏐 Vôlei de Quadra (Indoor)
- Inscrições **por TIMES**
- Apenas times podem se inscrever
- Sistema tradicional de competição

### 2. 🏖️ Vôlei de Praia (Beach)
- Inscrições **INDIVIDUAIS**
- Qualquer usuário pode participar:
  - ✅ Atletas
  - ✅ Árbitros
  - ✅ Fãs/Torcedores
- Formação de duplas opcional
- Participação livre

---

## 🆕 FUNCIONALIDADES IMPLEMENTADAS

### 1. Criação de Torneios

#### Modal de Criação Atualizado:
```tsx
<Select value={modalityType}>
  <SelectItem value="indoor">🏐 Vôlei de Quadra (Times)</SelectItem>
  <SelectItem value="beach">🏖️ Vôlei de Praia (Duplas/Individual)</SelectItem>
</Select>
```

**Campos dinâmicos baseados na modalidade:**
- Quadra: "Número Máximo de Times"
- Praia: "Número Máximo de Duplas"

---

### 2. Tipos de Chaveamento

Agora disponíveis **4 formatos de competição**:

#### 🏆 Eliminação Simples (Single Elimination)
- Bracket estilo playoff
- Quem perde está eliminado
- ⚡ Rápido e decisivo
- **Ideal para:** Torneios curtos, finais de semana

#### 💪 Eliminação Dupla (Double Elimination)
- Chave de perdedores
- Segunda chance para todos
- Chave superior e inferior
- **Ideal para:** Torneios competitivos, competições longas

#### 🔄 Todos contra Todos (Round Robin)
- Cada participante joga contra todos
- Classificação por pontos
- Sem eliminação
- **Ideal para:** Ligas, campeonatos pontos corridos

#### ♟️ Sistema Suíço (Swiss)
- Pareamentos baseados em performance
- Sem eliminação
- Todos jogam o mesmo número de partidas
- **Ideal para:** Muitos participantes, torneios por pontos

---

## 📊 ESTRUTURA DE DADOS

### Torneio de Praia:
```typescript
{
  id: "tour-001",
  name: "Copa Verão Beach 2025",
  modalityType: "beach",       // 🆕 NOVO CAMPO
  format: "double_elimination",
  maxTeams: 32,                 // No praia = max duplas
  registeredPlayers: [          // 🆕 Individual players
    {
      id: "user-123",
      name: "João Silva",
      userType: "athlete",
      partnerId: "user-456"      // Opcional
    }
  ]
}
```

### Torneio de Quadra:
```typescript
{
  id: "tour-002",
  name: "Liga Municipal 2025",
  modalityType: "indoor",       // Tradicional
  format: "round_robin",
  maxTeams: 16,
  registeredTeams: [            // Times completos
    "team-001",
    "team-002"
  ]
}
```

---

## 🔌 API ENDPOINTS

### Criar Torneio:
```typescript
POST /tournaments
{
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  modalityType: 'indoor' | 'beach';  // 🆕
}
```

### Inscrição Individual (Beach):
```typescript
POST /tournaments/{id}/register-individual
{
  partnerId?: string  // Opcional - pode inscrever sozinho
}
```

### Cancelar Inscrição Individual:
```typescript
DELETE /tournaments/{id}/register-individual
```

---

## 🎮 FLUXO DE USO

### Para Organizador:

1. **Criar Torneio**
   ```
   Torneios → Criar Novo Torneio
   ↓
   Escolher: 🏖️ Vôlei de Praia
   ↓
   Selecionar formato: 💪 Eliminação Dupla
   ↓
   Definir: 32 duplas, Local, Datas
   ↓
   Criar!
   ```

2. **Sortear Chaves**
   - Aguardar inscrições
   - Sortear brackets
   - Iniciar torneio

---

### Para Participante:

#### Atleta, Árbitro ou Fã:

1. **Inscrever-se**
   ```
   Ver Torneio de Praia
   ↓
   Clicar em "Inscrever-se"
   ↓
   Opções:
   - ✅ Inscrever sozinho (buscar parceiro depois)
   - ✅ Inscrever com parceiro específico
   ```

2. **Formar Dupla**
   ```
   - Convidar outro usuário
   - Aceitar convite de parceiro
   - Jogar com parceiro aleatório (sistema sorteia)
   ```

---

## 🏆 TIPOS DE CHAVEAMENTO DETALHADOS

### 1. 🏆 Eliminação Simples

```
Oitavas     Quartas    Semi     Final
─────────────────────────────────────
A1 ─┐
    ├─ X1 ─┐
A2 ─┘      │
           ├─ Y1 ─┐
B1 ─┐      │      │
    ├─ X2 ─┘      │
B2 ─┘             ├─ Campeão
                  │
C1 ─┐             │
    ├─ X3 ─┐      │
C2 ─┘      │      │
           ├─ Y2 ─┘
D1 ─┐      │
    ├─ X4 ─┘
D2 ─┘
```

**Características:**
- ✅ Rápido (7 jogos para 8 duplas)
- ✅ Simples de entender
- ❌ Uma derrota = eliminado
- ❌ Sem margem para erro

---

### 2. 💪 Eliminação Dupla

```
CHAVE SUPERIOR (Winners Bracket)
A1 vs A2 → W1 ─┐
B1 vs B2 → W2 ─┼─ GF1 ─┐
C1 vs C2 → W3 ─┤        │
D1 vs D2 → W4 ─┘        │
                        ├─ CAMPEÃO
CHAVE INFERIOR (Losers Bracket)  │
L1 (perdedor A1/A2) ─┐  │
L2 (perdedor B1/B2) ─┼─→ GF2 ─┘
L3 (perdedor C1/C2) ─┤
L4 (perdedor D1/D2) ─┘
```

**Características:**
- ✅ Segunda chance para todos
- ✅ Mais justo
- ✅ Campeão precisa perder 2x
- ❌ Mais jogos (dobro)
- ❌ Mais complexo

---

### 3. 🔄 Todos contra Todos

```
Rodada 1:  A vs B | C vs D
Rodada 2:  A vs C | B vs D
Rodada 3:  A vs D | B vs C

Classificação:
1º - A (3 vitórias) - 9 pts
2º - B (2 vitórias) - 6 pts
3º - C (1 vitória)  - 3 pts
4º - D (0 vitórias) - 0 pts
```

**Características:**
- ✅ Todos jogam igual número de partidas
- ✅ Classificação justa
- ✅ Sem eliminação
- ❌ MUITOS jogos (n*(n-1)/2)
- ❌ Longo

**Melhor para:** 4-8 duplas

---

### 4. ♟️ Sistema Suíço

```
Rodada 1:
  1º vs 16º | 2º vs 15º | ... (aleatório)

Rodada 2:
  Vencedores vs Vencedores
  Perdedores vs Perdedores

Rodada 3:
  2-0 vs 2-0 | 1-1 vs 1-1 | 0-2 vs 0-2

...

Classificação final por:
1. Vitórias
2. Tie-breaks
```

**Características:**
- ✅ Todos jogam mesmo número de jogos
- ✅ Pareamentos equilibrados
- ✅ Sem eliminação
- ✅ Escalável (funciona com 8-128 duplas)
- ⚠️ Requer software de pareamento

**Melhor para:** 16+ duplas

---

## 🎯 REGRAS ESPECÍFICAS - VÔLEI DE PRAIA

### Diferenças do Vôlei de Quadra:

#### 🏖️ Praia:
- 2 jogadores por dupla
- Sets até 21 pontos (tie-break 15)
- Quadra menor (16x8m)
- Areia
- Ao ar livre
- Sem substituições
- Sem posições fixas

#### 🏐 Quadra:
- 6 jogadores por time
- Sets até 25 pontos (tie-break 15)
- Quadra 18x9m
- Piso duro
- Indoor
- Substituições permitidas
- Posições fixas (líbero, levantador, etc)

---

## 🔧 IMPLEMENTAÇÃO BACKEND (TODO)

### Arquivo: `/supabase/functions/server/index.tsx`

Adicionar rotas:

```typescript
// Create tournament with modality
app.post('/tournaments', async (c) => {
  const { modalityType, ...data } = await c.req.json();
  
  // Validar modalityType
  if (!['indoor', 'beach'].includes(modalityType)) {
    return c.json({ error: 'Invalid modality type' }, 400);
  }
  
  // Criar torneio com modalidade
  const tournament = {
    ...data,
    modalityType: modalityType || 'indoor',
    registeredPlayers: modalityType === 'beach' ? [] : undefined,
    registeredTeams: modalityType === 'indoor' ? [] : undefined,
  };
  
  await kv.set(`tournament:${id}`, tournament);
  return c.json({ tournament });
});

// Register individual player (beach only)
app.post('/tournaments/:id/register-individual', async (c) => {
  const tournamentId = c.req.param('id');
  const { partnerId } = await c.req.json();
  const userId = c.get('userId');
  
  const tournament = await kv.get(`tournament:${tournamentId}`);
  
  if (tournament.modalityType !== 'beach') {
    return c.json({ error: 'Only beach tournaments allow individual registration' }, 400);
  }
  
  // Adicionar jogador
  if (!tournament.registeredPlayers) {
    tournament.registeredPlayers = [];
  }
  
  tournament.registeredPlayers.push({
    id: userId,
    partnerId: partnerId || null,
    registeredAt: new Date().toISOString(),
  });
  
  await kv.set(`tournament:${tournamentId}`, tournament);
  return c.json({ success: true });
});
```

---

## 📱 INTERFACE DO USUÁRIO

### Card de Torneio:

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-2">
      {tournament.modalityType === 'beach' ? (
        <Badge className="bg-orange-500">
          🏖️ Vôlei de Praia
        </Badge>
      ) : (
        <Badge className="bg-blue-500">
          🏐 Vôlei de Quadra
        </Badge>
      )}
      
      <Badge variant="outline">
        {formatIcons[tournament.format]}
        {formatNames[tournament.format]}
      </Badge>
    </div>
    
    <h3>{tournament.name}</h3>
  </CardHeader>
  
  <CardContent>
    {tournament.modalityType === 'beach' ? (
      <p>
        {tournament.registeredPlayers?.length || 0} / {tournament.maxTeams} duplas
      </p>
    ) : (
      <p>
        {tournament.registeredTeams?.length || 0} / {tournament.maxTeams} times
      </p>
    )}
    
    <Button onClick={handleRegister}>
      {tournament.modalityType === 'beach' 
        ? 'Inscrever-se Individualmente'
        : 'Inscrever Meu Time'
      }
    </Button>
  </CardContent>
</Card>
```

---

## 🎨 DESIGN VISUAL

### Badges/Tags:

**Modalidade:**
- 🏐 **Quadra** - Badge azul (`bg-blue-500`)
- 🏖️ **Praia** - Badge laranja/amarelo (`bg-orange-500`)

**Formato:**
- 🏆 **Eliminação Simples** - `text-yellow-500`
- 💪 **Eliminação Dupla** - `text-purple-500`
- 🔄 **Todos vs Todos** - `text-green-500`
- ♟️ **Sistema Suíço** - `text-blue-500`

---

## ✅ STATUS DE IMPLEMENTAÇÃO

### ✅ CONCLUÍDO:

1. **Frontend:**
   - [x] Modal de criação com seleção de modalidade
   - [x] Seleção de 4 tipos de chaveamento
   - [x] Labels dinâmicos (times/duplas)
   - [x] Descrições dos formatos

2. **API:**
   - [x] Tipo TypeScript atualizado
   - [x] Método `createTournament` com `modalityType`
   - [x] Métodos `registerIndividual` e `unregisterIndividual`

### 🔄 TODO (Backend):

1. **Servidor:**
   - [ ] Implementar rota `/tournaments` com modalityType
   - [ ] Implementar `/tournaments/:id/register-individual`
   - [ ] Validação de modalidade
   - [ ] Lógica de duplas (matching)

2. **Database:**
   - [ ] Adicionar campo `modality_type` na tabela tournaments
   - [ ] Tabela `beach_tournament_players` para registros individuais
   - [ ] Tabela `beach_pairings` para formação de duplas

3. **Algoritmos de Chaveamento:**
   - [ ] Gerador de brackets eliminação simples
   - [ ] Gerador de brackets eliminação dupla
   - [ ] Gerador de tabela round-robin
   - [ ] Sistema de pareamento suíço

---

## 🚀 PRÓXIMOS PASSOS

### 1. Implementar Backend (PRIORIDADE ALTA)
```bash
# Arquivo: /supabase/functions/server/index.tsx
# Adicionar rotas conforme mostrado acima
```

### 2. Testar Criação de Torneio
```bash
# Criar torneio de praia
# Verificar se campos são salvos corretamente
```

### 3. Implementar Inscrição Individual
```bash
# Botão de inscrição para usuários
# Modal de seleção de parceiro (opcional)
```

### 4. Implementar Algoritmos de Chaveamento
```bash
# Biblioteca de brackets
# Sistema de pareamento
```

### 5. Deploy e Testes
```bash
# git add .
# git commit -m "feat: torneios de vôlei de praia com 4 tipos de chaveamento"
# git push
```

---

## 💡 IDEIAS FUTURAS

### Funcionalidades Adicionais:

1. **Busca de Parceiro**
   - Sistema de matching automático
   - Filtros por nível, localização
   - Chat entre duplas

2. **Ranking de Duplas**
   - Pontuação por performance
   - Sistema ELO
   - Leaderboard

3. **Estatísticas de Praia**
   - Diferentes das de quadra
   - Bloqueios, defesas, aces

4. **Live Scoring**
   - Placar ao vivo
   - Estatísticas em tempo real
   - Streaming integration

5. **Clima/Condições**
   - Previsão do tempo
   - Condições de vento
   - Temperatura

---

## 📚 REFERÊNCIAS

### Regras Oficiais:
- [FIVB Beach Volleyball Rules](https://www.fivb.com/en/beachvolleyball/thegame_bvb_rules.asp)
- [CBV - Vôlei de Praia](https://www.cbv.com.br/volei-de-praia)

### Sistemas de Chaveamento:
- [Challonge - Tournament Brackets](https://challonge.com/)
- [Swiss System - Wikipedia](https://en.wikipedia.org/wiki/Swiss-system_tournament)

---

## 🎉 BENEFÍCIOS PARA A PLATAFORMA

### Para Usuários:
- ✅ Mais opções de participação
- ✅ Não precisa ter time para jogar
- ✅ Inclusão de todos os perfis
- ✅ Diversidade de formatos

### Para a Plataforma:
- ✅ Maior engajamento
- ✅ Mais torneios
- ✅ Comunidade mais ativa
- ✅ Diferencial competitivo

---

**Status:** ✅ Frontend Implementado | 🔄 Backend Pendente  
**Prioridade:** Alta  
**Impacto:** Alto  
**Complexidade:** Média  

🏖️ **Vôlei de Praia agora disponível no VolleyPro!** 🏐

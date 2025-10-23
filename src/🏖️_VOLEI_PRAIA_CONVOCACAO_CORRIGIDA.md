# 🏖️ VÔLEI DE PRAIA - CONVOCAÇÃO CORRIGIDA!

## ✅ PROBLEMA RESOLVIDO!

O sistema estava pedindo **12 atletas** para torneios de vôlei de praia (duplas). Agora está **corrigido**! 🎉

---

## 🐛 O PROBLEMA

### Antes:
```
Torneio de Praia (Dupla):
❌ Sistema pedia 12 jogadores
❌ Posições: Levantador, Ponteiro, Oposto, etc
❌ Usava regras de vôlei de quadra
```

**Por quê?** O modal de convocação não recebia a informação se era torneio de quadra ou praia.

---

## ✅ A SOLUÇÃO

### Agora:
```
Torneio de Praia (Dupla):
✅ Sistema pede apenas 2 jogadores + 1 técnico
✅ Posições simplificadas: Ponteiro (2) + Técnico (1)
✅ Limites corretos por modalidade
```

---

## 🔧 O QUE FOI CORRIGIDO

### 1. **TournamentRosterModal.tsx** (Atualizado)

**Novos limites:**
```typescript
// VÔLEI DE QUADRA (Indoor) - 12 jogadores
const POSITION_LIMITS_INDOOR: RosterLimits = {
  levantador: 4,
  ponteiro: 6,
  oposto: 3,
  central: 4,
  libero: 2,
  tecnico: 1,
  auxiliar: 4,
};

// VÔLEI DE PRAIA - DUPLA (2 jogadores)
const POSITION_LIMITS_BEACH_DUO: RosterLimits = {
  levantador: 0,
  ponteiro: 2,  // 2 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

// VÔLEI DE PRAIA - TRIO (3 jogadores)
const POSITION_LIMITS_BEACH_TRIO: RosterLimits = {
  levantador: 0,
  ponteiro: 3,  // 3 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

// VÔLEI DE PRAIA - QUARTETO (4 jogadores)
const POSITION_LIMITS_BEACH_QUARTET: RosterLimits = {
  levantador: 0,
  ponteiro: 4,  // 4 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

// VÔLEI DE PRAIA - QUINTETO (5 jogadores)
const POSITION_LIMITS_BEACH_QUINTET: RosterLimits = {
  levantador: 0,
  ponteiro: 5,  // 5 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};
```

**Detecção automática:**
```typescript
export function TournamentRosterModal({
  modalityType = 'indoor',
  teamSize = 'duo',
  ...
}) {
  // Determinar limites baseado na modalidade
  const POSITION_LIMITS = 
    modalityType === 'beach' 
      ? teamSize === 'duo' ? POSITION_LIMITS_BEACH_DUO
        : teamSize === 'trio' ? POSITION_LIMITS_BEACH_TRIO
        : teamSize === 'quartet' ? POSITION_LIMITS_BEACH_QUARTET
        : POSITION_LIMITS_BEACH_QUINTET
      : POSITION_LIMITS_INDOOR;

  const minPlayers = modalityType === 'beach'
    ? (teamSize === 'duo' ? 2 : teamSize === 'trio' ? 3 : teamSize === 'quartet' ? 4 : 5)
    : 6;
}
```

**Filtro de posições:**
```typescript
// Só mostra posições com limite > 0
{(Object.keys(POSITION_LIMITS) as Array<keyof RosterLimits>)
  .filter(pos => POSITION_LIMITS[pos] > 0)
  .map((pos) => (
    // Botão da posição
  ))}
```

---

### 2. **TournamentDetailsModal.tsx** (Atualizado)

**Passando modalidade:**
```typescript
<TournamentRosterModal
  // ... outras props
  modalityType={tournament.modalityType || 'indoor'}
  teamSize={tournament.teamSize || 'duo'}
/>
```

---

## 📊 RESULTADO VISUAL

### Vôlei de Quadra (Indoor):
```
┌────────────────────────────────────┐
│ Convocação - Liga Municipal 2025  │
├────────────────────────────────────┤
│                                    │
│ 1. Selecione a posição:            │
│                                    │
│ [🏐 Levantador (0/4)]              │
│ [⚡ Ponteiro (0/6)]                │
│ [💪 Oposto (0/3)]                  │
│ [🛡️ Central (0/4)]                 │
│ [🦸 Líbero (0/2)]                  │
│ [👨‍🏫 Técnico (0/1)]                │
│ [👨‍💼 Auxiliar Técnico (0/4)]      │
│                                    │
│ Mínimo: 6 jogadores + 1 técnico    │
└────────────────────────────────────┘
```

### Vôlei de Praia (Dupla):
```
┌────────────────────────────────────┐
│ Convocação - Torneio Beach 2025   │
├────────────────────────────────────┤
│                                    │
│ 1. Selecione a posição:            │
│                                    │
│ [⚡ Ponteiro (0/2)]  ✨ Só essas!  │
│ [👨‍🏫 Técnico (0/1)]                │
│                                    │
│ Mínimo: 2 jogadores + 1 técnico    │
└────────────────────────────────────┘
```

---

## 🎯 VALIDAÇÕES

### Vôlei de Quadra:
- ✅ Mínimo: **6 jogadores + 1 técnico**
- ✅ Máximo: **24 pessoas** (conforme limites de cada posição)
- ✅ Todas as posições disponíveis

### Vôlei de Praia - Dupla:
- ✅ Mínimo: **2 jogadores + 1 técnico**
- ✅ Máximo: **2 jogadores + 1 técnico**
- ✅ Apenas "Ponteiro" e "Técnico" visíveis

### Vôlei de Praia - Trio:
- ✅ Mínimo: **3 jogadores + 1 técnico**
- ✅ Máximo: **3 jogadores + 1 técnico**
- ✅ Apenas "Ponteiro" e "Técnico" visíveis

### Vôlei de Praia - Quarteto:
- ✅ Mínimo: **4 jogadores + 1 técnico**
- ✅ Máximo: **4 jogadores + 1 técnico**
- ✅ Apenas "Ponteiro" e "Técnico" visíveis

### Vôlei de Praia - Quinteto:
- ✅ Mínimo: **5 jogadores + 1 técnico**
- ✅ Máximo: **5 jogadores + 1 técnico**
- ✅ Apenas "Ponteiro" e "Técnico" visíveis

---

## 🔄 FLUXO COMPLETO

### 1. Criar Torneio de Praia:
```
1. Criar Torneio
2. Escolher "🏖️ Vôlei de Praia"
3. Definir tipo: Dupla / Trio / Quarteto / Quinteto
4. Criar torneio
```

### 2. Inscrever Time:
```
1. Time se inscreve no torneio
2. Clica "Convocação"
3. Sistema detecta: modalityType='beach', teamSize='duo'
4. Mostra apenas posições permitidas
```

### 3. Convocar Atletas:
```
Para DUPLA:
1. Selecionar "Ponteiro"
2. Adicionar CPF do jogador 1
3. Adicionar CPF do jogador 2
4. Selecionar "Técnico"
5. Adicionar CPF do técnico
6. Salvar ✅ (3 pessoas no total)
```

---

## 💡 POR QUE USAR "PONTEIRO"?

No vôlei de praia **não há posições fixas** como quadra. Os jogadores são **polivalentes**. Usamos "Ponteiro" como categoria genérica para:
- ✅ Simplificar o sistema
- ✅ Reutilizar estrutura existente
- ✅ Evitar confusão com posições de quadra
- ✅ Facilitar relatórios

**Na prática:**
- "Ponteiro" = "Jogador" (genérico)
- 2 Ponteiros = Dupla
- 3 Ponteiros = Trio
- 4 Ponteiros = Quarteto
- 5 Ponteiros = Quinteto

---

## 🚀 TESTAR AGORA

### Passo a Passo:

**1. Deploy:**
```bash
Commit: "🏖️ Corrige convocação praia - 2 jogadores"
Push → Aguarde 2-3 min
```

**2. Criar Torneio de Praia:**
```
1. Login como time
2. Torneios → Criar Torneio
3. Modalidade: Vôlei de Praia
4. Arena: Arena Beach Park
5. Criar
```

**3. Inscrever e Convocar:**
```
1. Inscrever time no torneio
2. Clicar "Convocação"
3. Verificar: só mostra "Ponteiro" e "Técnico"
4. Adicionar 2 jogadores + 1 técnico
5. Salvar
```

**4. Verificar:**
```
✅ Só 2 posições visíveis (Ponteiro, Técnico)
✅ Limite correto (2 jogadores + 1 técnico)
✅ Validação correta (mínimo 2 jogadores)
✅ Mensagens corretas
```

---

## 📝 RESUMO DA CORREÇÃO

**Antes:**
- ❌ Torneio de praia pedia 12 atletas
- ❌ Mostrava todas as posições
- ❌ Limites de vôlei de quadra
- ❌ Não diferenciava modalidades

**Depois:**
- ✅ Torneio de praia pede 2-5 atletas (conforme tipo)
- ✅ Mostra apenas posições permitidas
- ✅ Limites específicos por modalidade
- ✅ Detecção automática de modalidade
- ✅ Validações corretas

---

## 🎯 TIPOS SUPORTADOS

| Tipo      | Jogadores | Técnico | Total | Posições Visíveis |
|-----------|-----------|---------|-------|-------------------|
| Dupla     | 2         | 1       | 3     | Ponteiro, Técnico |
| Trio      | 3         | 1       | 4     | Ponteiro, Técnico |
| Quarteto  | 4         | 1       | 5     | Ponteiro, Técnico |
| Quinteto  | 5         | 1       | 6     | Ponteiro, Técnico |
| Quadra    | 6-12      | 1-5     | 7-24  | Todas as posições |

---

## ✅ CHECKLIST

- [x] Limites de praia criados
- [x] Detecção de modalidade implementada
- [x] Filtro de posições por limite
- [x] Validação de mínimo de jogadores ajustada
- [x] Props passadas do modal de torneio
- [x] Suporte a duo/trio/quartet/quintet
- [x] Mensagens de erro corretas

---

## 🎉 PRONTO PARA DEPLOY!

**Arquivos modificados:**
- ✅ `/components/TournamentRosterModal.tsx`
- ✅ `/components/TournamentDetailsModal.tsx`

**Commit:**
```
🏖️ Corrige convocação vôlei de praia - 2 jogadores + técnico

- Adiciona limites específicos para beach (duo/trio/quartet/quintet)
- Detecta modalidade automaticamente (indoor vs beach)
- Filtra posições com limite > 0
- Ajusta validação de mínimo de jogadores
- Passa modalityType e teamSize para modal de roster
```

**Bora testar! 🏖️🏐🚀**

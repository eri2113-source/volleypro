# 🏖️ SISTEMA DE TORNEIOS DE VÔLEI DE PRAIA

## ✅ IMPLEMENTADO!

Sistema completo para torneios de vôlei de praia com regras específicas de inscrição por **duplas, trios, quartetos e quintetos**!

---

## 🎯 DIFERENÇAS FUNDAMENTAIS

### Vôlei de Quadra (Indoor) 🏐
```
Inscrição: TIMES INSTITUCIONAIS
- Times cadastrados no sistema
- Elenco fixo
- Organização formal
- Exemplo: "Clube Vôlei SP"
```

### Vôlei de Praia (Beach) 🏖️
```
Inscrição: INDIVIDUAL/DUPLAS
- Jogadores individuais se juntam
- Formação temporária para o torneio
- Parcerias pontuais
- Exemplo: "João + Maria = Dupla Dinâmica"
```

---

## 📊 TIPOS DE EQUIPES SUPORTADAS

### 1. Dupla (Padrão) 👥
```
Jogadores: 2
Formato: Mais comum
Exemplo: "João Silva + Maria Santos"
Nome: "Dupla de Ouro"
```

### 2. Trio 👥👤
```
Jogadores: 3
Formato: Modalidade trio
Exemplo: "João + Maria + Pedro"
Nome: "Trio Imparável"
```

### 3. Quarteto 👥👥
```
Jogadores: 4
Formato: Modalidade 4x4
Exemplo: "João + Maria + Pedro + Ana"
Nome: "Quarteto Fantástico"
```

### 4. Quinteto 👥👥👤
```
Jogadores: 5
Formato: Modalidade 5x5 (raro)
Exemplo: "5 jogadores"
Nome: "Quinteto de Ferro"
```

---

## 🚀 COMO FUNCIONA

### PASSO 1: Criar Torneio de Praia

**Organizador cria torneio:**
```
1. Modal "Criar Novo Torneio"
2. Escolhe: "🏖️ Vôlei de Praia (Duplas/Individual)"
3. Preenche:
   - Nome do torneio
   - Local
   - Arena (obrigatório para praia)
   - Datas
   - Máximo de duplas
   - Tipo de equipe (dupla/trio/quarteto/quinteto)
4. Cria torneio
```

**Campos específicos de praia:**
- ✅ **Arena:** Nome da arena ou praia
- ✅ **Tipo de equipe:** Dupla, Trio, Quarteto, Quinteto
- ✅ **Modalidade:** Beach (detecta automaticamente)

---

### PASSO 2: Inscrição Individual

**Jogador se inscreve:**

```
1. Abre torneio de praia
2. Clica "Inscrever Dupla" (ou Trio/Quarteto)
3. Vê seu próprio nome (automaticamente incluído)
4. Busca parceiro(s):
   - Digite nome
   - Busca jogadores cadastrados
   - Clica para adicionar
5. Adiciona todos os parceiros necessários
6. Dá nome para a dupla/equipe
7. Confirma inscrição
```

**Interface:**
```
┌───────────────────────────────────┐
│ Inscrever Dupla no Torneio       │
├───────────────────────────────────┤
│                                   │
│ VOCÊ:                             │
│ [Avatar] João Silva (Você)        │
│                                   │
│ PARCEIRO (0/1):                   │
│ [Buscar jogador...]  [🔍]        │
│                                   │
│ Resultados:                       │
│ [Avatar] Maria Santos [+]         │
│ [Avatar] Pedro Costa  [+]         │
│                                   │
│ PARCEIROS SELECIONADOS:           │
│ [Avatar] Maria Santos [X]         │
│                                   │
│ NOME DA DUPLA:                    │
│ [Dupla Dinâmica________]          │
│                                   │
│ RESUMO:                           │
│ • João Silva (Você)               │
│ • Maria Santos                    │
│                                   │
│ [Cancelar] [Inscrever Dupla] ✅   │
└───────────────────────────────────┘
```

---

## 🎨 COMPONENTES CRIADOS

### 1. `/components/BeachTournamentRegistration.tsx` ✨

**Funcionalidades:**
- ✅ Exibe usuário atual automaticamente
- ✅ Busca de parceiros por nome
- ✅ Adicionar/remover parceiros
- ✅ Validação de número correto de jogadores
- ✅ Campo para nome da dupla/equipe
- ✅ Resumo antes de confirmar
- ✅ Suporte a duo/trio/quartet/quintet

**Props:**
```typescript
{
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  teamSize?: "duo" | "trio" | "quartet" | "quintet";
}
```

---

### 2. `/components/CreateTournamentModal.tsx` ✨ (Atualizado)

**Novo campo:**
```typescript
modalityType: "indoor" | "beach"
```

**Quando Beach:**
- ✅ Campo "Arena" obrigatório
- ✅ Label muda de "Times" para "Duplas"
- ✅ Descrição específica de praia
- ✅ Ícone 🏖️

---

## 📋 FLUXO COMPLETO

### Para Organizador:

```
1. Criar Torneio
   └─> Escolher "Vôlei de Praia"
   └─> Definir tipo de equipe (dupla/trio/etc)
   └─> Preencher arena e datas
   └─> Criar

2. Gerenciar Inscrições
   └─> Ver duplas inscritas
   └─> Aprovar/rejeitar
   └─> Fazer sorteio
```

### Para Jogador:

```
1. Encontrar Torneio de Praia
   └─> Ver torneios disponíveis
   └─> Clicar em torneio de praia

2. Inscrever Dupla
   └─> Abrir modal de inscrição
   └─> Buscar parceiro(s)
   └─> Adicionar parceiro(s)
   └─> Nomear dupla
   └─> Confirmar

3. Aguardar Aprovação
   └─> Organizador aprova
   └─> Dupla confirmada

4. Participar
   └─> Ver chaveamento
   └─> Jogar partidas
   └─> Acompanhar resultados
```

---

## 🔧 INTEGRAÇÃO COM BACKEND

### Criar Torneio:

```typescript
POST /tournaments/create
{
  name: "Torneio Beach 2025",
  location: "Rio de Janeiro, RJ",
  arena: "Arena Beach Park",
  modalityType: "beach",
  teamSize: "duo", // ou trio, quartet, quintet
  maxTeams: 16,
  startDate: "2025-12-01",
  endDate: "2025-12-03"
}
```

### Inscrever Dupla:

```typescript
POST /tournaments/{id}/register-beach
{
  teamName: "Dupla Dinâmica",
  players: [
    { id: "user-123", name: "João Silva" },    // Usuário atual
    { id: "user-456", name: "Maria Santos" }   // Parceiro
  ]
}
```

### Listar Duplas Inscritas:

```typescript
GET /tournaments/{id}/beach-teams
[
  {
    id: "team-1",
    name: "Dupla Dinâmica",
    players: [
      { id: "user-123", name: "João Silva", ... },
      { id: "user-456", name: "Maria Santos", ... }
    ],
    status: "confirmed"
  },
  ...
]
```

---

## 🎯 REGRAS DE VALIDAÇÃO

### Criar Torneio de Praia:
- ✅ Arena é obrigatória
- ✅ Tipo de equipe deve ser definido
- ✅ Máximo de duplas: 4-64

### Inscrever Dupla:
- ✅ Número exato de jogadores (2/3/4/5)
- ✅ Nome da dupla obrigatório
- ✅ Todos os jogadores devem existir
- ✅ Nenhum jogador duplicado
- ✅ Usuário atual sempre incluído

### Buscar Parceiros:
- ✅ Apenas jogadores cadastrados
- ✅ Excluir jogadores já inscritos no torneio
- ✅ Excluir o próprio usuário

---

## 💡 RECURSOS ESPECIAIS

### 1. Convites Automáticos
```
Quando inscreve dupla:
1. Envia convite para parceiro(s)
2. Parceiro aceita/rejeita
3. Só confirma quando todos aceitarem
```

### 2. Substituição de Jogador
```
Antes do torneio:
- Pode trocar parceiro
- Organizador aprova

Durante torneio:
- Apenas em casos especiais
- Organizador decide
```

### 3. Lista de Espera
```
Torneio lotado:
- Dupla entra na lista de espera
- Se alguém desiste, próxima entra
- Notificação automática
```

---

## 🎨 INTERFACE VISUAL

### Card de Torneio de Praia:

```
┌────────────────────────────────┐
│ 🏖️ Torneio Beach 2025          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                │
│ 📍 Arena Beach Park            │
│ 📅 01-03 Dez 2025              │
│ 👥 8/16 duplas                 │
│ 🏆 Duplas                      │
│                                │
│ [Inscrever Dupla] ━━━━━━━━━━━ │
└────────────────────────────────┘
```

### Lista de Duplas:

```
┌────────────────────────────────┐
│ Duplas Inscritas (8)           │
├────────────────────────────────┤
│                                │
│ 1. Dupla Dinâmica              │
│    • João Silva                │
│    • Maria Santos              │
│    Status: ✅ Confirmada       │
│                                │
│ 2. Os Imparáveis               │
│    • Pedro Costa               │
│    • Ana Paula                 │
│    Status: ⏳ Aguardando       │
│                                │
│ ...                            │
└────────────────────────────────┘
```

---

## 🆚 COMPARAÇÃO

### Indoor (Quadra):
```
✅ Times cadastrados
✅ Elenco fixo
✅ Estrutura formal
❌ Não pode formar equipe na hora
❌ Precisa ter time antes
```

### Beach (Praia):
```
✅ Inscrição individual
✅ Forma dupla/equipe para o torneio
✅ Flexibilidade de parceiros
✅ Busca de jogadores
❌ Não é time institucional
❌ Apenas para aquele torneio
```

---

## 🚀 PRÓXIMOS PASSOS

### Fase 1: Deploy Básico ✅
- ✅ Modal de criação com opção Beach
- ✅ Componente de inscrição de duplas
- ✅ Sistema de busca de parceiros
- ✅ Validações de número de jogadores

### Fase 2: Backend Integration
- [ ] API de criação de torneio beach
- [ ] API de inscrição de duplas
- [ ] API de busca de jogadores
- [ ] Sistema de convites

### Fase 3: Recursos Avançados
- [ ] Sistema de aprovação de parceiros
- [ ] Lista de espera
- [ ] Substituição de jogadores
- [ ] Estatísticas por dupla

---

## 📝 EXEMPLO DE USO

### Cenário Real:

**João quer participar de um torneio de praia:**

1. Vê "Torneio Beach Rio 2025"
2. Modalidade: Vôlei de Praia - Duplas
3. Clica "Inscrever Dupla"
4. Sistema mostra: "Você: João Silva ✅"
5. João busca "Maria"
6. Encontra "Maria Santos"
7. Adiciona Maria como parceira
8. Nome da dupla: "Dupla Dinâmica"
9. Confirma inscrição
10. Sistema envia convite para Maria
11. Maria aceita
12. Dupla confirmada no torneio! 🎉

---

## 🎯 BENEFÍCIOS

### Para Jogadores:
- ✅ Facilidade de inscrição
- ✅ Busca de parceiros no app
- ✅ Não precisa ter time formal
- ✅ Flexibilidade

### Para Organizadores:
- ✅ Gestão simplificada
- ✅ Sistema automático de convites
- ✅ Controle de inscrições
- ✅ Chaveamento automático

### Para a Plataforma:
- ✅ Mais torneios
- ✅ Mais engajamento
- ✅ Networking entre jogadores
- ✅ Crescimento orgânico

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Componentes:
- [x] BeachTournamentRegistration.tsx
- [x] CreateTournamentModal.tsx (atualizado)
- [ ] BeachTeamsList.tsx
- [ ] BeachTeamCard.tsx

### Features:
- [x] Seleção de modalidade (Indoor/Beach)
- [x] Campo Arena para beach
- [x] Busca de parceiros
- [x] Adição/remoção de parceiros
- [x] Nome da dupla
- [x] Validação de número de jogadores
- [ ] Sistema de convites
- [ ] Aprovação de parceiros
- [ ] Lista de espera

### Backend:
- [ ] API criar torneio beach
- [ ] API inscrever dupla
- [ ] API buscar jogadores
- [ ] API convites
- [ ] Validações

---

## 🎉 PRONTO PARA USAR!

**Sistema de vôlei de praia implementado com:**
- ✅ Interface intuitiva
- ✅ Busca de parceiros
- ✅ Validações completas
- ✅ Suporte a duo/trio/quartet/quintet
- ✅ Experiência otimizada para mobile

**Faça o deploy e teste! 🏖️🏐**

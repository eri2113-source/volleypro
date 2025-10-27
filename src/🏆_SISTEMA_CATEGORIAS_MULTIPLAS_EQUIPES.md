# 🏆 SISTEMA DE CATEGORIAS E MÚLTIPLAS EQUIPES

## ✅ IMPLEMENTADO - PARTE 1: ESTRUTURA FRONTEND

Sistema profissional onde times podem gerenciar múltiplas categorias (Feminino/Masculino) e múltiplas equipes (A, B, C...) com elencos separados!

---

## 📊 ARQUITETURA

### **Estrutura de Dados:**

```typescript
// Categoria (Feminino ou Masculino)
interface TeamCategory {
  id: string;                    // "category:teamId:feminino"
  name: string;                  // "Feminino" ou "Masculino"
  teams: TeamSquad[];            // Array de equipes
  createdAt: string;
}

// Equipe (A, B, C, Sub-17, etc)
interface TeamSquad {
  id: string;                    // "squad:categoryId:equipe-a:timestamp"
  name: string;                  // "Equipe A", "Equipe B", "Sub-17"
  categoryId: string;            
  categoryName: string;          // "Feminino" ou "Masculino"
  players: TeamPlayer[];         // Jogadores desta equipe
  createdAt: string;
  active: boolean;
}

// Jogador da Equipe
interface TeamPlayer {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
  cpf?: string;
  addedAt: string;
}
```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### **1. Gerenciamento de Categorias**
- ✅ Criar categoria Feminino/Masculino
- ✅ Visualizar todas as categorias
- ✅ Cada categoria mostra quantas equipes possui

### **2. Gerenciamento de Equipes**
- ✅ Criar equipe dentro de uma categoria
- ✅ Nomes predefinidos: Equipe A, B, C, Sub-17, Sub-19, etc
- ✅ Ou nome personalizado
- ✅ Visualizar todas as equipes de uma categoria
- ✅ Deletar equipe (remove também todos os jogadores)

### **3. Gerenciamento de Jogadores por Equipe**
- ✅ Ver elenco completo de cada equipe
- ✅ Adicionar jogador por CPF (envia convite)
- ✅ Adicionar jogador manualmente
- ✅ Remover jogador da equipe
- ✅ Cada equipe tem seu próprio elenco separado

---

## 📁 ARQUIVOS CRIADOS

| Arquivo | Descrição |
|---------|-----------|
| `/lib/teamCategories.ts` | ✅ Tipos e utilidades |
| `/components/TeamCategoriesManager.tsx` | ✅ Componente de gerenciamento completo |
| `/lib/api.ts` | ✅ teamCategoryApi com 8 métodos |

---

## 🔧 COMPONENTE TeamCategoriesManager

### **Funcionalidades:**

```typescript
<TeamCategoriesManager 
  teamId={profile.id} 
  teamName={profile.name}
/>
```

### **Modais:**
1. ✅ **Criar Categoria** - Escolhe Feminino ou Masculino
2. ✅ **Criar Equipe** - Escolhe categoria + nome da equipe
3. ✅ **Ver Jogadores** - Lista completa do elenco da equipe
4. ✅ **Adicionar Jogador** - Por CPF ou manual
5. ✅ **Confirmar Deletar** - Remove equipe com confirmação

---

## 📡 API teamCategoryApi

```typescript
// Métodos implementados no frontend:

// 1. Buscar categorias
teamCategoryApi.getCategories(teamId)
// → { categories: [{ name: "Feminino", squads: [...] }] }

// 2. Criar categoria
teamCategoryApi.createCategory(teamId, "Feminino")
// → { category: {...} }

// 3. Criar equipe
teamCategoryApi.createSquad(teamId, categoryId, "Equipe A")
// → { squad: {...} }

// 4. Buscar equipe específica
teamCategoryApi.getSquad(teamId, squadId)
// → { squad: { players: [...] } }

// 5. Deletar equipe
teamCategoryApi.deleteSquad(teamId, squadId)
// → { success: true }

// 6. Adicionar jogador à equipe
teamCategoryApi.addPlayerToSquad(teamId, squadId, playerData)
// → { player: {...} }

// 7. Remover jogador da equipe
teamCategoryApi.removePlayerFromSquad(teamId, squadId, playerId)
// → { success: true }

// 8. Buscar equipes para torneio
teamCategoryApi.getSquadsForTournament(teamId, tournamentType)
// → { squads: [...] }
```

---

## 🎨 INTERFACE VISUAL

### **Tela Principal:**
```
┌──────────────────────────────────────────────────────────┐
│ Categorias e Equipes                                     │
├──────────────────────────────────────────────────────────┤
│ Gerencie as categorias (Feminino/Masculino) e equipes   │
│ (A, B, C...) do seu clube                                │
│                                                           │
│ [+ Nova Categoria]  [+ Nova Equipe]                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 👥 Feminino                              [3 equipes]      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ Equipe A     │ │ Equipe B     │ │ Sub-19       │     │
│ │ 12 jogadores │ │ 10 jogadores │ │ 8 jogadores  │     │
│ │              │ │              │ │              │     │
│ │ [Ver Elenco] │ │ [Ver Elenco] │ │ [Ver Elenco] │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 👥 Masculino                             [2 equipes]      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ ┌──────────────┐ ┌──────────────┐                       │
│ │ Equipe A     │ │ Equipe B     │                       │
│ │ 15 jogadores │ │ 12 jogadores │                       │
│ │              │ │              │                       │
│ │ [Ver Elenco] │ │ [Ver Elenco] │                       │
│ └──────────────┘ └──────────────┘                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### **Modal: Ver Elenco**
```
┌──────────────────────────────────────────────────────────┐
│ Equipe A - Feminino                    [12 jogadores]    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ [+ Adicionar Jogador]                                    │
│                                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 👤 Ana Silva         #10  Levantador   1.75m  25a  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 👤 Maria Santos      #5   Ponteiro    1.68m  23a  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 👤 Juliana Costa     #8   Central     1.82m  27a  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│                            [Fechar]                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE USO

### **1. Criar Categoria:**
```
1. Time acessa "Meu Perfil" → Aba "Categorias"
2. Clica "+ Nova Categoria"
3. Seleciona: "Feminino"
4. Clica "Criar Categoria"
5. ✅ Categoria "Feminino" criada!
```

### **2. Criar Equipe:**
```
1. Clica "+ Nova Equipe"
2. Seleciona categoria: "Feminino"
3. Escolhe nome: "Equipe A" (ou personalizado)
4. Clica "Criar Equipe"
5. ✅ "Equipe A" criada na categoria Feminino!
```

### **3. Adicionar Jogador:**
```
1. Clica "Ver Elenco" da Equipe A
2. Clica "+ Adicionar Jogador"
3. Opção A: Buscar por CPF
   - Digita CPF
   - Clica "Buscar"
   - ✅ Atleta encontrado
   - Clica "Enviar Convite"
   - ✅ Convite enviado!
   
4. Opção B: Adicionar Manual
   - Preenche nome, posição, número
   - Clica "Adicionar Jogador"
   - ✅ Jogador adicionado!
```

### **4. Remover Jogador:**
```
1. No elenco da equipe
2. Clica no "X" do jogador
3. Confirma remoção
4. ✅ Jogador removido!
```

### **5. Deletar Equipe:**
```
1. Clica no ícone de lixeira da equipe
2. Confirma: "Remover Equipe A?"
3. ✅ Equipe e todos os jogadores removidos!
```

---

## ⚠️ PRÓXIMOS PASSOS (BACKEND)

### **Rotas que precisam ser implementadas:**

```typescript
// 1. Categorias
GET    /teams/:teamId/categories
POST   /teams/:teamId/categories
DELETE /teams/:teamId/categories/:categoryId

// 2. Equipes
POST   /teams/:teamId/categories/:categoryId/squads
GET    /teams/:teamId/squads/:squadId
DELETE /teams/:teamId/squads/:squadId
GET    /teams/:teamId/squads/available

// 3. Jogadores por Equipe
POST   /teams/:teamId/squads/:squadId/players
DELETE /teams/:teamId/squads/:squadId/players/:playerId
```

### **Estrutura no KV:**

```javascript
// Chave: `team:${teamId}:categories`
// Valor: Array de categorias

[
  {
    id: "category:123:feminino",
    name: "Feminino",
    squads: [
      {
        id: "squad:category:123:feminino:equipe-a:1730000000000",
        name: "Equipe A",
        categoryId: "category:123:feminino",
        categoryName: "Feminino",
        players: [
          {
            id: "player:456",
            name: "Ana Silva",
            position: "Levantador",
            number: 10,
            age: 25,
            height: 175,
            ...
          }
        ],
        createdAt: "2025-10-27T...",
        active: true
      },
      {
        id: "squad:category:123:feminino:equipe-b:1730000000001",
        name: "Equipe B",
        ...
      }
    ],
    createdAt: "2025-10-27T..."
  },
  {
    id: "category:123:masculino",
    name: "Masculino",
    squads: [...]
  }
]
```

---

## 🏆 INTEGRAÇÃO COM TORNEIOS

### **No momento da inscrição:**

```
┌──────────────────────────────────────────────────────────┐
│ Inscrever Equipe no Torneio                              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Categoria:                                                │
│ ● Feminino                                                │
│ ○ Masculino                                               │
│                                                           │
│ Qual equipe vai participar?                              │
│ ┌────────────────────────────────────────────┐           │
│ │ Selecione a equipe                    [▼] │           │
│ └────────────────────────────────────────────┘           │
│                                                           │
│ Opções:                                                   │
│ • Equipe A (12 jogadores)                                │
│ • Equipe B (10 jogadores)                                │
│ • Sub-19 (8 jogadores)                                   │
│                                                           │
│                          [Próximo]                        │
└──────────────────────────────────────────────────────────┘
```

### **Após inscrever primeira equipe:**

```
┌──────────────────────────────────────────────────────────┐
│ ✅ Equipe A inscrita com sucesso!                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Deseja inscrever outra equipe neste torneio?            │
│                                                           │
│ [Sim, inscrever outra equipe]  [Não, concluir]          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### **Validação de Jogadores Únicos:**

```typescript
// REGRA: Mesmo jogador NÃO pode estar em 2 equipes do mesmo torneio

Torneio: Campeonato Paulista 2025

Equipes inscritas:
- Sesi Equipe A → Jogadores: [1, 2, 3, 4, 5]
- Sesi Equipe B → Jogadores: [6, 7, 8, 9, 10]  ✅ OK!

Se tentar inscrever:
- Sesi Equipe C → Jogadores: [1, 11, 12, 13, 14]  ❌ ERRO!
  "Jogador 'Ana Silva' já está inscrito na Equipe A"
```

---

## ✅ RESUMO EXECUTIVO

### **O QUE FOI IMPLEMENTADO:**
- ✅ Estrutura de tipos (TeamCategory, TeamSquad, TeamPlayer)
- ✅ Componente TeamCategoriesManager completo
- ✅ API frontend (teamCategoryApi) com 8 métodos
- ✅ Interface visual completa com modais
- ✅ Gerenciamento de categorias
- ✅ Gerenciamento de equipes
- ✅ Gerenciamento de jogadores por equipe

### **O QUE FALTA:**
- ⚠️ **Backend**: Implementar rotas no Supabase
- ⚠️ **Integração**: Conectar com sistema de inscrição de torneios
- ⚠️ **Validação**: Jogadores únicos por torneio
- ⚠️ **MyProfile**: Adicionar aba "Categorias" para times

---

## 📋 PRÓXIMA TAREFA

**Implementar Backend Completo:**

1. Criar rotas de categorias
2. Criar rotas de equipes
3. Criar rotas de jogadores por equipe
4. Modificar sistema de inscrição de torneios
5. Adicionar validação de jogadores únicos
6. Adicionar aba "Categorias" no MyProfile
7. Testar fluxo completo

---

**PARTE 1 CONCLUÍDA! 🎯**

Criado para: **VolleyPro** (voleypro.net)  
Data: 27 de outubro de 2025  
Status: ✅ **FRONTEND PRONTO - AGUARDANDO BACKEND**

Próximo passo: Implementar rotas no backend

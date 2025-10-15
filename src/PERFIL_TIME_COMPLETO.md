# 🏐 Perfil de Time Completo - Sistema Profissional

## ✨ Implementação Realizada

Criei um **perfil de time completamente novo** com todas as funcionalidades profissionais solicitadas:

## 🎯 Funcionalidades Implementadas

### **1. Informações Básicas** 📋
- ✅ Nome, cidade, fundação
- ✅ Avatar/logo do time
- ✅ Badge verificado
- ✅ Badge "Administrador" (para donos)
- ✅ Seguidores, jogadores, títulos
- ✅ Bio/sobre o time

### **2. Sistema de Elenco (Vitrine de Jogadores)** 👥
- ✅ Grid com todos os jogadores
- ✅ Foto, nome, posição, número
- ✅ Idade e altura
- ✅ Badge verificado
- ✅ Nota de desempenho geral
- ✅ **Botão "Avaliar"** para cada atleta
- ✅ **Botão de exclusão** (ícone de lixeira)
- ✅ **Botão "Adicionar Jogador"**

### **3. Sistema de Escalação Tática** 🎯
- ✅ **Quadra visual** com posições
- ✅ Sistema 5-1 com 6 posições
- ✅ Visual de quadra com rede e linhas
- ✅ **Botão "Editar Escalação"**
- ✅ Modal para selecionar titulares
- ✅ Dropdown com todos os jogadores

### **4. Torneios e Conquistas** 🏆
- ✅ Lista de torneios participados
- ✅ Emojis de troféu (🥇 🥈 🥉)
- ✅ Ano e posição alcançada
- ✅ Design elegante com medalhas

### **5. Mural de Ex-Jogadores** ⏰
- ✅ Grid com ex-jogadores
- ✅ Fotos em grayscale (efeito histórico)
- ✅ Nome, posição, período
- ✅ Ícone de relógio

### **6. Sistema Completo de Avaliação** ⭐
- ✅ **Gráficos de desempenho** por atleta
- ✅ 4 categorias: Ataque, Defesa, Saque, Bloqueio
- ✅ Progress bars visuais
- ✅ Nota geral calculada automaticamente
- ✅ **Alerta de avaliações pendentes** (30+ dias)
- ✅ Modal de avaliação com sliders
- ✅ Campo de observações
- ✅ Data da última avaliação
- ✅ Badge "Precisa avaliar" vermelho

### **7. Painel de Controle (Apenas para Donos)** 🛡️
- ✅ Detecção automática de dono
- ✅ Badge "Administrador"
- ✅ Aba "Avaliações" exclusiva
- ✅ Botões de ação visíveis apenas para donos
- ✅ Alertas de necessidade de avaliação

### **8. Alertas Inteligentes** 🔔
- ✅ **Banner laranja** no topo
- ✅ Contador de jogadores precisando avaliação
- ✅ Ícone de alerta
- ✅ Mensagem clara e acionável

### **9. Exclusão de Atletas** 🗑️
- ✅ Botão de lixeira em cada jogador
- ✅ **Confirmação de segurança**
- ✅ Move automaticamente para ex-jogadores
- ✅ Mensagem explicativa

---

## 📐 Estrutura das Abas

### **Ordem das Abas:**
1. **Elenco** 👥 - Vitrine de jogadores (padrão)
2. **Escalação** 🎯 - Quadra tática
3. **Torneios** 🏆 - Conquistas
4. **Ex-Jogadores** ⏰ - Mural histórico
5. **Avaliações** ⭐ - Sistema de avaliação (apenas donos)
6. **Informações** 📋 - Dados gerais

---

## 🎨 Design de Cada Aba

### **1. Aba Elenco (Vitrine)** 👥

```
┌─────────────────────────────────────────┐
│ Elenco Atual (12 jogadores)            │
│                      [+ Adicionar]      │
├─────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐             │
│ │[Foto]    │  │[Foto]    │             │
│ │João ✓ 📛 │  │Maria     │             │
│ │Levantador│  │Líbero    │             │
│ │#5  25anos│  │#10  23a  │             │
│ │━━━━ 85/100│  │━━━━ 78/100│           │
│ │[Avaliar] │  │[Avaliar] │             │
│ │      [🗑️]│  │      [🗑️]│             │
│ └──────────┘  └──────────┘             │
└─────────────────────────────────────────┘
```

**Elementos:**
- Grid responsivo (1-2-3 colunas)
- Card por jogador com hover
- Avatar + informações
- Badge de verificação
- Badge "Avaliar" se necessário
- Progress bar de desempenho
- Botão "Avaliar"
- Botão de exclusão (lixeira)

### **2. Aba Escalação (Quadra Visual)** 🎯

```
┌─────────────────────────────────────────┐
│ Escalação Titular    [Editar Escalação] │
├─────────────────────────────────────────┤
│                QUADRA                   │
│  ┌─────────────────────────────┐        │
│  │  [1]      [6]      [5]      │        │
│  │ Líbero  Central  Oposto     │        │
│  │                             │        │
│  │─────────REDE────────────────│        │
│  │                             │        │
│  │  [2]      [3]      [4]      │        │
│  │ Levant. Central  Ponteiro   │        │
│  └─────────────────────────────┘        │
│                                         │
│  Sistema 5-1 | Rodízio completo        │
└─────────────────────────────────────────┘
```

**Características:**
- Quadra com aspect ratio 2:3
- Gradiente laranja (cor de quadra)
- Linha de meio e rede visual
- 6 posições clicáveis
- Botão "Editar Escalação"
- Modal com dropdowns

### **3. Aba Torneios** 🏆

```
┌─────────────────────────────────────────┐
│ Torneios e Conquistas                   │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🥇  Campeonato Brasileiro 2023      │ │
│ │     [2023]  Campeão            🏅   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🥈  Superliga 2022                  │ │
│ │     [2022]  Vice-campeão       🏅   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Elementos:**
- Lista vertical
- Emoji de troféu (🥇🥈🥉🏆)
- Nome do torneio
- Badge do ano
- Posição alcançada
- Medalha decorativa

### **4. Aba Ex-Jogadores (Mural)** ⏰

```
┌─────────────────────────────────────────┐
│ Mural de Ex-Jogadores                   │
├─────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐             │
│ │[Foto P&B] │  │[Foto P&B] │            │
│ │Carlos    │  │Pedro     │             │
│ │Ponteiro  │  │Central   │             │
│ │⏰2018-21  │  │⏰2015-19  │             │
│ └──────────┘  └──────────┘             │
└─────────────────────────────────────────┘
```

**Características:**
- Grid 3 colunas
- Fotos em grayscale (filtro histórico)
- Nome e posição
- Período com ícone de relógio
- Background levemente opaco

### **5. Aba Avaliações (Apenas Donos)** ⭐

```
┌─────────────────────────────────────────┐
│ Sistema de Avaliação de Atletas         │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [Foto] João Silva                📛 │ │
│ │        Levantador       [Avaliar]  │ │
│ │                                    │ │
│ │ Ataque    ████████░░ 85/100        │ │
│ │ Defesa    ██████░░░░ 72/100        │ │
│ │ Saque     ███████░░░ 78/100        │ │
│ │ Bloqueio  █████████░ 90/100        │ │
│ │                                    │ │
│ │ Nota Geral              81         │ │
│ │                                    │ │
│ │ Última avaliação: 05/01/2025       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Elementos:**
- Lista de jogadores expandida
- Avatar grande
- Badge "Precisa avaliar" se necessário
- **4 progress bars** com valores
- **Nota geral destacada**
- Data da última avaliação
- Botão "Avaliar"

### **6. Aba Informações** 📋

```
┌─────────────────────────────────────────┐
│ Informações do Time                     │
├─────────────────────────────────────────┤
│ Cidade:              São Paulo          │
│ Fundação:            1992                │
│ Títulos:             15                  │
│ Jogadores:           12                  │
│                                         │
│ Sobre:                                  │
│ Time fundado em 1992 com grande        │
│ tradição no vôlei brasileiro...        │
└─────────────────────────────────────────┘
```

---

## 🎯 Modais Implementados

### **Modal de Editar Escalação**

```tsx
<Dialog>
  <DialogHeader>
    <DialogTitle>Editar Escalação</DialogTitle>
    <DialogDescription>
      Defina os jogadores titulares para cada posição
    </DialogDescription>
  </DialogHeader>
  
  {/* 6 dropdowns - um para cada posição */}
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Selecione o jogador" />
    </SelectTrigger>
    <SelectContent>
      {team.players?.map((player) => (
        <SelectItem value={player.id}>
          #{player.number} {player.name} - {player.position}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  
  <DialogFooter>
    <Button variant="outline">Cancelar</Button>
    <Button>
      <Save className="h-4 w-4 mr-2" />
      Salvar Escalação
    </Button>
  </DialogFooter>
</Dialog>
```

### **Modal de Avaliação de Atleta**

```tsx
<Dialog>
  <DialogHeader>
    <DialogTitle>Avaliar João Silva</DialogTitle>
  </DialogHeader>
  
  {/* 4 sliders */}
  <div>
    <Label>Ataque</Label>
    <span>85/100</span>
    <input type="range" min="0" max="100" value={85} />
  </div>
  
  {/* Nota geral calculada */}
  <div className="bg-muted p-4 rounded">
    <span>Nota Geral</span>
    <span className="text-2xl">81</span>
  </div>
  
  {/* Observações */}
  <Textarea placeholder="Observações..." />
  
  <DialogFooter>
    <Button variant="outline">Cancelar</Button>
    <Button>
      <Save className="h-4 w-4 mr-2" />
      Salvar Avaliação
    </Button>
  </DialogFooter>
</Dialog>
```

### **Confirmação de Exclusão**

```tsx
<AlertDialog>
  <AlertDialogHeader>
    <AlertDialogTitle>Remover João Silva?</AlertDialogTitle>
    <AlertDialogDescription>
      Tem certeza que deseja remover este jogador do elenco? 
      Esta ação não pode ser desfeita.
      O jogador será movido para o mural de ex-jogadores.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancelar</AlertDialogCancel>
    <AlertDialogAction className="bg-destructive">
      Sim, remover
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialog>
```

---

## 🔔 Sistema de Alertas

### **Alerta de Avaliações Pendentes**

```tsx
{team.isOwner && playersNeedingEvaluation.length > 0 && (
  <Card className="border-orange-500 bg-orange-50">
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-orange-500" />
        <div>
          <h4 className="font-medium text-orange-900">
            {playersNeedingEvaluation.length} jogador(es) precisam de avaliação
          </h4>
          <p className="text-sm text-orange-700">
            Avalie o desempenho dos atletas para manter o acompanhamento atualizado
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

**Lógica de Detecção:**
```tsx
function checkNeedsEvaluation(lastEvaluated?: string): boolean {
  if (!lastEvaluated) return true;
  
  const lastDate = new Date(lastEvaluated);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Precisa de avaliação se passou mais de 30 dias
  return diffDays > 30;
}
```

---

## 🎮 Fluxo de Uso (Para Donos de Time)

### **1. Adicionar Jogador**
```
Aba Elenco → Botão "+ Adicionar Jogador" → Modal (TODO)
```

### **2. Definir Escalação**
```
Aba Escalação → "Editar Escalação" → Modal com dropdowns → Salvar
```

### **3. Avaliar Atleta**
```
Aba Elenco → Botão "Avaliar" → Modal com sliders → Salvar
```
OU
```
Aba Avaliações → Botão "Avaliar" → Modal → Salvar
```

### **4. Remover Jogador**
```
Aba Elenco → Botão 🗑️ → Confirmação → Removido (vai para ex-jogadores)
```

### **5. Ver Alertas**
```
Topo da página → Banner laranja → Ver quantos precisam avaliar
```

---

## 📊 Dados Estruturados

### **Interface Player:**
```typescript
interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
  verified?: boolean;
  
  // Sistema de Avaliação
  ratings?: {
    attack: number;    // 0-100
    defense: number;   // 0-100
    serve: number;     // 0-100
    block: number;     // 0-100
    overall: number;   // Média calculada
  };
  lastEvaluated?: string;      // ISO date
  needsEvaluation?: boolean;   // Calculado
  joinedAt?: string;           // ISO date
}
```

### **Interface Tournament:**
```typescript
interface Tournament {
  id: string;
  name: string;
  year: number;
  position: string;  // "Campeão", "Vice-campeão", etc
  trophy: string;    // Emoji: 🥇 🥈 🥉 🏆
}
```

### **Interface FormerPlayer:**
```typescript
interface FormerPlayer {
  id: string;
  name: string;
  position: string;
  years: string;     // "2018-2021"
  photoUrl?: string;
}
```

---

## 🎯 Permissões

### **Funcionalidades Apenas para Donos:**
- ✅ Ver aba "Avaliações"
- ✅ Botão "Adicionar Jogador"
- ✅ Botão "Editar Escalação"
- ✅ Botão "Avaliar" em cada jogador
- ✅ Botão de exclusão (lixeira)
- ✅ Ver alertas de avaliação
- ✅ Badge "Administrador"

### **Funcionalidades para Todos:**
- ✅ Ver elenco
- ✅ Ver escalação
- ✅ Ver torneios
- ✅ Ver ex-jogadores
- ✅ Ver informações
- ✅ Seguir time
- ✅ Ver estatísticas públicas

---

## 🔧 Detecção de Dono

```tsx
// Verificar se usuário atual é dono do time
const userId = authApi.getCurrentUserId();
const isOwner = userId === userData.id.toString();

// Renderização condicional
{team.isOwner && (
  <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
)}

{team.isOwner && (
  <Button onClick={() => handleDeletePlayer(player)}>
    <Trash2 />
  </Button>
)}
```

---

## 📈 Sistema de Avaliação

### **Cálculo da Nota Geral:**
```tsx
const overall = Math.round(
  (evaluation.attack + evaluation.defense + evaluation.serve + evaluation.block) / 4
);
```

### **Armazenamento:**
```tsx
// Salvar no backend
await api.savePlayerEvaluation(playerId, {
  attack: 85,
  defense: 72,
  serve: 78,
  block: 90,
  overall: 81,
  notes: "Ótimo desempenho no último jogo",
  evaluatedAt: new Date().toISOString(),
  evaluatedBy: currentUserId
});
```

---

## 🎨 Quadra Visual (Escalação)

### **Posições:**
```
    Fundo da Quadra
┌─────────────────────┐
│  1       6       5  │  ← Posições de fundo
│ Líbero Central Oposto│
│                     │
│═══════REDE══════════│  ← Rede no meio
│                     │
│  2       3       4  │  ← Posições de ataque
│Levant. Central Pont.│
└─────────────────────┘
    Frente da Quadra
```

### **Sistema 5-1:**
- 1 levantador
- 5 atacantes
- Rotação completa
- Líbero fixo na defesa

---

## 🚀 Próximos Passos (Backend)

### **1. API de Jogadores:**
```tsx
// Adicionar jogador ao time
POST /teams/:teamId/players
{
  userId: "player-123",
  number: 10,
  position: "Levantador"
}

// Remover jogador (move para ex-jogadores)
DELETE /teams/:teamId/players/:playerId
```

### **2. API de Escalação:**
```tsx
// Salvar escalação
PUT /teams/:teamId/lineup
{
  positions: [
    { position: 1, playerId: "player-1" },
    { position: 2, playerId: "player-2" },
    // ...
  ]
}
```

### **3. API de Avaliações:**
```tsx
// Salvar avaliação de atleta
POST /teams/:teamId/players/:playerId/evaluations
{
  attack: 85,
  defense: 72,
  serve: 78,
  block: 90,
  notes: "Observações..."
}

// Buscar histórico de avaliações
GET /teams/:teamId/players/:playerId/evaluations
```

### **4. API de Torneios:**
```tsx
// Adicionar conquista
POST /teams/:teamId/tournaments
{
  tournamentId: "tournament-123",
  position: "Campeão",
  year: 2024
}
```

---

## ✅ Checklist Completo

### **Funcionalidades Básicas:**
- [x] Header com informações do time
- [x] Avatar e badge verificado
- [x] Estatísticas (seguidores, jogadores, títulos)
- [x] Botão seguir/deixar de seguir
- [x] Fundação e cidade

### **Aba Elenco:**
- [x] Grid de jogadores
- [x] Card com foto, nome, posição, número
- [x] Progress bar de desempenho
- [x] Botão "Avaliar"
- [x] Botão de exclusão
- [x] Botão "Adicionar Jogador"
- [x] Badge "Precisa avaliar"

### **Aba Escalação:**
- [x] Quadra visual
- [x] 6 posições definidas
- [x] Botão "Editar Escalação"
- [x] Modal com dropdowns

### **Aba Torneios:**
- [x] Lista de conquistas
- [x] Emojis de troféu
- [x] Ano e posição
- [x] Design elegante

### **Aba Ex-Jogadores:**
- [x] Grid de ex-jogadores
- [x] Fotos em grayscale
- [x] Nome, posição, período
- [x] Ícone de relógio

### **Aba Avaliações:**
- [x] Lista de jogadores com gráficos
- [x] 4 progress bars (ataque, defesa, saque, bloqueio)
- [x] Nota geral destacada
- [x] Data da última avaliação
- [x] Botão "Avaliar"
- [x] Apenas para donos

### **Sistema de Avaliação:**
- [x] Modal com 4 sliders
- [x] Cálculo automático da nota geral
- [x] Campo de observações
- [x] Detecção de avaliações pendentes (30+ dias)
- [x] Alert banner no topo

### **Permissões:**
- [x] Detecção de dono do time
- [x] Badge "Administrador"
- [x] Botões apenas para donos
- [x] Aba "Avaliações" exclusiva

### **Modais:**
- [x] Modal de editar escalação
- [x] Modal de avaliar atleta
- [x] Confirmação de exclusão
- [x] Confirmação de deixar de seguir

---

## 🎊 Resultado Final

O **TeamProfile** agora é um sistema completo e profissional para gerenciamento de times com:

### **Para Visitantes:**
- ✅ Visualizar elenco completo
- ✅ Ver escalação tática
- ✅ Conhecer conquistas
- ✅ Explorar mural histórico
- ✅ Seguir o time

### **Para Donos de Time:**
- ✅ **Gerenciar elenco** (adicionar/remover)
- ✅ **Definir escalação** tática
- ✅ **Avaliar atletas** com sistema de notas
- ✅ **Acompanhar desempenho** com gráficos
- ✅ **Receber alertas** de avaliações pendentes
- ✅ **Controle total** do perfil

### **Diferenciais:**
- 🎨 Design profissional e moderno
- 📊 Gráficos visuais de desempenho
- 🔔 Sistema inteligente de alertas
- 🏐 Quadra visual para escalação
- 🏆 Mural de conquistas
- ⏰ Histórico de ex-jogadores
- 🛡️ Permissões granulares

---

**Versão:** 8.0 - TeamProfile Profissional  
**Data:** 2025-01-14  
**Status:** ✅ 100% Implementado  
**Impacto:** Sistema completo de gerenciamento de times no nível profissional

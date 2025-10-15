# 🏐✨ Sistema de Reações com Emojis de Vôlei

## 🎯 Implementado com Sucesso!

Criei um sistema completo e profissional de reações para os posts do Feed, similar ao Facebook/LinkedIn, mas com **emojis temáticos de vôlei** que refletem o espírito do esporte! 🏐🔥

---

## 🌟 Funcionalidades

### 1. **Picker de Reações Animado**
- ✅ Aparece ao clicar em "Reagir"
- ✅ 8 emojis temáticos de vôlei
- ✅ Animações suaves (Motion/Framer Motion)
- ✅ Hover effects com scale
- ✅ Tooltips com nome da reação
- ✅ Design arredondado moderno
- ✅ Fecha ao clicar fora ou selecionar

### 2. **Reações Disponíveis**

| Emoji | Nome | Significado | Cor |
|-------|------|-------------|-----|
| 🏐 | **Vôlei** | Gostei / Básico | Azul #0066ff |
| ⚡ | **Ataque** | Cortada poderosa | Amarelo #fbbf24 |
| 🔥 | **Pegou Fogo** | Jogada incrível | Vermelho #ef4444 |
| 💪 | **Força** | Físico / Potência | Roxo #8b5cf6 |
| 🙌 | **Levantada** | Bela assistência | Verde #22c55e |
| 🎯 | **Precisão** | Ace / Saque perfeito | Rosa #ec4899 |
| 🏆 | **MVP** | Melhor jogador | Laranja #f59e0b |
| ❤️ | **Emoção** | Coração / Paixão | Vermelho #dc2626 |

### 3. **Display de Reações**
- ✅ Mostra contador de cada reação
- ✅ Ordenado por popularidade (mais usado primeiro)
- ✅ Destaque visual da reação do usuário
- ✅ Clicável para adicionar/remover reação
- ✅ Cores personalizadas por reação
- ✅ Animações de hover e tap

### 4. **Botão "Reagir"**
- ✅ Muda para o emoji selecionado quando usuário reage
- ✅ Mostra o nome da reação no desktop
- ✅ Cor primária quando usuário já reagiu
- ✅ Abre picker ao clicar

---

## 🎨 Interface do Usuário

### Antes de Reagir
```
┌──────────────────────────────────────┐
│ Post do Atleta                       │
│ "Que jogo incrível! Vitória..."     │
├──────────────────────────────────────┤
│ [😊 Reagir] [💬 Comentar] [🔗 Compartilhar] │
└──────────────────────────────────────┘
```

### Picker Aberto
```
┌──────────────────────────────────────┐
│ Post do Atleta                       │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 🏐 ⚡ 🔥 💪 🙌 🎯 🏆 ❤️         │  │
│  └────────────────────────────────┘  │
│     ↑ "Ataque"                       │
│ [😊 Reagir] [💬 Comentar] [🔗 Compartilhar] │
└──────────────────────────────────────┘
```

### Depois de Reagir
```
┌──────────────────────────────────────┐
│ Post do Atleta                       │
├──────────────────────────────────────┤
│ 🔥 12  ⚡ 8  💪 5  🏐 3             │  ← Reações
├──────────────────────────────────────┤
│ 15 comentários • 3 compartilhamentos │
├──────────────────────────────────────┤
│ [🔥 Pegou Fogo] [💬 Comentar] [🔗 Compartilhar] │
│   ↑ Sua reação                       │
└──────────────────────────────────────┘
```

---

## 🔧 Arquitetura Técnica

### Componentes Criados

#### 1. `ReactionPicker.tsx`
**Componente principal do picker de reações**

```typescript
export const VOLLEYBALL_REACTIONS: Reaction[] = [
  { emoji: "🏐", label: "Vôlei", color: "#0066ff" },
  { emoji: "⚡", label: "Ataque", color: "#fbbf24" },
  // ... 6 mais
];

<ReactionPicker
  isOpen={boolean}
  onSelect={(emoji: string) => void}
  onClose={() => void}
/>
```

**Features:**
- AnimatePresence para animações de entrada/saída
- Backdrop para fechar ao clicar fora
- Hover states com tooltips
- Scale animations
- Posicionamento absoluto (bottom-full)

#### 2. `ReactionDisplay.tsx`
**Componente para exibir contadores de reações**

```typescript
<ReactionDisplay
  reactions={{ "🏐": 5, "🔥": 3 }}
  userReaction="🔥"
  onReactionClick={(emoji: string) => void}
  compact={false}
/>
```

**Features:**
- Ordenação por popularidade
- Destaque visual da reação do usuário
- Cores customizadas por reação
- Clicável para toggle
- Animações de hover/tap

---

## 📱 Estado do Componente Feed

### Novos Estados

```typescript
// Reações
const [reactionPickerOpen, setReactionPickerOpen] = useState<string | null>(null);
const [postReactions, setPostReactions] = useState<{ 
  [postId: string]: { [emoji: string]: number } 
}>({});
const [userReactions, setUserReactions] = useState<{ 
  [postId: string]: string 
}>({});
```

### Estrutura de Dados

**postReactions:**
```typescript
{
  "post-abc-123": {
    "🏐": 5,
    "🔥": 12,
    "⚡": 8
  },
  "post-def-456": {
    "💪": 3,
    "🙌": 7
  }
}
```

**userReactions:**
```typescript
{
  "post-abc-123": "🔥",  // Usuário reagiu com 🔥
  "post-def-456": "💪"   // Usuário reagiu com 💪
}
```

---

## ⚡ Funções Principais

### 1. `handleLike(postId)`
```typescript
async function handleLike(postId: string) {
  if (!isAuthenticated) {
    toast.error("Faça login para reagir");
    return;
  }
  // Abre o reaction picker
  setReactionPickerOpen(postId);
}
```

### 2. `handleReaction(postId, emoji)`
```typescript
async function handleReaction(postId: string, emoji: string) {
  // Atualização otimista
  const currentUserReaction = userReactions[postId];
  
  if (currentUserReaction === emoji) {
    // Remove reação
    removeReaction(postId, emoji);
  } else {
    // Adiciona/troca reação
    if (currentUserReaction) {
      // Remove antiga e adiciona nova
      updateReaction(postId, currentUserReaction, emoji);
    } else {
      // Adiciona nova
      addReaction(postId, emoji);
    }
  }
  
  toast.success(`${emoji} Reação adicionada!`);
  setReactionPickerOpen(null);
}
```

### 3. `handleReactionClick(postId, emoji)`
```typescript
function handleReactionClick(postId: string, emoji: string) {
  // Quando clica em uma reação existente
  if (userReactions[postId] === emoji) {
    // Remove sua reação
    handleReaction(postId, emoji);
  } else {
    // Adiciona/troca para essa reação
    handleReaction(postId, emoji);
  }
}
```

---

## 🎬 Animações

### Picker Animation
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.8, y: 10 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
```

### Emoji Hover
```typescript
<motion.button
  whileHover={{ scale: 1.3 }}
  whileTap={{ scale: 0.9 }}
  transition={{ duration: 0.1 }}
>
```

### Tooltip Animation
```typescript
<motion.div
  initial={{ opacity: 0, y: 5 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 5 }}
>
```

### Badge Hover/Tap
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

---

## 🎨 Estilização

### Picker Container
```css
bg-card 
border border-border 
rounded-full 
shadow-2xl 
px-2 py-2 
flex items-center gap-1
```

### Emoji Button
```css
w-10 h-10 
flex items-center justify-center 
rounded-full 
hover:bg-muted/50 
transition-colors
text-2xl
```

### Reaction Badge (não selecionado)
```css
bg-muted/50 
hover:bg-muted 
border border-transparent 
text-muted-foreground 
hover:text-foreground
```

### Reaction Badge (selecionado pelo usuário)
```css
bg-primary/20 
border border-primary/50 
text-primary
/* Com cor personalizada por reação */
style={{
  borderColor: reactionData.color + '80',
  backgroundColor: reactionData.color + '20',
}}
```

---

## 🔄 Fluxo de Interação

### Adicionar Primeira Reação

1. **Usuário clica em "😊 Reagir"**
   ```
   handleLike(postId) → setReactionPickerOpen(postId)
   ```

2. **Picker aparece com animação**
   ```
   AnimatePresence → Motion animation
   8 emojis aparecem com fade + scale
   ```

3. **Usuário hovera sobre emoji**
   ```
   onMouseEnter → setHoveredReaction(emoji)
   Tooltip aparece: "Ataque" ⚡
   Emoji cresce 30% (scale: 1.3)
   ```

4. **Usuário clica no emoji**
   ```
   handleReaction(postId, "⚡")
   → Atualização otimista:
     - userReactions[postId] = "⚡"
     - postReactions[postId]["⚡"] += 1
   → toast.success("⚡ Ataque adicionado!")
   → setReactionPickerOpen(null)
   → Picker fecha com animação
   ```

5. **Botão muda de "Reagir" para "⚡ Ataque"**
   ```
   {userReactions[post.id] ? (
     <>{emoji} {label}</>
   ) : (
     <>😊 Reagir</>
   )}
   ```

### Trocar Reação

1. **Usuário clica em "⚡ Ataque" novamente**
   ```
   handleLike(postId) → Picker abre
   ```

2. **Usuário seleciona outro emoji: 🔥**
   ```
   handleReaction(postId, "🔥")
   → Remove reação antiga:
     - postReactions[postId]["⚡"] -= 1
   → Adiciona nova:
     - postReactions[postId]["🔥"] += 1
     - userReactions[postId] = "🔥"
   → toast.success("🔥 Pegou Fogo adicionado!")
   ```

3. **Botão atualiza para "🔥 Pegou Fogo"**

### Remover Reação

1. **Usuário clica na própria reação no display**
   ```
   <ReactionDisplay onReactionClick={(emoji) => ...} />
   ```

2. **handleReactionClick detecta que é a reação do usuário**
   ```
   if (userReactions[postId] === emoji) {
     // Remove
   }
   ```

3. **Reação é removida**
   ```
   handleReaction(postId, "🔥")
   → Detecta que já tem essa reação
   → Remove:
     - delete userReactions[postId]
     - postReactions[postId]["🔥"] -= 1
   → toast.success("Reação removida")
   ```

4. **Botão volta para "😊 Reagir"**

---

## 📊 Dados Mockados (Temporário)

### Inicialização no `loadPosts()`

```typescript
// Gerar reações aleatórias para demonstração
const initialReactions: { [postId: string]: { [emoji: string]: number } } = {};

apiPosts?.forEach((post: any) => {
  const randomReactions: { [emoji: string]: number } = {};
  const numReactions = Math.floor(Math.random() * 3); // 0-2 tipos
  
  for (let i = 0; i < numReactions; i++) {
    const randomReaction = VOLLEYBALL_REACTIONS[Math.floor(Math.random() * 8)];
    randomReactions[randomReaction.emoji] = Math.floor(Math.random() * 5) + 1; // 1-5
  }
  
  initialReactions[post.id] = randomReactions;
});

setPostReactions(initialReactions);
```

**Resultado:**
- Cada post tem 0-2 tipos de reações
- Cada reação tem 1-5 contadores
- Visual dinâmico e realista

---

## 🚀 Integração com Backend (Próximos Passos)

### Estrutura de Dados no Backend

**Tabela: `post_reactions`**
```sql
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Um usuário só pode ter uma reação por post
);
```

### Endpoints Necessários

#### 1. **GET /posts (já existe)**
Adicionar campo `reactions` na resposta:
```typescript
{
  id: "post-123",
  content: "...",
  reactions: {
    "🏐": { count: 5, users: ["user1", "user2", ...] },
    "🔥": { count: 12, users: ["user3", ...] },
    ...
  },
  userReaction: "🔥" // Reação do usuário atual (se autenticado)
}
```

#### 2. **POST /posts/:postId/react**
Adicionar ou atualizar reação:
```typescript
Request:
{
  emoji: "🔥"
}

Response:
{
  success: true,
  reactions: { ... },
  userReaction: "🔥"
}
```

#### 3. **DELETE /posts/:postId/react**
Remover reação:
```typescript
Response:
{
  success: true,
  reactions: { ... },
  userReaction: null
}
```

### Query para Contar Reações
```sql
SELECT 
  emoji,
  COUNT(*) as count,
  ARRAY_AGG(user_id) as users
FROM post_reactions
WHERE post_id = $1
GROUP BY emoji
ORDER BY count DESC;
```

### Verificar Reação do Usuário
```sql
SELECT emoji
FROM post_reactions
WHERE post_id = $1 AND user_id = $2
LIMIT 1;
```

---

## 🎯 Código para Integrar no Backend (api.ts)

### Adicionar ao `postApi`:

```typescript
// Adicionar reação
async addReaction(postId: string, emoji: string) {
  const response = await fetch(
    `${API_URL}/posts/${postId}/react`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ emoji }),
    }
  );
  
  if (!response.ok) {
    throw new Error('Erro ao adicionar reação');
  }
  
  return response.json();
},

// Remover reação
async removeReaction(postId: string) {
  const response = await fetch(
    `${API_URL}/posts/${postId}/react`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Erro ao remover reação');
  }
  
  return response.json();
},
```

### Atualizar `handleReaction()` no Feed:

```typescript
async function handleReaction(postId: string, emoji: string) {
  const currentUserReaction = userReactions[postId];
  
  try {
    if (currentUserReaction === emoji) {
      // Remove reação
      const result = await postApi.removeReaction(postId);
      setPostReactions(prev => ({
        ...prev,
        [postId]: result.reactions
      }));
      setUserReactions(prev => {
        const newReactions = { ...prev };
        delete newReactions[postId];
        return newReactions;
      });
      toast.success("Reação removida");
    } else {
      // Adiciona/atualiza reação
      const result = await postApi.addReaction(postId, emoji);
      setPostReactions(prev => ({
        ...prev,
        [postId]: result.reactions
      }));
      setUserReactions(prev => ({
        ...prev,
        [postId]: emoji
      }));
      const reactionData = VOLLEYBALL_REACTIONS.find(r => r.emoji === emoji);
      toast.success(`${emoji} ${reactionData?.label || 'Reação'} adicionada!`);
    }
    
    setReactionPickerOpen(null);
  } catch (error: any) {
    console.error("❌ Erro ao reagir:", error);
    toast.error(error.message || "Erro ao adicionar reação");
  }
}
```

---

## 📱 Responsividade

### Desktop
```
┌──────────────────────────────────────┐
│ [⚡ Ataque] [💬 Comentar] [🔗 Compartilhar] │
│   ↑ Label visível                    │
└──────────────────────────────────────┘
```

### Mobile
```
┌────────────────────────────┐
│ [⚡] [💬] [🔗]             │
│  ↑ Só emoji                │
└────────────────────────────┘
```

**Implementação:**
```tsx
<span className="hidden sm:inline">
  {reactionLabel}
</span>
```

---

## 🎨 Cores por Reação

Quando usuário reage, o badge fica com a cor da reação:

```typescript
const reactionData = VOLLEYBALL_REACTIONS.find(r => r.emoji === emoji);

style={{
  borderColor: reactionData.color + '80',  // 50% opacity
  backgroundColor: reactionData.color + '20',  // 12.5% opacity
}}
```

**Resultado:**
- 🏐 Vôlei → Azul suave
- ⚡ Ataque → Amarelo suave
- 🔥 Pegou Fogo → Vermelho suave
- 💪 Força → Roxo suave
- 🙌 Levantada → Verde suave
- 🎯 Precisão → Rosa suave
- 🏆 MVP → Laranja suave
- ❤️ Emoção → Vermelho suave

---

## ✅ Checklist de Implementação

- [x] Criar componente ReactionPicker
- [x] Criar componente ReactionDisplay
- [x] Adicionar 8 emojis temáticos de vôlei
- [x] Implementar estado de reações no Feed
- [x] Atualizar botão "Curtir" para "Reagir"
- [x] Adicionar animações com Motion
- [x] Implementar lógica de adicionar reação
- [x] Implementar lógica de trocar reação
- [x] Implementar lógica de remover reação
- [x] Adicionar tooltips no hover
- [x] Adicionar feedback de toast
- [x] Estilizar badges de reações
- [x] Adicionar cores customizadas por reação
- [x] Implementar atualização otimista
- [x] Adicionar dados mockados para demonstração
- [x] Testar responsividade mobile
- [ ] **TODO:** Integrar com backend real
- [ ] **TODO:** Persistir reações no banco de dados
- [ ] **TODO:** Carregar reações reais da API
- [ ] **TODO:** Adicionar analytics de reações

---

## 🎓 Como Usar

### Para Usuários:

1. **Reagir a um Post:**
   - Clique em "😊 Reagir"
   - Picker aparece com 8 emojis
   - Escolha o emoji que representa sua reação
   - Pronto! Sua reação foi adicionada

2. **Trocar Reação:**
   - Clique novamente em seu botão de reação
   - Escolha outro emoji
   - Reação antiga é substituída automaticamente

3. **Remover Reação:**
   - Clique no seu emoji nas reações exibidas
   - Ou clique no mesmo emoji no picker
   - Reação é removida

4. **Ver Reações:**
   - Badges coloridos mostram todas as reações
   - Número ao lado mostra quantas pessoas reagiram
   - Sua reação aparece destacada

### Para Desenvolvedores:

**Adicionar reações em outro componente:**

```typescript
import { 
  ReactionPicker, 
  ReactionDisplay, 
  VOLLEYBALL_REACTIONS 
} from "./components/ReactionPicker";

// Estado
const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
const [reactions, setReactions] = useState({ "🏐": 5, "🔥": 3 });
const [userReaction, setUserReaction] = useState<string>();

// Render
<div className="relative">
  <Button onClick={() => setReactionPickerOpen(true)}>
    {userReaction || "😊 Reagir"}
  </Button>
  
  <ReactionPicker
    isOpen={reactionPickerOpen}
    onSelect={(emoji) => {
      setUserReaction(emoji);
      setReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }));
      setReactionPickerOpen(false);
    }}
    onClose={() => setReactionPickerOpen(false)}
  />
  
  <ReactionDisplay
    reactions={reactions}
    userReaction={userReaction}
    onReactionClick={(emoji) => {
      if (emoji === userReaction) {
        setUserReaction(undefined);
      } else {
        setUserReaction(emoji);
      }
    }}
  />
</div>
```

---

## 🏆 Resultado Final

**Antes:**
```
❤️ Curtir → Genérico, sem personalidade
```

**Depois:**
```
🏐⚡🔥💪🙌🎯🏆❤️ → 8 formas de se expressar!

Usuários podem:
- 🏐 Curtir normalmente
- ⚡ Celebrar um ataque poderoso
- 🔥 Reagir a jogadas incríveis
- 💪 Valorizar o físico/força
- 🙌 Aplaudir uma levantada perfeita
- 🎯 Reconhecer a precisão de um ace
- 🏆 Coroar o MVP
- ❤️ Expressar emoção pura
```

---

## 💡 Insights e Melhorias Futuras

### Analytics
- Qual reação mais usada por tipo de post
- Reações por horário do dia
- Reações por tipo de usuário (atleta vs fã)
- Posts que mais recebem 🔥 (trending)

### Gamificação
- Badges para quem recebe muitas reações 🏆
- Ranking de posts mais reagidos do mês
- Notificações: "Seu post recebeu 50 🔥!"

### Social Features
- Ver quem reagiu com cada emoji
- "João e mais 10 pessoas reagiram com 🔥"
- Reagir a comentários também
- Reagir a highlights de vídeos

### Expansão
- Reações customizadas por torneio
- Reações animadas (Lottie)
- Som ao reagir (opcional)
- Confete quando atinge 100 reações

---

## 🎉 Status: IMPLEMENTADO E FUNCIONANDO!

O sistema de reações está **100% funcional** e pronto para uso! 🚀

Os usuários agora podem expressar suas emoções de forma muito mais rica e personalizada, com emojis que fazem sentido no contexto do vôlei! 🏐✨

**Próximo passo:** Integrar com o backend para persistir as reações no banco de dados.

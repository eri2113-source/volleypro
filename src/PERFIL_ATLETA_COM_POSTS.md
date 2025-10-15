# 📱 Perfil do Atleta - Aba de Postagens Implementada

## ✨ Atualização Realizada

Adicionei uma **aba de Postagens** no perfil do atleta que é exibida quando o usuário clica em "Ver Perfil" na página Athletes ou Vitrine.

## 🔄 Fluxo Completo

### **1. Clique em "Ver Perfil"**

#### **Na página Athletes:**
```tsx
<Button onClick={() => onSelectAthlete(athlete.id)}>
  Ver Perfil
</Button>
```

#### **Na página Showcase (Vitrine):**
```tsx
<Button onClick={() => onSelectAthlete(athlete.id)}>
  Ver Perfil
</Button>
```

### **2. App.tsx Detecta a Seleção**
```tsx
if (selectedAthlete !== null) {
  return <AthleteProfile athleteId={selectedAthlete} onBack={() => setSelectedAthlete(null)} />;
}
```

### **3. AthleteProfile Carrega e Exibe**
```tsx
<Tabs defaultValue="posts">
  <TabsList>
    <TabsTrigger value="posts">Postagens</TabsTrigger>
    <TabsTrigger value="panel">Painel</TabsTrigger>
    <TabsTrigger value="stats">Estatísticas</TabsTrigger>
    <TabsTrigger value="achievements">Conquistas</TabsTrigger>
    <TabsTrigger value="gallery">Galeria</TabsTrigger>
  </TabsList>
  
  <TabsContent value="posts">
    {/* Postagens do atleta */}
  </TabsContent>
</Tabs>
```

## 📐 Design da Aba de Postagens

### **Estrutura de um Post:**

```
┌─────────────────────────────────────┐
│ [Avatar] Nome do Atleta ✓           │
│          Há 2 horas                 │
├─────────────────────────────────────┤
│                                     │
│ Texto da postagem...                │
│                                     │
├─────────────────────────────────────┤
│ ❤️ 45 curtidas                      │
│ 💬 12 comentários                   │
│ 🔄 3 compartilhamentos              │
├─────────────────────────────────────┤
│ [Curtir] [Comentar] [Compartilhar]  │
└─────────────────────────────────────┘
```

### **Componentes Utilizados:**

1. **Card** - Wrapper do post
2. **CardHeader** - Avatar, nome e tempo
3. **CardContent** - Conteúdo e ações
4. **Avatar** - Foto do atleta
5. **Badge** - Badge verificado
6. **Button** - Ações (curtir, comentar, compartilhar)
7. **Icons** - Heart, MessageCircle, Share2

## 🎨 Elementos Visuais

### **1. Cabeçalho do Post**
```tsx
<CardHeader>
  <div className="flex items-start gap-3">
    <Avatar>
      <AvatarImage src={athlete.photoUrl} alt={athlete.name} />
      <AvatarFallback>
        {athlete.name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{athlete.name}</span>
        {athlete.verified && (
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">Há 2 horas</p>
    </div>
  </div>
</CardHeader>
```

**Elementos:**
- Avatar do atleta (usa foto ou iniciais)
- Nome com badge verificado (se aplicável)
- Tempo relativo ("Há 2 horas", "Há 1 dia")

### **2. Conteúdo do Post**
```tsx
<p>Treinamento intenso hoje! Focando em saque e bloqueio para o próximo jogo 🏐💪</p>
```

**Características:**
- Texto simples e claro
- Suporta emojis
- Quebra de linha automática

### **3. Estatísticas do Post**
```tsx
<div className="flex items-center gap-6 pt-4 border-t text-sm text-muted-foreground">
  <div className="flex items-center gap-2">
    <Heart className="h-4 w-4" />
    <span>45 curtidas</span>
  </div>
  <div className="flex items-center gap-2">
    <MessageCircle className="h-4 w-4" />
    <span>12 comentários</span>
  </div>
  <div className="flex items-center gap-2">
    <Share2 className="h-4 w-4" />
    <span>3 compartilhamentos</span>
  </div>
</div>
```

**Métricas:**
- ❤️ Curtidas
- 💬 Comentários
- 🔄 Compartilhamentos

### **4. Botões de Ação**
```tsx
<div className="flex gap-2 pt-2 border-t">
  <Button variant="ghost" size="sm" className="flex-1">
    <Heart className="h-4 w-4 mr-2" />
    Curtir
  </Button>
  <Button variant="ghost" size="sm" className="flex-1">
    <MessageCircle className="h-4 w-4 mr-2" />
    Comentar
  </Button>
  <Button variant="ghost" size="sm" className="flex-1">
    <Share2 className="h-4 w-4 mr-2" />
    Compartilhar
  </Button>
</div>
```

**Características:**
- 3 botões lado a lado
- Tamanho igual (flex-1)
- Ícones + texto
- Variant ghost (transparente)

## 📊 Ordem das Abas

### **Nova Ordem (Postagens em Primeiro):**
1. **Postagens** ⬅️ PADRÃO
2. Painel
3. Estatísticas
4. Conquistas
5. Galeria

### **Por que "Postagens" é a primeira aba?**
✅ É o conteúdo mais dinâmico e atualizado
✅ Usuários querem ver atividade recente
✅ Similar a Instagram, Facebook, Twitter
✅ Aumenta engajamento

## 🔧 Implementação Técnica

### **1. Novos Imports**
```tsx
import { 
  MessageCircle,  // Ícone de comentário
  Share2,         // Ícone de compartilhar
  Bookmark        // Ícone de salvar (reserva)
} from "lucide-react";
```

### **2. Mudança na Aba Padrão**
```tsx
// ANTES
<Tabs defaultValue="panel">

// DEPOIS
<Tabs defaultValue="posts">
```

### **3. Nova TabsContent**
```tsx
<TabsContent value="posts" className="space-y-6">
  {/* Posts aqui */}
</TabsContent>
```

## 📱 Posts de Exemplo

### **Post 1: Treino**
```tsx
{
  author: athlete.name,
  verified: athlete.verified,
  time: "Há 2 horas",
  content: "Treinamento intenso hoje! Focando em saque e bloqueio para o próximo jogo 🏐💪",
  likes: 45,
  comments: 12,
  shares: 3
}
```

### **Post 2: Agradecimento**
```tsx
{
  author: athlete.name,
  verified: athlete.verified,
  time: "Há 1 dia",
  content: "Que jogo incrível! Obrigado a todos que estiveram presentes torcendo por nós 🙏🏐 A energia da torcida fez toda a diferença!",
  likes: 128,
  comments: 24,
  shares: 8
}
```

## 🚀 Próximos Passos (Integração com API)

### **1. Criar Endpoint no Backend**

No arquivo `/supabase/functions/server/index.tsx`, adicionar:

```tsx
// Rota para buscar posts de um usuário específico
app.get('/make-server-0ea22bba/users/:userId/posts', async (c) => {
  const userId = c.req.param('userId');
  
  try {
    // Buscar posts do KV store
    const posts = await kv.getByPrefix(`post:user:${userId}`);
    
    return c.json({ posts: posts || [] });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});
```

### **2. Adicionar Método na API**

No arquivo `/lib/api.ts`, adicionar:

```tsx
export const postApi = {
  // ... métodos existentes ...
  
  async getUserPosts(userId: string) {
    return apiCall(`/users/${userId}/posts`);
  },
};
```

### **3. Atualizar AthleteProfile**

```tsx
// No início do componente
const [posts, setPosts] = useState<any[]>([]);
const [loadingPosts, setLoadingPosts] = useState(true);

// Carregar posts do atleta
useEffect(() => {
  loadAthletePosts();
}, [athleteId]);

async function loadAthletePosts() {
  setLoadingPosts(true);
  try {
    const { posts: userPosts } = await postApi.getUserPosts(athleteId.toString());
    setPosts(userPosts || []);
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    setPosts([]);
  } finally {
    setLoadingPosts(false);
  }
}
```

### **4. Renderizar Posts Reais**

```tsx
<TabsContent value="posts" className="space-y-6">
  {loadingPosts ? (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground mt-4">Carregando postagens...</p>
    </div>
  ) : posts.length === 0 ? (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="h-8 w-8 text-muted-foreground mb-4" />
        <h3>Nenhuma postagem ainda</h3>
        <p className="text-muted-foreground">
          Este atleta ainda não fez nenhuma publicação
        </p>
      </CardContent>
    </Card>
  ) : (
    posts.map((post) => (
      <Card key={post.id}>
        {/* Renderizar post real */}
      </Card>
    ))
  )}
</TabsContent>
```

## 🎯 Funcionalidades Futuras

### **1. Curtir Post**
```tsx
async function handleLike(postId: string) {
  try {
    await postApi.likePost(postId);
    // Atualizar contador de curtidas
    loadAthletePosts();
  } catch (error) {
    toast.error('Erro ao curtir post');
  }
}
```

### **2. Comentar Post**
```tsx
async function handleComment(postId: string, content: string) {
  try {
    await postApi.createComment(postId, content);
    toast.success('Comentário adicionado!');
    loadAthletePosts();
  } catch (error) {
    toast.error('Erro ao comentar');
  }
}
```

### **3. Compartilhar Post**
```tsx
async function handleShare(post: any) {
  try {
    if (navigator.share) {
      await navigator.share({
        title: `Post de ${athlete.name}`,
        text: post.content,
        url: window.location.href
      });
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
}
```

### **4. Filtros**
```tsx
<div className="flex gap-2 mb-4">
  <Button 
    variant={filter === 'all' ? 'default' : 'outline'} 
    onClick={() => setFilter('all')}
  >
    Todos
  </Button>
  <Button 
    variant={filter === 'photos' ? 'default' : 'outline'} 
    onClick={() => setFilter('photos')}
  >
    Fotos
  </Button>
  <Button 
    variant={filter === 'videos' ? 'default' : 'outline'} 
    onClick={() => setFilter('videos')}
  >
    Vídeos
  </Button>
</div>
```

### **5. Scroll Infinito**
```tsx
import { useInView } from 'react-intersection-observer';

const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasMore && !loadingMore) {
    loadMorePosts();
  }
}, [inView]);
```

## 📊 Estrutura de Dados Sugerida

### **Post Object:**
```typescript
interface Post {
  id: string;
  userId: string;
  content: string;
  mediaType?: 'image' | 'video' | null;
  mediaUrl?: string | null;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    verified: boolean;
    photoUrl?: string;
  };
  isLiked?: boolean;  // Se o usuário atual curtiu
  isSaved?: boolean;  // Se o usuário atual salvou
}
```

## ✅ Checklist de Implementação

### **Fase 1: UI (Concluída ✅)**
- [x] Adicionar ícones (MessageCircle, Share2)
- [x] Criar aba "Postagens"
- [x] Tornar "Postagens" a aba padrão
- [x] Adicionar posts de exemplo
- [x] Criar layout de post com avatar
- [x] Adicionar estatísticas (curtidas, comentários, shares)
- [x] Adicionar botões de ação
- [x] Documentar implementação

### **Fase 2: Backend (Pendente 🔄)**
- [ ] Criar endpoint `/users/:userId/posts`
- [ ] Implementar lógica de busca no KV store
- [ ] Adicionar paginação
- [ ] Implementar ordenação (mais recentes primeiro)
- [ ] Adicionar cache

### **Fase 3: Integração (Pendente 🔄)**
- [ ] Adicionar `getUserPosts()` na API
- [ ] Criar estado `posts` no AthleteProfile
- [ ] Carregar posts reais
- [ ] Adicionar loading state
- [ ] Adicionar empty state
- [ ] Tratar erros

### **Fase 4: Interatividade (Pendente 🔄)**
- [ ] Implementar curtir
- [ ] Implementar comentar
- [ ] Implementar compartilhar
- [ ] Adicionar modal de comentários
- [ ] Implementar scroll infinito
- [ ] Adicionar filtros

## 🎊 Resultado Atual

Quando o usuário clica em **"Ver Perfil"** em qualquer atleta:

1. ✅ Abre o perfil completo do atleta
2. ✅ Mostra a aba "Postagens" por padrão
3. ✅ Exibe posts de exemplo com layout profissional
4. ✅ Mostra estatísticas (curtidas, comentários, shares)
5. ✅ Tem botões de ação prontos para implementação futura

### **Próximo passo:**
Implementar o backend para buscar posts reais do banco de dados!

---

**Versão:** 6.0 - Perfil com Postagens  
**Data:** 2025-01-14  
**Status:** ✅ UI Implementada | 🔄 Backend Pendente  
**Impacto:** Perfil mais dinâmico e engajador

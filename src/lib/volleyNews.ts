// Posts informativos sobre vôlei brasileiro e mundial
// Conteúdo temporário para entreter usuários enquanto o Feed é populado

export interface NewsPost {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  category: 'noticia' | 'curiosidade' | 'estatistica' | 'historia' | 'destaque';
  tags: string[];
  createdAt: string;
}

// DADOS FAKE REMOVIDOS - Sistema agora trabalha apenas com posts reais de usuários
export const VOLLEYBALL_NEWS: NewsPost[] = [];

export function getCategoryLabel(category: NewsPost['category']): string {
  const labels: Record<NewsPost['category'], string> = {
    noticia: '📰 Notícia',
    curiosidade: '💡 Curiosidade',
    estatistica: '📊 Estatísticas',
    historia: '📚 História',
    destaque: '⭐ Destaque',
  };
  return labels[category];
}

export function getCategoryColor(category: NewsPost['category']): string {
  const colors: Record<NewsPost['category'], string> = {
    noticia: 'bg-blue-500',
    curiosidade: 'bg-yellow-500',
    estatistica: 'bg-green-500',
    historia: 'bg-purple-500',
    destaque: 'bg-orange-500',
  };
  return colors[category];
}

// Função para embaralhar e pegar N posts aleatórios
export function getRandomNews(count: number = 5): NewsPost[] {
  const shuffled = [...VOLLEYBALL_NEWS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Função para formatar posts de notícias como posts do Feed
export function formatNewsAsPost(news: NewsPost) {
  return {
    id: news.id,
    content: news.content,
    authorName: 'VolleyPro Notícias',
    authorPhotoUrl: null,
    likes: Math.floor(Math.random() * 50) + 10, // 10-60 likes
    comments: Math.floor(Math.random() * 15) + 2, // 2-17 comentários
    shares: Math.floor(Math.random() * 8) + 1, // 1-9 compartilhamentos
    createdAt: news.createdAt,
    mediaUrl: news.mediaUrl,
    mediaType: news.mediaType,
    verified: true,
    isOfficial: true, // Flag para identificar posts oficiais
    category: news.category,
    tags: news.tags,
  };
}

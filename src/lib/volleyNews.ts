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

export const VOLLEYBALL_NEWS: NewsPost[] = [
  // Notícias Atuais
  {
    id: 'news-1',
    content: '🏐 BRASIL DOMINA O VÔLEI MUNDIAL! A Seleção Brasileira Feminina conquistou sua 3ª medalha de ouro olímpica consecutiva, consolidando o país como potência absoluta do esporte! 🥇🇧🇷',
    category: 'noticia',
    tags: ['seleção', 'olimpiadas', 'brasil'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
  },
  {
    id: 'news-2',
    content: '⚡ GABI COMPLETOU 1000 PONTOS NA LIGA DAS NAÇÕES! A ponteira brasileira alcançou a marca histórica e se consolida como uma das maiores atacantes do vôlei mundial. Que jogadora! 💪🔥',
    category: 'destaque',
    tags: ['gabi', 'vnl', 'recorde'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h atrás
  },
  {
    id: 'news-3',
    content: '🏆 SUPERLIGA 24/25 ESTÁ DE VOLTA! A maior competição de vôlei das américas começa em breve com times renovados e muitas promessas. Quem vai levar o título este ano?',
    category: 'noticia',
    tags: ['superliga', 'brasil', 'campeonato'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h atrás
  },

  // Curiosidades
  {
    id: 'curiosity-1',
    content: '💡 VOCÊ SABIA? O Brasil é o único país do mundo a ter conquistado todas as medalhas possíveis no vôlei olímpico (ouro, prata e bronze) tanto no masculino quanto no feminino! 🥇🥈🥉',
    category: 'curiosidade',
    tags: ['olimpiadas', 'brasil', 'historia'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h atrás
  },
  {
    id: 'curiosity-2',
    content: '🤯 O saque mais rápido já registrado no vôlei profissional foi de 135 km/h, feito pelo búlgaro Matey Kaziyski! No Brasil, Wallace já registrou saques acima de 125 km/h! ⚡',
    category: 'curiosidade',
    tags: ['saque', 'velocidade', 'recorde'],
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18h atrás
  },
  {
    id: 'curiosity-3',
    content: '🏐 ORIGEM DO NOME: "Vôlei" vem de "Volleyball" em inglês, que significa "bola no vôlei" ou "bola voadora". O esporte foi criado em 1895 por William G. Morgan nos EUA como alternativa menos intensa ao basquete!',
    category: 'curiosidade',
    tags: ['historia', 'origem'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
  },

  // Estatísticas
  {
    id: 'stat-1',
    content: '📊 NÚMEROS IMPRESSIONANTES: Em média, um jogador de vôlei profissional salta cerca de 300 vezes por partida! Isso equivale a subir um prédio de 30 andares! 🏢💪',
    category: 'estatistica',
    tags: ['estatisticas', 'fisico'],
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 1.25 dias atrás
  },
  {
    id: 'stat-2',
    content: '🎯 PRECISÃO BRASILEIRA: A Seleção Brasileira Feminina tem 89% de aproveitamento em recepção de saque na Liga das Nações 2024, a melhor marca do campeonato! 🇧🇷✨',
    category: 'estatistica',
    tags: ['brasil', 'vnl', 'estatisticas'],
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 dias atrás
  },
  {
    id: 'stat-3',
    content: '⚡ ATAQUE PODEROSO: A média de pontos por set na Superliga Masculina é de 25.7 pontos, sendo que 45% vêm de ataques, 20% de bloqueios, 15% de saques e 20% de erros adversários!',
    category: 'estatistica',
    tags: ['superliga', 'estatisticas'],
    createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(), // 1.75 dias atrás
  },

  // História
  {
    id: 'history-1',
    content: '🏅 PRIMEIRA MEDALHA OLÍMPICA: O Brasil conquistou sua primeira medalha olímpica no vôlei em 1984 (prata masculina em Los Angeles). Desde então, já são 12 medalhas olímpicas no total! 🇧🇷🥇',
    category: 'historia',
    tags: ['olimpiadas', 'historia', 'brasil'],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
  },
  {
    id: 'history-2',
    content: '👑 GERAÇÃO DE OURO: Bernardinho comandou a Seleção Masculina por 16 anos (2001-2017), conquistando 2 ouros olímpicos, 3 mundiais e 8 Ligas Mundiais. Uma das maiores dinastias do esporte! 🏆',
    category: 'historia',
    tags: ['bernardinho', 'selecao', 'historia'],
    createdAt: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(), // 2.25 dias atrás
  },
  {
    id: 'history-3',
    content: '🌟 ANA MOSER: Pioneira do vôlei feminino brasileiro, Ana Moser foi 2x medalhista olímpica (bronze em 1996 e 2000) e é considerada uma das maiores jogadoras da história! Hoje é dirigente esportiva! 💪',
    category: 'historia',
    tags: ['ana moser', 'historia', 'feminino'],
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(), // 2.5 dias atrás
  },

  // Destaques
  {
    id: 'highlight-1',
    content: '🔥 DARLAN BRILHA NA ITÁLIA! O levantador brasileiro foi eleito o melhor jogador da rodada no Campeonato Italiano após comandar seu time para uma vitória espetacular! Brasil dominando o mundo! 🇧🇷🇮🇹',
    category: 'destaque',
    tags: ['darlan', 'italia', 'levantador'],
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10h atrás
  },
  {
    id: 'highlight-2',
    content: '💫 ROSAMARIA MONTIBELLER: Eleita melhor ponteira da última Superliga! Com apenas 28 anos, já coleciona títulos importantes e é peça fundamental da Seleção Brasileira! 🏐⭐',
    category: 'destaque',
    tags: ['rosamaria', 'ponteira', 'brasil'],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(), // 15h atrás
  },
  {
    id: 'highlight-3',
    content: '🎯 LUCAS SAATKAMP: O "Lucão" completa 17 anos defendendo a Seleção Brasileira! Campeão olímpico, mundial e de tudo que é possível. Uma lenda viva do vôlei! 👑🇧🇷',
    category: 'destaque',
    tags: ['lucao', 'selecao', 'lenda'],
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20h atrás
  },

  // Notícias Mundiais
  {
    id: 'world-1',
    content: '🌍 POLÔNIA DOMINA O RANKING MUNDIAL! A seleção polonesa masculina lidera o ranking da FIVB, mas o Brasil está logo atrás preparando a revanche! O Mundial será disputadíssimo! 🏐',
    category: 'noticia',
    tags: ['mundial', 'ranking', 'polonia'],
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), // 28h atrás
  },
  {
    id: 'world-2',
    content: '🇹🇷 TURQUIA INVESTE PESADO NO VÔLEI! A liga turca se tornou uma das mais competitivas do mundo, atraindo grandes estrelas brasileiras como Tandara, Natália e outras! O nível é altíssimo! 💰⚡',
    category: 'noticia',
    tags: ['turquia', 'liga', 'mundial'],
    createdAt: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(), // 35h atrás
  },

  // Técnica e Tática
  {
    id: 'tech-1',
    content: '🎓 SISTEMAS TÁTICOS: O sistema 5-1 (5 atacantes e 1 levantador) é o mais usado no vôlei profissional. Permite maior versatilidade ofensiva e melhor distribuição de jogo! 🧠🏐',
    category: 'curiosidade',
    tags: ['tatica', 'tecnica'],
    createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(), // 40h atrás
  },
  {
    id: 'tech-2',
    content: '🛡️ BLOQUEIO PERFEITO: Um bloqueio eficiente depende de timing, leitura do levantador e posicionamento das mãos. Os melhores centrais bloqueiam em média 1.2 pontos por set! 📊',
    category: 'curiosidade',
    tags: ['bloqueio', 'tecnica', 'defesa'],
    createdAt: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(), // 45h atrás
  },

  // Inspiração
  {
    id: 'inspire-1',
    content: '💪 "O vôlei me ensinou que o impossível é apenas uma opinião." - Fernanda Garay, medalhista olímpica e uma das maiores jogadoras brasileiras de todos os tempos! 🏐✨',
    category: 'destaque',
    tags: ['inspiracao', 'fernanda garay'],
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(), // 50h atrás
  },
  {
    id: 'inspire-2',
    content: '🌟 "Talento te leva longe, mas disciplina te leva ao topo." - Bernardinho. Frase que resume a filosofia vencedora que transformou o vôlei brasileiro! 🏆🇧🇷',
    category: 'destaque',
    tags: ['inspiracao', 'bernardinho'],
    createdAt: new Date(Date.now() - 55 * 60 * 60 * 1000).toISOString(), // 55h atrás
  },
];

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

// Templates e inspirações para criação de conteúdo no VolleyPro

export interface PostTemplate {
  id: string;
  title: string;
  category: 'jogo' | 'treino' | 'motivacao' | 'conquista' | 'estatistica' | 'dica' | 'bastidores' | 'convocacao';
  icon: string;
  description: string;
  template: string;
  placeholder: string;
  hashtags: string[];
  color: string;
  examples: string[];
}

export const POST_TEMPLATES: PostTemplate[] = [
  // Resultado de Jogo
  {
    id: 'game-victory',
    title: 'Vitória no Jogo',
    category: 'jogo',
    icon: '🏆',
    description: 'Compartilhe a vitória do seu time',
    template: '🏐 VITÓRIA! [Seu Time] [Placar] [Time Adversário]\n\n[Descreva o jogo e destaque os pontos altos]\n\n#VolleyPro #Vitoria',
    placeholder: 'Ex: Minas Tênis 3x1 Dentil/Praia Clube\n\nQue jogo incrível! Virada épica no terceiro set! 🔥',
    hashtags: ['#VolleyPro', '#Vitoria', '#Volei'],
    color: '#22c55e',
    examples: [
      '🏐 VITÓRIA! Minas 3x1 Osasco\n\nQue partida! Recuperação incrível no 3º set! Carol liderou com 18 pontos. Próximo jogo já é clássico! 💪🏐\n\n#VolleyPro #Vitoria #Superliga',
      '🏆 VENCEMOS! Sesi Bauru 3x0 Goiás\n\nDominação total! Bloqueio funcionou perfeitamente (12 bloqueios). Wallace imparável com 21 pontos! 🔥\n\n#VolleyPro #Vitoria #Volei'
    ]
  },
  
  // Resultado de Treino
  {
    id: 'training',
    title: 'Dia de Treino',
    category: 'treino',
    icon: '💪',
    description: 'Mostre sua dedicação nos treinos',
    template: '💪 TREINO PESADO HOJE!\n\n[O que treinou]\n[Como foi o treino]\n\nFoco em [objetivo]\n\n#VolleyPro #Treino #Foco',
    placeholder: 'Ex: Treino de ataque e bloqueio por 3 horas!\nFoco total na precisão.',
    hashtags: ['#VolleyPro', '#Treino', '#Foco', '#Dedicacao'],
    color: '#f59e0b',
    examples: [
      '💪 TREINO PESADO HOJE!\n\n3 horas de saque e recepção. Batemos 200 saques cada! 🎯\n\nFoco no jogo de sábado contra o Flamengo. Vamos com tudo! 🔥\n\n#VolleyPro #Treino #Foco',
      '🏋️ DIA DE FORÇA!\n\nAcademia + quadra = combinação perfeita\nSalto vertical aumentando 💪\n\nPreparação física é 50% do jogo!\n\n#VolleyPro #Treino #PreparacaoFisica'
    ]
  },
  
  // Motivação
  {
    id: 'motivation',
    title: 'Mensagem Motivacional',
    category: 'motivacao',
    icon: '🔥',
    description: 'Inspire seus seguidores e equipe',
    template: '🔥 [Sua mensagem motivacional]\n\n[Reflexão ou objetivo]\n\n#VolleyPro #Motivacao #Volei',
    placeholder: 'Ex: Cada treino é uma oportunidade de evoluir.\nNão desista dos seus sonhos! 💪',
    hashtags: ['#VolleyPro', '#Motivacao', '#Foco', '#Superacao'],
    color: '#ef4444',
    examples: [
      '🔥 "O impossível é apenas uma opinião."\n\nCada bola defendida, cada ponto conquistado, cada treino pesado... tudo isso constrói campeões! 💪\n\nNunca desista! 🏐\n\n#VolleyPro #Motivacao #Superacao',
      '⚡ A diferença entre o possível e o impossível está na sua VONTADE!\n\nHoje acordei às 5h para treinar.\nAmanhã faço de novo.\nE depois de amanhã também.\n\nÉ assim que se chega ao topo! 🏆\n\n#VolleyPro #Determinacao #Foco'
    ]
  },
  
  // Conquista/Achievement
  {
    id: 'achievement',
    title: 'Conquista Pessoal',
    category: 'conquista',
    icon: '🎯',
    description: 'Celebre suas conquistas e marcos',
    template: '🎯 CONQUISTA DESBLOQUEADA!\n\n[Sua conquista]\n\n[Como chegou até aqui]\n\nGrato(a) a [agradecimentos]\n\n#VolleyPro #Conquista',
    placeholder: 'Ex: 100 jogos pela Seleção! 🇧🇷\nJornada incrível até aqui!',
    hashtags: ['#VolleyPro', '#Conquista', '#Milestone'],
    color: '#a855f7',
    examples: [
      '🎯 CONQUISTA DESBLOQUEADA!\n\n1000 PONTOS NA CARREIRA! 🏐\n\nSão anos de dedicação, suor e muita paixão pelo vôlei. Cada ponto tem uma história especial.\n\nGrato à minha família, técnicos e companheiros de equipe! 🙏\n\n#VolleyPro #Milestone #1000Pontos',
      '🏆 MEU PRIMEIRO TÍTULO PROFISSIONAL!\n\nCampeão da Copa Brasil! Ainda não acredito! 😭🏐\n\nTodo o sacrifício valeu a pena. Obrigado time, você foi SENSACIONAL! 💪\n\n#VolleyPro #Campeao #CopaBrasil'
    ]
  },
  
  // Estatísticas
  {
    id: 'statistics',
    title: 'Números do Jogo',
    category: 'estatistica',
    icon: '📊',
    description: 'Compartilhe estatísticas impressionantes',
    template: '📊 NÚMEROS DO JOGO:\n\n[Estatísticas]\n\n[Análise breve]\n\n#VolleyPro #Stats',
    placeholder: 'Ex: 25 pontos | 65% de ataque | 8 bloqueios\nMelhor partida da temporada!',
    hashtags: ['#VolleyPro', '#Stats', '#Numeros'],
    color: '#3b82f6',
    examples: [
      '📊 NÚMEROS DO JOGO:\n\n⚡ 28 pontos\n🎯 72% de eficiência no ataque\n🛡️ 6 bloqueios\n💪 3 aces\n\nMelhor performance individual da temporada! Mas o importante foi a VITÓRIA! 🏆\n\n#VolleyPro #Stats #Performance',
      '📊 ESTATÍSTICAS ABSURDAS DO JOGO:\n\n🏐 Time: 15 bloqueios\n⚡ 58% de ataque\n🎯 95% de recepção\n\nEsse é o vôlei que a gente gosta! Defesa impecável! 🛡️\n\n#VolleyPro #Defesa #Stats'
    ]
  },
  
  // Dica Técnica
  {
    id: 'tip',
    title: 'Dica Técnica',
    category: 'dica',
    icon: '💡',
    description: 'Compartilhe conhecimento técnico',
    template: '💡 DICA DO DIA:\n\n[Fundamento/Técnica]\n\n[Explicação e dica]\n\n#VolleyPro #Dica #Tecnica',
    placeholder: 'Ex: Dica para melhorar o saque:\nFoco no movimento do braço e timing!',
    hashtags: ['#VolleyPro', '#Dica', '#Tecnica', '#Fundamentos'],
    color: '#eab308',
    examples: [
      '💡 DICA DO DIA: Saque Viagem\n\n🎯 Segredo: Bater na bola SECA, sem efeito\n⚡ A bola flutua e engana o recebedor\n💪 Foco no timing do braço\n\nTreinem! Esse saque ganha muitos pontos! 🏐\n\n#VolleyPro #Dica #Saque',
      '💡 DICA PARA PONTEIROS:\n\n🏐 Ataque de fundo é sobre TIMING, não força\n⏱️ Espere a bola chegar\n👀 Leia o bloqueio\n⚡ Execute com precisão\n\nPotência vem do movimento completo! 💪\n\n#VolleyPro #Dica #Ataque'
    ]
  },
  
  // Bastidores
  {
    id: 'behind-scenes',
    title: 'Bastidores',
    category: 'bastidores',
    icon: '🎬',
    description: 'Mostre os bastidores do vôlei',
    template: '🎬 BASTIDORES:\n\n[O que está acontecendo]\n\n[Contexto divertido ou interessante]\n\n#VolleyPro #Bastidores',
    placeholder: 'Ex: Concentração antes do jogo decisivo!\nEquipe focada e confiante! 💪',
    hashtags: ['#VolleyPro', '#Bastidores', '#Volei'],
    color: '#ec4899',
    examples: [
      '🎬 BASTIDORES: Aquecimento pré-jogo\n\nAquela energia antes de entrar em quadra! ⚡\nTime concentrado, música rolando, clima pesado! 🔥\n\nDaqui a pouco é GUERRA! 🏐💪\n\n#VolleyPro #Bastidores #PreJogo',
      '🎬 VIAGEM DE ÔNIBUS\n\n8 horas de estrada = campeonato de truco infinito 😂\n\nNinguém aguenta mais o Robertão ganhando!\n\nJogo amanhã, mas hoje a diversão é garantida! 🚌🏐\n\n#VolleyPro #Bastidores #Viagem'
    ]
  },
  
  // Convocação
  {
    id: 'call-up',
    title: 'Convocação/Convite',
    category: 'convocacao',
    icon: '📢',
    description: 'Anuncie convocações ou convites',
    template: '📢 [Tipo de convocação]!\n\n[Detalhes]\n\n[Sentimento/Objetivo]\n\n#VolleyPro #Convocacao',
    placeholder: 'Ex: CONVOCADO para a Seleção! 🇧🇷\nSonho realizado! Vamos buscar o ouro!',
    hashtags: ['#VolleyPro', '#Convocacao', '#SelecaoBrasileira'],
    color: '#10b981',
    examples: [
      '📢 CONVOCADO PARA A SELEÇÃO BRASILEIRA! 🇧🇷\n\nNão tenho palavras para descrever esse momento! Sonho desde criança! 😭🏐\n\nVou representar nosso país com muita HONRA e GARRA! Vamos buscar o título! 🏆💪\n\n#VolleyPro #SelecaoBrasileira #Convocacao',
      '📢 NOVO DESAFIO!\n\nAssinei com o Minas Tênis Clube! 🏐⭐\n\nFeliz demais por fazer parte desse time gigante! Vamos brigar por todos os títulos! 🏆\n\nObrigado à diretoria pela confiança! 💛🖤\n\n#VolleyPro #NovoTime #Minas'
    ]
  },
];

export const CONTENT_IDEAS = [
  {
    category: '🏐 Sobre Jogos',
    ideas: [
      'Compartilhe o placar e destaque da partida',
      'Poste uma foto do momento decisivo',
      'Agradeça à torcida pelo apoio',
      'Analise taticamente o jogo',
      'Destaque o MVP da partida',
      'Celebre uma virada épica',
    ]
  },
  {
    category: '💪 Sobre Treinos',
    ideas: [
      'Mostre sua rotina de treinos',
      'Compartilhe exercícios específicos',
      'Fale sobre preparação física',
      'Destaque evolução técnica',
      'Poste treino com companheiros',
      'Mostre treino de fundamentos',
    ]
  },
  {
    category: '🎯 Conquistas',
    ideas: [
      'Celebre títulos conquistados',
      'Marcos pessoais (100 jogos, 1000 pontos)',
      'Prêmios individuais',
      'Recordes batidos',
      'Convocações para seleção',
      'Renovação de contrato',
    ]
  },
  {
    category: '🔥 Motivação',
    ideas: [
      'Frases inspiradoras',
      'História de superação',
      'Objetivo para a temporada',
      'Mensagem para jovens atletas',
      'Reflexão sobre dedicação',
      'Agradecer apoio da família',
    ]
  },
  {
    category: '💡 Educativo',
    ideas: [
      'Dica técnica de fundamentos',
      'Explicar uma tática',
      'Ensinar uma jogada',
      'Falar sobre posicionamento',
      'Dicas de aquecimento',
      'Importância da alimentação',
    ]
  },
  {
    category: '🎬 Bastidores',
    ideas: [
      'Concentração pré-jogo',
      'Viagens com o time',
      'Momento engraçado no treino',
      'Rotina no dia do jogo',
      'Vestiário após vitória',
      'Hotel com a equipe',
    ]
  },
];

export const HASHTAG_SUGGESTIONS = {
  geral: ['#VolleyPro', '#Volei', '#Volleyball', '#Brasil'],
  competicoes: ['#Superliga', '#LigaDasNacoes', '#VNL', '#Mundial', '#Olimpiadas'],
  times: ['#Minas', '#Sesi', '#Praia', '#Flamengo', '#Sesc', '#Osasco', '#Dentil'],
  fundamentos: ['#Ataque', '#Bloqueio', '#Saque', '#Levantada', '#Defesa', '#Recepção'],
  inspiracao: ['#Motivacao', '#Foco', '#Dedicacao', '#Superacao', '#Determinacao'],
  treino: ['#Treino', '#PreparacaoFisica', '#Academia', '#Fundamentos'],
};

export function getTemplatesByCategory(category: PostTemplate['category']): PostTemplate[] {
  return POST_TEMPLATES.filter(t => t.category === category);
}

export function getRandomTemplate(): PostTemplate {
  return POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)];
}

export function getTemplateById(id: string): PostTemplate | undefined {
  return POST_TEMPLATES.find(t => t.id === id);
}

export const POST_TIPS = [
  '📸 Posts com fotos recebem 3x mais engajamento!',
  '🎬 Vídeos de jogadas incríveis viralizam facilmente!',
  '#️⃣ Use 3-5 hashtags relevantes em cada post',
  '⏰ Poste após jogos enquanto está quente!',
  '💬 Responda comentários para aumentar engajamento',
  '🏐 Mencione companheiros de equipe nos posts',
  '🎯 Seja autêntico - mostre sua personalidade!',
  '📊 Compartilhe suas estatísticas impressionantes',
  '🔥 Use emojis para tornar posts mais visuais',
  '💪 Inspire outros atletas com sua jornada!',
];

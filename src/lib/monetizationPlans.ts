/**
 * Sistema de Monetização VolleyPro
 * Planos de assinatura e cotas de publicidade
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing: 'monthly' | 'yearly';
  yearlyDiscount?: number;
  color: string;
  icon: string;
  popular?: boolean;
  features: string[];
  athleteFeatures?: string[];
  teamFeatures?: string[];
  limits: {
    posts: number | 'unlimited';
    photos: number | 'unlimited';
    videos: number | 'unlimited';
    lives: number | 'unlimited';
    storage: string;
    analytics: boolean;
    verification: boolean;
    sponsorships: boolean;
    monetization: boolean;
    adsRemoval: boolean;
    customProfile: boolean;
    prioritySupport: boolean;
  };
}

export interface AdvertisingQuota {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // dias
  color: string;
  icon: string;
  popular?: boolean;
  features: string[];
  placements: {
    feedBanner: boolean;
    sidebarBanner: boolean;
    storiesSponsored: boolean;
    liveStreamAds: boolean;
    tournamentSponsorship: boolean;
    athleteSponsorship: boolean;
    highlightPost: boolean;
    emailNewsletter: boolean;
  };
  impressions: {
    min: number;
    max: number;
  };
  ctr: string; // Click Through Rate estimado
  roi: string; // Retorno sobre investimento estimado
}

// ===============================================
// PLANOS DE ASSINATURA
// ===============================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Para iniciantes que querem explorar o VolleyPro',
    price: 0,
    billing: 'monthly',
    color: '#64748b',
    icon: '🆓',
    features: [
      'Perfil básico',
      'Feed de notícias',
      'Seguir atletas e times',
      '10 posts por mês',
      '5 fotos por semana',
      '1 vídeo por semana',
      'Participar de torneios',
      'Comentar e reagir',
      'Mensagens básicas',
      '500MB de armazenamento',
    ],
    limits: {
      posts: 10,
      photos: 5,
      videos: 1,
      lives: 0,
      storage: '500MB',
      analytics: false,
      verification: false,
      sponsorships: false,
      monetization: false,
      adsRemoval: false,
      customProfile: false,
      prioritySupport: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para atletas e times que levam o vôlei a sério',
    price: 19.90,
    billing: 'monthly',
    yearlyDiscount: 20, // 20% desconto no anual
    color: '#0066ff',
    icon: '⭐',
    popular: true,
    features: [
      'Tudo do plano Free',
      'Badge PRO no perfil',
      'Posts ilimitados',
      'Fotos ilimitadas',
      '10 vídeos por semana',
      '2 lives por semana',
      'Analytics básico',
      'Perfil personalizado',
      'Sem anúncios',
      '5GB de armazenamento',
      'Destaque em buscas',
      'Suporte prioritário',
    ],
    athleteFeatures: [
      'Vitrine de jogadores destacada',
      'Estatísticas detalhadas',
      'Histórico de conquistas',
      'Certificado digital',
    ],
    teamFeatures: [
      'Gestão de elenco completa',
      'Convocações ilimitadas',
      'Torneios destacados',
      'Logo personalizado',
    ],
    limits: {
      posts: 'unlimited',
      photos: 'unlimited',
      videos: 10,
      lives: 2,
      storage: '5GB',
      analytics: true,
      verification: false,
      sponsorships: false,
      monetization: false,
      adsRemoval: true,
      customProfile: true,
      prioritySupport: true,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para profissionais que querem se destacar',
    price: 49.90,
    billing: 'monthly',
    yearlyDiscount: 25,
    color: '#8b5cf6',
    icon: '💎',
    features: [
      'Tudo do plano Pro',
      'Badge PREMIUM verificado',
      'Vídeos ilimitados',
      'Lives ilimitadas',
      'Analytics avançado',
      'Monetização habilitada',
      'Ganhe com patrocínios',
      'Página de patrocinadores',
      '20GB de armazenamento',
      'Transmissão em HD',
      'Chat exclusivo VIP',
      'Suporte 24/7',
    ],
    athleteFeatures: [
      'Selo de verificação',
      'Monetização por lives',
      'Patrocínios destacados',
      'Comissão de 70% em vendas',
      'Loja virtual integrada',
      'Consultoria de carreira',
    ],
    teamFeatures: [
      'Patrocínios gerenciados',
      'Dashboard de receitas',
      'Sistema de sócios-torcedores',
      'Bilheteria digital',
      'Transmissões profissionais',
      'Marketing automatizado',
    ],
    limits: {
      posts: 'unlimited',
      photos: 'unlimited',
      videos: 'unlimited',
      lives: 'unlimited',
      storage: '20GB',
      analytics: true,
      verification: true,
      sponsorships: true,
      monetization: true,
      adsRemoval: true,
      customProfile: true,
      prioritySupport: true,
    },
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Para organizações e atletas de alto nível',
    price: 99.90,
    billing: 'monthly',
    yearlyDiscount: 30,
    color: '#f59e0b',
    icon: '👑',
    features: [
      'Tudo do plano Premium',
      'Badge ELITE exclusivo',
      'Armazenamento ilimitado',
      'Transmissão 4K',
      'Analytics em tempo real',
      'API de integração',
      'White label opcional',
      'Gerente de conta dedicado',
      'Consultoria estratégica',
      'Marketing personalizado',
      'Eventos exclusivos',
      'Networking VIP',
    ],
    athleteFeatures: [
      'Selo dourado verificado',
      'Comissão de 80% em vendas',
      'Agente digital IA',
      'Análise de performance IA',
      'Networking com marcas',
      'Contratos facilitados',
      'Assessoria jurídica',
      'Planejamento financeiro',
    ],
    teamFeatures: [
      'Sistema completo de gestão',
      'CRM de torcedores',
      'E-commerce profissional',
      'App personalizado',
      'Múltiplas transmissões simultâneas',
      'Sistema de ingressos',
      'Dashboard executivo',
      'Inteligência de mercado',
    ],
    limits: {
      posts: 'unlimited',
      photos: 'unlimited',
      videos: 'unlimited',
      lives: 'unlimited',
      storage: 'Ilimitado',
      analytics: true,
      verification: true,
      sponsorships: true,
      monetization: true,
      adsRemoval: true,
      customProfile: true,
      prioritySupport: true,
    },
  },
];

// ===============================================
// COTAS DE PUBLICIDADE PARA EMPRESAS
// ===============================================

export const ADVERTISING_QUOTAS: AdvertisingQuota[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal para pequenas empresas e marcas locais',
    price: 299,
    duration: 30,
    color: '#10b981',
    icon: '🚀',
    features: [
      'Banner lateral 300x250px',
      'Até 50.000 impressões/mês',
      '1 post patrocinado no feed',
      'Segmentação por região',
      'Relatório mensal básico',
      'Link direto para seu site',
      'Suporte por email',
    ],
    placements: {
      feedBanner: false,
      sidebarBanner: true,
      storiesSponsored: false,
      liveStreamAds: false,
      tournamentSponsorship: false,
      athleteSponsorship: false,
      highlightPost: true,
      emailNewsletter: false,
    },
    impressions: {
      min: 30000,
      max: 50000,
    },
    ctr: '1.5-2.5%',
    roi: '150-250%',
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Para marcas em crescimento no mercado esportivo',
    price: 799,
    duration: 30,
    color: '#0066ff',
    icon: '📈',
    popular: true,
    features: [
      'Banner lateral + Feed',
      'Até 150.000 impressões/mês',
      '5 posts patrocinados',
      'Stories patrocinados (3/semana)',
      'Segmentação avançada',
      'Relatórios semanais',
      'Dashboard em tempo real',
      'Suporte prioritário',
      'Logo em torneios (1/mês)',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: false,
      tournamentSponsorship: true,
      athleteSponsorship: false,
      highlightPost: true,
      emailNewsletter: false,
    },
    impressions: {
      min: 100000,
      max: 150000,
    },
    ctr: '2.5-4%',
    roi: '250-400%',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para empresas que querem dominar o mercado',
    price: 1999,
    duration: 30,
    color: '#8b5cf6',
    icon: '💼',
    features: [
      'Todos os formatos de banner',
      'Até 500.000 impressões/mês',
      '15 posts patrocinados',
      'Stories ilimitados',
      'Anúncios em lives',
      'Patrocínio de 3 torneios',
      'Patrocínio de 5 atletas',
      'Email marketing (newsletter)',
      'Conteúdo criativo incluso',
      'Gerente de conta dedicado',
      'Relatórios personalizados',
      'A/B testing',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: true,
      tournamentSponsorship: true,
      athleteSponsorship: true,
      highlightPost: true,
      emailNewsletter: true,
    },
    impressions: {
      min: 400000,
      max: 500000,
    },
    ctr: '3.5-5.5%',
    roi: '350-550%',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Soluções completas para grandes marcas',
    price: 4999,
    duration: 30,
    color: '#f59e0b',
    icon: '🏆',
    features: [
      'Presença total na plataforma',
      'Impressões ilimitadas',
      'Posts patrocinados ilimitados',
      'Naming rights de torneios',
      'Patrocínio master de ligas',
      'Patrocínio de até 20 atletas',
      'Campanhas personalizadas',
      'Conteúdo exclusivo produzido',
      'Lives exclusivas da marca',
      'Eventos patrocinados',
      'Integração com CRM',
      'API personalizada',
      'Equipe dedicada',
      'Consultoria estratégica',
      'Relatórios executivos',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: true,
      tournamentSponsorship: true,
      athleteSponsorship: true,
      highlightPost: true,
      emailNewsletter: true,
    },
    impressions: {
      min: 1000000,
      max: 5000000,
    },
    ctr: '5-8%',
    roi: '500-800%',
  },
  {
    id: 'flash',
    name: 'Flash',
    description: 'Campanha rápida de 7 dias para eventos pontuais',
    price: 499,
    duration: 7,
    color: '#ec4899',
    icon: '⚡',
    features: [
      'Banner no feed por 7 dias',
      'Até 100.000 impressões',
      '3 posts em destaque',
      'Stories diários',
      'Segmentação específica',
      'Ideal para eventos',
      'Ativação rápida (24h)',
      'Relatório final completo',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: false,
      tournamentSponsorship: false,
      athleteSponsorship: false,
      highlightPost: true,
      emailNewsletter: false,
    },
    impressions: {
      min: 50000,
      max: 100000,
    },
    ctr: '2-3.5%',
    roi: '200-350%',
  },
];

// ===============================================
// OPÇÕES DE MONETIZAÇÃO PARA ATLETAS
// ===============================================

export interface AthleteMonetizationOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  commission: number; // % que o atleta recebe
  minimumPlan: string; // ID do plano mínimo necessário
  features: string[];
}

export const ATHLETE_MONETIZATION_OPTIONS: AthleteMonetizationOption[] = [
  {
    id: 'lives',
    name: 'Monetização de Lives',
    description: 'Ganhe com transmissões ao vivo',
    icon: '📹',
    color: '#ef4444',
    commission: 70,
    minimumPlan: 'premium',
    features: [
      'Doações durante lives',
      'Assinaturas de espectadores',
      'Super chats destacados',
      'Acesso VIP pago',
      'Replays pagos',
    ],
  },
  {
    id: 'content',
    name: 'Conteúdo Exclusivo',
    description: 'Venda conteúdo premium para fãs',
    icon: '🎬',
    color: '#8b5cf6',
    commission: 75,
    minimumPlan: 'premium',
    features: [
      'Posts exclusivos pagos',
      'Tutoriais e dicas',
      'Bastidores VIP',
      'Treinos personalizados',
      'Ebooks e guias',
    ],
  },
  {
    id: 'sponsorships',
    name: 'Patrocínios',
    description: 'Conecte-se com marcas e empresas',
    icon: '🤝',
    color: '#0066ff',
    commission: 80,
    minimumPlan: 'premium',
    features: [
      'Marketplace de patrocínio',
      'Propostas de marcas',
      'Contratos facilitados',
      'Pagamentos seguros',
      'Gestão de campanhas',
    ],
  },
  {
    id: 'coaching',
    name: 'Coaching & Mentorias',
    description: 'Ofereça sessões de treino e consultoria',
    icon: '🎓',
    color: '#10b981',
    commission: 85,
    minimumPlan: 'premium',
    features: [
      'Agendamento integrado',
      'Chamadas de vídeo',
      'Planos de treino',
      'Análise de performance',
      'Certificados',
    ],
  },
  {
    id: 'merchandise',
    name: 'Loja de Produtos',
    description: 'Venda produtos personalizados',
    icon: '🛍️',
    color: '#f59e0b',
    commission: 70,
    minimumPlan: 'premium',
    features: [
      'Loja integrada',
      'Print on demand',
      'Gestão de estoque',
      'Envio automatizado',
      'Branding personalizado',
    ],
  },
  {
    id: 'subscriptions',
    name: 'Clube de Fãs',
    description: 'Crie um clube com benefícios mensais',
    icon: '⭐',
    color: '#ec4899',
    commission: 80,
    minimumPlan: 'premium',
    features: [
      'Assinaturas mensais',
      'Conteúdo exclusivo',
      'Eventos privados',
      'Interação direta',
      'Descontos em produtos',
    ],
  },
];

// Função para calcular preço anual com desconto
export function getYearlyPrice(plan: SubscriptionPlan): number {
  if (plan.price === 0) return 0;
  const monthlyTotal = plan.price * 12;
  const discount = plan.yearlyDiscount || 0;
  return monthlyTotal * (1 - discount / 100);
}

// Função para calcular economia anual
export function getYearlySavings(plan: SubscriptionPlan): number {
  if (plan.price === 0) return 0;
  const monthlyTotal = plan.price * 12;
  const yearlyPrice = getYearlyPrice(plan);
  return monthlyTotal - yearlyPrice;
}

// Função para formatar preço
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

// Função para formatar impressões
export function formatImpressions(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

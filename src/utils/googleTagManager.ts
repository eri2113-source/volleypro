// Google Tag Manager Utility
// Funções para rastrear eventos e conversões

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Inicializa o dataLayer se não existir
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

// Função para enviar eventos personalizados
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
    console.log('📊 Evento rastreado:', eventName, eventParams);
  }
};

// Eventos específicos do VolleyPro

// Rastrear cadastro/registro
export const trackSignUp = (method: 'email' | 'google') => {
  trackEvent('sign_up', {
    method,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear login
export const trackLogin = (method: 'email' | 'google') => {
  trackEvent('login', {
    method,
    timestamp: new Date().toISOString(),
  });
};

// Rastrear upgrade de plano (CONVERSÃO IMPORTANTE!)
export const trackPurchase = (planName: string, value: number) => {
  trackEvent('purchase', {
    transaction_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    value: value,
    currency: 'BRL',
    items: [{
      item_name: planName,
      item_category: 'subscription',
      price: value,
      quantity: 1,
    }],
    timestamp: new Date().toISOString(),
  });
};

// Rastrear início de checkout (quando usuário clica em "Assinar")
export const trackBeginCheckout = (planName: string, value: number) => {
  trackEvent('begin_checkout', {
    value: value,
    currency: 'BRL',
    items: [{
      item_name: planName,
      item_category: 'subscription',
      price: value,
    }],
  });
};

// Rastrear visualização de planos
export const trackViewPlans = () => {
  trackEvent('view_item_list', {
    item_list_name: 'Planos de Assinatura',
  });
};

// Rastrear criação de conteúdo
export const trackCreatePost = (postType: 'text' | 'photo' | 'video') => {
  trackEvent('create_post', {
    post_type: postType,
  });
};

// Rastrear criação de torneio
export const trackCreateTournament = (tournamentType: string) => {
  trackEvent('create_tournament', {
    tournament_type: tournamentType,
  });
};

// Rastrear início de live
export const trackStartLive = () => {
  trackEvent('start_live_stream', {
    timestamp: new Date().toISOString(),
  });
};

// Rastrear engagement (interações importantes)
export const trackEngagement = (action: 'like' | 'comment' | 'share' | 'follow') => {
  trackEvent('engagement', {
    action,
  });
};

// Rastrear visualização de página
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
  });
};

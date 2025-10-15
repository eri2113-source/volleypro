import { useState, useEffect } from 'react';

// Mock - será substituído por dados reais do Supabase
export type UserPlan = 'free' | 'pro' | 'premium' | 'elite';

interface UserPlanData {
  plan: UserPlan;
  canMonetize: boolean;
  canGoLive: boolean;
  maxPosts: number | 'unlimited';
  maxVideos: number | 'unlimited';
  hasAnalytics: boolean;
  hasVerification: boolean;
  storage: string;
  commission: number;
}

const PLAN_DATA: Record<UserPlan, UserPlanData> = {
  free: {
    plan: 'free',
    canMonetize: false,
    canGoLive: false,
    maxPosts: 10,
    maxVideos: 1,
    hasAnalytics: false,
    hasVerification: false,
    storage: '500MB',
    commission: 0,
  },
  pro: {
    plan: 'pro',
    canMonetize: false,
    canGoLive: true,
    maxPosts: 'unlimited',
    maxVideos: 10,
    hasAnalytics: true,
    hasVerification: false,
    storage: '5GB',
    commission: 0,
  },
  premium: {
    plan: 'premium',
    canMonetize: true,
    canGoLive: true,
    maxPosts: 'unlimited',
    maxVideos: 'unlimited',
    hasAnalytics: true,
    hasVerification: true,
    storage: '20GB',
    commission: 70,
  },
  elite: {
    plan: 'elite',
    canMonetize: true,
    canGoLive: true,
    maxPosts: 'unlimited',
    maxVideos: 'unlimited',
    hasAnalytics: true,
    hasVerification: true,
    storage: 'unlimited',
    commission: 80,
  },
};

export function useUserPlan() {
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlanData>(PLAN_DATA.free);

  useEffect(() => {
    // Simular carregamento
    // TODO: Buscar do Supabase quando o sistema de pagamentos estiver ativo
    const loadUserPlan = async () => {
      try {
        // Verificar localStorage temporariamente
        const savedPlan = localStorage.getItem('volleypro_user_plan') as UserPlan;
        
        if (savedPlan && PLAN_DATA[savedPlan]) {
          setUserPlan(PLAN_DATA[savedPlan]);
        } else {
          setUserPlan(PLAN_DATA.free);
        }
      } catch (error) {
        console.error('Erro ao carregar plano:', error);
        setUserPlan(PLAN_DATA.free);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPlan();
  }, []);

  const upgradePlan = (newPlan: UserPlan) => {
    // TODO: Integrar com sistema de pagamentos
    localStorage.setItem('volleypro_user_plan', newPlan);
    setUserPlan(PLAN_DATA[newPlan]);
  };

  const hasFeature = (feature: keyof UserPlanData): boolean => {
    return !!userPlan[feature];
  };

  const canUseFeature = (requiredPlan: UserPlan): boolean => {
    const planHierarchy = ['free', 'pro', 'premium', 'elite'];
    const currentIndex = planHierarchy.indexOf(userPlan.plan);
    const requiredIndex = planHierarchy.indexOf(requiredPlan);
    return currentIndex >= requiredIndex;
  };

  return {
    ...userPlan,
    isLoading,
    upgradePlan,
    hasFeature,
    canUseFeature,
    isPro: userPlan.plan !== 'free',
    isPremium: userPlan.plan === 'premium' || userPlan.plan === 'elite',
    isElite: userPlan.plan === 'elite',
  };
}

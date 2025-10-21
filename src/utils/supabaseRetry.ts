import { createClient } from './supabase/client';
import { toast } from "sonner";

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Se for erro de rede, tentar novamente
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn(`🔄 Tentativa ${i + 1}/${maxRetries} falhou:`, error.message);
        
        if (i < maxRetries - 1) {
          // Delay exponencial: 1s, 2s, 3s
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }

      // Se for erro de auth que pode ter retry
      if (error?.message?.includes('AuthRetryableFetchError')) {
        console.warn(`🔐 Auth retry ${i + 1}/${maxRetries}:`, error.message);
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      
      // Se não for erro que permite retry, throw imediatamente
      throw error;
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  handleSupabaseError(lastError!);
  throw lastError!;
}

export function handleSupabaseError(error: any): void {
  console.error('🚨 Supabase Error:', error);

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    toast.error('Erro de conexão', {
      description: 'Verifique sua internet e tente novamente.',
      action: {
        label: 'Recarregar',
        onClick: () => window.location.reload(),
      },
    });
    return;
  }

  if (error?.message?.includes('AuthRetryableFetchError')) {
    toast.error('Problema de autenticação', {
      description: 'Tentando reconectar...',
    });
    return;
  }

  if (error?.message?.includes('JWT expired')) {
    toast.error('Sessão expirada', {
      description: 'Faça login novamente.',
      action: {
        label: 'Login',
        onClick: () => {
          localStorage.removeItem('supabase.auth.token');
          window.location.reload();
        },
      },
    });
    return;
  }

  // Erro genérico
  toast.error('Ops! Algo deu errado', {
    description: error?.message || 'Erro desconhecido',
  });
}

// Verificação de conectividade de rede
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    const response = await fetch(`https://waibxabxlcbfyxyagaow.supabase.co/rest/v1/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error('❌ Network check failed:', error);
    return false;
  }
}

export async function waitForNetwork(timeout: number = 10000): Promise<boolean> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (await checkNetworkConnection()) {
      console.log('✅ Network restored');
      return true;
    }
    
    console.log('🔄 Waiting for network...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.warn('⏰ Network timeout');
  return false;
}

// Operações Supabase com retry automático
export async function safeSupabaseCall<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await withRetry(operation);
  } catch (error) {
    if (fallback !== undefined) {
      console.warn('🛡️ Using fallback data due to Supabase error');
      return fallback;
    }
    throw error;
  }
}

// Helper para operações específicas
export async function fetchUserProfile(userId: string) {
  return withRetry(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('kv_store_0ea22bba')
      .select('value')
      .eq('key', `user:${userId}`)
      .single();

    if (error) throw error;
    return data?.value ? JSON.parse(data.value) : null;
  });
}

export async function fetchPosts(limit: number = 50) {
  return withRetry(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('kv_store_0ea22bba')
      .select('value')
      .like('key', 'post:%')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data?.map(item => JSON.parse(item.value)) || [];
  });
}

// Indicador de status da conexão
export function setConnectionStatus(connected: boolean) {
  document.documentElement.setAttribute('data-connected', connected.toString());
  
  if (!connected) {
    toast.warning('Conexão instável', {
      description: 'Verificando conectividade...',
      duration: 2000,
    });
  } else {
    toast.success('Conexão restaurada', {
      duration: 2000,
    });
  }
}

// Monitor de conexão em tempo real
export function startConnectionMonitor() {
  let isOnline = navigator.onLine;
  
  const updateStatus = () => {
    const nowOnline = navigator.onLine;
    if (nowOnline !== isOnline) {
      isOnline = nowOnline;
      setConnectionStatus(nowOnline);
      
      if (nowOnline) {
        // Quando voltar online, testar Supabase
        checkNetworkConnection().then(supabaseOk => {
          if (!supabaseOk) {
            toast.warning('Internet OK, mas Supabase indisponível', {
              description: 'Verifique https://status.supabase.com/',
            });
          }
        });
      }
    }
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  
  // Verificação periódica do Supabase (a cada 30s quando online)
  const intervalId = setInterval(async () => {
    if (navigator.onLine) {
      const isConnected = await checkNetworkConnection();
      setConnectionStatus(isConnected);
    }
  }, 30000);

  // Cleanup function
  return () => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
    clearInterval(intervalId);
  };
}
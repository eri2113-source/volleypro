import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  // Se já existe um cliente, retornar ele
  if (supabaseClient) {
    return supabaseClient;
  }

  // Criar cliente com configurações otimizadas para Chrome
  supabaseClient = createSupabaseClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
    {
      auth: {
        // Configurações otimizadas para Chrome
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Storage customizado para melhor compatibilidade
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        // Flow PKCE é mais seguro e compatível com Chrome
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'volleypro-web',
        },
      },
    }
  );

  return supabaseClient;
}

// Função helper para resetar o cliente (útil em caso de problemas)
export function resetClient() {
  supabaseClient = null;
  if (typeof window !== 'undefined') {
    // Limpar qualquer sessão antiga problemática
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  }
}

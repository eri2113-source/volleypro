# 🚨 CORREÇÃO URGENTE - Erro "Failed to fetch" 

## 🔍 Problema Identificado

Os erros `TypeError: Failed to fetch` e `AuthRetryableFetchError: Failed to fetch` indicam problemas de conectividade com o Supabase.

## 🛠️ Soluções Imediatas

### ✅ Solução 1: Verificar Status do Supabase

**1. Acesse:** https://status.supabase.com/
- Verifique se há problemas no serviço

**2. Teste direto no browser:**
```
https://waibxabxlcbfyxyagaow.supabase.co/rest/v1/
```

### ✅ Solução 2: Atualizar Configuração do Cliente

**Cliente Supabase atual está correto**, mas vamos adicionar configurações de retry e timeout:

```typescript
// utils/supabase/client.tsx - Versão com retry
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createSupabaseClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'volleypro-web',
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            // Timeout de 30 segundos
            signal: AbortSignal.timeout(30000),
          });
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  );

  return supabaseClient;
}

export function resetClient() {
  supabaseClient = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  }
}
```

### ✅ Solução 3: Wrapper com Retry Automático

Criar utilitário para retry automático em operações Supabase:

```typescript
// utils/supabaseRetry.ts
import { createClient } from './supabase/client';

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
        console.warn(`Tentativa ${i + 1}/${maxRetries} falhou:`, error.message);
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      
      // Se não for erro de rede, não retry
      throw error;
    }
  }

  throw lastError!;
}

// Exemplo de uso
export async function fetchUserProfile(userId: string) {
  return withRetry(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  });
}
```

### ✅ Solução 4: Verificar Conexão de Rede

Adicionar verificação de conectividade:

```typescript
// utils/networkCheck.ts
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    // Tentar fazer ping no Supabase
    const response = await fetch(`https://waibxabxlcbfyxyagaow.supabase.co/rest/v1/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error('Network check failed:', error);
    return false;
  }
}

export async function waitForNetwork(timeout: number = 10000): Promise<boolean> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (await checkNetworkConnection()) {
      return true;
    }
    
    // Aguardar 1 segundo antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return false;
}
```

### ✅ Solução 5: Error Handler Global

Implementar tratamento global de erros de fetch:

```typescript
// utils/errorHandler.ts
import { toast } from "sonner";

export function handleSupabaseError(error: any): void {
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
      description: 'Fazendo nova tentativa...',
    });
    return;
  }

  // Erro genérico
  toast.error('Ops! Algo deu errado', {
    description: error?.message || 'Erro desconhecido',
  });
}
```

## 🔧 Implementação Imediata

### Passo 1: Testar Conectividade
```bash
# No console do navegador (F12):
fetch('https://waibxabxlcbfyxyagaow.supabase.co/rest/v1/')
  .then(r => console.log('✅ Supabase OK:', r.status))
  .catch(e => console.error('❌ Supabase Erro:', e))
```

### Passo 2: Verificar Headers
```javascript
// No console do navegador:
const supabase = createClient();
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Key:', supabase.supabaseKey.substring(0, 20) + '...');
```

### Passo 3: Limpar Cache
```javascript
// No console do navegador:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🚨 Ações de Emergência

Se o problema persistir:

1. **Usar Fallback Local**:
```typescript
// Dados de fallback quando Supabase falha
const fallbackData = {
  user: null,
  posts: [],
  tournaments: [],
};

// Interceptar erros e usar fallback
export async function safeSupabaseCall<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Supabase call failed, using fallback:', error);
    return fallback;
  }
}
```

2. **Mode Offline**:
```typescript
// Indicador de mode offline
export function setOfflineMode(offline: boolean) {
  document.documentElement.setAttribute('data-offline', offline.toString());
  
  if (offline) {
    toast.warning('Modo Offline', {
      description: 'Algumas funcionalidades podem estar limitadas.',
      duration: Infinity,
    });
  }
}
```

## ✅ Status de Monitoramento

- ✅ **Cliente Supabase**: Configurado corretamente
- ✅ **Credentials**: Válidas (waibxabxlcbfyxyagaow)
- ✅ **URL**: https://waibxabxlcbfyxyagaow.supabase.co
- ❓ **Conectividade**: Testar conforme instruções acima

## 📞 Próximos Passos

1. Execute os testes de conectividade
2. Se falhar, verifique https://status.supabase.com/
3. Se o Supabase estiver OK, implemente o wrapper de retry
4. Monitore os logs do console para mais detalhes

---

**✅ SOLUÇÕES PRONTAS PARA IMPLEMENTAR**
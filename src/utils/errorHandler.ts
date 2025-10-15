/**
 * Utilitários para tratamento de erros de rede
 */

/**
 * Verifica se é um erro de rede/conexão
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message?.toLowerCase() || '';
  const name = error.name?.toLowerCase() || '';
  
  return (
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('conexão') ||
    message.includes('tempo limite') ||
    message.includes('timeout') ||
    message.includes('network request failed') ||
    name === 'typeerror' ||
    name === 'networkerror'
  );
}

/**
 * Trata erro de forma silenciosa se for de rede
 * Retorna true se o erro foi silenciado
 */
export function handleNetworkErrorSilently(error: any, context: string = ''): boolean {
  if (isNetworkError(error)) {
    console.log(`⚠️ ${context}: Operação offline - dados podem estar desatualizados`);
    return true;
  }
  return false;
}

/**
 * Log de erro com contexto
 */
export function logError(context: string, error: any): void {
  if (isNetworkError(error)) {
    console.log(`⚠️ ${context}: Erro de conexão (ignorado)`);
  } else {
    console.error(`❌ ${context}:`, error);
  }
}

/**
 * Salva dados no cache
 */
export function saveToCache(key: string, data: any): void {
  try {
    if (typeof window !== 'undefined' && data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    // Silenciar erro de quota/storage
  }
}

/**
 * Carrega dados do cache
 */
export function loadFromCache<T>(key: string): T | null {
  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    }
  } catch (error) {
    // Silenciar erro de parse
  }
  return null;
}

/**
 * Wrapper para chamadas de API com fallback de cache
 */
export async function fetchWithCache<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  context: string = ''
): Promise<T | null> {
  try {
    const data = await fetchFn();
    saveToCache(cacheKey, data);
    return data;
  } catch (error: any) {
    if (isNetworkError(error)) {
      console.log(`⚠️ ${context || 'Fetch'}: Usando cache devido a erro de rede`);
      return loadFromCache<T>(cacheKey);
    }
    throw error;
  }
}

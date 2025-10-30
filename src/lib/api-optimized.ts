/**
 * ⚡ UPLOAD OTIMIZADO - Economiza 70-100% de banda
 * 
 * Este módulo substitui a função uploadMedia original com:
 * - Compressão automática de imagens (WebP)
 * - Upload para CDN externa (ImgBB grátis)
 * - Fallback para Supabase se CDN falhar
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '../utils/supabase/client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba`;

// Get token from Supabase session
async function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.access_token) {
      return null;
    }
    
    return session.access_token;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error);
    return null;
  }
}

/**
 * Upload de mídia otimizado com CDN externa
 */
export async function uploadMediaOptimized(file: File) {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Você precisa estar autenticado para fazer upload');
  }
  
  console.log('📤 Iniciando upload otimizado:', {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
  });
  
  try {
    // ⚡ OTIMIZAÇÃO: Comprimir + CDN externa (economiza 70-100% de banda)
    const { uploadMedia } = await import('../utils/cdnUpload');
    const result = await uploadMedia(file, token, true);
    
    console.log('✅ Upload concluído com sucesso:', result.mediaType);
    return result;
  } catch (error: any) {
    console.error('❌ Erro no upload otimizado:', error);
    
    // Mensagens de erro amigáveis
    if (error.message?.includes('muito grande')) {
      throw new Error(error.message);
    }
    
    if (error.message?.includes('API key') || error.message?.includes('CDN')) {
      console.warn('⚠️ CDN não disponível, usando Supabase direto...');
      // Fallback para método antigo
      return uploadMediaLegacy(file, token);
    }
    
    // Se qualquer erro com CDN, fazer fallback
    console.warn('⚠️ Erro com CDN, tentando Supabase...');
    return uploadMediaLegacy(file, token);
  }
}

/**
 * Upload legado para Supabase (fallback)
 */
async function uploadMediaLegacy(file: File, token: string) {
  console.log('📤 Upload fallback (Supabase Storage)...');
  
  const formData = new FormData();
  formData.append('file', file);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  
  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Falha no upload');
    }
    
    console.log('✅ Upload Supabase concluído');
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Upload muito demorado. Tente um arquivo menor.');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
    
    throw error;
  }
}

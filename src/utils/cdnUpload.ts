/**
 * 🌐 CDN UPLOAD - ImgBB (Grátis Ilimitado)
 * 
 * Migra uploads de imagens para CDN externa:
 * - ImgBB: Grátis, ilimitado, sem expiração
 * - Economia de 100% da banda do Supabase
 * - Fallback automático para Supabase se falhar
 * - URLs permanentes e rápidas
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba`;

/**
 * Faz upload de imagem para ImgBB (CDN gratuita)
 */
export async function uploadToImgBB(file: File): Promise<string> {
  // Verificar se tem API key configurada
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  
  if (!IMGBB_API_KEY) {
    console.warn('⚠️ ImgBB API key não configurada, usando Supabase');
    throw new Error('ImgBB API key não configurada');
  }

  console.log(`🌐 Fazendo upload para ImgBB: ${file.name}`);

  try {
    // Converter arquivo para base64
    const base64 = await fileToBase64(file);

    // Fazer upload para ImgBB
    const formData = new FormData();
    formData.append('image', base64.split(',')[1]); // Remover "data:image/...;base64,"
    formData.append('name', file.name);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao fazer upload para ImgBB');
    }

    const data = await response.json();
    
    if (!data.success || !data.data?.url) {
      throw new Error('Resposta inválida do ImgBB');
    }

    console.log('✅ Upload ImgBB concluído:', data.data.url);
    return data.data.url;
  } catch (error: any) {
    console.error('❌ Erro no upload ImgBB:', error);
    throw error;
  }
}

/**
 * Faz upload de imagem (tenta ImgBB primeiro, depois Supabase)
 */
export async function uploadImage(file: File, token?: string): Promise<string> {
  console.log(`📤 Iniciando upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

  // Tentar ImgBB primeiro (grátis, ilimitado)
  try {
    const url = await uploadToImgBB(file);
    console.log('✅ Usando ImgBB (CDN gratuita)');
    return url;
  } catch (imgbbError) {
    console.warn('⚠️ ImgBB falhou, usando Supabase como fallback');
    
    // Fallback para Supabase Storage
    return uploadToSupabase(file, token);
  }
}

/**
 * Faz upload para Supabase Storage (fallback)
 */
async function uploadToSupabase(file: File, token?: string): Promise<string> {
  if (!token) {
    throw new Error('Token necessário para upload no Supabase');
  }

  console.log('📤 Fazendo upload para Supabase Storage...');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao fazer upload para Supabase');
  }

  console.log('✅ Upload Supabase concluído');
  return data.url;
}

/**
 * Faz upload de vídeo (sempre Supabase por enquanto)
 */
export async function uploadVideo(file: File, token?: string): Promise<string> {
  console.log(`📹 Upload de vídeo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  
  if (!token) {
    throw new Error('Token necessário para upload de vídeo');
  }

  return uploadToSupabase(file, token);
}

/**
 * Converte File para base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload de mídia com otimização automática
 */
export async function uploadMedia(
  file: File,
  token?: string,
  optimize: boolean = true
): Promise<{ url: string; mediaType: string }> {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  let optimizedFile = file;

  // Otimizar se necessário
  if (optimize && isImage) {
    const { optimizeImage } = await import('./imageOptimizer');
    optimizedFile = await optimizeImage(file);
  } else if (optimize && isVideo) {
    const { optimizeVideo } = await import('./imageOptimizer');
    optimizedFile = await optimizeVideo(file);
  }

  // Fazer upload
  let url: string;
  if (isImage) {
    url = await uploadImage(optimizedFile, token);
  } else if (isVideo) {
    url = await uploadVideo(optimizedFile, token);
  } else {
    throw new Error('Tipo de arquivo não suportado');
  }

  return {
    url,
    mediaType: isVideo ? 'video' : 'image',
  };
}

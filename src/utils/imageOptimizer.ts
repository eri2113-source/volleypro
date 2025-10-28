/**
 * 🎨 IMAGE OPTIMIZER - Reduz banda em 70%+
 * 
 * Comprime e otimiza imagens antes do upload:
 * - Redimensiona imagens grandes
 * - Converte para WebP (menor tamanho)
 * - Limita tamanho máximo (2MB)
 * - Mantém qualidade visual
 */

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
  convertToWebP?: boolean;
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  maxSizeMB: 2,
  convertToWebP: true,
};

/**
 * Otimiza uma imagem antes do upload
 */
export async function optimizeImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Se não for imagem, retornar original
  if (!file.type.startsWith('image/')) {
    console.log('⚠️ Arquivo não é imagem, retornando original');
    return file;
  }

  // Se já for WebP e menor que limite, retornar original
  if (file.type === 'image/webp' && file.size <= (opts.maxSizeMB! * 1024 * 1024)) {
    console.log('✅ Imagem já otimizada (WebP < 2MB)');
    return file;
  }

  console.log(`🎨 Otimizando imagem: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

  try {
    // Carregar imagem
    const image = await loadImage(file);
    
    // Calcular novas dimensões
    const { width, height } = calculateDimensions(
      image.width,
      image.height,
      opts.maxWidth!,
      opts.maxHeight!
    );

    // Criar canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Desenhar imagem redimensionada
    ctx.drawImage(image, 0, 0, width, height);

    // Converter para blob
    const mimeType = opts.convertToWebP ? 'image/webp' : file.type;
    const blob = await canvasToBlob(canvas, mimeType, opts.quality!);

    // Criar novo arquivo
    const extension = opts.convertToWebP ? 'webp' : file.name.split('.').pop();
    const newFileName = file.name.replace(/\.[^/.]+$/, `.${extension}`);
    const optimizedFile = new File([blob], newFileName, { type: mimeType });

    const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
    const newSizeMB = (optimizedFile.size / 1024 / 1024).toFixed(2);
    const reduction = ((1 - optimizedFile.size / file.size) * 100).toFixed(0);

    console.log(`✅ Otimização concluída:`);
    console.log(`   📊 ${originalSizeMB} MB → ${newSizeMB} MB (${reduction}% menor)`);
    console.log(`   📐 ${image.width}x${image.height} → ${width}x${height}`);

    // Se ainda for maior que o limite, tentar comprimir mais
    if (optimizedFile.size > opts.maxSizeMB! * 1024 * 1024) {
      console.log('⚠️ Ainda muito grande, comprimindo mais...');
      return await optimizeImage(optimizedFile, {
        ...opts,
        quality: opts.quality! * 0.8,
        maxWidth: opts.maxWidth! * 0.8,
        maxHeight: opts.maxHeight! * 0.8,
      });
    }

    return optimizedFile;
  } catch (error) {
    console.error('❌ Erro ao otimizar imagem:', error);
    // Em caso de erro, retornar original
    return file;
  }
}

/**
 * Carrega imagem do arquivo
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calcula novas dimensões mantendo aspect ratio
 */
function calculateDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Converte canvas para blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Otimiza vídeo (apenas validação de tamanho por enquanto)
 */
export async function optimizeVideo(file: File): Promise<File> {
  const maxSizeMB = 50; // 50MB para vídeos
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Vídeo muito grande. Máximo: ${maxSizeMB}MB. Tamanho: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
  }

  console.log(`✅ Vídeo validado: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
  return file;
}

/**
 * Otimiza mídia (imagem ou vídeo)
 */
export async function optimizeMedia(
  file: File,
  options?: OptimizationOptions
): Promise<File> {
  if (file.type.startsWith('image/')) {
    return optimizeImage(file, options);
  } else if (file.type.startsWith('video/')) {
    return optimizeVideo(file);
  } else {
    console.warn('⚠️ Tipo de arquivo não suportado:', file.type);
    return file;
  }
}

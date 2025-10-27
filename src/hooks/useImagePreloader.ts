import { useEffect, useState } from 'react';

/**
 * Hook para preload de imagens
 * Carrega as imagens em background para transições suaves
 */
export function useImagePreloader(urls: string[], enabled: boolean = true) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || urls.length === 0) {
      setAllLoaded(true);
      return;
    }

    let isMounted = true;
    const loaded = new Set<string>();

    // Preload de até 3 imagens por vez para não sobrecarregar
    const preloadBatch = async (batch: string[]) => {
      const promises = batch.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          
          img.onload = () => {
            if (isMounted) {
              loaded.add(url);
              setLoadedImages(new Set(loaded));
            }
            resolve();
          };
          
          img.onerror = () => {
            console.warn(`⚠️ Falha ao preload da imagem: ${url}`);
            resolve(); // Resolve mesmo com erro para não travar
          };
          
          img.src = url;
        });
      });

      await Promise.all(promises);
    };

    // Carregar em lotes de 3
    const loadInBatches = async () => {
      const batchSize = 3;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await preloadBatch(batch);
      }
      
      if (isMounted) {
        setAllLoaded(true);
      }
    };

    loadInBatches();

    return () => {
      isMounted = false;
    };
  }, [urls, enabled]);

  return { loadedImages, allLoaded };
}

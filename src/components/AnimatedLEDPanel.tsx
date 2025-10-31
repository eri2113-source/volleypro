import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LEDMedia {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number;
  link?: string;
  name?: string;
}

interface AnimatedLEDPanelProps {
  zones?: {
    zone1: LEDMedia[];
    zone2: LEDMedia[];
    zone3: LEDMedia[];
    zone4: LEDMedia[];
  };
  media?: LEDMedia[]; // Retrocompatibilidade
  layout?: "single" | "grid-2" | "grid-3" | "grid-4";
  animationType?: "horizontal" | "fade" | "zoom" | "slide";
  randomOrder?: boolean;
  autoPlay?: boolean;
  transitionSpeed?: number;
  height?: number;
}

export const AnimatedLEDPanel = memo(function AnimatedLEDPanel({
  zones,
  media,
  layout = "grid-3",
  animationType = "horizontal",
  randomOrder = true,
  autoPlay = true,
  transitionSpeed = 5,
  height = 320,
}: AnimatedLEDPanelProps) {
  // Detectar se é mobile - MELHORADO
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  // Atualizar detecção de mobile em tempo real
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Ajustar altura para mobile
  const adjustedHeight = useMemo(() => {
    if (isMobile) {
      return Math.min(height, 240); // Max 240px no mobile
    }
    return height;
  }, [isMobile, height]);

  console.log('📱 LED Panel: Detecção de dispositivo', {
    isMobile,
    originalHeight: height,
    adjustedHeight,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'undefined',
    isPWA: typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  });

  // Determinar número de slots baseado no layout
  const numSlots = useMemo(
    () => layout === "single" ? 1 : layout === "grid-2" ? 2 : layout === "grid-3" ? 3 : 4,
    [layout]
  );

  // Determinar mídia para cada slot (memoizado)
  const slotMedia = useMemo(() => {
    let result: LEDMedia[][] = [];

    if (zones) {
      // 🆕 NOVO SISTEMA: Usar zonas separadas
      const zoneKeys = ["zone1", "zone2", "zone3", "zone4"] as const;
      result = zoneKeys.slice(0, numSlots).map((key) => zones[key] || []);
    } else if (media && media.length > 0) {
      // 🔙 RETROCOMPATIBILIDADE: Distribuir mídia única entre slots
      result = Array.from({ length: numSlots }, (_, slotIndex) => {
        return media.filter((_, index) => index % numSlots === slotIndex);
      });
    } else {
      // Vazio
      result = Array.from({ length: numSlots }, () => []);
    }

    return result;
  }, [zones, media, numSlots]);

  // Classes de grid (memoizado) - MOBILE FIRST!
  const gridClass = useMemo(() => {
    // No mobile, SEMPRE mostrar 1 coluna em carrossel horizontal
    if (isMobile) {
      return "grid-cols-1"; // Mobile: sempre 1 coluna
    }
    
    // Desktop: grid normal
    const gridClasses = {
      single: "grid-cols-1",
      "grid-2": "grid-cols-2",
      "grid-3": "grid-cols-3",
      "grid-4": "grid-cols-4",
    };
    return gridClasses[layout];
  }, [layout, isMobile]);

  // Verificar se há alguma mídia
  const hasAnyMedia = useMemo(
    () => slotMedia.some((slot) => slot.length > 0),
    [slotMedia]
  );

  // Se não há mídia, mostra placeholder com marca d'água VolleyPro
  if (!hasAnyMedia) {
    console.log('📺 LED Panel: SEM MÍDIA - Mostrando placeholder VolleyPro', { 
      height: adjustedHeight, 
      layout,
      isMobile,
      zones: zones ? 'defined' : 'undefined',
      media: media ? media.length : 0
    });
    return (
      <div
        className="relative w-full overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20"
        style={{ 
          height: `${adjustedHeight}px`, 
          minHeight: `${adjustedHeight}px`,
          display: 'block',
          visibility: 'visible'
        }}
      >
        {/* Marca d'água VolleyPro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 opacity-30">
            {/* Logo VolleyPro SVG */}
            <svg width="120" height="120" viewBox="0 0 200 200" className="mx-auto">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" />
              <path d="M70 80 L100 140 L130 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <circle cx="70" cy="70" r="8" fill="currentColor" className="text-primary" />
              <circle cx="130" cy="70" r="8" fill="currentColor" className="text-primary" />
              <circle cx="100" cy="150" r="8" fill="currentColor" className="text-primary" />
            </svg>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">VolleyPro</p>
              <p className="text-sm text-muted-foreground">Configure o Painel LED</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('📺 LED Panel: COM MÍDIA - Renderizando', { 
    height: adjustedHeight,
    originalHeight: height,
    layout, 
    gridClass,
    numSlots,
    isMobile,
    slotMediaCount: slotMedia.map(s => s.length),
    totalMedia: slotMedia.reduce((sum, s) => sum + s.length, 0),
    firstSlotFirstMedia: slotMedia[0]?.[0]?.url?.substring(0, 50),
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 0
  });

  return (
    <div
      className={`relative w-full overflow-hidden ${isMobile ? 'flex' : 'grid'} ${!isMobile ? gridClass : ''} gap-0`}
      style={{ 
        height: `${adjustedHeight}px`, 
        minHeight: `${adjustedHeight}px`,
        maxHeight: `${adjustedHeight}px`,
        display: isMobile ? 'flex' : 'grid',
        visibility: 'visible',
        backgroundColor: '#000',
        position: 'relative',
        width: '100%',
        flexDirection: isMobile ? 'row' : undefined,
        overflowX: isMobile ? 'auto' : 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {slotMedia.map((slotMediaList, slotIndex) => (
        <div
          key={slotIndex}
          style={{
            width: isMobile ? '100%' : undefined,
            height: isMobile ? '100%' : undefined,
            minWidth: isMobile ? '100%' : undefined,
            minHeight: isMobile ? '100%' : undefined,
            flex: isMobile ? '0 0 100%' : undefined,
            position: 'relative',
          }}
        >
          <AnimatedSlot
            media={slotMediaList}
            animationType={animationType}
            randomOrder={randomOrder}
            autoPlay={autoPlay}
            transitionSpeed={transitionSpeed}
          />
        </div>
      ))}
    </div>
  );
});

// ⚡ OTIMIZADO: Componente de slot individual memoizado
const AnimatedSlot = memo(function AnimatedSlot({
  media,
  animationType,
  randomOrder,
  autoPlay,
  transitionSpeed,
}: {
  media: LEDMedia[];
  animationType: "horizontal" | "fade" | "zoom" | "slide";
  randomOrder: boolean;
  autoPlay: boolean;
  transitionSpeed: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledMedia, setShuffledMedia] = useState<LEDMedia[]>(media);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  // Embaralhar mídia se randomOrder ativo (otimizado)
  useEffect(() => {
    if (randomOrder && media.length > 1) {
      const shuffled = [...media].sort(() => Math.random() - 0.5);
      setShuffledMedia(shuffled);
    } else {
      setShuffledMedia(media);
    }
  }, [media, randomOrder]);

  // Próxima mídia (com ordem aleatória) - useCallback para evitar re-criação
  const handleNext = useCallback(() => {
    if (randomOrder && shuffledMedia.length > 1) {
      // Escolher índice aleatório diferente do atual
      setCurrentIndex((prevIndex) => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * shuffledMedia.length);
        } while (newIndex === prevIndex && shuffledMedia.length > 1);
        return newIndex;
      });
    } else {
      setCurrentIndex((prev) => (prev + 1) % shuffledMedia.length);
    }
  }, [randomOrder, shuffledMedia.length]);

  // ⚡ OTIMIZADO: Auto avançar com limpeza correta
  useEffect(() => {
    if (!autoPlay || shuffledMedia.length <= 1) return;

    const currentMedia = shuffledMedia[currentIndex];
    const duration = currentMedia.type === "image" 
      ? (currentMedia.duration || 5) * 1000 
      : null;

    // Para imagens, usar timer
    if (duration) {
      timerRef.current = window.setTimeout(() => {
        handleNext();
      }, duration);

      return () => {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [currentIndex, autoPlay, shuffledMedia, handleNext]);

  // Callback quando vídeo terminar
  const handleVideoEnded = useCallback(() => {
    if (autoPlay) {
      handleNext();
    }
  }, [autoPlay, handleNext]);

  // Handle click
  const handleClick = useCallback(() => {
    const currentMedia = shuffledMedia[currentIndex];
    if (currentMedia.link) {
      window.open(currentMedia.link, "_blank", "noopener,noreferrer");
    }
  }, [shuffledMedia, currentIndex]);

  // Se não há mídia neste slot - Marca d'água VolleyPro
  if (!shuffledMedia || shuffledMedia.length === 0) {
    console.log('📺 Slot vazio - mostrando marca d\'água');
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 flex items-center justify-center">
        {/* Marca d'água VolleyPro SVG inline */}
        <div className="text-center space-y-2 opacity-20">
          <svg width="80" height="80" viewBox="0 0 200 200" className="mx-auto">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" />
            <path d="M70 80 L100 140 L130 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
            <circle cx="70" cy="70" r="8" fill="currentColor" className="text-primary" />
            <circle cx="130" cy="70" r="8" fill="currentColor" className="text-primary" />
            <circle cx="100" cy="150" r="8" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-xs font-semibold text-primary/60">VolleyPro</p>
        </div>
      </div>
    );
  }

  const currentMedia = shuffledMedia[currentIndex];

  console.log('📺 Slot renderizando mídia:', {
    currentIndex,
    total: shuffledMedia.length,
    type: currentMedia.type,
    url: currentMedia.url.substring(0, 50) + '...',
    hasLink: !!currentMedia.link
  });

  // ⚡ OTIMIZADO: Variantes de animação memoizadas
  const variants = useMemo(() => {
    const speed = transitionSpeed;

    switch (animationType) {
      case "fade":
        // Fade é a animação mais leve
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.5 }, // Mais rápido
        };

      case "zoom":
        return {
          enter: { opacity: 0, scale: 0.95 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
          transition: { duration: 0.6, ease: "easeInOut" },
        };

      case "slide":
        return {
          enter: { y: 50, opacity: 0 },
          center: { y: 0, opacity: 1 },
          exit: { y: -50, opacity: 0 },
          transition: { duration: 0.5, ease: "easeOut" },
        };

      case "horizontal":
      default:
        return {
          enter: { x: 100, opacity: 0 },
          center: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 },
          transition: { duration: 0.5, ease: "easeInOut" },
        };
    }
  }, [animationType, transitionSpeed]);

  return (
    <div 
      className="relative overflow-hidden bg-black"
      style={{
        width: '100%',
        height: '100%',
        minWidth: '100%',
        minHeight: '100%',
        display: 'block',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMedia.id}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          onClick={handleClick}
          style={{ 
            cursor: currentMedia.link ? "pointer" : "default",
            willChange: "transform, opacity",
            width: '100%',
            height: '100%',
          }}
        >
          {currentMedia.type === "image" ? (
            // ⚡ OTIMIZADO: Usar img tag ao invés de background-image
            <img
              src={currentMedia.url}
              alt={currentMedia.name || "LED Media"}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              onLoad={() => console.log('✅ [LED] Imagem carregada:', currentMedia.url.substring(0, 50))}
              onError={(e) => {
                console.error('❌ [LED] Erro ao carregar imagem:', currentMedia.url);
              }}
              style={{ 
                willChange: "transform",
                backfaceVisibility: "hidden",
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <video
              ref={videoRef}
              key={currentMedia.id}
              src={currentMedia.url}
              className="w-full h-full object-cover"
              autoPlay={autoPlay}
              muted
              playsInline
              preload="metadata" // ⚡ Só carrega metadados
              onEnded={handleVideoEnded}
              onLoadedData={() => console.log('✅ [LED] Vídeo carregado:', currentMedia.url.substring(0, 50))}
              onError={(e) => {
                console.error('❌ [LED] Erro ao carregar vídeo:', currentMedia.url);
              }}
              style={{ 
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Indicador */}
      {shuffledMedia.length > 1 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
            {currentIndex + 1}/{shuffledMedia.length}
          </div>
        </div>
      )}
    </div>
  );
});

export default AnimatedLEDPanel;

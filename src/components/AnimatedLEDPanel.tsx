import { useState, useEffect, useRef } from "react";
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
  media: LEDMedia[];
  layout?: "single" | "grid-2" | "grid-3" | "grid-4";
  animationType?: "horizontal" | "fade" | "zoom" | "slide";
  randomOrder?: boolean;
  autoPlay?: boolean;
  transitionSpeed?: number;
  height?: number;
}

export function AnimatedLEDPanel({
  media,
  layout = "grid-3",
  animationType = "horizontal",
  randomOrder = true,
  autoPlay = true,
  transitionSpeed = 5,
  height = 320,
}: AnimatedLEDPanelProps) {
  // Determinar número de slots
  const numSlots =
    layout === "single" ? 1 : layout === "grid-2" ? 2 : layout === "grid-3" ? 3 : 4;

  // Distribuir mídias entre slots
  const slotMedia = Array.from({ length: numSlots }, (_, slotIndex) => {
    return media.filter((_, index) => index % numSlots === slotIndex);
  });

  // Classes de grid
  const gridClasses = {
    single: "grid-cols-1",
    "grid-2": "grid-cols-2",
    "grid-3": "grid-cols-3",
    "grid-4": "grid-cols-2 lg:grid-cols-4",
  };

  // Se não há mídia, mostra placeholder
  if (!media || media.length === 0) {
    return (
      <div
        className="relative overflow-hidden bg-gradient-to-r from-primary via-[#0052cc] to-primary"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/60 text-lg">
            Nenhuma mídia configurada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden grid ${gridClasses[layout]} gap-0`}
      style={{ height: `${height}px` }}
    >
      {slotMedia.map((slotMediaList, slotIndex) => (
        <AnimatedSlot
          key={slotIndex}
          media={slotMediaList}
          animationType={animationType}
          randomOrder={randomOrder}
          autoPlay={autoPlay}
          transitionSpeed={transitionSpeed}
        />
      ))}
    </div>
  );
}

// Componente de slot individual com animação
function AnimatedSlot({
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

  // Embaralhar mídia se randomOrder ativo
  useEffect(() => {
    if (randomOrder && media.length > 1) {
      const shuffled = [...media].sort(() => Math.random() - 0.5);
      setShuffledMedia(shuffled);
    } else {
      setShuffledMedia(media);
    }
  }, [media, randomOrder]);

  // Auto avançar
  useEffect(() => {
    if (!autoPlay || shuffledMedia.length <= 1) return;

    const currentMedia = shuffledMedia[currentIndex];
    const duration = currentMedia.type === "image" 
      ? (currentMedia.duration || 5) * 1000 
      : null;

    // Para imagens, usar timer
    if (duration) {
      const timer = setTimeout(() => {
        handleNext();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlay, shuffledMedia]);

  // Próxima mídia (com ordem aleatória)
  const handleNext = () => {
    if (randomOrder && shuffledMedia.length > 1) {
      // Escolher índice aleatório diferente do atual
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * shuffledMedia.length);
      } while (newIndex === currentIndex && shuffledMedia.length > 1);
      setCurrentIndex(newIndex);
    } else {
      setCurrentIndex((prev) => (prev + 1) % shuffledMedia.length);
    }
  };

  // Callback quando vídeo terminar
  const handleVideoEnded = () => {
    if (autoPlay) {
      handleNext();
    }
  };

  // Handle click
  const handleClick = () => {
    const currentMedia = shuffledMedia[currentIndex];
    if (currentMedia.link) {
      window.open(currentMedia.link, "_blank", "noopener,noreferrer");
    }
  };

  // Se não há mídia neste slot
  if (!shuffledMedia || shuffledMedia.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-muted via-muted/50 to-muted" />
    );
  }

  const currentMedia = shuffledMedia[currentIndex];

  // Variantes de animação
  const getAnimationVariants = () => {
    const speed = transitionSpeed;

    switch (animationType) {
      case "horizontal":
        return {
          enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
          }),
          center: {
            x: 0,
            opacity: 1,
          },
          exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
          }),
          transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: speed * 0.2 },
          },
        };

      case "fade":
        return {
          enter: { opacity: 0, scale: 1 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1 },
          transition: { duration: speed * 0.3 },
        };

      case "zoom":
        return {
          enter: { opacity: 0, scale: 0.8 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
          transition: { duration: speed * 0.3 },
        };

      case "slide":
        return {
          enter: { y: 1000, opacity: 0 },
          center: { y: 0, opacity: 1 },
          exit: { y: -1000, opacity: 0 },
          transition: {
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: speed * 0.2 },
          },
        };

      default:
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: speed * 0.3 },
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <div className="relative overflow-hidden bg-black">
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={currentMedia.id}
          custom={1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={variants.transition}
          className="absolute inset-0"
          onClick={handleClick}
          style={{ cursor: currentMedia.link ? "pointer" : "default" }}
        >
          {currentMedia.type === "image" ? (
            <motion.div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${currentMedia.url})` }}
              animate={
                animationType === "horizontal"
                  ? {
                      x: [0, -30, 30, 0],
                      transition: {
                        duration: transitionSpeed * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }
                  : {}
              }
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
              onEnded={handleVideoEnded}
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
}

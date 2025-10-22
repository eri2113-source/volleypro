import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Grid3x3, Layers } from "lucide-react";
import { Button } from "./ui/button";

interface SponsorMedia {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number; // segundos para exibir (imagens) ou duração do vídeo
  link?: string; // link opcional quando clicar
  slot?: number; // qual slot exibir (1-4)
}

interface TournamentSponsorsPanelProps {
  sponsors: SponsorMedia[];
  height?: number; // altura em pixels
  autoPlay?: boolean;
  showControls?: boolean;
  layout?: "single" | "grid-2" | "grid-3" | "grid-4"; // novo: layout do painel
}

export function TournamentSponsorsPanel({
  sponsors,
  height = 320,
  autoPlay = true,
  showControls = false,
  layout = "grid-3", // padrão 3 slots
}: TournamentSponsorsPanelProps) {
  // Determinar número de slots baseado no layout
  const numSlots = layout === "single" ? 1 : 
                   layout === "grid-2" ? 2 :
                   layout === "grid-3" ? 3 : 4;

  // Distribuir patrocinadores entre os slots
  const slotSponsors = Array.from({ length: numSlots }, (_, slotIndex) => {
    // Se os sponsors já têm slot definido, usar isso
    const sponsorsWithSlot = sponsors.filter(s => s.slot === slotIndex + 1);
    if (sponsorsWithSlot.length > 0) {
      return sponsorsWithSlot;
    }
    
    // Caso contrário, distribuir uniformemente
    return sponsors.filter((_, index) => index % numSlots === slotIndex);
  });

  // Se não há sponsors, mostra banner padrão
  if (!sponsors || sponsors.length === 0) {
    return (
      <div
        className="relative overflow-hidden bg-gradient-to-r from-primary via-[#0052cc] to-primary"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    );
  }

  // Classes de grid baseadas no layout
  const gridClasses = {
    single: "grid-cols-1",
    "grid-2": "grid-cols-2",
    "grid-3": "grid-cols-3",
    "grid-4": "grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div
      className={`relative overflow-hidden grid ${gridClasses[layout]} gap-0`}
      style={{ height: `${height}px` }}
    >
      {slotSponsors.map((slotMedia, slotIndex) => (
        <SponsorSlot
          key={slotIndex}
          sponsors={slotMedia}
          autoPlay={autoPlay}
          showControls={showControls && slotIndex === 0} // apenas primeiro slot mostra controles
          slotIndex={slotIndex}
        />
      ))}
    </div>
  );
}

// Componente para cada slot individual
function SponsorSlot({
  sponsors,
  autoPlay,
  showControls,
  slotIndex,
}: {
  sponsors: SponsorMedia[];
  autoPlay: boolean;
  showControls: boolean;
  slotIndex: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  // Se este slot não tem sponsors, mostra gradiente vazio
  if (!sponsors || sponsors.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-muted via-muted/50 to-muted">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Layers className="h-16 w-16 text-muted-foreground" />
        </div>
      </div>
    );
  }

  const currentMedia = sponsors[currentIndex];
  const duration = currentMedia.duration || 5;

  // Auto avançar
  useEffect(() => {
    if (!isPlaying || sponsors.length <= 1) return;

    if (currentMedia.type === "image") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / (duration * 10));
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [currentIndex, isPlaying, currentMedia.type, duration, sponsors.length]);

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    setProgress(0);
  }

  function handlePrev() {
    setCurrentIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length);
    setProgress(0);
  }

  function handleVideoEnded() {
    if (isPlaying && sponsors.length > 1) {
      handleNext();
    }
  }

  function handleMediaClick() {
    if (currentMedia.link) {
      window.open(currentMedia.link, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-[#0052cc]/10 to-primary/10">
      {/* Mídia atual */}
      <div className="absolute inset-0">
        {currentMedia.type === "image" ? (
          <div
            className={`w-full h-full bg-cover bg-center transition-all duration-500 ${
              currentMedia.link ? "cursor-pointer hover:scale-105" : ""
            }`}
            style={{ backgroundImage: `url(${currentMedia.url})` }}
            onClick={handleMediaClick}
          />
        ) : (
          <video
            key={currentMedia.id}
            src={currentMedia.url}
            className="w-full h-full object-cover"
            autoPlay={isPlaying}
            muted
            playsInline
            onEnded={handleVideoEnded}
            onClick={handleMediaClick}
            style={{ cursor: currentMedia.link ? "pointer" : "default" }}
          />
        )}
      </div>

      {/* Overlay gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Indicador de slot (apenas se múltiplos sponsors) */}
      {sponsors.length > 1 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
            {currentIndex + 1}/{sponsors.length}
          </div>
        </div>
      )}

      {/* Barra de progresso (apenas se múltiplos sponsors) */}
      {sponsors.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
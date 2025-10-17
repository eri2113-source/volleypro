import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, X, Sparkles } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: string;
  status: string;
}

interface AdDisplayProps {
  type?: "banner" | "card" | "sidebar" | "story";
  className?: string;
}

export function AdDisplay({ type = "card", className = "" }: AdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApprovedAds();
  }, []);

  useEffect(() => {
    if (ads.length > 1 && type === "story") {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Troca a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [ads.length, type]);

  const loadApprovedAds = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/ads/approved`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao carregar anúncios");

      const data = await response.json();
      const filteredAds = (data.ads || []).filter((ad: Ad) => ad.type === type);
      setAds(filteredAds);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdClick = (ad: Ad) => {
    if (ad.linkUrl) {
      window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading || ads.length === 0 || !isVisible) {
    return null;
  }

  const currentAd = ads[currentIndex];

  // Banner Grande (Topo)
  if (type === "banner") {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="relative group cursor-pointer" onClick={() => handleAdClick(currentAd)}>
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-32 sm:h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">Anúncio</span>
                </div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-1">
                  {currentAd.title}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">
                  {currentAd.description}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {currentAd.linkUrl && (
              <Button
                size="sm"
                className="mt-3 w-fit bg-white text-black hover:bg-white/90"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Saiba Mais
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Card Médio (Feed)
  if (type === "card") {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="flex items-center justify-between p-3 bg-muted/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Anúncio</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div
          className="cursor-pointer group"
          onClick={() => handleAdClick(currentAd)}
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{currentAd.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {currentAd.description}
            </p>
            {currentAd.linkUrl && (
              <Button size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar
              </Button>
            )}
          </CardContent>
        </div>
      </Card>
    );
  }

  // Sidebar (Lateral)
  if (type === "sidebar") {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="flex items-center justify-between p-2 bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground">Anúncio</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleAdClick(currentAd)}
        >
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full aspect-square object-cover"
          />
          <div className="p-3">
            <h4 className="text-sm font-semibold mb-1 line-clamp-1">
              {currentAd.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {currentAd.description}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Story (Carrossel)
  if (type === "story") {
    return (
      <div className={`relative ${className}`}>
        <Card className="overflow-hidden">
          <div
            className="cursor-pointer"
            onClick={() => handleAdClick(currentAd)}
          >
            <div className="aspect-[9/16] max-h-96 overflow-hidden relative">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Anúncio</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">
                  {currentAd.title}
                </h4>
                <p className="text-white/90 text-xs line-clamp-2">
                  {currentAd.description}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Indicadores de progresso */}
        {ads.length > 1 && (
          <div className="flex gap-1 mt-2">
            {ads.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

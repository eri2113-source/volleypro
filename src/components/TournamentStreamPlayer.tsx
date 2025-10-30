import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Radio, Maximize, Users, Eye } from "lucide-react";
import { projectId } from '../utils/supabase/info';

interface StreamConfig {
  platform: 'youtube' | 'twitch' | 'facebook' | 'custom';
  embedUrl?: string;
  title?: string;
  isLive: boolean;
  startedAt?: string;
}

interface TournamentStreamPlayerProps {
  tournamentId: string;
}

export function TournamentStreamPlayer({ tournamentId }: TournamentStreamPlayerProps) {
  const [streamConfig, setStreamConfig] = useState<StreamConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewers] = useState(Math.floor(Math.random() * 150) + 50); // Simulado

  useEffect(() => {
    loadStreamConfig();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadStreamConfig, 30000);
    return () => clearInterval(interval);
  }, [tournamentId]);

  const loadStreamConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/stream-config`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.config && data.config.isLive && data.config.embedUrl) {
          setStreamConfig(data.config);
        } else {
          setStreamConfig(null);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar stream:', error);
      setStreamConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = () => {
    if (streamConfig?.embedUrl) {
      window.open(streamConfig.embedUrl, '_blank');
    }
  };

  if (loading) {
    return null;
  }

  if (!streamConfig || !streamConfig.isLive) {
    return null;
  }

  // Extrair URL do iframe se necessário
  let playerUrl = streamConfig.embedUrl || '';
  if (playerUrl.includes('<iframe')) {
    const srcMatch = playerUrl.match(/src="([^"]+)"/);
    if (srcMatch) {
      playerUrl = srcMatch[1];
    }
  }

  return (
    <Card className="overflow-hidden border-2 border-red-500 shadow-lg">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="animate-pulse">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              AO VIVO
            </Badge>
            {streamConfig.title && (
              <h3 className="text-white font-semibold text-sm sm:text-base">
                {streamConfig.title}
              </h3>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-white text-sm">
              <Eye className="h-4 w-4" />
              <span>{viewers.toLocaleString('pt-BR')}</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={openFullscreen}
              className="hidden sm:flex"
            >
              <Maximize className="h-4 w-4 mr-1" />
              Tela Cheia
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="relative aspect-video bg-black">
          <iframe
            src={playerUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={streamConfig.title || 'Transmissão ao vivo'}
          />
        </div>
        
        {/* Mobile controls */}
        <div className="sm:hidden flex items-center justify-between p-3 bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{viewers.toLocaleString('pt-BR')} assistindo</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={openFullscreen}
          >
            <Maximize className="h-4 w-4 mr-1" />
            Expandir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

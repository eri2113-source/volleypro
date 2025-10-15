import { useState, useEffect } from "react";
import { Radio, Eye, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { WebcamStream } from "./WebcamStream";
import { LiveStreamBroadcast } from "./LiveStreamBroadcast";
import { LiveKitBroadcaster } from "./LiveKitBroadcaster";
import { LiveKitViewer } from "./LiveKitViewer";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { authApi } from "../lib/api";

interface LiveVideoPlayerProps {
  live: any;
  isCreator: boolean;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: () => void;
}

export function LiveVideoPlayer({ live, isCreator, onStreamStart, onStreamStop }: LiveVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<any>(null);
  const [livekitConfigured, setLivekitConfigured] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Verificar se LiveKit está configurado
  useEffect(() => {
    checkLivekitStatus();
    loadCurrentUser();
  }, []);

  async function checkLivekitStatus() {
    try {
      console.log("🔍 Verificando streaming...");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/livekit/status`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();
      
      setLivekitConfigured(data.configured);
      
      if (data.configured) {
        console.log("✅ Streaming profissional ativado (LiveKit HD 60 FPS)");
      } else {
        console.log("ℹ️ Streaming básico ativado");
      }
    } catch (error) {
      console.error("❌ Erro ao verificar streaming:", error);
      setLivekitConfigured(false);
    }
  }

  async function loadCurrentUser() {
    try {
      const session = await authApi.getSession();
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email,
          email: session.user.email
        });
      }
    } catch (error: any) {
      // Silenciar erros de rede
      const isNetworkError = 
        error.message?.includes('Failed to fetch') ||
        error.name === 'TypeError';
      
      if (!isNetworkError) {
        console.error("❌ Erro ao carregar usuário:", error);
      }
    }
  }

  // DEBUG: Log dos dados da live
  useEffect(() => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎬 LIVE VIDEO PLAYER");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Dados da Live:");
    console.log("   • ID:", live?.id || "❌ Sem ID");
    console.log("   • Título:", live?.title || "❌ Sem título");
    console.log("   • Status:", live?.status || "❌ Sem status");
    console.log("   • Você é criador?", isCreator ? "✅ SIM" : "❌ NÃO");
    console.log("   • Viewers:", live?.viewers || 0);
    console.log("📡 Modo de Streaming:");
    console.log("   • Qualidade:", livekitConfigured ? "✅ HD 60 FPS (LiveKit)" : "✅ Padrão (WebRTC)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }, [live, isCreator, livekitConfigured]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds of no mouse movement
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
    
    return () => clearTimeout(timeout);
  }, [showControls]);

  function handleMouseMove() {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
  }

  // Aguardar verificação do LiveKit
  if (livekitConfigured === null || !currentUser) {
    return (
      <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Radio className="h-8 w-8 text-primary" />
          </div>
          <p className="text-white/80">Inicializando player...</p>
        </div>
      </div>
    );
  }

  // USAR LIVEKIT SE CONFIGURADO (qualidade profissional)
  if (livekitConfigured && live?.status === 'live') {
    console.log("🎥 Modo HD ativado (LiveKit)");
    
    return (
      <div 
        className="relative w-full h-full min-h-[400px] lg:min-h-[600px] bg-black"
        onMouseMove={handleMouseMove}
      >
        {isCreator ? (
          <LiveKitBroadcaster
            liveId={live.id}
            userId={currentUser.id}
            userName={currentUser.name}
            onDisconnect={onStreamStop}
          />
        ) : (
          <LiveKitViewer
            liveId={live.id}
            userId={currentUser.id}
            userName={currentUser.name}
          />
        )}
      </div>
    );
  }

  // MODO PADRÃO: WebRTC direto
  console.log("📹 Modo padrão ativado (WebRTC)");
  
  return (
    <div 
      className="relative w-full h-full min-h-[400px] lg:min-h-[600px] bg-black"
      onMouseMove={handleMouseMove}
    >
      <LiveStreamBroadcast
        liveId={live?.id}
        isCreator={isCreator}
        isLive={live?.status === 'live'}
        onStreamStart={onStreamStart}
        onStreamStop={onStreamStop}
      />
    </div>
  );
}

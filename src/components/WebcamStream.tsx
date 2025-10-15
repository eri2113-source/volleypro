import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Video, VideoOff, Mic, MicOff, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { WebcamPermissionGuide } from "./WebcamPermissionGuide";
import { testCameraAccess, stopMediaStream } from "../utils/cameraPermission";

interface WebcamStreamProps {
  isCreator: boolean;
  isLive: boolean;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: () => void;
}

export function WebcamStream({ isCreator, isLive, onStreamStart, onStreamStop }: WebcamStreamProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Se é creator e live está ativa, iniciar stream automaticamente
    if (isCreator && isLive && !stream) {
      startStream();
    }

    return () => {
      stopStream();
    };
  }, [isCreator, isLive]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  async function startStream() {
    setIsLoading(true);
    setError(null);

    const result = await testCameraAccess();

    if (result.success && result.stream) {
      setStream(result.stream);
      onStreamStart?.(result.stream);
      
      toast.success("Câmera ativada! 📹", {
        description: "Sua transmissão está no ar"
      });
    } else {
      setError(result.error || "Erro ao acessar câmera");
      toast.error("Erro ao ativar câmera", {
        description: result.error
      });
    }

    setIsLoading(false);
  }

  function stopStream() {
    stopMediaStream(stream);
    setStream(null);
    onStreamStop?.();
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function toggleVideo() {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        toast.info(videoTrack.enabled ? "Câmera ativada 📹" : "Câmera desativada 📴");
      }
    }
  }

  function toggleAudio() {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        toast.info(audioTrack.enabled ? "Microfone ativado 🎤" : "Microfone mudo 🔇");
      }
    }
  }

  // Se não é creator, mostrar mensagem
  if (!isCreator) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white/90 px-6">
          <Video className="h-24 w-24 mx-auto mb-4 text-red-500 animate-pulse" />
          <h3 className="text-xl mb-2">Aguardando transmissão...</h3>
          <p className="text-sm text-white/70 mb-4">
            O criador ainda não iniciou o vídeo ao vivo
          </p>
          <p className="text-xs text-white/40">
            🎥 Em breve: visualização do stream para espectadores
          </p>
        </div>
      </div>
    );
  }

  // Se é creator mas live não está ativa
  if (!isLive) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white/90 px-6">
          <Camera className="h-24 w-24 mx-auto mb-4 text-white/50" />
          <h3 className="text-xl mb-2">Live não iniciada</h3>
          <p className="text-sm text-white/70">
            Inicie a live para ativar a transmissão
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Mute próprio vídeo para evitar feedback
        className={`w-full h-full object-cover ${!isVideoEnabled ? 'opacity-0' : ''}`}
      />

      {/* Overlay quando vídeo está desabilitado */}
      {!isVideoEnabled && stream && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center text-white">
            <VideoOff className="h-16 w-16 mx-auto mb-4" />
            <p>Câmera desativada</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p>Ativando câmera...</p>
          </div>
        </div>
      )}

      {/* Error state - Webcam Permission Guide */}
      {error && !stream && (
        <WebcamPermissionGuide 
          error={error}
          onRetry={startStream}
        />
      )}

      {/* Controls (apenas se stream ativo) */}
      {stream && !isLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {/* Video toggle */}
          <Button
            size="icon"
            variant="outline"
            onClick={toggleVideo}
            className={`
              ${isVideoEnabled 
                ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
                : 'bg-red-500 text-white border-red-600 hover:bg-red-600'
              }
            `}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          {/* Audio toggle */}
          <Button
            size="icon"
            variant="outline"
            onClick={toggleAudio}
            className={`
              ${isAudioEnabled 
                ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
                : 'bg-red-500 text-white border-red-600 hover:bg-red-600'
              }
            `}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          {/* Status badge */}
          <Badge className="bg-red-500 ml-2">
            🔴 AO VIVO
          </Badge>
        </div>
      )}

      {/* Placeholder inicial */}
      {!stream && !isLoading && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center text-white">
            <Camera className="h-24 w-24 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl mb-2">Ative sua câmera</h3>
            <p className="text-sm text-white/70 mb-4">
              Clique no botão abaixo para iniciar a transmissão
            </p>
            <Button onClick={startStream} className="bg-red-500 hover:bg-red-600">
              <Video className="h-4 w-4 mr-2" />
              Ativar Câmera
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

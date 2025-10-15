import { useState, useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Video, VideoOff, Mic, MicOff, Camera, Loader2, Signal, SignalHigh, SignalLow } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { WebcamPermissionGuide } from "./WebcamPermissionGuide";
import { testCameraAccess, stopMediaStream } from "../utils/cameraPermission";

interface LiveStreamBroadcastProps {
  liveId: string;
  isCreator: boolean;
  isLive: boolean;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: () => void;
}

export function LiveStreamBroadcast({ 
  liveId, 
  isCreator, 
  isLive, 
  onStreamStart, 
  onStreamStop 
}: LiveStreamBroadcastProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receivedFrame, setReceivedFrame] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [frameCount, setFrameCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const broadcastInterval = useRef<any>(null);
  const supabase = createClient();

  // Iniciar webcam se for criador
  useEffect(() => {
    if (isCreator && isLive && !stream) {
      startStream();
    }

    return () => {
      stopStream();
      stopBroadcast();
    };
  }, [isCreator, isLive]);

  // Setup do video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Broadcast de frames se for criador
  useEffect(() => {
    if (isCreator && stream && isLive && isVideoEnabled) {
      startBroadcast();
    } else {
      stopBroadcast();
    }

    return () => stopBroadcast();
  }, [isCreator, stream, isLive, isVideoEnabled]);

  // Receber frames se for espectador
  useEffect(() => {
    if (!isCreator && isLive) {
      subscribeToFrames();
    }

    return () => {
      // Cleanup subscription
    };
  }, [isCreator, isLive, liveId]);

  async function startStream() {
    setIsLoading(true);
    setError(null);

    const result = await testCameraAccess();

    if (result.success && result.stream) {
      setStream(result.stream);
      setConnectionStatus('connected');
      onStreamStart?.(result.stream);
      
      toast.success("Câmera ativada! 📹", {
        description: "Transmitindo para seus espectadores"
      });
    } else {
      setError(result.error || "Erro ao acessar câmera");
      setConnectionStatus('disconnected');
      toast.error("Erro ao ativar câmera", {
        description: result.error
      });
    }

    setIsLoading(false);
  }

  function stopStream() {
    stopMediaStream(stream);
    setStream(null);
    setConnectionStatus('disconnected');
    onStreamStop?.();
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function captureFrame(): string | null {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return null;

    // Configurar canvas com tamanho do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenhar frame atual
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converter para base64 (JPEG com qualidade reduzida para performance)
    return canvas.toDataURL('image/jpeg', 0.6);
  }

  function startBroadcast() {
    stopBroadcast(); // Limpar qualquer broadcast anterior

    console.log("📡 Iniciando broadcast de frames...");
    setConnectionStatus('connecting');

    // Capturar e enviar frame a cada 1 segundo
    broadcastInterval.current = setInterval(async () => {
      const frameData = captureFrame();
      
      if (!frameData) {
        console.warn("⚠️ Não foi possível capturar frame");
        return;
      }

      try {
        // Enviar frame via Supabase Realtime
        const channel = supabase.channel(`live:${liveId}`);
        
        await channel.send({
          type: 'broadcast',
          event: 'frame',
          payload: {
            frame: frameData,
            timestamp: Date.now(),
            liveId
          }
        });

        setFrameCount(prev => prev + 1);
        setConnectionStatus('connected');
        
        if (frameCount === 0) {
          toast.success("Transmissão iniciada! 📡", {
            description: "Seus espectadores podem te ver"
          });
        }
      } catch (error) {
        console.error("❌ Erro ao enviar frame:", error);
        setConnectionStatus('disconnected');
      }
    }, 1000); // 1 frame por segundo
  }

  function stopBroadcast() {
    if (broadcastInterval.current) {
      clearInterval(broadcastInterval.current);
      broadcastInterval.current = null;
      console.log("🛑 Broadcast parado");
    }
  }

  async function subscribeToFrames() {
    console.log(`👁️ Inscrevendo-se para receber frames da live ${liveId}...`);
    setConnectionStatus('connecting');

    const channel = supabase.channel(`live:${liveId}`);

    channel
      .on('broadcast', { event: 'frame' }, (payload) => {
        console.log("📥 Frame recebido!", payload);
        
        if (payload.payload.frame) {
          setReceivedFrame(payload.payload.frame);
          setConnectionStatus('connected');
          setFrameCount(prev => prev + 1);
        }
      })
      .subscribe((status) => {
        console.log("📡 Status da inscrição:", status);
        
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          toast.success("Conectado à transmissão! 📡");
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
          toast.error("Erro ao conectar à transmissão");
        }
      });

    return () => {
      channel.unsubscribe();
    };
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

  // Status indicator
  function getStatusIcon() {
    switch (connectionStatus) {
      case 'connected':
        return <SignalHigh className="h-4 w-4 text-green-500 animate-pulse" />;
      case 'connecting':
        return <Signal className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'disconnected':
        return <SignalLow className="h-4 w-4 text-red-500" />;
    }
  }

  // VIEWER (Espectador) - Ver frames recebidos
  if (!isCreator) {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-blue-900/30 to-black overflow-hidden">
        {receivedFrame ? (
          <>
            {/* Frame recebido */}
            <img 
              src={receivedFrame} 
              alt="Live stream"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay com info */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
              {getStatusIcon()}
              <span className="text-white text-sm">
                {connectionStatus === 'connected' ? `Ao vivo • ${frameCount} frames` : 'Conectando...'}
              </span>
            </div>

            {/* Badge status viewer */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg">
                👁️ Assistindo
              </Badge>
            </div>
          </>
        ) : (
          // Aguardando primeiro frame
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
              <h3 className="text-xl mb-2">Conectando à transmissão...</h3>
              <p className="text-sm text-white/70 mb-4">
                {connectionStatus === 'connected' 
                  ? 'Aguardando primeiro frame do criador...' 
                  : 'Estabelecendo conexão...'}
              </p>
              <Badge variant="outline" className="text-white border-white/30">
                {getStatusIcon()}
                <span className="ml-2">{connectionStatus}</span>
              </Badge>
            </div>
          </div>
        )}
      </div>
    );
  }

  // CREATOR (Criador) - Transmitir
  return (
    <div className="relative aspect-video bg-black overflow-hidden">
      {/* Canvas escondido para captura de frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${!isVideoEnabled ? 'opacity-0' : ''}`}
      />

      {/* Info da transmissão */}
      {stream && !isLoading && (
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
            {getStatusIcon()}
            <span className="text-white text-sm">
              {connectionStatus === 'connected' 
                ? `Transmitindo • ${frameCount} frames enviados` 
                : connectionStatus === 'connecting'
                ? 'Iniciando transmissão...'
                : 'Desconectado'}
            </span>
          </div>
          
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 w-fit shadow-lg">
            ⚡ Streaming Ativo
          </Badge>
        </div>
      )}

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

      {/* Controls */}
      {stream && !isLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
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

          <Badge className="bg-red-500 ml-2">
            🔴 TRANSMITINDO
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
              Seus espectadores poderão te ver em tempo real
            </p>
            <Button onClick={startStream} className="bg-red-500 hover:bg-red-600">
              <Video className="h-4 w-4 mr-2" />
              Iniciar Transmissão
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

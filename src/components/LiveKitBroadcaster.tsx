import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer, ControlBar, useRoomContext } from '@livekit/components-react';
import '@livekit/components-styles';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, Radio, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { WebcamPermissionGuide } from './WebcamPermissionGuide';
import { testCameraAccess, stopMediaStream } from '../utils/cameraPermission';

interface LiveKitBroadcasterProps {
  liveId: string;
  userId: string;
  userName: string;
  onDisconnect?: () => void;
}

export function LiveKitBroadcaster({ 
  liveId, 
  userId, 
  userName,
  onDisconnect 
}: LiveKitBroadcasterProps) {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    checkCameraPermission();
  }, [liveId, userId]);

  async function checkCameraPermission() {
    const result = await testCameraAccess();

    if (result.success && result.stream) {
      // Permissão obtida! Fechar o stream de teste
      stopMediaStream(result.stream);
      console.log("✅ Permissão da câmera concedida!");
      
      // Agora pode buscar o token
      fetchBroadcasterToken();
    } else {
      setPermissionError(result.error || "Erro ao acessar câmera");
      setIsLoading(false);
      
      toast.error("Permissão da câmera necessária", {
        description: result.error
      });
    }
  }

  async function fetchBroadcasterToken() {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🎥 Solicitando token de broadcaster...", { liveId, userId, userName });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/livekit/broadcaster-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ liveId, userId, userName })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.configured) {
        throw new Error(data.error || 'Failed to get broadcaster token');
      }
      
      console.log("✅ Token de broadcaster recebido!");
      
      setToken(data.token);
      setWsUrl(data.wsUrl);
      
      toast.success("Conectado ao LiveKit! 🎥", {
        description: "Iniciando transmissão profissional HD..."
      });
    } catch (err: any) {
      console.error("❌ Error fetching token:", err);
      setError(err.message);
      toast.error("Erro ao conectar ao LiveKit", {
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Erro de permissão da câmera
  if (permissionError) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg relative">
        <WebcamPermissionGuide 
          error={permissionError}
          onRetry={checkCameraPermission}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg mb-2">Conectando ao servidor LiveKit...</p>
          <p className="text-sm text-white/60">Preparando transmissão profissional</p>
        </div>
      </div>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-red-900 to-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl mb-2">Erro na conexão com LiveKit</h3>
          <p className="text-sm text-white/70 mb-4">
            {error || "Token inválido. Verifique se o LiveKit está configurado."}
          </p>
          <div className="bg-black/40 rounded-lg p-4 mb-4 text-left">
            <p className="text-xs text-white/50 mb-2">Para configurar o LiveKit:</p>
            <ol className="text-xs text-white/70 space-y-1 list-decimal list-inside">
              <li>Crie conta em cloud.livekit.io</li>
              <li>Gere API keys no dashboard</li>
              <li>Configure os secrets no Supabase</li>
            </ol>
          </div>
          <Button onClick={fetchBroadcasterToken} variant="outline" className="bg-white/10 border-white/20">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Badge de transmissão */}
      <div className="absolute top-4 left-4 z-50">
        <Badge className="bg-red-500 text-white px-4 py-2 shadow-2xl shadow-red-500/50 border-0">
          <Radio className="h-4 w-4 mr-2 animate-pulse" />
          <span className="font-bold">TRANSMITINDO AO VIVO HD</span>
        </Badge>
      </div>

      {/* LiveKit Room */}
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        connect={true}
        audio={true}
        video={true}
        onDisconnected={onDisconnect}
        onError={(error) => {
          console.error("❌ Erro no LiveKit Room:", error);
          
          // Se for erro de permissão de mídia
          if (error.message && (
            error.message.includes('permission') || 
            error.message.includes('NotAllowed') ||
            error.message.includes('denied')
          )) {
            setPermissionError("Permissão negada. Permita o acesso à câmera e microfone.");
          } else {
            toast.error("Erro na transmissão", {
              description: error.message || "Tente reconectar"
            });
          }
        }}
        className="livekit-room-broadcaster"
        data-lk-theme="default"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

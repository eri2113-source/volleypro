import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LiveKitViewerProps {
  liveId: string;
  userId: string;
  userName: string;
}

export function LiveKitViewer({ liveId, userId, userName }: LiveKitViewerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchViewerToken();
  }, [liveId, userId]);

  async function fetchViewerToken() {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("👁️ Solicitando token de viewer...", { liveId, userId, userName });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/livekit/viewer-token`,
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
        throw new Error(data.error || 'Failed to get viewer token');
      }
      
      console.log("✅ Token de viewer recebido!");
      
      setToken(data.token);
      setWsUrl(data.wsUrl);
      
      toast.success("Conectado! 📺", {
        description: "Assistindo transmissão ao vivo em HD"
      });
    } catch (err: any) {
      console.error("❌ Error fetching token:", err);
      setError(err.message);
      toast.error("Erro ao conectar");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 via-blue-900/30 to-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg mb-2">Conectando à transmissão...</p>
          <p className="text-sm text-white/60">Aguarde alguns instantes</p>
        </div>
      </div>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-xl mb-2">Erro na conexão</h3>
          <p className="text-sm text-white/70 mb-4">
            {error || "Não foi possível conectar à transmissão."}
          </p>
          <Button onClick={fetchViewerToken} variant="outline" className="bg-white/10 border-white/20">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Badge de visualização */}
      <div className="absolute top-4 left-4 z-50">
        <Badge className="bg-primary text-white px-4 py-2 shadow-2xl shadow-primary/50 border-0">
          <Eye className="h-4 w-4 mr-2" />
          <span className="font-bold">ASSISTINDO AO VIVO HD</span>
        </Badge>
      </div>

      {/* LiveKit Room */}
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        connect={true}
        audio={true}
        video={true}
        className="livekit-room-viewer"
        data-lk-theme="default"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

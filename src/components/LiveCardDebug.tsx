import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Radio, Eye, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface LiveCardDebugProps {
  live: any;
  onClick: () => void;
}

export function LiveCardDebug({ live, onClick }: LiveCardDebugProps) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [showDebug, setShowDebug] = useState(false);

  // Gradientes de fallback
  const fallbackGradients = [
    "from-blue-600 via-blue-500 to-primary",
    "from-orange-600 via-orange-500 to-secondary",
    "from-purple-600 via-purple-500 to-pink-500",
    "from-green-600 via-green-500 to-emerald-500",
  ];

  const fallbackImages = [
    "https://images.unsplash.com/photo-1664106588879-5480437fb30f?w=800&q=80",
    "https://images.unsplash.com/photo-1758634025517-782312745372?w=800&q=80",
    "https://images.unsplash.com/photo-1686753767878-2f5fb25e43ac?w=800&q=80",
    "https://images.unsplash.com/photo-1760037028485-d00dd2b8f6f0?w=800&q=80",
  ];

  function getDefaultThumbnail(liveId: string) {
    const hash = liveId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackImages[hash % fallbackImages.length];
  }

  function getDefaultGradient(liveId: string) {
    const hash = liveId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackGradients[hash % fallbackGradients.length];
  }

  const thumbnailUrl = live.thumbnailUrl || getDefaultThumbnail(live.id);
  const gradientClass = getDefaultGradient(live.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video cursor-pointer overflow-hidden" onClick={onClick}>
        {/* Background gradiente (SEMPRE visível) */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
        
        {/* Thumbnail */}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={live.title}
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={() => {
              setImageStatus('success');
              console.log("✅ Imagem carregada:", thumbnailUrl);
            }}
            onError={(e) => {
              setImageStatus('error');
              console.error("❌ Erro ao carregar imagem:", thumbnailUrl);
              // Esconder imagem que falhou
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        
        {/* Ícone decorativo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Radio className="h-20 w-20 text-white/20" />
        </div>
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        {live.status === 'live' && (
          <Badge className="absolute top-4 left-4 bg-red-500 z-10">
            <Radio className="h-3 w-3 mr-1 animate-pulse" />
            AO VIVO
          </Badge>
        )}
        {live.status === 'scheduled' && (
          <Badge className="absolute top-4 left-4 z-10" variant="secondary">
            📅 Programada
          </Badge>
        )}

        {/* Viewer count */}
        {live.status === 'live' && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1 z-10">
            <Eye className="h-3 w-3" />
            {live.viewers?.toLocaleString() || 0}
          </div>
        )}

        {/* Debug indicator */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDebug(!showDebug);
          }}
          className="absolute top-4 right-4 z-20 bg-black/70 text-white p-1 rounded hover:bg-black/90"
        >
          {imageStatus === 'loading' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
          {imageStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
          {imageStatus === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
        </button>
      </div>

      {/* Debug info */}
      {showDebug && (
        <div className="p-3 bg-black/90 text-white text-xs space-y-1">
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <span className={
              imageStatus === 'success' ? 'text-green-400' :
              imageStatus === 'error' ? 'text-red-400' :
              'text-yellow-400'
            }>
              {imageStatus}
            </span>
          </div>
          <div><strong>ID:</strong> {live.id}</div>
          <div><strong>Título:</strong> {live.title}</div>
          <div className="break-all">
            <strong>Thumbnail Custom:</strong> {live.thumbnailUrl || 'null'}
          </div>
          <div className="break-all">
            <strong>Thumbnail Auto:</strong> {thumbnailUrl}
          </div>
          <div>
            <strong>Gradiente:</strong> {gradientClass}
          </div>
        </div>
      )}

      {/* Title */}
      <div className="p-4">
        <h3 className="font-semibold truncate">{live.title}</h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span>{live.creator?.name || 'Criador'}</span>
          {live.scheduledFor && (
            <span>• {new Date(live.scheduledFor).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

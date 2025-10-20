import { useState, useEffect } from "react";
import { Radio, Eye, Calendar, Play, Video, Loader2, Trash2, Share2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CreateLiveModal } from "./CreateLiveModal";
import { LivePlayer } from "./LivePlayer";
import { LoginPrompt } from "./LoginPrompt";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LiveCardDebug } from "./LiveCardDebug";
import { liveApi, authApi, masterAdminApi } from "../lib/api";
import { toast } from "sonner@2.0.3";

interface LivesProps {
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
}

export function Lives({ isAuthenticated = false, onLoginPrompt }: LivesProps) {
  const [lives, setLives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLiveId, setSelectedLiveId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    loadLives();
    if (isAuthenticated) {
      setCurrentUserId(authApi.getCurrentUserId());
      checkMasterStatus();
    }
  }, [isAuthenticated]);

  async function loadLives() {
    setLoading(true);
    try {
      const { lives: allLives } = await liveApi.getLives();
      console.log("📺 Lives carregadas:", allLives?.length || 0);
      setLives(allLives || []);
    } catch (error) {
      console.error("❌ Erro ao carregar lives:", error);
      setLives([]);
    } finally {
      setLoading(false);
    }
  }

  async function checkMasterStatus() {
    try {
      const { isMaster: masterStatus } = await masterAdminApi.checkMasterStatus();
      setIsMaster(masterStatus);
    } catch (error) {
      setIsMaster(false);
    }
  }

  async function handleDeleteLive(liveId: string, liveTitle: string) {
    if (!confirm(`Tem certeza que deseja deletar a live "${liveTitle}"?`)) return;

    try {
      await liveApi.deleteLive(liveId);
      toast.success("Live deletada com sucesso!");
      await loadLives();
    } catch (error: any) {
      console.error("❌ Erro ao deletar live:", error);
      toast.error("Erro ao deletar live");
    }
  }

  function handleShare(live: any) {
    const url = `${window.location.origin}?live=${live.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!", {
      description: `Compartilhe: ${live.title}`
    });
  }

  // Filtrar lives por status
  const liveNow = lives.filter(l => l.status === 'live');
  const upcoming = lives.filter(l => l.status === 'scheduled');
  const ended = lives.filter(l => l.status === 'ended');

  // Gradientes de fallback para lives (sempre funcionam!)
  const fallbackGradients = [
    "from-blue-600 via-blue-500 to-primary", // azul
    "from-orange-600 via-orange-500 to-secondary", // laranja
    "from-purple-600 via-purple-500 to-pink-500", // roxo
    "from-green-600 via-green-500 to-emerald-500", // verde
  ];

  // Imagens de fallback para lives (tenta usar, mas tem fallback visual)
  const fallbackImages = [
    "https://images.unsplash.com/photo-1664106588879-5480437fb30f?w=800&q=80", // volleyball game
    "https://images.unsplash.com/photo-1758634025517-782312745372?w=800&q=80", // volleyball court
    "https://images.unsplash.com/photo-1686753767878-2f5fb25e43ac?w=800&q=80", // volleyball training
    "https://images.unsplash.com/photo-1760037028485-d00dd2b8f6f0?w=800&q=80", // sports broadcast
  ];

  function getDefaultThumbnail(liveId: string) {
    // Usar hash simples do ID para escolher uma imagem consistente
    const hash = liveId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackImages[hash % fallbackImages.length];
  }

  function getDefaultGradient(liveId: string) {
    const hash = liveId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackGradients[hash % fallbackGradients.length];
  }

  function LiveCard({ live }: { live: any }) {
    const isCreator = currentUserId === live.creatorId;
    const canDelete = isCreator || isMaster;
    const thumbnailUrl = live.thumbnailUrl || getDefaultThumbnail(live.id);
    const gradientClass = getDefaultGradient(live.id);

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div 
          className="relative aspect-video cursor-pointer overflow-hidden"
          onClick={() => setSelectedLiveId(live.id)}
        >
          {/* Background gradiente (SEMPRE visível) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
          
          {/* Thumbnail (tenta carregar por cima do gradiente) */}
          {thumbnailUrl && (
            <div className="absolute inset-0">
              <ImageWithFallback
                src={thumbnailUrl}
                alt={live.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Ícone decorativo (sempre visível) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="h-20 w-20 text-white/20" />
          </div>
          
          {/* Overlay gradiente para melhor legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status badge */}
          {live.status === 'live' && (
            <Badge className="absolute top-4 left-4 bg-red-500">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              AO VIVO
            </Badge>
          )}
          {live.status === 'scheduled' && (
            <Badge className="absolute top-4 left-4" variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              Programada
            </Badge>
          )}
          {live.status === 'ended' && (
            <Badge className="absolute top-4 left-4" variant="outline">
              Encerrada
            </Badge>
          )}

          {/* Viewer count (apenas para lives ao vivo) */}
          {live.status === 'live' && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {live.viewers?.toLocaleString() || 0}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Creator info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8 border border-primary">
              <AvatarImage src={live.creator?.photoUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {live.creator?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{live.creator?.name}</p>
              {live.creator?.verified && (
                <Badge variant="outline" className="text-xs">Verificado</Badge>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-1 line-clamp-2">{live.title}</h3>

          {/* Description */}
          {live.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {live.description}
            </p>
          )}

          {/* Scheduled time */}
          {live.status === 'scheduled' && live.scheduledFor && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              {new Date(live.scheduledFor).toLocaleString('pt-BR')}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={() => setSelectedLiveId(live.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              {live.status === 'live' ? 'Assistir' : 'Ver Detalhes'}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleShare(live)}
            >
              <Share2 className="h-4 w-4" />
            </Button>

            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleDeleteLive(live.id, live.title)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar Live
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12">
        <LoginPrompt 
          title="Lives ao Vivo"
          description="Assista e transmita jogos, treinos e eventos de vôlei ao vivo. Crie sua própria live e compartilhe com o mundo!"
          onLoginClick={onLoginPrompt}
        />
      </div>
    );
  }



  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="bg-gradient-to-r from-red-500 via-red-600 to-primary bg-clip-text text-transparent">
              Lives
            </h1>
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/20">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              AO VIVO
            </Badge>
          </div>
          <p className="text-muted-foreground">Transmissões profissionais de jogos, treinos e eventos de vôlei</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 shadow-lg shadow-red-500/30"
        >
          <Video className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Iniciar Transmissão</span>
          <span className="sm:hidden">Criar Live</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList>
          <TabsTrigger value="live">
            <Radio className="h-4 w-4 mr-2" />
            Ao Vivo ({liveNow.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Programadas ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="recordings">
            <Video className="h-4 w-4 mr-2" />
            Gravações ({ended.length})
          </TabsTrigger>
        </TabsList>

        {/* Live Now */}
        <TabsContent value="live" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando lives...</p>
              </CardContent>
            </Card>
          ) : liveNow.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Radio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Nenhuma live ao vivo agora</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Seja o primeiro a transmitir!
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Video className="h-4 w-4 mr-2" />
                  Iniciar Transmissão
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveNow.map(live => (
                <LiveCard key={live.id} live={live} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Upcoming */}
        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando...</p>
              </CardContent>
            </Card>
          ) : upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Nenhuma live programada</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Agende uma transmissão para o futuro
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Live
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(live => (
                <LiveCard key={live.id} live={live} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Recordings/Ended */}
        <TabsContent value="recordings" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando...</p>
              </CardContent>
            </Card>
          ) : ended.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Nenhuma gravação disponível</h3>
                <p className="text-muted-foreground text-sm">
                  As transmissões encerradas aparecerão aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ended.map(live => (
                <LiveCard key={live.id} live={live} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-red-500/10 via-primary/5 to-primary/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="flex items-center gap-2">
                <span>Streaming Profissional</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  ✨ Disponível Agora
                </Badge>
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                <strong>Transmissões em alta qualidade</strong> para Fãs, Atletas e Times. Compartilhe jogos, treinos, bastidores e eventos ao vivo com qualidade profissional.
              </p>
              <ul className="text-sm space-y-1 mb-4 text-muted-foreground">
                <li>✅ <strong>Qualidade HD adaptativa</strong> - melhor vídeo para cada conexão</li>
                <li>✅ <strong>Chat ao vivo</strong> - interaja com espectadores em tempo real</li>
                <li>✅ <strong>Contador de visualizações</strong> - veja quantas pessoas assistem</li>
                <li>✅ <strong>Transmissão imediata ou agendada</strong> - você escolhe quando</li>
                <li>✅ <strong>Compartilhamento fácil</strong> - envie para redes sociais</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 shadow-lg shadow-red-500/20">
                  <Radio className="h-4 w-4 mr-2" />
                  Criar Transmissão
                </Button>
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                  🎥 Aberto para todos
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/20">
                  ⚡ Streaming em tempo real
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateLiveModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={async () => {
          await loadLives();
        }}
      />

      {selectedLiveId && (
        <LivePlayer
          liveId={selectedLiveId}
          open={!!selectedLiveId}
          onClose={() => setSelectedLiveId(null)}
          onLiveEnded={async () => {
            await loadLives();
          }}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, TrendingUp, Trophy, Users, Heart, MapPin, UserPlus, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { userApi } from "../lib/api";
import { formatHeight, formatWeight } from "../utils/formatters";

interface AthleteProfileProps {
  athleteId: number;
  onBack: () => void;
}

interface AthleteData {
  id: number;
  name: string;
  nickname?: string;
  position?: string;
  age?: number;
  height?: string;
  currentTeam?: string;
  verified?: boolean;
  followers?: number;
  photoUrl?: string;
  bio?: string;
  achievements?: string[];
  userType: string;
}

export function AthleteProfile({ athleteId, onBack }: AthleteProfileProps) {
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  // Carregar dados do atleta
  useEffect(() => {
    loadAthleteData();
    checkIfFollowing();
  }, [athleteId]);

  async function loadAthleteData() {
    setLoadingProfile(true);
    try {
      console.log('🔍 Buscando perfil do atleta ID:', athleteId);
      
      // Buscar perfil REAL do usuário via API
      const userData = await userApi.getUser(athleteId.toString());
      
      console.log('✅ Dados do atleta carregados:', userData);
      console.log('📊 Followers recebidos da API:', userData.followers);
      
      // Mapear dados da API para o formato esperado
      const athleteProfile: AthleteData = {
        id: userData.id,
        name: userData.name || userData.full_name || 'Atleta',
        nickname: userData.nickname || userData.name,
        position: userData.position || 'Não informado',
        age: userData.age,
        // Garantir que altura seja sempre string ou undefined
        height: userData.height ? String(userData.height) : undefined,
        currentTeam: userData.current_team || userData.team,
        verified: userData.verified || false,
        followers: userData.followers !== undefined ? userData.followers : 0,
        photoUrl: userData.photo_url || userData.photoUrl,
        bio: userData.bio || userData.description,
        // Garantir que achievements seja sempre um array
        achievements: Array.isArray(userData.achievements) ? userData.achievements : [],
        userType: userData.user_type || userData.userType || 'athlete'
      };
      
      console.log('📊 Followers no perfil mapeado:', athleteProfile.followers);
      setAthlete(athleteProfile);
    } catch (error) {
      console.error('❌ Erro ao carregar perfil do atleta:', error);
      toast.error('Erro ao carregar perfil do atleta');
      
      // Se falhar, deixar como null para mostrar mensagem de "não encontrado"
      setAthlete(null);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function checkIfFollowing() {
    try {
      // Aqui você pode implementar a lógica para verificar se está seguindo
      // Por enquanto, vamos verificar no localStorage
      const followingList = JSON.parse(localStorage.getItem('volleypro_following') || '[]');
      setIsFollowing(followingList.includes(athleteId));
    } catch (error) {
      console.error('Erro ao verificar seguindo:', error);
    }
  }

  async function handleFollowToggle() {
    // Se já está seguindo, pedir confirmação antes de deixar de seguir
    if (isFollowing) {
      setShowUnfollowConfirm(true);
      return;
    }

    // Se não está seguindo, seguir diretamente
    await performFollow();
  }

  async function performUnfollow() {
    setLoading(true);
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following') || '[]');
      const newList = followingList.filter((id: number) => id !== athleteId);
      localStorage.setItem('volleypro_following', JSON.stringify(newList));
      setIsFollowing(false);
      toast.success(`Você deixou de seguir ${athlete?.name}`);
    } catch (error) {
      console.error('Erro ao deixar de seguir:', error);
      toast.error('Erro ao atualizar status de seguidor');
    } finally {
      setLoading(false);
      setShowUnfollowConfirm(false);
    }
  }

  async function performFollow() {
    setLoading(true);
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following') || '[]');
      followingList.push(athleteId);
      localStorage.setItem('volleypro_following', JSON.stringify(followingList));
      setIsFollowing(true);
      toast.success(`Agora você está seguindo ${athlete?.name}! 🎉`);
    } catch (error) {
      console.error('Erro ao seguir:', error);
      toast.error('Erro ao atualizar status de seguidor');
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-40 w-40 bg-muted rounded-full mx-auto"></div>
          <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-muted-foreground">Atleta não encontrado</p>
        <Button onClick={onBack} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 w-full max-w-full overflow-x-hidden">
      <div className="bg-gradient-to-br from-primary via-primary to-secondary pb-20 sm:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto py-4 sm:py-6 relative z-10 px-4">
          <Button variant="ghost" onClick={onBack} className="mb-4 sm:mb-6 text-white hover:bg-white/20 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {/* Layout responsivo: vertical em mobile, horizontal em desktop */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
            <Avatar className="h-28 w-28 sm:h-40 sm:w-40 border-4 border-white shadow-2xl ring-4 ring-white/20 shrink-0">
              {athlete.photoUrl ? (
                <AvatarImage 
                  src={athlete.photoUrl} 
                  alt={athlete.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="text-4xl bg-gradient-to-br from-white to-gray-100 text-primary">
                {athlete.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl">{athlete.name}</h1>
                    {athlete.verified && (
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white shrink-0" />
                    )}
                  </div>
                  <p className="text-white/90 text-base sm:text-lg md:text-xl">{athlete.position}</p>
                </div>
                <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                  <Button 
                    onClick={handleFollowToggle}
                    disabled={loading}
                    size="sm"
                    className={
                      isFollowing 
                        ? "bg-muted text-foreground hover:bg-muted/80"
                        : "bg-white text-primary hover:bg-white/90"
                    }
                  >
                    <Heart className={`h-4 w-4 mr-1 sm:mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    <span className="text-xs sm:text-sm">{loading ? 'Aguarde...' : isFollowing ? 'Seguindo' : 'Seguir'}</span>
                  </Button>
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                    <span className="text-xs sm:text-sm">Mensagem</span>
                  </Button>
                </div>
              </div>

              {!athlete.currentTeam && (
                <Badge variant="secondary" className="mb-3 sm:mb-4 mx-auto sm:mx-0 block w-fit">
                  <MapPin className="h-3 w-3 mr-1" />
                  Livre no mercado
                </Badge>
              )}

              {/* Grid responsivo: 3 colunas em mobile pequeno, melhor espaçamento */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-2 sm:p-4 text-center">
                    <p className="text-muted-foreground text-xs sm:text-sm">Seguidores</p>
                    <p className="text-base sm:text-xl md:text-2xl font-semibold">{(athlete.followers || 0).toLocaleString('pt-BR')}</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardContent className="p-2 sm:p-4 text-center">
                    <p className="text-muted-foreground text-xs sm:text-sm">Idade</p>
                    <p className="text-base sm:text-xl md:text-2xl font-semibold">{athlete.age || '-'}</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardContent className="p-2 sm:p-4 text-center">
                    <p className="text-muted-foreground text-xs sm:text-sm">Altura</p>
                    <p className="text-base sm:text-xl md:text-2xl font-semibold">{formatHeight(athlete.height)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto -mt-16 sm:-mt-24 px-4">
        <Tabs defaultValue="posts" className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
              <TabsTrigger value="posts" className="text-xs sm:text-sm px-2 sm:px-4">Postagens</TabsTrigger>
              <TabsTrigger value="panel" className="text-xs sm:text-sm px-2 sm:px-4">Painel</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs sm:text-sm px-2 sm:px-4">Estatísticas</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm px-2 sm:px-4">Conquistas</TabsTrigger>
              <TabsTrigger value="gallery" className="text-xs sm:text-sm px-2 sm:px-4">Galeria</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="space-y-6">
            {/* Estado vazio - aguardando implementação do backend */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2">Nenhuma postagem ainda</h3>
                <p className="text-muted-foreground">
                  Este atleta ainda não fez nenhuma publicação
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="panel" className="space-y-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <h3>Informações Pessoais</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {athlete.age && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idade:</span>
                    <span>{athlete.age} anos</span>
                  </div>
                )}
                {athlete.height && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altura:</span>
                    <span>{formatHeight(athlete.height)}</span>
                  </div>
                )}
                {athlete.position && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posição:</span>
                    <span>{athlete.position}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Atual:</span>
                  <span>{athlete.currentTeam || "Sem time"}</span>
                </div>
                {athlete.bio && (
                  <div className="pt-3 border-t">
                    <span className="text-muted-foreground block mb-2">Sobre:</span>
                    <p className="text-sm">{athlete.bio}</p>
                  </div>
                )}
                
                {/* Se não tiver informações suficientes */}
                {!athlete.age && !athlete.height && !athlete.position && !athlete.bio && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma informação adicional disponível
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Conquistas (apenas se houver) */}
            {athlete.achievements && athlete.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <h3>Principais Conquistas</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {athlete.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2">Estatísticas não disponíveis</h3>
                <p className="text-muted-foreground">
                  As estatísticas do atleta serão exibidas quando houver dados registrados
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <h3>Histórico de Conquistas</h3>
              </CardHeader>
              <CardContent>
                {athlete.achievements && athlete.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {athlete.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                          <Trophy className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h4>{achievement}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p>Nenhuma conquista registrada ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="mb-2">Galeria vazia</h3>
                <p className="text-muted-foreground">
                  Nenhuma foto foi adicionada ainda
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de confirmação para deixar de seguir */}
      <AlertDialog open={showUnfollowConfirm} onOpenChange={setShowUnfollowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deixar de seguir {athlete.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deixar de seguir este atleta? Você não verá mais as atualizações no seu feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={performUnfollow}>
              Sim, deixar de seguir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { 
  ArrowLeft, CheckCircle2, Trophy, Users, Heart, MapPin, Plus, Calendar, Star,
  Shield, TrendingUp, Target, Award, BarChart3, AlertCircle, X, UserMinus,
  Clock, Flag, Medal, Trash2, Edit, Save, MessageCircle
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { formatHeight } from "../utils/formatters";
import { authApi } from "../lib/api";

interface TeamProfileProps {
  teamId: number;
  onBack: () => void;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
  verified?: boolean;
  // Avaliações
  ratings?: {
    attack: number;
    defense: number;
    serve: number;
    block: number;
    overall: number;
  };
  lastEvaluated?: string;
  needsEvaluation?: boolean;
  joinedAt?: string;
}

interface FormerPlayer {
  id: string;
  name: string;
  position: string;
  years: string;
  photoUrl?: string;
}

interface Tournament {
  id: string;
  name: string;
  year: number;
  position: string;
  trophy: string;
}

interface TeamData {
  id: number;
  name: string;
  city?: string;
  founded?: number;
  verified?: boolean;
  followers?: number;
  championships?: number;
  players?: Player[];
  formerPlayers?: FormerPlayer[];
  tournaments?: Tournament[];
  photoUrl?: string;
  bio?: string;
  isOwner?: boolean;
}

export function TeamProfile({ teamId, onBack }: TeamProfileProps) {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showDeletePlayerConfirm, setShowDeletePlayerConfirm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Estados para edição da escalação
  const [rosterEdit, setRosterEdit] = useState<{
    position: string;
    playerId: string;
  }[]>([]);

  // Estados para avaliação de atleta
  const [evaluation, setEvaluation] = useState({
    attack: 50,
    defense: 50,
    serve: 50,
    block: 50,
    notes: ""
  });

  useEffect(() => {
    loadTeamData();
    checkIfFollowing();
    checkCurrentUser();
  }, [teamId]);

  async function checkCurrentUser() {
    try {
      const userId = authApi.getCurrentUserId();
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Erro ao verificar usuário atual:', error);
    }
  }

  async function loadTeamData() {
    setLoading(true);
    try {
      console.log('🔍 Buscando perfil do time ID:', teamId);
      
      // Buscar perfil REAL do time via API
      const { userApi } = await import("../lib/api");
      const userData = await userApi.getUser(teamId.toString());
      
      console.log('✅ Dados do time carregados:', userData);
      
      // Verificar se é dono do time
      const userId = authApi.getCurrentUserId();
      const isOwner = userId === userData.id.toString();
      
      // Mapear dados da API para o formato esperado
      const teamProfile: TeamData = {
        id: userData.id,
        name: userData.name || userData.team_name || 'Time',
        city: userData.city || userData.location,
        founded: userData.founded || userData.founded_year,
        verified: userData.verified || false,
        followers: userData.followers || 0,
        championships: userData.championships || 0,
        players: parsePlayers(userData.players || userData.teamMembers || userData.team_members),
        formerPlayers: parseFormerPlayers(userData.former_players),
        tournaments: parseTournaments(userData.tournaments),
        photoUrl: userData.photo_url || userData.photoUrl,
        bio: userData.bio || userData.description,
        isOwner
      };
      
      setTeam(teamProfile);
    } catch (error) {
      console.error('❌ Erro ao carregar time:', error);
      toast.error('Erro ao carregar dados do time');
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }

  function parsePlayers(playersData: any): Player[] {
    if (!playersData) return [];
    if (!Array.isArray(playersData)) return [];
    
    return playersData.map((p: any) => ({
      id: p.id || p.user_id || String(Math.random()),
      name: p.name || 'Jogador',
      position: p.position || 'Não definida',
      number: p.number || p.jersey_number || 0,
      age: p.age,
      height: p.height,
      photoUrl: p.photo_url || p.photoUrl,
      verified: p.verified || false,
      ratings: p.ratings || {
        attack: 50,
        defense: 50,
        serve: 50,
        block: 50,
        overall: 50
      },
      lastEvaluated: p.last_evaluated || p.lastEvaluated,
      needsEvaluation: checkNeedsEvaluation(p.last_evaluated || p.lastEvaluated),
      joinedAt: p.joined_at || p.joinedAt
    }));
  }

  function parseFormerPlayers(formerData: any): FormerPlayer[] {
    if (!formerData) return [];
    if (!Array.isArray(formerData)) return [];
    
    return formerData.map((p: any) => ({
      id: p.id || String(Math.random()),
      name: p.name || 'Ex-Jogador',
      position: p.position || 'Não definida',
      years: p.years || 'Período não informado',
      photoUrl: p.photo_url || p.photoUrl
    }));
  }

  function parseTournaments(tournamentsData: any): Tournament[] {
    if (!tournamentsData) return [];
    if (!Array.isArray(tournamentsData)) return [];
    
    return tournamentsData.map((t: any) => ({
      id: t.id || String(Math.random()),
      name: t.name || 'Torneio',
      year: t.year || new Date().getFullYear(),
      position: t.position || 'Participante',
      trophy: getTrophyIcon(t.position)
    }));
  }

  function getTrophyIcon(position: string): string {
    if (position === 'Campeão' || position === '1º lugar') return '🥇';
    if (position === 'Vice-campeão' || position === '2º lugar') return '🥈';
    if (position === '3º lugar') return '🥉';
    return '🏆';
  }

  function checkNeedsEvaluation(lastEvaluated?: string): boolean {
    if (!lastEvaluated) return true;
    
    const lastDate = new Date(lastEvaluated);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Precisa de avaliação se passou mais de 30 dias
    return diffDays > 30;
  }

  async function checkIfFollowing() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following_teams') || '[]');
      setIsFollowing(followingList.includes(teamId));
    } catch (error) {
      console.error('Erro ao verificar seguindo:', error);
    }
  }

  async function handleFollowToggle() {
    if (isFollowing) {
      setShowUnfollowConfirm(true);
      return;
    }

    await performFollow();
  }

  async function performFollow() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following_teams') || '[]');
      followingList.push(teamId);
      localStorage.setItem('volleypro_following_teams', JSON.stringify(followingList));
      setIsFollowing(true);
      toast.success(`Agora você está seguindo ${team?.name}! 🎉`);
    } catch (error) {
      console.error('Erro ao seguir:', error);
      toast.error('Erro ao seguir time');
    }
  }

  async function performUnfollow() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following_teams') || '[]');
      const newList = followingList.filter((id: number) => id !== teamId);
      localStorage.setItem('volleypro_following_teams', JSON.stringify(newList));
      setIsFollowing(false);
      toast.success(`Você deixou de seguir ${team?.name}`);
    } catch (error) {
      console.error('Erro ao deixar de seguir:', error);
      toast.error('Erro ao atualizar status');
    } finally {
      setShowUnfollowConfirm(false);
    }
  }

  function handleOpenEvaluation(player: Player) {
    setSelectedPlayer(player);
    setEvaluation({
      attack: player.ratings?.attack || 50,
      defense: player.ratings?.defense || 50,
      serve: player.ratings?.serve || 50,
      block: player.ratings?.block || 50,
      notes: ""
    });
    setShowEvaluationModal(true);
  }

  async function handleSaveEvaluation() {
    if (!selectedPlayer) return;

    try {
      // Aqui você salvaria no backend
      const overall = Math.round((evaluation.attack + evaluation.defense + evaluation.serve + evaluation.block) / 4);
      
      toast.success(`Avaliação de ${selectedPlayer.name} salva!`, {
        description: `Nota geral: ${overall}/100`
      });
      
      setShowEvaluationModal(false);
      loadTeamData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast.error('Erro ao salvar avaliação');
    }
  }

  function handleDeletePlayer(player: Player) {
    setSelectedPlayer(player);
    setShowDeletePlayerConfirm(true);
  }

  async function performDeletePlayer() {
    if (!selectedPlayer) return;

    try {
      // Aqui você removeria do backend
      toast.success(`${selectedPlayer.name} foi removido do elenco`);
      setShowDeletePlayerConfirm(false);
      loadTeamData();
    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      toast.error('Erro ao remover jogador');
    }
  }

  if (loading) {
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

  if (!team) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-muted-foreground">Time não encontrado</p>
        <Button onClick={onBack} className="mt-4">Voltar</Button>
      </div>
    );
  }

  const playersNeedingEvaluation = team.players?.filter(p => p.needsEvaluation) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container mx-auto py-6 relative z-10">
          <Button variant="ghost" onClick={onBack} className="mb-6 text-white hover:bg-white/20 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar e Info Básica */}
            <Avatar className="h-40 w-40 border-4 border-white shadow-2xl ring-4 ring-white/20">
              {team.photoUrl ? (
                <AvatarImage src={team.photoUrl} alt={team.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="text-4xl bg-gradient-to-br from-white to-gray-100 text-primary">
                {team.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-white">{team.name}</h1>
                    {team.verified && (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    )}
                    {team.isOwner && (
                      <Badge className="bg-amber-500 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Administrador
                      </Badge>
                    )}
                  </div>
                  {team.city && (
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{team.city}</span>
                    </div>
                  )}
                  {team.founded && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="h-4 w-4" />
                      <span>Fundado em {team.founded}</span>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <Button 
                    onClick={handleFollowToggle}
                    className={
                      isFollowing 
                        ? "bg-muted text-foreground hover:bg-muted/80"
                        : "bg-white text-primary hover:bg-white/90"
                    }
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground text-sm">Seguidores</p>
                    <p className="text-2xl">{(team.followers || 0).toLocaleString('pt-BR')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground text-sm">Jogadores</p>
                    <p className="text-2xl">{team.players?.length || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground text-sm">Títulos</p>
                    <p className="text-2xl">{team.championships || 0}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de avaliações pendentes */}
      {team.isOwner && playersNeedingEvaluation.length > 0 && (
        <div className="container mx-auto -mt-28 mb-6 relative z-20">
          <Card className="border-orange-500 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900 mb-1">
                    {playersNeedingEvaluation.length} jogador(es) precisam de avaliação
                  </h4>
                  <p className="text-sm text-orange-700">
                    Avalie o desempenho dos atletas para manter o acompanhamento atualizado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conteúdo com Tabs */}
      <div className="container mx-auto -mt-24 relative z-10">
        <Tabs defaultValue="roster" className="space-y-6">
          <TabsList>
            <TabsTrigger value="roster">
              <Users className="h-4 w-4 mr-2" />
              Elenco
            </TabsTrigger>
            <TabsTrigger value="lineup">
              <Target className="h-4 w-4 mr-2" />
              Escalação
            </TabsTrigger>
            <TabsTrigger value="tournaments">
              <Trophy className="h-4 w-4 mr-2" />
              Torneios
            </TabsTrigger>
            <TabsTrigger value="former">
              <Clock className="h-4 w-4 mr-2" />
              Ex-Jogadores
            </TabsTrigger>
            {team.isOwner && (
              <TabsTrigger value="evaluations">
                <BarChart3 className="h-4 w-4 mr-2" />
                Avaliações
              </TabsTrigger>
            )}
            <TabsTrigger value="info">
              <Flag className="h-4 w-4 mr-2" />
              Informações
            </TabsTrigger>
          </TabsList>

          {/* Aba Elenco - Vitrine de Jogadores */}
          <TabsContent value="roster" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Elenco Atual ({team.players?.length || 0} jogadores)</h3>
              {team.isOwner && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Jogador
                </Button>
              )}
            </div>

            {team.players && team.players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.players.map((player) => (
                  <Card key={player.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-16 w-16">
                          {player.photoUrl ? (
                            <AvatarImage src={player.photoUrl} alt={player.name} />
                          ) : null}
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{player.name}</span>
                            {player.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-500" />
                            )}
                            {player.needsEvaluation && (
                              <Badge variant="destructive" className="text-xs">
                                Avaliar
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{player.position}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              #{player.number}
                            </Badge>
                            {player.age && (
                              <span className="text-xs text-muted-foreground">{player.age} anos</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Nota Geral */}
                      {player.ratings && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Desempenho</span>
                            <span className="font-medium">{player.ratings.overall}/100</span>
                          </div>
                          <Progress value={player.ratings.overall} className="h-2" />
                        </div>
                      )}

                      {/* Botões de ação (apenas para donos) */}
                      {team.isOwner && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleOpenEvaluation(player)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Avaliar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeletePlayer(player)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="mb-2">Nenhum jogador cadastrado</h3>
                  <p className="text-muted-foreground">
                    Adicione jogadores ao elenco do time
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Escalação */}
          <TabsContent value="lineup" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Escalação Titular</h3>
              {team.isOwner && (
                <Button onClick={() => setShowRosterModal(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Escalação
                </Button>
              )}
            </div>

            {/* Quadra de vôlei visual */}
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-[2/3] bg-gradient-to-b from-orange-100 to-orange-50 rounded-lg border-4 border-orange-300">
                  {/* Linha de meio */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-orange-400 -translate-y-1/2"></div>
                  
                  {/* Rede */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-orange-500 -translate-y-1/2 opacity-50"></div>
                  
                  {/* Posições da quadra */}
                  <div className="absolute inset-0 p-8">
                    {/* Posições de fundo (1, 6, 5) */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <PlayerPosition position="1" label="Líbero" />
                      <PlayerPosition position="6" label="Central" />
                      <PlayerPosition position="5" label="Oposto" />
                    </div>
                    
                    {/* Posições de frente (2, 3, 4) */}
                    <div className="grid grid-cols-3 gap-4 absolute bottom-8 left-8 right-8">
                      <PlayerPosition position="2" label="Levantador" />
                      <PlayerPosition position="3" label="Central" />
                      <PlayerPosition position="4" label="Ponteiro" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center">
              Sistema 5-1 | Rodízio completo
            </p>
          </TabsContent>

          {/* Aba Torneios */}
          <TabsContent value="tournaments" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Torneios e Conquistas</h3>
            </div>

            {team.tournaments && team.tournaments.length > 0 ? (
              <div className="space-y-3">
                {team.tournaments.map((tournament) => (
                  <Card key={tournament.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{tournament.trophy}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{tournament.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary">{tournament.year}</Badge>
                            <span className="text-sm text-muted-foreground">{tournament.position}</span>
                          </div>
                        </div>
                        <Medal className="h-8 w-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="mb-2">Nenhum torneio registrado</h3>
                  <p className="text-muted-foreground">
                    Os torneios e conquistas do time aparecerão aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Ex-Jogadores - Mural */}
          <TabsContent value="former" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3>Mural de Ex-Jogadores</h3>
            </div>

            {team.formerPlayers && team.formerPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.formerPlayers.map((player) => (
                  <Card key={player.id} className="hover:shadow-lg transition-shadow bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 grayscale">
                          {player.photoUrl ? (
                            <AvatarImage src={player.photoUrl} alt={player.name} />
                          ) : null}
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">{player.position}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {player.years}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="mb-2">Nenhum ex-jogador cadastrado</h3>
                  <p className="text-muted-foreground">
                    O mural de ex-jogadores do time aparecerá aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba Avaliações (apenas para donos) */}
          {team.isOwner && (
            <TabsContent value="evaluations" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3>Sistema de Avaliação de Atletas</h3>
              </div>

              {team.players && team.players.length > 0 ? (
                <div className="space-y-4">
                  {team.players.map((player) => (
                    <Card key={player.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            {player.photoUrl ? (
                              <AvatarImage src={player.photoUrl} alt={player.name} />
                            ) : null}
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{player.name}</h4>
                                <p className="text-sm text-muted-foreground">{player.position}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {player.needsEvaluation && (
                                  <Badge variant="destructive">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Precisa avaliar
                                  </Badge>
                                )}
                                <Button 
                                  size="sm"
                                  onClick={() => handleOpenEvaluation(player)}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Avaliar
                                </Button>
                              </div>
                            </div>

                            {/* Gráficos de desempenho */}
                            {player.ratings && (
                              <div className="space-y-2">
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Ataque</span>
                                    <span className="font-medium">{player.ratings.attack}/100</span>
                                  </div>
                                  <Progress value={player.ratings.attack} className="h-2" />
                                </div>
                                
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Defesa</span>
                                    <span className="font-medium">{player.ratings.defense}/100</span>
                                  </div>
                                  <Progress value={player.ratings.defense} className="h-2" />
                                </div>
                                
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Saque</span>
                                    <span className="font-medium">{player.ratings.serve}/100</span>
                                  </div>
                                  <Progress value={player.ratings.serve} className="h-2" />
                                </div>
                                
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Bloqueio</span>
                                    <span className="font-medium">{player.ratings.block}/100</span>
                                  </div>
                                  <Progress value={player.ratings.block} className="h-2" />
                                </div>

                                {/* Nota geral */}
                                <div className="pt-2 border-t">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Nota Geral</span>
                                    <span className="text-2xl font-bold text-primary">
                                      {player.ratings.overall}
                                    </span>
                                  </div>
                                </div>

                                {/* Última avaliação */}
                                {player.lastEvaluated && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Última avaliação: {new Date(player.lastEvaluated).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="mb-2">Nenhum jogador para avaliar</h3>
                    <p className="text-muted-foreground">
                      Adicione jogadores ao elenco para começar a avaliar
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Aba Informações */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <h3>Informações do Time</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {team.city && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cidade:</span>
                    <span>{team.city}</span>
                  </div>
                )}
                {team.founded && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fundação:</span>
                    <span>{team.founded}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Títulos:</span>
                  <span>{team.championships || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jogadores:</span>
                  <span>{team.players?.length || 0}</span>
                </div>
                {team.bio && (
                  <div className="pt-3 border-t">
                    <span className="text-muted-foreground block mb-2">Sobre:</span>
                    <p className="text-sm">{team.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Escalação */}
      <Dialog open={showRosterModal} onOpenChange={setShowRosterModal}>
        <DialogContent className="max-w-2xl" aria-describedby="roster-edit-description">
          <DialogHeader>
            <DialogTitle>Editar Escalação</DialogTitle>
            <DialogDescription id="roster-edit-description">
              Defina os jogadores titulares para cada posição
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {['Líbero', 'Central 1', 'Oposto', 'Levantador', 'Central 2', 'Ponteiro'].map((position, index) => (
              <div key={index} className="flex items-center gap-3">
                <Label className="w-32">{position}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {team.players?.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        #{player.number} {player.name} - {player.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRosterModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast.success('Escalação atualizada!');
              setShowRosterModal(false);
            }}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Escalação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Avaliação de Atleta */}
      <Dialog open={showEvaluationModal} onOpenChange={setShowEvaluationModal}>
        <DialogContent aria-describedby="evaluation-description">
          <DialogHeader>
            <DialogTitle>Avaliar {selectedPlayer?.name}</DialogTitle>
            <DialogDescription id="evaluation-description">
              Avalie o desempenho do atleta em diferentes aspectos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Ataque */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Ataque</Label>
                <span className="text-sm font-medium">{evaluation.attack}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={evaluation.attack}
                onChange={(e) => setEvaluation({...evaluation, attack: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Defesa */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Defesa</Label>
                <span className="text-sm font-medium">{evaluation.defense}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={evaluation.defense}
                onChange={(e) => setEvaluation({...evaluation, defense: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Saque */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Saque</Label>
                <span className="text-sm font-medium">{evaluation.serve}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={evaluation.serve}
                onChange={(e) => setEvaluation({...evaluation, serve: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Bloqueio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Bloqueio</Label>
                <span className="text-sm font-medium">{evaluation.block}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={evaluation.block}
                onChange={(e) => setEvaluation({...evaluation, block: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Nota Geral (calculada) */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Nota Geral</span>
                <span className="text-2xl font-bold text-primary">
                  {Math.round((evaluation.attack + evaluation.defense + evaluation.serve + evaluation.block) / 4)}
                </span>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label>Observações (opcional)</Label>
              <Textarea
                placeholder="Adicione observações sobre o desempenho do atleta..."
                value={evaluation.notes}
                onChange={(e) => setEvaluation({...evaluation, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEvaluationModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEvaluation}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação para remover jogador */}
      <AlertDialog open={showDeletePlayerConfirm} onOpenChange={setShowDeletePlayerConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {selectedPlayer?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este jogador do elenco? Esta ação não pode ser desfeita.
              O jogador será movido para o mural de ex-jogadores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={performDeletePlayer} className="bg-destructive">
              Sim, remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação para deixar de seguir */}
      <AlertDialog open={showUnfollowConfirm} onOpenChange={setShowUnfollowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deixar de seguir {team.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deixar de seguir este time? Você não verá mais as atualizações no seu feed.
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

// Componente auxiliar para posições na quadra
function PlayerPosition({ position, label }: { position: string; label: string }) {
  return (
    <div className="bg-white rounded-lg p-3 text-center border-2 border-orange-400 shadow-md">
      <div className="text-2xl font-bold text-orange-600 mb-1">{position}</div>
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xs text-gray-400 mt-1">Selecione</div>
    </div>
  );
}

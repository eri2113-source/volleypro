import { useState, useEffect } from "react";
import { 
  ArrowLeft, MapPin, Users, Heart, Trophy, Calendar, 
  Edit, UserPlus, X, Save, Loader2, Shield, Camera, Mail, Phone,
  Globe, Instagram, Facebook, Twitter, Share2, BarChart3, Clock,
  Award, Star, TrendingUp, Target, Medal, Flag, Clipboard, Search
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
import { userApi, teamRosterApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { formatHeight } from "../utils/formatters";

interface TeamProfileProps {
  teamId: number;
  onBack: () => void;
}

interface TeamData {
  id: number;
  name: string;
  city?: string;
  state?: string;
  founded?: number;
  verified?: boolean;
  followers?: number;
  following?: number;
  championships?: number;
  secondPlace?: number;
  thirdPlace?: number;
  players?: Player[];
  photoUrl?: string;
  coverPhoto?: string;
  bio?: string;
  userType: string;
  achievements?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  president?: string;
  coach?: string;
  assistantCoach?: string;
  physicalTrainer?: string;
  category?: string;
  division?: string;
  league?: string;
  arena?: string;
  colors?: string;
  mascot?: string;
  rivalTeams?: string;
  mainSponsor?: string;
  sponsors?: string[];
  totalMatches?: number;
  wins?: number;
  losses?: number;
  points?: number;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
  cpf?: string;
  isCaptain?: boolean;
  isStarter?: boolean;
  gamesPlayed?: number;
  points?: number;
}

interface FormerPlayer {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
  yearsActive: string;
  currentTeam?: string;
}

export function TeamProfile({ teamId, onBack }: TeamProfileProps) {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Estados de edição
  const [editMode, setEditMode] = useState(false);
  const [editedTeam, setEditedTeam] = useState<Partial<TeamData>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Estados para gerenciamento de elenco
  const [players, setPlayers] = useState<Player[]>([]);
  const [formerPlayers, setFormerPlayers] = useState<FormerPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDeletePlayerConfirm, setShowDeletePlayerConfirm] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [addPlayerMode, setAddPlayerMode] = useState<'cpf' | 'manual'>('cpf');
  const [searchCPF, setSearchCPF] = useState("");
  const [searchingCPF, setSearchingCPF] = useState(false);
  const [athleteFound, setAthleteFound] = useState<any>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    number: 0,
    age: undefined as number | undefined,
    height: undefined as number | undefined,
    photoUrl: ''
  });

  const positions = [
    'Levantador',
    'Ponteiro',
    'Oposto',
    'Central',
    'Líbero'
  ];

  useEffect(() => {
    loadTeamProfile();
    loadTeamPlayers();
    loadFormerPlayers();
    checkIfFollowing();
    
    const userData = localStorage.getItem('volleypro_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
      const ownerStatus = user.id === teamId.toString();
      console.log('👤 Verificando propriedade do time:', {
        userId: user.id,
        teamId: teamId.toString(),
        isOwner: ownerStatus
      });
      setIsOwner(ownerStatus);
    }
  }, [teamId]);

  async function loadTeamProfile() {
    setLoading(true);
    try {
      console.log('🔍 Carregando perfil do time:', teamId);
      
      const userData = await userApi.getUser(teamId.toString());
      
      console.log('✅ Dados do time carregados:', userData);
      
      if (!userData) {
        throw new Error('Perfil não encontrado');
      }

      const teamProfile: TeamData = {
        id: userData.id || teamId,
        name: userData.name || userData.full_name || 'Time',
        city: userData.city,
        state: userData.state,
        founded: userData.founded,
        verified: userData.verified || false,
        followers: userData.followers || 0,
        following: userData.following || 0,
        championships: userData.championships || 0,
        secondPlace: userData.secondPlace || 0,
        thirdPlace: userData.thirdPlace || 0,
        photoUrl: userData.photoUrl || userData.photo_url,
        coverPhoto: userData.coverPhoto,
        bio: userData.bio || userData.description,
        userType: userData.userType || userData.user_type || 'team',
        achievements: userData.achievements,
        email: userData.email,
        phone: userData.phone,
        website: userData.website,
        instagram: userData.instagram,
        facebook: userData.facebook,
        twitter: userData.twitter,
        president: userData.president,
        coach: userData.coach,
        assistantCoach: userData.assistantCoach,
        physicalTrainer: userData.physicalTrainer,
        category: userData.category,
        division: userData.division,
        league: userData.league,
        arena: userData.arena,
        colors: userData.colors,
        mascot: userData.mascot,
        rivalTeams: userData.rivalTeams,
        mainSponsor: userData.mainSponsor,
        sponsors: userData.sponsors,
        totalMatches: userData.totalMatches || 0,
        wins: userData.wins || 0,
        losses: userData.losses || 0,
        points: userData.points || 0,
      };
      
      console.log('✅ Perfil do time mapeado:', teamProfile);
      
      setTeam(teamProfile);
      setEditedTeam(teamProfile);
    } catch (error) {
      console.error('❌ Erro ao carregar perfil do time:', error);
      toast.error('Erro ao carregar perfil do time');
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeamPlayers() {
    try {
      console.log('🔍 Carregando jogadores do time:', teamId);
      
      const { players: loadedPlayers } = await teamRosterApi.getTeamRoster(teamId.toString());
      
      console.log('✅ Jogadores carregados:', loadedPlayers?.length || 0);
      
      setPlayers(loadedPlayers || []);
    } catch (error) {
      console.error('❌ Erro ao carregar jogadores:', error);
      setPlayers([]);
    }
  }

  async function loadFormerPlayers() {
    try {
      // Buscar ex-jogadores do banco de dados
      // TODO: Implementar endpoint GET /teams/{teamId}/former-players
      setFormerPlayers([]);
    } catch (error) {
      console.error('Erro ao carregar ex-jogadores:', error);
      setFormerPlayers([]);
    }
  }

  async function checkIfFollowing() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following_teams') || '[]');
      setIsFollowing(followingList.includes(teamId.toString()));
    } catch (error) {
      console.error('Erro ao verificar seguindo:', error);
    }
  }

  async function handleFollow() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following_teams') || '[]');
      
      if (isFollowing) {
        const newList = followingList.filter((id: string) => id !== teamId.toString());
        localStorage.setItem('volleypro_following_teams', JSON.stringify(newList));
        setIsFollowing(false);
        setTeam(prev => prev ? { ...prev, followers: (prev.followers || 1) - 1 } : null);
        toast.success('Você deixou de seguir este time');
      } else {
        followingList.push(teamId.toString());
        localStorage.setItem('volleypro_following_teams', JSON.stringify(followingList));
        setIsFollowing(true);
        setTeam(prev => prev ? { ...prev, followers: (prev.followers || 0) + 1 } : null);
        toast.success('Agora você está seguindo este time!');
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      toast.error('Erro ao processar ação');
    }
  }

  async function handleSaveProfile() {
    if (!editedTeam) return;
    
    setSavingProfile(true);
    try {
      // Em produção, chamar API para salvar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTeam({ ...team!, ...editedTeam });
      setEditMode(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSearchCPF() {
    if (!searchCPF.trim()) {
      toast.error("Digite um CPF válido");
      return;
    }

    setSearchingCPF(true);
    try {
      console.log('🔍 Buscando atleta por CPF:', searchCPF);
      
      const { athlete } = await teamRosterApi.searchByCPF(searchCPF);
      
      console.log('✅ Atleta encontrado:', athlete);
      
      setAthleteFound(athlete);
      toast.success(`Atleta ${athlete.name} encontrado!`);
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar atleta por CPF:', error);
      toast.error("Atleta não encontrado no sistema. Adicione manualmente.");
      setAthleteFound(null);
    } finally {
      setSearchingCPF(false);
    }
  }

  async function handleAddPlayer() {
    if (addPlayerMode === 'cpf' && athleteFound) {
      await handleAddAthleteFromCPF();
    } else {
      await handleAddManualPlayer();
    }
  }

  async function handleAddAthleteFromCPF() {
    if (!athleteFound) return;

    try {
      const newPlayerData = {
        id: athleteFound.id || `player_${Date.now()}`,
        name: athleteFound.name,
        position: athleteFound.position,
        number: newPlayer.number || (players.length + 1),
        age: athleteFound.age,
        height: athleteFound.height,
        photoUrl: athleteFound.photoUrl,
        cpf: athleteFound.cpf
      };

      console.log('➕ Adicionando atleta ao elenco:', newPlayerData);

      const { player } = await teamRosterApi.addPlayer(teamId.toString(), newPlayerData);

      console.log('✅ Atleta adicionado ao banco:', player);

      // Recarregar lista de jogadores
      await loadTeamPlayers();
      
      toast.success(`${athleteFound.name} adicionado ao elenco!`);
      
      setShowAddPlayerModal(false);
      setSearchCPF("");
      setAthleteFound(null);
      setAddPlayerMode('cpf');
      setNewPlayer({
        name: '',
        position: '',
        number: 0,
        age: undefined,
        height: undefined,
        photoUrl: ''
      });
    } catch (error: any) {
      console.error('❌ Erro ao adicionar atleta:', error);
      toast.error(error.message || 'Erro ao adicionar atleta');
    }
  }

  async function handleAddManualPlayer() {
    if (!newPlayer.name.trim() || !newPlayer.position) {
      toast.error('Preencha nome e posição');
      return;
    }

    try {
      const playerData = {
        id: `player_${Date.now()}`,
        name: newPlayer.name,
        position: newPlayer.position,
        number: newPlayer.number || (players.length + 1),
        age: newPlayer.age,
        height: newPlayer.height,
        photoUrl: newPlayer.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newPlayer.name)}&background=random`
      };

      console.log('➕ Adicionando jogador manualmente:', playerData);

      const { player } = await teamRosterApi.addPlayer(teamId.toString(), playerData);

      console.log('✅ Jogador adicionado ao banco:', player);

      // Recarregar lista de jogadores
      await loadTeamPlayers();
      
      toast.success(`${newPlayer.name} adicionado ao elenco!`);
      
      setShowAddPlayerModal(false);
      setAddPlayerMode('cpf');
      setNewPlayer({
        name: '',
        position: '',
        number: 0,
        age: undefined,
        height: undefined,
        photoUrl: ''
      });
    } catch (error: any) {
      console.error('❌ Erro ao adicionar jogador:', error);
      toast.error(error.message || 'Erro ao adicionar jogador');
    }
  }

  async function handleDeletePlayer() {
    if (!selectedPlayer) return;

    try {
      console.log('🗑️ Removendo jogador:', selectedPlayer.id);

      await teamRosterApi.removePlayer(teamId.toString(), selectedPlayer.id);

      console.log('✅ Jogador removido do banco');

      // Recarregar lista de jogadores
      await loadTeamPlayers();
      
      toast.success(`${selectedPlayer.name} removido do elenco`);
      setShowDeletePlayerConfirm(false);
      setSelectedPlayer(null);
    } catch (error: any) {
      console.error('❌ Erro ao remover jogador:', error);
      toast.error(error.message || 'Erro ao remover jogador');
    }
  }

  async function handleSavePlayerEdit() {
    if (!editingPlayer) return;

    try {
      console.log('✏️ Atualizando jogador:', editingPlayer.id);

      const { player } = await teamRosterApi.updatePlayer(
        teamId.toString(), 
        editingPlayer.id, 
        editingPlayer
      );

      console.log('✅ Jogador atualizado no banco:', player);

      // Recarregar lista de jogadores
      await loadTeamPlayers();
      
      toast.success(`${editingPlayer.name} atualizado!`);
      setShowEditPlayerModal(false);
      setEditingPlayer(null);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar jogador:', error);
      toast.error(error.message || 'Erro ao atualizar jogador');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Time não encontrado</p>
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const winRate = team.totalMatches ? ((team.wins || 0) / team.totalMatches * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header com Cover Photo */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500">
        {team.coverPhoto && (
          <img 
            src={team.coverPhoto} 
            alt="Capa" 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Botão Voltar */}
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4 backdrop-blur-sm bg-white/90 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Botão Editar Cover (se for dono) */}
        {isOwner && (
          <Button
            onClick={() => setEditMode(true)}
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 backdrop-blur-sm bg-white/90 hover:bg-white"
          >
            <Camera className="h-4 w-4 mr-2" />
            Editar Capa
          </Button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Avatar e Info Principal */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
          {/* Avatar Grande */}
          <div className="relative">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl">
              <AvatarImage src={team.photoUrl} alt={team.name} />
              <AvatarFallback className="text-4xl">{team.name[0]}</AvatarFallback>
            </Avatar>
            {team.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 border-4 border-white">
                <Shield className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          {/* Nome, Localização e Badges */}
          <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                    {team.name}
                  </h1>
                  {isOwner && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrador
                    </Badge>
                  )}
                  {team.verified && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                      Verificado
                    </Badge>
                  )}
                </div>

                {/* Localização */}
                {(team.city || team.state) && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{team.city}{team.city && team.state && ', '}{team.state}</span>
                  </div>
                )}

                {/* Info Adicional */}
                <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                  {team.founded && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Fundado em {team.founded}</span>
                    </div>
                  )}
                  {team.category && (
                    <Badge variant="outline">{team.category}</Badge>
                  )}
                  {team.division && (
                    <Badge variant="outline">{team.division}</Badge>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              {!isOwner && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing ? "" : "bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white border-0"}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Seguindo' : 'Seguir'}
                </Button>
              )}

              {isOwner && (
                <Button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white border-0"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? 'Cancelar' : 'Editar Perfil'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Seguidores */}
          <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {team.followers || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Seguidores</p>
              </div>
            </CardContent>
          </Card>

          {/* Jogadores */}
          <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {players.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Jogadores</p>
              </div>
            </CardContent>
          </Card>

          {/* Títulos */}
          <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                  {team.championships || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Títulos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Navegação */}
        <Tabs defaultValue="roster" className="space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-2">
            <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent">
              <TabsTrigger value="roster" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Elenco</span>
              </TabsTrigger>
              <TabsTrigger value="lineup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Clipboard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Escalação</span>
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Trophy className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Torneios</span>
              </TabsTrigger>
              <TabsTrigger value="former" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Clock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ex-Jogadores</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Estatísticas</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Flag className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Informações</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ABA: ELENCO */}
          <TabsContent value="roster" className="space-y-6">
            {/* Card de Call-to-Action para adicionar primeiro jogador */}
            {isOwner && players.length === 0 && (
              <Card className="bg-gradient-to-r from-orange-100 via-blue-100 to-purple-100 border-2 border-orange-300 shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-full shadow-lg">
                        <UserPlus className="h-12 w-12 text-orange-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Monte seu Elenco!
                      </h3>
                      <p className="text-muted-foreground">
                        Comece adicionando atletas ao seu time. Você pode buscar por CPF para vincular atletas cadastrados ou adicionar manualmente.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Button 
                        onClick={() => {
                          setShowAddPlayerModal(true);
                          setAddPlayerMode('cpf');
                        }}
                        size="lg"
                        variant="outline"
                        className="border-2 border-orange-500 text-orange-700 hover:bg-orange-50"
                      >
                        <Search className="h-5 w-5 mr-2" />
                        Buscar por CPF
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowAddPlayerModal(true);
                          setAddPlayerMode('manual');
                        }}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Adicionar Manualmente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Elenco Atual ({players.length} jogadores)</h3>
                  </div>
                  {isOwner && (
                    <Button 
                      onClick={() => setShowAddPlayerModal(true)}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Adicionar Atleta ao Elenco
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {players.length === 0 ? (
                  <div className="text-center py-12 space-y-6">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <div>
                      <p className="text-muted-foreground text-lg mb-2">Nenhum jogador no elenco</p>
                      {isOwner && (
                        <p className="text-sm text-muted-foreground mb-6">
                          Comece a montar seu time adicionando atletas
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <Button 
                        onClick={() => setShowAddPlayerModal(true)}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Adicionar Primeiro Atleta
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {players.map((player) => (
                      <div 
                        key={player.id} 
                        className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-white/50 to-white/30 hover:from-white/80 hover:to-white/60 transition-all group"
                      >
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                          <AvatarImage src={player.photoUrl} alt={player.name} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{player.name}</h4>
                            {player.isCaptain && (
                              <Badge className="bg-yellow-500 text-white">
                                <Star className="h-3 w-3 mr-1" />
                                Capitão
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="border-orange-500 text-orange-700">
                              #{player.number}
                            </Badge>
                            <Badge variant="outline" className="border-blue-500 text-blue-700">
                              {player.position}
                            </Badge>
                            {player.isStarter && (
                              <Badge variant="outline" className="border-green-500 text-green-700">
                                Titular
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="hidden md:block text-right text-sm space-y-1">
                          {player.height && (
                            <p className="font-medium text-muted-foreground">
                              {formatHeight(player.height)}
                            </p>
                          )}
                          {player.age && (
                            <p className="text-muted-foreground">{player.age} anos</p>
                          )}
                          {player.gamesPlayed !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              {player.gamesPlayed} jogos
                            </p>
                          )}
                        </div>

                        {isOwner && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingPlayer(player);
                                setShowEditPlayerModal(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPlayer(player);
                                setShowDeletePlayerConfirm(true);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas do Elenco */}
            {players.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Estatísticas do Elenco</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <p className="text-3xl font-bold text-orange-600">{players.length}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total de Atletas</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <p className="text-3xl font-bold text-blue-600">
                        {players.filter(p => p.age).length > 0
                          ? Math.round(players.filter(p => p.age).reduce((sum, p) => sum + (p.age || 0), 0) / players.filter(p => p.age).length)
                          : '-'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Idade Média</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <p className="text-3xl font-bold text-green-600">
                        {players.filter(p => p.height).length > 0
                          ? formatHeight(Math.round(players.filter(p => p.height).reduce((sum, p) => sum + (p.height || 0), 0) / players.filter(p => p.height).length))
                          : '-'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Altura Média</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <p className="text-3xl font-bold text-purple-600">
                        {new Set(players.map(p => p.position)).size}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Posições</p>
                    </div>
                  </div>

                  {/* Distribuição por Posição */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">Distribuição por Posição</h4>
                    {positions.map(position => {
                      const count = players.filter(p => p.position === position).length;
                      const percentage = players.length > 0 ? (count / players.length * 100) : 0;
                      
                      return count > 0 ? (
                        <div key={position} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{position}</span>
                            <span className="text-muted-foreground">{count} jogador{count !== 1 ? 'es' : ''}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-blue-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ABA: ESCALAÇÃO */}
          <TabsContent value="lineup" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Escalação Titular</h3>
                </div>
              </CardHeader>
              <CardContent>
                {players.filter(p => p.isStarter).length === 0 ? (
                  <div className="text-center py-12 space-y-6">
                    <Clipboard className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <div>
                      <p className="text-muted-foreground text-lg mb-2">
                        {players.length === 0 ? 'Nenhum jogador no elenco' : 'Nenhuma escalação definida'}
                      </p>
                      {isOwner && (
                        <p className="text-sm text-muted-foreground mb-6">
                          {players.length === 0 
                            ? 'Adicione jogadores ao elenco para criar sua escalação'
                            : 'Edite os jogadores para marcar os titulares'
                          }
                        </p>
                      )}
                    </div>
                    {isOwner && players.length === 0 && (
                      <Button 
                        onClick={() => setShowAddPlayerModal(true)}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                      >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Adicionar Atletas
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Quadra de vôlei visual */}
                    <div className="bg-gradient-to-br from-orange-100 to-blue-100 rounded-xl p-8 border-2 border-dashed border-orange-300">
                      <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        {players.filter(p => p.isStarter).slice(0, 6).map((player, index) => (
                          <div key={player.id} className="flex flex-col items-center">
                            <Avatar className="h-16 w-16 border-2 border-white shadow-lg mb-2">
                              <AvatarImage src={player.photoUrl} alt={player.name} />
                              <AvatarFallback>{player.name[0]}</AvatarFallback>
                            </Avatar>
                            <Badge className="mb-1">#{player.number}</Badge>
                            <p className="text-xs font-medium text-center">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reservas */}
                    {players.filter(p => !p.isStarter).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Banco de Reservas
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {players.filter(p => !p.isStarter).map(player => (
                            <div key={player.id} className="flex items-center gap-2 p-3 bg-white/50 rounded-lg border">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={player.photoUrl} alt={player.name} />
                                <AvatarFallback>{player.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{player.name}</p>
                                <p className="text-xs text-muted-foreground">#{player.number}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: TORNEIOS */}
          <TabsContent value="tournaments" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Torneios e Conquistas</h3>
                </div>
              </CardHeader>
              <CardContent>
                {/* Resumo de Conquistas */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <Medal className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold text-yellow-600">{team.championships || 0}</p>
                    <p className="text-xs text-muted-foreground">1º Lugar</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <Medal className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-600">{team.secondPlace || 0}</p>
                    <p className="text-xs text-muted-foreground">2º Lugar</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <Medal className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold text-orange-600">{team.thirdPlace || 0}</p>
                    <p className="text-xs text-muted-foreground">3º Lugar</p>
                  </div>
                </div>

                {/* Lista de Torneios */}
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Nenhum torneio registrado</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    As conquistas aparecerão aqui quando o time participar de torneios
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: EX-JOGADORES */}
          <TabsContent value="former" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Ex-Jogadores ({formerPlayers.length})</h3>
                </div>
              </CardHeader>
              <CardContent>
                {formerPlayers.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-lg">Nenhum ex-jogador registrado</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {formerPlayers.map(player => (
                      <div key={player.id} className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-white/50 to-white/30">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={player.photoUrl} alt={player.name} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{player.name}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{player.position}</Badge>
                            <Badge variant="outline">{player.yearsActive}</Badge>
                          </div>
                        </div>
                        {player.currentTeam && (
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">Atualmente:</p>
                            <p className="font-medium">{player.currentTeam}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: ESTATÍSTICAS */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Estatísticas Gerais</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Total de Partidas */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-3xl font-bold text-blue-600">{team.totalMatches || 0}</p>
                    <p className="text-sm text-muted-foreground mt-1">Partidas</p>
                  </div>

                  {/* Vitórias */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-3xl font-bold text-green-600">{team.wins || 0}</p>
                    <p className="text-sm text-muted-foreground mt-1">Vitórias</p>
                  </div>

                  {/* Derrotas */}
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                    <X className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <p className="text-3xl font-bold text-red-600">{team.losses || 0}</p>
                    <p className="text-sm text-muted-foreground mt-1">Derrotas</p>
                  </div>

                  {/* Aproveitamento */}
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-3xl font-bold text-purple-600">{winRate}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Aproveitamento</p>
                  </div>
                </div>

                {/* Gráfico Visual de Desempenho */}
                {team.totalMatches && team.totalMatches > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-sm text-muted-foreground">Desempenho Geral</h4>
                    <div className="flex h-8 rounded-full overflow-hidden">
                      {team.wins && team.wins > 0 && (
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${(team.wins / team.totalMatches) * 100}%` }}
                        >
                          {team.wins > 2 && `${team.wins}V`}
                        </div>
                      )}
                      {team.losses && team.losses > 0 && (
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${(team.losses / team.totalMatches) * 100}%` }}
                        >
                          {team.losses > 2 && `${team.losses}D`}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Vitórias: {team.wins || 0}</span>
                      <span>Derrotas: {team.losses || 0}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pontuação e Ranking */}
            {team.points !== undefined && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Pontuação e Ranking</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl">
                    <Star className="h-12 w-12 mx-auto mb-3 text-orange-500" />
                    <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {team.points}
                    </p>
                    <p className="text-muted-foreground">Pontos no Ranking</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ABA: INFORMAÇÕES */}
          <TabsContent value="info" className="space-y-6">
            {/* Sobre o Time */}
            {team.bio && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Sobre o Time</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{team.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Comissão Técnica */}
            {(team.coach || team.assistantCoach || team.physicalTrainer || team.president) && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Comissão Técnica e Diretoria</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {team.president && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <p className="text-sm text-muted-foreground mb-1">Presidente</p>
                        <p className="font-semibold text-purple-700">{team.president}</p>
                      </div>
                    )}
                    {team.coach && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <p className="text-sm text-muted-foreground mb-1">Técnico Principal</p>
                        <p className="font-semibold text-blue-700">{team.coach}</p>
                      </div>
                    )}
                    {team.assistantCoach && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <p className="text-sm text-muted-foreground mb-1">Auxiliar Técnico</p>
                        <p className="font-semibold text-green-700">{team.assistantCoach}</p>
                      </div>
                    )}
                    {team.physicalTrainer && (
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                        <p className="text-sm text-muted-foreground mb-1">Preparador Físico</p>
                        <p className="font-semibold text-orange-700">{team.physicalTrainer}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações da Arena */}
            {(team.arena || team.league || team.colors || team.mascot) && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Informações Adicionais</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {team.arena && (
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Arena/Ginásio</p>
                          <p className="font-medium">{team.arena}</p>
                        </div>
                      </div>
                    )}
                    {team.league && (
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <Trophy className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Liga/Campeonato</p>
                          <p className="font-medium">{team.league}</p>
                        </div>
                      </div>
                    )}
                    {team.colors && (
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <Award className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Cores Oficiais</p>
                          <p className="font-medium">{team.colors}</p>
                        </div>
                      </div>
                    )}
                    {team.mascot && (
                      <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <Star className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Mascote</p>
                          <p className="font-medium">{team.mascot}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patrocinadores */}
            {(team.mainSponsor || (team.sponsors && team.sponsors.length > 0)) && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Patrocinadores</h3>
                </CardHeader>
                <CardContent>
                  {team.mainSponsor && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                      <p className="text-sm text-muted-foreground mb-1">Patrocinador Master</p>
                      <p className="text-xl font-bold text-orange-600">{team.mainSponsor}</p>
                    </div>
                  )}
                  {team.sponsors && team.sponsors.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Outros Patrocinadores</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {team.sponsors.map((sponsor, index) => (
                          <div key={index} className="p-3 bg-muted/30 rounded-lg text-center font-medium">
                            {sponsor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contato */}
            {(team.email || team.phone || team.website) && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Contato</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {team.email && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href={`mailto:${team.email}`} className="text-primary hover:underline">
                          {team.email}
                        </a>
                      </div>
                    )}
                    {team.phone && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href={`tel:${team.phone}`} className="text-primary hover:underline">
                          {team.phone}
                        </a>
                      </div>
                    )}
                    {team.website && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <Globe className="h-5 w-5 text-primary" />
                        <a href={team.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {team.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Redes Sociais */}
            {(team.instagram || team.facebook || team.twitter) && (
              <Card className="bg-white/80 backdrop-blur-md border-white/50 shadow-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Redes Sociais</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    {team.instagram && (
                      <a
                        href={`https://instagram.com/${team.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
                      >
                        <Instagram className="h-5 w-5" />
                        <span className="font-medium">{team.instagram}</span>
                      </a>
                    )}
                    {team.facebook && (
                      <a
                        href={team.facebook.startsWith('http') ? team.facebook : `https://${team.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="font-medium">Facebook</span>
                      </a>
                    )}
                    {team.twitter && (
                      <a
                        href={`https://twitter.com/${team.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="font-medium">{team.twitter}</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Adicionar Jogador */}
      <Dialog open={showAddPlayerModal} onOpenChange={setShowAddPlayerModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="add-player-team-description">
          <DialogHeader>
            <DialogTitle>Adicionar Atleta ao Elenco</DialogTitle>
            <DialogDescription id="add-player-team-description">
              Busque por CPF para vincular atleta cadastrado ou adicione manualmente
            </DialogDescription>
          </DialogHeader>

          <Tabs value={addPlayerMode} onValueChange={(v) => setAddPlayerMode(v as 'cpf' | 'manual')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cpf">
                <Search className="h-4 w-4 mr-2" />
                Buscar por CPF
              </TabsTrigger>
              <TabsTrigger value="manual">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Manualmente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cpf" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>CPF do Atleta</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="000.000.000-00"
                    value={searchCPF}
                    onChange={(e) => setSearchCPF(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchCPF()}
                  />
                  <Button onClick={handleSearchCPF} disabled={searchingCPF}>
                    {searchingCPF ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Buscar"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  O atleta deve estar cadastrado no sistema VolleyPro
                </p>
              </div>

              {athleteFound && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={athleteFound.photoUrl} alt={athleteFound.name} />
                        <AvatarFallback>{athleteFound.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{athleteFound.name}</h4>
                        <p className="text-sm text-muted-foreground">{athleteFound.position}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          {athleteFound.age && <span>{athleteFound.age} anos</span>}
                          {athleteFound.height && <span>{formatHeight(athleteFound.height)}</span>}
                        </div>
                      </div>
                      <Badge className="bg-primary">Encontrado!</Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label>Número da Camisa</Label>
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        value={newPlayer.number || ''}
                        onChange={(e) => setNewPlayer({ ...newPlayer, number: parseInt(e.target.value) || 0 })}
                        placeholder="Ex: 10"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    placeholder="Nome do atleta"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Posição *</Label>
                  <Select 
                    value={newPlayer.position} 
                    onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Número da Camisa *</Label>
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={newPlayer.number || ''}
                    onChange={(e) => setNewPlayer({ ...newPlayer, number: parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Idade (opcional)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newPlayer.age || ''}
                    onChange={(e) => setNewPlayer({ ...newPlayer, age: parseInt(e.target.value) || undefined })}
                    placeholder="Ex: 25"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Altura em cm (opcional)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="250"
                    value={newPlayer.height || ''}
                    onChange={(e) => setNewPlayer({ ...newPlayer, height: parseInt(e.target.value) || undefined })}
                    placeholder="Ex: 192"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>URL da Foto (opcional)</Label>
                  <Input
                    value={newPlayer.photoUrl}
                    onChange={(e) => setNewPlayer({ ...newPlayer, photoUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>

              {/* Preview do Jogador */}
              {(newPlayer.name || newPlayer.position) && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Preview:</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={newPlayer.photoUrl} />
                        <AvatarFallback>{newPlayer.name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{newPlayer.name || 'Nome do atleta'}</p>
                        <div className="flex gap-2">
                          {newPlayer.number > 0 && (
                            <Badge variant="outline">#{newPlayer.number}</Badge>
                          )}
                          {newPlayer.position && (
                            <Badge variant="outline">{newPlayer.position}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddPlayerModal(false);
              setAddPlayerMode('cpf');
              setSearchCPF("");
              setAthleteFound(null);
              setNewPlayer({
                name: '',
                position: '',
                number: 0,
                age: undefined,
                height: undefined,
                photoUrl: ''
              });
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddPlayer}
              disabled={
                (addPlayerMode === 'cpf' && !athleteFound) ||
                (addPlayerMode === 'manual' && (!newPlayer.name || !newPlayer.position))
              }
              className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar ao Elenco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Jogador */}
      {editingPlayer && (
        <Dialog open={showEditPlayerModal} onOpenChange={setShowEditPlayerModal}>
          <DialogContent aria-describedby="edit-player-description">
            <DialogHeader>
              <DialogTitle>Editar Jogador</DialogTitle>
              <DialogDescription id="edit-player-description">
                Atualize as informações do jogador {editingPlayer.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Posição</Label>
                  <Select 
                    value={editingPlayer.position} 
                    onValueChange={(value) => setEditingPlayer({ ...editingPlayer, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    type="number"
                    value={editingPlayer.number}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCaptain"
                    checked={editingPlayer.isCaptain || false}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, isCaptain: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isCaptain" className="cursor-pointer">Capitão</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isStarter"
                    checked={editingPlayer.isStarter || false}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, isStarter: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isStarter" className="cursor-pointer">Titular</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowEditPlayerModal(false);
                setEditingPlayer(null);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSavePlayerEdit}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmação de Exclusão */}
      <AlertDialog open={showDeletePlayerConfirm} onOpenChange={setShowDeletePlayerConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Jogador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {selectedPlayer?.name} do elenco?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlayer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { TournamentOrganizerPanel } from "./TournamentOrganizerPanel";
import { TournamentOrganizerTeamModal } from "./TournamentOrganizerTeamModal";
import { TournamentNotifications } from "./TournamentNotifications";
import { TournamentSponsorsPanel } from "./TournamentSponsorsPanel";
import { TournamentStandings } from "./TournamentStandings";
import { TournamentSchedule } from "./TournamentSchedule";
import { TournamentBracket } from "./TournamentBracket";
import { TournamentMVP } from "./TournamentMVP";
import { TournamentDraw } from "./TournamentDraw";
import { AnimatedLEDPanel } from "./AnimatedLEDPanel";
import { LEDPanelConfigModal } from "./LEDPanelConfigModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  Users, 
  MapPin, 
  Award,
  Radio,
  ChevronRight,
  Star,
  TrendingUp,
  Share2,
  Bell,
  BellOff,
  Filter,
  Settings,
  Shield
} from "lucide-react";

interface TournamentDetailsProps {
  tournamentId: number;
  onBack: () => void;
}

export function TournamentDetails({ tournamentId, onBack }: TournamentDetailsProps) {
  const [tournament, setTournament] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("masculino");
  const [selectedDivision, setSelectedDivision] = useState("1");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showLEDConfig, setShowLEDConfig] = useState(false);
  const [ledPanelConfig, setLedPanelConfig] = useState<any>(null);
  const [showOrganizerTeam, setShowOrganizerTeam] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    loadTournamentData();
  }, [tournamentId]);

  // Carregar configuração do LED do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`volleypro_led_config_${tournamentId}`);
      if (saved) {
        const config = JSON.parse(saved);
        console.log("📂 [LED] Configuração carregada do localStorage:", config);
        setLedPanelConfig(config);
      }
    } catch (error) {
      console.error("❌ [LED] Erro ao carregar config do localStorage:", error);
    }
  }, [tournamentId]);

  // Notificar quando categoria/divisão mudar
  useEffect(() => {
    if (tournament) {
      const categoryName = selectedCategory === "masculino" ? "Masculino" : 
                          selectedCategory === "feminino" ? "Feminino" : "Misto";
      toast.info(`Visualizando: ${categoryName} - ${selectedDivision}ª Divisão`, {
        duration: 2000
      });
    }
  }, [selectedCategory, selectedDivision]);

  async function loadTournamentData() {
    setLoading(true);
    try {
      // Pegar usuário autenticado
      const userId = localStorage.getItem('volleypro_user_id');
      setCurrentUserId(userId);
      
      // Verificar permissões de edição
      if (userId) {
        try {
          const token = localStorage.getItem('volleypro_token');
          const response = await fetch(
            `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/can-edit`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Permissões do torneio:', data);
            setCanEdit(data.canEdit);
            setIsCreator(data.isCreator);
            setIsOrganizer(data.canEdit);
          } else {
            console.log('⚠️ Falha ao verificar permissões:', response.status);
          }
        } catch (error) {
          console.error('Erro ao verificar permissões:', error);
        }
      }
      
      // TODO: Carregar dados reais do backend
      // Simulando dados do torneio
      const mockUserId = userId || "user123";
      
      const mockTournament = {
        id: tournamentId,
        name: "Liga Municipal de Voleibol 2025",
        description: "Campeonato municipal com os melhores times da região",
        status: "ongoing",
        startDate: "2025-11-07",
        endDate: "2025-11-09",
        location: "Ginásio Municipal",
        organizer: "Prefeitura Municipal",
        organizerId: mockUserId, // Mesmo ID para simular que é organizador
        organizerAvatar: "https://ui-avatars.com/api/?name=PM&background=0052cc&color=fff",
        teams: 16,
        matches: 32,
        format: "Grupos + Eliminatórias",
        prize: "R$ 5.000,00",
        currentPhase: "Fase de Grupos",
        liveMatches: 2,
        bannerImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=400&fit=crop",
        categories: ["masculino", "feminino", "misto"],
        divisions: ["1", "2", "3", "4"],
        categoryData: {
          masculino: {
            "1": { teams: 16, matches: 32, liveMatches: 2 },
            "2": { teams: 12, matches: 24, liveMatches: 1 },
            "3": { teams: 8, matches: 16, liveMatches: 0 },
            "4": { teams: 10, matches: 20, liveMatches: 1 }
          },
          feminino: {
            "1": { teams: 14, matches: 28, liveMatches: 1 },
            "2": { teams: 10, matches: 20, liveMatches: 0 },
            "3": { teams: 6, matches: 12, liveMatches: 0 },
            "4": { teams: 8, matches: 16, liveMatches: 0 }
          },
          misto: {
            "1": { teams: 12, matches: 24, liveMatches: 0 },
            "2": { teams: 8, matches: 16, liveMatches: 0 },
            "3": { teams: 6, matches: 12, liveMatches: 0 },
            "4": { teams: 4, matches: 8, liveMatches: 0 }
          }
        },
        sponsors: [
          {
            id: "sponsor-1",
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=1200&h=400&fit=crop",
            duration: 5,
            link: "https://example.com/sponsor1"
          },
          {
            id: "sponsor-2",
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&h=400&fit=crop",
            duration: 5,
            link: "https://example.com/sponsor2"
          },
          {
            id: "sponsor-3",
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=400&fit=crop",
            duration: 6
          }
        ]
      };

      setTournament(mockTournament);
      
      // Verificar se é organizador
      setIsOrganizer(mockTournament.organizerId === mockUserId);
    } catch (error) {
      console.error("Erro ao carregar torneio:", error);
      toast.error("Erro ao carregar detalhes do torneio");
    } finally {
      setLoading(false);
    }
  }

  function handleFollow() {
    try {
      setIsFollowing(!isFollowing);
      if (!isFollowing) {
        toast.success("Seguindo torneio!", {
          description: "Você receberá notificações sobre este torneio"
        });
      } else {
        toast.info("Deixou de seguir o torneio");
      }
    } catch (error) {
      console.error('Erro ao seguir torneio:', error);
      toast.error('Erro ao processar ação');
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: tournament?.name,
        text: `Acompanhe o ${tournament?.name} no VolleyPro!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!", {
        description: "Compartilhe com seus amigos"
      });
    }
  }

  // Função para obter dados da categoria e divisão atual
  function getCurrentCategoryData() {
    if (!tournament?.categoryData) return null;
    return tournament.categoryData[selectedCategory]?.[selectedDivision] || null;
  }

  const currentData = getCurrentCategoryData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando torneio...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Torneio não encontrado</p>
            <Button onClick={onBack}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10">
      {/* Header com Painel LED Animado */}
      <div className="relative z-0 overflow-hidden">
        {ledPanelConfig ? (
          <AnimatedLEDPanel
            zones={ledPanelConfig.zones}
            media={ledPanelConfig.media} // Retrocompatibilidade
            layout={ledPanelConfig.layout}
            animationType={ledPanelConfig.animationType}
            randomOrder={ledPanelConfig.randomOrder}
            autoPlay={ledPanelConfig.autoPlay}
            transitionSpeed={ledPanelConfig.transitionSpeed}
            height={320}
          />
        ) : (
          <TournamentSponsorsPanel
            sponsors={tournament.sponsors || []}
            height={320}
            autoPlay={true}
            showControls={false}
            layout="grid-3"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        
        {/* Botões de Gerenciamento (apenas para organizadores) */}
        {canEdit ? (
          <div className="absolute top-4 right-4 z-20 pointer-events-auto flex gap-2">
            <Button
              onClick={() => {
                console.log('🔘 Clicou em Equipe de Organização');
                setShowOrganizerTeam(true);
              }}
              className="bg-blue-600/90 hover:bg-blue-700 text-white border border-white/30 backdrop-blur-sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Equipe de Organização
            </Button>
            <Button
              onClick={() => {
                console.log('🔘 Clicou em Configurar LED');
                setShowLEDConfig(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar Painel LED
            </Button>
          </div>
        ) : (
          <div className="absolute top-4 right-4 z-20 pointer-events-auto">
            <p className="text-xs text-white/60 bg-black/30 px-2 py-1 rounded">
              {currentUserId ? 'Apenas organizador' : 'Faça login'}
            </p>
          </div>
        )}
        
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pointer-events-none">
          {/* Botão Voltar */}
          <div className="pt-6 pointer-events-auto">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Info do Torneio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between flex-1 pb-6 gap-4 pointer-events-auto">
            <div className="flex items-end gap-4">
              {/* Avatar do Organizador */}
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={tournament.organizerAvatar} />
                <AvatarFallback>OR</AvatarFallback>
              </Avatar>

              {/* Título e Info Básica */}
              <div className="text-white space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold drop-shadow-lg">{tournament.name}</h1>
                  <Badge variant="secondary" className="bg-green-500 text-white border-0">
                    <Radio className="h-3 w-3 mr-1 animate-pulse" />
                    {tournament.liveMatches} AO VIVO
                  </Badge>
                </div>
                <p className="text-white/90 max-w-2xl drop-shadow">{tournament.description}</p>
                <div className="flex items-center gap-4 text-sm text-white/90 flex-wrap drop-shadow">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {tournament.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {tournament.teams} times
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                onClick={handleFollow}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
              >
                {isFollowing ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Seguindo
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Seguir
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Rápidos */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-2 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-0.5" />
              <p className="font-bold">{currentData?.teams || tournament.teams}</p>
              <p className="text-[10px] text-white/80">Times</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-2 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-0.5" />
              <p className="font-bold">{currentData?.matches || tournament.matches}</p>
              <p className="text-[10px] text-white/80">Partidas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-2 text-center">
              <Award className="h-5 w-5 mx-auto mb-0.5" />
              <p className="font-bold">{tournament.prize}</p>
              <p className="text-[10px] text-white/80">Premiação</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-2 text-center">
              <Radio className="h-5 w-5 mx-auto mb-0.5 animate-pulse" />
              <p className="font-bold">{currentData?.liveMatches || tournament.liveMatches}</p>
              <p className="text-[10px] text-white/80">Ao Vivo</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seletor de Categoria e Divisão */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Filtrar por Categoria e Divisão</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Tabs de Categoria */}
            <div className="flex-1 w-full sm:w-auto">
              <p className="text-xs text-muted-foreground mb-2">Categoria</p>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === "masculino" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("masculino")}
                  className="flex-1 sm:flex-none"
                >
                  🏐 Masculino
                </Button>
                <Button
                  variant={selectedCategory === "feminino" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("feminino")}
                  className="flex-1 sm:flex-none"
                >
                  🏐 Feminino
                </Button>
                <Button
                  variant={selectedCategory === "misto" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("misto")}
                  className="flex-1 sm:flex-none"
                >
                  🏐 Misto
                </Button>
              </div>
            </div>

            {/* Select de Divisão */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <p className="text-xs text-muted-foreground mb-2">Divisão</p>
              <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a divisão" />
                </SelectTrigger>
                <SelectContent>
                  {tournament?.divisions?.map((division: string) => (
                    <SelectItem key={division} value={division}>
                      {division}ª Divisão
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Indicador da seleção atual */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm">
              Visualizando: <span className="font-semibold text-primary">
                {selectedCategory === "masculino" ? "Masculino" : selectedCategory === "feminino" ? "Feminino" : "Misto"}
              </span> • <span className="font-semibold text-primary">{selectedDivision}ª Divisão</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="standings"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Classificação
            </TabsTrigger>
            <TabsTrigger 
              value="schedule"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Jogos
            </TabsTrigger>
            <TabsTrigger 
              value="bracket"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Chaveamento
            </TabsTrigger>
            <TabsTrigger 
              value="mvp"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              MVP
            </TabsTrigger>
            <TabsTrigger 
              value="draw"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Sorteio
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo das Tabs */}
          <TabsContent value="overview" className="space-y-6">
            {/* Fase Atual */}
            <Card>
              <CardHeader>
                <CardTitle>Fase Atual</CardTitle>
                <CardDescription>Acompanhe o andamento do torneio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <div>
                      <h3 className="font-semibold">{tournament.currentPhase}</h3>
                      <p className="text-sm text-muted-foreground">Em andamento</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      <Radio className="h-3 w-3 mr-1 animate-pulse" />
                      Ao Vivo
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-medium">Formato</h4>
                      <p className="text-sm text-muted-foreground">{tournament.format}</p>
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-medium">Organizador</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={tournament.organizerAvatar} />
                          <AvatarFallback>OR</AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">{tournament.organizer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partidas Ao Vivo */}
            {tournament.liveMatches > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                    Partidas Ao Vivo
                  </CardTitle>
                  <CardDescription>Acompanhe os jogos em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2].map((match) => (
                      <div 
                        key={match}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="bg-red-500 text-white">
                            <Radio className="h-3 w-3 mr-1 animate-pulse" />
                            AO VIVO
                          </Badge>
                          <span className="text-sm text-muted-foreground">Set 2</span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <div className="text-right space-y-1">
                            <p className="font-medium">Time A</p>
                            <p className="text-2xl font-bold text-primary">2</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Sets</p>
                            <p className="text-sm font-medium">vs</p>
                            <p className="text-xs text-muted-foreground mt-1">15:30</p>
                          </div>
                          <div className="text-left space-y-1">
                            <p className="font-medium">Time B</p>
                            <p className="text-2xl font-bold">1</p>
                          </div>
                        </div>
                        <Button className="w-full mt-3" variant="outline" size="sm">
                          <Radio className="h-4 w-4 mr-2" />
                          Assistir Ao Vivo
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Próximas Partidas */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Partidas</CardTitle>
                <CardDescription>Não perca os próximos jogos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((match) => (
                    <div 
                      key={match}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Fase de Grupos - Grupo A</span>
                        <Badge variant="outline">Amanhã</Badge>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">Time {match}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">14:00</p>
                          <p className="text-xs text-muted-foreground">Quadra Central</p>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Time {match + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standings">
            <TournamentStandings 
              tournamentId={tournamentId} 
              category={selectedCategory}
              division={selectedDivision}
              canEdit={canEdit}
            />
          </TabsContent>

          <TabsContent value="schedule">
            <TournamentSchedule 
              tournamentId={tournamentId}
              category={selectedCategory}
              division={selectedDivision}
              canEdit={canEdit}
            />
          </TabsContent>

          <TabsContent value="bracket">
            <TournamentBracket 
              tournament={tournament}
              tournamentId={tournamentId}
              canEdit={canEdit}
            />
          </TabsContent>

          <TabsContent value="mvp">
            <TournamentMVP 
              tournamentId={tournamentId}
              category={selectedCategory}
              division={selectedDivision}
            />
          </TabsContent>

          <TabsContent value="draw">
            <TournamentDraw 
              tournamentId={tournamentId} 
              tournament={tournament}
              category={selectedCategory}
              division={selectedDivision}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Configuração do Painel LED */}
      <LEDPanelConfigModal
        open={showLEDConfig}
        onOpenChange={setShowLEDConfig}
        tournamentId={tournamentId.toString()}
        currentConfig={ledPanelConfig}
        onSave={(config) => {
          console.log("💾 [LED] Salvando configuração:", config);
          setLedPanelConfig(config);
          
          // Salvar no localStorage como backup
          try {
            localStorage.setItem(
              `volleypro_led_config_${tournamentId}`,
              JSON.stringify(config)
            );
            console.log("✅ [LED] Config salva no localStorage");
          } catch (error) {
            console.error("❌ [LED] Erro ao salvar no localStorage:", error);
          }
          
          // Contar total de mídias nas zonas
          const totalMedia = Object.values(config.zones).reduce(
            (sum, zone) => sum + zone.length,
            0
          );
          
          toast.success("Painel LED configurado!", {
            description: `${totalMedia} mídia(s) adicionada(s) com layout ${config.layout}`
          });
        }}
      />

      {/* Modal de Equipe Organizadora */}
      <TournamentOrganizerTeamModal
        open={showOrganizerTeam}
        onClose={() => setShowOrganizerTeam(false)}
        tournamentId={tournamentId}
        isCreator={isCreator}
      />
    </div>
  );
}
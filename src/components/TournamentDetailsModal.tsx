import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
import { tournamentApi, userApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { Trophy, Users, Calendar, MapPin, Award, Play, CheckCircle2, X, XCircle, UserPlus, Shield, ImagePlus } from "lucide-react";
import { TournamentRosterModal } from "./TournamentRosterModal";
import { BeachTournamentRegistration } from "./BeachTournamentRegistration";
import { BeachTournamentIndividualRegistration } from "./BeachTournamentIndividualRegistration";
import { TournamentBracket } from "./TournamentBracket";
import { TournamentStandings } from "./TournamentStandings";
import { BeachTournamentBracket } from "./BeachTournamentBracket";
import { BeachTournamentStandings } from "./BeachTournamentStandings";
import { AnimatedLEDPanel } from "./AnimatedLEDPanel";
import { TournamentSquadSelectionModal } from "./TournamentSquadSelectionModal";
import { TournamentOrganizerTeamModal } from "./TournamentOrganizerTeamModal";
import { LEDPanelConfigModal } from "./LEDPanelConfigModal";

interface TournamentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  currentUserId?: string;
  userType?: string;
  onRegistrationSuccess?: () => void;
}

export function TournamentDetailsModal({ 
  open, 
  onClose, 
  tournamentId,
  currentUserId,
  userType,
  onRegistrationSuccess,
}: TournamentDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [tournament, setTournament] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [mvpRankings, setMvpRankings] = useState<any[]>([]);
  
  // Match result form
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [homeSets, setHomeSets] = useState("");
  const [awaySets, setAwaySets] = useState("");
  
  // Cancel tournament
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Roster/Convocação
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [currentUserTeamName, setCurrentUserTeamName] = useState("");
  const [selectedSquadId, setSelectedSquadId] = useState<string>("");
  const [selectedSquadName, setSelectedSquadName] = useState<string>("");
  
  // Beach Tournament Registration
  const [showBeachRegistration, setShowBeachRegistration] = useState(false);
  const [showIndividualRegistration, setShowIndividualRegistration] = useState(false);
  
  // Squad Selection Modal (for teams with multiple squads)
  const [showSquadSelection, setShowSquadSelection] = useState(false);
  const [showSquadSelectionForConvocation, setShowSquadSelectionForConvocation] = useState(false);
  
  // Organizer Management Modals
  const [showOrganizerTeamModal, setShowOrganizerTeamModal] = useState(false);
  const [showLEDPanelConfig, setShowLEDPanelConfig] = useState(false);

  useEffect(() => {
    if (open && tournamentId && tournamentId !== '') {
      loadTournamentDetails();
    }
  }, [open, tournamentId]);

  async function loadTournamentDetails() {
    // Validar tournamentId
    if (!tournamentId || tournamentId === '' || tournamentId === 'undefined') {
      console.warn('⚠️ TournamentDetailsModal: ID inválido');
      onClose();
      return;
    }

    setLoading(true);
    try {
      const { tournament: t, matches: m, teams: tm } = await tournamentApi.getTournamentDetails(tournamentId);
      
      if (!t) {
        console.error('❌ Torneio não encontrado:', tournamentId);
        toast.error("Torneio não encontrado");
        onClose();
        return;
      }

      console.log('🔍 DEBUG Frontend - Dados recebidos:', {
        tournamentId: t?.id,
        tournamentName: t?.name,
        modalityType: t?.modalityType,
        teamsReceived: tm?.length,
        teamsSample: tm?.slice(0, 2),
        registeredTeamsInTournament: t?.registeredTeams?.length
      });
      
      setTournament(t);
      setMatches(m || []);
      setTeams(tm || []);

      // Load current user team name if registered
      if (currentUserId && t.registeredTeams?.includes(currentUserId)) {
        try {
          const currentUserData = await userApi.getCurrentUser();
          if (currentUserData.profile && currentUserData.profile.userType === 'team') {
            setCurrentUserTeamName(currentUserData.profile.name);
          }
        } catch (err) {
          console.warn('⚠️ Erro ao carregar dados do usuário:', err);
        }
      }

      // Load standings if ongoing
      if (t.status === 'ongoing' || t.status === 'finished') {
        try {
          const { standings: s } = await tournamentApi.getStandings(tournamentId);
          setStandings(s || []);
        } catch (err) {
          console.warn('⚠️ Erro ao carregar classificação:', err);
          setStandings([]);
        }
      }

      // Load MVP rankings
      try {
        const { rankings } = await tournamentApi.getMVPRankings(tournamentId);
        setMvpRankings(rankings || []);
      } catch (err) {
        console.warn('⚠️ Erro ao carregar MVP rankings:', err);
        setMvpRankings([]);
      }
    } catch (error: any) {
      console.error("❌ Error loading tournament:", error);
      toast.error(error.message || "Erro ao carregar torneio");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function handleDraw() {
    try {
      setLoading(true);
      await tournamentApi.drawBrackets(tournamentId);
      toast.success("🎲 Sorteio realizado! O torneio começou!");
      await loadTournamentDetails();
    } catch (error: any) {
      console.error("Error drawing brackets:", error);
      toast.error(error.message || "Erro ao sortear");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMatchResult() {
    if (!selectedMatch) return;

    try {
      setLoading(true);
      await tournamentApi.updateMatchResult(tournamentId, selectedMatch.id, {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
        homeSets: parseInt(homeSets),
        awaySets: parseInt(awaySets),
      });
      toast.success("✅ Resultado registrado!");
      setSelectedMatch(null);
      setHomeScore("");
      setAwayScore("");
      setHomeSets("");
      setAwaySets("");
      await loadTournamentDetails();
    } catch (error: any) {
      console.error("Error updating match:", error);
      toast.error(error.message || "Erro ao atualizar resultado");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setLoading(true);
      console.log('📝 Registering team in tournament:', {
        tournamentId,
        currentUserId,
        userType
      });
      await tournamentApi.registerTeam(tournamentId);
      toast.success("🏐 Time inscrito com sucesso!", {
        description: "Agora você pode convocar seus atletas"
      });
      await loadTournamentDetails();
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (error: any) {
      console.error("❌ Error registering:", error);
      toast.error(error.message || "Erro ao inscrever");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnregister() {
    try {
      setLoading(true);
      console.log('🗑️ Cancelando inscrição...', { tournamentId, currentUserId });
      await tournamentApi.unregisterTeam(tournamentId, currentUserId!);
      toast.success("Inscrição cancelada com sucesso!");
      console.log('✅ Inscrição cancelada, recarregando...');
      await loadTournamentDetails();
    } catch (error: any) {
      console.error("❌ Erro ao cancelar:", error);
      toast.error(error.message || "Erro ao cancelar inscrição");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelTournament() {
    if (!cancelReason.trim()) {
      toast.error("Por favor, informe o motivo do cancelamento");
      return;
    }

    try {
      setIsCancelling(true);
      await tournamentApi.cancelTournament(tournamentId, cancelReason.trim());
      toast.success("🚫 Torneio cancelado", {
        description: "Todos os times inscritos foram notificados"
      });
      setShowCancelDialog(false);
      setCancelReason("");
      await loadTournamentDetails();
      // Fechar o modal principal após cancelar
      onClose();
    } catch (error: any) {
      console.error("Error cancelling tournament:", error);
      toast.error(error.message || "Erro ao cancelar torneio");
    } finally {
      setIsCancelling(false);
    }
  }

  if (!open || !tournamentId) {
    return null;
  }

  if (loading && !tournament) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl" aria-describedby="loading-tournament-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Carregando Torneio</DialogTitle>
            <DialogDescription id="loading-tournament-description">Aguarde enquanto carregamos os detalhes do torneio</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-12">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Carregando torneio...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tournament) {
    return null;
  }

  const isOrganizer = currentUserId === tournament.organizerId;
  
  // ✅ VERIFICAÇÃO CORRETA: Checa AMBOS arrays (legado + novo sistema)
  const isRegisteredLegacy = tournament.registeredTeams?.includes(currentUserId);
  const isRegisteredSquad = tournament.squadRegistrations?.some(
    (reg: any) => reg.teamId === currentUserId
  );
  const isRegistered = isRegisteredLegacy || isRegisteredSquad;
  
  // Detectar se é torneio de areia
  const isBeachTournament = tournament.modalityType === 'beach';
  
  // Para torneios de AREIA: verificar se está em individualRegistrations ou registeredTeams
  const isRegisteredBeach = isBeachTournament && (
    tournament.individualRegistrations?.some((reg: any) => reg.userId === currentUserId) ||
    tournament.registeredTeams?.some((team: any) => team.players?.some((p: any) => p.id === currentUserId))
  );
  
  // Para torneios de AREIA: qualquer atleta pode se inscrever formando dupla
  // Para torneios de QUADRA: apenas times podem se inscrever
  const canRegister = !isBeachTournament && userType === 'team' && tournament.status === 'upcoming' && !isRegistered;
  const canRegisterBeach = isBeachTournament && userType === 'athlete' && tournament.status === 'upcoming';
  const canUnregister = userType === 'team' && tournament.status === 'upcoming' && isRegistered;

  // Debug log SUPER DETALHADO
  console.log('🔍 ====== TOURNAMENT DETAILS DEBUG ======');
  console.log('📋 Torneio:', {
    id: tournamentId,
    name: tournament.name,
    status: tournament.status,
    modalityType: tournament.modalityType,
    organizerId: tournament.organizerId,
  });
  console.log('👤 Usuário:', {
    currentUserId,
    userType,
    isOrganizer,
  });
  console.log('📊 Arrays de Inscrição:', {
    'registeredTeams (LEGADO)': tournament.registeredTeams || [],
    'squadRegistrations (NOVO)': tournament.squadRegistrations || [],
  });
  console.log('✅ Verificações:', {
    isRegisteredLegacy: tournament.registeredTeams?.includes(currentUserId),
    isRegisteredSquad: tournament.squadRegistrations?.some((reg: any) => reg.teamId === currentUserId),
    isRegistered: isRegistered,
    isRegisteredBeach: isRegisteredBeach || false,
  });
  console.log('🎮 Ações Permitidas:', {
    canRegister,
    canRegisterBeach,
    canUnregister,
  });
  console.log('=======================================\n');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="tournament-details-description">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle>{tournament.name}</DialogTitle>
                <DialogDescription id="tournament-details-description">
                  Organizado por {tournament.organizerName}
                </DialogDescription>
              </div>
            </div>
            <Badge variant={
              tournament.status === 'ongoing' ? 'default' : 
              tournament.status === 'cancelled' ? 'destructive' : 
              'secondary'
            }>
              {tournament.status === 'upcoming' && '📅 Em breve'}
              {tournament.status === 'ongoing' && '🏐 Em andamento'}
              {tournament.status === 'finished' && '🏆 Finalizado'}
              {tournament.status === 'cancelled' && '🚫 Cancelado'}
            </Badge>
          </div>
        </DialogHeader>

        {/* Cancellation info */}
        {tournament.status === 'cancelled' && tournament.cancellationReason && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-1">
                  Torneio Cancelado
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Motivo:</strong> {tournament.cancellationReason}
                </p>
                {tournament.cancelledAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Cancelado em {new Date(tournament.cancelledAt).toLocaleDateString('pt-BR')} às {new Date(tournament.cancelledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tournament info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Início</p>
              <p>{new Date(tournament.startDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Local</p>
              <p>{tournament.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Equipes Inscritas</p>
              <p>{tournament.squadRegistrations?.length || teams.length || 0}/{tournament.maxTeams}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Formato</p>
              <p>{tournament.format === 'single_elimination' ? 'Eliminatória' : 'Todos vs Todos'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap justify-between">
          <div className="flex gap-2 flex-wrap">
            {isOrganizer && tournament.status === 'upcoming' && tournament.registeredTeams?.length >= 2 && (
              <Button onClick={handleDraw} disabled={loading}>
                <Play className="h-4 w-4 mr-2" />
                Sortear e Iniciar Torneio
              </Button>
            )}
            
            {/* Botões de Gerenciamento - Visíveis APENAS para o organizador */}
            {isOrganizer && (
              <>
                <Button 
                  onClick={() => setShowOrganizerTeamModal(true)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Equipe Organizadora
                </Button>
                
                <Button 
                  onClick={() => setShowLEDPanelConfig(true)}
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Painel LED
                </Button>
              </>
            )}
            
            {canRegister && (
              <Button 
                onClick={() => {
                  console.log('🎯 Inscrever button clicked - Opening squad selection:', {
                    tournamentId,
                    currentUserId,
                    userType,
                    isRegistered
                  });
                  setShowSquadSelection(true);
                }} 
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Inscrever Meu Time
              </Button>
            )}

            {canRegisterBeach && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowIndividualRegistration(true)}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Me Inscrever
                </Button>
                <Button 
                  onClick={() => setShowBeachRegistration(true)}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Formar Dupla
                </Button>
              </div>
            )}

            {canUnregister && (
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('🎯 Cancelar inscrição button clicked:', {
                    tournamentId,
                    currentUserId
                  });
                  handleUnregister();
                }} 
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar Inscrição
              </Button>
            )}

            {/* Botão de Convocação - Apenas para times inscritos */}
            {isRegistered && userType === 'team' && (
              <Button 
                onClick={() => {
                  // Verificar quantas equipes do time estão inscritas no torneio
                  const mySquads = teams.filter((t: any) => t.teamId === currentUserId);
                  
                  console.log('🎯 Verificando equipes inscritas:', {
                    totalTeams: teams.length,
                    currentUserId,
                    mySquads: mySquads.length,
                    mySquadsData: mySquads
                  });
                  
                  if (mySquads.length === 0) {
                    toast.error("Erro: Nenhuma equipe encontrada");
                    return;
                  }
                  
                  if (mySquads.length === 1) {
                    // Uma equipe apenas: abrir modal direto
                    setSelectedSquadId(mySquads[0].squadId || '');
                    setSelectedSquadName(mySquads[0].squadName || 'Equipe Principal');
                    setShowRosterModal(true);
                  } else {
                    // Múltiplas equipes: mostrar seletor primeiro
                    setShowSquadSelectionForConvocation(true);
                  }
                }}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Convocação
              </Button>
            )}

            {/* Mensagens explicativas sobre inscrição */}
            {!userType && tournament.status === 'upcoming' && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg px-4 py-2 text-sm text-blue-800 dark:text-blue-200">
                ℹ️ {isBeachTournament ? 'Faça login como atleta para inscrever sua dupla' : 'Faça login como time para se inscrever neste torneio'}
              </div>
            )}
            
            {/* Mensagem para vôlei de QUADRA - Apenas times podem se inscrever */}
            {userType && userType !== 'team' && tournament.status === 'upcoming' && !isBeachTournament && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
                ℹ️ Torneio de Quadra: Apenas times podem se inscrever. Atletas participam através de convocação.
              </div>
            )}

            {/* Mensagem para vôlei de AREIA - Apenas atletas podem inscrever duplas */}
            {userType && userType !== 'athlete' && tournament.status === 'upcoming' && isBeachTournament && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
                🏖️ Torneio de Areia: Apenas atletas podem inscrever duplas. Busque parceiros e registre sua equipe!
              </div>
            )}

            {isRegistered && tournament.status === 'upcoming' && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg px-4 py-2 text-sm text-green-800 dark:text-green-200">
                ✅ Seu time está inscrito! Use o botão "Convocação" para adicionar seus atletas.
              </div>
            )}

            {tournament.status === 'ongoing' && !isRegistered && (
              <div className="bg-gray-50 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-900 rounded-lg px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                ⚠️ Torneio em andamento - inscrições encerradas
              </div>
            )}

            {tournament.status === 'cancelled' && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-4 py-2 text-sm text-red-800 dark:text-red-200">
                🚫 Torneio cancelado
              </div>
            )}
          </div>

          {/* Botão de cancelar torneio (apenas organizador e se não finalizado) */}
          {isOrganizer && tournament.status !== 'finished' && tournament.status !== 'cancelled' && (
            <Button 
              variant="destructive" 
              onClick={() => setShowCancelDialog(true)} 
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar Torneio
            </Button>
          )}
        </div>

        <Tabs defaultValue="teams" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="teams">{isBeachTournament ? '🏖️ Duplas' : 'Times'} ({teams.length})</TabsTrigger>
            <TabsTrigger value="matches">Jogos ({matches.length})</TabsTrigger>
            <TabsTrigger value="standings">Classificação</TabsTrigger>
            <TabsTrigger value="bracket">Chaveamento</TabsTrigger>
            <TabsTrigger value="led">Painel LED</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-2">
            {teams.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Nenhum time inscrito ainda
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teams.map((team: any, index: number) => (
                  <Card key={team.id || team.squadId || index}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
                        {team.photoUrl ? (
                          <img src={team.photoUrl} alt={team.teamName || team.name} className="h-full w-full object-cover" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{team.teamName || team.name}</p>
                        {team.squadName && (
                          <p className="text-sm font-medium text-primary">
                            📌 {team.squadName}
                          </p>
                        )}
                        {team.categoryName && !team.squadName && (
                          <p className="text-sm font-medium text-primary">
                            📌 {team.categoryName}
                          </p>
                        )}
                        {team.players && team.players.length > 0 ? (
                          <p className="text-sm text-muted-foreground">
                            ✅ {team.players.length} jogador(es) cadastrado(s)
                          </p>
                        ) : (
                          <p className="text-sm text-orange-500">
                            ⚠️ Sem jogadores cadastrados
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-3">
            {matches.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  {tournament.status === 'upcoming' 
                    ? 'Aguardando sorteio...' 
                    : 'Nenhum jogo agendado'}
                </CardContent>
              </Card>
            ) : (
              matches.map((match: any) => {
                const homeTeam = teams.find(t => t.id === match.homeTeamId);
                const awayTeam = teams.find(t => t.id === match.awayTeamId);

                return (
                  <Card key={match.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span>{homeTeam?.name || 'Time A'}</span>
                            {match.status === 'completed' && (
                              <span className="text-lg">{match.homeSets}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{awayTeam?.name || awayTeam ? 'Time B' : '(BYE)'}</span>
                            {match.status === 'completed' && awayTeam && (
                              <span className="text-lg">{match.awaySets}</span>
                            )}
                          </div>
                        </div>

                        <div className="ml-4">
                          {match.status === 'pending' ? (
                            <>
                              {isOrganizer && awayTeam && (
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedMatch(match)}
                                >
                                  Registrar Resultado
                                </Button>
                              )}
                              {!isOrganizer && (
                                <Badge variant="outline">Pendente</Badge>
                              )}
                            </>
                          ) : (
                            <Badge>Concluído</Badge>
                          )}
                        </div>
                      </div>

                      {match.status === 'completed' && (
                        <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                          Placar: {match.homeScore} x {match.awayScore} pontos
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}

            {/* Match result form */}
            {selectedMatch && (
              <Card className="border-primary">
                <CardHeader>
                  <h4>Registrar Resultado</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{teams.find(t => t.id === selectedMatch.homeTeamId)?.name}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label htmlFor="home-sets" className="text-xs">Sets</Label>
                          <Input
                            id="home-sets"
                            type="number"
                            min="0"
                            max="5"
                            value={homeSets}
                            onChange={(e) => setHomeSets(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="home-score" className="text-xs">Pontos</Label>
                          <Input
                            id="home-score"
                            type="number"
                            min="0"
                            value={homeScore}
                            onChange={(e) => setHomeScore(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>{teams.find(t => t.id === selectedMatch.awayTeamId)?.name}</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label htmlFor="away-sets" className="text-xs">Sets</Label>
                          <Input
                            id="away-sets"
                            type="number"
                            min="0"
                            max="5"
                            value={awaySets}
                            onChange={(e) => setAwaySets(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="away-score" className="text-xs">Pontos</Label>
                          <Input
                            id="away-score"
                            type="number"
                            min="0"
                            value={awayScore}
                            onChange={(e) => setAwayScore(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateMatchResult} disabled={loading}>
                      Salvar Resultado
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedMatch(null)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="standings">
            {standings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Classificação será exibida após os primeiros jogos
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Pos</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-center">J</TableHead>
                        <TableHead className="text-center">V</TableHead>
                        <TableHead className="text-center">D</TableHead>
                        <TableHead className="text-center">Sets</TableHead>
                        <TableHead className="text-center">Pts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standings.map((standing: any, index: number) => (
                        <TableRow key={standing.teamId}>
                          <TableCell>
                            {index === 0 && <span>🥇</span>}
                            {index === 1 && <span>🥈</span>}
                            {index === 2 && <span>🥉</span>}
                            {index > 2 && <span>{index + 1}</span>}
                          </TableCell>
                          <TableCell>{standing.teamName}</TableCell>
                          <TableCell className="text-center">{standing.played}</TableCell>
                          <TableCell className="text-center">{standing.wins}</TableCell>
                          <TableCell className="text-center">{standing.losses}</TableCell>
                          <TableCell className="text-center">
                            {standing.setsWon}-{standing.setsLost}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge>{standing.points}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bracket">
            {isBeachTournament ? (
              <BeachTournamentBracket tournament={tournament} />
            ) : (
              <TournamentBracket tournament={tournament} />
            )}
          </TabsContent>

          <TabsContent value="led" className="space-y-4">
            {/* Banner LED Animado com Patrocinadores */}
            {tournament.ledPanelConfig && Object.values(tournament.ledPanelConfig.zones).some((zone: any) => zone.length > 0) ? (
              <AnimatedLEDPanel 
                layout={tournament.ledPanelConfig.layout || "grid-3"}
                animationType={tournament.ledPanelConfig.animationType || "horizontal"}
                randomOrder={tournament.ledPanelConfig.randomOrder ?? true}
                autoPlay={tournament.ledPanelConfig.autoPlay ?? true}
                transitionSpeed={tournament.ledPanelConfig.transitionSpeed || 5}
                height={280}
                media={[
                  ...tournament.ledPanelConfig.zones.zone1,
                  ...tournament.ledPanelConfig.zones.zone2,
                  ...tournament.ledPanelConfig.zones.zone3,
                  ...tournament.ledPanelConfig.zones.zone4,
                ]}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <ImagePlus className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-2">Painel LED não configurado</p>
                  {isOrganizer && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Clique em "Painel LED" acima para adicionar logos e vídeos dos patrocinadores
                      </p>
                      <Button 
                        onClick={() => setShowLEDPanelConfig(true)}
                        variant="outline"
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Configurar Painel LED
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Card informativo sobre classificação com tema de areia se for beach */}
            {isBeachTournament ? (
              <BeachTournamentStandings tournamentId={parseInt(tournamentId)} />
            ) : (
              <TournamentStandings tournamentId={parseInt(tournamentId)} />
            )}
          </TabsContent>

          <TabsContent value="mvp">
            {mvpRankings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Nenhum voto para MVP ainda
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Pos</TableHead>
                        <TableHead>Atleta</TableHead>
                        <TableHead>Posição</TableHead>
                        <TableHead className="text-center">Votos</TableHead>
                        <TableHead className="text-center">Pontos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mvpRankings.map((ranking: any) => (
                        <TableRow key={ranking.athleteId}>
                          <TableCell>
                            {ranking.position === 1 && <Award className="h-5 w-5 text-amber-500" />}
                            {ranking.position === 2 && <Award className="h-5 w-5 text-gray-400" />}
                            {ranking.position === 3 && <Award className="h-5 w-5 text-orange-600" />}
                            {ranking.position > 3 && <span>{ranking.position}</span>}
                          </TableCell>
                          <TableCell>{ranking.athleteName}</TableCell>
                          <TableCell>{ranking.athletePosition}</TableCell>
                          <TableCell className="text-center">{ranking.totalVotes}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{ranking.totalPoints}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Roster/Convocação Modal */}
      {showRosterModal && currentUserId && (
        <TournamentRosterModal
          open={showRosterModal}
          onClose={() => {
            setShowRosterModal(false);
            setSelectedSquadId('');
            setSelectedSquadName('');
            // Recarregar detalhes do torneio para atualizar status de convocação
            loadTournamentDetails();
          }}
          tournamentId={tournamentId}
          tournamentName={tournament.name}
          teamId={currentUserId}
          teamName={currentUserTeamName}
          squadId={selectedSquadId}
          squadName={selectedSquadName}
          modalityType={tournament.modalityType || 'indoor'}
          teamSize={tournament.teamSize || 'duo'}
        />
      )}

      {/* Squad Selection for Convocation */}
      {showSquadSelectionForConvocation && (
        <Dialog open={showSquadSelectionForConvocation} onOpenChange={setShowSquadSelectionForConvocation}>
          <DialogContent className="max-w-md" aria-describedby="squad-selection-convocation-description">
            <DialogHeader>
              <DialogTitle>Selecione a Equipe</DialogTitle>
              <DialogDescription id="squad-selection-convocation-description">
                Você tem múltiplas equipes inscritas neste torneio. Selecione qual equipe deseja convocar jogadores.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {teams
                .filter((t: any) => t.teamId === currentUserId)
                .map((squad: any) => (
                  <Card 
                    key={squad.squadId || squad.id}
                    className="cursor-pointer hover:border-primary transition-all duration-200"
                    onClick={() => {
                      setSelectedSquadId(squad.squadId || '');
                      setSelectedSquadName(squad.squadName || 'Equipe Principal');
                      setShowSquadSelectionForConvocation(false);
                      setShowRosterModal(true);
                    }}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
                        {squad.photoUrl ? (
                          <img src={squad.photoUrl} alt={squad.squadName} className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{squad.teamName || currentUserTeamName}</p>
                        <p className="text-sm text-primary flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {squad.squadName || 'Equipe Principal'}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSquadSelectionForConvocation(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Beach Tournament Registration Modal */}
      {showBeachRegistration && (
        <BeachTournamentRegistration
          open={showBeachRegistration}
          onClose={() => {
            setShowBeachRegistration(false);
            // Recarregar detalhes do torneio após inscrição
            loadTournamentDetails();
            if (onRegistrationSuccess) {
              onRegistrationSuccess();
            }
          }}
          tournamentId={tournamentId}
          tournamentName={tournament.name}
          teamSize={tournament.teamSize || 'duo'}
        />
      )}

      {/* Beach Tournament Individual Registration Modal */}
      {showIndividualRegistration && (
        <BeachTournamentIndividualRegistration
          open={showIndividualRegistration}
          onClose={() => {
            setShowIndividualRegistration(false);
            // Recarregar detalhes do torneio após inscrição
            loadTournamentDetails();
            if (onRegistrationSuccess) {
              onRegistrationSuccess();
            }
          }}
          tournamentId={tournamentId}
          tournamentName={tournament.name}
        />
      )}

      {/* Squad Selection Modal - For teams with multiple squads */}
      {showSquadSelection && currentUserId && tournament && (
        <TournamentSquadSelectionModal
          open={showSquadSelection}
          onClose={() => setShowSquadSelection(false)}
          tournamentId={tournamentId}
          tournamentName={tournament.name}
          teamId={currentUserId}
          teamName={currentUserTeamName || 'Seu Time'}
          modalityType={tournament.modalityType || 'indoor'}
          onSquadSelected={(squad) => {
            console.log('✅ Squad selected:', squad);
            // Recarregar detalhes do torneio após inscrição
            loadTournamentDetails();
            if (onRegistrationSuccess) {
              onRegistrationSuccess();
            }
          }}
        />
      )}

      {/* Modal de Gerenciamento da Equipe Organizadora */}
      {showOrganizerTeamModal && isOrganizer && tournament && (
        <TournamentOrganizerTeamModal
          open={showOrganizerTeamModal}
          onClose={() => setShowOrganizerTeamModal(false)}
          tournamentId={parseInt(tournamentId)}
          isCreator={currentUserId === tournament.organizerId}
        />
      )}

      {/* Modal de Configuração do Painel LED */}
      {showLEDPanelConfig && isOrganizer && tournament && (
        <LEDPanelConfigModal
          open={showLEDPanelConfig}
          onOpenChange={setShowLEDPanelConfig}
          tournamentId={tournamentId}
          currentConfig={tournament.ledPanelConfig}
          onSave={async (config) => {
            try {
              console.log('💾 Salvando configuração do painel LED:', config);
              
              const token = localStorage.getItem('volleypro_token');
              const response = await fetch(
                `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/led-config`,
                {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ config })
                }
              );
              
              if (!response.ok) {
                throw new Error('Erro ao salvar configuração do painel');
              }
              
              toast.success('✅ Painel LED configurado com sucesso!');
              setShowLEDPanelConfig(false);
              // Recarregar torneio para atualizar dados
              await loadTournamentDetails();
            } catch (error: any) {
              console.error('Erro ao salvar painel LED:', error);
              toast.error(error.message || 'Erro ao salvar configuração');
            }
          }}
        />
      )}

      {/* AlertDialog para solicitar motivo do cancelamento */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent aria-describedby="cancel-tournament-description">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Cancelar Torneio
            </AlertDialogTitle>
            <AlertDialogDescription id="cancel-tournament-description">
              Esta ação é irreversível. Todos os times inscritos serão notificados sobre o cancelamento.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">
                Motivo do Cancelamento
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Ex: Quadra indisponível, falta de times, problemas climáticos..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                ⚠️ Este motivo será exibido para todos os times inscritos
              </p>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">
                <strong>Atenção:</strong> Ao cancelar este torneio:
              </p>
              <ul className="text-sm text-destructive mt-2 ml-4 space-y-1 list-disc">
                <li>Todas as inscrições serão canceladas</li>
                <li>Os jogos agendados serão removidos</li>
                <li>O torneio ficará marcado como "Cancelado"</li>
                <li>Não será possível reverter esta ação</li>
              </ul>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelTournament}
              disabled={isCancelling || !cancelReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelando..." : "Confirmar Cancelamento"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
import { Trophy, Calendar, MapPin, Users, Plus, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { mockTournaments } from "../lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState, useEffect } from "react";
import { tournamentApi, authApi, userApi, masterAdminApi } from "../lib/api";
import { CreateTournamentModal } from "./CreateTournamentModal";
import { TournamentDetailsModal } from "./TournamentDetailsModal";
import { TournamentAthleteView } from "./TournamentAthleteView";
import { toast } from "sonner@2.0.3";
import { LoginPrompt } from "./LoginPrompt";
import { Trash2, Eye } from "lucide-react";

interface TournamentsProps {
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
}

export function Tournaments({ isAuthenticated: authProp, onLoginPrompt }: TournamentsProps = {}) {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [athleteViewTournamentId, setAthleteViewTournamentId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    loadTournaments();
    checkAuth();
    loadCurrentUser();
  }, []);

  async function checkAuth() {
    try {
      const session = await authApi.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      setIsAuthenticated(false);
    }
  }

  async function loadCurrentUser() {
    try {
      const session = await authApi.getSession();
      if (session) {
        const userData = await userApi.getCurrentUser();
        console.log('📊 Tournaments - Current user loaded:', {
          id: userData.profile?.id,
          name: userData.profile?.name,
          userType: userData.profile?.userType,
          fullData: userData.profile
        });
        setCurrentUser(userData.profile);
        
        // Check master status
        try {
          const { isMaster: masterStatus } = await masterAdminApi.checkMasterStatus();
          setIsMaster(masterStatus);
        } catch (e) {
          setIsMaster(false);
        }
      }
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  }

  async function loadTournaments() {
    try {
      const { tournaments: apiTournaments } = await tournamentApi.getTournaments();
      console.log('📋 Loaded tournaments:', apiTournaments);
      setTournaments(apiTournaments || []);
    } catch (error) {
      console.error("Error loading tournaments:", error);
      setTournaments([]);
    }
  }

  async function handleRegister(tournamentId: string) {
    if (!isAuthenticated) {
      toast.error("Faça login para se inscrever em torneios", {
        action: onLoginPrompt ? {
          label: "Entrar",
          onClick: onLoginPrompt
        } : undefined
      });
      return;
    }

    // Apenas times podem se inscrever diretamente
    if (currentUser?.userType !== 'team') {
      toast.error("Apenas times podem se inscrever em torneios", {
        description: currentUser?.userType === 'athlete' 
          ? "Atletas participam através de convocação do seu time"
          : "Crie uma conta como time para participar de torneios"
      });
      return;
    }

    try {
      await tournamentApi.registerTeam(tournamentId);
      toast.success("Time inscrito no torneio!");
      loadTournaments();
    } catch (error: any) {
      console.error("Error registering for tournament:", error);
      toast.error(error.message || "Erro ao inscrever time");
    }
  }

  async function handleResetTournaments() {
    if (!confirm('⚠️ ATENÇÃO: Isso vai deletar TODOS os torneios e criar apenas o "Campeonato Municipal 2025". Continuar?')) {
      return;
    }

    try {
      const { projectId } = await import('../utils/supabase/info');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/admin/reset-tournaments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao resetar torneios');
      }

      const data = await response.json();
      console.log('✅ Torneios resetados:', data);
      toast.success('🏆 Torneios resetados! Apenas "Campeonato Municipal 2025" foi criado.');
      await loadTournaments();
    } catch (error: any) {
      console.error('Error resetting tournaments:', error);
      toast.error(error.message || 'Erro ao resetar torneios');
    }
  }

  async function handleDeleteTournament(tournamentId: string, tournamentName: string) {
    if (!isMaster) {
      toast.error("Acesso negado");
      return;
    }

    if (!confirm(`⚠️ Tem certeza que deseja DELETAR o torneio "${tournamentName}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await masterAdminApi.deleteTournament(tournamentId);
      toast.success(`🗑️ Torneio "${tournamentName}" deletado com sucesso!`);
      await loadTournaments();
    } catch (error: any) {
      console.error("❌ Erro ao deletar torneio:", error);
      toast.error(error.message || "Erro ao deletar torneio");
    }
  }

  const ongoingTournaments = tournaments.filter(t => t.status === "ongoing");
  const upcomingTournaments = tournaments.filter(t => t.status === "upcoming");
  const cancelledTournaments = tournaments.filter(t => t.status === "cancelled");

  // Mock tournament standings
  const standings = [
    { position: 1, team: "Sesi Bauru", played: 12, wins: 10, losses: 2, sets: "32-12", points: 30 },
    { position: 2, team: "Minas Tênis", played: 12, wins: 9, losses: 3, sets: "30-15", points: 27 },
    { position: 3, team: "Dentil Praia", played: 12, wins: 8, losses: 4, sets: "28-18", points: 24 },
    { position: 4, team: "Vôlei Renata", played: 12, wins: 7, losses: 5, sets: "25-20", points: 21 },
  ];

  // Mock MVP rankings
  const mvpRankings = [
    { name: "Gabi Guimarães", position: "Ponteiro", rating: 9.8, votes: 1250 },
    { name: "Bruno Rezende", position: "Levantador", rating: 9.5, votes: 1120 },
    { name: "Rosamaria", position: "Oposto", rating: 9.0, votes: 980 },
    { name: "Lucas Saatkamp", position: "Central", rating: 9.2, votes: 875 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {!isAuthenticated && onLoginPrompt && (
        <LoginPrompt 
          onLoginClick={onLoginPrompt}
          title="Participe de Torneios! 🏆"
          description="Crie sua conta para organizar torneios ou inscrever seu time em competições!"
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Torneios</h1>
          <p className="text-muted-foreground text-sm">Competições e campeonatos ao vivo</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleResetTournaments}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            🔄 Reset (Admin)
          </Button>
          <Button 
            onClick={() => {
              if (currentUser?.userType !== 'team') {
                toast.error("Apenas times podem criar torneios", {
                  description: currentUser?.userType === 'athlete'
                    ? "Você pode participar através de convocação do seu time"
                    : "Crie uma conta como time para organizar torneios"
                });
                return;
              }
              setShowCreateModal(true);
            }}
            disabled={!isAuthenticated || currentUser?.userType !== 'team'}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            title={currentUser?.userType !== 'team' ? "Apenas times podem criar torneios" : ""}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Torneio
          </Button>
        </div>
      </div>

      <CreateTournamentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadTournaments}
      />

      {selectedTournamentId && (
        <TournamentDetailsModal
          open={!!selectedTournamentId}
          onClose={() => {
            console.log('🚪 Closing tournament modal');
            setSelectedTournamentId(null);
          }}
          tournamentId={selectedTournamentId}
          currentUserId={currentUser?.id}
          userType={currentUser?.userType}
          onRegistrationSuccess={() => {
            console.log('✅ Registration successful, reloading tournaments');
            loadTournaments();
          }}
        />
      )}

      {athleteViewTournamentId && (
        <TournamentAthleteView
          open={!!athleteViewTournamentId}
          onClose={() => setAthleteViewTournamentId(null)}
          tournamentId={athleteViewTournamentId}
          currentUserId={currentUser?.id}
        />
      )}

      <Tabs defaultValue="ongoing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ongoing">Em Andamento ({ongoingTournaments.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos ({upcomingTournaments.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados ({cancelledTournaments.length})</TabsTrigger>
          <TabsTrigger value="mvp">MVP Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-4">
          {ongoingTournaments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum torneio em andamento no momento</p>
              </CardContent>
            </Card>
          ) : (
            ongoingTournaments.map((tournament) => (
              <Card 
                key={tournament.id} 
                className="border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {
                  console.log('🎯 Abrindo torneio:', tournament.id, tournament.name);
                  setSelectedTournamentId(tournament.id);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3>{tournament.name}</h3>
                        <p className="text-muted-foreground text-sm">Organizado por {tournament.organizerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>🏐 Em andamento</Badge>
                      {isMaster && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTournament(tournament.id, tournament.name);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Deletar torneio (Master)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="text-muted-foreground">Período</p>
                        <p>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</p>
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
                        <p className="text-muted-foreground">Times</p>
                        <p>{tournament.registeredTeams?.length || 0} participantes</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTournamentId(tournament.id);
                    }}>
                      Ver Detalhes Completos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAthleteViewTournamentId(tournament.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Times e Convocações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTournaments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum torneio agendado</p>
                <p className="text-sm mt-2">Seja o primeiro a criar um torneio!</p>
              </CardContent>
            </Card>
          ) : (
            upcomingTournaments.map((tournament) => (
              <Card 
                key={tournament.id}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  console.log('🎯 Upcoming tournament clicked:', {
                    id: tournament.id,
                    name: tournament.name,
                    status: tournament.status,
                    currentUserId: currentUser?.id,
                    currentUserType: currentUser?.userType
                  });
                  setSelectedTournamentId(tournament.id);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3>{tournament.name}</h3>
                        <p className="text-muted-foreground text-sm">Organizado por {tournament.organizerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">📅 Em breve</Badge>
                      {isMaster && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTournament(tournament.id, tournament.name);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Deletar torneio (Master)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <p className="text-muted-foreground">Vagas</p>
                        <p>{tournament.registeredTeams?.length || 0}/{tournament.maxTeams}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('🎯 Button clicked - Opening tournament for registration:', {
                          tournamentId: tournament.id,
                          tournamentName: tournament.name,
                          currentUserId: currentUser?.id,
                          currentUserType: currentUser?.userType,
                          isAuthenticated
                        });
                        setSelectedTournamentId(tournament.id);
                      }}
                      disabled={!isAuthenticated}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      {currentUser?.userType === 'team' ? '🏐 Inscrever Time' : 'Ver Detalhes'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAthleteViewTournamentId(tournament.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Times e Convocações
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-muted-foreground w-full mt-1">
                        Faça login para se inscrever
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledTournaments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum torneio cancelado</p>
              </CardContent>
            </Card>
          ) : (
            cancelledTournaments.map((tournament) => (
              <Card 
                key={tournament.id}
                className="border-l-4 border-l-destructive hover:shadow-lg transition-all cursor-pointer opacity-75"
                onClick={() => {
                  console.log('🎯 Cancelled tournament clicked:', {
                    id: tournament.id,
                    name: tournament.name,
                    status: tournament.status
                  });
                  setSelectedTournamentId(tournament.id);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                        <Trophy className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <h3 className="line-through text-muted-foreground">{tournament.name}</h3>
                        <p className="text-muted-foreground text-sm">Organizado por {tournament.organizerName}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">🚫 Cancelado</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tournament.cancellationReason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm text-destructive">
                        <strong>Motivo:</strong> {tournament.cancellationReason}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="text-muted-foreground">Estava previsto para</p>
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
                        <p className="text-muted-foreground">Times inscritos</p>
                        <p>{tournament.registeredTeams?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTournamentId(tournament.id);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAthleteViewTournamentId(tournament.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Times e Convocações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="mvp" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-amber-500" />
                <div>
                  <h2>Ranking MVP - Superliga 2024/25</h2>
                  <p className="text-muted-foreground">Atletas mais bem avaliados do campeonato</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos</TableHead>
                    <TableHead>Atleta</TableHead>
                    <TableHead>Posição</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-center">Votos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mvpRankings.map((player, index) => (
                    <TableRow key={player.name}>
                      <TableCell>
                        {index === 0 && <span className="text-amber-500">🥇</span>}
                        {index === 1 && <span className="text-gray-400">🥈</span>}
                        {index === 2 && <span className="text-orange-600">🥉</span>}
                        {index > 2 && <span>{index + 1}</span>}
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{player.rating}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{player.votes.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3>Seleção do Campeonato</h3>
              <p className="text-muted-foreground text-sm">Os melhores de cada posição</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Levantador</p>
                  <p>Bruno Rezende</p>
                  <Badge variant="secondary" className="mt-1">9.5</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Ponteiro 1</p>
                  <p>Gabi Guimarães</p>
                  <Badge variant="secondary" className="mt-1">9.8</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Ponteiro 2</p>
                  <p>Wallace de Souza</p>
                  <Badge variant="secondary" className="mt-1">8.9</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Central 1</p>
                  <p>Lucas Saatkamp</p>
                  <Badge variant="secondary" className="mt-1">9.2</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Central 2</p>
                  <p>-</p>
                  <Badge variant="secondary" className="mt-1">-</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Oposto</p>
                  <p>Rosamaria</p>
                  <Badge variant="secondary" className="mt-1">9.0</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Líbero</p>
                  <p>Natália Pereira</p>
                  <Badge variant="secondary" className="mt-1">8.5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

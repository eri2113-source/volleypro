import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Shield,
  CheckCircle2,
  Clock,
  X,
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { tournamentApi } from "../lib/api";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface TournamentAthleteViewProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  currentUserId?: string;
}

interface Player {
  id: string;
  name: string;
  cpf: string;
  photoUrl?: string;
  position: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface Roster {
  levantador?: Player[];
  ponteiro?: Player[];
  oposto?: Player[];
  central?: Player[];
  libero?: Player[];
  tecnico?: Player[];
  auxiliar?: Player[];
}

const POSITION_LABELS: Record<string, string> = {
  levantador: 'Levantador',
  ponteiro: 'Ponteiro',
  oposto: 'Oposto',
  central: 'Central',
  libero: 'Líbero',
  tecnico: 'Técnico',
  auxiliar: 'Auxiliar Técnico',
};

const POSITION_ICONS: Record<string, string> = {
  levantador: '🏐',
  ponteiro: '⚡',
  oposto: '💪',
  central: '🛡️',
  libero: '🦸',
  tecnico: '👨‍🏫',
  auxiliar: '👨‍💼',
};

export function TournamentAthleteView({
  open,
  onClose,
  tournamentId,
  currentUserId,
}: TournamentAthleteViewProps) {
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamRosters, setTeamRosters] = useState<Record<string, Roster>>({});
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && tournamentId) {
      loadTournamentData();
    }
  }, [open, tournamentId]);

  async function loadTournamentData() {
    setLoading(true);
    try {
      // Carregar detalhes do torneio
      const { tournament: tournamentData, teams: teamsData } = await tournamentApi.getTournamentDetails(tournamentId);
      
      console.log('🏆 Tournament data loaded:', { tournamentData, teamsData });
      
      setTournament(tournamentData);
      setTeams(teamsData || []);

      // Carregar convocações de cada time
      if (teamsData && teamsData.length > 0) {
        const rostersPromises = teamsData.map(async (team: any) => {
          try {
            const { roster } = await tournamentApi.getRoster(tournamentId, team.id);
            return { teamId: team.id, roster };
          } catch (error) {
            console.log(`No roster found for team ${team.id}`);
            return { teamId: team.id, roster: null };
          }
        });

        const rostersData = await Promise.all(rostersPromises);
        const rostersMap: Record<string, Roster> = {};
        
        rostersData.forEach(({ teamId, roster }) => {
          if (roster) {
            rostersMap[teamId] = roster;
          }
        });

        setTeamRosters(rostersMap);
      }
    } catch (error) {
      console.error('Error loading tournament data:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleTeamExpanded(teamId: string) {
    setExpandedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      upcoming: { variant: 'secondary', label: 'Inscrições Abertas', icon: Clock },
      ongoing: { variant: 'default', label: 'Em Andamento', icon: Trophy },
      finished: { variant: 'outline', label: 'Finalizado', icon: CheckCircle2 },
      cancelled: { variant: 'destructive', label: 'Cancelado', icon: X },
    };

    const config = variants[status] || variants.upcoming;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  function getPlayerStatusIcon(status: Player['status']) {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined':
        return <X className="h-4 w-4 text-red-500" />;
    }
  }

  function formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function getRosterStats(roster: Roster) {
    const total = Object.values(roster).reduce((sum, players) => sum + (players?.length || 0), 0);
    const confirmed = Object.values(roster)
      .flat()
      .filter((p: any) => p?.status === 'confirmed').length;
    const pending = Object.values(roster)
      .flat()
      .filter((p: any) => p?.status === 'pending').length;

    return { total, confirmed, pending };
  }

  function isUserInRoster(roster: Roster): boolean {
    if (!currentUserId) return false;
    
    return Object.values(roster)
      .flat()
      .some((player: any) => player?.id === currentUserId);
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tournament) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle>{tournament.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tournament.location}
                </span>
              </DialogDescription>
            </div>
            <div>
              {getStatusBadge(tournament.status)}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Informações gerais */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{teams.length}</p>
                <p className="text-sm text-muted-foreground">Times Inscritos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">
                  {Object.values(teamRosters).reduce((sum, roster) => {
                    return sum + getRosterStats(roster).total;
                  }, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Jogadores Convocados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{tournament.maxTeams}</p>
                <p className="text-sm text-muted-foreground">Vagas Totais</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Organizador */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Organizador</p>
          <p className="font-semibold">{tournament.organizerName}</p>
        </div>

        {/* Lista de times inscritos */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Times Inscritos ({teams.length}/{tournament.maxTeams})
          </h3>

          {teams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum time inscrito ainda</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => {
                const roster = teamRosters[team.id];
                const isExpanded = expandedTeams.has(team.id);
                const rosterStats = roster ? getRosterStats(roster) : null;
                const userInThisTeam = roster ? isUserInRoster(roster) : false;

                return (
                  <Card key={team.id} className={userInThisTeam ? "border-2 border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            {team.photoUrl ? (
                              <img
                                src={team.photoUrl}
                                alt={team.name}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <Shield className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {team.name}
                              {userInThisTeam && (
                                <Badge variant="default" className="gap-1">
                                  <User className="h-3 w-3" />
                                  Você está aqui
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {team.city && team.state ? `${team.city}, ${team.state}` : 'Localização não informada'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {rosterStats && (
                            <div className="text-right mr-3">
                              <p className="text-sm font-semibold">{rosterStats.total} convocados</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  {rosterStats.confirmed}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                  {rosterStats.pending}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTeamExpanded(team.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && roster && (
                      <CardContent>
                        <Separator className="mb-4" />
                        
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Lista de Convocados
                        </h4>

                        <div className="space-y-4">
                          {(Object.keys(roster) as Array<keyof Roster>).map((position) => {
                            const players = roster[position] || [];
                            
                            if (players.length === 0) return null;

                            return (
                              <div key={position}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span>{POSITION_ICONS[position]}</span>
                                  <p className="font-medium text-sm">{POSITION_LABELS[position]}</p>
                                  <Badge variant="secondary" className="text-xs">
                                    {players.length}
                                  </Badge>
                                </div>

                                <div className="space-y-2 ml-6">
                                  {players.map((player) => (
                                    <div
                                      key={player.cpf}
                                      className={`flex items-center justify-between p-2 rounded-lg ${
                                        player.id === currentUserId 
                                          ? 'bg-primary/10 border border-primary/20' 
                                          : 'bg-muted/30'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                          {player.photoUrl ? (
                                            <img
                                              src={player.photoUrl}
                                              alt={player.name}
                                              className="h-full w-full rounded-full object-cover"
                                            />
                                          ) : (
                                            <User className="h-4 w-4 text-primary" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">
                                            {player.name}
                                            {player.id === currentUserId && (
                                              <span className="ml-2 text-xs text-primary">(Você)</span>
                                            )}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            CPF: {formatCPF(player.cpf)}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {getPlayerStatusIcon(player.status)}
                                        <Badge
                                          variant={
                                            player.status === 'confirmed' ? 'default' :
                                            player.status === 'pending' ? 'secondary' :
                                            'destructive'
                                          }
                                          className="text-xs"
                                        >
                                          {player.status === 'confirmed' && 'Confirmado'}
                                          {player.status === 'pending' && 'Pendente'}
                                          {player.status === 'declined' && 'Recusou'}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {Object.values(roster).every(players => players.length === 0) && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Nenhum jogador convocado ainda</p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Botão de fechar */}
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

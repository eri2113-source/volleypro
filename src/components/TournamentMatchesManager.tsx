import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { TournamentMatchEditor } from "./TournamentMatchEditor";
import { toast } from "sonner@2.0.3";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2, 
  Plus,
  Filter,
  Search,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  Radio
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Match {
  id: string;
  date: string;
  time: string;
  phase: string;
  group?: string;
  round?: string;
  court: string;
  location: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  homeTeam: {
    id: string;
    name: string;
    logo?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo?: string;
  };
  score?: {
    home: number;
    away: number;
    sets: string[];
  };
  category?: string;
  division?: string;
}

interface TournamentMatchesManagerProps {
  tournamentId: string;
  category?: string;
  division?: string;
}

export function TournamentMatchesManager({ tournamentId, category, division }: TournamentMatchesManagerProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [tournamentId, category, division]);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        loadMatches(),
        loadTeams()
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function loadMatches() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/matches`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao carregar partidas');

      const data = await response.json();
      
      // Filtrar por categoria e divisão se fornecidas
      let filteredMatches = data.matches || [];
      if (category) {
        filteredMatches = filteredMatches.filter((m: Match) => m.category === category);
      }
      if (division) {
        filteredMatches = filteredMatches.filter((m: Match) => m.division === division);
      }

      setMatches(filteredMatches);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
      // Usar dados mock se falhar
      setMatches([]);
    }
  }

  async function loadTeams() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/teams`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao carregar times');

      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error("Erro ao carregar times:", error);
      setTeams([]);
    }
  }

  async function handleSaveMatch(match: Match) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/matches/${match.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(match)
        }
      );

      if (!response.ok) throw new Error('Erro ao salvar partida');

      // Atualizar lista local
      setMatches(matches.map(m => m.id === match.id ? match : m));
      toast.success("Partida atualizada!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  }

  async function handleDeleteMatch(matchId: string) {
    if (!confirm("Tem certeza que deseja excluir esta partida?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/matches/${matchId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao excluir partida');

      setMatches(matches.filter(m => m.id !== matchId));
      toast.success("Partida excluída!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir partida");
    }
  }

  async function handleCreateMatch() {
    const newMatch: Match = {
      id: `temp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: "14:00",
      phase: "Fase de Grupos",
      group: "",
      round: "",
      court: "Quadra 1",
      location: "Ginásio",
      status: "scheduled",
      homeTeam: {
        id: teams[0]?.id || "",
        name: teams[0]?.name || "",
        logo: teams[0]?.logo
      },
      awayTeam: {
        id: teams[1]?.id || "",
        name: teams[1]?.name || "",
        logo: teams[1]?.logo
      },
      category,
      division
    };

    setEditingMatch(newMatch);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500"><Radio className="w-3 h-3 mr-1" /> Ao Vivo</Badge>;
      case 'finished':
        return <Badge variant="secondary"><CheckCircle2 className="w-3 h-3 mr-1" /> Finalizado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>;
      default:
        return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" /> Agendado</Badge>;
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.phase.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || match.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p>Carregando partidas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Trophy className="w-4 h-4" />
        <AlertDescription>
          Edite manualmente todas as partidas do torneio. Você pode alterar times, datas, placares e status.
        </AlertDescription>
      </Alert>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Partidas</CardTitle>
              <CardDescription>
                {filteredMatches.length} partida(s) encontrada(s)
              </CardDescription>
            </div>
            <Button onClick={handleCreateMatch}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Partida
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por time ou fase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'scheduled', 'live', 'finished', 'cancelled'].map(status => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'Todos' : 
                   status === 'scheduled' ? 'Agendados' :
                   status === 'live' ? 'Ao Vivo' :
                   status === 'finished' ? 'Finalizados' : 'Cancelados'}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista de Partidas */}
          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhuma partida encontrada</p>
                <p className="text-sm">Clique em "Nova Partida" para criar</p>
              </div>
            ) : (
              filteredMatches.map(match => (
                <Card key={match.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* Cabeçalho */}
                        <div className="flex items-center gap-2 mb-3">
                          {getStatusBadge(match.status)}
                          <span className="text-sm text-muted-foreground">
                            {match.phase}
                            {match.group && ` • ${match.group}`}
                            {match.round && ` • ${match.round}`}
                          </span>
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                              {match.homeTeam.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span>{match.homeTeam.name}</span>
                          </div>

                          <div className="text-center px-4">
                            {match.score ? (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{match.score.home}</span>
                                <span className="text-muted-foreground">×</span>
                                <span className="text-2xl">{match.score.away}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">×</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 justify-end">
                            <span>{match.awayTeam.name}</span>
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                              {match.awayTeam.name.substring(0, 2).toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Informações */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(match.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {match.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {match.court}
                          </span>
                        </div>

                        {/* Sets */}
                        {match.score?.sets && match.score.sets.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {match.score.sets.map((set, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {set}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingMatch(match)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMatch(match.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editor Modal */}
      {editingMatch && (
        <TournamentMatchEditor
          match={editingMatch}
          teams={teams}
          onSave={handleSaveMatch}
          onClose={() => setEditingMatch(null)}
        />
      )}
    </div>
  );
}

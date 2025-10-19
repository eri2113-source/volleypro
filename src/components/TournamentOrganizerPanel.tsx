import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MatchResultForm, MatchResult } from "./MatchResultForm";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Play,
  Settings,
  Bell,
  Users
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TournamentOrganizerPanelProps {
  tournamentId: number;
  category: string;
  division: string;
  isOrganizer: boolean;
}

export function TournamentOrganizerPanel({ 
  tournamentId, 
  category, 
  division,
  isOrganizer 
}: TournamentOrganizerPanelProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [tournamentId, category, division]);

  async function loadMatches() {
    setLoading(true);
    try {
      // TODO: Carregar partidas do backend
      const mockMatches = [
        {
          id: 1,
          matchNumber: 1,
          homeTeamId: "team1",
          homeTeamName: "Vôlei Estrelas",
          awayTeamId: "team2",
          awayTeamName: "Atlético Saque",
          date: "2025-10-19",
          time: "14:00",
          court: "Quadra Central",
          status: "pending",
          category,
          division,
          phase: "Fase de Grupos - Grupo A"
        },
        {
          id: 2,
          matchNumber: 2,
          homeTeamId: "team3",
          homeTeamName: "Unidos da Rede",
          awayTeamId: "team4",
          awayTeamName: "Bloqueio FC",
          date: "2025-10-19",
          time: "15:30",
          court: "Quadra 2",
          status: "live",
          category,
          division,
          phase: "Fase de Grupos - Grupo A"
        },
        {
          id: 3,
          matchNumber: 3,
          homeTeamId: "team5",
          homeTeamName: "Manchete FC",
          awayTeamId: "team6",
          awayTeamName: "Cortada Campeões",
          date: "2025-10-19",
          time: "17:00",
          court: "Quadra Central",
          status: "pending",
          category,
          division,
          phase: "Fase de Grupos - Grupo B"
        }
      ];
      setMatches(mockMatches);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
      toast.error("Erro ao carregar partidas");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitResult(result: MatchResult) {
    if (!selectedMatch) return;

    setSubmitting(true);
    try {
      // Enviar resultado para o backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournament/match/result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            tournamentId,
            matchId: selectedMatch.id,
            category,
            division,
            result
          })
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar resultado");
      }

      const data = await response.json();

      toast.success("✅ Resultado registrado!", {
        description: `Classificação atualizada automaticamente. ${data.notifications || 0} participantes notificados.`
      });

      // Recarregar partidas
      await loadMatches();
      
      // Fechar formulário
      setSelectedMatch(null);

      // Notificar participantes em tempo real
      await notifyParticipants(selectedMatch, result);

    } catch (error) {
      console.error("Erro ao salvar resultado:", error);
      toast.error("Erro ao salvar resultado", {
        description: "Tente novamente ou entre em contato com o suporte"
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function notifyParticipants(match: any, result: MatchResult) {
    try {
      // Enviar notificações para jogadores dos times
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournament/notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            tournamentId,
            category,
            division,
            matchId: match.id,
            type: "match_result",
            message: `Resultado: ${match.homeTeamName} ${result.homeSets} × ${result.awaySets} ${match.awayTeamName}`
          })
        }
      );
    } catch (error) {
      console.error("Erro ao notificar participantes:", error);
    }
  }

  async function handleStartMatch(matchId: number) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournament/match/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            tournamentId,
            matchId,
            category,
            division
          })
        }
      );

      if (response.ok) {
        toast.success("🏐 Partida iniciada!");
        await loadMatches();
      }
    } catch (error) {
      console.error("Erro ao iniciar partida:", error);
      toast.error("Erro ao iniciar partida");
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case "live":
        return <Badge className="bg-red-500"><Play className="h-3 w-3 mr-1 animate-pulse" />Ao Vivo</Badge>;
      case "finished":
        return <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Finalizada</Badge>;
      default:
        return null;
    }
  }

  if (!isOrganizer) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground text-sm">
              Apenas organizadores do torneio podem acessar este painel.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedMatch) {
    return (
      <MatchResultForm
        match={selectedMatch}
        onSubmit={handleSubmitResult}
        onCancel={() => setSelectedMatch(null)}
        loading={submitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Painel do Organizador
              </CardTitle>
              <CardDescription>
                Gerencie as partidas e registre resultados em tempo real
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-500 text-white">
              <Users className="h-3 w-3 mr-1" />
              Organizador
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{matches.filter(m => m.status === "pending").length}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Play className="h-8 w-8 mx-auto text-red-500 mb-2 animate-pulse" />
              <p className="text-2xl font-bold">{matches.filter(m => m.status === "live").length}</p>
              <p className="text-sm text-muted-foreground">Ao Vivo</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">{matches.filter(m => m.status === "finished").length}</p>
              <p className="text-sm text-muted-foreground">Finalizadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Partidas */}
      <Card>
        <CardHeader>
          <CardTitle>Partidas - {category === "masculino" ? "Masculino" : category === "feminino" ? "Feminino" : "Misto"} - {division}ª Divisão</CardTitle>
          <CardDescription>
            Clique em uma partida para registrar o resultado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pendentes ({matches.filter(m => m.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="live">
                Ao Vivo ({matches.filter(m => m.status === "live").length})
              </TabsTrigger>
              <TabsTrigger value="finished">
                Finalizadas ({matches.filter(m => m.status === "finished").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3">
              {matches.filter(m => m.status === "pending").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma partida pendente</p>
                </div>
              ) : (
                matches.filter(m => m.status === "pending").map((match) => (
                  <Card key={match.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Jogo #{match.matchNumber}</Badge>
                            {getStatusBadge(match.status)}
                            <span className="text-xs text-muted-foreground">{match.phase}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{match.homeTeamName}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="font-medium">{match.awayTeamName}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(match.date).toLocaleDateString('pt-BR')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {match.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {match.court}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartMatch(match.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setSelectedMatch(match)}
                          >
                            <Trophy className="h-4 w-4 mr-1" />
                            Registrar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="live" className="space-y-3">
              {matches.filter(m => m.status === "live").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma partida ao vivo</p>
                </div>
              ) : (
                matches.filter(m => m.status === "live").map((match) => (
                  <Card key={match.id} className="border-red-500 border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Jogo #{match.matchNumber}</Badge>
                            {getStatusBadge(match.status)}
                            <span className="text-xs text-muted-foreground">{match.phase}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{match.homeTeamName}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="font-medium">{match.awayTeamName}</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {match.court}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedMatch(match)}
                        >
                          <Trophy className="h-4 w-4 mr-1" />
                          Finalizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="finished" className="space-y-3">
              {matches.filter(m => m.status === "finished").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma partida finalizada</p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Partidas finalizadas aparecerão aqui
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Alerta de Notificações */}
      <Card className="bg-blue-500/10 border-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Notificações Automáticas Ativadas</h4>
              <p className="text-sm text-muted-foreground">
                Todos os participantes da categoria <strong>{category === "masculino" ? "Masculino" : category === "feminino" ? "Feminino" : "Misto"} - {division}ª Divisão</strong> receberão alertas em tempo real quando você registrar resultados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

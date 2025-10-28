import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Radio, 
  Bell,
  BellOff,
  Eye,
  Trophy,
  Edit2
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TournamentScheduleProps {
  tournamentId: number;
  canEdit?: boolean;
}

export function TournamentSchedule({ tournamentId, canEdit = false }: TournamentScheduleProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadSchedule();
  }, [tournamentId]);

  async function loadSchedule() {
    setLoading(true);
    try {
      // TODO: Carregar dados reais do backend
      // Simulando jogos
      const mockMatches = [
        {
          id: 1,
          date: "2025-11-07",
          time: "14:00",
          phase: "Fase de Grupos",
          group: "Grupo A",
          round: "Rodada 1",
          court: "Quadra Central",
          location: "Ginásio Municipal",
          status: "live",
          homeTeam: {
            id: 1,
            name: "Vôlei Campeões",
            logo: "https://ui-avatars.com/api/?name=VC&background=0052cc&color=fff"
          },
          awayTeam: {
            id: 2,
            name: "Estrelas do Vôlei",
            logo: "https://ui-avatars.com/api/?name=EV&background=ff6b35&color=fff"
          },
          score: {
            home: 2,
            away: 1,
            sets: ["25-22", "23-25", "25-20"]
          },
          hasLiveStream: true,
          viewers: 234
        },
        {
          id: 2,
          date: "2025-11-07",
          time: "16:00",
          phase: "Fase de Grupos",
          group: "Grupo A",
          round: "Rodada 1",
          court: "Quadra 2",
          location: "Ginásio Municipal",
          status: "live",
          homeTeam: {
            id: 3,
            name: "Unidos FC",
            logo: "https://ui-avatars.com/api/?name=UFC&background=4ecdc4&color=fff"
          },
          awayTeam: {
            id: 4,
            name: "Força Jovem",
            logo: "https://ui-avatars.com/api/?name=FJ&background=f7b731&color=fff"
          },
          score: {
            home: 1,
            away: 1,
            sets: ["25-20", "20-25"]
          },
          hasLiveStream: true,
          viewers: 156
        },
        {
          id: 3,
          date: "2025-11-07",
          time: "18:00",
          phase: "Fase de Grupos",
          group: "Grupo B",
          round: "Rodada 1",
          court: "Quadra Central",
          location: "Ginásio Municipal",
          status: "scheduled",
          homeTeam: {
            id: 5,
            name: "Gigantes SC",
            logo: "https://ui-avatars.com/api/?name=GSC&background=5f27cd&color=fff"
          },
          awayTeam: {
            id: 6,
            name: "Atlético VM",
            logo: "https://ui-avatars.com/api/?name=AVM&background=ee5a6f&color=fff"
          },
          hasLiveStream: true
        },
        {
          id: 4,
          date: "2025-11-07",
          time: "20:00",
          phase: "Fase de Grupos",
          group: "Grupo B",
          round: "Rodada 1",
          court: "Quadra 2",
          location: "Ginásio Municipal",
          status: "scheduled",
          homeTeam: {
            id: 7,
            name: "Relâmpago VB",
            logo: "https://ui-avatars.com/api/?name=RVB&background=1dd1a1&color=fff"
          },
          awayTeam: {
            id: 8,
            name: "Nova Geração",
            logo: "https://ui-avatars.com/api/?name=NG&background=ff9ff3&color=000"
          },
          hasLiveStream: false
        },
        {
          id: 5,
          date: "2025-11-08",
          time: "10:00",
          phase: "Fase de Grupos",
          group: "Grupo A",
          round: "Rodada 2",
          court: "Quadra Central",
          location: "Ginásio Municipal",
          status: "scheduled",
          homeTeam: {
            id: 1,
            name: "Vôlei Campeões",
            logo: "https://ui-avatars.com/api/?name=VC&background=0052cc&color=fff"
          },
          awayTeam: {
            id: 3,
            name: "Unidos FC",
            logo: "https://ui-avatars.com/api/?name=UFC&background=4ecdc4&color=fff"
          },
          hasLiveStream: true
        },
        {
          id: 6,
          date: "2025-11-06",
          time: "14:00",
          phase: "Fase de Grupos",
          group: "Grupo A",
          round: "Rodada 0",
          court: "Quadra Central",
          location: "Ginásio Municipal",
          status: "finished",
          homeTeam: {
            id: 2,
            name: "Estrelas do Vôlei",
            logo: "https://ui-avatars.com/api/?name=EV&background=ff6b35&color=fff"
          },
          awayTeam: {
            id: 4,
            name: "Força Jovem",
            logo: "https://ui-avatars.com/api/?name=FJ&background=f7b731&color=fff"
          },
          score: {
            home: 3,
            away: 0,
            sets: ["25-20", "25-18", "25-22"]
          }
        }
      ];

      setMatches(mockMatches);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleNotification(matchId: number) {
    const newNotifications = new Set(notifications);
    if (newNotifications.has(matchId)) {
      newNotifications.delete(matchId);
      toast.info("Notificações desativadas para este jogo");
    } else {
      newNotifications.add(matchId);
      toast.success("Você receberá notificações sobre este jogo!");
    }
    setNotifications(newNotifications);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "live":
        return (
          <Badge variant="secondary" className="bg-red-500 text-white">
            <Radio className="h-3 w-3 mr-1 animate-pulse" />
            AO VIVO
          </Badge>
        );
      case "scheduled":
        return <Badge variant="outline">Agendado</Badge>;
      case "finished":
        return <Badge variant="secondary" className="bg-gray-500 text-white">Encerrado</Badge>;
      default:
        return null;
    }
  }

  const filteredMatches = matches.filter(match => {
    if (filter === "all") return true;
    return match.status === filter;
  });

  const groupedByDate = filteredMatches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando jogos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todos ({matches.length})
            </Button>
            <Button
              variant={filter === "live" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("live")}
              className={filter === "live" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Radio className="h-4 w-4 mr-2" />
              Ao Vivo ({matches.filter(m => m.status === "live").length})
            </Button>
            <Button
              variant={filter === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("scheduled")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendados ({matches.filter(m => m.status === "scheduled").length})
            </Button>
            <Button
              variant={filter === "finished" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("finished")}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Encerrados ({matches.filter(m => m.status === "finished").length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jogos agrupados por data */}
      {Object.entries(groupedByDate).map(([date, dateMatches]) => {
        const matchDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let dateLabel = matchDate.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        
        if (matchDate.getTime() === today.getTime()) {
          dateLabel = "Hoje - " + dateLabel;
        } else if (matchDate.getTime() === today.getTime() + 86400000) {
          dateLabel = "Amanhã - " + dateLabel;
        }

        return (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold capitalize">{dateLabel}</h3>
            </div>

            <div className="grid gap-4">
              {dateMatches.map((match) => (
                <Card key={match.id} className={match.status === "live" ? "border-red-500 border-2" : ""}>
                  <CardContent className="p-6">
                    {/* Cabeçalho do jogo */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(match.status)}
                        <span className="text-sm text-muted-foreground">{match.phase}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{match.group}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {match.hasLiveStream && (
                          <Badge variant="secondary" className="bg-purple-500 text-white">
                            <Radio className="h-3 w-3 mr-1" />
                            Transmissão
                          </Badge>
                        )}
                        {match.status === "live" && match.viewers && (
                          <Badge variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            {match.viewers}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Times e Placar */}
                    <div className="grid grid-cols-3 items-center gap-4 mb-4">
                      {/* Time Casa */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={match.homeTeam.logo} />
                          <AvatarFallback>{match.homeTeam.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{match.homeTeam.name}</p>
                          {match.score && (
                            <p className="text-2xl font-bold text-primary">{match.score.home}</p>
                          )}
                        </div>
                      </div>

                      {/* VS / Info Central */}
                      <div className="text-center">
                        <p className="text-sm font-medium mb-1">vs</p>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {match.time}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {match.court}
                        </div>
                      </div>

                      {/* Time Visitante */}
                      <div className="flex items-center gap-3 justify-end">
                        <div className="flex-1 text-right">
                          <p className="font-medium">{match.awayTeam.name}</p>
                          {match.score && (
                            <p className="text-2xl font-bold">{match.score.away}</p>
                          )}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={match.awayTeam.logo} />
                          <AvatarFallback>{match.awayTeam.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Detalhes dos Sets */}
                    {match.score?.sets && (
                      <div className="flex justify-center gap-2 mb-4">
                        {match.score.sets.map((set: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            Set {index + 1}: {set}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Local */}
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      {match.location}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 flex-wrap">
                      {/* Botão de Editar (apenas organizadores) */}
                      {canEdit && match.status !== "finished" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Função de edição será implementada em breve')}
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar Horário
                        </Button>
                      )}
                      
                      {match.status === "live" && match.hasLiveStream && (
                        <Button className="flex-1 bg-red-500 hover:bg-red-600">
                          <Radio className="h-4 w-4 mr-2" />
                          Assistir Ao Vivo
                        </Button>
                      )}
                      {match.status === "scheduled" && (
                        <>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleNotification(match.id)}
                          >
                            {notifications.has(match.id) ? (
                              <>
                                <BellOff className="h-4 w-4 mr-2" />
                                Notificação Ativada
                              </>
                            ) : (
                              <>
                                <Bell className="h-4 w-4 mr-2" />
                                Me Avisar
                              </>
                            )}
                          </Button>
                          {match.hasLiveStream && (
                            <Button variant="outline" className="flex-1">
                              <Radio className="h-4 w-4 mr-2" />
                              Terá Transmissão
                            </Button>
                          )}
                        </>
                      )}
                      {match.status === "finished" && (
                        <Button variant="outline" className="flex-1">
                          <Trophy className="h-4 w-4 mr-2" />
                          Ver Resumo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {filteredMatches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum jogo encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

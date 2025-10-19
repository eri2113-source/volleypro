import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Star, 
  TrendingUp, 
  Award,
  Trophy,
  ThumbsUp,
  Eye,
  Crown,
  Medal,
  Target
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TournamentMVPProps {
  tournamentId: number;
}

export function TournamentMVP({ tournamentId }: TournamentMVPProps) {
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<Set<number>>(new Set());
  const [playersByPosition, setPlayersByPosition] = useState<any>({});
  const [championshipTeam, setChampionshipTeam] = useState<any[]>([]);

  useEffect(() => {
    loadMVPData();
  }, [tournamentId]);

  async function loadMVPData() {
    setLoading(true);
    try {
      // TODO: Carregar dados reais do backend
      // Simulando dados de MVP
      const mockData = {
        setter: [
          {
            id: 1,
            name: "João Silva",
            team: "Vôlei Campeões",
            avatar: "https://ui-avatars.com/api/?name=JS&background=0052cc&color=fff",
            rating: 9.5,
            votes: 234,
            stats: {
              assists: 145,
              aces: 12,
              blocks: 8
            }
          },
          {
            id: 2,
            name: "Pedro Santos",
            team: "Estrelas do Vôlei",
            avatar: "https://ui-avatars.com/api/?name=PS&background=ff6b35&color=fff",
            rating: 9.2,
            votes: 198,
            stats: {
              assists: 132,
              aces: 15,
              blocks: 6
            }
          }
        ],
        outside: [
          {
            id: 3,
            name: "Carlos Oliveira",
            team: "Gigantes SC",
            avatar: "https://ui-avatars.com/api/?name=CO&background=5f27cd&color=fff",
            rating: 9.8,
            votes: 312,
            stats: {
              points: 187,
              aces: 34,
              blocks: 23
            }
          },
          {
            id: 4,
            name: "Rafael Lima",
            team: "Vôlei Campeões",
            avatar: "https://ui-avatars.com/api/?name=RL&background=0052cc&color=fff",
            rating: 9.6,
            votes: 287,
            stats: {
              points: 165,
              aces: 28,
              blocks: 19
            }
          },
          {
            id: 5,
            name: "Lucas Martins",
            team: "Atlético VM",
            avatar: "https://ui-avatars.com/api/?name=LM&background=ee5a6f&color=fff",
            rating: 9.3,
            votes: 245,
            stats: {
              points: 154,
              aces: 25,
              blocks: 17
            }
          }
        ],
        middle: [
          {
            id: 6,
            name: "André Costa",
            team: "Gigantes SC",
            avatar: "https://ui-avatars.com/api/?name=AC&background=5f27cd&color=fff",
            rating: 9.4,
            votes: 267,
            stats: {
              blocks: 45,
              points: 89,
              aces: 8
            }
          },
          {
            id: 7,
            name: "Felipe Rodrigues",
            team: "Vôlei Campeões",
            avatar: "https://ui-avatars.com/api/?name=FR&background=0052cc&color=fff",
            rating: 9.1,
            votes: 221,
            stats: {
              blocks: 41,
              points: 76,
              aces: 6
            }
          }
        ],
        opposite: [
          {
            id: 8,
            name: "Gabriel Ferreira",
            team: "Estrelas do Vôlei",
            avatar: "https://ui-avatars.com/api/?name=GF&background=ff6b35&color=fff",
            rating: 9.9,
            votes: 389,
            stats: {
              points: 212,
              aces: 42,
              blocks: 15
            }
          },
          {
            id: 9,
            name: "Thiago Alves",
            team: "Gigantes SC",
            avatar: "https://ui-avatars.com/api/?name=TA&background=5f27cd&color=fff",
            rating: 9.5,
            votes: 298,
            stats: {
              points: 189,
              aces: 36,
              blocks: 12
            }
          }
        ],
        libero: [
          {
            id: 10,
            name: "Marcos Pereira",
            team: "Vôlei Campeões",
            avatar: "https://ui-avatars.com/api/?name=MP&background=0052cc&color=fff",
            rating: 9.7,
            votes: 334,
            stats: {
              digs: 156,
              receptions: 234,
              perfectReceptions: 187
            }
          },
          {
            id: 11,
            name: "Ricardo Souza",
            team: "Gigantes SC",
            avatar: "https://ui-avatars.com/api/?name=RS&background=5f27cd&color=fff",
            rating: 9.4,
            votes: 276,
            stats: {
              digs: 142,
              receptions: 218,
              perfectReceptions: 169
            }
          }
        ]
      };

      setPlayersByPosition(mockData);

      // Time do Campeonato (melhores de cada posição)
      setChampionshipTeam([
        { ...mockData.setter[0], position: "Levantador" },
        { ...mockData.outside[0], position: "Ponteiro" },
        { ...mockData.outside[1], position: "Ponteiro" },
        { ...mockData.middle[0], position: "Central" },
        { ...mockData.middle[1], position: "Central" },
        { ...mockData.opposite[0], position: "Oposto" },
        { ...mockData.libero[0], position: "Líbero" }
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados de MVP:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleVote(playerId: number) {
    const newVotes = new Set(votes);
    if (newVotes.has(playerId)) {
      newVotes.delete(playerId);
      toast.info("Voto removido");
    } else {
      newVotes.add(playerId);
      toast.success("Voto computado!", {
        description: "Obrigado por participar!"
      });
    }
    setVotes(newVotes);
  }

  function getPositionLabel(position: string) {
    const labels: Record<string, string> = {
      setter: "Levantadores",
      outside: "Ponteiros",
      middle: "Centrais",
      opposite: "Opostos",
      libero: "Líberos"
    };
    return labels[position] || position;
  }

  function getPositionIcon(position: string) {
    return <Target className="h-5 w-5" />;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ranking MVP...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time do Campeonato */}
      <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Time do Campeonato 2025
          </CardTitle>
          <CardDescription>Os melhores jogadores do torneio por posição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {championshipTeam.map((player, index) => (
              <Card key={player.id} className="bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                          <Medal className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {player.position}
                      </Badge>
                      <h4 className="font-semibold truncate">{player.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{player.team}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{player.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-muted-foreground">{player.votes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rankings por Posição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Ranking MVP por Posição
          </CardTitle>
          <CardDescription>Vote nos melhores jogadores de cada posição</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setter" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {Object.keys(playersByPosition).map((position) => (
                <TabsTrigger key={position} value={position}>
                  {getPositionLabel(position)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(playersByPosition).map(([position, players]: [string, any]) => (
              <TabsContent key={position} value={position} className="space-y-4">
                {players.map((player: any, index: number) => {
                  const totalVotes = players.reduce((sum: number, p: any) => sum + p.votes, 0);
                  const votePercentage = (player.votes / totalVotes) * 100;

                  return (
                    <Card key={player.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Posição */}
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                              index === 0 ? "bg-yellow-500 text-white" :
                              index === 1 ? "bg-gray-400 text-white" :
                              index === 2 ? "bg-orange-600 text-white" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </div>
                            {index === 0 && (
                              <Crown className="h-5 w-5 text-yellow-500 mt-1" />
                            )}
                          </div>

                          {/* Info do Jogador */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-3">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={player.avatar} />
                                <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg">{player.name}</h3>
                                <p className="text-sm text-muted-foreground">{player.team}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{player.rating}</span>
                                    <span className="text-xs text-muted-foreground">avaliação</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">{player.votes}</span>
                                    <span className="text-xs text-muted-foreground">votos</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Estatísticas */}
                            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                              {Object.entries(player.stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <p className="text-2xl font-bold text-primary">{value as number}</p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {key === "assists" ? "Assistências" :
                                     key === "aces" ? "Aces" :
                                     key === "blocks" ? "Bloqueios" :
                                     key === "points" ? "Pontos" :
                                     key === "digs" ? "Defesas" :
                                     key === "receptions" ? "Recepções" :
                                     key === "perfectReceptions" ? "Recepções Perfeitas" :
                                     key}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Barra de Votos */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Votos do público</span>
                                <span className="font-medium">{votePercentage.toFixed(1)}%</span>
                              </div>
                              <Progress value={votePercentage} className="h-2" />
                            </div>
                          </div>

                          {/* Botão de Voto */}
                          <div>
                            <Button
                              variant={votes.has(player.id) ? "default" : "outline"}
                              onClick={() => handleVote(player.id)}
                              className="min-w-[100px]"
                            >
                              <ThumbsUp className={`h-4 w-4 mr-2 ${votes.has(player.id) ? "fill-current" : ""}`} />
                              {votes.has(player.id) ? "Votado" : "Votar"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Informações sobre Votação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como Funciona a Votação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Trophy className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p>Você pode votar em quantos jogadores quiser de cada posição</p>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <p>As avaliações são calculadas com base no desempenho em quadra</p>
            </div>
            <div className="flex items-start gap-2">
              <Award className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <p>Ao final do torneio, os mais votados formarão o Time do Campeonato</p>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsUp className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p>Os votos são atualizados em tempo real</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

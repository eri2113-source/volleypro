import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Users, Sun } from "lucide-react";

interface BeachTournamentStandingsProps {
  tournamentId: number;
}

export function BeachTournamentStandings({ tournamentId }: BeachTournamentStandingsProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandings();
  }, [tournamentId]);

  async function loadStandings() {
    setLoading(true);
    try {
      // TODO: Carregar dados reais do backend
      // Simulando classificação para duplas de areia
      const mockGroups = [
        {
          id: "A",
          name: "Grupo A - Areia",
          teams: [
            {
              id: 1,
              name: "Dupla Campeã",
              players: ["Ana Silva", "Maria Costa"],
              logo: "https://ui-avatars.com/api/?name=DC&background=0052cc&color=fff",
              matches: 4,
              wins: 4,
              losses: 0,
              setsWon: 8,
              setsLost: 1,
              pointsWon: 168,
              pointsLost: 134,
              points: 12,
              trend: "up"
            },
            {
              id: 2,
              name: "Estrelas da Areia",
              players: ["Fernanda Dias", "Camila Moraes"],
              logo: "https://ui-avatars.com/api/?name=EA&background=ff6b35&color=fff",
              matches: 4,
              wins: 3,
              losses: 1,
              setsWon: 6,
              setsLost: 3,
              pointsWon: 152,
              pointsLost: 141,
              points: 9,
              trend: "up"
            },
            {
              id: 3,
              name: "Unidos na Areia",
              players: ["Thiago Oliveira", "Bruno Carvalho"],
              logo: "https://ui-avatars.com/api/?name=UA&background=4ecdc4&color=fff",
              matches: 4,
              wins: 2,
              losses: 2,
              setsWon: 5,
              setsLost: 5,
              pointsWon: 147,
              pointsLost: 148,
              points: 6,
              trend: "stable"
            },
            {
              id: 4,
              name: "Sol e Mar",
              players: ["Julia Alves", "Beatriz Rocha"],
              logo: "https://ui-avatars.com/api/?name=SM&background=f7b731&color=fff",
              matches: 4,
              wins: 1,
              losses: 3,
              setsWon: 3,
              setsLost: 6,
              pointsWon: 135,
              pointsLost: 154,
              points: 3,
              trend: "down"
            },
          ]
        },
        {
          id: "B",
          name: "Grupo B - Areia",
          teams: [
            {
              id: 5,
              name: "Gigantes da Praia",
              players: ["Carlos Lima", "Rafael Souza"],
              logo: "https://ui-avatars.com/api/?name=GP&background=5f27cd&color=fff",
              matches: 4,
              wins: 4,
              losses: 0,
              setsWon: 8,
              setsLost: 0,
              pointsWon: 176,
              pointsLost: 128,
              points: 12,
              trend: "up"
            },
            {
              id: 6,
              name: "Atlético Beach",
              players: ["Amanda Gomes", "Larissa Nunes"],
              logo: "https://ui-avatars.com/api/?name=AB&background=ee5a6f&color=fff",
              matches: 4,
              wins: 2,
              losses: 2,
              setsWon: 5,
              setsLost: 5,
              pointsWon: 143,
              pointsLost: 142,
              points: 6,
              trend: "stable"
            },
            {
              id: 7,
              name: "Relâmpago Beach",
              players: ["Lucas Martins", "Gabriel Ferreira"],
              logo: "https://ui-avatars.com/api/?name=RB&background=1dd1a1&color=fff",
              matches: 4,
              wins: 2,
              losses: 2,
              setsWon: 4,
              setsLost: 5,
              pointsWon: 138,
              pointsLost: 145,
              points: 6,
              trend: "down"
            },
            {
              id: 8,
              name: "Areia na Rede",
              players: ["João Paulo", "Pedro Santos"],
              logo: "https://ui-avatars.com/api/?name=AR&background=ff9ff3&color=000",
              matches: 4,
              wins: 0,
              losses: 4,
              setsWon: 1,
              setsLost: 8,
              pointsWon: 122,
              pointsLost: 172,
              points: 0,
              trend: "down"
            },
          ]
        }
      ];

      setGroups(mockGroups);
    } catch (error) {
      console.error("Erro ao carregar classificação:", error);
    } finally {
      setLoading(false);
    }
  }

  function getTrendIcon(trend: string) {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  }

  function getPositionBadge(position: number) {
    if (position === 1) {
      return <Crown className="h-5 w-5 text-yellow-500" />;
    }
    if (position <= 2) {
      return <Badge variant="secondary" className="bg-green-500 text-white">Classificado</Badge>;
    }
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando classificação...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com tema de praia */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-6 w-6 text-amber-500" />
            Classificação - Vôlei de Praia 🏖️
          </CardTitle>
          <CardDescription>Tabela atualizada em tempo real</CardDescription>
        </CardHeader>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Crown className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="text-muted-foreground">1º Lugar</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500 text-white">Classificado</Badge>
              <span className="text-muted-foreground">Vaga para próxima fase</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Subindo</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">Caindo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por Grupo */}
      <Tabs defaultValue="A" className="space-y-4">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}>
          {groups.map((group) => (
            <TabsTrigger key={group.id} value={group.id}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{group.name}</span>
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30">
                    {group.teams.length} duplas
                  </Badge>
                </CardTitle>
                <CardDescription>Classificação atualizada em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Dupla</TableHead>
                        <TableHead className="hidden md:table-cell">Jogadores</TableHead>
                        <TableHead className="text-center">PTS</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">J</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">V</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">D</TableHead>
                        <TableHead className="text-center hidden md:table-cell">SW</TableHead>
                        <TableHead className="text-center hidden md:table-cell">SL</TableHead>
                        <TableHead className="text-center hidden lg:table-cell">PW</TableHead>
                        <TableHead className="text-center hidden lg:table-cell">PL</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Saldo</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.teams.map((team, index) => {
                        const position = index + 1;
                        const setsBalance = team.setsWon - team.setsLost;
                        const pointsBalance = team.pointsWon - team.pointsLost;

                        return (
                          <TableRow 
                            key={team.id}
                            className={position <= 2 ? "bg-amber-50 dark:bg-amber-950/20" : ""}
                          >
                            <TableCell className="font-bold">
                              <div className="flex items-center gap-2">
                                {position}
                                {getPositionBadge(position)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={team.logo} />
                                  <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{team.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{team.players.join(" • ")}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="bg-amber-500 text-white">
                                {team.points}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              {team.matches}
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell text-green-600 dark:text-green-400">
                              {team.wins}
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell text-red-600 dark:text-red-400">
                              {team.losses}
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">
                              {team.setsWon}
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">
                              {team.setsLost}
                            </TableCell>
                            <TableCell className="text-center hidden lg:table-cell">
                              {team.pointsWon}
                            </TableCell>
                            <TableCell className="text-center hidden lg:table-cell">
                              {team.pointsLost}
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <span className={setsBalance > 0 ? "text-green-600 dark:text-green-400" : setsBalance < 0 ? "text-red-600 dark:text-red-400" : ""}>
                                {setsBalance > 0 ? "+" : ""}{setsBalance}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getTrendIcon(team.trend)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Legenda Mobile */}
                <div className="mt-4 sm:hidden text-xs text-muted-foreground space-y-1">
                  <p>PTS = Pontos | J = Jogos | V = Vitórias | D = Derrotas</p>
                  <p>SW = Sets Vencidos | SL = Sets Perdidos</p>
                  <p>PW = Pontos Vencidos | PL = Pontos Perdidos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Regras de Classificação */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-amber-500" />
            Critérios de Desempate - Vôlei de Praia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Número de vitórias</li>
            <li>Saldo de sets (sets vencidos - sets perdidos)</li>
            <li>Saldo de pontos (pontos vencidos - pontos perdidos)</li>
            <li>Confronto direto entre as duplas</li>
            <li>Sorteio</li>
          </ol>
          <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>🏖️ Formato Vôlei de Praia:</strong> Cada partida é melhor de 3 sets. 
              Os 2 primeiros sets são jogados até 21 pontos (vantagem de 2). 
              O terceiro set (tiebreak) é jogado até 15 pontos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

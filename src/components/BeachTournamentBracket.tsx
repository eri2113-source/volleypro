import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Trophy, ChevronRight, Users } from "lucide-react";

interface BeachTournamentBracketProps {
  tournament: any;
}

export function BeachTournamentBracket({ tournament }: BeachTournamentBracketProps) {
  // Simulando chaveamento para duplas de areia
  const bracket = {
    quarterfinals: [
      {
        id: 1,
        team1: { 
          id: 1, 
          name: "Dupla Campeã", 
          players: ["Ana Silva", "Maria Costa"],
          logo: "https://ui-avatars.com/api/?name=DC&background=0052cc&color=fff", 
          score: 2 
        },
        team2: { 
          id: 8, 
          name: "Areia na Rede", 
          players: ["João Paulo", "Pedro Santos"],
          logo: "https://ui-avatars.com/api/?name=AR&background=ff9ff3&color=000", 
          score: 0 
        },
        winner: 1,
        status: "finished"
      },
      {
        id: 2,
        team1: { 
          id: 5, 
          name: "Gigantes da Praia", 
          players: ["Carlos Lima", "Rafael Souza"],
          logo: "https://ui-avatars.com/api/?name=GP&background=5f27cd&color=fff", 
          score: 2 
        },
        team2: { 
          id: 4, 
          name: "Sol e Mar", 
          players: ["Julia Alves", "Beatriz Rocha"],
          logo: "https://ui-avatars.com/api/?name=SM&background=f7b731&color=fff", 
          score: 1 
        },
        winner: 5,
        status: "finished"
      },
      {
        id: 3,
        team1: { 
          id: 2, 
          name: "Estrelas da Areia", 
          players: ["Fernanda Dias", "Camila Moraes"],
          logo: "https://ui-avatars.com/api/?name=EA&background=ff6b35&color=fff" 
        },
        team2: { 
          id: 7, 
          name: "Relâmpago Beach", 
          players: ["Lucas Martins", "Gabriel Ferreira"],
          logo: "https://ui-avatars.com/api/?name=RB&background=1dd1a1&color=fff" 
        },
        status: "scheduled"
      },
      {
        id: 4,
        team1: { 
          id: 3, 
          name: "Unidos na Areia", 
          players: ["Thiago Oliveira", "Bruno Carvalho"],
          logo: "https://ui-avatars.com/api/?name=UA&background=4ecdc4&color=fff" 
        },
        team2: { 
          id: 6, 
          name: "Atlético Beach", 
          players: ["Amanda Gomes", "Larissa Nunes"],
          logo: "https://ui-avatars.com/api/?name=AB&background=ee5a6f&color=fff" 
        },
        status: "scheduled"
      }
    ],
    semifinals: [
      {
        id: 5,
        team1: { 
          id: 1, 
          name: "Dupla Campeã", 
          players: ["Ana Silva", "Maria Costa"],
          logo: "https://ui-avatars.com/api/?name=DC&background=0052cc&color=fff" 
        },
        team2: { 
          id: 5, 
          name: "Gigantes da Praia", 
          players: ["Carlos Lima", "Rafael Souza"],
          logo: "https://ui-avatars.com/api/?name=GP&background=5f27cd&color=fff" 
        },
        status: "scheduled"
      },
      {
        id: 6,
        status: "pending"
      }
    ],
    final: {
      id: 7,
      status: "pending"
    }
  };

  function renderMatch(match: any, roundName: string) {
    if (match.status === "pending") {
      return (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            Aguardando definição
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={match.status === "finished" ? "bg-muted/50" : "border-primary"}>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{roundName}</span>
              <Badge variant={match.status === "finished" ? "secondary" : "default"}>
                {match.status === "finished" ? "Encerrado" : 
                 match.status === "live" ? "🏖️ Ao Vivo" : "Agendado"}
              </Badge>
            </div>

            {/* Dupla 1 */}
            <div className={`p-3 rounded-lg border ${
              match.winner === match.team1?.id ? "bg-green-50 dark:bg-green-950/20 border-green-500" : "border-muted"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={match.team1?.logo} />
                  <AvatarFallback>{match.team1?.name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm font-semibold truncate">{match.team1?.name}</span>
                {match.team1?.score !== undefined && (
                  <span className="text-xl font-bold">{match.team1.score}</span>
                )}
              </div>
              {match.team1?.players && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-10">
                  <Users className="h-3 w-3" />
                  <span>{match.team1.players.join(" • ")}</span>
                </div>
              )}
            </div>

            <div className="text-center text-xs font-medium text-muted-foreground">vs</div>

            {/* Dupla 2 */}
            <div className={`p-3 rounded-lg border ${
              match.winner === match.team2?.id ? "bg-green-50 dark:bg-green-950/20 border-green-500" : "border-muted"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={match.team2?.logo} />
                  <AvatarFallback>{match.team2?.name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm font-semibold truncate">{match.team2?.name}</span>
                {match.team2?.score !== undefined && (
                  <span className="text-xl font-bold">{match.team2.score}</span>
                )}
              </div>
              {match.team2?.players && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-10">
                  <Users className="h-3 w-3" />
                  <span>{match.team2.players.join(" • ")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Chaveamento - Vôlei de Praia 🏖️
          </CardTitle>
          <CardDescription>Acompanhe os confrontos das duplas no mata-mata</CardDescription>
        </CardHeader>
      </Card>

      {/* Chaveamento Visual */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] space-y-8">
          {/* Quartas de Final */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Quartas de Final
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 border-amber-300">
                {bracket.quarterfinals.length} confrontos
              </Badge>
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {bracket.quarterfinals.map((match) => (
                <div key={match.id}>
                  {renderMatch(match, `Jogo ${match.id}`)}
                </div>
              ))}
            </div>
          </div>

          {/* Setas */}
          <div className="flex items-center justify-center gap-4 text-amber-500">
            <ChevronRight className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
          </div>

          {/* Semifinais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Semifinais
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 border-amber-300">
                {bracket.semifinals.length} confrontos
              </Badge>
            </h3>
            <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
              {bracket.semifinals.map((match) => (
                <div key={match.id}>
                  {renderMatch(match, `Semifinal ${match.id - 4}`)}
                </div>
              ))}
            </div>
          </div>

          {/* Seta */}
          <div className="flex items-center justify-center text-amber-500">
            <ChevronRight className="h-6 w-6" />
          </div>

          {/* Final */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 justify-center">
              <Trophy className="h-6 w-6 text-yellow-500" />
              🏖️ FINAL - VÔLEI DE PRAIA
            </h3>
            <div className="max-w-md mx-auto">
              {renderMatch(bracket.final, "Grande Final")}
            </div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-950/20 border border-green-500"></div>
              <span className="text-muted-foreground">Dupla vencedora</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Encerrado</Badge>
              <span className="text-muted-foreground">Jogo finalizado</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">Agendado</Badge>
              <span className="text-muted-foreground">Próximo jogo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-dashed border-muted"></div>
              <span className="text-muted-foreground">Aguardando definição</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Competição */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Caminho para o Título 🏖️
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Formato:</strong> Melhor de 3 sets por partida</p>
            <p>• <strong>Quartas de Final:</strong> Confrontos eliminatórios entre duplas</p>
            <p>• <strong>Semifinais:</strong> As 4 melhores duplas disputam vaga na final</p>
            <p>• <strong>Final:</strong> Melhor de 3 sets + Troféu + Premiação</p>
            <p>• <strong>3º Lugar:</strong> Disputa entre perdedores das semifinais</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

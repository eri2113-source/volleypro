import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trophy, Play, CheckCircle2 } from "lucide-react";
import { Match, getRoundName } from "../lib/tournamentSystem";

interface TournamentBracketProps {
  matches: Match[];
  format: string;
  onMatchClick?: (match: Match) => void;
  canEditResults?: boolean;
}

export function TournamentBracket({ 
  matches, 
  format,
  onMatchClick,
  canEditResults = false 
}: TournamentBracketProps) {
  // Agrupar partidas por rodada
  const rounds: { [round: number]: Match[] } = {};
  matches.forEach((match) => {
    if (!rounds[match.round]) {
      rounds[match.round] = [];
    }
    rounds[match.round].push(match);
  });
  
  const totalRounds = Math.max(...Object.keys(rounds).map(Number));
  const roundNumbers = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {roundNumbers.map((roundNum) => {
        const roundMatches = rounds[roundNum];
        const roundName = getRoundName(roundNum, totalRounds, format as any);
        
        return (
          <div key={roundNum}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-lg">{roundName}</h3>
              <Badge variant="secondary">
                {roundMatches.length} {roundMatches.length === 1 ? 'partida' : 'partidas'}
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roundMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onClick={onMatchClick}
                  canEdit={canEditResults}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  onClick?: (match: Match) => void;
  canEdit: boolean;
}

function MatchCard({ match, onClick, canEdit }: MatchCardProps) {
  const isFinished = match.status === 'finished';
  const isOngoing = match.status === 'ongoing';
  const isTBD = match.homeTeamId === 'TBD' || match.awayTeamId === 'TBD';
  
  const homeWon = isFinished && match.homeSets > match.awaySets;
  const awayWon = isFinished && match.awaySets > match.homeSets;

  return (
    <Card 
      className={`
        transition-all hover:shadow-lg
        ${isOngoing ? 'border-primary border-2 animate-pulse' : ''}
        ${isFinished ? 'opacity-90' : ''}
        ${isTBD ? 'opacity-60' : ''}
        ${onClick && !isTBD ? 'cursor-pointer' : ''}
      `}
      onClick={() => !isTBD && onClick && onClick(match)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header com status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Jogo #{match.matchNumber}
          </span>
          <div className="flex items-center gap-2">
            {isOngoing && (
              <Badge variant="default" className="gap-1">
                <Play className="h-3 w-3" />
                Ao vivo
              </Badge>
            )}
            {isFinished && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Finalizado
              </Badge>
            )}
            {match.liveStreamId && (
              <Badge variant="destructive" className="gap-1">
                📹 Live
              </Badge>
            )}
          </div>
        </div>

        {/* Times e placar */}
        {isTBD ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Aguardando definição</p>
            <p className="text-xs mt-1">
              {match.homeTeamId !== 'TBD' ? match.homeTeamId : match.awayTeamId !== 'TBD' ? match.awayTeamId : 'Times a definir'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Time da casa */}
            <div 
              className={`
                flex items-center justify-between p-3 rounded-lg transition-all
                ${homeWon ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/50'}
              `}
            >
              <div className="flex items-center gap-2 flex-1">
                {homeWon && <Trophy className="h-4 w-4 text-primary" />}
                <span className={homeWon ? 'font-bold' : ''}>
                  {match.homeTeamName || match.homeTeamId}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {isFinished && (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {match.homeSets} sets
                    </span>
                    <span className={`text-2xl ${homeWon ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {match.homeScore}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Placar do meio */}
            <div className="text-center text-xs text-muted-foreground">
              {isFinished ? (
                <span>Final</span>
              ) : match.scheduledDate ? (
                <span>{new Date(match.scheduledDate).toLocaleDateString('pt-BR')}</span>
              ) : (
                <span>A definir</span>
              )}
            </div>

            {/* Time visitante */}
            <div 
              className={`
                flex items-center justify-between p-3 rounded-lg transition-all
                ${awayWon ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/50'}
              `}
            >
              <div className="flex items-center gap-2 flex-1">
                {awayWon && <Trophy className="h-4 w-4 text-primary" />}
                <span className={awayWon ? 'font-bold' : ''}>
                  {match.awayTeamName || match.awayTeamId}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {isFinished && (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {match.awaySets} sets
                    </span>
                    <span className={`text-2xl ${awayWon ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {match.awayScore}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detalhes dos sets */}
        {isFinished && match.setScores && match.setScores.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="text-muted-foreground">Sets:</span>
              {match.setScores.map((setScore, idx) => (
                <span key={idx} className="font-mono">
                  {setScore[0]}-{setScore[1]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        {canEdit && !isFinished && !isTBD && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(match);
            }}
          >
            {isOngoing ? 'Atualizar Placar' : 'Registrar Resultado'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

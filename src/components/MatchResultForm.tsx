import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Plus, Trash2, Trophy } from "lucide-react";
import { Match } from "../lib/tournamentSystem";

interface MatchResultFormProps {
  match: Match;
  onSubmit: (result: MatchResult) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  homeSets: number;
  awaySets: number;
  setScores: number[][];
  winnerId: string;
}

export function MatchResultForm({ match, onSubmit, onCancel, loading }: MatchResultFormProps) {
  const [setScores, setSetScores] = useState<number[][]>([[0, 0]]);

  const handleAddSet = () => {
    setSetScores([...setScores, [0, 0]]);
  };

  const handleRemoveSet = (index: number) => {
    const newSets = setScores.filter((_, i) => i !== index);
    setSetScores(newSets.length > 0 ? newSets : [[0, 0]]);
  };

  const handleSetScoreChange = (setIndex: number, teamIndex: 0 | 1, value: string) => {
    const numValue = parseInt(value) || 0;
    const newSets = [...setScores];
    newSets[setIndex][teamIndex] = numValue;
    setSetScores(newSets);
  };

  const calculateTotals = () => {
    let homeSetsWon = 0;
    let awaySetsWon = 0;
    let homeTotalPoints = 0;
    let awayTotalPoints = 0;

    setScores.forEach(([homePoints, awayPoints]) => {
      if (homePoints > awayPoints) homeSetsWon++;
      if (awayPoints > homePoints) awaySetsWon++;
      homeTotalPoints += homePoints;
      awayTotalPoints += awayPoints;
    });

    const winnerId = homeSetsWon > awaySetsWon ? match.homeTeamId : match.awayTeamId;

    return {
      homeSetsWon,
      awaySetsWon,
      homeTotalPoints,
      awayTotalPoints,
      winnerId,
    };
  };

  const handleSubmit = () => {
    const totals = calculateTotals();
    
    // Validações
    if (setScores.length < 3) {
      alert('Um jogo de vôlei precisa ter no mínimo 3 sets!');
      return;
    }

    if (setScores.length > 5) {
      alert('Um jogo de vôlei pode ter no máximo 5 sets!');
      return;
    }

    // Verificar se algum set está vazio ou com valores inválidos
    const hasInvalidSet = setScores.some(([home, away]) => {
      return home < 0 || away < 0 || (home === 0 && away === 0);
    });

    if (hasInvalidSet) {
      alert('Preencha todos os placares dos sets corretamente!');
      return;
    }

    // Verificar se cada set foi ganho por 2 pontos de diferença (exceto tie-break)
    const invalidSets = setScores.filter(([home, away], index) => {
      const isTieBreak = index === 4; // 5º set é tie-break
      const minPoints = isTieBreak ? 15 : 25;
      const winner = home > away ? home : away;
      const loser = home > away ? away : home;
      const diff = winner - loser;

      // Vencedor deve ter pelo menos minPoints e 2 de diferença
      if (winner < minPoints) return true;
      if (diff < 2) return true;
      return false;
    });

    if (invalidSets.length > 0) {
      alert('Placar inválido! No vôlei:\n- Sets 1-4: Mínimo 25 pontos com 2 de diferença\n- Set 5 (tie-break): Mínimo 15 pontos com 2 de diferença');
      return;
    }

    // Verificar vitória em 3 sets ou 2-1
    if (totals.homeSetsWon !== 3 && totals.awaySetsWon !== 3) {
      // Em sets de 5, alguém precisa ganhar 3
      if (setScores.length === 5) {
        alert('Em um jogo de 5 sets, um time deve ganhar 3 sets!');
        return;
      }
    }

    onSubmit({
      homeScore: totals.homeTotalPoints,
      awayScore: totals.awayTotalPoints,
      homeSets: totals.homeSetsWon,
      awaySets: totals.awaySetsWon,
      setScores,
      winnerId: totals.winnerId,
    });
  };

  const totals = calculateTotals();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Registrar Resultado - Jogo #{match.matchNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Times */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="font-bold text-lg">{match.homeTeamName || match.homeTeamId}</p>
            <Badge variant={totals.winnerId === match.homeTeamId ? 'default' : 'secondary'} className="mt-2">
              {totals.homeSetsWon} sets | {totals.homeTotalPoints} pts
            </Badge>
          </div>
          <div>
            <p className="font-bold text-lg">{match.awayTeamName || match.awayTeamId}</p>
            <Badge variant={totals.winnerId === match.awayTeamId ? 'default' : 'secondary'} className="mt-2">
              {totals.awaySetsWon} sets | {totals.awayTotalPoints} pts
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Placar por set */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Placar por Set</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSet}
              disabled={setScores.length >= 5}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Set
            </Button>
          </div>

          {setScores.map((scores, index) => (
            <div key={index} className="flex items-center gap-3">
              <Badge variant="outline" className="w-16 justify-center">
                Set {index + 1}
              </Badge>
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="number"
                  min="0"
                  value={scores[0]}
                  onChange={(e) => handleSetScoreChange(index, 0, e.target.value)}
                  className="text-center text-lg font-bold"
                  placeholder="0"
                />
                <span className="text-muted-foreground">×</span>
                <Input
                  type="number"
                  min="0"
                  value={scores[1]}
                  onChange={(e) => handleSetScoreChange(index, 1, e.target.value)}
                  className="text-center text-lg font-bold"
                  placeholder="0"
                />
              </div>
              {setScores.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSet(index)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Ajuda */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
          <p className="font-semibold">📋 Regras do Vôlei:</p>
          <ul className="text-muted-foreground space-y-0.5 ml-4">
            <li>• Sets 1-4: Primeiro a 25 pontos com 2 de diferença</li>
            <li>• Set 5 (tie-break): Primeiro a 15 pontos com 2 de diferença</li>
            <li>• Vitória em melhor de 5: Quem ganhar 3 sets primeiro</li>
          </ul>
        </div>

        <Separator />

        {/* Vencedor */}
        {totals.winnerId && (
          <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Vencedor</p>
            <p className="font-bold text-lg">
              {totals.winnerId === match.homeTeamId 
                ? match.homeTeamName || match.homeTeamId 
                : match.awayTeamName || match.awayTeamId}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {totals.homeSetsWon} × {totals.awaySetsWon} em sets
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || setScores.length < 3}
            className="flex-1"
          >
            {loading ? 'Salvando...' : 'Confirmar Resultado'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

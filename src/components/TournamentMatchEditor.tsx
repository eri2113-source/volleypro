import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { Calendar, Clock, MapPin, Edit2, Save, X, Trophy, Users } from "lucide-react";

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

interface TournamentMatchEditorProps {
  match: Match;
  teams: any[];
  onSave: (match: Match) => Promise<void>;
  onClose: () => void;
}

export function TournamentMatchEditor({ match, teams, onSave, onClose }: TournamentMatchEditorProps) {
  const [editedMatch, setEditedMatch] = useState<Match>(match);
  const [saving, setSaving] = useState(false);
  const [sets, setSets] = useState<string[]>(match.score?.sets || []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validações
      if (!editedMatch.homeTeam.id || !editedMatch.awayTeam.id) {
        toast.error("Selecione ambos os times");
        return;
      }

      if (editedMatch.homeTeam.id === editedMatch.awayTeam.id) {
        toast.error("Os times devem ser diferentes");
        return;
      }

      if (!editedMatch.date || !editedMatch.time) {
        toast.error("Preencha data e hora");
        return;
      }

      // Atualizar placar se houver sets
      if (sets.length > 0) {
        const homeWins = sets.filter(set => {
          const [home, away] = set.split('-').map(s => parseInt(s.trim()));
          return home > away;
        }).length;

        const awayWins = sets.filter(set => {
          const [home, away] = set.split('-').map(s => parseInt(s.trim()));
          return away > home;
        }).length;

        editedMatch.score = {
          home: homeWins,
          away: awayWins,
          sets
        };
      }

      await onSave(editedMatch);
      toast.success("Partida atualizada com sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar partida:", error);
      toast.error(error.message || "Erro ao salvar partida");
    } finally {
      setSaving(false);
    }
  };

  const addSet = () => {
    setSets([...sets, "25-23"]);
  };

  const updateSet = (index: number, value: string) => {
    const newSets = [...sets];
    newSets[index] = value;
    setSets(newSets);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Editar Partida
          </DialogTitle>
          <DialogDescription>
            Edite todos os detalhes da partida manualmente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeTeam">Time da Casa</Label>
              <Select
                value={editedMatch.homeTeam.id}
                onValueChange={(value) => {
                  const team = teams.find(t => t.id === value);
                  if (team) {
                    setEditedMatch({
                      ...editedMatch,
                      homeTeam: {
                        id: team.id,
                        name: team.name,
                        logo: team.logo
                      }
                    });
                  }
                }}
              >
                <SelectTrigger id="homeTeam">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="awayTeam">Time Visitante</Label>
              <Select
                value={editedMatch.awayTeam.id}
                onValueChange={(value) => {
                  const team = teams.find(t => t.id === value);
                  if (team) {
                    setEditedMatch({
                      ...editedMatch,
                      awayTeam: {
                        id: team.id,
                        name: team.name,
                        logo: team.logo
                      }
                    });
                  }
                }}
              >
                <SelectTrigger id="awayTeam">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={editedMatch.date}
                onChange={(e) => setEditedMatch({ ...editedMatch, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horário
              </Label>
              <Input
                id="time"
                type="time"
                value={editedMatch.time}
                onChange={(e) => setEditedMatch({ ...editedMatch, time: e.target.value })}
              />
            </div>
          </div>

          {/* Local */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="court" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Quadra
              </Label>
              <Input
                id="court"
                value={editedMatch.court}
                onChange={(e) => setEditedMatch({ ...editedMatch, court: e.target.value })}
                placeholder="Ex: Quadra Central"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Local</Label>
              <Input
                id="location"
                value={editedMatch.location}
                onChange={(e) => setEditedMatch({ ...editedMatch, location: e.target.value })}
                placeholder="Ex: Ginásio Municipal"
              />
            </div>
          </div>

          {/* Fase e Grupo */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phase">Fase</Label>
              <Input
                id="phase"
                value={editedMatch.phase}
                onChange={(e) => setEditedMatch({ ...editedMatch, phase: e.target.value })}
                placeholder="Ex: Fase de Grupos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Grupo (opcional)</Label>
              <Input
                id="group"
                value={editedMatch.group || ""}
                onChange={(e) => setEditedMatch({ ...editedMatch, group: e.target.value })}
                placeholder="Ex: Grupo A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="round">Rodada (opcional)</Label>
              <Input
                id="round"
                value={editedMatch.round || ""}
                onChange={(e) => setEditedMatch({ ...editedMatch, round: e.target.value })}
                placeholder="Ex: Rodada 1"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={editedMatch.status}
              onValueChange={(value: any) => setEditedMatch({ ...editedMatch, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Agendado</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="live">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">Ao Vivo</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="finished">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Finalizado</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="cancelled">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Cancelado</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Placar - Sets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Placar (Sets)
              </Label>
              <Button variant="outline" size="sm" onClick={addSet}>
                + Adicionar Set
              </Button>
            </div>

            {sets.map((set, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm w-16">Set {index + 1}:</span>
                <Input
                  value={set}
                  onChange={(e) => updateSet(index, e.target.value)}
                  placeholder="25-23"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSet(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {sets.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum set registrado. Clique em "Adicionar Set" para inserir o placar.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

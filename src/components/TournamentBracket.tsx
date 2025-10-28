import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trophy, ChevronRight, Edit2, Clock, MapPin } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TournamentBracketProps {
  tournament: any;
  tournamentId: number;
  canEdit?: boolean;
}

export function TournamentBracket({ tournament, tournamentId, canEdit = false }: TournamentBracketProps) {
  const [editingMatch, setEditingMatch] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    court: '',
    location: ''
  });
  // Simulando chaveamento
  const bracket = {
    quarterfinals: [
      {
        id: 1,
        team1: { id: 1, name: "Vôlei Campeões", logo: "https://ui-avatars.com/api/?name=VC&background=0052cc&color=fff", score: 3 },
        team2: { id: 8, name: "Nova Geração", logo: "https://ui-avatars.com/api/?name=NG&background=ff9ff3&color=000", score: 0 },
        winner: 1,
        status: "finished"
      },
      {
        id: 2,
        team1: { id: 5, name: "Gigantes SC", logo: "https://ui-avatars.com/api/?name=GSC&background=5f27cd&color=fff", score: 3 },
        team2: { id: 4, name: "Força Jovem", logo: "https://ui-avatars.com/api/?name=FJ&background=f7b731&color=fff", score: 1 },
        winner: 5,
        status: "finished"
      },
      {
        id: 3,
        team1: { id: 2, name: "Estrelas do Vôlei", logo: "https://ui-avatars.com/api/?name=EV&background=ff6b35&color=fff" },
        team2: { id: 7, name: "Relâmpago VB", logo: "https://ui-avatars.com/api/?name=RVB&background=1dd1a1&color=fff" },
        status: "scheduled"
      },
      {
        id: 4,
        team1: { id: 3, name: "Unidos FC", logo: "https://ui-avatars.com/api/?name=UFC&background=4ecdc4&color=fff" },
        team2: { id: 6, name: "Atlético VM", logo: "https://ui-avatars.com/api/?name=AVM&background=ee5a6f&color=fff" },
        status: "scheduled"
      }
    ],
    semifinals: [
      {
        id: 5,
        team1: { id: 1, name: "Vôlei Campeões", logo: "https://ui-avatars.com/api/?name=VC&background=0052cc&color=fff" },
        team2: { id: 5, name: "Gigantes SC", logo: "https://ui-avatars.com/api/?name=GSC&background=5f27cd&color=fff" },
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

  function handleEditMatch(match: any) {
    setEditingMatch(match);
    setEditForm({
      date: match.date || '',
      time: match.time || '',
      court: match.court || '',
      location: match.location || ''
    });
    setShowEditDialog(true);
  }

  async function handleSaveMatchTime() {
    try {
      const token = localStorage.getItem('volleypro_token');
      if (!token) {
        toast.error('Você precisa estar autenticado');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/matches/${editingMatch.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editForm)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update match');
      }

      toast.success('Horário atualizado!', {
        description: `${editForm.date} às ${editForm.time}`
      });

      setShowEditDialog(false);
      setEditingMatch(null);
      
      // TODO: Recarregar dados do chaveamento
    } catch (error) {
      console.error('❌ Erro ao salvar horário:', error);
      toast.error('Erro ao salvar horário');
    }
  }

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
              <div className="flex items-center gap-2">
                <Badge variant={match.status === "finished" ? "secondary" : "default"}>
                  {match.status === "finished" ? "Encerrado" : 
                   match.status === "live" ? "Ao Vivo" : "Agendado"}
                </Badge>
                {canEdit && match.status !== "finished" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleEditMatch(match)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Time 1 */}
            <div className={`flex items-center gap-2 p-2 rounded ${
              match.winner === match.team1?.id ? "bg-green-50 dark:bg-green-950/20" : ""
            }`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={match.team1?.logo} />
                <AvatarFallback>{match.team1?.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 text-sm font-medium truncate">{match.team1?.name}</span>
              {match.team1?.score !== undefined && (
                <span className="text-lg font-bold">{match.team1.score}</span>
              )}
            </div>

            <div className="text-center text-xs text-muted-foreground">vs</div>

            {/* Time 2 */}
            <div className={`flex items-center gap-2 p-2 rounded ${
              match.winner === match.team2?.id ? "bg-green-50 dark:bg-green-950/20" : ""
            }`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={match.team2?.logo} />
                <AvatarFallback>{match.team2?.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 text-sm font-medium truncate">{match.team2?.name}</span>
              {match.team2?.score !== undefined && (
                <span className="text-lg font-bold">{match.team2.score}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Chaveamento - Fase Eliminatória
          </CardTitle>
          <CardDescription>Acompanhe os confrontos do mata-mata</CardDescription>
        </CardHeader>
      </Card>

      {/* Chaveamento Visual */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] space-y-8">
          {/* Quartas de Final */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Quartas de Final
              <Badge variant="outline">{bracket.quarterfinals.length} jogos</Badge>
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
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <ChevronRight className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
            <ChevronRight className="h-6 w-6" />
          </div>

          {/* Semifinais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Semifinais
              <Badge variant="outline">{bracket.semifinals.length} jogos</Badge>
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
          <div className="flex items-center justify-center text-muted-foreground">
            <ChevronRight className="h-6 w-6" />
          </div>

          {/* Final */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 justify-center">
              <Trophy className="h-6 w-6 text-yellow-500" />
              FINAL
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
              <span className="text-muted-foreground">Vencedor</span>
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

      {/* Caminho até a Final */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Caminho para o Título
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Fase de Grupos → Top 2 de cada grupo classificados</p>
            <p>• Quartas de Final → Confrontos entre grupos (A vs D, B vs C)</p>
            <p>• Semifinais → Melhores de 5 sets</p>
            <p>• Final → Melhor de 5 sets + Troféu + Premiação</p>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição de Horário */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Horário do Jogo</DialogTitle>
            <DialogDescription>
              {editingMatch?.team1?.name} vs {editingMatch?.team2?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  <Clock className="h-4 w-4 inline mr-1" />
                  Data
                </Label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quadra</Label>
              <Input
                placeholder="Ex: Quadra Central"
                value={editForm.court}
                onChange={(e) => setEditForm({ ...editForm, court: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>
                <MapPin className="h-4 w-4 inline mr-1" />
                Local
              </Label>
              <Input
                placeholder="Ex: Ginásio Municipal"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>

            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Resumo:</p>
              <p>{editForm.date || 'Sem data'} às {editForm.time || 'Sem horário'}</p>
              <p>{editForm.court || 'Quadra não definida'} - {editForm.location || 'Local não definido'}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMatchTime}>
              Salvar Horário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

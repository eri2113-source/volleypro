import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Edit2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TournamentStandingsProps {
  tournamentId: number;
  canEdit?: boolean;
}

export function TournamentStandings({ tournamentId, canEdit = false }: TournamentStandingsProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    wins: 0,
    losses: 0,
    setsWon: 0,
    setsLost: 0,
    pointsWon: 0,
    pointsLost: 0
  });

  useEffect(() => {
    loadStandings();
  }, [tournamentId]);

  async function loadStandings() {
    setLoading(true);
    try {
      // TODO: Carregar dados reais do backend
      // Simulando classificação
      const mockGroups = [
        {
          id: "A",
          name: "Grupo A",
          teams: [
            {
              id: 1,
              name: "Vôlei Campeões",
              logo: "https://ui-avatars.com/api/?name=VC&background=0052cc&color=fff",
              matches: 4,
              wins: 4,
              losses: 0,
              setsWon: 12,
              setsLost: 2,
              pointsWon: 320,
              pointsLost: 245,
              points: 12,
              trend: "up"
            },
            {
              id: 2,
              name: "Estrelas do Vôlei",
              logo: "https://ui-avatars.com/api/?name=EV&background=ff6b35&color=fff",
              matches: 4,
              wins: 3,
              losses: 1,
              setsWon: 10,
              setsLost: 5,
              pointsWon: 298,
              pointsLost: 267,
              points: 9,
              trend: "up"
            },
            {
              id: 3,
              name: "Unidos FC",
              logo: "https://ui-avatars.com/api/?name=UFC&background=4ecdc4&color=fff",
              matches: 4,
              wins: 2,
              losses: 2,
              setsWon: 8,
              setsLost: 8,
              pointsWon: 285,
              pointsLost: 283,
              points: 6,
              trend: "stable"
            },
            {
              id: 4,
              name: "Força Jovem",
              logo: "https://ui-avatars.com/api/?name=FJ&background=f7b731&color=fff",
              matches: 4,
              wins: 1,
              losses: 3,
              setsWon: 4,
              setsLost: 10,
              pointsWon: 252,
              pointsLost: 292,
              points: 3,
              trend: "down"
            },
          ]
        },
        {
          id: "B",
          name: "Grupo B",
          teams: [
            {
              id: 5,
              name: "Gigantes SC",
              logo: "https://ui-avatars.com/api/?name=GSC&background=5f27cd&color=fff",
              matches: 4,
              wins: 4,
              losses: 0,
              setsWon: 12,
              setsLost: 1,
              pointsWon: 335,
              pointsLost: 220,
              points: 12,
              trend: "up"
            },
            {
              id: 6,
              name: "Atlético VM",
              logo: "https://ui-avatars.com/api/?name=AVM&background=ee5a6f&color=fff",
              matches: 4,
              wins: 2,
              losses: 2,
              setsWon: 7,
              setsLost: 7,
              pointsWon: 278,
              pointsLost: 275,
              points: 6,
              trend: "stable"
            },
            {
              id: 7,
              name: "Relâmpago VB",
              logo: "https://ui-avatars.com/api/?name=RVB&background=1dd1a1&color=fff",
              matches: 4,
              wins: 2,
              losses: 2,
              setsWon: 6,
              setsLost: 8,
              pointsWon: 265,
              pointsLost: 282,
              points: 6,
              trend: "down"
            },
            {
              id: 8,
              name: "Nova Geração",
              logo: "https://ui-avatars.com/api/?name=NG&background=ff9ff3&color=000",
              matches: 4,
              wins: 0,
              losses: 4,
              setsWon: 2,
              setsLost: 12,
              pointsWon: 228,
              pointsLost: 329,
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

  function handleEditTeam(team: any) {
    setEditingTeam(team);
    setEditForm({
      wins: team.wins,
      losses: team.losses,
      setsWon: team.setsWon,
      setsLost: team.setsLost,
      pointsWon: team.pointsWon,
      pointsLost: team.pointsLost
    });
    setShowEditDialog(true);
  }

  async function handleSaveEdit() {
    try {
      // TODO: Salvar no backend
      toast.success("Estatísticas atualizadas!", {
        description: `${editingTeam.name} - Dados salvos com sucesso`
      });
      
      // Atualizar localmente
      const updatedGroups = groups.map(group => ({
        ...group,
        teams: group.teams.map((t: any) => 
          t.id === editingTeam.id 
            ? {
                ...t,
                ...editForm,
                matches: editForm.wins + editForm.losses,
                points: (editForm.wins * 3) // 3 pontos por vitória
              }
            : t
        )
      }));
      
      setGroups(updatedGroups);
      setShowEditDialog(false);
      setEditingTeam(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar estatísticas');
    }
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
      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
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
                  <Badge variant="outline">{group.teams.length} times</Badge>
                </CardTitle>
                <CardDescription>Classificação atualizada em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Time</TableHead>
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
                        {canEdit && <TableHead className="text-center">Editar</TableHead>}
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
                            className={position <= 2 ? "bg-green-50 dark:bg-green-950/20" : ""}
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
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="bg-primary text-white">
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
                            {canEdit && (
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditTeam(team)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5" />
            Critérios de Desempate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Número de vitórias</li>
            <li>Saldo de sets (sets vencidos - sets perdidos)</li>
            <li>Saldo de pontos (pontos vencidos - pontos perdidos)</li>
            <li>Confronto direto</li>
            <li>Sorteio</li>
          </ol>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md" aria-describedby="edit-team-stats-description">
          <DialogHeader>
            <DialogTitle>Editar Estatísticas</DialogTitle>
            <DialogDescription id="edit-team-stats-description">
              {editingTeam?.name} - Atualize os dados do time
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vitórias</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.wins}
                  onChange={(e) => setEditForm({ ...editForm, wins: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Derrotas</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.losses}
                  onChange={(e) => setEditForm({ ...editForm, losses: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sets Vencidos</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.setsWon}
                  onChange={(e) => setEditForm({ ...editForm, setsWon: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sets Perdidos</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.setsLost}
                  onChange={(e) => setEditForm({ ...editForm, setsLost: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pontos Vencidos</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.pointsWon}
                  onChange={(e) => setEditForm({ ...editForm, pointsWon: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pontos Perdidos</Label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.pointsLost}
                  onChange={(e) => setEditForm({ ...editForm, pointsLost: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Resumo:</p>
              <p>Jogos: {editForm.wins + editForm.losses}</p>
              <p>Pontos: {editForm.wins * 3}</p>
              <p>Saldo Sets: {editForm.setsWon - editForm.setsLost}</p>
              <p>Saldo Pontos: {editForm.pointsWon - editForm.pointsLost}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

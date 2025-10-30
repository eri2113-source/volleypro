import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Trophy, 
  Edit2,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId } from "../utils/supabase/info";

interface TeamStanding {
  id: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  setsWon: number;
  setsLost: number;
  pointsFor: number;
  pointsAgainst: number;
  points: number;
}

interface TournamentStandingsEditorProps {
  tournamentId: string;
  category: string;
  division: string;
  isOrganizer: boolean;
  onUpdate?: () => void;
}

export function TournamentStandingsEditor({ 
  tournamentId, 
  category, 
  division,
  isOrganizer,
  onUpdate 
}: TournamentStandingsEditorProps) {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadStandings();
  }, [tournamentId, category, division]);

  async function loadStandings() {
    setLoading(true);
    try {
      // TODO: Carregar classificação real do backend
      // Por enquanto, usar dados de exemplo
      const mockStandings: TeamStanding[] = [
        {
          id: "1",
          teamName: "Vôlei Estrelas",
          played: 5,
          won: 4,
          lost: 1,
          setsWon: 13,
          setsLost: 5,
          pointsFor: 425,
          pointsAgainst: 380,
          points: 12
        },
        {
          id: "2",
          teamName: "Atlético Saque",
          played: 5,
          won: 3,
          lost: 2,
          setsWon: 11,
          setsLost: 8,
          pointsFor: 410,
          pointsAgainst: 395,
          points: 9
        },
        {
          id: "3",
          teamName: "Unidos da Rede",
          played: 5,
          won: 2,
          lost: 3,
          setsWon: 9,
          setsLost: 10,
          pointsFor: 385,
          pointsAgainst: 405,
          points: 6
        },
        {
          id: "4",
          teamName: "Bloqueio FC",
          played: 5,
          won: 1,
          lost: 4,
          setsWon: 4,
          setsLost: 14,
          pointsFor: 350,
          pointsAgainst: 390,
          points: 3
        }
      ];

      setStandings(mockStandings);
    } catch (error) {
      console.error("Erro ao carregar classificação:", error);
      toast.error("Erro ao carregar classificação");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveStandings() {
    setSaving(true);
    try {
      const token = localStorage.getItem('volleypro_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/standings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            standings,
            category,
            division
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar classificação");
      }

      toast.success("✅ Classificação salva!", {
        description: "Todos os organizadores veem as atualizações em tempo real"
      });

      setEditing(false);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error("Erro ao salvar classificação:", error);
      toast.error(error.message || "Erro ao salvar classificação");
    } finally {
      setSaving(false);
    }
  }

  function handleUpdateTeam(teamId: string, field: keyof TeamStanding, value: any) {
    setStandings(prev => 
      prev.map(team => 
        team.id === teamId 
          ? { ...team, [field]: value }
          : team
      )
    );
  }

  function handleAddTeam() {
    const newTeam: TeamStanding = {
      id: crypto.randomUUID(),
      teamName: "Novo Time",
      played: 0,
      won: 0,
      lost: 0,
      setsWon: 0,
      setsLost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      points: 0
    };

    setStandings(prev => [...prev, newTeam]);
  }

  function handleRemoveTeam(teamId: string) {
    setStandings(prev => prev.filter(team => team.id !== teamId));
  }

  function calculateSetsDifference(team: TeamStanding) {
    return team.setsWon - team.setsLost;
  }

  function calculatePointsDifference(team: TeamStanding) {
    return team.pointsFor - team.pointsAgainst;
  }

  if (!isOrganizer) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground text-sm">
              Apenas organizadores podem editar a classificação
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Tabela de Classificação
            </CardTitle>
            <CardDescription>
              {category === "masculino" ? "Masculino" : category === "feminino" ? "Feminino" : "Misto"} - {division}ª Divisão
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(false);
                    loadStandings();
                  }}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveStandings}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadStandings}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : (
          <>
            {/* Desktop View - Tabela Completa */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm font-medium">#</th>
                    <th className="text-left p-2 text-sm font-medium">Time</th>
                    <th className="text-center p-2 text-sm font-medium">J</th>
                    <th className="text-center p-2 text-sm font-medium">V</th>
                    <th className="text-center p-2 text-sm font-medium">D</th>
                    <th className="text-center p-2 text-sm font-medium">Sets</th>
                    <th className="text-center p-2 text-sm font-medium">Pontos</th>
                    <th className="text-center p-2 text-sm font-medium">Pts</th>
                    {editing && <th className="text-center p-2 text-sm font-medium">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.id} className="border-b hover:bg-accent/50">
                      <td className="p-2">
                        <Badge variant={index < 4 ? "default" : "outline"}>
                          {index + 1}°
                        </Badge>
                      </td>
                      <td className="p-2">
                        {editing ? (
                          <Input
                            value={team.teamName}
                            onChange={(e) => handleUpdateTeam(team.id, 'teamName', e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{team.teamName}</span>
                        )}
                      </td>
                      <td className="text-center p-2">
                        {editing ? (
                          <Input
                            type="number"
                            value={team.played}
                            onChange={(e) => handleUpdateTeam(team.id, 'played', parseInt(e.target.value) || 0)}
                            className="h-8 w-16 text-center"
                          />
                        ) : (
                          team.played
                        )}
                      </td>
                      <td className="text-center p-2 text-green-600">
                        {editing ? (
                          <Input
                            type="number"
                            value={team.won}
                            onChange={(e) => handleUpdateTeam(team.id, 'won', parseInt(e.target.value) || 0)}
                            className="h-8 w-16 text-center"
                          />
                        ) : (
                          team.won
                        )}
                      </td>
                      <td className="text-center p-2 text-red-600">
                        {editing ? (
                          <Input
                            type="number"
                            value={team.lost}
                            onChange={(e) => handleUpdateTeam(team.id, 'lost', parseInt(e.target.value) || 0)}
                            className="h-8 w-16 text-center"
                          />
                        ) : (
                          team.lost
                        )}
                      </td>
                      <td className="text-center p-2">
                        {editing ? (
                          <div className="flex gap-1 items-center justify-center">
                            <Input
                              type="number"
                              value={team.setsWon}
                              onChange={(e) => handleUpdateTeam(team.id, 'setsWon', parseInt(e.target.value) || 0)}
                              className="h-8 w-14 text-center"
                            />
                            <span>/</span>
                            <Input
                              type="number"
                              value={team.setsLost}
                              onChange={(e) => handleUpdateTeam(team.id, 'setsLost', parseInt(e.target.value) || 0)}
                              className="h-8 w-14 text-center"
                            />
                          </div>
                        ) : (
                          <span>
                            {team.setsWon}/{team.setsLost}
                            <span className={`ml-1 text-xs ${calculateSetsDifference(team) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({calculateSetsDifference(team) >= 0 ? '+' : ''}{calculateSetsDifference(team)})
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="text-center p-2">
                        {editing ? (
                          <div className="flex gap-1 items-center justify-center">
                            <Input
                              type="number"
                              value={team.pointsFor}
                              onChange={(e) => handleUpdateTeam(team.id, 'pointsFor', parseInt(e.target.value) || 0)}
                              className="h-8 w-16 text-center"
                            />
                            <span>/</span>
                            <Input
                              type="number"
                              value={team.pointsAgainst}
                              onChange={(e) => handleUpdateTeam(team.id, 'pointsAgainst', parseInt(e.target.value) || 0)}
                              className="h-8 w-16 text-center"
                            />
                          </div>
                        ) : (
                          <span className="text-xs">
                            {team.pointsFor}/{team.pointsAgainst}
                          </span>
                        )}
                      </td>
                      <td className="text-center p-2">
                        {editing ? (
                          <Input
                            type="number"
                            value={team.points}
                            onChange={(e) => handleUpdateTeam(team.id, 'points', parseInt(e.target.value) || 0)}
                            className="h-8 w-16 text-center font-bold"
                          />
                        ) : (
                          <span className="font-bold">{team.points}</span>
                        )}
                      </td>
                      {editing && (
                        <td className="text-center p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTeam(team.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-3">
              {standings.map((team, index) => (
                <Card key={team.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={index < 4 ? "default" : "outline"}>
                          {index + 1}°
                        </Badge>
                        {editing ? (
                          <Input
                            value={team.teamName}
                            onChange={(e) => handleUpdateTeam(team.id, 'teamName', e.target.value)}
                            className="h-8 flex-1"
                          />
                        ) : (
                          <span className="font-medium">{team.teamName}</span>
                        )}
                      </div>
                      {editing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeam(team.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Jogos:</span>
                        {editing ? (
                          <Input
                            type="number"
                            value={team.played}
                            onChange={(e) => handleUpdateTeam(team.id, 'played', parseInt(e.target.value) || 0)}
                            className="h-6 w-12 text-center"
                          />
                        ) : (
                          <span>{team.played}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Pontos:</span>
                        {editing ? (
                          <Input
                            type="number"
                            value={team.points}
                            onChange={(e) => handleUpdateTeam(team.id, 'points', parseInt(e.target.value) || 0)}
                            className="h-6 w-12 text-center font-bold"
                          />
                        ) : (
                          <span className="font-bold">{team.points}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600">Vitórias:</span>
                        {editing ? (
                          <Input
                            type="number"
                            value={team.won}
                            onChange={(e) => handleUpdateTeam(team.id, 'won', parseInt(e.target.value) || 0)}
                            className="h-6 w-12 text-center"
                          />
                        ) : (
                          <span className="text-green-600">{team.won}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600">Derrotas:</span>
                        {editing ? (
                          <Input
                            type="number"
                            value={team.lost}
                            onChange={(e) => handleUpdateTeam(team.id, 'lost', parseInt(e.target.value) || 0)}
                            className="h-6 w-12 text-center"
                          />
                        ) : (
                          <span className="text-red-600">{team.lost}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {editing && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTeam}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Time
                </Button>
              </div>
            )}

            {/* Legenda */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium mb-2">Legenda:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><strong>J</strong> = Jogos</div>
                <div><strong>V</strong> = Vitórias</div>
                <div><strong>D</strong> = Derrotas</div>
                <div><strong>Pts</strong> = Pontos</div>
              </div>
              
              {isOrganizer && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      <strong>Edição Colaborativa:</strong> Todos os organizadores podem editar esta tabela em tempo real. 
                      Clique em "Editar" para modificar, depois "Salvar" para aplicar as mudanças.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

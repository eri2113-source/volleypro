import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { 
  Trophy, 
  Edit2, 
  Save,
  Users,
  ArrowRight,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface BracketNode {
  id: string;
  round: string;
  position: number;
  team1?: {
    id: string;
    name: string;
  };
  team2?: {
    id: string;
    name: string;
  };
  winner?: string;
  nextMatchId?: string;
}

interface TournamentBracketEditorProps {
  tournamentId: string;
  category?: string;
  division?: string;
}

export function TournamentBracketEditor({ tournamentId, category, division }: TournamentBracketEditorProps) {
  const [bracket, setBracket] = useState<BracketNode[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadData();
  }, [tournamentId, category, division]);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        loadBracket(),
        loadTeams()
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar chaveamento");
    } finally {
      setLoading(false);
    }
  }

  async function loadBracket() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/bracket?category=${category}&division=${division}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao carregar chaveamento');

      const data = await response.json();
      setBracket(data.bracket || []);
    } catch (error) {
      console.error("Erro ao carregar chaveamento:", error);
      // Criar bracket vazio
      setBracket([]);
    }
  }

  async function loadTeams() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/teams`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao carregar times');

      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error("Erro ao carregar times:", error);
      setTeams([]);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/bracket`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            category,
            division,
            bracket
          })
        }
      );

      if (!response.ok) throw new Error('Erro ao salvar chaveamento');

      toast.success("Chaveamento salvo com sucesso!");
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar chaveamento");
    } finally {
      setSaving(false);
    }
  }

  function updateNode(nodeId: string, field: 'team1' | 'team2', teamId: string) {
    setBracket(bracket.map(node => {
      if (node.id === nodeId) {
        const team = teams.find(t => t.id === teamId);
        return {
          ...node,
          [field]: team ? { id: team.id, name: team.name } : undefined
        };
      }
      return node;
    }));
  }

  function generateBracket(numTeams: number) {
    if (!confirm(`Isso irá gerar um novo chaveamento para ${numTeams} times. Continuar?`)) return;

    // Calcular número de rodadas (potência de 2)
    const rounds = Math.ceil(Math.log2(numTeams));
    const totalSlots = Math.pow(2, rounds);
    
    const newBracket: BracketNode[] = [];
    let nodeId = 1;

    // Primeira rodada
    const firstRoundMatches = totalSlots / 2;
    for (let i = 0; i < firstRoundMatches; i++) {
      newBracket.push({
        id: `match-${nodeId}`,
        round: 'Oitavas',
        position: i,
        nextMatchId: `match-${Math.floor(nodeId / 2) + firstRoundMatches}`
      });
      nodeId++;
    }

    // Rodadas seguintes
    let currentRoundMatches = firstRoundMatches / 2;
    let roundNames = ['Quartas', 'Semifinal', 'Final'];
    let roundIndex = 0;

    while (currentRoundMatches >= 1) {
      for (let i = 0; i < currentRoundMatches; i++) {
        newBracket.push({
          id: `match-${nodeId}`,
          round: roundNames[roundIndex] || `Rodada ${roundIndex + 2}`,
          position: i,
          nextMatchId: currentRoundMatches === 1 ? undefined : `match-${Math.floor(nodeId / 2) + currentRoundMatches}`
        });
        nodeId++;
      }
      currentRoundMatches = Math.floor(currentRoundMatches / 2);
      roundIndex++;
    }

    setBracket(newBracket);
    setEditMode(true);
    toast.success(`Chaveamento gerado para ${numTeams} times!`);
  }

  function groupByRound() {
    const grouped: { [key: string]: BracketNode[] } = {};
    bracket.forEach(node => {
      if (!grouped[node.round]) {
        grouped[node.round] = [];
      }
      grouped[node.round].push(node);
    });
    return grouped;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p>Carregando chaveamento...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const groupedBracket = groupByRound();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          Edite manualmente o chaveamento do torneio. Você pode alterar os confrontos e reorganizar as chaves.
        </AlertDescription>
      </Alert>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Editor de Chaveamento</CardTitle>
              <CardDescription>
                Configure manualmente os cruzamentos entre times
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button onClick={() => {
                    const num = prompt("Quantos times participarão? (deve ser potência de 2: 4, 8, 16, 32)");
                    if (num) generateBracket(parseInt(num));
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Gerar Chaveamento
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => {
                    setEditMode(false);
                    loadBracket();
                  }}>
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
                        Salvar
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bracket.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="mb-2">Nenhum chaveamento definido</p>
              <p className="text-sm mb-4">Clique em "Gerar Chaveamento" para começar</p>
              <Button onClick={() => {
                const num = prompt("Quantos times participarão? (deve ser potência de 2: 4, 8, 16, 32)");
                if (num) generateBracket(parseInt(num));
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Gerar Chaveamento
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedBracket).map(([round, nodes]) => (
                <div key={round}>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{round}</h3>
                    <Badge variant="outline">{nodes.length} confronto(s)</Badge>
                  </div>

                  <div className="grid gap-4">
                    {nodes.map(node => (
                      <Card key={node.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-2">
                                Confronto #{node.position + 1}
                              </div>
                              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                {/* Time 1 */}
                                <div>
                                  {editMode ? (
                                    <Select
                                      value={node.team1?.id || ""}
                                      onValueChange={(value) => updateNode(node.id, 'team1', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecionar time..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Vencedor jogo anterior</SelectItem>
                                        {teams.map(team => (
                                          <SelectItem key={team.id} value={team.id}>
                                            {team.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                                        {node.team1 ? node.team1.name.substring(0, 2).toUpperCase() : '?'}
                                      </div>
                                      <span>{node.team1?.name || 'A definir'}</span>
                                      {node.winner === node.team1?.id && (
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="text-center">
                                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                </div>

                                {/* Time 2 */}
                                <div>
                                  {editMode ? (
                                    <Select
                                      value={node.team2?.id || ""}
                                      onValueChange={(value) => updateNode(node.id, 'team2', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecionar time..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="">Vencedor jogo anterior</SelectItem>
                                        {teams.map(team => (
                                          <SelectItem key={team.id} value={team.id}>
                                            {team.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                                        {node.team2 ? node.team2.name.substring(0, 2).toUpperCase() : '?'}
                                      </div>
                                      <span>{node.team2?.name || 'A definir'}</span>
                                      {node.winner === node.team2?.id && (
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {node.nextMatchId && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  Vencedor avança para: {node.nextMatchId}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

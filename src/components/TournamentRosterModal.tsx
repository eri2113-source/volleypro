import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { 
  Users, 
  UserPlus, 
  Check, 
  Clock, 
  X, 
  Trophy, 
  Search,
  Edit2,
  UserX,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { tournamentApi } from "../lib/api";

interface TournamentRosterModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  teamId: string;
  teamName: string;
  squadId?: string; // ID da equipe/categoria específica
  squadName?: string; // Nome da equipe/categoria
  modalityType?: 'indoor' | 'beach'; // Nova prop
  teamSize?: 'duo' | 'trio' | 'quartet' | 'quintet'; // Para vôlei de praia
}

interface Player {
  id: string;
  name: string;
  cpf: string;
  photoUrl?: string;
  position: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface RosterLimits {
  levantador: number;
  ponteiro: number;
  oposto: number;
  central: number;
  libero: number;
  tecnico: number;
  auxiliar: number;
}

// VÔLEI DE QUADRA (Indoor) - 12 jogadores
const POSITION_LIMITS_INDOOR: RosterLimits = {
  levantador: 4,
  ponteiro: 6,
  oposto: 3,
  central: 4,
  libero: 2,
  tecnico: 1,
  auxiliar: 4,
};

// VÔLEI DE PRAIA (Beach) - Simplificado
const POSITION_LIMITS_BEACH_DUO: RosterLimits = {
  levantador: 0,
  ponteiro: 2, // Dupla = 2 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

const POSITION_LIMITS_BEACH_TRIO: RosterLimits = {
  levantador: 0,
  ponteiro: 3, // Trio = 3 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

const POSITION_LIMITS_BEACH_QUARTET: RosterLimits = {
  levantador: 0,
  ponteiro: 4, // Quarteto = 4 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

const POSITION_LIMITS_BEACH_QUINTET: RosterLimits = {
  levantador: 0,
  ponteiro: 5, // Quinteto = 5 jogadores
  oposto: 0,
  central: 0,
  libero: 0,
  tecnico: 1,
  auxiliar: 0,
};

const POSITION_LABELS: Record<keyof RosterLimits, string> = {
  levantador: 'Levantador',
  ponteiro: 'Ponteiro',
  oposto: 'Oposto',
  central: 'Central',
  libero: 'Líbero',
  tecnico: 'Técnico',
  auxiliar: 'Auxiliar Técnico',
};

const POSITION_ICONS: Record<keyof RosterLimits, string> = {
  levantador: '🏐',
  ponteiro: '⚡',
  oposto: '💪',
  central: '🛡️',
  libero: '🦸',
  tecnico: '👨‍🏫',
  auxiliar: '👨‍💼',
};

export function TournamentRosterModal({
  open,
  onClose,
  tournamentId,
  tournamentName,
  teamId,
  teamName,
  squadId = '',
  squadName = '',
  modalityType = 'indoor',
  teamSize = 'duo',
}: TournamentRosterModalProps) {
  // Determinar limites baseado na modalidade
  const POSITION_LIMITS: RosterLimits = 
    modalityType === 'beach' 
      ? teamSize === 'duo' ? POSITION_LIMITS_BEACH_DUO
        : teamSize === 'trio' ? POSITION_LIMITS_BEACH_TRIO
        : teamSize === 'quartet' ? POSITION_LIMITS_BEACH_QUARTET
        : POSITION_LIMITS_BEACH_QUINTET
      : POSITION_LIMITS_INDOOR;

  const isBeach = modalityType === 'beach';
  const minPlayers = isBeach 
    ? (teamSize === 'duo' ? 2 : teamSize === 'trio' ? 3 : teamSize === 'quartet' ? 4 : 5)
    : 6;

  const [roster, setRoster] = useState<Record<keyof RosterLimits, Player[]>>({
    levantador: [],
    ponteiro: [],
    oposto: [],
    central: [],
    libero: [],
    tecnico: [],
    auxiliar: [],
  });

  const [searchCPF, setSearchCPF] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<keyof RosterLimits | null>(null);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [existingRoster, setExistingRoster] = useState(false);

  useEffect(() => {
    if (open) {
      loadRoster();
    }
  }, [open, tournamentId, teamId]);

  async function loadRoster() {
    try {
      const { roster: existingRoster } = await tournamentApi.getRoster(tournamentId, teamId, squadId);
      
      if (existingRoster && Object.keys(existingRoster).length > 0) {
        setRoster(existingRoster);
        setExistingRoster(true);
        setEditMode(false);
      }
    } catch (error: any) {
      // Se não houver convocação ainda, continua com roster vazio
      console.log("Nenhuma convocação existente");
    }
  }

  async function searchPlayerByCPF(cpf: string, position: keyof RosterLimits) {
    if (!cpf || cpf.length < 11) {
      toast.error("CPF inválido", {
        description: "Digite um CPF válido com 11 dígitos"
      });
      return;
    }

    // Limpar formatação do CPF
    const cleanCPF = cpf.replace(/\D/g, '');

    setSearching(true);
    try {
      const { player } = await tournamentApi.searchPlayerByCPF(cleanCPF, teamId);
      
      if (!player) {
        toast.error("Jogador não encontrado", {
          description: "Nenhum atleta com este CPF está cadastrado no seu time"
        });
        return;
      }

      // Verificar se já foi adicionado em alguma posição
      const alreadyAdded = Object.values(roster).some(players => 
        players.some(p => p.cpf === cleanCPF)
      );

      if (alreadyAdded) {
        toast.error("Jogador já convocado", {
          description: "Este atleta já foi adicionado à convocação"
        });
        return;
      }

      // Verificar limite da posição
      if (roster[position].length >= POSITION_LIMITS[position]) {
        toast.error("Limite atingido", {
          description: `Você já atingiu o limite de ${POSITION_LIMITS[position]} ${POSITION_LABELS[position]}(s)`
        });
        return;
      }

      // Adicionar jogador ao roster
      const newPlayer: Player = {
        id: player.id,
        name: player.name,
        cpf: cleanCPF,
        photoUrl: player.photoUrl,
        position: position,
        status: 'pending',
      };

      setRoster(prev => ({
        ...prev,
        [position]: [...prev[position], newPlayer],
      }));

      setSearchCPF("");
      setSelectedPosition(null);

      toast.success(`${player.name} adicionado!`, {
        description: `Aguardando confirmação do atleta`
      });
    } catch (error: any) {
      console.error("Erro ao buscar jogador:", error);
      toast.error(error.message || "Erro ao buscar jogador");
    } finally {
      setSearching(false);
    }
  }

  function removePlayer(position: keyof RosterLimits, cpf: string) {
    setRoster(prev => ({
      ...prev,
      [position]: prev[position].filter(p => p.cpf !== cpf),
    }));

    toast.info("Jogador removido da convocação");
  }

  async function saveRoster() {
    // Verificar se tem pelo menos 6 jogadores (mínimo para um time)
    const totalPlayers = Object.values(roster).reduce((sum, players) => sum + players.length, 0);
    
    if (totalPlayers < minPlayers) {
      toast.error("Convocação incompleta", {
        description: `Você precisa convocar pelo menos ${minPlayers} jogadores`
      });
      return;
    }

    // Verificar se tem técnico
    if (roster.tecnico.length === 0) {
      toast.error("Técnico obrigatório", {
        description: "Você precisa convocar um técnico"
      });
      return;
    }

    setSaving(true);
    try {
      // Enviar squadId junto com o roster
      await tournamentApi.saveRoster(tournamentId, teamId, roster, squadId);
      
      toast.success("Convocação salva!", {
        description: "Os jogadores convocados foram notificados e precisam confirmar"
      });
      
      setEditMode(false);
      setExistingRoster(true);
    } catch (error: any) {
      console.error("Erro ao salvar convocação:", error);
      toast.error(error.message || "Erro ao salvar convocação");
    } finally {
      setSaving(false);
    }
  }

  function getTotalPlayers() {
    return Object.values(roster).reduce((sum, players) => sum + players.length, 0);
  }

  function getStatusIcon(status: Player['status']) {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined':
        return <X className="h-4 w-4 text-red-500" />;
    }
  }

  function formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" aria-describedby="roster-description">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle>Convocação - {tournamentName}</DialogTitle>
              <DialogDescription id="roster-description">
                {teamName}
                {squadName && squadName !== 'Equipe Principal' && (
                  <span className="text-primary font-semibold"> • {squadName}</span>
                )}
                {!squadName || squadName === 'Equipe Principal' ? ' • Monte sua equipe para o torneio' : ''}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{getTotalPlayers()}</p>
                <p className="text-sm text-muted-foreground">Convocados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">
                  {Object.values(roster).flat().filter(p => p.status === 'confirmed').length}
                </p>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">
                  {Object.values(roster).flat().filter(p => p.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {editMode ? (
          <>
            {/* Buscar jogador */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Adicionar Jogador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seleção de posição */}
                <div className="space-y-2">
                  <Label>1. Selecione a posição</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(Object.keys(POSITION_LIMITS) as Array<keyof RosterLimits>)
                      .filter(pos => POSITION_LIMITS[pos] > 0) // Só mostra posições com limite > 0
                      .map((pos) => (
                      <Button
                        key={pos}
                        variant={selectedPosition === pos ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPosition(pos)}
                        disabled={roster[pos].length >= POSITION_LIMITS[pos]}
                        className="flex items-center justify-between w-full gap-2 px-3"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="shrink-0">{POSITION_ICONS[pos]}</span>
                          <span className="text-sm truncate">{POSITION_LABELS[pos]}</span>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {roster[pos].length}/{POSITION_LIMITS[pos]}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Campo de CPF */}
                <div className="space-y-2">
                  <Label htmlFor="search-cpf" className="text-base">2. Digite o CPF do Jogador</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-cpf"
                      placeholder="000.000.000-00"
                      value={searchCPF}
                      onChange={(e) => {
                        // Formatar CPF automaticamente
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 11) value = value.slice(0, 11);
                        
                        if (value.length > 9) {
                          value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                        } else if (value.length > 6) {
                          value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
                        } else if (value.length > 3) {
                          value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
                        }
                        
                        setSearchCPF(value);
                      }}
                      disabled={!selectedPosition || searching}
                      maxLength={14}
                      className="flex-1 h-11"
                    />
                    <Button
                      onClick={() => {
                        if (selectedPosition) {
                          searchPlayerByCPF(searchCPF, selectedPosition);
                        }
                      }}
                      disabled={!selectedPosition || !searchCPF || searching}
                      className="shrink-0 h-11"
                    >
                      {searching ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedPosition 
                      ? `💡 Digite o CPF do ${POSITION_LABELS[selectedPosition].toLowerCase()} que deseja convocar` 
                      : "⚠️ Selecione uma posição primeiro"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Separator />
          </>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800">
                Convocação salva! Os jogadores foram notificados.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        )}

        {/* Lista de convocados por posição */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Escalação
          </h3>

          {(Object.keys(roster) as Array<keyof RosterLimits>).map((position) => (
            <div key={position}>
              {roster[position].length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span>{POSITION_ICONS[position]}</span>
                      {POSITION_LABELS[position]}
                      <Badge variant="secondary" className="ml-auto">
                        {roster[position].length}/{POSITION_LIMITS[position]}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {roster[position].map((player) => (
                        <div
                          key={player.cpf}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {player.photoUrl ? (
                                <img
                                  src={player.photoUrl}
                                  alt={player.name}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                <Users className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{player.name}</p>
                              <p className="text-xs text-muted-foreground">
                                CPF: {formatCPF(player.cpf)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusIcon(player.status)}
                            <Badge
                              variant={
                                player.status === 'confirmed' ? 'default' :
                                player.status === 'pending' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {player.status === 'confirmed' && 'Confirmado'}
                              {player.status === 'pending' && 'Aguardando'}
                              {player.status === 'declined' && 'Recusou'}
                            </Badge>

                            {editMode && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removePlayer(position, player.cpf)}
                                className="text-destructive hover:text-destructive"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}

          {getTotalPlayers() === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum jogador convocado ainda</p>
              <p className="text-sm mt-1">Comece adicionando jogadores pela busca de CPF</p>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {existingRoster ? 'Fechar' : 'Cancelar'}
          </Button>
          
          {editMode && (
            <Button
              onClick={saveRoster}
              disabled={saving || getTotalPlayers() === 0}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {existingRoster ? 'Atualizar Convocação' : 'Finalizar Convocação'}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Avisos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-semibold mb-1">📋 Informações importantes:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            {isBeach ? (
              <>
                <li>Mínimo de {minPlayers} jogador(es) e 1 técnico obrigatório</li>
                <li>Torneio de vôlei de praia - {teamSize === 'duo' ? 'Dupla' : teamSize === 'trio' ? 'Trio' : teamSize === 'quartet' ? 'Quarteto' : 'Quinteto'}</li>
                <li>Os jogadores receberão notificação e precisam confirmar</li>
                <li>Você pode editar a convocação até o início do torneio</li>
              </>
            ) : (
              <>
                <li>Mínimo de 6 jogadores e 1 técnico obrigatório</li>
                <li>Apenas jogadores do seu time podem ser convocados</li>
                <li>Os jogadores receberão notificação e precisam confirmar</li>
                <li>Você pode editar a convocação até o início do torneio</li>
              </>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
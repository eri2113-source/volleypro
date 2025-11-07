import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Users, Trophy, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { teamCategoryApi, tournamentApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { TeamSquad } from "../lib/teamCategories";

interface TournamentSquadSelectionModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  teamId: string;
  teamName: string;
  modalityType?: 'indoor' | 'beach';
  onSquadSelected: (squad: TeamSquad) => void;
}

export function TournamentSquadSelectionModal({
  open,
  onClose,
  tournamentId,
  tournamentName,
  teamId,
  teamName,
  modalityType = 'indoor',
  onSquadSelected
}: TournamentSquadSelectionModalProps) {
  const [loading, setLoading] = useState(true);
  const [squads, setSquads] = useState<TeamSquad[]>([]);
  const [selectedSquadId, setSelectedSquadId] = useState("");
  const [registeredSquads, setRegisteredSquads] = useState<string[]>([]);
  const [registering, setRegistering] = useState(false);
  const [hasCategories, setHasCategories] = useState<boolean | null>(null);

  useEffect(() => {
    if (open) {
      loadSquadsAndRegistrations();
    }
  }, [open, teamId, tournamentId]);

  async function loadSquadsAndRegistrations() {
    setLoading(true);
    try {
      // 1. Verificar se time tem categorias
      let hasCategoriesCreated = false;
      
      try {
        const categoriesResponse = await teamCategoryApi.getCategories(teamId);
        const categories = categoriesResponse.categories || [];
        hasCategoriesCreated = categories && categories.length > 0;
        setHasCategories(hasCategoriesCreated);
      } catch (error) {
        setHasCategories(false);
      }

      // 2. Buscar equipes disponíveis
      let availableSquads: any[] = [];
      
      try {
        const squadsResponse = await teamCategoryApi.getSquadsForTournament(teamId, modalityType);
        availableSquads = squadsResponse.squads || [];
      } catch (error) {
        availableSquads = [];
      }
      
      setSquads(availableSquads);

      // 3. Buscar inscrições existentes
      try {
        const response = await tournamentApi.getTeamRegistrations(tournamentId, teamId);
        const registrations = response.registrations || [];
        const registeredSquadIds = registrations.map((reg: any) => reg.squadId);
        setRegisteredSquads(registeredSquadIds);
      } catch (error) {
        setRegisteredSquads([]);
      }
      
      // 4. INSCRIÇÃO AUTOMÁTICA para times sem categorias
      if (!hasCategoriesCreated) {
        setLoading(true);
        
        try {
          // Inscrever como TIME COMPLETO (squadId = null)
          await tournamentApi.registerSquad(tournamentId, teamId, null);
          
          toast.success(`${teamName} inscrito com sucesso!`, {
            description: 'Time completo registrado no torneio',
            duration: 5000
          });
          
          // Callback
          onSquadSelected({
            id: 'full-team',
            name: teamName,
            categoryName: null,
            players: [],
            active: true,
            createdAt: new Date().toISOString()
          });
          
          // Aguardar 500ms para ver toast
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Fechar modal
          setLoading(false);
          onClose();
        } catch (error: any) {
          toast.error('Erro ao inscrever time', {
            description: error.message || 'Tente novamente',
            duration: 8000
          });
          
          setLoading(false);
        }
        
        return;
      }
      
    } catch (error: any) {
      toast.error('Erro ao carregar dados', {
        description: error?.message || 'Tente novamente'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSquad() {
    if (!selectedSquadId) {
      toast.error("Selecione uma equipe");
      return;
    }

    const selectedSquad = squads.find(s => s.id === selectedSquadId);
    if (!selectedSquad) {
      toast.error("Equipe não encontrada");
      return;
    }

    setRegistering(true);
    try {
      // Validar jogadores únicos
      if (selectedSquad.players && selectedSquad.players.length > 0) {
        const { valid, conflicts } = await tournamentApi.validateSquadPlayers(
          tournamentId,
          teamId,
          selectedSquad.id,
          selectedSquad.players.map(p => p.id)
        );

        if (!valid && conflicts && conflicts.length > 0) {
          const conflictNames = conflicts.map((c: any) => c.playerName).join(', ');
          toast.error(`Jogador(es) já inscrito(s) em outra equipe: ${conflictNames}`, {
            description: "Um jogador não pode participar em duas equipes do mesmo torneio"
          });
          setRegistering(false);
          return;
        }
      }

      // Registrar equipe
      await tournamentApi.registerSquad(tournamentId, teamId, selectedSquad.id);

      const playerCount = selectedSquad.players?.length || 0;
      toast.success(`${selectedSquad.name} inscrita com sucesso!`, {
        description: playerCount > 0 
          ? `${playerCount} jogadores registrados` 
          : 'Lembre-se de adicionar jogadores antes do sorteio'
      });

      // Callback
      onSquadSelected(selectedSquad);

      // Limpar seleção
      setSelectedSquadId("");
      
      // Aguardar 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fechar modal
      onClose();
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao inscrever equipe", {
        description: "Tente novamente ou contate o suporte"
      });
    } finally {
      setRegistering(false);
    }
  }

  function handleClose() {
    setSelectedSquadId("");
    setSquads([]);
    setRegisteredSquads([]);
    setHasCategories(null);
    onClose();
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl" aria-describedby="squad-selection-description">
          <DialogHeader>
            <DialogTitle>Inscrever Equipe</DialogTitle>
            <DialogDescription id="squad-selection-description">
              Carregando equipes...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="squad-selection-description">
        <DialogHeader>
          <DialogTitle>Inscrever Equipe no Torneio</DialogTitle>
          <DialogDescription id="squad-selection-description">
            <div className="space-y-1">
              <p><strong>{tournamentName}</strong></p>
              <p className="text-sm">Time: {teamName}</p>
              {registeredSquads.length > 0 && (
                <Badge variant="secondary" className="mt-2">
                  {registeredSquads.length} equipe(s) já inscrita(s)
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {squads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Time Simples</h3>
                <p className="text-muted-foreground mb-6">
                  Você não tem categorias criadas. Inscreva seu time completo ou crie categorias se tiver múltiplas equipes.
                </p>

                <div className="grid gap-4 max-w-md mx-auto">
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="text-left">
                          <h4 className="font-medium mb-1">Inscrever Time Completo</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Para times simples sem categorias separadas
                          </p>
                          <Button 
                            onClick={async () => {
                              try {
                                setRegistering(true);
                                
                                await tournamentApi.registerSquad(tournamentId, teamId, null);
                                
                                toast.success(`${teamName} inscrito com sucesso!`, {
                                  description: "Time completo registrado no torneio"
                                });

                                onSquadSelected({ 
                                  id: 'full-team', 
                                  name: teamName,
                                  categoryName: null,
                                  players: [],
                                  active: true,
                                  createdAt: new Date().toISOString()
                                } as any);
                                
                                await new Promise(resolve => setTimeout(resolve, 500));
                                
                                handleClose();
                              } catch (error: any) {
                                toast.error(error.message || "Erro ao inscrever time", {
                                  description: "Tente novamente ou contate o suporte"
                                });
                              } finally {
                                setRegistering(false);
                              }
                            }}
                            disabled={registering}
                            className="w-full"
                          >
                            {registering ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Inscrevendo...
                              </>
                            ) : (
                              <>
                                <Trophy className="h-4 w-4 mr-2" />
                                Inscrever Agora
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <Card className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                        <div className="text-left">
                          <h4 className="font-medium mb-1">Criar Categorias</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Se você tem múltiplas equipes (Feminino A/B, Masculino A/B, etc.)
                          </p>
                          <Button 
                            variant="outline"
                            onClick={() => window.location.href = '#profile'}
                            className="w-full"
                          >
                            Ir para Meu Perfil → Categorias
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Selecione a equipe que vai participar:</Label>
                <Select value={selectedSquadId} onValueChange={setSelectedSquadId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {squads.map((squad: TeamSquad) => {
                      const isRegistered = registeredSquads.includes(squad.id);
                      return (
                        <SelectItem 
                          key={squad.id} 
                          value={squad.id}
                          disabled={isRegistered}
                        >
                          {squad.name} - {squad.categoryName} ({squad.players?.length || 0} jogadores){isRegistered && ' ✓'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedSquadId && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    {(() => {
                      const selectedSquad = squads.find(s => s.id === selectedSquadId);
                      if (!selectedSquad) return null;

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4>{selectedSquad.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedSquad.categoryName}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {selectedSquad.players?.length || 0} jogadores
                            </Badge>
                          </div>

                          {selectedSquad.players && selectedSquad.players.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Elenco:</h5>
                                <div className="grid gap-2 max-h-40 overflow-y-auto">
                                  {selectedSquad.players.map((player) => (
                                    <div 
                                      key={player.id}
                                      className="flex items-center gap-3 p-2 rounded-lg bg-background"
                                    >
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={player.photoUrl} alt={player.name} />
                                        <AvatarFallback className="text-xs">
                                          {player.name[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {player.name}
                                        </p>
                                      </div>
                                      <Badge variant="outline" className="text-xs shrink-0">
                                        #{player.number}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs shrink-0">
                                        {player.position}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {squads.length > 0 && (
          <DialogFooter>
            <Button 
              onClick={handleRegisterSquad}
              disabled={!selectedSquadId || registering}
            >
              {registering ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Inscrever Agora
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

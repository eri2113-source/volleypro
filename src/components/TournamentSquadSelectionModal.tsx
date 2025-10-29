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
  const [hasCategories, setHasCategories] = useState<boolean | null>(null); // null = não verificado, true/false = verificado

  useEffect(() => {
    if (open) {
      console.log(`\n🔄 ====== MODAL ABERTO - RECARREGANDO DADOS ======`);
      console.log(`   • tournamentId: ${tournamentId}`);
      console.log(`   • teamId: ${teamId}`);
      loadSquadsAndRegistrations();
    } else {
      console.log(`🔒 Modal fechado`);
    }
  }, [open, teamId, tournamentId]);

  async function loadSquadsAndRegistrations() {
    setLoading(true);
    try {
      console.log('🔍 Carregando equipes para:', {
        teamId,
        teamName,
        modalityType,
        tournamentId,
        tournamentName
      });

      // 1. PRIMEIRO: Verificar se o time tem categorias cadastradas
      let categories: any[] = [];
      let hasCategoriesCreated = false;
      
      try {
        console.log('📂 Verificando se time tem categorias...');
        const categoriesResponse = await teamCategoryApi.getCategories(teamId);
        categories = categoriesResponse.categories || [];
        hasCategoriesCreated = categories && categories.length > 0;
        setHasCategories(hasCategoriesCreated);
        
        console.log(`📋 Categorias encontradas: ${categories.length}`);
        if (hasCategoriesCreated) {
          categories.forEach((cat: any, index: number) => {
            console.log(`   ${index + 1}. ${cat.name} - ${cat.squads?.length || 0} equipes`);
          });
        }
      } catch (error: any) {
        console.error('⚠️ Erro ao buscar categorias (pode não ter categorias ainda):', error.message);
        setHasCategories(false);
      }

      // 2. SEGUNDO: Buscar equipes disponíveis (flatten de todas as categorias)
      let availableSquads: any[] = [];
      
      try {
        console.log('📦 Buscando equipes disponíveis...');
        const squadsResponse = await teamCategoryApi.getSquadsForTournament(teamId, modalityType);
        availableSquads = squadsResponse.squads || [];
        
        console.log('✅ Equipes carregadas:', availableSquads.length);
        
        if (availableSquads.length > 0) {
          availableSquads.forEach((squad: any, index: number) => {
            console.log(`   ${index + 1}. ${squad.name} (${squad.categoryName}) - ${squad.players?.length || 0} jogadores`);
          });
        } else {
          console.warn('⚠️ Nenhuma equipe retornada da API');
          
          // Se tem categorias mas não tem squads, algo está errado
          if (hasCategoriesCreated) {
            console.error('🔴 ERRO: Time tem categorias mas nenhuma equipe foi retornada!');
            console.log('💡 Possível causa: Equipes estão todas inativas ou não foram criadas dentro das categorias');
            
            // Mostrar detalhes das categorias
            categories.forEach((cat: any) => {
              if (cat.squads && cat.squads.length > 0) {
                cat.squads.forEach((squad: any) => {
                  console.log(`   🔍 Equipe "${squad.name}": active=${squad.active}, players=${squad.players?.length || 0}`);
                });
              }
            });
          }
        }
      } catch (error: any) {
        console.error('❌ Erro ao buscar equipes:', error);
        console.error('   Detalhes:', error.message);
        
        // Se der erro ao buscar equipes, permite inscrição como time completo
        console.log('💡 Permitindo inscrição como TIME COMPLETO devido ao erro');
        setHasCategories(false);
        availableSquads = [];
      }
      
      setSquads(availableSquads);

      // 3. TERCEIRO: Buscar inscrições existentes neste torneio
      try {
        console.log('\n📋 Buscando inscrições existentes...');
        console.log(`   • URL: /tournaments/${tournamentId}/registrations/${teamId}`);
        const response = await tournamentApi.getTeamRegistrations(tournamentId, teamId);
        console.log(`   • Resposta:`, response);
        const registrations = response.registrations || [];
        console.log(`   • Total de registrations: ${registrations.length}`);
        
        if (registrations.length > 0) {
          registrations.forEach((reg: any, index: number) => {
            console.log(`   ${index + 1}. squadId: ${reg.squadId || 'TIME COMPLETO'}, squadName: ${reg.squadName}`);
          });
        }
        
        const registeredSquadIds = registrations.map((reg: any) => reg.squadId);
        setRegisteredSquads(registeredSquadIds);
        console.log(`✅ IDs das equipes inscritas:`, registeredSquadIds);
        console.log(`✅ Total: ${registeredSquadIds.length} inscrição(ões)\n`);
      } catch (error: any) {
        console.error('⚠️ Erro ao buscar inscrições:', error.message);
        setRegisteredSquads([]);
      }
      
      // 4. QUARTO: Se não tem categorias OU não tem equipes disponíveis, inscrever automaticamente como TIME COMPLETO
      if ((!hasCategoriesCreated || availableSquads.length === 0)) {
        console.log('\n🏢 ====== TIME SEM CATEGORIAS/EQUIPES ======');
        console.log('   • hasCategoriesCreated:', hasCategoriesCreated);
        console.log('   • availableSquads:', availableSquads.length);
        console.log('   ✅ Inscrevendo automaticamente como TIME COMPLETO...');
        
        try {
          // Inscrever como TIME COMPLETO (squadId = null)
          await tournamentApi.registerSquad(tournamentId, teamId, null);
          
          toast.success(`${teamName} inscrito com sucesso!`, {
            description: 'Time completo registrado no torneio'
          });
          
          console.log('✅ Inscrição TIME COMPLETO realizada!');
          
          // Fechar modal e notificar sucesso
          onClose();
          onSquadSelected({
            id: 'full-team',
            name: teamName,
            categoryName: null,
            players: [],
            active: true,
            createdAt: new Date().toISOString()
          });
        } catch (error: any) {
          console.error('❌ Erro ao inscrever time completo:', error);
          toast.error('Erro ao inscrever time', {
            description: error.message || 'Tente novamente'
          });
        }
        
        setLoading(false);
        return;
      }
      
    } catch (error: any) {
      console.error('❌ Erro fatal ao carregar modal:', error);
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

    // Verificar se tem jogadores
    if (!selectedSquad.players || selectedSquad.players.length === 0) {
      toast.error("Esta equipe não tem jogadores cadastrados");
      return;
    }

    setRegistering(true);
    try {
      // Validar jogadores únicos
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

      // Registrar equipe
      await tournamentApi.registerSquad(tournamentId, teamId, selectedSquad.id);

      toast.success(`${selectedSquad.name} inscrita com sucesso!`, {
        description: `${selectedSquad.players.length} jogadores registrados`
      });

      // Callback com a equipe selecionada
      onSquadSelected(selectedSquad);

      // Atualizar lista
      await loadSquadsAndRegistrations();
      
      // Limpar seleção
      setSelectedSquadId("");
      
    } catch (error: any) {
      console.error('❌ Erro ao registrar equipe:', error);
      toast.error(error.message || "Erro ao inscrever equipe");
    } finally {
      setRegistering(false);
    }
  }

  function handleClose() {
    setSelectedSquadId("");
    // Reset estado ao fechar para garantir reload limpo na próxima abertura
    setSquads([]);
    setRegisteredSquads([]);
    setHasCategories(null);
    onClose();
  }

  // Agrupar equipes por categoria
  const squadsByCategory = squads.reduce((acc: any, squad: TeamSquad) => {
    const category = squad.categoryName || 'Sem Categoria';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(squad);
    return acc;
  }, {});

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
                {/* CASO 1: TEM CATEGORIAS mas NENHUMA EQUIPE - ERRO! */}
                {hasCategories === true ? (
                  <>
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                    <h3 className="mb-2 text-destructive">Categorias sem Equipes</h3>
                    <p className="text-muted-foreground mb-6">
                      Você tem categorias criadas, mas nenhuma equipe foi encontrada dentro delas.
                    </p>

                    <div className="p-4 bg-muted/50 rounded-lg text-left text-sm mb-6">
                      <p className="font-medium mb-2">🔍 Possíveis causas:</p>
                      <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                        <li>Categorias criadas mas sem equipes dentro</li>
                        <li>Todas as equipes estão marcadas como inativas</li>
                        <li>Equipes foram deletadas acidentalmente</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={() => window.location.href = '#profile'}
                        className="w-full"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Ir para Categorias e Criar Equipes
                      </Button>
                      
                      <p className="text-xs text-muted-foreground">
                        Abra o Console (F12) para ver logs detalhados
                      </p>
                    </div>
                  </>
                ) : (
                  /* CASO 2: NÃO TEM CATEGORIAS - TIME SIMPLES */
                  <>
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="mb-2">Time Simples</h3>
                    <p className="text-muted-foreground mb-6">
                      Você não tem categorias criadas. Inscreva seu time completo ou crie categorias se tiver múltiplas equipes.
                    </p>

                    <div className="grid gap-4 max-w-md mx-auto">
                      {/* Opção 1: Inscrever Time Completo (SIMPLES) */}
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
                                    // Inscrever time completo (sem squad específico)
                                    await tournamentApi.registerSquad(tournamentId, teamId, null);
                                    
                                    toast.success(`${teamName} inscrito com sucesso!`, {
                                      description: "Time completo registrado no torneio"
                                    });

                                    // Callback
                                    onSquadSelected({ id: teamId, name: teamName } as any);
                                    
                                    // Fechar modal
                                    handleClose();
                                  } catch (error: any) {
                                    console.error('❌ Erro ao inscrever time:', error);
                                    toast.error(error.message || "Erro ao inscrever time");
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

                      {/* Divisor */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">ou</span>
                        </div>
                      </div>

                      {/* Opção 2: Criar Categorias (MÚLTIPLAS EQUIPES) */}
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
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Seletor de Equipe */}
              <div className="space-y-2">
                <Label>Selecione a equipe que vai participar:</Label>
                <Select value={selectedSquadId} onValueChange={setSelectedSquadId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(squadsByCategory).map(([category, categorySquads]: [string, any]) => (
                      <optgroup key={category} label={category}>
                        {categorySquads.map((squad: TeamSquad) => {
                          const isRegistered = registeredSquads.includes(squad.id);
                          return (
                            <SelectItem 
                              key={squad.id} 
                              value={squad.id}
                              disabled={isRegistered}
                            >
                              {squad.name} - {squad.categoryName} 
                              ({squad.players?.length || 0} jogadores)
                              {isRegistered && ' ✓ Já inscrita'}
                            </SelectItem>
                          );
                        })}
                      </optgroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview da Equipe Selecionada */}
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

                          {selectedSquad.players && selectedSquad.players.length > 0 ? (
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
                          ) : (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              <span>Esta equipe não tem jogadores cadastrados</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Equipes Já Inscritas */}
              {registeredSquads.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <h5 className="text-sm font-medium">Equipes já inscritas neste torneio:</h5>
                      </div>
                      <div className="space-y-2">
                        {registeredSquads.map(squadId => {
                          const squad = squads.find(s => s.id === squadId);
                          if (!squad) return null;
                          return (
                            <div 
                              key={squadId}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div>
                                <p className="font-medium">{squad.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {squad.categoryName} • {squad.players?.length || 0} jogadores
                                </p>
                              </div>
                              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                                ✓ Inscrita
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          {squads.length > 0 && (
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
                  <Trophy className="h-4 w-4 mr-2" />
                  Inscrever Equipe
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

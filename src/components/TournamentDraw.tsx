import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  Shuffle, 
  Play, 
  Pause, 
  SkipForward, 
  Trophy,
  Users,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TournamentDrawProps {
  tournamentId: number;
  tournament: any;
}

export function TournamentDraw({ tournamentId, tournament }: TournamentDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [remainingTeams, setRemainingTeams] = useState<any[]>([]);
  const [drawCompleted, setDrawCompleted] = useState(false);
  const [drawSpeed, setDrawSpeed] = useState(2000);
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupNames, setGroupNames] = useState<string[]>([]);

  // Carregar times inscritos
  useEffect(() => {
    loadRegisteredTeams();
    loadExistingDraw();
  }, [tournamentId]);

  async function loadRegisteredTeams() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/registered-teams`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to load teams');

      const data = await response.json();
      setRegisteredTeams(data.teams || []);
      
      // Calcular número de grupos baseado na quantidade de times
      const numTeams = data.teams.length;
      const numGroups = calculateOptimalGroups(numTeams);
      setGroupNames(generateGroupNames(numGroups));
      
      console.log(`✅ ${numTeams} times inscritos, ${numGroups} grupos`);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      toast.error('Erro ao carregar times inscritos');
    } finally {
      setLoading(false);
    }
  }

  async function loadExistingDraw() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/draw`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      if (data.draw?.groups) {
        setGroups(data.draw.groups);
        setDrawCompleted(true);
        toast.info('Sorteio já realizado', {
          description: 'Clique em "Sortear Novamente" para refazer'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar sorteio:', error);
    }
  }

  function calculateOptimalGroups(numTeams: number): number {
    if (numTeams <= 4) return 1;
    if (numTeams <= 8) return 2;
    if (numTeams <= 12) return 3;
    return 4;
  }

  function generateGroupNames(count: number): string[] {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return letters.slice(0, count);
  }

  useEffect(() => {
    if (!isDrawing || isPaused || drawCompleted || remainingTeams.length === 0) return;

    const timer = setTimeout(() => {
      performNextDraw();
    }, drawSpeed);

    return () => clearTimeout(timer);
  }, [isDrawing, isPaused, drawCompleted, remainingTeams.length]);

  function startDraw() {
    if (registeredTeams.length === 0) {
      toast.error('Nenhum time inscrito!', {
        description: 'Aguarde as inscrições para fazer o sorteio'
      });
      return;
    }

    // VALIDAÇÃO: Verificar se todos os times têm pelo menos 6 jogadores
    const teamsWithoutMinPlayers = registeredTeams.filter(team => {
      const playerCount = team.players?.length || 0;
      return playerCount < 6;
    });

    if (teamsWithoutMinPlayers.length > 0) {
      const teamNames = teamsWithoutMinPlayers.map(t => t.squadName || t.teamName).join(', ');
      toast.error('Equipes sem jogadores suficientes!', {
        description: `As seguintes equipes precisam ter pelo menos 6 jogadores: ${teamNames}`,
        duration: 8000
      });
      return;
    }

    // Resetar sorteio
    const shuffledTeams = [...registeredTeams].sort(() => Math.random() - 0.5);
    setRemainingTeams(shuffledTeams);
    
    // Criar grupos dinâmicos
    const initialGroups: Record<string, any[]> = {};
    groupNames.forEach(name => {
      initialGroups[name] = [];
    });
    setGroups(initialGroups);
    
    setCurrentGroup(groupNames[0]);
    setCurrentTeam(null);
    setDrawCompleted(false);
    setIsDrawing(true);
    setIsPaused(false);

    toast.success("Sorteio iniciado!", {
      description: `${registeredTeams.length} times serão sorteados em ${groupNames.length} grupos`
    });
  }

  function performNextDraw() {
    if (remainingTeams.length === 0 || drawCompleted) {
      // Sorteio completo
      setDrawCompleted(true);
      setIsDrawing(false);
      setCurrentTeam(null);
      saveDraw();
      toast.success("Sorteio concluído!", {
        description: "Grupos formados com sucesso",
        duration: 5000
      });
      return;
    }

    // Pegar próximo time
    const team = remainingTeams[0];
    setCurrentTeam(team);

    // Determinar grupo
    const groupSizes = Object.values(groups).map(g => g.length);
    const minSize = Math.min(...groupSizes);
    const availableGroups = groupNames.filter((_, i) => groupSizes[i] === minSize);
    const nextGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];

    // Adicionar ao grupo após animação
    setTimeout(() => {
      setRemainingTeams(prev => {
        const newRemaining = prev.slice(1);
        
        // Se acabaram os times, finalizar
        if (newRemaining.length === 0) {
          const finalGroups = {
            ...groups,
            [nextGroup]: [...groups[nextGroup], team]
          };
          setGroups(finalGroups);
          setDrawCompleted(true);
          setIsDrawing(false);
          setCurrentTeam(null);
          
          // Salvar no backend
          saveDraw(finalGroups);
          
          toast.success("Sorteio concluído!", {
            description: "Grupos formados e salvos com sucesso",
            duration: 5000
          });
          return newRemaining;
        }
        
        return newRemaining;
      });
      
      setGroups(prev => ({
        ...prev,
        [nextGroup]: [...prev[nextGroup], team]
      }));
      
      setCurrentGroup(nextGroup);
      setCurrentTeam(null);
    }, drawSpeed / 2);
  }

  async function saveDraw(finalGroups?: Record<string, any[]>) {
    try {
      const groupsToSave = finalGroups || groups;
      
      const token = localStorage.getItem('volleypro_token');
      if (!token) {
        console.warn('Não autenticado, sorteio não salvo');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/draw`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ groups: groupsToSave })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save draw');
      }

      console.log('✅ Sorteio salvo no backend');
    } catch (error) {
      console.error('❌ Erro ao salvar sorteio:', error);
      toast.error('Sorteio concluído mas não foi salvo');
    }
  }

  function togglePause() {
    setIsPaused(!isPaused);
    if (isPaused) {
      toast.info("Sorteio retomado");
    } else {
      toast.info("Sorteio pausado");
    }
  }

  function skipToEnd() {
    if (!isDrawing) return;

    const shuffledTeams = [...remainingTeams];
    const newGroups = { ...groups };

    shuffledTeams.forEach((team) => {
      // Encontrar grupo com menos times
      const groupSizes = groupNames.map(g => newGroups[g].length);
      const minSize = Math.min(...groupSizes);
      const targetGroupIndex = groupSizes.findIndex(size => size === minSize);
      const targetGroup = groupNames[targetGroupIndex];
      
      newGroups[targetGroup].push(team);
    });

    setGroups(newGroups);
    setRemainingTeams([]);
    setDrawCompleted(true);
    setIsDrawing(false);
    setCurrentTeam(null);
    
    // Salvar no backend
    saveDraw(newGroups);
    
    toast.success("Sorteio concluído instantaneamente!");
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Carregando times inscritos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info de Times Inscritos */}
      {registeredTeams.length === 0 ? (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Nenhum time inscrito ainda</h3>
                <p className="text-sm text-muted-foreground">
                  Aguarde as inscrições para realizar o sorteio dos grupos. O sorteio pode ser feito a qualquer momento até o início do torneio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">
                  <Users className="h-4 w-4 inline mr-2" />
                  {registeredTeams.length} Times Inscritos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Serão distribuídos em {groupNames.length} {groupNames.length === 1 ? 'grupo' : 'grupos'} ({groupNames.join(', ')})
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {registeredTeams.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Sorteio Automático ao Vivo</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe a formação dos grupos em tempo real
              </p>
            </div>
            <div className="flex gap-2">
              {!isDrawing && !drawCompleted && (
                <Button onClick={startDraw} size="lg" className="bg-gradient-to-r from-primary to-secondary">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Sorteio
                </Button>
              )}
              {isDrawing && (
                <>
                  <Button onClick={togglePause} variant="outline" size="lg">
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button onClick={skipToEnd} variant="outline" size="lg">
                    <SkipForward className="h-4 w-4 mr-2" />
                    Pular
                  </Button>
                </>
              )}
              {drawCompleted && (
                <Button onClick={startDraw} size="lg" variant="outline">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Sortear Novamente
                </Button>
              )}
            </div>
          </div>

          {/* Velocidade do Sorteio */}
          {!isDrawing && !drawCompleted && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Velocidade:</span>
              <div className="flex gap-2">
                <Button
                  variant={drawSpeed === 3000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDrawSpeed(3000)}
                >
                  Lenta
                </Button>
                <Button
                  variant={drawSpeed === 2000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDrawSpeed(2000)}
                >
                  Normal
                </Button>
                <Button
                  variant={drawSpeed === 1000 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDrawSpeed(1000)}
                >
                  Rápida
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status do Sorteio */}
      {isDrawing && (
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div>
                  <p className="font-semibold">Sorteando times...</p>
                  <p className="text-sm text-muted-foreground">
                    {remainingTeams.length} time{remainingTeams.length !== 1 ? "s" : ""} restante{remainingTeams.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary text-white text-lg px-4 py-2">
                {allTeams.length - remainingTeams.length} / {allTeams.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Sendo Sorteado */}
      <AnimatePresence>
        {currentTeam && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">Sorteando...</h3>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={currentTeam.logo} />
                    <AvatarFallback>{currentTeam.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-3xl font-bold">{currentTeam.name}</p>
                    <Badge variant="secondary" className="mt-2">
                      Seed #{currentTeam.seed}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grupos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groupNames.map((groupName) => (
          <motion.div
            key={groupName}
            animate={{
              scale: currentGroup === groupName ? 1.05 : 1,
              borderColor: currentGroup === groupName ? "rgb(34, 197, 94)" : "transparent"
            }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`${currentGroup === groupName ? "border-2 border-green-500 shadow-lg" : ""}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Grupo {groupName}</span>
                  <Badge variant="outline">{groups[groupName]?.length || 0} times</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <AnimatePresence>
                  {groups[groupName]?.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={team.logo} />
                          <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{team.name}</p>
                          <p className="text-xs text-muted-foreground">Seed #{team.seed}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Placeholder para times vazios */}
                {!drawCompleted && (groups[groupName]?.length || 0) < 4 && (
                  <div className="space-y-2">
                    {Array.from({ length: 4 - (groups[groupName]?.length || 0) }).map((_, i) => (
                      <div key={i} className="h-16 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Times Restantes */}
      {remainingTeams.length > 0 && isDrawing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Times Aguardando Sorteio
            </CardTitle>
            <CardDescription>{remainingTeams.length} time{remainingTeams.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {remainingTeams.map((team) => (
                <motion.div
                  key={team.id}
                  animate={{ opacity: team.id === currentTeam?.id ? 0.3 : 1 }}
                >
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg border">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={team.logo} />
                      <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-medium text-center line-clamp-2">{team.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado Final */}
      {drawCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Sorteio Concluído!</h3>
              <p className="text-muted-foreground mb-4">
                Os grupos foram formados. O organizador agora pode definir os horários e locais dos jogos.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={startDraw} variant="outline">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Sortear Novamente
                </Button>
                <Button>
                  Continuar para Configuração
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

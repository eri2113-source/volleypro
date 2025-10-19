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
  Sparkles
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

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

  const allTeams = [
    { id: 1, name: "Vôlei Campeões", logo: "https://ui-avatars.com/api/?name=VC&background=0052cc&color=fff", seed: 1 },
    { id: 2, name: "Estrelas do Vôlei", logo: "https://ui-avatars.com/api/?name=EV&background=ff6b35&color=fff", seed: 5 },
    { id: 3, name: "Unidos FC", logo: "https://ui-avatars.com/api/?name=UFC&background=4ecdc4&color=fff", seed: 9 },
    { id: 4, name: "Força Jovem", logo: "https://ui-avatars.com/api/?name=FJ&background=f7b731&color=fff", seed: 13 },
    { id: 5, name: "Gigantes SC", logo: "https://ui-avatars.com/api/?name=GSC&background=5f27cd&color=fff", seed: 2 },
    { id: 6, name: "Atlético VM", logo: "https://ui-avatars.com/api/?name=AVM&background=ee5a6f&color=fff", seed: 6 },
    { id: 7, name: "Relâmpago VB", logo: "https://ui-avatars.com/api/?name=RVB&background=1dd1a1&color=fff", seed: 10 },
    { id: 8, name: "Nova Geração", logo: "https://ui-avatars.com/api/?name=NG&background=ff9ff3&color=000", seed: 14 },
    { id: 9, name: "Titãs VB", logo: "https://ui-avatars.com/api/?name=TVB&background=48dbfb&color=000", seed: 3 },
    { id: 10, name: "Fênix VC", logo: "https://ui-avatars.com/api/?name=FVC&background=f368e0&color=fff", seed: 7 },
    { id: 11, name: "Dragões", logo: "https://ui-avatars.com/api/?name=DR&background=ff6348&color=fff", seed: 11 },
    { id: 12, name: "Leões SC", logo: "https://ui-avatars.com/api/?name=LSC&background=feca57&color=000", seed: 15 },
    { id: 13, name: "Águias", logo: "https://ui-avatars.com/api/?name=AG&background=0abde3&color=fff", seed: 4 },
    { id: 14, name: "Falcões", logo: "https://ui-avatars.com/api/?name=FC&background=ee5a6f&color=fff", seed: 8 },
    { id: 15, name: "Cobras VC", logo: "https://ui-avatars.com/api/?name=CVC&background=00d2d3&color=fff", seed: 12 },
    { id: 16, name: "Tubarões", logo: "https://ui-avatars.com/api/?name=TB&background=341f97&color=fff", seed: 16 },
  ];

  const groupNames = ["A", "B", "C", "D"];

  useEffect(() => {
    if (!isDrawing || isPaused || drawCompleted) return;

    const timer = setTimeout(() => {
      performNextDraw();
    }, drawSpeed);

    return () => clearTimeout(timer);
  }, [isDrawing, isPaused, currentGroup, groups, remainingTeams, drawCompleted]);

  function startDraw() {
    // Resetar sorteio
    const shuffledTeams = [...allTeams].sort(() => Math.random() - 0.5);
    setRemainingTeams(shuffledTeams);
    setGroups({ A: [], B: [], C: [], D: [] });
    setCurrentGroup("A");
    setCurrentTeam(null);
    setDrawCompleted(false);
    setIsDrawing(true);
    setIsPaused(false);

    toast.success("Sorteio iniciado!", {
      description: "Acompanhe ao vivo a formação dos grupos"
    });
  }

  function performNextDraw() {
    if (remainingTeams.length === 0) {
      // Sorteio completo
      setDrawCompleted(true);
      setIsDrawing(false);
      setCurrentTeam(null);
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
      setGroups(prev => ({
        ...prev,
        [nextGroup]: [...prev[nextGroup], team]
      }));
      setRemainingTeams(prev => prev.slice(1));
      setCurrentGroup(nextGroup);
      setCurrentTeam(null);
    }, drawSpeed / 2);
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
    const teamsPerGroup = Math.ceil(allTeams.length / groupNames.length);

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
    
    toast.success("Sorteio concluído instantaneamente!");
  }

  return (
    <div className="space-y-6">
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

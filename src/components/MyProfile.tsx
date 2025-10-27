import { useState, useEffect } from "react";
import { 
  ArrowLeft, Edit, Trophy, MapPin, Users, UserPlus, X, Save, Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { userApi, masterAdminApi, teamRosterApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { formatHeight } from "../utils/formatters";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface MyProfileProps {
  onBack: () => void;
  onEditProfile?: () => void;
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
}

export function MyProfile({ onBack, onEditProfile }: MyProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);
  
  // Estados para times
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDeletePlayerConfirm, setShowDeletePlayerConfirm] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [addPlayerMode, setAddPlayerMode] = useState<'cpf' | 'manual'>('cpf');
  const [searchCPF, setSearchCPF] = useState("");
  const [searchingCPF, setSearchingCPF] = useState(false);
  const [athleteFound, setAthleteFound] = useState<any>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    position: "",
    number: "",
    age: "",
    height: "",
    photoUrl: ""
  });

  useEffect(() => {
    loadProfile();
    checkMasterStatus();
  }, []);

  useEffect(() => {
    if (profile?.userType === 'team') {
      loadTeamPlayers();
    }
  }, [profile]);

  async function loadProfile() {
    setLoading(true);
    try {
      const { profile: userProfile } = await userApi.getCurrentUser();
      console.log("📊 Perfil carregado:", userProfile);
      setProfile(userProfile);
    } catch (error: any) {
      console.error("❌ Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }

  async function checkMasterStatus() {
    try {
      const { isMaster: masterStatus } = await masterAdminApi.checkMasterStatus();
      setIsMaster(masterStatus);
    } catch (error) {
      setIsMaster(false);
    }
  }

  async function loadTeamPlayers() {
    try {
      // Buscar jogadores reais do banco de dados
      // TODO: Implementar endpoint GET /teams/{teamId}/players
      const teamId = profile.id;
      const { players: teamPlayers } = await teamRosterApi.getTeamPlayers(teamId);
      setPlayers(teamPlayers);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      setPlayers([]);
    }
  }

  async function handleSearchCPF() {
    if (!searchCPF.trim()) {
      toast.error("Digite um CPF válido");
      return;
    }

    setSearchingCPF(true);
    setAthleteFound(null);
    
    try {
      console.log('🔍 Buscando atleta por CPF:', searchCPF);
      
      // Buscar atleta real por CPF no banco de dados
      const athleteData = await userApi.searchByCPF(searchCPF);
      
      console.log('✅ Atleta encontrado:', athleteData);
      
      // Verificar se é um atleta
      if (athleteData.userType !== 'athlete') {
        toast.error("CPF encontrado, mas não é de um atleta. Apenas atletas podem ser adicionados ao elenco.");
        setAthleteFound(null);
        return;
      }
      
      setAthleteFound(athleteData);
      toast.success(`✅ Atleta encontrado: ${athleteData.name}!`);
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar atleta por CPF:', error);
      
      if (error.message?.includes('não encontrado') || error.message?.includes('404')) {
        toast.error("Atleta não encontrado. Certifique-se de que o atleta adicionou o CPF no perfil.");
      } else {
        toast.error("Erro ao buscar atleta. Tente novamente ou adicione manualmente.");
      }
      
      setAthleteFound(null);
    } finally {
      setSearchingCPF(false);
    }
  }

  async function handleAddAthleteFromCPF() {
    if (!athleteFound) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: athleteFound.name,
      position: athleteFound.position,
      number: players.length + 1,
      age: athleteFound.age,
      height: athleteFound.height,
      photoUrl: athleteFound.photoUrl
    };

    setPlayers([...players, newPlayer]);
    toast.success(`${athleteFound.name} adicionado ao elenco!`);
    
    setShowAddPlayerModal(false);
    setSearchCPF("");
    setAthleteFound(null);
    setAddPlayerMode('cpf');
  }

  async function handleAddManualPlayer() {
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const playerToAdd: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
      position: newPlayer.position,
      number: parseInt(newPlayer.number),
      age: newPlayer.age ? parseInt(newPlayer.age) : undefined,
      height: newPlayer.height ? parseInt(newPlayer.height) : undefined,
      photoUrl: newPlayer.photoUrl || undefined
    };

    setPlayers([...players, playerToAdd]);
    toast.success(`${newPlayer.name} adicionado ao elenco!`);
    
    setShowAddPlayerModal(false);
    setNewPlayer({
      name: "",
      position: "",
      number: "",
      age: "",
      height: "",
      photoUrl: ""
    });
    setAddPlayerMode('cpf');
  }

  function handleDeletePlayer() {
    if (!selectedPlayer) return;
    
    setPlayers(players.filter(p => p.id !== selectedPlayer.id));
    toast.success("Jogador removido do elenco");
    setShowDeletePlayerConfirm(false);
    setSelectedPlayer(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <p>Perfil não encontrado</p>
      </div>
    );
  }

  const isTeam = profile.userType === 'team';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 shadow-lg">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            {onEditProfile && (
              <Button
                onClick={onEditProfile}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-white/20 shadow-2xl">
              <AvatarImage src={profile.photoUrl} alt={profile.name} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-white/20 text-white">
                {profile.name?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h1 className="text-white text-2xl sm:text-3xl">
                  {profile.nickname || profile.name}
                </h1>
                {profile.verified && (
                  <Badge className="bg-white/20 text-white">
                    ✓ Verificado
                  </Badge>
                )}
              </div>
              
              {isTeam ? (
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start text-white/90">
                  {profile.city && (
                    <span className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      {profile.city}
                    </span>
                  )}
                  {profile.founded && (
                    <span className="text-sm">Fundado em {profile.founded}</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {profile.position && (
                    <Badge className="bg-white/20 text-white">
                      {profile.position}
                    </Badge>
                  )}
                  {profile.currentTeam && (
                    <Badge className="bg-white/20 text-white">
                      {profile.currentTeam}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-6 mt-4 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-white text-xl">{profile.followers || 0}</p>
                  <p className="text-white/80 text-sm">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-xl">{profile.following || 0}</p>
                  <p className="text-white/80 text-sm">Seguindo</p>
                </div>
                {isTeam && (
                  <div className="text-center">
                    <p className="text-white text-xl">{profile.championships || 0}</p>
                    <p className="text-white/80 text-sm">Títulos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl p-6">
        <Tabs defaultValue={isTeam ? "roster" : "info"} className="space-y-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${isTeam ? 6 : 2}, 1fr)` }}>
            {isTeam && <TabsTrigger value="roster">Elenco</TabsTrigger>}
            {isTeam && <TabsTrigger value="lineup">Escalação</TabsTrigger>}
            <TabsTrigger value="info">Informações</TabsTrigger>
            {isTeam && <TabsTrigger value="tournaments">Torneios</TabsTrigger>}
            {isTeam && <TabsTrigger value="stats">Estatísticas</TabsTrigger>}
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <h3>Sobre</h3>
              </CardHeader>
              <CardContent>
                {profile.bio ? (
                  <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nenhuma biografia adicionada.
                  </p>
                )}
              </CardContent>
            </Card>

            {!isTeam && profile.position && (
              <Card>
                <CardHeader>
                  <h3>Dados Técnicos</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.height && (
                      <div>
                        <p className="text-sm text-muted-foreground">Altura</p>
                        <p>{formatHeight(profile.height)}</p>
                      </div>
                    )}
                    {profile.age && (
                      <div>
                        <p className="text-sm text-muted-foreground">Idade</p>
                        <p>{profile.age} anos</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isTeam && (
            <TabsContent value="roster" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3>Elenco ({players.length})</h3>
                    </div>
                    <Button onClick={() => setShowAddPlayerModal(true)} size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Adicionar Atleta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {players.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum jogador no elenco. Clique em "Adicionar Atleta" para começar.
                    </p>
                  ) : (
                    <div className="grid gap-4">
                      {players.map((player) => (
                        <div key={player.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={player.photoUrl} alt={player.name} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h4>{player.name}</h4>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                #{player.number}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {player.position}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right text-sm text-muted-foreground">
                            {player.height && <p>{formatHeight(player.height)}</p>}
                            {player.age && <p>{player.age} anos</p>}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPlayer(player);
                              setShowDeletePlayerConfirm(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ABA: ESCALAÇÃO */}
          {isTeam && (
            <TabsContent value="lineup" className="space-y-6">
              <Card>
                <CardHeader>
                  <h3>Escalação Titular</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic text-center py-8">
                    Funcionalidade de escalação em breve. Aqui você poderá definir a formação titular do seu time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ABA: TORNEIOS */}
          {isTeam && (
            <TabsContent value="tournaments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3>Torneios Participados</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic text-center py-8">
                    Histórico de torneios será exibido aqui quando você participar de competições.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* ABA: ESTATÍSTICAS */}
          {isTeam && (
            <TabsContent value="stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <h3>Estatísticas do Time</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{profile.wins || 0}</p>
                      <p className="text-sm text-muted-foreground">Vitórias</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{profile.losses || 0}</p>
                      <p className="text-sm text-muted-foreground">Derrotas</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{profile.totalMatches || 0}</p>
                      <p className="text-sm text-muted-foreground">Partidas</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{profile.championships || 0}</p>
                      <p className="text-sm text-muted-foreground">Títulos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h3>Conquistas e Títulos</h3>
                </div>
              </CardHeader>
              <CardContent>
                {profile.achievements ? (
                  <p className="text-muted-foreground whitespace-pre-wrap">{profile.achievements}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nenhuma conquista adicionada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Adicionar Jogador */}
      <Dialog open={showAddPlayerModal} onOpenChange={setShowAddPlayerModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="add-player-description">
          <DialogHeader>
            <DialogTitle>Adicionar Atleta ao Elenco</DialogTitle>
            <DialogDescription id="add-player-description">
              Busque por CPF ou adicione manualmente
            </DialogDescription>
          </DialogHeader>

          <Tabs value={addPlayerMode} onValueChange={(v) => setAddPlayerMode(v as 'cpf' | 'manual')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cpf">Buscar por CPF</TabsTrigger>
              <TabsTrigger value="manual">Adicionar Manualmente</TabsTrigger>
            </TabsList>

            <TabsContent value="cpf" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>CPF do Atleta</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="000.000.000-00"
                    value={searchCPF}
                    onChange={(e) => setSearchCPF(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchCPF()}
                  />
                  <Button onClick={handleSearchCPF} disabled={searchingCPF}>
                    {searchingCPF ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Buscar"
                    )}
                  </Button>
                </div>
              </div>

              {athleteFound && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={athleteFound.photoUrl} alt={athleteFound.name} />
                        <AvatarFallback>{athleteFound.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{athleteFound.name}</h4>
                        <p className="text-sm text-muted-foreground">{athleteFound.position}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          {athleteFound.age && <span>{athleteFound.age} anos</span>}
                          {athleteFound.height && <span>{formatHeight(athleteFound.height)}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    placeholder="Nome do jogador"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Posição *</Label>
                  <Select
                    value={newPlayer.position}
                    onValueChange={(v) => setNewPlayer({ ...newPlayer, position: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Levantador">Levantador</SelectItem>
                      <SelectItem value="Ponteiro">Ponteiro</SelectItem>
                      <SelectItem value="Central">Central</SelectItem>
                      <SelectItem value="Oposto">Oposto</SelectItem>
                      <SelectItem value="Líbero">Líbero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Número da Camisa *</Label>
                  <Input
                    type="number"
                    value={newPlayer.number}
                    onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                    placeholder="Ex: 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Idade</Label>
                  <Input
                    type="number"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                    placeholder="Ex: 25"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Altura (cm)</Label>
                  <Input
                    type="number"
                    value={newPlayer.height}
                    onChange={(e) => setNewPlayer({ ...newPlayer, height: e.target.value })}
                    placeholder="Ex: 185"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>URL da Foto (Opcional)</Label>
                  <Input
                    value={newPlayer.photoUrl}
                    onChange={(e) => setNewPlayer({ ...newPlayer, photoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddPlayerModal(false);
              setSearchCPF("");
              setAthleteFound(null);
              setNewPlayer({
                name: "",
                position: "",
                number: "",
                age: "",
                height: "",
                photoUrl: ""
              });
            }}>
              Cancelar
            </Button>
            <Button onClick={addPlayerMode === 'cpf' ? handleAddAthleteFromCPF : handleAddManualPlayer}>
              <Save className="h-4 w-4 mr-2" />
              Adicionar ao Elenco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar Remover Jogador */}
      <AlertDialog open={showDeletePlayerConfirm} onOpenChange={setShowDeletePlayerConfirm}>
        <AlertDialogContent aria-describedby="delete-player-description">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Jogador</AlertDialogTitle>
            <AlertDialogDescription id="delete-player-description">
              Tem certeza que deseja remover <strong>{selectedPlayer?.name}</strong> do elenco?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeletePlayerConfirm(false);
              setSelectedPlayer(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlayer} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
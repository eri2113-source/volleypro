import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users, Plus, Edit2, Trash2, UserPlus, X, Save, Loader2 } from "lucide-react";
import { teamCategoryApi, userApi, invitationApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { formatHeight } from "../utils/formatters";
import { CATEGORIES, DEFAULT_SQUAD_NAMES, TeamSquad, TeamPlayer } from "../lib/teamCategories";

interface TeamCategoriesManagerProps {
  teamId: string;
  teamName: string;
}

export function TeamCategoriesManager({ teamId, teamName }: TeamCategoriesManagerProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showCreateSquadModal, setShowCreateSquadModal] = useState(false);
  const [showSquadPlayersModal, setShowSquadPlayersModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showDeleteSquadConfirm, setShowDeleteSquadConfirm] = useState(false);
  
  const [newCategory, setNewCategory] = useState("");
  const [newSquadName, setNewSquadName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSquad, setSelectedSquad] = useState<TeamSquad | null>(null);
  
  // Estados para adicionar jogadores
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
    loadCategories();
  }, [teamId]);

  async function loadCategories() {
    setLoading(true);
    try {
      const { categories: teamCategories } = await teamCategoryApi.getCategories(teamId);
      setCategories(teamCategories || []);
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) {
      toast.error("Selecione uma categoria");
      return;
    }

    try {
      await teamCategoryApi.createCategory(teamId, newCategory);
      toast.success(`Categoria ${newCategory} criada!`);
      setShowCreateCategoryModal(false);
      setNewCategory("");
      await loadCategories();
    } catch (error: any) {
      console.error('❌ Erro ao criar categoria:', error);
      toast.error(error.message || "Erro ao criar categoria");
    }
  }

  async function handleCreateSquad() {
    if (!newSquadName.trim() || !selectedCategoryId) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await teamCategoryApi.createSquad(teamId, selectedCategoryId, newSquadName);
      toast.success(`${newSquadName} criada!`);
      setShowCreateSquadModal(false);
      setNewSquadName("");
      setSelectedCategoryId("");
      await loadCategories();
    } catch (error: any) {
      console.error('❌ Erro ao criar equipe:', error);
      toast.error(error.message || "Erro ao criar equipe");
    }
  }

  async function handleDeleteSquad() {
    if (!selectedSquad) return;

    try {
      await teamCategoryApi.deleteSquad(teamId, selectedSquad.id);
      toast.success(`${selectedSquad.name} removida`);
      setShowDeleteSquadConfirm(false);
      setSelectedSquad(null);
      await loadCategories();
    } catch (error: any) {
      console.error('❌ Erro ao remover equipe:', error);
      toast.error(error.message || "Erro ao remover equipe");
    }
  }

  function openSquadPlayers(squad: TeamSquad) {
    setSelectedSquad(squad);
    setShowSquadPlayersModal(true);
  }

  async function handleSearchCPF() {
    if (!searchCPF.trim()) {
      toast.error("Digite um CPF válido");
      return;
    }

    setSearchingCPF(true);
    setAthleteFound(null);
    
    try {
      const athleteData = await userApi.searchByCPF(searchCPF);
      
      if (athleteData.userType !== 'athlete') {
        toast.error("CPF encontrado, mas não é de um atleta.");
        setAthleteFound(null);
        return;
      }
      
      setAthleteFound(athleteData);
      toast.success(`✅ Atleta encontrado: ${athleteData.name}!`);
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar atleta por CPF:', error);
      toast.error("Atleta não encontrado.");
      setAthleteFound(null);
    } finally {
      setSearchingCPF(false);
    }
  }

  async function handleAddAthleteFromCPF() {
    if (!athleteFound || !selectedSquad) return;

    try {
      // Enviar convite ao atleta
      await invitationApi.sendInvitation(athleteFound.id, 
        `Convite para fazer parte da ${selectedSquad.name} (${selectedSquad.categoryName}) de ${teamName}`
      );

      toast.success(`Convite enviado para ${athleteFound.name}!`, {
        description: "O atleta receberá o convite e poderá aceitar ou recusar."
      });
      
      setShowAddPlayerModal(false);
      setSearchCPF("");
      setAthleteFound(null);
    } catch (error: any) {
      console.error('❌ Erro ao enviar convite:', error);
      toast.error(error.message || "Erro ao enviar convite");
    }
  }

  async function handleAddManualPlayer() {
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number || !selectedSquad) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await teamCategoryApi.addPlayerToSquad(teamId, selectedSquad.id, {
        name: newPlayer.name,
        position: newPlayer.position,
        number: parseInt(newPlayer.number),
        age: newPlayer.age ? parseInt(newPlayer.age) : undefined,
        height: newPlayer.height ? parseInt(newPlayer.height) : undefined,
        photoUrl: newPlayer.photoUrl || undefined
      });

      toast.success(`${newPlayer.name} adicionado à ${selectedSquad.name}!`);
      
      setShowAddPlayerModal(false);
      setNewPlayer({ name: "", position: "", number: "", age: "", height: "", photoUrl: "" });
      await loadCategories();
      
      // Atualizar squad selecionada
      const updated = await teamCategoryApi.getSquad(teamId, selectedSquad.id);
      setSelectedSquad(updated.squad);
      
    } catch (error: any) {
      console.error('❌ Erro ao adicionar jogador:', error);
      toast.error(error.message || "Erro ao adicionar jogador");
    }
  }

  async function handleRemovePlayer(playerId: string) {
    if (!selectedSquad) return;

    try {
      // Atualizar estado local PRIMEIRO para evitar erro de removeChild
      const updatedPlayers = selectedSquad.players?.filter(p => p.id !== playerId) || [];
      setSelectedSquad({
        ...selectedSquad,
        players: updatedPlayers
      });

      // Depois chamar API
      await teamCategoryApi.removePlayerFromSquad(teamId, selectedSquad.id, playerId);
      toast.success("Jogador removido");
      
      // Recarregar dados completos em background
      await loadCategories();
      
    } catch (error: any) {
      console.error('❌ Erro ao remover jogador:', error);
      toast.error(error.message || "Erro ao remover jogador");
      // Reverter estado em caso de erro
      await loadCategories();
      const updated = await teamCategoryApi.getSquad(teamId, selectedSquad.id);
      setSelectedSquad(updated.squad);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  // Agrupar squads por categoria
  const squadsByCategory = categories.reduce((acc: any, cat: any) => {
    acc[cat.name] = cat.squads || [];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3>Categorias e Equipes</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie as categorias (Feminino/Masculino) e equipes (A, B, C...) do seu clube
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateCategoryModal(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
              <Button onClick={() => setShowCreateSquadModal(true)} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Equipe
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Categorias e Equipes */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Nenhuma categoria criada</h3>
            <p className="text-muted-foreground mb-4">
              Crie categorias (Feminino/Masculino) e depois adicione equipes
            </p>
            <Button onClick={() => setShowCreateCategoryModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Categoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3>{category.name}</h3>
                    <Badge variant="secondary">
                      {category.squads?.length || 0} equipes
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {category.squads?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma equipe nesta categoria
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.squads?.map((squad: TeamSquad) => (
                      <Card key={squad.id} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{squad.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {squad.players?.length || 0} jogadores
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSquad(squad);
                                setShowDeleteSquadConfirm(true);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button 
                            onClick={() => openSquadPlayers(squad)}
                            className="w-full"
                            size="sm"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Ver Elenco
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* Modal: Criar Categoria */}
      <Dialog open={showCreateCategoryModal} onOpenChange={setShowCreateCategoryModal}>
        <DialogContent aria-describedby="create-category-description">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription id="create-category-description">
              Escolha a categoria para organizar suas equipes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CATEGORIES.FEMALE}>Feminino</SelectItem>
                  <SelectItem value={CATEGORIES.MALE}>Masculino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateCategoryModal(false);
              setNewCategory("");
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCategory}>
              <Save className="h-4 w-4 mr-2" />
              Criar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Criar Equipe */}
      <Dialog open={showCreateSquadModal} onOpenChange={setShowCreateSquadModal}>
        <DialogContent aria-describedby="create-squad-description">
          <DialogHeader>
            <DialogTitle>Nova Equipe</DialogTitle>
            <DialogDescription id="create-squad-description">
              Crie uma nova equipe dentro de uma categoria
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nome da Equipe</Label>
              <Select value={newSquadName} onValueChange={setNewSquadName}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nome" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_SQUAD_NAMES.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Ou digite um nome personalizado:
              </p>
              <Input
                value={newSquadName}
                onChange={(e) => setNewSquadName(e.target.value)}
                placeholder="Ex: Equipe F, Equipe Sub-16..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateSquadModal(false);
              setNewSquadName("");
              setSelectedCategoryId("");
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSquad}>
              <Save className="h-4 w-4 mr-2" />
              Criar Equipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Ver Jogadores da Equipe */}
      <Dialog open={showSquadPlayersModal} onOpenChange={setShowSquadPlayersModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="squad-players-description">
          <DialogHeader>
            <DialogTitle>
              {selectedSquad?.name} - {selectedSquad?.categoryName}
            </DialogTitle>
            <DialogDescription id="squad-players-description">
              Elenco com {selectedSquad?.players?.length || 0} jogadores
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button onClick={() => setShowAddPlayerModal(true)} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Jogador
            </Button>

            {selectedSquad?.players?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum jogador nesta equipe
              </p>
            ) : (
              <div className="space-y-2">
                {selectedSquad?.players?.map((player: TeamPlayer) => (
                  <Card key={player.id} className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={player.photoUrl} alt={player.name} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{player.name}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              #{player.number}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {player.position}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right text-xs text-muted-foreground">
                          {player.height && <p>{formatHeight(player.height)}</p>}
                          {player.age && <p>{player.age} anos</p>}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePlayer(player.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => {
              setShowSquadPlayersModal(false);
              setSelectedSquad(null);
            }}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Adicionar Jogador */}
      <Dialog open={showAddPlayerModal} onOpenChange={setShowAddPlayerModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="add-player-description">
          <DialogHeader>
            <DialogTitle>Adicionar Jogador</DialogTitle>
            <DialogDescription id="add-player-description">
              Busque por CPF ou adicione manualmente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2 border-b pb-2">
              <Button
                variant={addPlayerMode === 'cpf' ? 'default' : 'ghost'}
                onClick={() => setAddPlayerMode('cpf')}
                size="sm"
              >
                Buscar por CPF
              </Button>
              <Button
                variant={addPlayerMode === 'manual' ? 'default' : 'ghost'}
                onClick={() => setAddPlayerMode('manual')}
                size="sm"
              >
                Adicionar Manualmente
              </Button>
            </div>

            {addPlayerMode === 'cpf' ? (
              <div className="space-y-4">
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
              </div>
            ) : (
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
                  <Label>Número *</Label>
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
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddPlayerModal(false);
              setSearchCPF("");
              setAthleteFound(null);
              setNewPlayer({ name: "", position: "", number: "", age: "", height: "", photoUrl: "" });
            }}>
              Cancelar
            </Button>
            <Button onClick={addPlayerMode === 'cpf' ? handleAddAthleteFromCPF : handleAddManualPlayer}>
              <Save className="h-4 w-4 mr-2" />
              {addPlayerMode === 'cpf' ? 'Enviar Convite' : 'Adicionar Jogador'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar Deletar Equipe */}
      <AlertDialog open={showDeleteSquadConfirm} onOpenChange={setShowDeleteSquadConfirm}>
        <AlertDialogContent aria-describedby="delete-squad-description">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Equipe</AlertDialogTitle>
            <AlertDialogDescription id="delete-squad-description">
              Tem certeza que deseja remover <strong>{selectedSquad?.name}</strong>?
              Todos os jogadores desta equipe serão removidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteSquadConfirm(false);
              setSelectedSquad(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSquad} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
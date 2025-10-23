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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import {
  Users,
  UserPlus,
  Search,
  X,
  Check,
  AlertCircle,
  Volleyball,
} from "lucide-react";
import { authApi, userApi, tournamentApi } from "../lib/api";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface BeachTournamentRegistrationProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  teamSize?: "duo" | "trio" | "quartet" | "quintet"; // Padrão: dupla
}

interface Player {
  id: string;
  name: string;
  avatar?: string;
  position?: string;
  userType?: string;
}

export function BeachTournamentRegistration({
  open,
  onClose,
  tournamentId,
  tournamentName,
  teamSize = "duo",
}: BeachTournamentRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<Player[]>([]);
  const [teamName, setTeamName] = useState("");
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [dbAthletes, setDbAthletes] = useState<number | null>(null); // Para mostrar quantos atletas tem no banco

  // Determinar número de jogadores necessários
  const requiredPlayers =
    teamSize === "duo" ? 2 :
    teamSize === "trio" ? 3 :
    teamSize === "quartet" ? 4 : 5;

  const partnersNeeded = requiredPlayers - 1; // -1 porque o usuário atual já conta

  useEffect(() => {
    if (open) {
      loadCurrentUser();
      checkDatabaseAthletes(); // Verificar quantos atletas tem no banco
      loadRegisteredPlayers(); // 🆕 Carregar jogadores inscritos
    }
  }, [open]);

  // 🆕 Carregar jogadores que JÁ se inscreveram individualmente neste torneio
  async function loadRegisteredPlayers() {
    try {
      console.log("📋 Carregando jogadores inscritos no torneio...");
      
      const session = await authApi.getSession();
      if (!session?.access_token) {
        console.log("⚠️ Sem sessão válida");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/registered-players`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("❌ Erro ao buscar jogadores inscritos");
        return;
      }

      const data = await response.json();
      console.log("✅ Jogadores inscritos:", data);

      // Filtrar jogadores: remover o usuário atual e os já selecionados
      const availablePlayers = (data.players || [])
        .filter((player: any) => 
          player.userId !== currentUser?.id &&
          !selectedPartners.find(p => p.id === player.userId)
        )
        .map((player: any) => ({
          id: player.userId,
          name: player.name,
          avatar: player.avatar,
          position: player.position || "Atleta",
          userType: "athlete",
        }));

      setSearchResults(availablePlayers);
      setDbAthletes(data.available || 0); // Mostrar quantos disponíveis

      if (availablePlayers.length === 0) {
        toast.info("Nenhum atleta disponível ainda", {
          description: "Os atletas precisam se inscrever individualmente primeiro",
        });
      } else {
        toast.success(`${availablePlayers.length} atleta(s) disponível(is)!`, {
          description: "Escolha seus parceiros entre os inscritos",
        });
      }
    } catch (error) {
      console.error("❌ Erro ao carregar jogadores inscritos:", error);
    }
  }

  // Verificar quantos atletas existem no banco REAL
  async function checkDatabaseAthletes() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/debug/athletes-count`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Banco de dados conectado! ${data.athletes} atletas cadastrados`);
      }
    } catch (error) {
      console.log("⚠️ Não foi possível conectar ao banco real");
    }
  }

  async function loadCurrentUser() {
    try {
      const session = await authApi.getSession();
      if (!session?.user?.id) {
        toast.error("Você precisa estar logado");
        return;
      }

      console.log("👤 Carregando perfil do usuário:", session.user.id);

      const profile = await userApi.getUserProfile(session.user.id);
      
      if (!profile) {
        console.error("❌ Perfil retornou vazio");
        toast.error("Perfil não encontrado. Por favor, complete seu cadastro.");
        return;
      }

      console.log("✅ Perfil carregado:", profile);

      setCurrentUser({
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        position: profile.position || "Atleta",
        userType: profile.userType,
      });
    } catch (error) {
      console.error("❌ Erro ao carregar usuário:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao carregar perfil: ${errorMessage}`, {
        description: "Tente recarregar a página ou fazer login novamente"
      });
    }
  }

  // Buscar jogadores REAIS do banco de dados
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Digite um nome para buscar");
      return;
    }

    // Filtrar a lista já carregada por nome
    const filtered = searchResults.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      toast.info(`Nenhum atleta encontrado com "${searchQuery}"`, {
        description: "Tente buscar por outro nome",
      });
    } else {
      toast.success(`${filtered.length} atleta(s) encontrado(s)`);
    }
  };

  // Recarregar lista completa
  const handleShowAll = async () => {
    setSearchQuery("");
    loadRegisteredPlayers();
  };

  // Adicionar parceiro
  const handleAddPartner = (player: Player) => {
    if (selectedPartners.length >= partnersNeeded) {
      toast.error(`Você só pode adicionar ${partnersNeeded} parceiro(s)`);
      return;
    }

    if (selectedPartners.find((p) => p.id === player.id)) {
      toast.error("Este jogador já foi adicionado");
      return;
    }

    if (player.id === currentUser?.id) {
      toast.error("Você não pode adicionar a si mesmo");
      return;
    }

    setSelectedPartners([...selectedPartners, player]);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`${player.name} adicionado à ${getTeamTypeLabel().toLowerCase()}!`);
  };

  // Remover parceiro
  const handleRemovePartner = (playerId: string) => {
    setSelectedPartners(selectedPartners.filter((p) => p.id !== playerId));
    toast.info("Parceiro removido");
  };

  // Inscrever equipe REAL no banco de dados
  const handleRegister = async () => {
    if (!teamName.trim()) {
      toast.error(`Digite um nome para a ${getTeamTypeLabel().toLowerCase()}`);
      return;
    }

    if (selectedPartners.length !== partnersNeeded) {
      toast.error(`Você precisa adicionar ${partnersNeeded} parceiro(s)`);
      return;
    }

    if (!currentUser) {
      toast.error("Erro ao identificar usuário. Faça login novamente.");
      return;
    }

    setLoading(true);
    try {
      console.log("📝 Inscrevendo equipe no torneio...");

      const session = await authApi.getSession();
      if (!session?.access_token) {
        toast.error("Você precisa estar logado");
        return;
      }

      // Montar equipe com todos os jogadores
      const allPlayers = [currentUser, ...selectedPartners];

      // Criar objeto de registro
      const registrationData = {
        tournamentId,
        teamName,
        players: allPlayers.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          position: p.position,
        })),
        teamSize,
        captainId: currentUser.id,
      };

      console.log("🏖️ Dados da inscrição:", registrationData);

      // Enviar para o backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/register-beach-team`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(registrationData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao inscrever no torneio");
      }

      const result = await response.json();
      console.log("✅ Inscrição realizada:", result);

      toast.success("🏖️ Equipe inscrita com sucesso!", {
        description: `${teamName} está registrado no torneio ${tournamentName}!`,
      });

      onClose();

      // Reset
      setTeamName("");
      setSelectedPartners([]);
      setSearchQuery("");
      setSearchResults([]);

      // Recarregar página para atualizar lista de inscritos
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("❌ Erro ao inscrever:", error);
      toast.error(error.message || "Erro ao inscrever no torneio");
    } finally {
      setLoading(false);
    }
  };

  const getTeamTypeLabel = () => {
    switch (teamSize) {
      case "duo": return "Dupla";
      case "trio": return "Trio";
      case "quartet": return "Quarteto";
      case "quintet": return "Quinteto";
      default: return "Dupla";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="beach-tournament-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volleyball className="h-5 w-5 text-primary" />
            Inscrever {getTeamTypeLabel()} no Torneio
          </DialogTitle>
          <DialogDescription id="beach-tournament-description">
            {tournamentName} - Vôlei de Praia - Monte sua {getTeamTypeLabel().toLowerCase()} e participe do torneio!
          </DialogDescription>
        </DialogHeader>

        {/* Mostrar quantos atletas existem no banco */}
        {dbAthletes !== null && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              ✅ {dbAthletes} atletas disponíveis no banco de dados
            </Badge>
          </div>
        )}

        <div className="space-y-6">
          {/* Usuário Atual (Capitão) */}
          {currentUser && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Você (Capitão)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.position}
                    </p>
                  </div>
                  <Badge variant="default" className="ml-auto">Capitão</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nome da Equipe */}
          <div className="space-y-2">
            <Label htmlFor="teamName">
              Nome da {getTeamTypeLabel()} *
            </Label>
            <Input
              id="teamName"
              placeholder={`Ex: Os Campeões, Praia Team, etc.`}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Escolha um nome criativo para sua {getTeamTypeLabel().toLowerCase()}
            </p>
          </div>

          {/* Buscar Parceiros */}
          <div className="space-y-2">
            <Label htmlFor="search">
              Buscar Parceiro{partnersNeeded > 1 ? "s" : ""} ({selectedPartners.length}/{partnersNeeded})
            </Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Digite o nome do atleta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                disabled={loading || selectedPartners.length >= partnersNeeded}
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim() || selectedPartners.length >= partnersNeeded}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button
                onClick={handleShowAll}
                disabled={loading || selectedPartners.length >= partnersNeeded}
              >
                Ver Todos
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Apenas atletas cadastrados no sistema aparecerão nos resultados
            </p>
          </div>

          {/* Resultados da Busca */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Resultados da Busca ({searchResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {searchResults.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>
                        {player.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.position}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddPartner(player)}
                      disabled={selectedPartners.length >= partnersNeeded}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Parceiros Selecionados */}
          {selectedPartners.length > 0 && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Parceiro{selectedPartners.length > 1 ? "s" : ""} Selecionado{selectedPartners.length > 1 ? "s" : ""} ({selectedPartners.length}/{partnersNeeded})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={partner.avatar} />
                      <AvatarFallback>
                        {partner.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {partner.position}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemovePartner(partner.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Aviso sobre composição */}
          {selectedPartners.length < partnersNeeded && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Ainda faltam {partnersNeeded - selectedPartners.length} parceiro(s)
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Busque e adicione {partnersNeeded - selectedPartners.length === 1 ? "mais um atleta" : `mais ${partnersNeeded - selectedPartners.length} atletas`} para completar sua {getTeamTypeLabel().toLowerCase()}
                </p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleRegister}
              disabled={
                loading ||
                !teamName.trim() ||
                selectedPartners.length !== partnersNeeded
              }
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                <>
                  <Volleyball className="h-4 w-4 mr-2" />
                  Inscrever {getTeamTypeLabel()}
                </>
              )}
            </Button>
          </div>

          {/* Resumo */}
          {teamName && selectedPartners.length === partnersNeeded && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium mb-2">📋 Resumo da Inscrição:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Nome:</strong> {teamName}</li>
                <li>• <strong>Torneio:</strong> {tournamentName}</li>
                <li>• <strong>Tipo:</strong> {getTeamTypeLabel()}</li>
                <li>• <strong>Jogadores:</strong> {requiredPlayers}</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
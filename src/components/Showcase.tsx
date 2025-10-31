import { MapPin, UserPlus, CheckCircle2, Trophy, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { userApi, invitationApi, authApi, followApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { formatHeight } from "../utils/formatters";

interface ShowcaseProps {
  onSelectAthlete: (id: number) => void;
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
}

// Mapeamento de ícones para cada posição
const positionIcons: Record<string, string> = {
  "Todos": "🏐",
  "Levantador": "🙌",
  "Ponteiro": "⚡",
  "Central": "🏔️",
  "Oposto": "💪",
  "Líbero": "🛡️"
};

const positions = ["Todos", "Levantador", "Ponteiro", "Central", "Oposto", "Líbero"];

export function Showcase({ onSelectAthlete }: ShowcaseProps) {
  const [selectedPosition, setSelectedPosition] = useState("Todos");
  const [athletes, setAthletes] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAthletes();
    checkAuth();
    loadCurrentUser();
    loadFollowingIds();
  }, [selectedPosition]);

  async function checkAuth() {
    try {
      const session = await authApi.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      setIsAuthenticated(false);
    }
  }

  async function loadCurrentUser() {
    try {
      const session = await authApi.getSession();
      if (session) {
        const userData = await userApi.getCurrentUser();
        setCurrentUser(userData.profile);
      }
    } catch (error) {
      console.error("❌ Error loading current user:", error);
    }
  }

  async function loadFollowingIds() {
    try {
      const session = await authApi.getSession();
      if (session) {
        const { followingIds: ids } = await followApi.getFollowingIds();
        setFollowingIds(new Set(ids || []));
      }
    } catch (error) {
      console.error("❌ Error loading following IDs:", error);
    }
  }

  async function loadAthletes() {
    setIsLoading(true);
    try {
      console.log('🏐 Carregando atletas livres...');
      const filters: any = { type: 'athlete' };
      if (selectedPosition !== 'Todos') {
        filters.position = selectedPosition;
      }
      const { users } = await userApi.getUsers(filters);
      
      // Filter only free agents (sem time atual)
      const freeAgents = (users || []).filter((u: any) => {
        // Verificar se REALMENTE tem time (não apenas string vazia ou undefined)
        const currentTeam = u.currentTeam;
        const current_team = u.current_team;
        const team = u.team;
        
        // Só considera "tem time" se for string não vazia
        const hasTeam = (currentTeam && currentTeam.trim()) || 
                        (current_team && current_team.trim()) || 
                        (team && team.trim());
        
        // Log detalhado para debug
        console.log(`🔍 ${u.name}:`, {
          currentTeam: currentTeam || 'null',
          current_team: current_team || 'null',
          team: team || 'null',
          hasTeam: !!hasTeam,
          status: hasTeam ? '🔒 COM TIME' : '✅ LIVRE'
        });
        
        if (hasTeam) {
          console.log(`🔒 Atleta ${u.name} já tem time: "${hasTeam}" - REMOVIDO da vitrine`);
        }
        
        return !hasTeam;
      });
      
      const withTeam = (users?.length || 0) - freeAgents.length;
      console.log(`✅ Vitrine: ${freeAgents.length} livres | ${withTeam} com time | Total: ${users?.length || 0}`);
      
      setAthletes(freeAgents);
    } catch (error) {
      console.error("❌ Error loading athletes:", error);
      setAthletes([]);
      toast.error("Erro ao carregar atletas livres");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleInvite() {
    if (!selectedAthleteId) return;

    setLoading(true);
    try {
      await invitationApi.sendInvitation(selectedAthleteId, inviteMessage);
      toast.success("Convite enviado com sucesso! 🏐");
      setShowInviteModal(false);
      setInviteMessage("");
      setSelectedAthleteId(null);
    } catch (error: any) {
      console.error("❌ Erro ao enviar convite:", error);
      
      // Mensagem mais clara sobre o erro
      let errorMsg = error.message || "Erro ao enviar convite";
      if (error.message?.includes('CPF')) {
        errorMsg = "❌ Este atleta precisa cadastrar o CPF no perfil antes de receber convites";
      } else if (error.message?.includes('already has a team')) {
        errorMsg = "⚠️ Este atleta já faz parte de outro time";
      }
      
      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  function openInviteModal(athleteId: string) {
    if (!isAuthenticated) {
      toast.error("Faça login para convocar atletas");
      return;
    }

    if (currentUser?.userType !== 'team') {
      toast.error("Apenas times podem convocar atletas");
      return;
    }

    setSelectedAthleteId(athleteId);
    setShowInviteModal(true);
  }

  async function handleToggleFreeAgent() {
    if (!isAuthenticated) {
      toast.error("Faça login para se disponibilizar no mercado");
      return;
    }

    if (currentUser?.userType !== 'athlete') {
      toast.error("Apenas atletas podem se disponibilizar no mercado");
      return;
    }

    try {
      const newStatus = !currentUser?.freeAgent;
      await userApi.toggleFreeAgent(newStatus);
      toast.success(
        newStatus 
          ? "✅ Você está agora disponível no mercado!" 
          : "❌ Você foi removido do mercado"
      );
      await loadCurrentUser();
      await loadAthletes();
    } catch (error: any) {
      console.error("Error toggling free agent status:", error);
      toast.error(error.message || "Erro ao atualizar status");
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-primary">Vitrine de Jogadores Livres</h1>
          <p className="text-muted-foreground">
            Encontre os melhores atletas disponíveis no mercado
          </p>
        </div>
        
        {/* Botão de disponibilidade para atletas */}
        {isAuthenticated && currentUser?.userType === 'athlete' && (
          <Button
            onClick={handleToggleFreeAgent}
            variant={currentUser?.freeAgent ? "destructive" : "default"}
            className="gap-2"
          >
            {currentUser?.freeAgent ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Remover do Mercado
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Disponibilizar no Mercado
              </>
            )}
          </Button>
        )}
      </div>

      {/* Filtros por Posição */}
      <div className="bg-card rounded-lg border p-4">
        <p className="mb-3">Filtrar por Posição</p>
        <div className="flex flex-wrap gap-2">
          {positions.map((position) => (
            <Button
              key={position}
              variant={selectedPosition === position ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPosition(position)}
              className={`gap-2 ${
                selectedPosition === position
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-lg">{positionIcons[position]}</span>
              {position}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && athletes.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">Nenhum atleta disponível</h3>
            <p className="text-muted-foreground mb-4">
              {selectedPosition === "Todos"
                ? "Não há atletas livres no momento"
                : `Não há ${selectedPosition.toLowerCase()}s disponíveis no momento`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grid de Atletas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete) => (
          <Card key={athlete.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardContent className="p-0">
              {/* Imagem do Atleta */}
              <div 
                className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 cursor-pointer group"
                onClick={() => onSelectAthlete(athlete.id)}
              >
                <Avatar className="w-full h-full rounded-none transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={athlete.photoUrl || athlete.photo_url}
                    alt={athlete.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none text-6xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    {athlete.name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Badge Verificado */}
                {athlete.verified && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 text-white gap-1 shadow-lg">
                      <CheckCircle2 className="h-3 w-3" />
                      Verificado
                    </Badge>
                  </div>
                )}

                {/* Overlay com Nome e Seguidores */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                  <h3 className="text-white mb-1 hover:text-primary transition-colors">{athlete.name}</h3>
                  <div className="flex items-center gap-1 text-white/90 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{(athlete.followers || 0).toLocaleString('pt-BR')} seguidores</span>
                  </div>
                </div>
              </div>

              {/* Informações do Atleta */}
              <div className="p-5 space-y-4">
                {/* Badges de Informação */}
                <div className="flex flex-wrap gap-2">
                  {athlete.age && (
                    <Badge variant="secondary" className="text-xs">
                      {athlete.age} anos
                    </Badge>
                  )}
                  {athlete.position && (
                    <Badge variant="secondary" className="text-xs">
                      {athlete.position}
                    </Badge>
                  )}
                  {athlete.city && (
                    <Badge variant="secondary" className="text-xs">
                      {athlete.city}
                    </Badge>
                  )}
                </div>

                {/* Localização */}
                {athlete.city && (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{athlete.city}</span>
                  </div>
                )}

                {/* Descrição */}
                {athlete.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {athlete.bio}
                  </p>
                )}

                {/* Times Anteriores */}
                {athlete.teamHistory && Array.isArray(athlete.teamHistory) && athlete.teamHistory.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm">Times Anteriores:</p>
                    <div className="space-y-1">
                      {athlete.teamHistory.slice(0, 2).map((team: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Trophy className="h-3 w-3 text-primary" />
                          <span className="text-muted-foreground">
                            {team.name || team} {team.year && `- ${team.year}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conquistas */}
                {athlete.achievements && Array.isArray(athlete.achievements) && athlete.achievements.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm">Conquistas:</p>
                    <div className="space-y-1">
                      {athlete.achievements.slice(0, 2).map((achievement: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          <span className="text-muted-foreground line-clamp-1">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Altura */}
                {athlete.height && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Altura:</span>
                    <span>{formatHeight(athlete.height)}</span>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => onSelectAthlete(athlete.id)}
                    className="w-full"
                  >
                    Ver Perfil Completo
                  </Button>
                  <Button
                    onClick={() => openInviteModal(athlete.id)}
                    disabled={!isAuthenticated || currentUser?.userType !== 'team'}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convocar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Convite */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent aria-describedby="invite-description">
          <DialogHeader>
            <DialogTitle>Convocar Atleta</DialogTitle>
            <DialogDescription id="invite-description">
              Envie uma mensagem para este atleta convidando-o para seu time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Digite sua mensagem de convite..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              O atleta receberá sua proposta e poderá aceitá-la ou recusá-la.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInvite}
              disabled={loading || !inviteMessage.trim()}
            >
              {loading ? "Enviando..." : "Enviar Convite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";
import {
  Volleyball,
  UserCheck,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { authApi } from "../lib/api";
import { projectId } from "../utils/supabase/info";

interface BeachTournamentIndividualRegistrationProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  onRegistrationComplete?: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  position?: string;
  userType?: string;
}

export function BeachTournamentIndividualRegistration({
  open,
  onClose,
  tournamentId,
  tournamentName,
  onRegistrationComplete,
}: BeachTournamentIndividualRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredPlayers, setRegisteredPlayers] = useState<any[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    if (open) {
      loadUserAndStatus();
    }
  }, [open, tournamentId]);

  async function loadUserAndStatus() {
    try {
      setLoading(true);
      const session = await authApi.getSession();
      
      if (!session?.user?.id) {
        toast.error("Você precisa estar logado");
        return;
      }

      // Buscar perfil do usuário
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/users/${session.user.id}/profile`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const profile = await response.json();
        setCurrentUser({
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          position: profile.position || "Atleta",
          userType: profile.userType,
        });
      }

      // Verificar se já está inscrito
      await checkRegistrationStatus(session.access_token);
      
      // Buscar lista de jogadores inscritos
      await loadRegisteredPlayers(session.access_token);
      
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
      toast.error("Erro ao carregar informações");
    } finally {
      setLoading(false);
    }
  }

  async function checkRegistrationStatus(accessToken: string) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/check-registration`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsRegistered(data.isRegistered);
      }
    } catch (error) {
      console.error("Erro ao verificar inscrição:", error);
    }
  }

  async function loadRegisteredPlayers(accessToken: string) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/registered-players`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRegisteredPlayers(data.players || []);
        setTotalPlayers(data.total || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar jogadores inscritos:", error);
    }
  }

  async function handleRegister() {
    if (!currentUser) {
      toast.error("Usuário não encontrado");
      return;
    }

    setLoading(true);
    try {
      const session = await authApi.getSession();
      
      if (!session?.access_token) {
        toast.error("Você precisa estar logado");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/register-individual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao se inscrever");
      }

      const result = await response.json();
      console.log("✅ Inscrição individual realizada:", result);

      toast.success("🏖️ Inscrição realizada com sucesso!", {
        description: `Agora você pode formar sua equipe com outros atletas inscritos!`,
      });

      setIsRegistered(true);
      
      // Recarregar lista de jogadores
      await loadRegisteredPlayers(session.access_token);

      // Notificar componente pai
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error("❌ Erro ao se inscrever:", error);
      toast.error(error.message || "Erro ao se inscrever no torneio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="beach-individual-registration-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volleyball className="h-5 w-5 text-primary" />
            Inscrever-me no Torneio
          </DialogTitle>
          <DialogDescription id="beach-individual-registration-description">
            {tournamentName} - Vôlei de Praia - Inscreva-se individualmente para participar!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Usuário */}
          {currentUser && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Seu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.position}
                    </p>
                  </div>
                  {isRegistered && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Inscrito
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status da Inscrição */}
          {!isRegistered ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Como funciona a inscrição?
                  </p>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside">
                    <li>Clique em "Me Inscrever no Torneio" abaixo</li>
                    <li>Após inscrito, você aparecerá na lista de atletas disponíveis</li>
                    <li>Use o botão "Formar Equipe" para escolher seus parceiros</li>
                    <li>Seus parceiros também precisam estar inscritos!</li>
                  </ol>
                </div>
              </div>

              <Button
                onClick={handleRegister}
                disabled={loading || isRegistered}
                className="w-full h-12"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Inscrevendo...
                  </>
                ) : (
                  <>
                    <Volleyball className="h-5 w-5 mr-2" />
                    Me Inscrever no Torneio
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Você está inscrito neste torneio!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Agora você pode formar sua equipe com outros atletas inscritos. 
                    Use o botão "Formar Dupla/Trio/etc" na página do torneio.
                  </p>
                </div>
              </div>

              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          )}

          {/* Lista de Jogadores Inscritos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Atletas Inscritos ({totalPlayers})
                </span>
                <Badge variant="outline">
                  {registeredPlayers.length} disponíveis
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registeredPlayers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">
                    Nenhum atleta disponível ainda.
                    <br />
                    Seja o primeiro a se inscrever!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {registeredPlayers.map((player: any) => (
                    <div
                      key={player.userId}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
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
                      {player.hasTeam && (
                        <Badge variant="secondary" className="text-xs">
                          Em equipe
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

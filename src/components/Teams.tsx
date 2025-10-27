import { Search, CheckCircle2, Users, Trophy, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { userApi, authApi, followApi } from "../lib/api";
import { toast } from "sonner@2.0.3";

interface TeamsProps {
  onSelectTeam: (id: number) => void;
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
}

export function Teams({ onSelectTeam }: TeamsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const session = await authApi.getSession();
      setIsAuthenticated(!!session);
      // Pega o ID do usuário logado para filtrar da lista
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
        console.log('👤 Usuário logado ID:', session.user.id);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }
  }

  async function loadTeams() {
    setIsLoading(true);
    try {
      console.log('🔍 Carregando times...');
      const { users } = await userApi.getUsers({ type: 'team' });
      console.log('✅ Times carregados:', users?.length || 0, users);
      setTeams(users || []);
    } catch (error) {
      console.error("❌ Error loading teams:", error);
      setTeams([]);
      toast.error("Erro ao carregar times");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFollow(userId: string) {
    if (!isAuthenticated) {
      toast.error("Faça login para seguir times");
      return;
    }

    try {
      await followApi.toggleFollow(userId);
      toast.success("Seguindo time!");
      loadTeams();
    } catch (error: any) {
      console.error("Error following team:", error);
      toast.error(error.message || "Erro ao seguir time");
    }
  }

  const filteredTeams = teams.filter((team) => {
    if (!team) return false;
    
    // 🎯 NOVO: Exclui o time do próprio usuário logado
    if (currentUserId && team.id.toString() === currentUserId) {
      console.log('🚫 Excluindo meu próprio time da lista:', team.name);
      return false;
    }
    
    return (
      team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Equipes</h1>
          <p className="text-muted-foreground text-sm">Descubra equipes de todo o Brasil</p>
        </div>
        <Badge className="bg-gradient-to-r from-secondary to-primary text-white">{teams.length} equipes</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipes por nome ou cidade..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando times...</p>
          </div>
        </div>
      ) : filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-6xl">🏐</div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Nenhuma equipe encontrada</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Seja a primeira equipe a se cadastrar no VolleyPro!'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card 
              key={team.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => {
                console.log('🏐 Time clicado:', team.id, team.name);
                onSelectTeam(team.id);
              }}
            >
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {team?.name 
                      ? team.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'TM'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3>{team?.name || 'Time'}</h3>
                    {team?.verified && (
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3" />
                    {team?.city || 'Não informado'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fundado em:</span>
                <span>{team?.founded || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>Títulos:</span>
                </div>
                <span>{team?.championships || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Jogadores:</span>
                </div>
                <span>{Array.isArray(team.players) ? team.players.length : 0}</span>
              </div>
              <div className="text-muted-foreground text-sm">
                {(team.followers || 0).toLocaleString()} seguidores
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(team.id.toString());
                  }}
                  disabled={!isAuthenticated}
                >
                  Seguir
                </Button>
                <Button size="sm" className="flex-1">
                  Ver perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}
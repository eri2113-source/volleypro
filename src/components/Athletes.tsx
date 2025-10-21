import { Search, CheckCircle2, MapPin, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { userApi, followApi, authApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { formatHeight } from "../utils/formatters";

interface AthletesProps {
  onSelectAthlete: (id: number) => void;
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
}

export function Athletes({ onSelectAthlete }: AthletesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [athletes, setAthletes] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadAthletes();
    checkAuth();
  }, [positionFilter]);

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

  async function loadAthletes() {
    setIsLoading(true);
    try {
      const filters: any = { type: 'athlete' };
      if (positionFilter !== 'all') {
        filters.position = positionFilter;
      }
      const { users } = await userApi.getUsers(filters);
      
      // Debug: Verificar dados dos atletas
      console.log('📊 Atletas carregados:', users);
      if (users && users.length > 0) {
        console.log('📸 Exemplo de atleta:', users[0]);
        console.log('📸 Campos de foto disponíveis:', {
          photo_url: users[0].photo_url,
          photoUrl: users[0].photoUrl,
          avatar_url: users[0].avatar_url,
          avatarUrl: users[0].avatarUrl,
          profile_picture: users[0].profile_picture,
          picture: users[0].picture
        });
      }
      
      setAthletes(users || []);
    } catch (error) {
      console.error("Error loading athletes:", error);
      setAthletes([]);
      toast.error("Erro ao carregar atletas");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFollow(userId: string) {
    if (!isAuthenticated) {
      toast.error("Faça login para seguir atletas");
      return;
    }

    try {
      await followApi.toggleFollow(userId);
      toast.success("Seguindo atleta!");
      loadAthletes();
    } catch (error: any) {
      console.error("Error following athlete:", error);
      toast.error(error.message || "Erro ao seguir atleta");
    }
  }

  const filteredAthletes = athletes.filter((athlete) => {
    if (!athlete || !athlete.name) return false;
    
    // 🎯 NOVO: Exclui o próprio usuário logado da lista
    if (currentUserId && athlete.id.toString() === currentUserId) {
      console.log('🚫 Excluindo meu próprio perfil da lista:', athlete.name);
      return false;
    }
    
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const positions = Array.from(new Set(athletes.map(a => a.position).filter(Boolean)));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Atletas</h1>
          <p className="text-muted-foreground text-sm">Conecte-se com os melhores do vôlei</p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-secondary text-white">{athletes.length} atletas</Badge>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar atletas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por posição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as posições</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando atletas...</p>
          </div>
        </div>
      ) : filteredAthletes.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-6xl">🏐</div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Nenhum atleta encontrado</h3>
              <p className="text-muted-foreground">
                {searchQuery || positionFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Seja o primeiro atleta a se cadastrar no VolleyPro!'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAthletes.map((athlete) => (
          <Card 
            key={athlete.id} 
            className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary/50" 
            onClick={() => onSelectAthlete(athlete.id)}
          >
            <CardContent className="p-0">
              {/* Imagem do Atleta com Overlay */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10">
                <Avatar className="w-full h-full rounded-none">
                  {(athlete.photo_url || athlete.photoUrl || athlete.avatar_url || athlete.avatarUrl || athlete.profile_picture || athlete.picture) && (
                    <AvatarImage 
                      src={
                        athlete.photo_url || 
                        athlete.photoUrl || 
                        athlete.avatar_url || 
                        athlete.avatarUrl || 
                        athlete.profile_picture || 
                        athlete.picture
                      }
                      alt={athlete.name}
                      className="object-cover"
                      onError={(e) => {
                        console.error('❌ Erro ao carregar imagem do atleta:', athlete.name, {
                          photo_url: athlete.photo_url,
                          photoUrl: athlete.photoUrl,
                          avatar_url: athlete.avatar_url,
                          avatarUrl: athlete.avatarUrl
                        });
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('✅ Imagem carregada com sucesso:', athlete.name);
                      }}
                    />
                  )}
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

                {/* Badge "Disponível" se for free agent */}
                {athlete.freeAgent && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white gap-1 shadow-lg">
                      Disponível
                    </Badge>
                  </div>
                )}

                {/* Overlay com Nome e Seguidores */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                  <h3 className="text-white mb-1">{athlete.name}</h3>
                  <div className="flex items-center gap-1 text-white/90 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{(athlete.followers || 0).toLocaleString('pt-BR')} seguidores</span>
                  </div>
                </div>
              </div>

              {/* Informações do Atleta */}
              <div className="p-4 space-y-3">
                {/* Badges de Info */}
                <div className="flex flex-wrap gap-2">
                  {athlete.position && (
                    <Badge variant="secondary" className="text-xs">
                      {athlete.position}
                    </Badge>
                  )}
                  {athlete.age && (
                    <Badge variant="secondary" className="text-xs">
                      {athlete.age} anos
                    </Badge>
                  )}
                  {athlete.city && (
                    <Badge variant="secondary" className="text-xs">
                      {athlete.city}
                    </Badge>
                  )}
                </div>

                {/* Informações */}
                <div className="space-y-2 text-sm">
                  {athlete.height && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Altura:</span>
                      <span>{formatHeight(athlete.height)}</span>
                    </div>
                  )}
                  {athlete.team && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="truncate ml-2">{athlete.team}</span>
                    </div>
                  )}
                  {!athlete.team && (
                    <div className="flex items-center justify-center gap-1 text-orange-500 py-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">Livre no mercado</span>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(athlete.id.toString());
                    }}
                    disabled={!isAuthenticated}
                  >
                    Seguir
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}
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
      
      console.log('🔍 Carregando atletas com filtros:', filters);
      const { users } = await userApi.getUsers(filters);
      
      // Debug: Verificar dados dos atletas
      console.log('📊 Atletas retornados da API:', users?.length || 0);
      if (users && users.length > 0) {
        console.log('📸 Exemplo de atleta:', users[0]);
        console.log('📍 Posições disponíveis:', users.map((u: any) => u.position).filter(Boolean));
      } else {
        console.warn('⚠️ Nenhum atleta encontrado no banco de dados');
      }
      
      setAthletes(users || []);
    } catch (error) {
      console.error("❌ Erro ao carregar atletas:", error);
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
    
    // 🔍 Busca em nome, nickname, posição e cidade
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      athlete.name?.toLowerCase().includes(searchLower) ||
      athlete.nickname?.toLowerCase().includes(searchLower) ||
      athlete.position?.toLowerCase().includes(searchLower) ||
      athlete.city?.toLowerCase().includes(searchLower);
    
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
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold">Nenhum atleta encontrado</h3>
              <p className="text-muted-foreground">
                {athletes.length === 0 
                  ? 'Ainda não há atletas cadastrados no sistema. Seja o primeiro!' 
                  : searchQuery || positionFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Tente ajustar os filtros'}
              </p>
              {(searchQuery || positionFilter !== 'all') && (
                <div className="text-sm text-muted-foreground space-y-1">
                  {searchQuery && <p>🔍 Buscando por: "{searchQuery}"</p>}
                  {positionFilter !== 'all' && <p>📍 Filtrando por posição: {positionFilter}</p>}
                  <p className="mt-2 text-primary cursor-pointer hover:underline" onClick={() => {
                    setSearchQuery('');
                    setPositionFilter('all');
                  }}>
                    Limpar filtros
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredAthletes.map((athlete) => (
          <Card 
            key={athlete.id} 
            className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all cursor-pointer group" 
            onClick={() => onSelectAthlete(athlete.id)}
          >
            <CardContent className="p-0">
              {/* Imagem do Atleta - COMPACTO */}
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
                    />
                  )}
                  <AvatarFallback className="rounded-none text-3xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    {athlete.name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Badge Verificado - MENOR */}
                {athlete.verified && (
                  <div className="absolute top-1 right-1">
                    <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                      <CheckCircle2 className="h-2 w-2" />
                    </Badge>
                  </div>
                )}

                {/* Badge "Disponível" - MENOR */}
                {athlete.freeAgent && (
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-orange-500 text-white text-xs px-1 py-0">
                      Livre
                    </Badge>
                  </div>
                )}

                {/* Overlay com Nome - COMPACTO */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <h3 className="text-white text-xs font-semibold line-clamp-2 mb-0.5">{athlete.name}</h3>
                  <div className="flex items-center gap-0.5 text-white/80 text-xs">
                    <Users className="h-2 w-2" />
                    <span>{(athlete.followers || 0).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Info Compacta */}
              <div className="p-2 space-y-1 bg-muted/30">
                {/* Posição */}
                {athlete.position && (
                  <div className="text-center">
                    <Badge className="bg-primary text-white text-xs px-2 py-0">
                      {athlete.position}
                    </Badge>
                  </div>
                )}
                
                {/* Altura e Idade */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  {athlete.height && <span>{formatHeight(athlete.height)}</span>}
                  {athlete.height && athlete.age && <span>•</span>}
                  {athlete.age && <span>{athlete.age}a</span>}
                </div>
                
                {/* Cidade */}
                {athlete.city && (
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-2 w-2" />
                    <span className="truncate">{athlete.city}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}
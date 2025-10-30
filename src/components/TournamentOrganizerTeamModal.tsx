import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X, UserPlus, Search, Trash2, Shield, Crown, Users, User, Trophy, Flag, Heart } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Card, CardContent } from "./ui/card";
import { projectId } from '../utils/supabase/info';

interface Organizer {
  id: string;
  userId: string;
  name: string;
  email?: string;
  cpf?: string;
  type?: 'team' | 'fan' | 'athlete' | 'referee' | 'other';
  role: 'creator' | 'organizer';
  addedAt: string;
}

interface TournamentOrganizerTeamModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: number;
  isCreator: boolean;
}

export function TournamentOrganizerTeamModal({
  open,
  onClose,
  tournamentId,
  isCreator
}: TournamentOrganizerTeamModalProps) {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOrganizers, setLoadingOrganizers] = useState(true);

  useEffect(() => {
    if (open) {
      loadOrganizers();
    }
  }, [open, tournamentId]);

  // Buscar pessoas em tempo real
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchPeople();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const loadOrganizers = async () => {
    try {
      setLoadingOrganizers(true);
      
      const token = localStorage.getItem('volleypro_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/organizers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar equipe organizadora');
      }

      const data = await response.json();
      setOrganizers(data.organizers || []);
    } catch (error) {
      console.error('Erro ao carregar organizadores:', error);
      toast.error('Erro ao carregar equipe organizadora');
    } finally {
      setLoadingOrganizers(false);
    }
  };

  const searchPeople = async () => {
    try {
      setSearching(true);
      
      const token = localStorage.getItem('volleypro_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/search/people?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar pessoas');
      }

      const data = await response.json();
      
      // Filtrar pessoas que já são organizadores
      const organizerIds = organizers.map(o => o.userId);
      const filtered = data.people.filter((p: any) => !organizerIds.includes(p.id));
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddOrganizer = async (person: any) => {
    if (!isCreator) {
      toast.error('Apenas o criador pode adicionar membros');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('volleypro_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/organizers`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            userId: person.id,
            name: person.name,
            email: person.email,
            cpf: person.cpf,
            type: person.type
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao adicionar organizador');
      }

      toast.success(`✅ ${person.name} adicionado à equipe!`);
      setSearchQuery("");
      setSearchResults([]);
      await loadOrganizers();
    } catch (error: any) {
      console.error('Erro ao adicionar organizador:', error);
      toast.error(error.message || 'Erro ao adicionar organizador');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrganizer = async (organizerId: string) => {
    if (!isCreator) {
      toast.error('Apenas o criador pode remover membros');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('volleypro_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/organizers/${organizerId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao remover organizador');
      }

      toast.success('Membro removido da equipe');
      await loadOrganizers();
    } catch (error) {
      console.error('Erro ao remover organizador:', error);
      toast.error('Erro ao remover organizador');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'team': return <Users className="h-3 w-3" />;
      case 'athlete': return <Trophy className="h-3 w-3" />;
      case 'referee': return <Flag className="h-3 w-3" />;
      case 'fan': return <Heart className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getTypeName = (type?: string) => {
    switch (type) {
      case 'team': return 'Time';
      case 'athlete': return 'Atleta';
      case 'referee': return 'Árbitro';
      case 'fan': return 'Torcedor';
      default: return 'Usuário';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="organizer-team-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Equipe Organizadora
          </DialogTitle>
          <DialogDescription id="organizer-team-description">
            Adicione pessoas para ajudar a gerenciar este torneio (opcional)
          </DialogDescription>
        </DialogHeader>

        {/* Info sobre ser opcional */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Equipe organizadora é opcional!</strong> Adicione apenas se precisar de ajuda para gerenciar o torneio. 
            Você pode adicionar times, atletas, árbitros, torcedores ou qualquer pessoa cadastrada no site.
          </p>
        </div>

        {isCreator && (
          <div className="space-y-4">
            {/* Campo de busca */}
            <div className="space-y-2">
              <label className="text-sm">
                Buscar por nome ou CPF
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite o nome ou CPF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Digite pelo menos 2 caracteres para buscar
              </p>
            </div>

            {/* Resultados da busca */}
            {searching && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                Buscando...
              </div>
            )}

            {!searching && searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Resultados ({searchResults.length})</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((person) => (
                    <Card key={person.id} className="hover:bg-accent/50 cursor-pointer transition-colors">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {getTypeIcon(person.type)}
                          </div>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeName(person.type)}
                              </Badge>
                              {person.cpf && (
                                <span className="text-xs text-muted-foreground">CPF: {person.cpf}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddOrganizer(person)}
                          disabled={loading}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!searching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Nenhuma pessoa encontrada</p>
                <p className="text-sm mt-1">Tente outro nome ou CPF</p>
              </div>
            )}
          </div>
        )}

        {/* Lista de organizadores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Membros da Equipe ({organizers.length})
            </p>
          </div>

          {loadingOrganizers ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : organizers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-16 w-16 mx-auto mb-3 opacity-20" />
              <p>Nenhum membro na equipe</p>
              {isCreator && (
                <p className="text-sm mt-1">Use a busca acima para adicionar pessoas</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {organizers.map((organizer) => (
                <Card key={organizer.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {organizer.role === 'creator' ? (
                          <Crown className="h-4 w-4 text-primary" />
                        ) : (
                          getTypeIcon(organizer.type)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{organizer.name}</p>
                          {organizer.role === 'creator' && (
                            <Badge className="bg-primary">
                              <Crown className="h-3 w-3 mr-1" />
                              Criador
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {organizer.type && (
                            <Badge variant="outline" className="text-xs">
                              {getTypeName(organizer.type)}
                            </Badge>
                          )}
                          {organizer.email && (
                            <span className="text-xs text-muted-foreground">{organizer.email}</span>
                          )}
                          {organizer.cpf && (
                            <span className="text-xs text-muted-foreground">CPF: {organizer.cpf}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isCreator && organizer.role !== 'creator' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOrganizer(organizer.id)}
                        disabled={loading}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

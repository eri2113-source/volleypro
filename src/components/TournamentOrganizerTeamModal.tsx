import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X, UserPlus, Mail, Trash2, Shield, Crown } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Organizer {
  id: string;
  email: string;
  name?: string;
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
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOrganizers, setLoadingOrganizers] = useState(true);

  useEffect(() => {
    if (open) {
      loadOrganizers();
    }
  }, [open, tournamentId]);

  const loadOrganizers = async () => {
    try {
      setLoadingOrganizers(true);
      
      const token = localStorage.getItem('volleypro_token');
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/organizers`,
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

  const handleAddOrganizer = async () => {
    if (!newEmail.trim()) {
      toast.error('Digite um e-mail válido');
      return;
    }

    if (!isCreator) {
      toast.error('Apenas o criador pode adicionar membros');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('volleypro_token');
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/organizers`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: newEmail.trim().toLowerCase() })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao adicionar organizador');
      }

      toast.success('Organizador adicionado com sucesso! 🎉', {
        description: `${newEmail} agora pode editar este torneio`
      });

      setNewEmail('');
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
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/organizers/${organizerId}`,
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

      toast.success('Organizador removido');
      await loadOrganizers();
    } catch (error) {
      console.error('Erro ao remover organizador:', error);
      toast.error('Erro ao remover organizador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Equipe de Organização do Torneio
          </DialogTitle>
          <DialogDescription>
            Adicione membros para ajudar a gerenciar e atualizar os dados do torneio em tempo real
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ADICIONAR NOVO ORGANIZADOR */}
          {isCreator && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <Label className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Adicionar Novo Organizador
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOrganizer()}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleAddOrganizer}
                  disabled={loading || !newEmail.trim()}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                O usuário precisa ter uma conta no VolleyPro para ser adicionado
              </p>
            </div>
          )}

          {/* LISTA DE ORGANIZADORES */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Membros da Equipe ({organizers.length})
            </Label>

            {loadingOrganizers ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando equipe...
              </div>
            ) : organizers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum organizador adicionado ainda</p>
                {isCreator && (
                  <p className="text-xs mt-2">
                    Adicione membros para ajudar a gerenciar o torneio
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {organizers.map((organizer) => (
                  <div
                    key={organizer.id}
                    className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {organizer.role === 'creator' ? (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                          <Crown className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">
                            {organizer.name || organizer.email}
                          </p>
                          {organizer.role === 'creator' && (
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Criador
                            </Badge>
                          )}
                          {organizer.role === 'organizer' && (
                            <Badge variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              Organizador
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {organizer.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Adicionado em {new Date(organizer.addedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* BOTÃO REMOVER (apenas para organizadores, não criador) */}
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PERMISSÕES */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Permissões da Equipe
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Editar tabelas de classificação</li>
              <li>✅ Atualizar resultados das partidas</li>
              <li>✅ Modificar chaveamento</li>
              <li>✅ Gerenciar horários e locais</li>
              <li>✅ Atualizar informações do torneio</li>
              <li>❌ Não podem adicionar/remover organizadores</li>
              <li>❌ Não podem excluir o torneio</li>
            </ul>
          </div>
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

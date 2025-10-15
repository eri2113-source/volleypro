import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check, X, Mail } from "lucide-react";
import { invitationApi, authApi } from "../lib/api";
import { toast } from "sonner@2.0.3";

export function Invitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const session = await authApi.getSession();
      if (session) {
        setIsAuthenticated(true);
        loadInvitations();
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  }

  async function loadInvitations() {
    setLoading(true);
    try {
      const { invitations: apiInvitations } = await invitationApi.getInvitations();
      setInvitations(apiInvitations || []);
    } catch (error) {
      console.error("Error loading invitations:", error);
      toast.error("Erro ao carregar convites");
    } finally {
      setLoading(false);
    }
  }

  async function handleResponse(invitationId: string, status: 'accepted' | 'rejected') {
    try {
      await invitationApi.respondToInvitation(invitationId, status);
      toast.success(status === 'accepted' ? "Convite aceito!" : "Convite recusado");
      loadInvitations();
    } catch (error: any) {
      console.error("Error responding to invitation:", error);
      toast.error(error.message || "Erro ao responder convite");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Convites</h3>
            <p className="text-muted-foreground">Faça login para ver seus convites</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Convites</h1>
          <p className="text-muted-foreground">Convites recebidos de times</p>
        </div>
        <Badge variant="secondary">{pendingInvitations.length} pendentes</Badge>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Carregando convites...</p>
          </CardContent>
        </Card>
      ) : invitations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Nenhum convite</h3>
            <p className="text-muted-foreground">
              Você ainda não recebeu convites de times
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3>{invitation.teamName}</h3>
                    <p className="text-muted-foreground text-sm">
                      Enviado em {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      invitation.status === 'pending'
                        ? 'secondary'
                        : invitation.status === 'accepted'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {invitation.status === 'pending' && 'Pendente'}
                    {invitation.status === 'accepted' && 'Aceito'}
                    {invitation.status === 'rejected' && 'Recusado'}
                  </Badge>
                </div>
              </CardHeader>
              {invitation.message && (
                <CardContent>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg">
                    {invitation.message}
                  </p>
                </CardContent>
              )}
              {invitation.status === 'pending' && (
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => handleResponse(invitation.id, 'accepted')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aceitar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleResponse(invitation.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Recusar
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

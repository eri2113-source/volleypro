import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  User,
  Calendar,
  Eye,
  Trash2,
  AlertCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
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

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export function AdsManagement() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/ads/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao carregar anúncios");

      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
      toast.error("Erro ao carregar anúncios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (ad: Ad) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/ads/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ adId: ad.id }),
        }
      );

      if (!response.ok) throw new Error("Erro ao aprovar anúncio");

      toast.success("✅ Anúncio aprovado!", {
        description: "O anúncio já está visível no site!",
      });

      loadAds();
      setSelectedAd(null);
      setActionType(null);
    } catch (error) {
      console.error("Erro ao aprovar anúncio:", error);
      toast.error("Erro ao aprovar anúncio");
    }
  };

  const handleReject = async (ad: Ad) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/ads/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            adId: ad.id,
            reason: "Anúncio não aprovado pela moderação",
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao rejeitar anúncio");

      toast.success("Anúncio rejeitado");
      loadAds();
      setSelectedAd(null);
      setActionType(null);
    } catch (error) {
      console.error("Erro ao rejeitar anúncio:", error);
      toast.error("Erro ao rejeitar anúncio");
    }
  };

  const handleDelete = async (ad: Ad) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/ads/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ adId: ad.id }),
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar anúncio");

      toast.success("Anúncio deletado");
      loadAds();
      setSelectedAd(null);
      setActionType(null);
    } catch (error) {
      console.error("Erro ao deletar anúncio:", error);
      toast.error("Erro ao deletar anúncio");
    }
  };

  const pendingAds = ads.filter((ad) => ad.status === "pending");
  const approvedAds = ads.filter((ad) => ad.status === "approved");
  const rejectedAds = ads.filter((ad) => ad.status === "rejected");

  const AdCard = ({ ad }: { ad: Ad }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-1">{ad.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {ad.description}
            </p>
          </div>
          <Badge
            variant={
              ad.status === "approved"
                ? "default"
                : ad.status === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {ad.status === "approved"
              ? "Aprovado"
              : ad.status === "rejected"
              ? "Rejeitado"
              : "Pendente"}
          </Badge>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            {ad.contactName || "Anônimo"}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            {ad.contactEmail}
          </div>
          {ad.contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              {ad.contactPhone}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            {new Date(ad.createdAt).toLocaleDateString("pt-BR")}
          </div>
        </div>

        {ad.linkUrl && (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {ad.linkUrl}
          </a>
        )}

        <div className="flex gap-2 pt-2">
          {ad.status === "pending" && (
            <>
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setSelectedAd(ad);
                  setActionType("approve");
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setSelectedAd(ad);
                  setActionType("reject");
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </>
          )}
          {ad.status === "approved" && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedAd(ad);
                setActionType("reject");
              }}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Desativar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedAd(ad);
              setActionType("delete");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando anúncios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <strong>Painel do Administrador</strong> - Gerencie todos os anúncios da plataforma.
          Apenas você tem acesso a esta área.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingAds.length}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedAds.length}</p>
              <p className="text-xs text-muted-foreground">Aprovados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedAds.length}</p>
              <p className="text-xs text-muted-foreground">Rejeitados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pendentes ({pendingAds.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Aprovados ({approvedAds.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejeitados ({rejectedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingAds.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum anúncio pendente no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedAds.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum anúncio aprovado ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approvedAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedAds.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum anúncio rejeitado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rejectedAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Confirmação */}
      <AlertDialog
        open={!!selectedAd && !!actionType}
        onOpenChange={() => {
          setSelectedAd(null);
          setActionType(null);
        }}
      >
        <AlertDialogContent aria-describedby="ad-action-description">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve"
                ? "Aprovar anúncio?"
                : actionType === "reject"
                ? "Rejeitar anúncio?"
                : "Deletar anúncio?"}
            </AlertDialogTitle>
            <AlertDialogDescription id="ad-action-description">
              {actionType === "approve" &&
                "O anúncio será publicado e ficará visível para todos os usuários."}
              {actionType === "reject" &&
                "O anúncio será rejeitado e não aparecerá no site."}
              {actionType === "delete" &&
                "Esta ação não pode ser desfeita. O anúncio será permanentemente deletado."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!selectedAd) return;
                if (actionType === "approve") handleApprove(selectedAd);
                if (actionType === "reject") handleReject(selectedAd);
                if (actionType === "delete") handleDelete(selectedAd);
              }}
              className={
                actionType === "delete"
                  ? "bg-destructive hover:bg-destructive/90"
                  : actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {actionType === "approve"
                ? "Aprovar"
                : actionType === "reject"
                ? "Rejeitar"
                : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

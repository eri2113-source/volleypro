import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { ImagePlus, Link as LinkIcon, Layout, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface CreateAdModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAdModal({ open, onClose, onSuccess }: CreateAdModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    type: "banner",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande! Máximo 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas!");
      return;
    }

    try {
      setIsLoading(true);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
      };
      
      reader.readAsDataURL(file);
      toast.success("Imagem carregada!");
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      toast.error("Erro ao carregar imagem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório!");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Descrição é obrigatória!");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Adicione uma imagem para o anúncio!");
      return;
    }

    if (!formData.contactEmail.trim()) {
      toast.error("Email de contato é obrigatório!");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast.error("Email inválido!");
      return;
    }

    try {
      setIsLoading(true);

      const newAd = {
        id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
        createdBy: localStorage.getItem("userId") || "anonymous",
      };

      // Enviar para o backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/ads/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(newAd),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("🎉 Anúncio enviado para aprovação!", {
        description: "Você receberá um email quando for aprovado!",
        duration: 5000,
      });

      // Limpar formulário
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        type: "banner",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
      });
      setImagePreview("");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao criar anúncio:", error);
      toast.error("Erro ao enviar anúncio. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="create-ad-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Criar Anúncio Grátis
          </DialogTitle>
          <DialogDescription id="create-ad-description">
            Divulgue seu produto ou serviço gratuitamente durante o período de lançamento!
            <br />
            <span className="text-sm">
              Dúvidas? WhatsApp:{" "}
              <a 
                href="https://wa.me/5562920004301" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                (62) 92000-4301
              </a>
            </span>
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm">
            <strong>🎉 Promoção de Lançamento!</strong> Anúncios 100% gratuitos por tempo limitado.
            Após aprovação, seu anúncio ficará visível para toda a comunidade do VolleyPro!
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Anúncio */}
          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Tipo de Anúncio
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">
                  🖼️ Banner Grande (Destaque no topo)
                </SelectItem>
                <SelectItem value="card">
                  📦 Card Médio (No feed)
                </SelectItem>
                <SelectItem value="sidebar">
                  📌 Sidebar (Lateral)
                </SelectItem>
                <SelectItem value="story">
                  ⚡ Story (Carrossel)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Escolha onde seu anúncio aparecerá no site
            </p>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Anúncio *</Label>
            <Input
              id="title"
              placeholder="Ex: Academia de Vôlei com 50% de desconto!"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/100 caracteres
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva seu produto ou serviço de forma atrativa..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 caracteres
            </p>
          </div>

          {/* Upload de Imagem */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Imagem do Anúncio * (máx 5MB)
            </Label>
            
            {imagePreview ? (
              <Card className="relative overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview("");
                    setFormData(prev => ({ ...prev, imageUrl: "" }));
                  }}
                >
                  Remover
                </Button>
              </Card>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImagePlus className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique para adicionar uma imagem
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG ou GIF (máx 5MB)
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Link (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="linkUrl" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Link do Anúncio (opcional)
            </Label>
            <Input
              id="linkUrl"
              type="url"
              placeholder="https://seusite.com.br"
              value={formData.linkUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Para onde o anúncio deve redirecionar (Instagram, WhatsApp, Site, etc)
            </p>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium">Informações de Contato</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nome (opcional)</Label>
                <Input
                  id="contactName"
                  placeholder="Seu nome ou empresa"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone/WhatsApp (opcional)</Label>
              <Input
                id="contactPhone"
                placeholder="(00) 00000-0000"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Seu anúncio será analisado pela nossa equipe antes de ser publicado.
              Você receberá um email quando for aprovado (geralmente em até 24h).
            </AlertDescription>
          </Alert>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {isLoading ? "Enviando..." : "Enviar para Aprovação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


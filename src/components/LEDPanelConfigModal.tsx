import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Play,
  Shuffle,
  ArrowLeftRight,
  Clock,
  Grid3x3,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface LEDMedia {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number;
  link?: string;
  name?: string;
}

interface LEDPanelConfig {
  media: LEDMedia[];
  layout: "single" | "grid-2" | "grid-3" | "grid-4";
  animationType: "horizontal" | "fade" | "zoom" | "slide";
  randomOrder: boolean;
  autoPlay: boolean;
  transitionSpeed: number; // 1-10 (segundos)
}

interface LEDPanelConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournamentId: string;
  currentConfig?: LEDPanelConfig;
  onSave: (config: LEDPanelConfig) => void;
}

export function LEDPanelConfigModal({
  open,
  onOpenChange,
  tournamentId,
  currentConfig,
  onSave,
}: LEDPanelConfigModalProps) {
  const [config, setConfig] = useState<LEDPanelConfig>(
    currentConfig || {
      media: [],
      layout: "grid-3",
      animationType: "horizontal",
      randomOrder: true,
      autoPlay: true,
      transitionSpeed: 5,
    }
  );

  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Upload de arquivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);

    try {
      const uploadedMedia: LEDMedia[] = [];

      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isVideo && !isImage) {
          toast.error(`Arquivo ${file.name} não é imagem nem vídeo`);
          continue;
        }

        console.log('📤 [LED UPLOAD] Uploading file:', file.name);

        // Upload para Supabase Storage
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", `tournaments/${tournamentId}/led/${file.name}`);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ [LED UPLOAD] Upload failed:', errorData);
          throw new Error(errorData.error || `Erro ao fazer upload de ${file.name}`);
        }

        const { url } = await response.json();
        console.log('✅ [LED UPLOAD] File uploaded successfully:', file.name);

        uploadedMedia.push({
          id: crypto.randomUUID(),
          type: isVideo ? "video" : "image",
          url: url,
          duration: isVideo ? undefined : 5,
          name: file.name,
        });
      }

      setConfig((prev) => ({
        ...prev,
        media: [...prev.media, ...uploadedMedia],
      }));

      toast.success(`✅ ${uploadedMedia.length} arquivo(s) adicionado(s) com sucesso!`);
    } catch (error: any) {
      console.error("❌ [LED UPLOAD] Erro no upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Adicionar URL externa
  const handleAddExternalUrl = () => {
    if (!previewUrl.trim()) {
      toast.error("Digite uma URL válida");
      return;
    }

    const isVideo =
      previewUrl.includes(".mp4") ||
      previewUrl.includes(".webm") ||
      previewUrl.includes(".ogg") ||
      previewUrl.includes("youtube") ||
      previewUrl.includes("vimeo");

    const newMedia: LEDMedia = {
      id: crypto.randomUUID(),
      type: isVideo ? "video" : "image",
      url: previewUrl,
      duration: isVideo ? undefined : 5,
      name: "URL Externa",
    };

    setConfig((prev) => ({
      ...prev,
      media: [...prev.media, newMedia],
    }));

    setPreviewUrl("");
    toast.success("Mídia adicionada");
  };

  // Remover mídia
  const handleRemoveMedia = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
    toast.success("Mídia removida");
  };

  // Atualizar duração de imagem
  const handleUpdateDuration = (id: string, duration: number) => {
    setConfig((prev) => ({
      ...prev,
      media: prev.media.map((m) =>
        m.id === id ? { ...m, duration } : m
      ),
    }));
  };

  // Atualizar link de mídia
  const handleUpdateLink = (id: string, link: string) => {
    setConfig((prev) => ({
      ...prev,
      media: prev.media.map((m) =>
        m.id === id ? { ...m, link } : m
      ),
    }));
  };

  // Salvar configuração
  const handleSave = () => {
    if (config.media.length === 0) {
      toast.error("Adicione pelo menos uma imagem ou vídeo");
      return;
    }

    onSave(config);
    toast.success("Configuração do painel LED salva!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="led-panel-config-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-primary" />
            Configurar Painel LED
          </DialogTitle>
          <DialogDescription id="led-panel-config-description">
            Adicione fotos e vídeos para exibir no painel LED do torneio
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="media">Mídias ({config.media.length})</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* ABA 1: MÍDIAS */}
          <TabsContent value="media" className="space-y-4">
            {/* Upload de arquivos */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                📁 Upload Direto do Computador (Recomendado)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingFiles}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled={uploadingFiles}
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                >
                  {uploadingFiles ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-3 w-3" />
                  <strong>Formatos de Imagem:</strong> JPG, PNG, GIF
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Video className="h-3 w-3" />
                  <strong>Formatos de Vídeo:</strong> MP4, WEBM
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✅ Clique em "Escolher arquivos" e selecione as fotos/vídeos do seu computador
                </p>
              </div>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            {/* URL Externa */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                🔗 Adicionar Link de Imagem/Vídeo (Opcional)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                />
                <Button variant="outline" onClick={handleAddExternalUrl}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Use este campo apenas se a mídia já estiver hospedada online
              </p>
            </div>

            {/* Lista de mídias */}
            <div className="space-y-2">
              <Label>Mídias adicionadas ({config.media.length})</Label>
              <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                {config.media.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mídia adicionada ainda</p>
                    <p className="text-xs mt-1">
                      Adicione fotos ou vídeos usando os campos acima
                    </p>
                  </div>
                ) : (
                  config.media.map((media) => (
                    <div
                      key={media.id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                    >
                      {/* Preview */}
                      <div className="w-20 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={media.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {media.type === "image" ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : (
                            <Video className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {media.name || "Sem nome"}
                          </span>
                        </div>

                        {/* Duração (apenas para imagens) */}
                        {media.type === "image" && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <Input
                              type="number"
                              min="1"
                              max="60"
                              value={media.duration || 5}
                              onChange={(e) =>
                                handleUpdateDuration(
                                  media.id,
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-20 h-7 text-xs"
                            />
                            <span className="text-xs text-muted-foreground">
                              segundos
                            </span>
                          </div>
                        )}

                        {/* Link opcional */}
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-3 w-3" />
                          <Input
                            placeholder="Link ao clicar (opcional)"
                            value={media.link || ""}
                            onChange={(e) =>
                              handleUpdateLink(media.id, e.target.value)
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      </div>

                      {/* Remover */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMedia(media.id)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* ABA 2: CONFIGURAÇÕES */}
          <TabsContent value="settings" className="space-y-6">
            {/* Layout */}
            <div className="space-y-2">
              <Label>Layout do Painel</Label>
              <Select
                value={config.layout}
                onValueChange={(value: any) =>
                  setConfig((prev) => ({ ...prev, layout: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">
                    Tela Única (1 mídia)
                  </SelectItem>
                  <SelectItem value="grid-2">
                    Grade 2x1 (2 mídias lado a lado)
                  </SelectItem>
                  <SelectItem value="grid-3">
                    Grade 3x1 (3 mídias lado a lado)
                  </SelectItem>
                  <SelectItem value="grid-4">
                    Grade 2x2 (4 mídias)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Animação */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Tipo de Animação
              </Label>
              <Select
                value={config.animationType}
                onValueChange={(value: any) =>
                  setConfig((prev) => ({ ...prev, animationType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">
                    🔀 Deslizar Horizontal (vai e volta)
                  </SelectItem>
                  <SelectItem value="fade">
                    ✨ Fade In/Out (transição suave)
                  </SelectItem>
                  <SelectItem value="zoom">
                    🔍 Zoom In/Out (aproximar/afastar)
                  </SelectItem>
                  <SelectItem value="slide">
                    ⬆️ Slide Vertical (subir/descer)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Velocidade de Transição */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duração da Transição: {config.transitionSpeed}s
              </Label>
              <Input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={config.transitionSpeed}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    transitionSpeed: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rápido (1s)</span>
                <span>Lento (10s)</span>
              </div>
            </div>

            {/* Ordem Aleatória */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  Ordem Aleatória
                </Label>
                <p className="text-sm text-muted-foreground">
                  Exibir mídias em ordem aleatória
                </p>
              </div>
              <Switch
                checked={config.randomOrder}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, randomOrder: checked }))
                }
              />
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Reprodução Automática
                </Label>
                <p className="text-sm text-muted-foreground">
                  Iniciar automaticamente ao carregar
                </p>
              </div>
              <Switch
                checked={config.autoPlay}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, autoPlay: checked }))
                }
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Botões de ação */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={config.media.length === 0}>
            <Grid3x3 className="h-4 w-4 mr-2" />
            Salvar Configuração
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
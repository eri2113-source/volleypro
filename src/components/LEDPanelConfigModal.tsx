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
  Box,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { authApi } from "../lib/api";

interface LEDMedia {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number;
  link?: string;
  name?: string;
}

interface LEDPanelConfig {
  zones: {
    zone1: LEDMedia[];
    zone2: LEDMedia[];
    zone3: LEDMedia[];
    zone4: LEDMedia[];
  };
  layout: "single" | "grid-2" | "grid-3" | "grid-4";
  animationType: "horizontal" | "fade" | "zoom" | "slide";
  randomOrder: boolean;
  autoPlay: boolean;
  transitionSpeed: number;
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
      zones: {
        zone1: [],
        zone2: [],
        zone3: [],
        zone4: [],
      },
      layout: "grid-3",
      animationType: "horizontal",
      randomOrder: true,
      autoPlay: true,
      transitionSpeed: 5,
    }
  );

  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [activeZoneTab, setActiveZoneTab] = useState("zone1");

  // Determinar quantas zonas estão ativas
  const numZones =
    config.layout === "single"
      ? 1
      : config.layout === "grid-2"
      ? 2
      : config.layout === "grid-3"
      ? 3
      : 4;

  // Upload de arquivos para zona específica
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    zone: "zone1" | "zone2" | "zone3" | "zone4"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);

    try {
      // 🔐 Obter token de autenticação do usuário logado
      console.log("🔐 [LED UPLOAD] Getting session token...");
      const session = await authApi.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Você precisa estar logado para fazer upload. Faça login e tente novamente."
        );
      }

      console.log("✅ [LED UPLOAD] Session token obtained");
      const uploadedMedia: LEDMedia[] = [];

      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isVideo && !isImage) {
          toast.error(`Arquivo ${file.name} não é imagem nem vídeo`);
          continue;
        }

        console.log("📤 [LED UPLOAD] Uploading file:", file.name);

        // Upload para Supabase Storage
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "path",
          `tournaments/${tournamentId}/led/${zone}/${file.name}`
        );

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ [LED UPLOAD] Upload failed:", errorData);
          throw new Error(
            errorData.error || `Erro ao fazer upload de ${file.name}`
          );
        }

        const { url } = await response.json();
        console.log("✅ [LED UPLOAD] File uploaded successfully:", file.name);

        uploadedMedia.push({
          id: crypto.randomUUID(),
          type: isVideo ? "video" : "image",
          url: url,
          duration: isVideo ? undefined : 5,
          name: file.name,
        });
      }

      // Adicionar mídias à zona específica
      setConfig((prev) => ({
        ...prev,
        zones: {
          ...prev.zones,
          [zone]: [...prev.zones[zone], ...uploadedMedia],
        },
      }));

      toast.success(
        `✅ ${uploadedMedia.length} arquivo(s) adicionado(s) à ${getZoneName(zone)}!`
      );

      // Limpar input
      event.target.value = "";
    } catch (error: any) {
      console.error("❌ [LED UPLOAD] Erro no upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Adicionar URL externa a zona específica
  const handleAddExternalUrl = (zone: "zone1" | "zone2" | "zone3" | "zone4") => {
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
      zones: {
        ...prev.zones,
        [zone]: [...prev.zones[zone], newMedia],
      },
    }));

    setPreviewUrl("");
    toast.success(`Mídia adicionada à ${getZoneName(zone)}`);
  };

  // Remover mídia de zona específica
  const handleRemoveMedia = (
    zone: "zone1" | "zone2" | "zone3" | "zone4",
    mediaId: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: prev.zones[zone].filter((m) => m.id !== mediaId),
      },
    }));
    toast.success("Mídia removida");
  };

  // Atualizar duração de imagem
  const handleUpdateDuration = (
    zone: "zone1" | "zone2" | "zone3" | "zone4",
    mediaId: string,
    duration: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: prev.zones[zone].map((m) =>
          m.id === mediaId ? { ...m, duration } : m
        ),
      },
    }));
  };

  // Atualizar link de mídia
  const handleUpdateLink = (
    zone: "zone1" | "zone2" | "zone3" | "zone4",
    mediaId: string,
    link: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      zones: {
        ...prev.zones,
        [zone]: prev.zones[zone].map((m) =>
          m.id === mediaId ? { ...m, link } : m
        ),
      },
    }));
  };

  // Mudar layout e resetar zonas não utilizadas
  const handleLayoutChange = (newLayout: string) => {
    setConfig((prev) => ({
      ...prev,
      layout: newLayout as any,
    }));

    // Se reduzir número de zonas, avisar
    const newNumZones =
      newLayout === "single" ? 1 : newLayout === "grid-2" ? 2 : newLayout === "grid-3" ? 3 : 4;

    if (newNumZones < numZones) {
      const zonesWithMedia = Object.entries(config.zones).filter(
        ([key, media]) => media.length > 0
      );
      const affectedZones = zonesWithMedia
        .filter(([key]) => {
          const zoneNum = parseInt(key.replace("zone", ""));
          return zoneNum > newNumZones;
        });

      if (affectedZones.length > 0) {
        toast.error(
          `⚠️ Atenção: Zonas ${affectedZones.map(([k]) => k.replace("zone", "")).join(", ")} têm fotos que serão perdidas!`
        );
      }
    }
  };

  // Nome amigável da zona
  const getZoneName = (zone: string) => {
    const zoneNum = zone.replace("zone", "");
    const names: Record<string, Record<string, string>> = {
      single: { "1": "Tela Única" },
      "grid-2": { "1": "Esquerda", "2": "Direita" },
      "grid-3": { "1": "Esquerda", "2": "Centro", "3": "Direita" },
      "grid-4": { "1": "Superior Esq.", "2": "Superior Dir.", "3": "Inferior Esq.", "4": "Inferior Dir." },
    };
    return names[config.layout]?.[zoneNum] || `Zona ${zoneNum}`;
  };

  // Salvar configuração
  const handleSave = () => {
    // Verificar se pelo menos uma zona tem mídia
    const hasAnyMedia = Object.values(config.zones).some(
      (zone) => zone.length > 0
    );

    if (!hasAnyMedia) {
      toast.error("Adicione pelo menos uma imagem ou vídeo em alguma zona");
      return;
    }

    onSave(config);
    toast.success("Configuração do painel LED salva!");
    onOpenChange(false);
  };

  // Contar total de mídias
  const totalMedia = Object.values(config.zones).reduce(
    (sum, zone) => sum + zone.length,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
        aria-describedby="led-panel-config-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-primary" />
            Configurar Painel LED - {totalMedia} fotos/vídeos
          </DialogTitle>
          <DialogDescription id="led-panel-config-description">
            Configure o layout e adicione fotos/vídeos para cada repartição do painel
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="zones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="zones">
              📁 Zonas ({totalMedia} mídias)
            </TabsTrigger>
            <TabsTrigger value="settings">⚙️ Configurações</TabsTrigger>
          </TabsList>

          {/* ABA 1: ZONAS */}
          <TabsContent value="zones" className="space-y-4">
            {/* Seletor de Layout */}
            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Box className="h-5 w-5 text-primary" />
                1. Escolha o Layout do Painel
              </Label>
              <Select value={config.layout} onValueChange={handleLayoutChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">
                    📺 Tela Única (1 zona)
                  </SelectItem>
                  <SelectItem value="grid-2">
                    ⬛⬛ Grade 2x1 (2 zonas lado a lado)
                  </SelectItem>
                  <SelectItem value="grid-3">
                    ⬛⬛⬛ Grade 3x1 (3 zonas lado a lado)
                  </SelectItem>
                  <SelectItem value="grid-4">
                    ⬛⬛<br/>⬛⬛ Grade 2x2 (4 zonas)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                💡 Cada zona terá suas próprias fotos que passam aleatoriamente
              </p>
            </div>

            {/* Tabs das Zonas */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                2. Adicione Fotos em Cada Zona
              </Label>

              <Tabs value={activeZoneTab} onValueChange={setActiveZoneTab}>
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${numZones}, 1fr)` }}>
                  {Array.from({ length: numZones }, (_, i) => {
                    const zone = `zone${i + 1}` as "zone1" | "zone2" | "zone3" | "zone4";
                    const zoneMedia = config.zones[zone];
                    return (
                      <TabsTrigger key={zone} value={zone}>
                        {getZoneName(zone)} ({zoneMedia.length})
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* Conteúdo de cada zona */}
                {(["zone1", "zone2", "zone3", "zone4"] as const).slice(0, numZones).map((zone) => (
                  <TabsContent key={zone} value={zone} className="space-y-4 mt-4">
                    {/* Upload */}
                    <div className="space-y-2 p-4 border rounded-lg bg-primary/5">
                      <Label className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-primary" />
                        📁 Upload Múltiplo ({getZoneName(zone)})
                      </Label>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, zone)}
                        disabled={uploadingFiles}
                      />
                      <div className="bg-muted/50 rounded p-2 space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Selecione <strong>VÁRIAS FOTOS</strong> de uma vez (Ctrl+Clique ou Shift+Clique)
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✅ Todas as fotos selecionadas vão para <strong>{getZoneName(zone)}</strong>
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          🔄 As fotos passam <strong>aleatoriamente</strong> nesta zona
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
                        🔗 URL Externa (Opcional)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={previewUrl}
                          onChange={(e) => setPreviewUrl(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleAddExternalUrl(zone)}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    {/* Lista de mídias da zona */}
                    <div className="space-y-2">
                      <Label>
                        Fotos/Vídeos em {getZoneName(zone)} ({config.zones[zone].length})
                      </Label>
                      <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                        {config.zones[zone].length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg">
                            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhuma mídia nesta zona</p>
                            <p className="text-xs mt-1">
                              Adicione várias fotos usando o campo acima
                            </p>
                          </div>
                        ) : (
                          config.zones[zone].map((media, index) => (
                            <div
                              key={media.id}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                            >
                              {/* Preview */}
                              <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                                {media.type === "image" ? (
                                  <img
                                    src={media.url}
                                    alt={media.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Video className="h-6 w-6 text-primary" />
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                                    #{index + 1}
                                  </span>
                                  <span className="text-sm truncate">
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
                                          zone,
                                          media.id,
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className="w-16 h-6 text-xs"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      seg
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Remover */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveMedia(zone, media.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>

          {/* ABA 2: CONFIGURAÇÕES */}
          <TabsContent value="settings" className="space-y-6">
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
                    🔀 Deslizar Horizontal
                  </SelectItem>
                  <SelectItem value="fade">✨ Fade In/Out</SelectItem>
                  <SelectItem value="zoom">🔍 Zoom In/Out</SelectItem>
                  <SelectItem value="slide">⬆️ Slide Vertical</SelectItem>
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
                  Ordem Aleatória em Cada Zona
                </Label>
                <p className="text-sm text-muted-foreground">
                  Fotos passam aleatoriamente dentro de cada zona
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

            {/* Resumo */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
              <p className="font-semibold">📊 Resumo da Configuração:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Layout: <strong>{numZones} zona(s)</strong></li>
                {Object.entries(config.zones).slice(0, numZones).map(([key, media]) => (
                  <li key={key}>
                    • {getZoneName(key)}: <strong>{media.length} foto(s)</strong>
                  </li>
                ))}
                <li>• Total: <strong>{totalMedia} mídia(s)</strong></li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Botões de ação */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={totalMedia === 0}>
            <Grid3x3 className="h-4 w-4 mr-2" />
            Salvar Configuração ({totalMedia} mídias)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

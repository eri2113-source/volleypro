import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ImagePlus, Video, Trash2, ExternalLink, GripVertical, Eye, Upload, Link as LinkIcon, Grid3x3, Layers } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { TournamentSponsorsPanel } from "./TournamentSponsorsPanel";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface SponsorMedia {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number;
  link?: string;
  slot?: number; // novo: qual slot (1-4)
}

interface TournamentSponsorsManagerProps {
  tournamentId: string;
  initialSponsors?: SponsorMedia[];
  initialLayout?: "single" | "grid-2" | "grid-3" | "grid-4";
  onSave?: (sponsors: SponsorMedia[], layout: string) => void;
}

export function TournamentSponsorsManager({
  tournamentId,
  initialSponsors = [],
  initialLayout = "grid-3",
  onSave,
}: TournamentSponsorsManagerProps) {
  const [sponsors, setSponsors] = useState<SponsorMedia[]>(initialSponsors);
  const [layout, setLayout] = useState<"single" | "grid-2" | "grid-3" | "grid-4">(initialLayout);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newMedia, setNewMedia] = useState({
    type: "image" as "image" | "video",
    url: "",
    duration: 5,
    link: "",
    slot: 1,
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Calcular número de slots baseado no layout
  const numSlots = layout === "single" ? 1 : 
                   layout === "grid-2" ? 2 :
                   layout === "grid-3" ? 3 : 4;

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Formato inválido", {
        description: "Apenas imagens (JPG, PNG, WebP) ou vídeos (MP4, WebM) são permitidos",
      });
      return;
    }

    // Validar tamanho (máx 50MB para vídeos, 10MB para imagens)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande", {
        description: `Tamanho máximo: ${isVideo ? "50MB" : "10MB"}`,
      });
      return;
    }

    setUploadingFile(true);

    try {
      // TODO: Implementar upload real para Supabase Storage
      // Por enquanto, usar URL local (blob) para preview
      const blobUrl = URL.createObjectURL(file);
      
      setNewMedia({
        ...newMedia,
        type: isVideo ? "video" : "image",
        url: blobUrl,
      });

      toast.success("Arquivo carregado!", {
        description: "Preencha as informações e clique em Adicionar",
      });
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload do arquivo");
    } finally {
      setUploadingFile(false);
    }
  }

  function handleAddMedia() {
    if (!newMedia.url) {
      toast.error("Adicione uma imagem ou vídeo primeiro");
      return;
    }

    const sponsor: SponsorMedia = {
      id: `sponsor-${Date.now()}`,
      type: newMedia.type,
      url: newMedia.url,
      duration: newMedia.type === "image" ? newMedia.duration : undefined,
      link: newMedia.link || undefined,
      slot: newMedia.slot,
    };

    setSponsors([...sponsors, sponsor]);
    setNewMedia({ type: "image", url: "", duration: 5, link: "", slot: 1 });
    setShowAddDialog(false);

    toast.success("Patrocinador adicionado!", {
      description: "O painel foi atualizado",
    });

    // Salvar automaticamente
    if (onSave) {
      onSave([...sponsors, sponsor], layout);
    }
  }

  function handleRemove(id: string) {
    const newSponsors = sponsors.filter((s) => s.id !== id);
    setSponsors(newSponsors);

    toast.success("Patrocinador removido");

    if (onSave) {
      onSave(newSponsors, layout);
    }
  }

  function handleReorder(fromIndex: number, toIndex: number) {
    const newSponsors = [...sponsors];
    const [removed] = newSponsors.splice(fromIndex, 1);
    newSponsors.splice(toIndex, 0, removed);
    setSponsors(newSponsors);

    if (onSave) {
      onSave(newSponsors, layout);
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuração de Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            Layout do Painel
          </CardTitle>
          <CardDescription>
            Escolha como os patrocinadores serão exibidos no banner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={layout}
            onValueChange={(value: any) => {
              setLayout(value);
              if (onSave) {
                onSave(sponsors, value);
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4"
          >
            <div>
              <RadioGroupItem value="single" id="single" className="peer sr-only" />
              <Label
                htmlFor="single"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-full aspect-video bg-gradient-to-r from-primary/20 to-primary/10 rounded mb-2 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">Tela Cheia</div>
                  <div className="text-xs text-muted-foreground mt-1">1 imagem por vez</div>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="grid-2" id="grid-2" className="peer sr-only" />
              <Label
                htmlFor="grid-2"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-full aspect-video bg-muted rounded mb-2 grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">2 Slots</div>
                  <div className="text-xs text-muted-foreground mt-1">2 imagens simultâneas</div>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="grid-3" id="grid-3" className="peer sr-only" />
              <Label
                htmlFor="grid-3"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-full aspect-video bg-muted rounded mb-2 grid grid-cols-3 gap-0.5 p-0.5">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">3 Slots</div>
                  <div className="text-xs text-muted-foreground mt-1">3 imagens simultâneas</div>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="grid-4" id="grid-4" className="peer sr-only" />
              <Label
                htmlFor="grid-4"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-full aspect-video bg-muted rounded mb-2 grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-sm" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">4 Slots</div>
                  <div className="text-xs text-muted-foreground mt-1">4 imagens simultâneas</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <strong>Layout atual:</strong> {
              layout === "single" ? "Tela cheia (1 imagem)" :
              layout === "grid-2" ? "2 slots lado a lado" :
              layout === "grid-3" ? "3 slots lado a lado" :
              "4 slots (2x2 em mobile, 4x1 em desktop)"
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Painel de Patrocinadores</CardTitle>
              <CardDescription>
                Adicione imagens e vídeos dos patrocinadores do torneio. Eles serão exibidos em
                rotação no banner do torneio.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl" aria-describedby="preview-panel-description">
                  <DialogHeader>
                    <DialogTitle>Preview do Painel</DialogTitle>
                    <DialogDescription id="preview-panel-description">
                      Visualize como o painel ficará no torneio
                    </DialogDescription>
                  </DialogHeader>
                  <TournamentSponsorsPanel
                    sponsors={sponsors}
                    height={320}
                    autoPlay={true}
                    showControls={true}
                    layout={layout}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="add-sponsor-description">
                  <DialogHeader>
                    <DialogTitle>Adicionar Patrocinador</DialogTitle>
                    <DialogDescription id="add-sponsor-description">
                      Faça upload de uma imagem ou vídeo do patrocinador
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Upload de arquivo */}
                    <div className="space-y-2">
                      <Label>Arquivo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                        />
                        {uploadingFile && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            Enviando...
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Imagens: JPG, PNG, WebP (máx 10MB) • Vídeos: MP4, WebM (máx 50MB)
                      </p>
                    </div>

                    {/* OU URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Ou</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>URL da Imagem/Vídeo</Label>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={newMedia.url}
                        onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                      />
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={newMedia.type}
                        onValueChange={(value: "image" | "video") =>
                          setNewMedia({ ...newMedia, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">
                            <div className="flex items-center gap-2">
                              <ImagePlus className="h-4 w-4" />
                              Imagem
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Vídeo
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duração (apenas para imagens) */}
                    {newMedia.type === "image" && (
                      <div className="space-y-2">
                        <Label>Duração de Exibição (segundos)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={newMedia.duration}
                          onChange={(e) =>
                            setNewMedia({ ...newMedia, duration: parseInt(e.target.value) || 5 })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Tempo que a imagem ficará visível antes de avançar
                        </p>
                      </div>
                    )}

                    {/* Link opcional */}
                    <div className="space-y-2">
                      <Label>Link (opcional)</Label>
                      <Input
                        placeholder="https://site-do-patrocinador.com"
                        value={newMedia.link}
                        onChange={(e) => setNewMedia({ ...newMedia, link: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Link para abrir quando clicar no patrocinador
                      </p>
                    </div>

                    {/* Slot */}
                    <div className="space-y-2">
                      <Label>Slot (posição)</Label>
                      <Select
                        value={newMedia.slot.toString()}
                        onValueChange={(value: string) =>
                          setNewMedia({ ...newMedia, slot: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map(slot => (
                            <SelectItem key={slot} value={slot.toString()}>
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Slot {slot}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preview */}
                    {newMedia.url && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="border rounded-lg overflow-hidden">
                          {newMedia.type === "image" ? (
                            <img
                              src={newMedia.url}
                              alt="Preview"
                              className="w-full h-40 object-cover"
                            />
                          ) : (
                            <video
                              src={newMedia.url}
                              className="w-full h-40 object-cover"
                              controls
                            />
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddMedia}>Adicionar</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {sponsors.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Nenhum patrocinador adicionado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione imagens ou vídeos dos patrocinadores do torneio
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <ImagePlus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Patrocinador
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  {/* Drag handle */}
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    {sponsor.type === "image" ? (
                      <img
                        src={sponsor.url}
                        alt="Sponsor"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={sponsor.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {sponsor.type === "image" ? (
                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {sponsor.type === "image" ? "Imagem" : "Vídeo"} #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {sponsor.duration && (
                        <span>Duração: {sponsor.duration}s</span>
                      )}
                      {sponsor.link && (
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          <span className="truncate max-w-xs">{sponsor.link}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {sponsor.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(sponsor.link, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(sponsor.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Adicionar Mais
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💡 Dicas para Patrocinadores</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>Imagens:</strong> Use imagens em alta resolução (mín. 1200x400px) para melhor qualidade</p>
          <p>• <strong>Vídeos:</strong> Vídeos curtos (5-15s) funcionam melhor. Use formato MP4 para maior compatibilidade</p>
          <p>• <strong>Ordem:</strong> Arraste os patrocinadores para reordenar a sequência de exibição</p>
          <p>• <strong>Links:</strong> Adicione links para sites dos patrocinadores para gerar tráfego</p>
          <p>• <strong>Preview:</strong> Sempre teste o preview antes de publicar para garantir boa visualização</p>
        </CardContent>
      </Card>
    </div>
  );
}
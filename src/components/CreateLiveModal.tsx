import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Radio, Calendar, Loader2, Image as ImageIcon, Camera } from "lucide-react";
import { liveApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { CameraTest } from "./CameraTest";

interface CreateLiveModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (live: any) => void;
}

export function CreateLiveModal({ open, onClose, onSuccess }: CreateLiveModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCameraTest, setShowCameraTest] = useState(false);
  const [cameraTestPassed, setCameraTestPassed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (isScheduled && !scheduledFor) {
      toast.error("Selecione data e hora para live agendada");
      return;
    }

    // Se não é agendada, precisa testar câmera primeiro
    if (!isScheduled && !cameraTestPassed) {
      setShowCameraTest(true);
      return;
    }

    setLoading(true);
    try {
      const { live } = await liveApi.createLive({
        title: title.trim(),
        description: description.trim() || undefined,
        scheduledFor: isScheduled ? scheduledFor : undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
      });

      toast.success(
        isScheduled ? "Live agendada com sucesso! 📅" : "Live criada! Começando transmissão... 🔴",
        {
          description: isScheduled 
            ? `Agendada para ${new Date(scheduledFor).toLocaleString('pt-BR')}`
            : "Sua live já está no ar!"
        }
      );

      onSuccess(live);
      
      // Reset form
      setTitle("");
      setDescription("");
      setScheduledFor("");
      setThumbnailUrl("");
      setIsScheduled(false);
      setShowCameraTest(false);
      setCameraTestPassed(false);
      
      onClose();
    } catch (error: any) {
      console.error("❌ Erro ao criar live:", error);
      toast.error("Erro ao criar live", {
        description: error.message || "Tente novamente"
      });
    } finally {
      setLoading(false);
    }
  }

  // Se está mostrando teste de câmera
  if (showCameraTest) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Verificar Câmera e Microfone
            </DialogTitle>
            <DialogDescription>
              Vamos testar se sua câmera e microfone estão funcionando antes de criar a live
            </DialogDescription>
          </DialogHeader>

          <CameraTest 
            onSuccess={() => {
              setCameraTestPassed(true);
              setShowCameraTest(false);
              toast.success("Câmera testada com sucesso! 🎥", {
                description: "Agora você pode criar sua live"
              });
              // Submeter o formulário automaticamente
              setTimeout(() => {
                const form = document.querySelector('form');
                if (form) {
                  form.requestSubmit();
                }
              }, 100);
            }}
            onSkip={() => {
              setCameraTestPassed(true);
              setShowCameraTest(false);
              toast.info("Teste pulado", {
                description: "Você pode ter problemas com a câmera"
              });
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-500" />
            {isScheduled ? "Agendar Live" : "Iniciar Transmissão"}
            <Badge variant="secondary" className="bg-green-500 text-white text-xs">
              Todos os perfis
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {isScheduled 
              ? "Agende uma transmissão ao vivo para uma data futura. Disponível para fãs, atletas e times!"
              : "Comece a transmitir agora mesmo! Qualquer perfil pode criar lives e compartilhar com o mundo."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Live */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!isScheduled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsScheduled(false)}
              className="flex-1"
            >
              <Radio className="h-4 w-4 mr-2" />
              Ao Vivo Agora
            </Button>
            <Button
              type="button"
              variant={isScheduled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsScheduled(true)}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Live *</Label>
            <Input
              id="title"
              placeholder="Ex: Treino aberto - Preparação para final"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva sobre o que será a transmissão..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Data/Hora Agendada */}
          {isScheduled && (
            <div className="space-y-2">
              <Label htmlFor="scheduledFor">Data e Hora *</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          )}

          {/* Thumbnail URL (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">
              <ImageIcon className="h-4 w-4 inline mr-2" />
              URL da Thumbnail (opcional)
            </Label>
            <Input
              id="thumbnailUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>

          {/* Camera Test Badge */}
          {!isScheduled && cameraTestPassed && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex items-center gap-2">
              <Camera className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Câmera testada e funcionando!
              </p>
            </div>
          )}

          {/* Info */}
          {!isScheduled && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
              <p className="text-sm text-primary-600 dark:text-primary-400">
                {cameraTestPassed 
                  ? "🎥 Sua câmera está pronta! Clique em 'Iniciar Agora' para começar."
                  : "📹 Sua câmera será testada antes de iniciar a transmissão."
                }
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className={isScheduled ? "" : "bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90"}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isScheduled ? "Agendar Live" : "Iniciar Agora"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Camera, Loader2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { createClient } from "../utils/supabase/client";

interface AvatarUploadProps {
  currentPhotoUrl?: string | null;
  userName: string;
  userId: string;
  onPhotoUploaded: (url: string) => void;
}

export function AvatarUpload({ 
  currentPhotoUrl, 
  userName, 
  userId,
  onPhotoUploaded 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WEBP");
      return;
    }

    setUploading(true);

    try {
      console.log("📤 Iniciando upload via servidor...");

      // Obter token de autenticação do Supabase
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error("❌ Erro ao obter sessão:", sessionError);
        throw new Error("Você precisa estar logado para fazer upload");
      }

      const accessToken = session.access_token;
      console.log("✅ Token de autenticação obtido com sucesso");

      // Usar servidor para fazer upload (contorna RLS)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('type', 'avatar');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/upload-avatar`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro do servidor:", errorData);
        throw new Error(errorData.error || `Upload falhou: ${response.status}`);
      }

      const { url } = await response.json();
      console.log("✅ Upload concluído!");
      console.log("🔗 URL pública:", url);

      setPreviewUrl(url);
      onPhotoUploaded(url);
      
      toast.success("Foto atualizada com sucesso! 📸");
    } catch (error: any) {
      console.error("❌ Erro completo ao fazer upload:", error);
      
      if (error.message?.includes('RLS') || error.message?.includes('row-level security')) {
        toast.error(
          "Erro de permissão. Configure as políticas do Storage no Supabase.",
          { 
            description: "Veja instruções em CORRECOES_LOGIN_E_FOTO.md",
            duration: 8000,
            icon: <AlertCircle className="h-5 w-5" />
          }
        );
      } else if (error.message?.includes('logado')) {
        toast.error("Você precisa estar logado para fazer upload");
      } else {
        toast.error(error.message || "Erro ao fazer upload da foto");
      }
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleRemovePhoto() {
    if (!previewUrl) return;

    try {
      setUploading(true);
      
      // Remover a URL da preview
      setPreviewUrl(null);
      onPhotoUploaded('');
      
      toast.success("Foto removida com sucesso");
    } catch (error: any) {
      console.error("❌ Erro ao remover foto:", error);
      toast.error("Erro ao remover foto");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-4 border-muted">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt={userName} />
          ) : null}
          <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-secondary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {previewUrl && !uploading && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemovePhoto}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="h-4 w-4 mr-2" />
          {previewUrl ? "Trocar Foto" : "Adicionar Foto"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          JPG, PNG ou WEBP (máx. 5MB)
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "./ui/sheet";
import { useIsMobile } from "./ui/use-mobile";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { userApi, authApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { Loader2, User, Shield, Users, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { AvatarUpload } from "./AvatarUpload";
import { Alert, AlertDescription } from "./ui/alert";

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Helpers
function getUserTypeIcon(userType: string) {
  switch (userType) {
    case "athlete":
      return <User className="h-4 w-4" />;
    case "referee":
      return <Shield className="h-4 w-4" />;
    case "federation":
      return <Shield className="h-4 w-4" />;
    case "team":
      return <Users className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
}

function getUserTypeLabel(userType: string) {
  switch (userType) {
    case "athlete":
      return "Atleta";
    case "referee":
      return "Árbitro";
    case "federation":
      return "Federação";
    case "team":
      return "Time";
    case "fan":
      return "Fã";
    default:
      return "Fã";
  }
}

// Componente de conteúdo do formulário (reutilizável)
function ProfileFormContent({
  profile,
  setProfile,
  userId,
  photoUrl,
  setPhotoUrl,
  error,
  fetchingProfile,
  loadProfile,
}: any) {
  if (fetchingProfile) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Nenhum perfil encontrado</p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden px-6"
      style={{
        WebkitOverflowScrolling: "touch",
        minHeight: 0,
        maxHeight: "100%",
      }}
    >
      <div className="space-y-4 py-6">
        {/* Upload de Foto */}
        {userId ? (
          <div className="flex justify-center py-4 border-b">
            <AvatarUpload
              currentPhotoUrl={photoUrl}
              userName={profile?.name || "Usuário"}
              userId={userId}
              onPhotoUploaded={setPhotoUrl}
            />
          </div>
        ) : (
          <div className="flex justify-center py-4 border-b">
            <div className="text-center text-sm text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Não foi possível carregar o uploader de fotos</p>
            </div>
          </div>
        )}

        {/* Tipo de Conta */}
        <div className="space-y-2">
          <Label htmlFor="userType">
            Tipo de Conta
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select
            value={profile.userType}
            onValueChange={(value) => {
              setProfile({ ...profile, userType: value });
            }}
          >
            <SelectTrigger id="userType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fan">🏐 Fã / Torcedor</SelectItem>
              <SelectItem value="athlete">⭐ Atleta</SelectItem>
              <SelectItem value="team">🏆 Time / Clube</SelectItem>
              <SelectItem value="referee">🎯 Árbitro</SelectItem>
              <SelectItem value="federation">🏛️ Federação de Arbitragem</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            💡 Defina o tipo de conta para personalizar sua experiência
          </p>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nome Completo
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="name"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Seu nome completo"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Conte um pouco sobre você..."
            rows={3}
          />
        </div>

        {/* Campos específicos por tipo */}
        {profile.userType === "athlete" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Posição</Label>
                <Select
                  value={profile.position || ""}
                  onValueChange={(value) =>
                    setProfile({ ...profile, position: value })
                  }
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="levantador">Levantador(a)</SelectItem>
                    <SelectItem value="oposto">Oposto(a)</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="ponta">Ponta</SelectItem>
                    <SelectItem value="libero">Líbero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, height: e.target.value })
                  }
                  placeholder="Ex: 185"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentTeam">Equipe Atual</Label>
              <Input
                id="currentTeam"
                value={profile.currentTeam || ""}
                onChange={(e) =>
                  setProfile({ ...profile, currentTeam: e.target.value })
                }
                placeholder="Nome da sua equipe"
              />
            </div>

            {/* Campo CPF - Importante para convocações */}
            <div className="space-y-2">
              <Label htmlFor="cpf">
                CPF
                <span className="text-amber-500 ml-2 text-xs">(Necessário para convocações)</span>
              </Label>
              <Input
                id="cpf"
                value={profile.cpf || ""}
                onChange={(e) => {
                  // Permitir apenas números e limitar a 11 dígitos
                  const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setProfile({ ...profile, cpf: value });
                }}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              <p className="text-xs text-muted-foreground">
                💡 Necessário para times te convocarem para torneios
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={profile.category || ""}
                  onValueChange={(value) =>
                    setProfile({ ...profile, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="amateur">Amador</SelectItem>
                    <SelectItem value="youth">Juvenil</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jerseyNumber">Número da Camisa</Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  value={profile.jerseyNumber || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, jerseyNumber: e.target.value })
                  }
                  placeholder="Ex: 10"
                />
              </div>
            </div>
          </>
        )}

        {profile.userType === "team" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={profile.city || ""}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
                placeholder="Cidade do time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Ano de Fundação</Label>
              <Input
                id="foundedYear"
                type="number"
                value={profile.foundedYear || ""}
                onChange={(e) =>
                  setProfile({ ...profile, foundedYear: e.target.value })
                }
                placeholder="Ex: 2010"
              />
            </div>
          </>
        )}

        {(profile.userType === "referee" || profile.userType === "federation") && (
          <>
            <div className="space-y-2">
              <Label htmlFor="certification">Certificação</Label>
              <Input
                id="certification"
                value={profile.certification || ""}
                onChange={(e) =>
                  setProfile({ ...profile, certification: e.target.value })
                }
                placeholder="Nível de certificação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Região de Atuação</Label>
              <Input
                id="region"
                value={profile.region || ""}
                onChange={(e) =>
                  setProfile({ ...profile, region: e.target.value })
                }
                placeholder="Estado ou região"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone de Contato</Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail de Contato</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="contato@exemplo.com"
              />
            </div>
          </>
        )}

        {/* Localização */}
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={profile.location || ""}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
            placeholder="Cidade, Estado"
          />
        </div>
      </div>
    </div>
  );
}

// Componente wrapper com proteção contra erros
function ProfileEditModalContent({
  open,
  onClose,
  onSuccess,
}: ProfileEditModalProps) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  // Carregar perfil
  const loadProfile = async () => {
    setFetchingProfile(true);
    setError(null);

    try {
      const sessionData = await authApi.getSession();

      if (!sessionData?.user?.id) {
        setError("Usuário não autenticado");
        setFetchingProfile(false);
        return;
      }

      setUserId(sessionData.user.id);

      const userData = await userApi.getUser(sessionData.user.id);

      if (userData) {
        setProfile(userData);
        setPhotoUrl(userData.photoUrl || "");
      } else {
        setError("Perfil não encontrado");
      }
    } catch (err: any) {
      console.error("Erro ao carregar perfil:", err);
      setError(err.message || "Erro ao carregar perfil");
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  // Salvar perfil
  const handleSave = async () => {
    if (!profile || !userId) {
      console.error("❌ Erro: profile ou userId ausente", { profile, userId });
      toast.error("Erro: Dados do perfil não carregados");
      return;
    }

    // Validação básica
    if (!profile.name || profile.name.trim() === "") {
      toast.error("Nome é obrigatório");
      setError("Nome é obrigatório");
      return;
    }

    if (!profile.userType) {
      toast.error("Tipo de conta é obrigatório");
      setError("Tipo de conta é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("💾 [SAVE PROFILE] Iniciando salvamento...", { userId, profile });
      
      const updatedProfile = {
        ...profile,
        photoUrl: photoUrl || profile.photoUrl,
      };

      console.log("💾 [SAVE PROFILE] Chamando API updateUser...");
      const response = await userApi.updateUser(userId, updatedProfile);
      
      console.log("✅ [SAVE PROFILE] Resposta da API:", response);

      toast.success("Perfil atualizado com sucesso! 🎉");

      // Forçar atualização da UI
      if (onSuccess) {
        console.log("✅ [SAVE PROFILE] Chamando onSuccess callback");
        onSuccess();
      }

      // Aguardar um pouco antes de fechar para garantir que a UI atualizou
      setTimeout(() => {
        console.log("✅ [SAVE PROFILE] Fechando modal");
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("❌ [SAVE PROFILE] Erro ao salvar perfil:", err);
      console.error("❌ [SAVE PROFILE] Stack:", err.stack);
      const errorMessage = err.message || "Erro desconhecido ao salvar perfil";
      setError(errorMessage);
      toast.error(`Erro ao atualizar perfil: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar e resetar
  const handleClose = () => {
    setError(null);
    onClose();
  };

  // Renderizar Sheet no mobile
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent
          side="bottom"
          className="h-[95vh] rounded-t-xl flex flex-col p-0 gap-0 overflow-hidden"
          aria-describedby="profile-edit-sheet-description"
        >
          <div className="shrink-0 p-6 pb-4 border-b bg-background/95 backdrop-blur-sm">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-left">
                Editar Perfil
                {profile && (
                  <Badge variant="secondary" className="ml-2">
                    {getUserTypeIcon(profile.userType)}
                    <span className="ml-1">
                      {getUserTypeLabel(profile.userType)}
                    </span>
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription className="text-left" id="profile-edit-sheet-description">
                Atualize suas informações pessoais
              </SheetDescription>
            </SheetHeader>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {error}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={loadProfile}
                    className="ml-2 p-0 h-auto"
                  >
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <ProfileFormContent
            profile={profile}
            setProfile={setProfile}
            userId={userId}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            error={error}
            fetchingProfile={fetchingProfile}
            loadProfile={loadProfile}
          />

          <div className="shrink-0 p-6 pt-4 border-t bg-background/95 backdrop-blur-sm">
            <SheetFooter className="flex flex-col-reverse gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="w-full"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || fetchingProfile || !profile || !!error}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: usar Dialog
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden" aria-describedby="profile-edit-description">
        <div className="shrink-0 p-6 pb-4 border-b bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Editar Perfil
              {profile && (
                <Badge variant="secondary" className="ml-2">
                  {getUserTypeIcon(profile.userType)}
                  <span className="ml-1">
                    {getUserTypeLabel(profile.userType)}
                  </span>
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription id="profile-edit-description">
              Atualize suas informações pessoais
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {error}
                <Button
                  variant="link"
                  size="sm"
                  onClick={loadProfile}
                  className="ml-2 p-0 h-auto"
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <ProfileFormContent
          profile={profile}
          setProfile={setProfile}
          userId={userId}
          photoUrl={photoUrl}
          setPhotoUrl={setPhotoUrl}
          error={error}
          fetchingProfile={fetchingProfile}
          loadProfile={loadProfile}
        />

        <div className="shrink-0 p-6 pt-4 border-t bg-background/95 backdrop-blur-sm">
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || fetchingProfile || !profile || !!error}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente principal com ErrorBoundary
export function ProfileEditModal(props: ProfileEditModalProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when modal is closed/opened
  useEffect(() => {
    if (props.open) {
      setHasError(false);
    }
  }, [props.open]);

  // Capturar erros não tratados
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Erro capturado no ProfileEditModal:", event.error);
      setHasError(true);
      event.preventDefault();
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <Dialog open={props.open} onOpenChange={props.onClose}>
        <DialogContent className="sm:max-w-[500px]" aria-describedby="profile-error-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erro ao Carregar Editor
            </DialogTitle>
            <DialogDescription id="profile-error-description">
              Detalhes do erro ao carregar o editor de perfil
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Ocorreu um erro inesperado ao carregar o editor de perfil.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Possíveis soluções:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Feche e abra o modal novamente</li>
                <li>Faça logout e login novamente</li>
                <li>Limpe o cache do navegador</li>
                <li>Tente em uma janela anônima</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={props.onClose}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Recarregar Página
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <ProfileEditModalContent {...props} />;
}
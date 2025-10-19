import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
import { ScrollArea } from "./ui/scroll-area";
import { AvatarUpload } from "./AvatarUpload";
import { Alert, AlertDescription } from "./ui/alert";

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Componente wrapper com proteção contra erros
function ProfileEditModalContent({ open, onClose, onSuccess }: ProfileEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Form fields básicos
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  // Campos específicos de atletas
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [position, setPosition] = useState("");
  const [currentTeam, setCurrentTeam] = useState("");
  const [teamHistory, setTeamHistory] = useState("");
  const [achievements, setAchievements] = useState("");
  const [cpf, setCpf] = useState("");

  // Campos de contato profissional (árbitros e federações)
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");

  useEffect(() => {
    if (open) {
      setError(null);
      loadProfile();
    }
  }, [open]);

  async function loadProfile() {
    setFetchingProfile(true);
    setError(null);
    
    try {
      // Primeiro, obter o userId de forma assíncrona
      const currentUserId = await authApi.getCurrentUserIdAsync();
      if (!currentUserId) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }
      setUserId(currentUserId);
      
      console.log("📊 Carregando perfil para userId:", currentUserId);
      
      const { profile: userProfile } = await userApi.getCurrentUser();
      console.log("📊 Perfil carregado:", userProfile);
      
      if (!userProfile) {
        throw new Error("Perfil não encontrado");
      }
      
      // Definir tipo de usuário padrão se não existir
      const safeProfile = {
        ...userProfile,
        userType: userProfile.userType || 'fan'
      };
      
      setProfile(safeProfile);
      
      // Campos básicos com valores seguros
      setName(userProfile.name || "");
      setNickname(userProfile.nickname || "");
      setBio(userProfile.bio || "");
      setCity(userProfile.city || "");
      setPhotoUrl(userProfile.photoUrl || "");
      
      // Campos de atleta com valores seguros
      setDateOfBirth(userProfile.dateOfBirth || "");
      setGender(userProfile.gender || "");
      setHeight(userProfile.height?.toString() || "");
      setWeight(userProfile.weight?.toString() || "");
      setPosition(userProfile.position || "");
      setCurrentTeam(userProfile.currentTeam || "");
      
      // Converter arrays para strings (uma linha por item) para edição
      const teamHistoryStr = Array.isArray(userProfile.teamHistory) 
        ? userProfile.teamHistory.join("\n") 
        : (userProfile.teamHistory || "");
      setTeamHistory(teamHistoryStr);
      
      const achievementsStr = Array.isArray(userProfile.achievements)
        ? userProfile.achievements.join("\n")
        : (userProfile.achievements || "");
      setAchievements(achievementsStr);
      
      setCpf(userProfile.cpf || "");

      // Campos de contato profissional (árbitros e federações)
      setContactEmail(userProfile.contactEmail || "");
      setContactPhone(userProfile.contactPhone || "");
      setContactWhatsapp(userProfile.contactWhatsapp || "");
      
    } catch (error: any) {
      console.error("❌ Erro ao carregar perfil:", error);
      const errorMessage = error.message || "Erro ao carregar perfil";
      setError(errorMessage);
      toast.error(errorMessage, {
        description: "Tente novamente ou entre em contato com o suporte"
      });
      
      // Definir perfil vazio mas válido para evitar crashes
      setProfile({ userType: 'fan' });
    } finally {
      setFetchingProfile(false);
    }
  }

  async function handleSave() {
    // Validações
    if (!name.trim()) {
      toast.error("Nome é obrigatório", {
        description: "Por favor, preencha seu nome"
      });
      return;
    }
    
    if (!profile) {
      toast.error("Erro ao salvar", {
        description: "Perfil não carregado. Tente fechar e abrir novamente."
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const updates: any = {
        name: name.trim(),
        city: city.trim() || null,
        bio: bio.trim() || null,
        photoUrl: photoUrl || null,
        userType: profile.userType || 'fan',
      };

      // Campos específicos por tipo de usuário
      if (profile.userType === 'athlete') {
        updates.nickname = nickname.trim() || null;
        updates.dateOfBirth = dateOfBirth || null;
        updates.gender = gender || null;
        
        // Converter altura e peso para número com base 10
        const heightNum = height ? parseInt(height, 10) : null;
        const weightNum = weight ? parseFloat(weight) : null;
        
        console.log('🔢 Convertendo altura:', height, '->', heightNum);
        console.log('🔢 Convertendo peso:', weight, '->', weightNum);
        
        updates.height = heightNum;
        updates.weight = weightNum;
        updates.position = position || null;
        // currentTeam é preenchido automaticamente quando aceita convite de time
        // NÃO permitir edição manual
        
        // Converter strings de volta para arrays (uma linha = um item)
        // Remover linhas vazias e fazer trim em cada item
        const teamHistoryArray = teamHistory
          ? teamHistory.split("\n").map(item => item.trim()).filter(item => item.length > 0)
          : [];
        updates.teamHistory = teamHistoryArray.length > 0 ? teamHistoryArray : null;
        
        const achievementsArray = achievements
          ? achievements.split("\n").map(item => item.trim()).filter(item => item.length > 0)
          : [];
        updates.achievements = achievementsArray.length > 0 ? achievementsArray : null;
        
        updates.cpf = cpf.trim() || null;
      }

      // Campos de contato profissional (árbitros e federações)
      if (profile.userType === 'referee' || profile.userType === 'federation') {
        updates.contactEmail = contactEmail.trim() || null;
        updates.contactPhone = contactPhone.trim() || null;
        updates.contactWhatsapp = contactWhatsapp.trim() || null;
      }

      console.log("💾 Salvando perfil completo:", updates);
      
      const { profile: updatedProfile } = await userApi.updateCurrentUser(updates);
      console.log("✅ Perfil atualizado:", updatedProfile);
      
      toast.success("Perfil atualizado com sucesso! 🎉", {
        description: "Suas informações foram salvas"
      });
      
      // Disparar evento para atualizar sidebar e outros componentes
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("❌ Erro ao salvar perfil:", error);
      const errorMessage = error.message || "Erro ao salvar perfil";
      setError(errorMessage);
      toast.error("Erro ao salvar perfil", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'athlete': return 'Atleta';
      case 'team': return 'Time';
      case 'fan': return 'Fã/Torcedor';
      case 'referee': return 'Árbitro';
      case 'federation': return 'Federação';
      default: return type;
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'athlete': return <User className="h-4 w-4" />;
      case 'team': return <Shield className="h-4 w-4" />;
      case 'fan': return <Users className="h-4 w-4" />;
      case 'referee': return <User className="h-4 w-4" />;
      case 'federation': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Função para fechar e resetar
  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]" aria-describedby="profile-edit-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Editar Perfil
            {profile && (
              <Badge variant="secondary" className="ml-2">
                {getUserTypeIcon(profile.userType)}
                <span className="ml-1">{getUserTypeLabel(profile.userType)}</span>
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription id="profile-edit-description">
            Atualize suas informações pessoais
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
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

        {fetchingProfile ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando perfil...</p>
          </div>
        ) : profile ? (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              {/* Upload de Foto */}
              {userId ? (
                <div className="flex justify-center py-4 border-b">
                  <AvatarUpload
                    currentPhotoUrl={photoUrl}
                    userName={name || profile?.name || "Usuário"}
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
                  {profile.userType === 'athlete' && 'Nome Completo'}
                  {profile.userType === 'team' && 'Nome do Time/Clube'}
                  {profile.userType === 'federation' && 'Nome da Federação'}
                  {profile.userType === 'referee' && 'Nome Completo'}
                  {(!profile.userType || profile.userType === 'fan') && 'Seu Nome'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={
                    profile.userType === 'athlete' ? "Ex: Maria Santos" :
                    profile.userType === 'team' ? "Ex: Vôlei Clube São Paulo" :
                    profile.userType === 'federation' ? "Ex: Federação Paulista de Arbitragem" :
                    profile.userType === 'referee' ? "Ex: João Silva" :
                    "Ex: João Silva"
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Apelido (só para atletas) */}
              {profile.userType === 'athlete' && (
                <div className="space-y-2">
                  <Label htmlFor="nickname">
                    Apelido
                    <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
                  </Label>
                  <Input
                    id="nickname"
                    placeholder="Ex: Maju, Bruninho, Giba..."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Como você é conhecido(a) nas quadras. Se preenchido, será exibido no lugar do nome.
                  </p>
                </div>
              )}

              {/* Campos específicos de atletas */}
              {profile.userType === 'athlete' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Data de Nascimento */}
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    </div>

                    {/* Sexo */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">Sexo</Label>
                      <Select value={gender || undefined} onValueChange={setGender}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Feminino</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Altura */}
                    <div className="space-y-2">
                      <Label htmlFor="height">Altura (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        min="100"
                        max="250"
                        placeholder="Ex: 185"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>

                    {/* Peso */}
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="40"
                        max="200"
                        step="0.1"
                        placeholder="Ex: 75"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Posição */}
                  <div className="space-y-2">
                    <Label htmlFor="position">Posição</Label>
                    <Select value={position || undefined} onValueChange={setPosition}>
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Selecione sua posição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Levantador">Levantador</SelectItem>
                        <SelectItem value="Ponteiro">Ponteiro</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Oposto">Oposto</SelectItem>
                        <SelectItem value="Líbero">Líbero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Atual - BLOQUEADO */}
                  <div className="space-y-2">
                    <Label htmlFor="currentTeam">
                      Time Atual
                      <span className="text-xs text-muted-foreground ml-2">(automático)</span>
                    </Label>
                    <Input
                      id="currentTeam"
                      placeholder="Aguardando convocação de um time..."
                      value={currentTeam}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        🏐 <strong>Este campo é preenchido automaticamente</strong> quando você for convocado e aceitar o convite de um time.
                      </p>
                    </div>
                  </div>

                  {/* Histórico de Times */}
                  <div className="space-y-2">
                    <Label htmlFor="teamHistory">Histórico de Times Anteriores</Label>
                    <Textarea
                      id="teamHistory"
                      placeholder="Sesi-SP (2018-2020)
Flamengo (2020-2022)
Minas Tênis Clube (2022-2023)"
                      value={teamHistory}
                      onChange={(e) => setTeamHistory(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Digite um time por linha. Cada linha será exibida separadamente no seu perfil.
                    </p>
                  </div>

                  {/* Conquistas */}
                  <div className="space-y-2">
                    <Label htmlFor="achievements">Conquistas</Label>
                    <Textarea
                      id="achievements"
                      placeholder="Campeão Paulista 2021
Medalha de Bronze Sul-Americano 2022
MVP do Torneio Regional 2023"
                      value={achievements}
                      onChange={(e) => setAchievements(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Digite uma conquista por linha. Cada linha será exibida separadamente no seu perfil.
                    </p>
                  </div>

                  {/* CPF */}
                  <div className="space-y-2">
                    <Label htmlFor="cpf">
                      CPF
                      <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
                    </Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      maxLength={14}
                    />
                    <p className="text-xs text-muted-foreground">
                      🔒 Usado apenas para participação em times ou torneios oficiais
                    </p>
                  </div>
                </>
              )}

              {/* Contatos Profissionais (árbitros e federações) */}
              {(profile.userType === 'referee' || profile.userType === 'federation') && (
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <Label className="text-base">
                      Contatos para Trabalhos de Arbitragem
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2">
                    💡 Estes contatos serão exibidos para times e organizadores de torneios
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contato Profissional</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contato@exemplo.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Telefone de Contato</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="(11) 98888-7777"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactWhatsapp">WhatsApp</Label>
                      <Input
                        id="contactWhatsapp"
                        type="tel"
                        placeholder="(11) 98888-7777"
                        value={contactWhatsapp}
                        onChange={(e) => setContactWhatsapp(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        ✅ Recomendado para contato rápido sobre trabalhos
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cidade (todos os tipos) */}
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo, SP"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {/* Bio (todos os tipos) */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Sobre</Label>
                <Textarea
                  id="bio"
                  placeholder={
                    profile.userType === 'athlete' ? "Conte um pouco sobre sua carreira e objetivos..." :
                    profile.userType === 'team' ? "Apresente seu time ou clube..." :
                    profile.userType === 'referee' ? "Conte sobre sua experiência como árbitro..." :
                    profile.userType === 'federation' ? "Apresente sua federação de arbitragem..." :
                    "Conte um pouco sobre você..."
                  }
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Erro ao carregar perfil</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || fetchingProfile || !profile || !!error}
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
      console.error('❌ Erro não capturado no ProfileEditModal:', event.error);
      setHasError(true);
      toast.error('Erro inesperado', {
        description: 'Tente fechar e abrir o modal novamente'
      });
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <Dialog open={props.open} onOpenChange={props.onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erro ao Carregar Editor
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Ocorreu um erro inesperado ao carregar o editor de perfil.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Possíveis soluções:</strong></p>
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
            <Button onClick={() => {
              setHasError(false);
              window.location.reload();
            }}>
              Recarregar Página
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return <ProfileEditModalContent {...props} />;
}

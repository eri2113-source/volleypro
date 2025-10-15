import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trophy, Calendar, Ruler, Weight, Users, MapPin, Shield, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { userApi, masterAdminApi } from "../lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatHeight, formatWeight } from "../utils/formatters";

interface MyProfileProps {
  onBack: () => void;
  onEditProfile: () => void;
}

export function MyProfile({ onBack, onEditProfile }: MyProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    loadProfile();
    checkMasterStatus();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      console.log("🔄 Carregando perfil do usuário...");
      const { profile: userProfile } = await userApi.getCurrentUser();
      console.log("📊 Meu perfil carregado:", userProfile);
      console.log("📸 Photo URL:", userProfile?.photoUrl);
      console.log("📊 Followers:", userProfile?.followers, "| Following:", userProfile?.following);
      setProfile(userProfile);
    } catch (error: any) {
      console.error("❌ Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil", {
        description: error.message || "Tente fazer login novamente"
      });
    } finally {
      setLoading(false);
    }
  }

  async function checkMasterStatus() {
    try {
      const { isMaster: masterStatus } = await masterAdminApi.checkMasterStatus();
      setIsMaster(masterStatus);
      if (masterStatus) {
        console.log("👑 MASTER USER no perfil!");
      }
    } catch (error: any) {
      // Silenciar erros - não é crítico
      setIsMaster(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Perfil não encontrado</p>
          <Button onClick={onBack}>Voltar</Button>
        </div>
      </div>
    );
  }

  const displayName = profile.nickname || profile.name;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  
  // Calcular idade se tiver data de nascimento
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="bg-gradient-to-br from-primary via-primary to-secondary pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto py-6 relative z-10">
          <Button variant="ghost" onClick={onBack} className="mb-6 text-white hover:bg-white/20 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-start gap-8">
            <Avatar className="h-40 w-40 border-4 border-white shadow-2xl ring-4 ring-white/20">
              {profile.photoUrl ? (
                <AvatarImage 
                  src={profile.photoUrl} 
                  alt={displayName}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="text-4xl bg-gradient-to-br from-white to-gray-100 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-white">{displayName}</h1>
                    {profile.nickname && profile.name !== profile.nickname && (
                      <span className="text-white/80 text-lg">({profile.name})</span>
                    )}
                    {isMaster && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-0 shadow-lg">
                        <Crown className="h-3 w-3 mr-1" />
                        MASTER
                      </Badge>
                    )}
                  </div>
                  {profile.userType === 'athlete' && profile.position && (
                    <p className="text-white/90 text-xl">{profile.position}</p>
                  )}
                  {profile.currentTeam && (
                    <p className="text-white/80 flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      {profile.currentTeam}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={onEditProfile}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>

              {profile.city && (
                <Badge variant="secondary" className="mb-4">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profile.city}
                </Badge>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.userType === 'athlete' && (
                  <>
                    {age && (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Calendar className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground text-sm">Idade</p>
                          <p className="text-2xl">{age}</p>
                        </CardContent>
                      </Card>
                    )}
                    {profile.height && (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Ruler className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground text-sm">Altura</p>
                          <p className="text-2xl">{formatHeight(profile.height)}</p>
                        </CardContent>
                      </Card>
                    )}
                    {profile.weight && (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Weight className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground text-sm">Peso</p>
                          <p className="text-2xl">{formatWeight(profile.weight)}</p>
                        </CardContent>
                      </Card>
                    )}
                    {profile.gender && (
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground text-sm">Sexo</p>
                          <p className="text-2xl">
                            {profile.gender === 'M' ? 'M' : profile.gender === 'F' ? 'F' : profile.gender}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto -mt-24">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            {profile.userType === 'athlete' && (
              <>
                <TabsTrigger value="history">Histórico</TabsTrigger>
                <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <h3>Sobre</h3>
              </CardHeader>
              <CardContent>
                {profile.bio ? (
                  <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nenhuma biografia adicionada. Clique em "Editar Perfil" para adicionar.
                  </p>
                )}
              </CardContent>
            </Card>

            {profile.userType === 'athlete' && (
              <Card>
                <CardHeader>
                  <h3>Informações do Atleta</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome Completo</p>
                      <p>{profile.name}</p>
                    </div>
                    {profile.nickname && (
                      <div>
                        <p className="text-sm text-muted-foreground">Apelido</p>
                        <p>{profile.nickname}</p>
                      </div>
                    )}
                    {profile.position && (
                      <div>
                        <p className="text-sm text-muted-foreground">Posição</p>
                        <p>{profile.position}</p>
                      </div>
                    )}
                    {profile.currentTeam && (
                      <div>
                        <p className="text-sm text-muted-foreground">Time Atual</p>
                        <p>{profile.currentTeam}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {profile.userType === 'athlete' && (
            <>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h3>Histórico de Times</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profile.teamHistory ? (
                      <p className="text-muted-foreground whitespace-pre-wrap">{profile.teamHistory}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Nenhum histórico adicionado. Adicione seus times anteriores em "Editar Perfil".
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <h3>Conquistas e Títulos</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {profile.achievements ? (
                      <p className="text-muted-foreground whitespace-pre-wrap">{profile.achievements}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Nenhuma conquista adicionada. Adicione seus títulos em "Editar Perfil".
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}

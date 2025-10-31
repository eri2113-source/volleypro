import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Users, Heart, MessageCircle, Share2, Trophy, BarChart3, Camera, MessageSquare, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { userApi, postApi, authApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { Loader2 } from "lucide-react";
import { ReactionDisplay } from "./ReactionPicker";
import { ImageViewerModal } from "./ImageViewerModal";
import { ProfileEditModal } from "./ProfileEditModal";

interface AthleteProfileProps {
  athleteId: number;
  onBack: () => void;
}

interface AthleteData {
  id: number;
  name: string;
  nickname?: string;
  position?: string;
  age?: number;
  height?: string;
  weight?: number;
  currentTeam?: string;
  verified?: boolean;
  followers?: number;
  photoUrl?: string;
  bio?: string;
  achievements?: string[];
  userType: string;
  city?: string;
  following?: number;
}

export function AthleteProfile({ athleteId, onBack }: AthleteProfileProps) {
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postReactions, setPostReactions] = useState<{ [postId: string]: { [emoji: string]: number } }>({});
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleImageClick = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
    setImageViewerOpen(true);
  };

  useEffect(() => {
    loadAthleteData();
    checkIfFollowing();
    checkCurrentUser();
  }, [athleteId]);

  async function checkCurrentUser() {
    try {
      const session = await authApi.getSession();
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário atual:', error);
    }
  }

  async function loadAthleteData() {
    setLoadingProfile(true);
    try {
      console.log('🔍 Buscando perfil do atleta ID:', athleteId);
      
      // Buscar perfil REAL do usuário via API
      const userData = await userApi.getUser(athleteId.toString());
      
      console.log('✅ Dados do atleta carregados:', userData);
      
      // Mapear dados da API para o formato esperado
      const athleteProfile: AthleteData = {
        id: userData.id || athleteId,
        name: userData.name || userData.full_name || 'Atleta',
        nickname: userData.nickname,
        position: userData.position || 'Não informado',
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
        currentTeam: userData.currentTeam || userData.current_team || userData.team,
        verified: userData.verified || false,
        followers: userData.followers || 0,
        following: userData.following || 0,
        photoUrl: userData.photo_url || userData.photoUrl,
        bio: userData.bio || userData.description,
        achievements: userData.achievements || [],
        userType: userData.userType || userData.user_type || 'athlete',
        city: userData.city || userData.location
      };
      
      setAthlete(athleteProfile);
    } catch (error) {
      console.error('❌ Erro ao carregar perfil do atleta:', error);
      toast.error('Erro ao carregar perfil do atleta');
      setAthlete(null);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function checkIfFollowing() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following') || '[]');
      setIsFollowing(followingList.includes(athleteId.toString()));
    } catch (error) {
      console.error('Erro ao verificar seguindo:', error);
    }
  }

  async function handleFollowToggle() {
    try {
      const followingList = JSON.parse(localStorage.getItem('volleypro_following') || '[]');
      
      if (isFollowing) {
        // Deixar de seguir
        const newList = followingList.filter((id: string) => id !== athleteId.toString());
        localStorage.setItem('volleypro_following', JSON.stringify(newList));
        setIsFollowing(false);
        
        if (athlete) {
          setAthlete({
            ...athlete,
            followers: Math.max(0, (athlete.followers || 0) - 1)
          });
        }
        
        toast.success('Você deixou de seguir este atleta');
      } else {
        // Seguir
        followingList.push(athleteId.toString());
        localStorage.setItem('volleypro_following', JSON.stringify(followingList));
        setIsFollowing(true);
        
        if (athlete) {
          setAthlete({
            ...athlete,
            followers: (athlete.followers || 0) + 1
          });
        }
        
        toast.success(`Você agora segue ${athlete?.nickname || athlete?.name}! 🎉`);
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      toast.error('Erro ao processar ação');
    }
  }

  async function loadUserPosts() {
    if (loadingPosts) return; // Evitar chamadas duplicadas
    
    setLoadingPosts(true);
    try {
      let filteredPosts = [];
      
      try {
        // Tentar buscar todos os posts primeiro (mais confiável)
        const response = await postApi.getPosts();
        
        if (response && response.posts && Array.isArray(response.posts)) {
          filteredPosts = response.posts.filter((post: any) => 
            post && post.authorId === athleteId.toString()
          );
        }
      } catch (error) {
        console.log('Erro ao buscar posts, usando array vazio');
        filteredPosts = [];
      }
      
      setUserPosts(filteredPosts);
      
      // Carregar reações salvas do localStorage (com proteção)
      try {
        const savedReactions = localStorage.getItem('volleypro_post_reactions');
        if (savedReactions) {
          const parsed = JSON.parse(savedReactions);
          setPostReactions(parsed || {});
        }
      } catch (error) {
        // Ignorar erro silenciosamente
      }
    } catch (error) {
      console.error('Erro ao carregar posts do usuário:', error);
      setUserPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <p className="text-lg text-muted-foreground mb-4">Atleta não encontrado</p>
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 shadow-lg">
        <div className="container mx-auto max-w-5xl">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar 
              className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-white/20 shadow-2xl cursor-pointer hover:ring-white/40 transition-all"
              onClick={() => athlete.photoUrl && handleImageClick(athlete.photoUrl, athlete.name)}
            >
              <AvatarImage src={athlete.photoUrl} alt={athlete.name} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-white/20 text-white">
                {athlete.name?.[0]?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h1 className="text-white text-2xl sm:text-3xl">
                  {athlete.nickname || athlete.name}
                </h1>
                {athlete.verified && (
                  <Badge className="bg-white/20 text-white">
                    ✓ Verificado
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                {athlete.position && (
                  <Badge className="bg-white/20 text-white">
                    {athlete.position}
                  </Badge>
                )}
                {athlete.currentTeam && (
                  <Badge className="bg-white/20 text-white">
                    {athlete.currentTeam}
                  </Badge>
                )}
              </div>

              {athlete.city && (
                <div className="flex items-center gap-1 text-white/90 justify-center sm:justify-start mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{athlete.city}</span>
                </div>
              )}

              <div className="flex gap-6 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-white text-xl">{athlete.followers || 0}</p>
                  <p className="text-white/80 text-sm">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-xl">{athlete.following || 0}</p>
                  <p className="text-white/80 text-sm">Seguindo</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Se é o próprio perfil, mostrar botão Editar Perfil */}
              {currentUserId && athleteId.toString() === currentUserId ? (
                <Button
                  onClick={() => setEditModalOpen(true)}
                  variant="default"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleFollowToggle}
                    variant={isFollowing ? "secondary" : "default"}
                    className={isFollowing ? "bg-white/20 text-white hover:bg-white/30" : "bg-white text-primary hover:bg-white/90"}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                  <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mensagem
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto max-w-5xl p-6">
        <Tabs defaultValue="about" className="space-y-6" onValueChange={(value) => {
          if (value === "posts" && userPosts.length === 0 && !loadingPosts) {
            loadUserPosts();
          }
        }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <h3>Biografia</h3>
              </CardHeader>
              <CardContent>
                {athlete.bio ? (
                  <p className="text-muted-foreground whitespace-pre-wrap">{athlete.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nenhuma biografia adicionada.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3>Informações</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p>{athlete.name}</p>
                  </div>
                  {athlete.nickname && (
                    <div>
                      <p className="text-sm text-muted-foreground">Apelido</p>
                      <p>{athlete.nickname}</p>
                    </div>
                  )}
                  {athlete.position && (
                    <div>
                      <p className="text-sm text-muted-foreground">Posição</p>
                      <p>{athlete.position}</p>
                    </div>
                  )}
                  {athlete.currentTeam && (
                    <div>
                      <p className="text-sm text-muted-foreground">Equipe Atual</p>
                      <p>{athlete.currentTeam}</p>
                    </div>
                  )}
                  {athlete.age && (
                    <div>
                      <p className="text-sm text-muted-foreground">Idade</p>
                      <p>{athlete.age} anos</p>
                    </div>
                  )}
                  {athlete.height && (
                    <div>
                      <p className="text-sm text-muted-foreground">Altura</p>
                      <p>{athlete.height}</p>
                    </div>
                  )}
                  {athlete.city && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cidade</p>
                      <p>{athlete.city}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            {loadingPosts ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={athlete?.photoUrl} alt={athlete?.name} />
                          <AvatarFallback>{athlete?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{athlete?.name}</p>
                            {athlete?.verified && (
                              <Badge variant="default" className="h-5 px-1.5 text-xs">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.timestamp).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {post.content && (
                        <p className="whitespace-pre-wrap">{post.content}</p>
                      )}
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl} 
                          alt="Post" 
                          className="w-full rounded-lg object-cover max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleImageClick(post.imageUrl, 'Post')}
                        />
                      )}
                      {post.videoUrl && (
                        <video 
                          src={post.videoUrl} 
                          controls 
                          className="w-full rounded-lg max-h-96"
                        />
                      )}
                      
                      {/* Reações */}
                      <div className="flex items-center gap-4 pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-muted-foreground" />
                          {postReactions[post.id] && (
                            <ReactionDisplay reactions={postReactions[post.id]} />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-5 w-5" />
                          <span className="text-sm">{post.commentsCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Share2 className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhuma publicação ainda</p>
                  <p className="text-muted-foreground">
                    {athlete?.name} ainda não fez nenhuma publicação.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3>Estatísticas</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  Estatísticas de jogos serão exibidas aqui em breve.
                </p>
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
                {athlete.achievements && athlete.achievements.length > 0 ? (
                  <ul className="space-y-2">
                    {athlete.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Trophy className="h-4 w-4 text-amber-500 mt-1" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nenhuma conquista registrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de visualização de imagem */}
      {selectedImage && (
        <ImageViewerModal
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
        />
      )}

      {/* Modal de edição de perfil */}
      <ProfileEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          loadAthleteData(); // Recarregar dados do perfil após edição
          toast.success("Perfil atualizado com sucesso! 🎉");
        }}
      />
    </div>
  );
}
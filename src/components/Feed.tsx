import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video as VideoIcon, MessageSquare, X, Upload, Link2, Facebook, Twitter, Copy, Check, Smile, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useState, useEffect, useRef } from "react";
import { ReactionPicker, ReactionDisplay, VOLLEYBALL_REACTIONS } from "./ReactionPicker";
import { ContentInspirationModal } from "./ContentInspirationModal";
import { UpgradeBanner } from "./UpgradeBanner";
import { AdDisplay } from "./AdDisplay";
import { useUserPlan } from "../hooks/useUserPlan";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { postApi, authApi, userApi, masterAdminApi } from "../lib/api";
import { uploadMediaOptimized } from "../lib/api-optimized";
import { toast } from "sonner@2.0.3";
import { Trash2, Shield } from "lucide-react";

interface FeedProps {
  isAuthenticated?: boolean;
  onLoginPrompt?: () => void;
  onSelectAthlete?: (athleteId: number) => void;
}

export function Feed({ isAuthenticated = false, onLoginPrompt, onSelectAthlete }: FeedProps) {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMaster, setIsMaster] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Comments state
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{ [postId: string]: any[] }>({});
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  
  // Share state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPostForShare, setSelectedPostForShare] = useState<any>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Reactions state
  const [reactionPickerOpen, setReactionPickerOpen] = useState<string | null>(null);
  const [postReactions, setPostReactions] = useState<{ [postId: string]: { [emoji: string]: number } }>({});
  const [userReactions, setUserReactions] = useState<{ [postId: string]: string }>({});
  
  // Confirmation dialog for removing reaction
  const [confirmRemoveReaction, setConfirmRemoveReaction] = useState<{
    postId: string;
    emoji: string;
  } | null>(null);
  
  // Confirmation dialog for deleting post
  const [confirmDeletePost, setConfirmDeletePost] = useState<{
    postId: string;
    authorName: string;
  } | null>(null);
  
  // Content Inspiration
  const [showInspirationModal, setShowInspirationModal] = useState(false);
  
  // User plan
  const { plan: userPlan, isLoading: planLoading } = useUserPlan();

  console.log("📊 Feed - isAuthenticated:", isAuthenticated);

  useEffect(() => {
    loadPosts();
    if (isAuthenticated) {
      loadCurrentUser();
      checkMasterStatus();
    }
  }, [isAuthenticated]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: any) => {
      console.log("🔄 Perfil atualizado - atualizando Feed...");
      setCurrentUser(event.detail);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  async function loadPosts() {
    setIsLoadingPosts(true);
    try {
      const { posts: apiPosts } = await postApi.getPosts();
      console.log("📝 Posts carregados:", apiPosts?.length || 0);
      
      // Usar apenas posts reais de usuários
      const userPosts = Array.isArray(apiPosts) ? apiPosts : [];
      
      // Ordenar por data (mais recente primeiro)
      userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setPosts(userPosts);
      console.log("📰 Posts totais:", userPosts.length);
      
      // ✅ CARREGAR REAÇÕES DO LOCALSTORAGE (persistentes)
      try {
        const savedReactions = localStorage.getItem('volleypro_post_reactions');
        const savedUserReactions = localStorage.getItem('volleypro_user_reactions');
        
        if (savedReactions) {
          const parsedReactions = JSON.parse(savedReactions);
          setPostReactions(parsedReactions);
          console.log('✅ Reações carregadas do cache:', Object.keys(parsedReactions).length, 'posts');
        } else {
          // 🆕 Se não há reações salvas, inicializar com exemplos para incentivar engajamento
          const initialReactions: { [postId: string]: { [emoji: string]: number } } = {};
          userPosts.slice(0, 5).forEach((post, index) => {
            // Adicionar reações de exemplo nos primeiros posts
            initialReactions[post.id] = {
              '🏐': Math.floor(Math.random() * 8) + 3, // 3-10 reações
              '🔥': Math.floor(Math.random() * 5) + 2, // 2-6 reações
              '💪': Math.floor(Math.random() * 4) + 1, // 1-4 reações
            };
          });
          setPostReactions(initialReactions);
          localStorage.setItem('volleypro_post_reactions', JSON.stringify(initialReactions));
          console.log('🎉 Reações iniciais criadas para incentivar engajamento');
        }
        
        if (savedUserReactions) {
          const parsedUserReactions = JSON.parse(savedUserReactions);
          setUserReactions(parsedUserReactions);
          console.log('✅ Reações do usuário carregadas:', Object.keys(parsedUserReactions).length, 'posts');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar reações do cache:', error);
      }
    } catch (error: any) {
      // Detectar se está no Figma Make ou offline
      const isFigmaMake = window.location.hostname.includes('figma') || 
                          window.location.hostname.includes('localhost');
      const isNetworkError = error.message?.includes('conexão') || 
                             error.message?.includes('Mock data');
      
      // Não logar erros no Figma Make (modo de visualização)
      if (!isFigmaMake && !isNetworkError) {
        console.error("❌ Erro ao carregar posts:", error);
      } else {
        console.log("🎨 Modo visualização - usando dados de exemplo");
      }
      
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function loadCurrentUser() {
    try {
      const { profile } = await userApi.getCurrentUser();
      setCurrentUser(profile);
      
      // Salvar no cache
      if (profile) {
        try {
          localStorage.setItem('volleypro_cached_profile', JSON.stringify(profile));
        } catch (e) {
          // Ignorar erro de quota
        }
      }
    } catch (error: any) {
      // Detectar se está no Figma Make
      const isFigmaMake = window.location.hostname.includes('figma') || 
                          window.location.hostname.includes('localhost');
      
      // Não mostrar erro se for problema de rede ou Figma Make
      const isNetworkError = 
        error.message?.includes('conexão') || 
        error.message?.includes('Tempo limite') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Mock data') ||
        error.name === 'TypeError';
      
      if (!isNetworkError && !isFigmaMake) {
        console.error("❌ Erro ao carregar usuário:", error);
      } else if (isFigmaMake) {
        console.log("🎨 Modo visualização - perfil de exemplo");
      }
      
      // Tentar usar cache
      try {
        const cachedProfile = localStorage.getItem('volleypro_cached_profile');
        if (cachedProfile) {
          setCurrentUser(JSON.parse(cachedProfile));
        }
      } catch (e) {
        // Ignorar erro de cache
      }
    }
  }

  async function checkMasterStatus() {
    try {
      const { isMaster: masterStatus } = await masterAdminApi.checkMasterStatus();
      setIsMaster(masterStatus);
      if (masterStatus) {
        console.log("👑 MASTER USER detected!");
      }
    } catch (error: any) {
      // Silenciar TODOS os erros de master status
      // Não é crítico para o funcionamento do app
      setIsMaster(false);
    }
  }

  function openDeleteConfirmation(post: any) {
    if (!isMaster && currentUser?.id !== post.authorId) {
      toast.error("Você não tem permissão para excluir esta postagem");
      return;
    }
    
    setConfirmDeletePost({
      postId: post.id,
      authorName: post.authorName
    });
  }

  async function confirmPostDeletion() {
    if (!confirmDeletePost) return;

    try {
      if (isMaster) {
        await masterAdminApi.deletePost(confirmDeletePost.postId);
      } else {
        // Se não for master, usar API normal de posts
        await postApi.deletePost(confirmDeletePost.postId);
      }
      
      toast.success("🗑️ Postagem excluída com sucesso!");
      setConfirmDeletePost(null);
      await loadPosts();
    } catch (error: any) {
      console.error("❌ Erro ao deletar post:", error);
      toast.error(error.message || "Erro ao excluir postagem");
    }
  }

  function handleMediaSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use JPEG, PNG, GIF, WEBP, AVIF, MP4 ou WEBM.");
      return;
    }

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Tamanho máximo: 50MB");
      return;
    }

    setSelectedMedia(file);
    
    // Create preview URL
    const preview = URL.createObjectURL(file);
    setMediaPreview(preview);
  }

  function removeMedia() {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setSelectedMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleCreatePost() {
    console.log("🚀 handleCreatePost chamado - Auth:", isAuthenticated, "Content:", newPost.trim());
    
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para publicar");
      if (onLoginPrompt) onLoginPrompt();
      return;
    }

    if (!newPost.trim() && !selectedMedia) {
      toast.error("Digite algo ou adicione uma mídia para publicar");
      return;
    }

    setLoading(true);
    setUploading(true);
    
    try {
      let mediaUrl = null;
      let mediaType = null;

      // Upload media if selected
      if (selectedMedia) {
        const isVideo = selectedMedia.type.startsWith('video/');
        const fileSize = (selectedMedia.size / 1024 / 1024).toFixed(2);
        
        console.log(`📤 Iniciando upload de ${isVideo ? 'vídeo' : 'imagem'} (${fileSize} MB)...`);
        
        if (isVideo) {
          toast.info(`Enviando vídeo... Aguarde (${fileSize} MB)`, {
            duration: 5000,
          });
        }
        
        // ⚡ Upload otimizado (compressão + CDN externa)
        const uploadResult = await uploadMediaOptimized(selectedMedia);
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.mediaType;
        console.log("✅ Upload concluído:", mediaType, mediaUrl.substring(0, 50) + "...");
        
        toast.success(`${isVideo ? 'Vídeo' : 'Imagem'} enviado com sucesso!`);
      }

      // Create post
      console.log("📝 Criando postagem...");
      const { post } = await postApi.createPost(newPost, mediaType, mediaUrl);
      console.log("✅ Post criado com ID:", post.id);
      
      setPosts([post, ...posts]);
      setNewPost("");
      removeMedia();
      
      toast.success("Publicação criada com sucesso! 🎉");
    } catch (error: any) {
      console.error("❌ Erro ao criar post:", error);
      
      // Mensagens de erro mais específicas
      if (error.message?.includes('Upload muito demorado')) {
        toast.error("Upload muito demorado. Tente um arquivo menor.", {
          description: "Vídeos muito grandes podem demorar. Recomendamos até 20MB.",
          duration: 6000,
        });
      } else if (error.message?.includes('conexão')) {
        toast.error("Erro de conexão", {
          description: "Verifique sua internet e tente novamente.",
          duration: 5000,
        });
      } else if (error.message?.includes('autenticado')) {
        toast.error("Sessão expirada", {
          description: "Faça login novamente para continuar.",
          duration: 5000,
        });
        if (onLoginPrompt) onLoginPrompt();
      } else {
        toast.error("Erro ao criar publicação", {
          description: error.message || "Tente novamente em alguns instantes.",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  async function handleLike(postId: string) {
    console.log("❤️ handleLike chamado - Auth:", isAuthenticated, "PostID:", postId);
    
    // Se não autenticado, mostra prompt
    if (!isAuthenticated) {
      toast.error("Faça login para curtir publicações", {
        action: onLoginPrompt ? {
          label: "Entrar",
          onClick: onLoginPrompt
        } : undefined
      });
      return;
    }

    // Abre o reaction picker ao invés de curtir direto
    setReactionPickerOpen(postId);
  }

  async function handleReaction(postId: string, emoji: string, skipConfirmation: boolean = false) {
    console.log("😊 handleReaction chamado:", { postId, emoji, isAuthenticated });
    
    if (!isAuthenticated) {
      toast.error("Faça login para reagir", {
        action: onLoginPrompt ? {
          label: "Entrar",
          onClick: onLoginPrompt
        } : undefined
      });
      return;
    }

    try {
      // Garantir que o post existe no estado de reações
      if (!postReactions[postId]) {
        console.log("⚠️ Post não tem reações inicializadas, criando...");
        setPostReactions(prev => ({
          ...prev,
          [postId]: {}
        }));
      }

      // Atualização otimista
      const currentUserReaction = userReactions[postId];
      const currentReactions = postReactions[postId] || {};
      
      // Se o usuário já reagiu com o mesmo emoji, pedir confirmação antes de remover
      if (currentUserReaction === emoji) {
        if (!skipConfirmation) {
          // Mostrar diálogo de confirmação
          setConfirmRemoveReaction({ postId, emoji });
          return;
        }
        
        // Se passou a confirmação, remover a reação
        setUserReactions(prev => {
          const newReactions = { ...prev };
          delete newReactions[postId];
          // ✅ SALVAR NO LOCALSTORAGE
          try {
            localStorage.setItem('volleypro_user_reactions', JSON.stringify(newReactions));
          } catch (e) {
            console.error('Erro ao salvar reações do usuário:', e);
          }
          return newReactions;
        });
        
        setPostReactions(prev => {
          const updated = {
            ...prev,
            [postId]: {
              ...currentReactions,
              [emoji]: Math.max(0, (currentReactions[emoji] || 0) - 1)
            }
          };
          // ✅ SALVAR NO LOCALSTORAGE
          try {
            localStorage.setItem('volleypro_post_reactions', JSON.stringify(updated));
          } catch (e) {
            console.error('Erro ao salvar reações dos posts:', e);
          }
          return updated;
        });
        
        toast.success("Reação removida");
      } else {
        // Remove reação anterior se existir
        if (currentUserReaction) {
          const newReactions = {
            ...currentReactions,
            [currentUserReaction]: Math.max(0, (currentReactions[currentUserReaction] || 0) - 1),
            [emoji]: (currentReactions[emoji] || 0) + 1
          };
          
          setPostReactions(prev => {
            const updated = {
              ...prev,
              [postId]: newReactions
            };
            // ✅ SALVAR NO LOCALSTORAGE
            try {
              localStorage.setItem('volleypro_post_reactions', JSON.stringify(updated));
            } catch (e) {
              console.error('Erro ao salvar reações dos posts:', e);
            }
            return updated;
          });
        } else {
          // Adiciona nova reação
          setPostReactions(prev => {
            const updated = {
              ...prev,
              [postId]: {
                ...(prev[postId] || {}),
                [emoji]: ((prev[postId] || {})[emoji] || 0) + 1
              }
            };
            // ✅ SALVAR NO LOCALSTORAGE
            try {
              localStorage.setItem('volleypro_post_reactions', JSON.stringify(updated));
            } catch (e) {
              console.error('Erro ao salvar reações dos posts:', e);
            }
            return updated;
          });
        }
        
        setUserReactions(prev => {
          const updated = {
            ...prev,
            [postId]: emoji
          };
          // ✅ SALVAR NO LOCALSTORAGE
          try {
            localStorage.setItem('volleypro_user_reactions', JSON.stringify(updated));
          } catch (e) {
            console.error('Erro ao salvar reações do usuário:', e);
          }
          return updated;
        });
        
        const reactionData = VOLLEYBALL_REACTIONS.find(r => r.emoji === emoji);
        toast.success(`${emoji} ${reactionData?.label || 'Reação'} adicionada!`);
      }
      
      // Fecha o picker
      setReactionPickerOpen(null);
    } catch (error: any) {
      console.error("❌ Erro ao reagir:", error);
      toast.error(error.message || "Erro ao adicionar reação");
    }
  }

  function handleReactionClick(postId: string, emoji: string) {
    // Quando clica em uma reação existente
    if (userReactions[postId] === emoji) {
      // Se é a reação do usuário, remove
      handleReaction(postId, emoji);
    } else {
      // Se não é a reação do usuário, adiciona essa reação
      handleReaction(postId, emoji);
    }
  }

  async function handleToggleComments(postId: string) {
    const isExpanded = expandedComments.has(postId);
    
    if (isExpanded) {
      // Collapse comments
      const newExpanded = new Set(expandedComments);
      newExpanded.delete(postId);
      setExpandedComments(newExpanded);
    } else {
      // Expand and load comments
      const newExpanded = new Set(expandedComments);
      newExpanded.add(postId);
      setExpandedComments(newExpanded);
      
      // Load comments if not already loaded
      if (!comments[postId]) {
        await loadComments(postId);
      }
    }
  }

  async function loadComments(postId: string) {
    setLoadingComments(prev => new Set(prev).add(postId));
    try {
      const { comments: postComments } = await postApi.getComments(postId);
      setComments(prev => ({ ...prev, [postId]: postComments || [] }));
    } catch (error: any) {
      console.error("❌ Erro ao carregar comentários:", error);
      toast.error("Erro ao carregar comentários");
    } finally {
      setLoadingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  }

  async function handleAddComment(postId: string) {
    if (!isAuthenticated) {
      toast.error("Faça login para comentar");
      if (onLoginPrompt) onLoginPrompt();
      return;
    }

    const content = newComment[postId]?.trim();
    if (!content) {
      toast.error("Digite algo para comentar");
      return;
    }

    try {
      const { comment } = await postApi.createComment(postId, content);
      
      // Add comment to list
      setComments(prev => ({
        ...prev,
        [postId]: [comment, ...(prev[postId] || [])]
      }));
      
      // Update post comment count
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      ));
      
      // Clear input
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      
      toast.success("Comentário adicionado! 💬");
    } catch (error: any) {
      console.error("❌ Erro ao criar comentário:", error);
      toast.error(error.message || "Erro ao comentar");
    }
  }

  async function handleDeleteComment(postId: string, commentId: string) {
    if (!confirm("Tem certeza que deseja deletar este comentário?")) return;

    try {
      await postApi.deleteComment(postId, commentId);
      
      // Remove comment from list
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
      }));
      
      // Update post comment count
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, comments: Math.max(0, post.comments - 1) } : post
      ));
      
      toast.success("Comentário removido");
    } catch (error: any) {
      console.error("❌ Erro ao deletar comentário:", error);
      toast.error("Erro ao deletar comentário");
    }
  }

  function handleShare(post: any) {
    console.log("📤 handleShare chamado para post:", post.id);
    setSelectedPostForShare(post);
    setShareDialogOpen(true);
    setLinkCopied(false);
  }

  async function copyPostLink(postId: string) {
    const url = `${window.location.origin}?post=${postId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success("Link copiado! 🔗", {
        description: "Cole onde quiser compartilhar"
      });
      
      // Reset copied state after 3 seconds
      setTimeout(() => setLinkCopied(false), 3000);
      
      // Increment share count
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, shares: p.shares + 1 } : p
      ));
    } catch (error) {
      console.error("❌ Erro ao copiar link:", error);
      toast.error("Erro ao copiar link");
    }
  }

  async function shareViaWebShare(post: any) {
    const url = `${window.location.origin}?post=${post.id}`;
    const text = post.content 
      ? `${post.authorName}: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`
      : `Confira esta publicação de ${post.authorName} no VolleyPro!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `VolleyPro - ${post.authorName}`,
          text: text,
          url: url,
        });
        
        console.log("✅ Compartilhado com sucesso via Web Share API");
        toast.success("Compartilhado! 🎉");
        
        // Increment share count
        setPosts(posts.map(p => 
          p.id === post.id ? { ...p, shares: p.shares + 1 } : p
        ));
        
        setShareDialogOpen(false);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("❌ Erro ao compartilhar:", error);
        }
      }
    } else {
      toast.info("Seu navegador não suporta compartilhamento direto. Use o link copiado!");
      copyPostLink(post.id);
    }
  }

  function shareOnWhatsApp(post: any) {
    const url = `${window.location.origin}?post=${post.id}`;
    const text = post.content 
      ? `${post.content}\n\n`
      : `Confira esta publicação no VolleyPro!\n\n`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + url)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success("Abrindo WhatsApp! 💚");
    
    // Increment share count
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, shares: p.shares + 1 } : p
    ));
    
    setShareDialogOpen(false);
  }

  function shareOnTwitter(post: any) {
    const url = `${window.location.origin}?post=${post.id}`;
    const text = post.content 
      ? post.content.substring(0, 240)
      : `Confira esta publicação no VolleyPro! 🏐`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
    
    toast.success("Abrindo Twitter/X! 🐦");
    
    // Increment share count
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, shares: p.shares + 1 } : p
    ));
    
    setShareDialogOpen(false);
  }

  function shareOnFacebook(post: any) {
    const url = `${window.location.origin}?post=${post.id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
    
    toast.success("Abrindo Facebook! 📘");
    
    // Increment share count
    setPosts(posts.map(p => 
      p.id === post.id ? { ...p, shares: p.shares + 1 } : p
    ));
    
    setShareDialogOpen(false);
  }

  const isImage = (type: string) => type?.startsWith('image/');
  const isVideo = (type: string) => type?.startsWith('video/');

  // Check if user is new (registered recently)
  const isNewUser = currentUser && new Date(currentUser.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
  const hasSeenWelcomeTips = typeof window !== 'undefined' && localStorage.getItem("volleypro_welcome_tips_seen") === "true";
  const shouldShowWelcomeTips = isAuthenticated && isNewUser && !hasSeenWelcomeTips;

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 sm:px-6 space-y-6">
      {/* Dicas de Boas-Vindas para Novos Usuários */}
      {shouldShowWelcomeTips && currentUser && (
        <Card className="border-2 border-primary/20 rounded-2xl animate-slide-up shadow-xl relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Bem-vindo ao VolleyPro! 👋</h3>
                  <p className="text-sm text-muted-foreground">Comece sua jornada na comunidade do vôlei</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  localStorage.setItem("volleypro_welcome_tips_seen", "true");
                  toast.success("Explore à vontade! 🎉");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>✅ Conta criada com sucesso!</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50"></div>
                <span>Clique em "Perfil" para adicionar sua foto</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50"></div>
                <span>Explore "Atletas" e "Times" para seguir pessoas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50"></div>
                <span>Crie seu primeiro post aqui no Feed!</span>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary"
              onClick={() => {
                localStorage.setItem("volleypro_welcome_tips_seen", "true");
                toast.success("Explore à vontade! 🎉");
              }}
            >
              Entendi, vamos lá! 🚀
            </Button>
          </CardContent>
        </Card>
      )}
    
      {/* Banner de Upgrade para usuários Free */}
      {isAuthenticated && userPlan === 'free' && !planLoading && (
        <UpgradeBanner 
          onUpgrade={() => {
            // Navegar para a página de monetização
            window.location.hash = '#monetization';
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }}
        />
      )}

      {isAuthenticated && (
        <Card className="border-t-4 border-t-primary rounded-2xl animate-fade-in shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/40 shadow-lg hover:ring-primary/60 transition-all">
              {currentUser?.photoUrl ? (
                <AvatarImage 
                  src={currentUser.photoUrl} 
                  alt={currentUser.nickname || currentUser.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-semibold">
                {currentUser?.name?.[0]?.toUpperCase() || 'VP'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Compartilhe suas conquistas, treinos e momentos do vôlei... 🏐"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px] resize-none border-border/50 focus:border-primary/50 rounded-xl transition-all"
              />
              
              {/* Media Preview */}
              {mediaPreview && selectedMedia && (
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {isImage(selectedMedia.type) ? (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="w-full max-h-96 object-contain bg-muted"
                    />
                  ) : isVideo(selectedMedia.type) ? (
                    <video 
                      src={mediaPreview} 
                      controls 
                      className="w-full max-h-96 bg-muted"
                    />
                  ) : null}
                </div>
              )}

              {uploading && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Upload className="h-5 w-5 animate-pulse text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-primary">
                      {selectedMedia?.type.startsWith('video/') 
                        ? 'Enviando vídeo... Isso pode levar alguns instantes.'
                        : 'Enviando imagem...'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Por favor, não feche esta janela.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between items-center border-t border-border/50 pt-4">
          <div className="flex gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/avif,video/mp4,video/webm"
              onChange={handleMediaSelect}
              className="hidden"
              id="media-upload"
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!selectedMedia || loading}
              className="gap-2 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 hover:text-blue-600 rounded-xl transition-all hover:scale-105"
            >
              <ImageIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Foto</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!selectedMedia || loading}
              className="gap-2 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-purple-600 rounded-xl transition-all hover:scale-105"
            >
              <VideoIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Vídeo</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowInspirationModal(true)}
              disabled={loading}
              className="gap-2 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 hover:text-amber-600 rounded-xl transition-all hover:scale-105"
            >
              <Sparkles className="h-5 w-5" />
              <span className="hidden sm:inline">Inspiração</span>
            </Button>
          </div>
          <Button 
            disabled={(!newPost.trim() && !selectedMedia) || loading}
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shrink-0 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 hover:scale-105"
          >
            {loading ? "Publicando..." : "Publicar 🚀"}
          </Button>
        </CardFooter>
      </Card>
      )}

      {isLoadingPosts ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl mb-2">Nenhuma publicação ainda</h3>
          <p className="text-muted-foreground mb-4">
            {isAuthenticated 
              ? "Seja o primeiro a compartilhar algo!" 
              : "Faça login para ver e criar publicações"}
          </p>
          {!isAuthenticated && onLoginPrompt && (
            <Button onClick={onLoginPrompt} className="mt-2 bg-gradient-to-r from-primary to-secondary">
              Criar Conta Grátis
            </Button>
          )}
        </Card>
      ) : (
        posts.map((post, index) => {
          if (!post || !post.id) return null;
          
          const authorInitial = post.authorName?.[0] || 'U';
          const authorName = post.authorName || 'Usuário';
          const isOfficialPost = post.isOfficial === true;
          
          return (
            <div key={post.id}>
              {/* Inserir anúncios em posições estratégicas */}
              {index === 2 && <AdDisplay type="banner" className="mb-6" />}
              {index === 5 && <AdDisplay type="card" className="mb-6" />}
              {index === 8 && <AdDisplay type="card" className="mb-6" />}
              
              <Card className={`rounded-2xl shadow-md border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in backdrop-blur-sm ${
          isOfficialPost 
            ? 'bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent border-secondary/30 shadow-lg shadow-secondary/10' 
            : 'bg-card/95 border-border/50 hover:border-primary/30'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar 
                  className={`h-11 w-11 ${isOfficialPost ? 'ring-2 ring-secondary/50 shadow-lg' : 'ring-1 ring-border'} ${!isOfficialPost && onSelectAthlete && post.authorId ? 'cursor-pointer hover:ring-primary/50 transition-all' : ''}`}
                  onClick={() => {
                    if (!isOfficialPost && onSelectAthlete && post.authorId) {
                      onSelectAthlete(post.authorId);
                    }
                  }}
                >
                  {post.authorPhotoUrl ? (
                    <AvatarImage src={post.authorPhotoUrl} alt={authorName} />
                  ) : (
                    <AvatarFallback className={isOfficialPost ? 'gradient-secondary text-white text-lg' : 'bg-muted'}>
                      {isOfficialPost ? '📰' : authorInitial}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span 
                      className={`${isOfficialPost ? 'font-semibold text-gradient-secondary' : 'font-medium'} ${!isOfficialPost && onSelectAthlete && post.authorId ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                      onClick={() => {
                        if (!isOfficialPost && onSelectAthlete && post.authorId) {
                          onSelectAthlete(post.authorId);
                        }
                      }}
                    >{authorName}</span>
                    {post.verified && (
                      <Badge variant="secondary" className="h-5 px-2 rounded-full bg-primary/10 text-primary">
                        ✓
                      </Badge>
                    )}
                    {isOfficialPost && post.category && (
                      <Badge 
                        className={`h-5 px-2 text-xs ${
                          post.category === 'noticia' ? 'bg-blue-500' :
                          post.category === 'curiosidade' ? 'bg-yellow-500' :
                          post.category === 'estatistica' ? 'bg-green-500' :
                          post.category === 'historia' ? 'bg-purple-500' :
                          'bg-orange-500'
                        } text-white`}
                      >
                        {post.category === 'noticia' ? '📰 Notícia' :
                         post.category === 'curiosidade' ? '💡 Curiosidade' :
                         post.category === 'estatistica' ? '📊 Stats' :
                         post.category === 'historia' ? '📚 História' :
                         '⭐ Destaque'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {post.createdAt ? new Date(post.createdAt).toLocaleString('pt-BR', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'Agora'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Botão de deletar: Master pode deletar qualquer post, usuário pode deletar apenas o próprio */}
                {((isMaster && !isOfficialPost) || (currentUser && currentUser.id === post.authorId && !isOfficialPost)) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirmation(post)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    title={isMaster ? "Deletar postagem (Master)" : "Excluir sua postagem"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.info("Em breve!")}>Salvar publicação</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Em breve!")}>Denunciar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Em breve!")}>Deixar de seguir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.content && (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}
            
            {/* Display Media */}
            {post.mediaUrl && post.mediaType === 'image' && (
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={post.mediaUrl} 
                  alt="Post media" 
                  className="w-full h-auto max-h-[500px] object-contain bg-muted"
                  loading="lazy"
                />
              </div>
            )}
            
            {post.mediaUrl && post.mediaType === 'video' && (
              <div className="rounded-lg overflow-hidden border">
                <video 
                  src={post.mediaUrl} 
                  controls 
                  className="w-full h-auto max-h-[500px] bg-muted"
                  preload="metadata"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            {/* Reações */}
            {postReactions[post.id] && Object.keys(postReactions[post.id] || {}).length > 0 && (
              <div className="w-full">
                <ReactionDisplay
                  reactions={postReactions[post.id] || {}}
                  userReaction={userReactions[post.id]}
                  onReactionClick={(emoji) => handleReactionClick(post.id, emoji)}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between w-full text-muted-foreground">
              <span className="text-sm">{post.comments} comentários</span>
              <span className="text-sm">{post.shares} compartilhamentos</span>
            </div>
            <div className="flex items-center gap-2 w-full border-t border-border/50 pt-4">
              <div className="relative flex-1">
                <Button 
                  variant="ghost" 
                  className={`w-full rounded-xl gap-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary transition-all hover:scale-105 ${
                    userReactions[post.id] ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/5 font-semibold shadow-sm' : ''
                  }`}
                  onClick={() => handleLike(post.id)}
                >
                  {userReactions[post.id] ? (
                    <>
                      <span className="text-lg animate-bounce">{userReactions[post.id]}</span>
                      <span className="hidden sm:inline">
                        {VOLLEYBALL_REACTIONS.find(r => r.emoji === userReactions[post.id])?.label || 'Reagir'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Smile className="h-5 w-5" />
                      <span className="hidden sm:inline">Reagir</span>
                    </>
                  )}
                </Button>
                
                <ReactionPicker
                  isOpen={reactionPickerOpen === post.id}
                  onSelect={(emoji) => handleReaction(post.id, emoji)}
                  onClose={() => setReactionPickerOpen(null)}
                />
              </div>
              
              <Button 
                variant="ghost" 
                className={`flex-1 rounded-xl gap-2 hover:bg-accent/10 hover:text-accent transition-all ${
                  expandedComments.has(post.id) ? 'bg-accent/10 text-accent font-semibold' : ''
                }`}
                onClick={() => handleToggleComments(post.id)}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Comentar</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 rounded-xl gap-2 hover:bg-secondary/10 hover:text-secondary transition-all"
                onClick={() => handleShare(post)}
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            </div>

            {/* Comments Section */}
            {expandedComments.has(post.id) && (
              <div className="w-full border-t pt-4 space-y-4">
                {/* Add Comment Input */}
                {isAuthenticated && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      {currentUser?.photoUrl ? (
                        <AvatarImage src={currentUser.photoUrl} alt={currentUser.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                        {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Escreva um comentário..."
                        value={newComment[post.id] || ""}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment[post.id]?.trim()}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {loadingComments.has(post.id) ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(comments[post.id] || []).length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        Nenhum comentário ainda. Seja o primeiro!
                      </p>
                    ) : (
                      (comments[post.id] || []).map((comment: any) => (
                        <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <Avatar 
                            className="h-8 w-8"
                          >
                            {comment.authorPhotoUrl ? (
                              <AvatarImage src={comment.authorPhotoUrl} alt={comment.authorName} />
                            ) : null}
                            <AvatarFallback className="text-xs">
                              {comment.authorName?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span 
                                className="text-sm"
                              >{comment.authorName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {(comment.userId === authApi.getCurrentUserId() || isMaster) && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
            </div>
          );
        })
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="share-post-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Compartilhar Publicação
            </DialogTitle>
            <DialogDescription id="share-post-description">
              Escolha como você quer compartilhar esta publicação
            </DialogDescription>
          </DialogHeader>
          
          {selectedPostForShare && (
            <div className="space-y-4">
              {/* Preview do Post */}
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    {selectedPostForShare.authorPhotoUrl ? (
                      <AvatarImage src={selectedPostForShare.authorPhotoUrl} alt={selectedPostForShare.authorName} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {selectedPostForShare.authorName?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{selectedPostForShare.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedPostForShare.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                {selectedPostForShare.content && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {selectedPostForShare.content}
                  </p>
                )}
              </div>

              {/* Copiar Link */}
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => copyPostLink(selectedPostForShare.id)}
              >
                {linkCopied ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <div className="flex-1 text-left">
                      <p className="text-green-600">Link copiado!</p>
                      <p className="text-xs text-muted-foreground">Cole onde quiser compartilhar</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 text-primary" />
                    <div className="flex-1 text-left">
                      <p>Copiar link</p>
                      <p className="text-xs text-muted-foreground">Compartilhe em qualquer lugar</p>
                    </div>
                  </>
                )}
              </Button>

              {/* Web Share API (se disponível) */}
              {navigator.share && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => shareViaWebShare(selectedPostForShare)}
                >
                  <Share2 className="h-5 w-5 text-primary" />
                  <div className="flex-1 text-left">
                    <p>Compartilhar...</p>
                    <p className="text-xs text-muted-foreground">Use o menu do sistema</p>
                  </div>
                </Button>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou compartilhe em
                  </span>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex-col gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-500 hover:text-green-600"
                  onClick={() => shareOnWhatsApp(selectedPostForShare)}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-xs">WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex-col gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                  onClick={() => shareOnTwitter(selectedPostForShare)}
                >
                  <Twitter className="h-6 w-6" />
                  <span className="text-xs">Twitter/X</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex-col gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600"
                  onClick={() => shareOnFacebook(selectedPostForShare)}
                >
                  <Facebook className="h-6 w-6" />
                  <span className="text-xs">Facebook</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Inspiração de Conteúdo */}
      <ContentInspirationModal
        open={showInspirationModal}
        onClose={() => setShowInspirationModal(false)}
        onUseTemplate={(template) => {
          setNewPost(template);
        }}
      />

      {/* Diálogo de confirmação para excluir postagem */}
      <AlertDialog
        open={!!confirmDeletePost}
        onOpenChange={(open) => {
          if (!open) setConfirmDeletePost(null);
        }}
      >
        <AlertDialogContent aria-describedby="delete-post-description">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Excluir postagem?
            </AlertDialogTitle>
            <AlertDialogDescription id="delete-post-description" className="space-y-2">
              <p>
                Tem certeza que deseja excluir esta postagem de <strong>{confirmDeletePost?.authorName}</strong>?
              </p>
              <p className="text-destructive">
                ⚠️ Esta ação não pode ser desfeita. A postagem será removida permanentemente.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPostDeletion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, excluir postagem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para remover reação */}
      <AlertDialog
        open={!!confirmRemoveReaction}
        onOpenChange={(open) => {
          if (!open) setConfirmRemoveReaction(null);
        }}
      >
        <AlertDialogContent aria-describedby="remove-reaction-description">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover reação?</AlertDialogTitle>
            <AlertDialogDescription id="remove-reaction-description">
              Tem certeza que deseja remover sua reação {confirmRemoveReaction?.emoji} deste post?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmRemoveReaction) {
                  handleReaction(confirmRemoveReaction.postId, confirmRemoveReaction.emoji, true);
                  setConfirmRemoveReaction(null);
                }
              }}
            >
              Sim, remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Feed } from "./components/Feed";
import { Athletes } from "./components/Athletes";
import { Teams } from "./components/Teams";
import { Tournaments } from "./components/Tournaments";
import { Showcase } from "./components/Showcase";
import { Lives } from "./components/Lives";
import { Invitations } from "./components/Invitations";
import { Polls } from "./components/Polls";
import { Photos } from "./components/Photos";
import { Videos } from "./components/Videos";
import { Verified } from "./components/Verified";
import { Monetization } from "./components/Monetization";
import { Ads } from "./components/Ads";
import { Referees } from "./components/Referees";
import { Messages } from "./components/Messages";
import { AthleteProfile } from "./components/AthleteProfile";
import { TeamProfile } from "./components/TeamProfile";
import { MyProfile } from "./components/MyProfile";
import { AuthModal } from "./components/AuthModal";
import { ProfileEditModal } from "./components/ProfileEditModal";
import { ResetPasswordModal } from "./components/ResetPasswordModal";
import { LoadingScreen } from "./components/LoadingScreen";
import { LandingPage } from "./components/LandingPage";
import { Logo } from "./components/Logo";
import { CacheBuster } from "./components/CacheBuster";
import DownloadLogos from "./components/DownloadLogos";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { PWAManager } from "./components/PWAManager";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { IconGenerator } from "./components/IconGenerator";
import { PWATestPanel } from "./components/PWATestPanel";
import { MigrationNotice } from "./components/MigrationNotice";
import { FigmaMakeAccessControl } from "./components/FigmaMakeAccessControl";
import { VercelAccessControl } from "./components/VercelAccessControl";
import { FigmaMakeWarning } from "./components/FigmaMakeWarning";
import { TournamentDetails } from "./components/TournamentDetails";
import { authApi, userApi } from "./lib/api";
import { showConsoleHelp } from "./utils/consoleHelp";
import { useFigmaMakeAccess } from "./hooks/useFigmaMakeAccess";
import { createClient } from "./utils/supabase/client";
import { Button } from "./components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { LogOut, User, Home, Users, Shield, Trophy, Store, Radio, Mail, Crown, Megaphone, MoreHorizontal, Flag, Camera, Video, FileText } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

// 🚀 VERSÃO: 2.3.4 - Correção Crítica Performance e Tela Branca - Build: 20241028-2359
// ✅ Última atualização: ErrorBoundary, lazy loading de posts, proteções contra crashes

export default function App() {
  const [currentView, setCurrentView] = useState("feed");
  const [selectedAthlete, setSelectedAthlete] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userType, setUserType] = useState<"athlete" | "team" | "fan">("fan");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // 🔒 CONTROLE DE ACESSO FIGMA MAKE - Bloqueia usuários não autorizados
  const { isFigmaMake, hasAccess, isChecking } = useFigmaMakeAccess(userEmail);

  // Controlar overflow do body baseado em autenticação
  useEffect(() => {
    if (isAuthenticated) {
      // Quando logado, bloquear overflow do body (app controla internamente)
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      // Quando não logado, permitir scroll normal (landing page)
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }
    
    return () => {
      // Limpar ao desmontar
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isAuthenticated]);

  // Limpar cache quando necessário
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clear_cache') === 'true') {
      console.log("🧹 Limpando cache forçado via URL...");
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      toast.success("Cache limpo!", {
        description: "Recarregando página..."
      });
      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 1000);
    }
  }, []);

  // Handler global de erros não capturados
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("❌ Erro global capturado:", event.error);
      event.preventDefault();
      
      // Não mostrar toast para todos os erros, apenas logar
      if (event.error?.message?.includes('removeChild') || 
          event.error?.message?.includes('Failed to execute')) {
        console.warn("⚠️ Erro conhecido ignorado:", event.error.message);
        return;
      }
      
      toast.error("Algo deu errado. Tente novamente.");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("❌ Promise rejeitada não tratada:", event.reason);
      event.preventDefault();
      
      // Não mostrar toast para rejeições comuns
      if (event.reason?.message?.includes('removeChild') || 
          event.reason?.message?.includes('Failed to execute')) {
        console.warn("⚠️ Rejeição conhecida ignorada:", event.reason.message);
        return;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Listener para navegação via hash e detecção de reset de senha
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      console.log('🔍 Hash detectado:', hash); // DEBUG
      
      // Detectar se é um reset de senha (vem do email do Supabase)
      if (hash.includes('reset-password') || hash.includes('type=recovery')) {
        console.log('🔐 Link de recuperação de senha detectado!');
        setShowResetPasswordModal(true);
        // Limpar o hash após abrir o modal
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 100);
        return;
      }
      
      if (hash === 'monetization') {
        setCurrentView('monetization');
        setSelectedAthlete(null);
        setSelectedTeam(null);
        setShowMyProfile(false);
        // Limpar o hash
        window.history.replaceState(null, '', window.location.pathname);
      } else if (hash === 'icon-generator') {
        console.log('✅ Abrindo gerador de ícones');
        setCurrentView('icon-generator');
        setSelectedAthlete(null);
        setSelectedTeam(null);
        setShowMyProfile(false);
      } else if (hash === 'pwa-test') {
        setCurrentView('pwa-test');
        setSelectedAthlete(null);
        setSelectedTeam(null);
        setShowMyProfile(false);
      } else if (hash === 'download-logos') {
        console.log('✅ Abrindo página de logos!'); // DEBUG
        setCurrentView('download-logos');
        setSelectedAthlete(null);
        setSelectedTeam(null);
        setShowMyProfile(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Verificar hash inicial
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let mounted = true;
    let authUnsubscribe: (() => void) | null = null;
    
    const initialize = async () => {
      try {
        // Mostrar guia de ajuda no console
        showConsoleHelp();
        
        console.log("🚀 [Chrome-Optimized] Inicializando aplicação...");
        
        // Verificar autenticação inicial
        await checkAuth();
        
        if (!mounted) return;
        
        // Listener para detectar mudanças de autenticação
        const supabase = createClient();
        
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
          if (!mounted) return;
          
          console.log("🔄 Auth state changed:", event);
          
          if (event === 'SIGNED_IN' && session) {
            console.log("✅ Usuário autenticado!");
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            
            // Salvar tokens no localStorage
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('volleypro_token', session.access_token);
                localStorage.setItem('volleypro_user_id', session.user.id);
                sessionStorage.setItem('volleypro_session_active', 'true');
              } catch (e) {
                console.error("Erro ao salvar tokens:", e);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            console.log("🚪 Usuário deslogou");
            setIsAuthenticated(false);
            setUserEmail(null);
            
            // Limpar dados locais
            if (typeof window !== 'undefined') {
              try {
                localStorage.removeItem('volleypro_token');
                localStorage.removeItem('volleypro_user_id');
                sessionStorage.removeItem('volleypro_session_active');
              } catch (e) {
                console.error("Erro ao limpar tokens:", e);
              }
            }
          } else if (event === 'TOKEN_REFRESHED') {
            console.log("🔄 Token atualizado");
            if (session && typeof window !== 'undefined') {
              try {
                localStorage.setItem('volleypro_token', session.access_token);
              } catch (e) {
                console.error("Erro ao atualizar token:", e);
              }
            }
          }
        });

        authUnsubscribe = () => {
          authListener?.subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
      }
    };
    
    initialize();

    return () => {
      mounted = false;
      if (authUnsubscribe) {
        authUnsubscribe();
      }
    };
  }, []);

  async function checkAuth() {
    try {
      console.log("🔍 Verificando autenticação...");
      const session = await authApi.getSession();
      
      if (!session) {
        console.log("❌ Nenhuma sessão encontrada");
        setIsAuthenticated(false);
        return;
      }
      
      console.log("✅ Sessão encontrada para:", session.user.email);
      
      // Salvar email do usuário
      setUserEmail(session.user.email || null);
      
      // Garantir que o token está salvo no localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('volleypro_token', session.access_token);
          localStorage.setItem('volleypro_user_id', session.user.id);
          sessionStorage.setItem('volleypro_session_active', 'true');
          console.log("✅ Token salvo no localStorage");
        } catch (e) {
          console.error("⚠️ Erro ao salvar token:", e);
        }
      }
      
      // Carregar perfil do usuário para pegar o tipo
      try {
        const { user, userType: type } = await userApi.getCurrentUser();
        if (type) {
          setUserType(type);
          console.log("✅ Tipo de usuário:", type);
        }
      } catch (error) {
        // Não mostrar erro crítico - o app ainda funciona sem userType inicial
        console.warn("⚠️ Não foi possível carregar tipo de usuário (será carregado posteriormente):", error);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
    } finally {
      // Pequeno delay para suavizar a transição
      setTimeout(() => {
        setIsInitializing(false);
        console.log("✅ Inicialização completa");
      }, 500);
    }
  }

  async function handleSignOut() {
    try {
      console.log("🚪 Fazendo logout...");
      await authApi.signOut();
      setIsAuthenticated(false);
      toast.success("Até logo! 👋", {
        description: "Você saiu da sua conta"
      });
      console.log("✅ Logout concluído");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
      toast.error("Erro ao sair da conta");
    }
  }

  const renderView = () => {
    try {
      // Gerador de Ícones PWA (temporário para gerar os ícones)
      if (currentView === "icon-generator") {
        return (
          <div className="container mx-auto py-6">
            <IconGenerator />
          </div>
        );
      }
      
      // Download de Logos
      if (currentView === "download-logos") {
        return <DownloadLogos />;
      }
      
      // Painel de Testes PWA
      if (currentView === "pwa-test") {
        return <PWATestPanel />;
      }
      
      if (showMyProfile) {
        return (
          <MyProfile 
            onBack={() => setShowMyProfile(false)} 
            onEditProfile={() => {
              setShowMyProfile(false);
              setShowProfileEditModal(true);
            }} 
          />
        );
      }
      
      if (selectedAthlete !== null) {
        return <AthleteProfile athleteId={selectedAthlete} onBack={() => setSelectedAthlete(null)} />;
      }
      
      if (selectedTeam !== null) {
        return <TeamProfile teamId={selectedTeam} onBack={() => setSelectedTeam(null)} />;
      }
      
      if (selectedTournament !== null) {
        return <TournamentDetails tournamentId={selectedTournament} onBack={() => setSelectedTournament(null)} />;
      }
    } catch (error) {
      console.error("❌ Erro ao renderizar view:", error);
      toast.error("Erro ao carregar página. Recarregando...");
      
      // Resetar estados para evitar loop de erro
      setTimeout(() => {
        setCurrentView("feed");
        setSelectedAthlete(null);
        setSelectedTeam(null);
        setSelectedTournament(null);
        setShowMyProfile(false);
      }, 1000);
      
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg mb-4">⚠️ Erro ao carregar página</p>
            <Button onClick={() => window.location.reload()}>Recarregar</Button>
          </div>
        </div>
      );
    }

    // Passar props de autenticação para todos os componentes
    const authProps = {
      isAuthenticated,
      onLoginPrompt: () => setShowAuthModal(true)
    };

    try {
      switch (currentView) {
        case "feed":
          return <Feed {...authProps} onSelectAthlete={setSelectedAthlete} />;
        case "athletes":
          return <Athletes onSelectAthlete={setSelectedAthlete} {...authProps} />;
        case "teams":
          return <Teams onSelectTeam={setSelectedTeam} {...authProps} />;
        case "tournaments":
          return <Tournaments {...authProps} onViewDetails={setSelectedTournament} />;
        case "showcase":
          return <Showcase onSelectAthlete={setSelectedAthlete} {...authProps} />;
        case "lives":
          return <Lives {...authProps} />;
        case "invitations":
          return <Invitations {...authProps} />;
        case "messages":
          return <Messages />;
        case "ads":
          return <Ads />;
        case "polls":
          return <Polls />;
        case "photos":
          return <Photos />;
        case "videos":
          return <Videos />;
        case "verified":
          return <Verified />;
        case "monetization":
          return <Monetization />;
        case "referees":
          return <Referees />;
        default:
          return <Feed {...authProps} onSelectAthlete={setSelectedAthlete} />;
      }
    } catch (error) {
      console.error('❌ Erro ao renderizar view:', currentView, error);
      return (
        <div className="flex items-center justify-center h-screen p-6">
          <div className="text-center space-y-4">
            <p className="text-lg">⚠️ Erro ao carregar conteúdo</p>
            <Button onClick={() => {
              setCurrentView("feed");
              window.location.reload();
            }}>
              Voltar ao Início
            </Button>
          </div>
        </div>
      );
    }
  };

  if (isInitializing) {
    return <LoadingScreen />;
  }

  // GERADOR DE ÍCONES - Funciona sem login
  if (currentView === "icon-generator") {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 py-12">
          <IconGenerator />
        </div>
        <Toaster />
      </>
    );
  }

  // DOWNLOAD DE LOGOS - Funciona sem login
  if (currentView === "download-logos") {
    return (
      <>
        <DownloadLogos />
        <Toaster />
      </>
    );
  }

  // PAINEL DE TESTES PWA - Funciona sem login
  if (currentView === "pwa-test") {
    return (
      <>
        <PWAManager />
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10">
          <PWATestPanel />
        </div>
        <Toaster />
      </>
    );
  }

  // 🔒 SE ESTÁ NO FIGMA MAKE E NÃO TEM ACESSO, BLOQUEAR TUDO
  if (isFigmaMake && !hasAccess) {
    return <FigmaMakeAccessControl userEmail={userEmail} />;
  }

  // Se NÃO estiver autenticado, mostrar Landing Page
  if (!isAuthenticated) {
    return (
      <>
        {/* Aviso do Figma Make para usuários não logados */}
        {isFigmaMake && <FigmaMakeWarning />}
        
        {/* 🔒 Controle de Acesso Vercel para usuários não logados */}
        <VercelAccessControl userEmail={userEmail} />
        
        <PWAManager />
        <CacheBuster />
        <LandingPage onLoginClick={() => setShowAuthModal(true)} />
        
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={async () => {
            console.log("🎉 onSuccess chamado - verificando autenticação...");
            await checkAuth();
            console.log("✅ Estado de autenticação atualizado");
            
            // Toast de boas-vindas
            toast.success("🎉 Bem-vindo ao VolleyPro!", {
              description: "Explore a comunidade, complete seu perfil e conecte-se com outros apaixonados por vôlei!",
              duration: 5000
            });
          }}
        />

        <ResetPasswordModal
          open={showResetPasswordModal}
          onClose={() => setShowResetPasswordModal(false)}
          onSuccess={() => {
            toast.success("Senha atualizada!", {
              description: "Você já pode fazer login com sua nova senha"
            });
            setShowAuthModal(true);
          }}
        />
        
        <PWAInstallPrompt />
        <Toaster />
      </>
    );
  }

  // Menus principais que vão na barra horizontal
  // Itens principais (sempre visíveis)
  const primaryMenuItems = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "athletes", label: "Atletas", icon: Users },
    { id: "teams", label: "Equipes", icon: Shield },
    { id: "tournaments", label: "Torneios", icon: Trophy },
  ];

  // Itens secundários (aparecem ao clicar em "Mais...")
  const secondaryMenuItems = [
    { id: "showcase", label: "Vitrine", icon: Store },
    { id: "lives", label: "Lives", icon: Radio },
    { id: "invitations", label: "Convites", icon: Mail },
    { id: "referees", label: "Arbitragem", icon: Flag },
    { id: "polls", label: "Recursos", icon: FileText },
    { id: "photos", label: "Fotos", icon: Camera },
    { id: "videos", label: "Vídeos", icon: Video },
    { id: "ads", label: "Anúncios", icon: Megaphone },
    { id: "monetization", label: "Monetização", icon: Crown },
  ];

  // Se ESTIVER autenticado, mostrar aplicação completa
  return (
    <>
      {/* 🔒 Controle de Acesso Figma Make */}
      <FigmaMakeAccessControl userEmail={userEmail} />
      
      {/* 🔒 Controle de Acesso Vercel */}
      <VercelAccessControl userEmail={userEmail} />
      
      {/* ⚠️ Aviso Visual para todos os usuários */}
      <FigmaMakeWarning />
      
      {/* ⚠️ Aviso de Migração (apenas no Figma Make) */}
      <MigrationNotice />
      
      <CacheBuster />
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Sidebar - ESCONDIDO em mobile, visível apenas em desktop */}
          <div className="hidden lg:block">
            <AppSidebar 
              currentView={currentView} 
              onNavigate={setCurrentView}
              isAuthenticated={isAuthenticated}
              onProfileClick={() => setShowMyProfile(true)}
            />
          </div>
          <main className="flex-1 bg-background overflow-y-auto overflow-x-hidden">
            {/* Barra de navegação moderna com glassmorphism - SEMPRE TRAVADA NO TOPO */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-md">
              <div className="w-full px-2 sm:px-4 md:px-6">
                <div className="flex h-14 sm:h-16 items-center gap-1 sm:gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
                  {/* Logo - Fixo */}
                  <Logo variant="compact" className="shrink-0 scale-75 sm:scale-100" />
                  
                  {/* Navegação horizontal - menus principais */}
                  <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
                    {/* Itens principais (sempre visíveis) */}
                    {primaryMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentView(item.id);
                            setSelectedAthlete(null);
                            setSelectedTeam(null);
                            setSelectedTournament(null);
                            setShowMyProfile(false);
                          }}
                          className={`
                            gap-1 sm:gap-2 hover:bg-primary/10 transition-all px-1.5 sm:px-3 py-2 rounded-lg sm:rounded-xl whitespace-nowrap shrink-0 min-w-0
                            ${isActive ? 'bg-primary/10 text-primary font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}
                          `}
                          title={item.label}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                          <span className="hidden sm:inline text-xs md:text-sm" translate="no">{item.label}</span>
                        </Button>
                      );
                    })}
                    
                    {/* Botão "Mais..." com dropdown em cascata */}
                    <Popover open={showMoreMenu} onOpenChange={setShowMoreMenu}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`
                            gap-1 sm:gap-2 hover:bg-primary/10 transition-all px-1.5 sm:px-3 py-2 rounded-lg sm:rounded-xl whitespace-nowrap shrink-0 min-w-0
                            ${showMoreMenu ? 'bg-primary/10 text-primary font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'}
                          `}
                          title={showMoreMenu ? "Ocultar menu" : "Mais opções"}
                        >
                          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                          <span className="hidden sm:inline text-xs md:text-sm">Mais...</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-56 p-2 rounded-2xl shadow-xl bg-background/95 backdrop-blur-xl border border-border/50" 
                        align="end"
                        sideOffset={12}
                      >
                        <div className="flex flex-col gap-1">
                          {/* Itens secundários em lista vertical */}
                          {secondaryMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            
                            return (
                              <Button
                                key={item.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentView(item.id);
                                  setSelectedAthlete(null);
                                  setSelectedTeam(null);
                                  setSelectedTournament(null);
                                  setShowMyProfile(false);
                                  setShowMoreMenu(false); // Fecha o dropdown ao clicar
                                }}
                                className={`
                                  w-full justify-start gap-3 hover:bg-primary/10 transition-all py-3 rounded-xl
                                  ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'}
                                `}
                              >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span translate="no">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </nav>
                  
                  {/* Botões de perfil e sair - SEMPRE VISÍVEIS E FIXOS */}
                  <div className="flex items-center gap-1 shrink-0 ml-1 sm:ml-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setShowMyProfile(true);
                        setSelectedAthlete(null);
                        setSelectedTeam(null);
                        setSelectedTournament(null);
                      }}
                      className="hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all p-2 rounded-lg sm:rounded-xl shrink-0"
                      title="Meu Perfil"
                    >
                      <User className="h-5 w-5 shrink-0" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSignOut} 
                      className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all p-2 rounded-lg sm:rounded-xl shrink-0"
                      title="Sair"
                    >
                      <LogOut className="h-5 w-5 shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Conteúdo Principal - Com scroll */}
            <div className="w-full max-w-full overflow-x-hidden">
              <ErrorBoundary>
                {renderView()}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </SidebarProvider>

      <ProfileEditModal
        open={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        onSuccess={async () => {
          console.log("✅ Perfil atualizado com sucesso!");
          
          // Recarregar dados do usuário
          try {
            await checkAuth();
            console.log("✅ Dados do usuário atualizados");
          } catch (error) {
            console.error("❌ Erro ao atualizar dados:", error);
          }
          
          // Mostrar toast
          toast.success("Perfil atualizado! 🎉", {
            description: "Suas mudanças foram salvas com sucesso"
          });
          
          // Se estava vendo o perfil, reativar a visualização
          if (showMyProfile) {
            // Pequeno delay para dar tempo do toast aparecer
            setTimeout(() => {
              setShowMyProfile(true);
            }, 100);
          }
        }}
      />

      <ResetPasswordModal
        open={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        onSuccess={() => {
          toast.success("Senha atualizada!", {
            description: "Você já pode fazer login com sua nova senha"
          });
          setShowAuthModal(true);
        }}
      />

      <PWAManager />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <Toaster />
    </>
  );
}
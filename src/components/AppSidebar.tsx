import { useState, useEffect } from "react";
import { Home, Users, Shield, Trophy, Store, Radio, BarChart3, Camera, Video, CheckCircle2, MessageSquare, Mail } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "./ui/sidebar";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { userApi } from "../lib/api";

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAuthenticated?: boolean;
  onProfileClick?: () => void;
}

// Menus principais foram movidos para a barra horizontal no topo (App.tsx)
// Aqui ficam apenas os recursos adicionais

const additionalItems = [
  { id: "polls", label: "Enquetes", icon: BarChart3 },
  { id: "photos", label: "Fotos", icon: Camera },
  { id: "videos", label: "Vídeos", icon: Video },
  { id: "verified", label: "Verificar", icon: CheckCircle2 },
];

export function AppSidebar({ currentView, onNavigate, isAuthenticated = false, onProfileClick }: AppSidebarProps) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log("🔄 Perfil atualizado - recarregando sidebar...");
      if (isAuthenticated) {
        loadUserProfile();
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [isAuthenticated]);

  async function loadUserProfile() {
    if (!isAuthenticated) return;
    
    setLoadingProfile(true);
    try {
      const { profile } = await userApi.getCurrentUser();
      console.log("📊 Perfil carregado na sidebar:", profile);
      setUserProfile(profile);
    } catch (error: any) {
      console.error("❌ Erro ao carregar perfil na sidebar:", error);
      
      // Se for erro de rede, usar dados do cache se disponível
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        console.log("⚠️ Erro de rede - usando dados em cache se disponível");
        
        // Tentar usar dados do localStorage como fallback
        try {
          const cachedProfile = localStorage.getItem('volleypro_cached_profile');
          if (cachedProfile) {
            setUserProfile(JSON.parse(cachedProfile));
            console.log("✅ Usando perfil em cache");
          }
        } catch (cacheError) {
          console.error("❌ Erro ao ler cache:", cacheError);
        }
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  const displayName = userProfile?.nickname || userProfile?.name || "Usuário";
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-gradient-to-br from-primary to-secondary">
        <Logo variant="compact" className="[&_svg]:w-10 [&_svg]:h-10 [&_span]:text-white" />
      </SidebarHeader>

      {/* USER PROFILE CARD - VERTICAL */}
      {isAuthenticated ? (
        <div 
          className="m-3 mb-4 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40"
          onClick={onProfileClick}
          title="Ver meu perfil"
        >
          {/* Photo area - tall rectangle, photo fills entire space */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
            {userProfile?.photoUrl ? (
              <img 
                src={userProfile.photoUrl} 
                alt={displayName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {loadingProfile ? '...' : initials}
                </span>
              </div>
            )}
            
            {/* Gradient overlay at bottom for better text readability */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Verified badge if applicable */}
            {userProfile?.verified && (
              <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1.5 shadow-lg">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
          </div>
          
          {/* Profile info section */}
          <div className="bg-white dark:bg-card p-4 space-y-2">
            {/* Name */}
            <h3 className="font-semibold text-center text-sidebar-foreground truncate group-hover:text-primary transition-colors">
              {loadingProfile ? 'Carregando...' : displayName}
            </h3>
            
            {/* Position (if athlete) */}
            {userProfile && userProfile.userType === 'athlete' && userProfile.position && (
              <p className="text-sm text-center text-muted-foreground truncate">
                {userProfile.position}
              </p>
            )}
            
            {/* Team or Available */}
            {userProfile && userProfile.userType === 'athlete' && (
              <p className="text-sm text-center font-medium truncate">
                {userProfile.currentTeam ? (
                  <span className="text-primary">🏐 {userProfile.currentTeam}</span>
                ) : (
                  <span className="text-secondary">✨ Disponível</span>
                )}
              </p>
            )}
            
            {/* Team or Fan type indicator */}
            {userProfile && userProfile.userType !== 'athlete' && (
              <p className="text-sm text-center text-muted-foreground truncate">
                {userProfile.userType === 'team' ? '⚡ Time' : '🎉 Fã/Torcedor'}
              </p>
            )}
          </div>
        </div>
      ) : null}

      <SidebarContent>
        {/* Apenas recursos adicionais - menus principais estão na barra horizontal */}
        <SidebarGroup>
          <SidebarGroupLabel>Recursos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {additionalItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onNavigate(item.id)}
                      isActive={isActive}
                      className="justify-start gap-3 px-3 py-2 hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

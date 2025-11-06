import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '../utils/supabase/client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba`;

// Helper to retry with delay (não precisa mais - apiCall já faz refresh automático)
async function retryWithDelay<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 300
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error.message?.includes('Unauthorized')) {
      console.log(`⏳ Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay);
    }
    throw error;
  }
}

// Get token from Supabase session (more reliable than localStorage)
async function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    // Sempre buscar da sessão do Supabase (fonte da verdade)
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      // Apenas logar erro real, não warning
      console.error('❌ Erro ao obter sessão:', error);
      return null;
    }
    
    if (session?.access_token) {
      // Salvar no localStorage para cache
      localStorage.setItem('volleypro_token', session.access_token);
      localStorage.setItem('volleypro_user_id', session.user.id);
      return session.access_token;
    }
    
    // Não logar warning - é normal quando usuário não está logado
    return null;
  } catch (error) {
    // Apenas logar erro real de execução
    console.error('❌ Erro ao obter token:', error);
    return null;
  }
}

// Generic API call helper
async function apiCall(endpoint: string, options: RequestInit = {}, silent = false) {
  const token = await getAuthToken();
  
  // Não logar warning de token ausente - é normal para usuários não logados
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
    ...options.headers,
  };

  let response;
  let data;
  
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      // Adicionar timeout
      signal: AbortSignal.timeout(30000), // 30 segundos
    });

    data = await response.json();
  } catch (error: any) {
    // Tratar erros de rede
    if (error.name === 'AbortError') {
      throw new Error('Tempo limite de requisição excedido. Verifique sua conexão.');
    }
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Erro de conexão. Verifique se você está online e se o servidor está acessível.');
    }
    throw error;
  }

  if (!response.ok) {
    // Se o erro indica que precisa refresh, tentar renovar a sessão
    if (data.needsRefresh || data.code === 'TOKEN_INVALID') {
      if (!silent) console.log('🔄 Token inválido, tentando refresh...');
      
      try {
        const supabase = createClient();
        
        // Forçar refresh da sessão
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (!refreshError && refreshData.session) {
          if (!silent) console.log('✅ Sessão renovada com sucesso');
          
          // Salvar novo token
          if (typeof window !== 'undefined') {
            localStorage.setItem('volleypro_token', refreshData.session.access_token);
            localStorage.setItem('volleypro_user_id', refreshData.session.user.id);
          }
          
          // Tentar novamente a chamada com o novo token
          const newHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshData.session.access_token}`,
            ...options.headers,
          };
          
          const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: newHeaders,
          });
          
          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryData.error || 'API request failed after refresh');
          }
          
          return retryData;
        } else {
          if (!silent) console.error('❌ Erro ao renovar sessão:', refreshError);
          // Se não conseguir renovar, fazer logout (apenas se não for silent)
          if (!silent) {
            await authApi.signOut();
            window.location.reload();
          }
        }
      } catch (refreshError) {
        if (!silent) console.error('❌ Erro crítico ao renovar sessão:', refreshError);
        // Logout e reload (apenas se não for silent)
        if (!silent) {
          await authApi.signOut();
          window.location.reload();
        }
      }
    }
    
    // Se for silent, não lançar erro - apenas retornar resposta vazia
    if (silent) {
      return { error: data.error || 'API request failed', silent: true };
    }
    
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Auth APIs
export const authApi = {
  async signUp(email: string, password: string, name: string, userType: 'athlete' | 'team' | 'fan', additionalData?: any) {
    console.log("📡 Chamando API de signup...");
    try {
      const result = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, userType, ...additionalData }),
      });
      console.log("✅ Signup API retornou sucesso");
      return result;
    } catch (error: any) {
      // Melhorar mensagem de erro para email já registrado
      if (error?.message?.includes('already registered') || 
          error?.message?.includes('already been registered')) {
        const betterError = new Error('Email já cadastrado. Por favor, faça login.');
        betterError.name = 'EmailAlreadyRegistered';
        throw betterError;
      }
      console.error("❌ Erro na API de signup:", error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    console.log("📡 [Chrome-Optimized] Iniciando login...");
    try {
      const supabase = createClient();
      
      // Limpar qualquer sessão antiga antes de fazer login
      await supabase.auth.signOut({ scope: 'local' });
      
      console.log("🔐 Fazendo login com email/senha...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("❌ Erro do Supabase:", error.message);
        throw new Error(error.message);
      }

      if (!data.session || !data.user) {
        throw new Error('Sessão inválida após login');
      }

      // Salvar token e user ID de forma segura
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('volleypro_token', data.session.access_token);
          localStorage.setItem('volleypro_user_id', data.user.id);
          sessionStorage.setItem('volleypro_session_active', 'true');
          console.log("✅ Sessão salva com sucesso");
        } catch (storageError) {
          console.error("⚠️ Erro ao salvar no localStorage:", storageError);
        }
      }

      console.log("✅ Login concluído com sucesso!");
      return data;
    } catch (error: any) {
      console.error("❌ Erro no signIn:", error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  async signOut() {
    console.log("🚪 Fazendo logout...");
    try {
      const supabase = createClient();
      
      // Fazer logout do Supabase
      await supabase.auth.signOut();
      
      // Limpar todos os dados locais
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('volleypro_token');
          localStorage.removeItem('volleypro_user_id');
          sessionStorage.removeItem('volleypro_session_active');
          
          // Limpar qualquer cache do Supabase
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('supabase.auth.')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          console.log("✅ Dados locais limpos");
        } catch (storageError) {
          console.error("⚠️ Erro ao limpar localStorage:", storageError);
        }
      }
      
      console.log("✅ Logout concluído");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      throw error;
    }
  },

  // Alias para signOut (compatibilidade)
  async logout() {
    return this.signOut();
  },

  async getSession() {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Erro ao obter sessão:", error);
        return null;
      }
      
      // Se não tem sessão, retornar null
      if (!data.session) {
        console.log("ℹ️ Nenhuma sessão ativa");
        return null;
      }
      
      // Verificar se o token está próximo de expirar (menos de 5 minutos)
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = expiresAt - now;
        
        // Se falta menos de 5 minutos, fazer refresh preventivo
        if (timeUntilExpiry < 300) {
          console.log("⏰ Token expirando em breve, fazendo refresh preventivo...");
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (!refreshError && refreshData.session) {
            console.log("✅ Sessão renovada preventivamente");
            data.session = refreshData.session;
          }
        }
      }
      
      // Atualizar localStorage se há sessão válida
      if (data.session?.access_token && typeof window !== 'undefined') {
        try {
          localStorage.setItem('volleypro_token', data.session.access_token);
          localStorage.setItem('volleypro_user_id', data.session.user.id);
          sessionStorage.setItem('volleypro_session_active', 'true');
        } catch (storageError) {
          console.error("⚠️ Erro ao atualizar storage:", storageError);
        }
      }
      
      return data.session;
    } catch (error) {
      console.error("❌ Erro ao verificar sessão:", error);
      return null;
    }
  },

  getCurrentUserId() {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('volleypro_user_id');
    } catch (e) {
      console.error("Erro ao ler user ID:", e);
      return null;
    }
  },

  async getCurrentUserIdAsync() {
    if (typeof window === 'undefined') return null;
    
    try {
      // Tentar pegar do localStorage primeiro (rápido)
      const cachedId = localStorage.getItem('volleypro_user_id');
      if (cachedId) return cachedId;
      
      // Se não tiver no localStorage, buscar da sessão
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.warn('⚠️ Nenhuma sessão ativa para obter userId');
        return null;
      }
      
      // Salvar no localStorage para próximas chamadas
      localStorage.setItem('volleypro_user_id', session.user.id);
      return session.user.id;
    } catch (e) {
      console.error("❌ Erro ao obter user ID:", e);
      return null;
    }
  },

  // Verificar se está autenticado de forma síncrona
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    try {
      const token = localStorage.getItem('volleypro_token');
      const userId = localStorage.getItem('volleypro_user_id');
      const sessionActive = sessionStorage.getItem('volleypro_session_active');
      return !!(token && userId && sessionActive);
    } catch (e) {
      console.error("Erro ao verificar autenticação:", e);
      return false;
    }
  },
};

// User APIs
export const userApi = {
  async getCurrentUser() {
    return retryWithDelay(() => apiCall('/users/me'));
  },

  // Alias para getUserProfile (compatibilidade)
  async getUserProfile(userId: string) {
    return this.getUser(userId);
  },

  async updateCurrentUser(updates: any) {
    const userId = authApi.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getUser(userId: string) {
    return apiCall(`/users/${userId}`);
  },

  async updateUser(userId: string, updates: any) {
    return apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getUsers(filters?: { type?: 'athlete' | 'team'; position?: string }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.position) params.append('position', filters.position);
    
    return apiCall(`/users?${params.toString()}`);
  },

  async searchByCPF(cpf: string) {
    // Limpar CPF (remover pontos e traços)
    const cleanCPF = cpf.replace(/\D/g, '');
    return apiCall(`/users/search/cpf/${cleanCPF}`);
  },

  async toggleFreeAgent(status: boolean) {
    const userId = authApi.getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiCall(`/users/${userId}/free-agent`, {
      method: 'PUT',
      body: JSON.stringify({ freeAgent: status }),
    });
  },
};

// Post APIs
export const postApi = {
  async uploadMedia(file: File) {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Você precisa estar autenticado para fazer upload');
    }
    
    console.log('📤 Iniciando upload de mídia:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    });
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Timeout maior para vídeos (120 segundos)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Erro no upload:', data);
        throw new Error(data.error || 'Falha no upload');
      }
      
      console.log('✅ Upload concluído com sucesso:', data.mediaType);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('❌ Upload timeout após 120 segundos');
        throw new Error('Upload muito demorado. Tente um arquivo menor ou verifique sua conexão.');
      }
      
      if (error.message?.includes('Failed to fetch')) {
        console.error('❌ Erro de rede no upload');
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      console.error('��� Erro desconhecido no upload:', error);
      throw error;
    }
  },

  async createPost(content: string, mediaType?: string, mediaUrl?: string) {
    return apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, mediaType, mediaUrl }),
    });
  },

  async getPosts() {
    return apiCall('/posts');
  },

  async getUserPosts(userId: string) {
    return apiCall(`/posts/user/${userId}`);
  },

  async likePost(postId: string) {
    return apiCall(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  async getComments(postId: string) {
    return apiCall(`/posts/${postId}/comments`);
  },

  async createComment(postId: string, content: string) {
    return apiCall(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async deleteComment(postId: string, commentId: string) {
    return apiCall(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  async deletePost(postId: string) {
    return apiCall(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },
};

// Follow APIs
export const followApi = {
  async toggleFollow(targetUserId: string) {
    return apiCall(`/follow/${targetUserId}`, {
      method: 'POST',
    });
  },

  async getFollowingIds() {
    return apiCall('/follow/check');
  },
};

// Tournament APIs
export const tournamentApi = {
  async createTournament(data: {
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    arena?: string;
    maxTeams?: number;
    format?: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
    modalityType?: 'indoor' | 'beach';
  }) {
    return apiCall('/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getTournaments(status?: 'upcoming' | 'ongoing' | 'finished') {
    const params = status ? `?status=${status}` : '';
    return apiCall(`/tournaments${params}`);
  },

  async getTournamentDetails(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}`);
  },

  async registerTeam(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}/register`, {
      method: 'POST',
    });
  },

  async unregisterTeam(tournamentId: string, teamId: string) {
    return apiCall(`/tournaments/${tournamentId}/register`, {
      method: 'DELETE',
      body: JSON.stringify({ teamId }),
    });
  },

  // Beach volleyball - Individual registration
  async registerIndividual(tournamentId: string, partnerId?: string) {
    return apiCall(`/tournaments/${tournamentId}/register-individual`, {
      method: 'POST',
      body: JSON.stringify({ partnerId }),
    });
  },

  // Beach volleyball - Team registration with team name and players
  async registerBeachTeam(tournamentId: string, teamName: string, playerIds: string[]) {
    return apiCall(`/tournaments/${tournamentId}/register-beach-team`, {
      method: 'POST',
      body: JSON.stringify({ teamName, playerIds }),
    });
  },

  async unregisterIndividual(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}/register-individual`, {
      method: 'DELETE',
    });
  },

  async drawBrackets(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}/draw`, {
      method: 'POST',
    });
  },

  async updateMatchResult(tournamentId: string, matchId: string, data: {
    homeScore: number;
    awayScore: number;
    homeSets: number;
    awaySets: number;
  }) {
    return apiCall(`/tournaments/${tournamentId}/matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getStandings(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}/standings`);
  },

  // Squad-based registration (multiple squads from same team)
  // squadId can be null for simple teams (full team registration)
  async registerSquad(tournamentId: string, teamId: string, squadId: string | null) {
    return apiCall(`/tournaments/${tournamentId}/register-squad`, {
      method: 'POST',
      body: JSON.stringify({ teamId, squadId }),
    });
  },

  async getTeamRegistrations(tournamentId: string, teamId: string) {
    return apiCall(`/tournaments/${tournamentId}/registrations/${teamId}`);
  },

  async validateSquadPlayers(tournamentId: string, teamId: string, squadId: string, playerIds: string[]) {
    return apiCall(`/tournaments/${tournamentId}/validate-players`, {
      method: 'POST',
      body: JSON.stringify({ teamId, squadId, playerIds }),
    });
  },

  async unregisterSquad(tournamentId: string, teamId: string, squadId: string) {
    return apiCall(`/tournaments/${tournamentId}/register-squad`, {
      method: 'DELETE',
      body: JSON.stringify({ teamId, squadId }),
    });
  },

  async voteForMVP(tournamentId: string, athleteId: string, points?: number) {
    return apiCall(`/tournaments/${tournamentId}/mvp/vote`, {
      method: 'POST',
      body: JSON.stringify({ athleteId, points }),
    });
  },

  async getMVPRankings(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}/mvp`);
  },

  async cancelTournament(tournamentId: string, reason: string) {
    return apiCall(`/tournaments/${tournamentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // ============= ROSTER / CONVOCAÇÃO =============
  
  // Get roster for a tournament
  async getRoster(tournamentId: string, teamId: string, squadId?: string) {
    const squadParam = squadId ? `?squadId=${squadId}` : '';
    return apiCall(`/tournaments/${tournamentId}/roster/${teamId}${squadParam}`);
  },

  // Save/Update roster
  async saveRoster(tournamentId: string, teamId: string, roster: any, squadId?: string) {
    return apiCall(`/tournaments/${tournamentId}/roster`, {
      method: 'POST',
      body: JSON.stringify({ teamId, roster, squadId }),
    });
  },

  // Search player by CPF (must be in the team)
  async searchPlayerByCPF(cpf: string, teamId: string) {
    return apiCall(`/teams/${teamId}/search-player?cpf=${cpf}`);
  },

  // Confirm roster call-up (athlete side)
  async confirmRosterCallup(tournamentId: string, teamId: string) {
    return apiCall(`/tournaments/${tournamentId}/roster/${teamId}/confirm`, {
      method: 'POST',
    });
  },

  // Decline roster call-up (athlete side)
  async declineRosterCallup(tournamentId: string, teamId: string) {
    return apiCall(`/tournaments/${tournamentId}/roster/${teamId}/decline`, {
      method: 'POST',
    });
  },
};

// Invitation APIs (Team Invitations with CPF validation)
export const invitationApi = {
  // Get all invitations for the current user
  async getInvitations() {
    try {
      return await apiCall('/invitations');
    } catch (error) {
      console.error('❌ Error fetching invitations:', error);
      // Return empty array if endpoint doesn't exist yet
      return { invitations: [] };
    }
  },

  // Send invitation to athlete (only teams, athlete must have CPF)
  async sendInvitation(athleteId: string, message?: string) {
    return apiCall('/invitations/send', {
      method: 'POST',
      body: JSON.stringify({ athleteId, message }),
    });
  },

  // Get invitations for current athlete
  async getAthleteInvitations() {
    return apiCall('/invitations/athlete');
  },

  // Get invitations sent by current team
  async getTeamInvitations() {
    return apiCall('/invitations/team');
  },

  // Accept invitation
  async acceptInvitation(invitationId: string) {
    return apiCall(`/invitations/${invitationId}/accept`, {
      method: 'POST',
    });
  },

  // Reject invitation
  async rejectInvitation(invitationId: string) {
    return apiCall(`/invitations/${invitationId}/reject`, {
      method: 'POST',
    });
  },

  // Respond to an invitation (accept or reject)
  async respondToInvitation(invitationId: string, status: 'accepted' | 'rejected') {
    return apiCall(`/invitations/${invitationId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  // Cancel an invitation (before it's accepted/rejected)
  async cancelInvitation(invitationId: string) {
    return apiCall(`/invitations/${invitationId}`, {
      method: 'DELETE',
    });
  },

  // Leave current team (athlete only)
  async leaveTeam() {
    return apiCall('/teams/leave', {
      method: 'POST',
    });
  },
};

// Master Admin APIs (only for eri.2113@gmail.com)
export const masterAdminApi = {
  // Check if current user is master
  async checkMasterStatus() {
    try {
      // Verificar se usuário está autenticado antes
      const token = await getAuthToken();
      if (!token) {
        // Usuário não autenticado - retornar false silenciosamente
        return { isMaster: false };
      }
      // Usar modo silent para não exibir erros no console
      const result = await apiCall('/admin/check-master', {}, true);
      // Se retornou com erro silencioso, retornar false
      if (result.silent) {
        return { isMaster: false };
      }
      return result;
    } catch (error: any) {
      // Não logar erro no console - apenas retornar false
      return { isMaster: false };
    }
  },

  // Delete post (master only)
  async deletePost(postId: string) {
    return apiCall(`/admin/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  // Delete tournament (master only)
  async deleteTournament(tournamentId: string) {
    return apiCall(`/admin/tournaments/${tournamentId}`, {
      method: 'DELETE',
    });
  },

  // Get all users (master only)
  async getAllUsers() {
    return apiCall('/admin/users');
  },

  // Delete user (master only)
  async deleteUser(userId: string) {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Lives/Streaming APIs
export const liveApi = {
  // Create a new live stream
  async createLive(data: {
    title: string;
    description?: string;
    scheduledFor?: string;
    thumbnailUrl?: string;
  }) {
    return apiCall('/lives', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all live streams
  async getLives(status?: 'live' | 'scheduled' | 'ended') {
    const params = status ? `?status=${status}` : '';
    return apiCall(`/lives${params}`);
  },

  // Get single live stream
  async getLive(liveId: string) {
    return apiCall(`/lives/${liveId}`);
  },

  // Start a live stream
  async startLive(liveId: string) {
    return apiCall(`/lives/${liveId}/start`, {
      method: 'POST',
    });
  },

  // End a live stream
  async endLive(liveId: string) {
    return apiCall(`/lives/${liveId}/end`, {
      method: 'POST',
    });
  },

  // Send chat message
  async sendChatMessage(liveId: string, message: string) {
    return apiCall(`/lives/${liveId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Get chat messages
  async getChatMessages(liveId: string, limit = 50) {
    return apiCall(`/lives/${liveId}/chat?limit=${limit}`);
  },

  // Update viewer count
  async updateViewerCount(liveId: string, action: 'join' | 'leave') {
    return apiCall(`/lives/${liveId}/viewers`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },

  // Delete live (creator or master only)
  async deleteLive(liveId: string) {
    return apiCall(`/lives/${liveId}`, {
      method: 'DELETE',
    });
  },
};

// Team Roster Management APIs
export const teamRosterApi = {
  // Get team roster/elenco
  async getTeamRoster(teamId: string) {
    return apiCall(`/teams/${teamId}/players`);
  },

  // Alias para getTeamRoster
  async getTeamPlayers(teamId: string) {
    return this.getTeamRoster(teamId);
  },

  // Add player to roster
  async addPlayerToRoster(teamId: string, playerId: string, playerData: any) {
    return apiCall(`/teams/${teamId}/players`, {
      method: 'POST',
      body: JSON.stringify({ playerId, ...playerData }),
    });
  },

  // Alias mais amigável
  async addPlayer(teamId: string, playerId: string, playerData: any) {
    return this.addPlayerToRoster(teamId, playerId, playerData);
  },

  // Update player in roster
  async updatePlayerInRoster(teamId: string, playerId: string, updates: any) {
    return apiCall(`/teams/${teamId}/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Remove player from roster
  async removePlayerFromRoster(teamId: string, playerId: string) {
    return apiCall(`/teams/${teamId}/players/${playerId}`, {
      method: 'DELETE',
    });
  },

  // Search player by CPF
  async searchPlayerByCPF(cpf: string, teamId: string) {
    return apiCall(`/teams/${teamId}/search-player?cpf=${cpf}`);
  },

  // Get available players (free agents or without team)
  async getAvailablePlayers(filters?: { position?: string; minRating?: number }) {
    const params = new URLSearchParams();
    if (filters?.position) params.append('position', filters.position);
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    
    return apiCall(`/players/available?${params.toString()}`);
  },
};

// Team Request APIs (Athletes requesting to join teams)
export const teamRequestApi = {
  // Create team request (athlete requests to join a team)
  async createRequest(teamId: string, message?: string) {
    return apiCall(`/teams/${teamId}/request`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Get requests for a team (team sees who wants to join)
  async getTeamRequests() {
    return apiCall('/teams/requests');
  },

  // Get requests sent by athlete
  async getAthleteRequests() {
    return apiCall('/athlete/requests');
  },

  // Accept team request (team accepts athlete)
  async acceptRequest(requestId: string) {
    return apiCall(`/teams/requests/${requestId}/accept`, {
      method: 'POST',
    });
  },

  // Reject team request
  async rejectRequest(requestId: string) {
    return apiCall(`/teams/requests/${requestId}/reject`, {
      method: 'POST',
    });
  },

  // Cancel team request (athlete cancels their own request)
  async cancelRequest(requestId: string) {
    return apiCall(`/teams/requests/${requestId}`, {
      method: 'DELETE',
    });
  },
};

// Team Categories Management APIs
export const teamCategoryApi = {
  // Get all categories and squads for a team
  async getCategories(teamId: string) {
    return apiCall(`/teams/${teamId}/categories`);
  },

  // Create new category (Feminino/Masculino)
  async createCategory(teamId: string, categoryName: string) {
    return apiCall(`/teams/${teamId}/categories`, {
      method: 'POST',
      body: JSON.stringify({ categoryName }),
    });
  },

  // Create new squad within a category
  async createSquad(teamId: string, categoryId: string, squadName: string) {
    return apiCall(`/teams/${teamId}/categories/${categoryId}/squads`, {
      method: 'POST',
      body: JSON.stringify({ squadName }),
    });
  },

  // Get specific squad with players
  async getSquad(teamId: string, squadId: string) {
    return apiCall(`/teams/${teamId}/squads/${squadId}`);
  },

  // Delete squad
  async deleteSquad(teamId: string, squadId: string) {
    return apiCall(`/teams/${teamId}/squads/${squadId}`, {
      method: 'DELETE',
    });
  },

  // Add player to squad
  async addPlayerToSquad(teamId: string, squadId: string, playerData: any) {
    return apiCall(`/teams/${teamId}/squads/${squadId}/players`, {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  },

  // Remove player from squad
  async removePlayerFromSquad(teamId: string, squadId: string, playerId: string) {
    return apiCall(`/teams/${teamId}/squads/${squadId}/players/${playerId}`, {
      method: 'DELETE',
    });
  },

  // Get squads for tournament registration
  async getSquadsForTournament(teamId: string, tournamentType?: 'indoor' | 'beach') {
    const params = tournamentType ? `?type=${tournamentType}` : '';
    return apiCall(`/teams/${teamId}/squads/available${params}`);
  },
};

export interface Athlete {
  id: number;
  name: string;
  position: string;
  age: number;
  height: string;
  team: string | null;
  verified: boolean;
  followers: number;
  fans: number;
  sponsors: number;
  achievements: string[];
  freeAgent: boolean;
  cpf?: string;
  rating: number;
}

export interface Team {
  id: number;
  name: string;
  city: string;
  founded: number;
  verified: boolean;
  followers: number;
  championships: number;
  players: number[];
}

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorType: "athlete" | "team";
  verified: boolean;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}

export interface Tournament {
  id: number;
  name: string;
  organizer: string;
  startDate: string;
  endDate: string;
  teams: number[];
  status: "upcoming" | "ongoing" | "finished";
  location: string;
}

// DADOS FAKE REMOVIDOS - Sistema agora trabalha apenas com cadastros reais do banco de dados
// As interfaces foram mantidas para compatibilidade de tipos

export const mockAthletes: Athlete[] = [];
export const mockTeams: Team[] = [];
export const mockPosts: Post[] = [];
export const mockTournaments: Tournament[] = [];
/**
 * Sistema de Monetização VolleyPro
 * Planos de assinatura e cotas de publicidade
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing: 'monthly' | 'yearly';
  yearlyDiscount?: number;
  color: string;
  icon: string;
  popular?: boolean;
  features: string[];
  athleteFeatures?: string[];
  teamFeatures?: string[];
  limits: {
    posts: number | 'unlimited';
    photos: number | 'unlimited';
    videos: number | 'unlimited';
    lives: number | 'unlimited';
    storage: string;
    analytics: boolean;
    verification: boolean;
    sponsorships: boolean;
    monetization: boolean;
    adsRemoval: boolean;
    customProfile: boolean;
    prioritySupport: boolean;
  };
}

export interface AdvertisingQuota {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // dias
  color: string;
  icon: string;
  popular?: boolean;
  features: string[];
  placements: {
    feedBanner: boolean;
    sidebarBanner: boolean;
    storiesSponsored: boolean;
    liveStreamAds: boolean;
    tournamentSponsorship: boolean;
    athleteSponsorship: boolean;
    highlightPost: boolean;
    emailNewsletter: boolean;
  };
  impressions: {
    min: number;
    max: number;
  };
  ctr: string; // Click Through Rate estimado
  roi: string; // Retorno sobre investimento estimado
}

// ===============================================
// PLANOS DE ASSINATURA
// ===============================================

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Para iniciantes que querem explorar o VolleyPro',
    price: 0,
    billing: 'monthly',
    color: '#64748b',
    icon: '🆓',
    features: [
      'Perfil básico',
      'Feed de notícias',
      'Seguir atletas e times',
      '10 posts por mês',
      '5 fotos por semana',
      '1 vídeo por semana',
      'Participar de torneios',
      'Comentar e reagir',
      'Mensagens básicas',
      '500MB de armazenamento',
    ],
    limits: {
      posts: 10,
      photos: 5,
      videos: 1,
      lives: 0,
      storage: '500MB',
      analytics: false,
      verification: false,
      sponsorships: false,
      monetization: false,
      adsRemoval: false,
      customProfile: false,
      prioritySupport: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para atletas e times que levam o vôlei a sério',
    price: 19.90,
    billing: 'monthly',
    yearlyDiscount: 20, // 20% desconto no anual
    color: '#0066ff',
    icon: '⭐',
    popular: true,
    features: [
      'Tudo do plano Free',
      'Badge PRO no perfil',
      'Posts ilimitados',
      'Fotos ilimitadas',
      '10 vídeos por semana',
      '2 lives por semana',
      'Analytics básico',
      'Perfil personalizado',
      'Sem anúncios',
      '5GB de armazenamento',
      'Destaque em buscas',
      'Suporte prioritário',
    ],
    athleteFeatures: [
      'Vitrine de jogadores destacada',
      'Estatísticas detalhadas',
      'Histórico de conquistas',
      'Certificado digital',
    ],
    teamFeatures: [
      'Gestão de elenco completa',
      'Convocações ilimitadas',
      'Torneios destacados',
      'Logo personalizado',
    ],
    limits: {
      posts: 'unlimited',
      photos: 'unlimited',
      videos: 10,
      lives: 2,
      storage: '5GB',
      analytics: true,
      verification: false,
      sponsorships: false,
      monetization: false,
      adsRemoval: true,
      customProfile: true,
      prioritySupport: true,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para profissionais que querem se destacar',
    price: 49.90,
    billing: 'monthly',
    yearlyDiscount: 25,
    color: '#8b5cf6',
    icon: '💎',
    features: [
      'Tudo do plano Pro',
      'Badge PREMIUM verificado',
      'Vídeos ilimitados',
      'Lives ilimitadas',
      'Analytics avançado',
      'Monetização habilitada',
      'Ganhe com patrocínios',
      'Página de patrocinadores',
      '20GB de armazenamento',
      'Transmissão em HD',
      'Chat exclusivo VIP',
      'Suporte 24/7',
    ],
    athleteFeatures: [
      'Selo de verificação',
      'Monetização por lives',
      'Patrocínios destacados',
      'Comissão de 70% em vendas',
      'Loja virtual integrada',
      'Consultoria de carreira',
    ],
    teamFeatures: [
      'Patrocínios gerenciados',
      'Dashboard de receitas',
      'Sistema de sócios-torcedores',
      'Bilheteria digital',
      'Transmissões profissionais',
      'Marketing automatizado',
    ],
    limits: {
      posts: 'unlimited',
      photos: 'unlimited',
      videos: 'unlimited',
      lives: 'unlimited',
      storage: '20GB',
      analytics: true,
      verification: true,
      sponsorships: true,
      monetization: true,
      adsRemoval: true,
      customProfile: true,
      prioritySupport: true,
    },
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Para organizações e atletas de alto nível',
    price: 99.90,
    billing: 'monthly',
    yearlyDiscount: 30,
    color: '#f59e0b',
    icon: '👑',
    features: [
      'Tudo do plano Premium',
      'Badge ELITE exclusivo',
      'Armazenamento ilimitado',
      'Transmissão 4K',
      'Analytics em tempo real',
      'API de integração',
      'White label opcional',
      'Gerente de conta dedicado',
      'Consultoria estratégica',
      'Marketing personalizado',
      'Eventos exclusivos',
      'Networking VIP',
    ],
    athleteFeatures: [
      'Selo dourado verificado',
      'Comissão de 80% em vendas',
      'Agente digital IA',
      'Análise de performance IA',
      'Networking com marcas',
      'Contratos facilitados',
      'Assessoria jurídica',
      'Planejamento financeiro',
    ],
    teamFeatures: [
      'Sistema completo de gestão',
      'CRM de torcedores',
      'E-commerce profissional',
      'App personalizado',
      'Múltiplas transmissões simultâneas',
      'Sistema de ingressos',
      'Dashboard executivo',
      'Inteligência de mercado',
    ],
    limits: {
      posts: 'unlimited',
      photos: 'unlimited',
      videos: 'unlimited',
      lives: 'unlimited',
      storage: 'Ilimitado',
      analytics: true,
      verification: true,
      sponsorships: true,
      monetization: true,
      adsRemoval: true,
      customProfile: true,
      prioritySupport: true,
    },
  },
];

// ===============================================
// COTAS DE PUBLICIDADE PARA EMPRESAS
// ===============================================

export const ADVERTISING_QUOTAS: AdvertisingQuota[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal para pequenas empresas e marcas locais',
    price: 299,
    duration: 30,
    color: '#10b981',
    icon: '🚀',
    features: [
      'Banner lateral 300x250px',
      'Até 50.000 impressões/mês',
      '1 post patrocinado no feed',
      'Segmentação por região',
      'Relatório mensal básico',
      'Link direto para seu site',
      'Suporte por email',
    ],
    placements: {
      feedBanner: false,
      sidebarBanner: true,
      storiesSponsored: false,
      liveStreamAds: false,
      tournamentSponsorship: false,
      athleteSponsorship: false,
      highlightPost: true,
      emailNewsletter: false,
    },
    impressions: {
      min: 30000,
      max: 50000,
    },
    ctr: '1.5-2.5%',
    roi: '150-250%',
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Para marcas em crescimento no mercado esportivo',
    price: 799,
    duration: 30,
    color: '#0066ff',
    icon: '📈',
    popular: true,
    features: [
      'Banner lateral + Feed',
      'Até 150.000 impressões/mês',
      '5 posts patrocinados',
      'Stories patrocinados (3/semana)',
      'Segmentação avançada',
      'Relatórios semanais',
      'Dashboard em tempo real',
      'Suporte prioritário',
      'Logo em torneios (1/mês)',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: false,
      tournamentSponsorship: true,
      athleteSponsorship: false,
      highlightPost: true,
      emailNewsletter: false,
    },
    impressions: {
      min: 100000,
      max: 150000,
    },
    ctr: '2.5-4%',
    roi: '250-400%',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para empresas que querem dominar o mercado',
    price: 1999,
    duration: 30,
    color: '#8b5cf6',
    icon: '💼',
    features: [
      'Todos os formatos de banner',
      'Até 500.000 impressões/mês',
      '15 posts patrocinados',
      'Stories ilimitados',
      'Anúncios em lives',
      'Patrocínio de 3 torneios',
      'Patrocínio de 5 atletas',
      'Email marketing (newsletter)',
      'Conteúdo criativo incluso',
      'Gerente de conta dedicado',
      'Relatórios personalizados',
      'A/B testing',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: true,
      tournamentSponsorship: true,
      athleteSponsorship: true,
      highlightPost: true,
      emailNewsletter: true,
    },
    impressions: {
      min: 400000,
      max: 500000,
    },
    ctr: '3.5-5.5%',
    roi: '350-550%',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Soluções completas para grandes marcas',
    price: 4999,
    duration: 30,
    color: '#f59e0b',
    icon: '🏆',
    features: [
      'Presença total na plataforma',
      'Impressões ilimitadas',
      'Posts patrocinados ilimitados',
      'Naming rights de torneios',
      'Patrocínio master de ligas',
      'Patrocínio de até 20 atletas',
      'Campanhas personalizadas',
      'Conteúdo exclusivo produzido',
      'Lives exclusivas da marca',
      'Eventos patrocinados',
      'Integração com CRM',
      'API personalizada',
      'Equipe dedicada',
      'Consultoria estratégica',
      'Relatórios executivos',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: true,
      tournamentSponsorship: true,
      athleteSponsorship: true,
      highlightPost: true,
      emailNewsletter: true,
    },
    impressions: {
      min: 1000000,
      max: 5000000,
    },
    ctr: '5-8%',
    roi: '500-800%',
  },
  {
    id: 'flash',
    name: 'Flash',
    description: 'Campanha rápida de 7 dias para eventos pontuais',
    price: 499,
    duration: 7,
    color: '#ec4899',
    icon: '⚡',
    features: [
      'Banner no feed por 7 dias',
      'Até 100.000 impressões',
      '3 posts em destaque',
      'Stories diários',
      'Segmentação específica',
      'Ideal para eventos',
      'Ativação rápida (24h)',
      'Relatório final completo',
    ],
    placements: {
      feedBanner: true,
      sidebarBanner: true,
      storiesSponsored: true,
      liveStreamAds: false,
      tournamentSponsorship: false,
      athleteSponsorship: false,
      highlightPost: true,
      emailNewsletter: false,
    },
    impressions: {
      min: 50000,
      max: 100000,
    },
    ctr: '2-3.5%',
    roi: '200-350%',
  },
];

// ===============================================
// OPÇÕES DE MONETIZAÇÃO PARA ATLETAS
// ===============================================

export interface AthleteMonetizationOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  commission: number; // % que o atleta recebe
  minimumPlan: string; // ID do plano mínimo necessário
  features: string[];
}

export const ATHLETE_MONETIZATION_OPTIONS: AthleteMonetizationOption[] = [
  {
    id: 'lives',
    name: 'Monetização de Lives',
    description: 'Ganhe com transmissões ao vivo',
    icon: '📹',
    color: '#ef4444',
    commission: 70,
    minimumPlan: 'premium',
    features: [
      'Doações durante lives',
      'Assinaturas de espectadores',
      'Super chats destacados',
      'Acesso VIP pago',
      'Replays pagos',
    ],
  },
  {
    id: 'content',
    name: 'Conteúdo Exclusivo',
    description: 'Venda conteúdo premium para fãs',
    icon: '🎬',
    color: '#8b5cf6',
    commission: 75,
    minimumPlan: 'premium',
    features: [
      'Posts exclusivos pagos',
      'Tutoriais e dicas',
      'Bastidores VIP',
      'Treinos personalizados',
      'Ebooks e guias',
    ],
  },
  {
    id: 'sponsorships',
    name: 'Patrocínios',
    description: 'Conecte-se com marcas e empresas',
    icon: '🤝',
    color: '#0066ff',
    commission: 80,
    minimumPlan: 'premium',
    features: [
      'Marketplace de patrocínio',
      'Propostas de marcas',
      'Contratos facilitados',
      'Pagamentos seguros',
      'Gestão de campanhas',
    ],
  },
  {
    id: 'coaching',
    name: 'Coaching & Mentorias',
    description: 'Ofereça sessões de treino e consultoria',
    icon: '🎓',
    color: '#10b981',
    commission: 85,
    minimumPlan: 'premium',
    features: [
      'Agendamento integrado',
      'Chamadas de vídeo',
      'Planos de treino',
      'Análise de performance',
      'Certificados',
    ],
  },
  {
    id: 'merchandise',
    name: 'Loja de Produtos',
    description: 'Venda produtos personalizados',
    icon: '🛍️',
    color: '#f59e0b',
    commission: 70,
    minimumPlan: 'premium',
    features: [
      'Loja integrada',
      'Print on demand',
      'Gestão de estoque',
      'Envio automatizado',
      'Branding personalizado',
    ],
  },
  {
    id: 'subscriptions',
    name: 'Clube de Fãs',
    description: 'Crie um clube com benefícios mensais',
    icon: '⭐',
    color: '#ec4899',
    commission: 80,
    minimumPlan: 'premium',
    features: [
      'Assinaturas mensais',
      'Conteúdo exclusivo',
      'Eventos privados',
      'Interação direta',
      'Descontos em produtos',
    ],
  },
];

// Função para calcular preço anual com desconto
export function getYearlyPrice(plan: SubscriptionPlan): number {
  if (plan.price === 0) return 0;
  const monthlyTotal = plan.price * 12;
  const discount = plan.yearlyDiscount || 0;
  return monthlyTotal * (1 - discount / 100);
}

// Função para calcular economia anual
export function getYearlySavings(plan: SubscriptionPlan): number {
  if (plan.price === 0) return 0;
  const monthlyTotal = plan.price * 12;
  const yearlyPrice = getYearlyPrice(plan);
  return monthlyTotal - yearlyPrice;
}

// Função para formatar preço
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

// Função para formatar impressões
export function formatImpressions(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}
// Templates e inspirações para criação de conteúdo no VolleyPro

export interface PostTemplate {
  id: string;
  title: string;
  category: 'jogo' | 'treino' | 'motivacao' | 'conquista' | 'estatistica' | 'dica' | 'bastidores' | 'convocacao';
  icon: string;
  description: string;
  template: string;
  placeholder: string;
  hashtags: string[];
  color: string;
  examples: string[];
}

export const POST_TEMPLATES: PostTemplate[] = [
  // Resultado de Jogo
  {
    id: 'game-victory',
    title: 'Vitória no Jogo',
    category: 'jogo',
    icon: '🏆',
    description: 'Compartilhe a vitória do seu time',
    template: '🏐 VITÓRIA! [Seu Time] [Placar] [Time Adversário]\n\n[Descreva o jogo e destaque os pontos altos]\n\n#VolleyPro #Vitoria',
    placeholder: 'Ex: Minas Tênis 3x1 Dentil/Praia Clube\n\nQue jogo incrível! Virada épica no terceiro set! 🔥',
    hashtags: ['#VolleyPro', '#Vitoria', '#Volei'],
    color: '#22c55e',
    examples: [
      '🏐 VITÓRIA! Minas 3x1 Osasco\n\nQue partida! Recuperação incrível no 3º set! Carol liderou com 18 pontos. Próximo jogo já é clássico! 💪🏐\n\n#VolleyPro #Vitoria #Superliga',
      '🏆 VENCEMOS! Sesi Bauru 3x0 Goiás\n\nDominação total! Bloqueio funcionou perfeitamente (12 bloqueios). Wallace imparável com 21 pontos! 🔥\n\n#VolleyPro #Vitoria #Volei'
    ]
  },
  
  // Resultado de Treino
  {
    id: 'training',
    title: 'Dia de Treino',
    category: 'treino',
    icon: '💪',
    description: 'Mostre sua dedicação nos treinos',
    template: '💪 TREINO PESADO HOJE!\n\n[O que treinou]\n[Como foi o treino]\n\nFoco em [objetivo]\n\n#VolleyPro #Treino #Foco',
    placeholder: 'Ex: Treino de ataque e bloqueio por 3 horas!\nFoco total na precisão.',
    hashtags: ['#VolleyPro', '#Treino', '#Foco', '#Dedicacao'],
    color: '#f59e0b',
    examples: [
      '💪 TREINO PESADO HOJE!\n\n3 horas de saque e recepção. Batemos 200 saques cada! 🎯\n\nFoco no jogo de sábado contra o Flamengo. Vamos com tudo! 🔥\n\n#VolleyPro #Treino #Foco',
      '🏋️ DIA DE FORÇA!\n\nAcademia + quadra = combinação perfeita\nSalto vertical aumentando 💪\n\nPreparação física é 50% do jogo!\n\n#VolleyPro #Treino #PreparacaoFisica'
    ]
  },
  
  // Motivação
  {
    id: 'motivation',
    title: 'Mensagem Motivacional',
    category: 'motivacao',
    icon: '🔥',
    description: 'Inspire seus seguidores e equipe',
    template: '🔥 [Sua mensagem motivacional]\n\n[Reflexão ou objetivo]\n\n#VolleyPro #Motivacao #Volei',
    placeholder: 'Ex: Cada treino é uma oportunidade de evoluir.\nNão desista dos seus sonhos! 💪',
    hashtags: ['#VolleyPro', '#Motivacao', '#Foco', '#Superacao'],
    color: '#ef4444',
    examples: [
      '🔥 "O impossível é apenas uma opinião."\n\nCada bola defendida, cada ponto conquistado, cada treino pesado... tudo isso constrói campeões! 💪\n\nNunca desista! 🏐\n\n#VolleyPro #Motivacao #Superacao',
      '⚡ A diferença entre o possível e o impossível está na sua VONTADE!\n\nHoje acordei às 5h para treinar.\nAmanhã faço de novo.\nE depois de amanhã também.\n\nÉ assim que se chega ao topo! 🏆\n\n#VolleyPro #Determinacao #Foco'
    ]
  },
  
  // Conquista/Achievement
  {
    id: 'achievement',
    title: 'Conquista Pessoal',
    category: 'conquista',
    icon: '🎯',
    description: 'Celebre suas conquistas e marcos',
    template: '🎯 CONQUISTA DESBLOQUEADA!\n\n[Sua conquista]\n\n[Como chegou até aqui]\n\nGrato(a) a [agradecimentos]\n\n#VolleyPro #Conquista',
    placeholder: 'Ex: 100 jogos pela Seleção! 🇧🇷\nJornada incrível até aqui!',
    hashtags: ['#VolleyPro', '#Conquista', '#Milestone'],
    color: '#a855f7',
    examples: [
      '🎯 CONQUISTA DESBLOQUEADA!\n\n1000 PONTOS NA CARREIRA! 🏐\n\nSão anos de dedicação, suor e muita paixão pelo vôlei. Cada ponto tem uma história especial.\n\nGrato à minha família, técnicos e companheiros de equipe! 🙏\n\n#VolleyPro #Milestone #1000Pontos',
      '🏆 MEU PRIMEIRO TÍTULO PROFISSIONAL!\n\nCampeão da Copa Brasil! Ainda não acredito! 😭🏐\n\nTodo o sacrifício valeu a pena. Obrigado time, você foi SENSACIONAL! 💪\n\n#VolleyPro #Campeao #CopaBrasil'
    ]
  },
  
  // Estatísticas
  {
    id: 'statistics',
    title: 'Números do Jogo',
    category: 'estatistica',
    icon: '📊',
    description: 'Compartilhe estatísticas impressionantes',
    template: '📊 NÚMEROS DO JOGO:\n\n[Estatísticas]\n\n[Análise breve]\n\n#VolleyPro #Stats',
    placeholder: 'Ex: 25 pontos | 65% de ataque | 8 bloqueios\nMelhor partida da temporada!',
    hashtags: ['#VolleyPro', '#Stats', '#Numeros'],
    color: '#3b82f6',
    examples: [
      '📊 NÚMEROS DO JOGO:\n\n⚡ 28 pontos\n🎯 72% de eficiência no ataque\n🛡️ 6 bloqueios\n💪 3 aces\n\nMelhor performance individual da temporada! Mas o importante foi a VITÓRIA! 🏆\n\n#VolleyPro #Stats #Performance',
      '📊 ESTATÍSTICAS ABSURDAS DO JOGO:\n\n🏐 Time: 15 bloqueios\n⚡ 58% de ataque\n🎯 95% de recepção\n\nEsse é o vôlei que a gente gosta! Defesa impecável! 🛡️\n\n#VolleyPro #Defesa #Stats'
    ]
  },
  
  // Dica Técnica
  {
    id: 'tip',
    title: 'Dica Técnica',
    category: 'dica',
    icon: '💡',
    description: 'Compartilhe conhecimento técnico',
    template: '💡 DICA DO DIA:\n\n[Fundamento/Técnica]\n\n[Explicação e dica]\n\n#VolleyPro #Dica #Tecnica',
    placeholder: 'Ex: Dica para melhorar o saque:\nFoco no movimento do braço e timing!',
    hashtags: ['#VolleyPro', '#Dica', '#Tecnica', '#Fundamentos'],
    color: '#eab308',
    examples: [
      '💡 DICA DO DIA: Saque Viagem\n\n🎯 Segredo: Bater na bola SECA, sem efeito\n⚡ A bola flutua e engana o recebedor\n💪 Foco no timing do braço\n\nTreinem! Esse saque ganha muitos pontos! 🏐\n\n#VolleyPro #Dica #Saque',
      '💡 DICA PARA PONTEIROS:\n\n🏐 Ataque de fundo é sobre TIMING, não força\n⏱️ Espere a bola chegar\n👀 Leia o bloqueio\n⚡ Execute com precisão\n\nPotência vem do movimento completo! 💪\n\n#VolleyPro #Dica #Ataque'
    ]
  },
  
  // Bastidores
  {
    id: 'behind-scenes',
    title: 'Bastidores',
    category: 'bastidores',
    icon: '🎬',
    description: 'Mostre os bastidores do vôlei',
    template: '🎬 BASTIDORES:\n\n[O que está acontecendo]\n\n[Contexto divertido ou interessante]\n\n#VolleyPro #Bastidores',
    placeholder: 'Ex: Concentração antes do jogo decisivo!\nEquipe focada e confiante! 💪',
    hashtags: ['#VolleyPro', '#Bastidores', '#Volei'],
    color: '#ec4899',
    examples: [
      '🎬 BASTIDORES: Aquecimento pré-jogo\n\nAquela energia antes de entrar em quadra! ⚡\nTime concentrado, música rolando, clima pesado! 🔥\n\nDaqui a pouco é GUERRA! 🏐💪\n\n#VolleyPro #Bastidores #PreJogo',
      '🎬 VIAGEM DE ÔNIBUS\n\n8 horas de estrada = campeonato de truco infinito 😂\n\nNinguém aguenta mais o Robertão ganhando!\n\nJogo amanhã, mas hoje a diversão é garantida! 🚌🏐\n\n#VolleyPro #Bastidores #Viagem'
    ]
  },
  
  // Convocação
  {
    id: 'call-up',
    title: 'Convocação/Convite',
    category: 'convocacao',
    icon: '📢',
    description: 'Anuncie convocações ou convites',
    template: '📢 [Tipo de convocação]!\n\n[Detalhes]\n\n[Sentimento/Objetivo]\n\n#VolleyPro #Convocacao',
    placeholder: 'Ex: CONVOCADO para a Seleção! 🇧🇷\nSonho realizado! Vamos buscar o ouro!',
    hashtags: ['#VolleyPro', '#Convocacao', '#SelecaoBrasileira'],
    color: '#10b981',
    examples: [
      '📢 CONVOCADO PARA A SELEÇÃO BRASILEIRA! 🇧🇷\n\nNão tenho palavras para descrever esse momento! Sonho desde criança! 😭🏐\n\nVou representar nosso país com muita HONRA e GARRA! Vamos buscar o título! 🏆💪\n\n#VolleyPro #SelecaoBrasileira #Convocacao',
      '📢 NOVO DESAFIO!\n\nAssinei com o Minas Tênis Clube! 🏐⭐\n\nFeliz demais por fazer parte desse time gigante! Vamos brigar por todos os títulos! 🏆\n\nObrigado à diretoria pela confiança! 💛🖤\n\n#VolleyPro #NovoTime #Minas'
    ]
  },
];

export const CONTENT_IDEAS = [
  {
    category: '🏐 Sobre Jogos',
    ideas: [
      'Compartilhe o placar e destaque da partida',
      'Poste uma foto do momento decisivo',
      'Agradeça à torcida pelo apoio',
      'Analise taticamente o jogo',
      'Destaque o MVP da partida',
      'Celebre uma virada épica',
    ]
  },
  {
    category: '💪 Sobre Treinos',
    ideas: [
      'Mostre sua rotina de treinos',
      'Compartilhe exercícios específicos',
      'Fale sobre preparação física',
      'Destaque evolução técnica',
      'Poste treino com companheiros',
      'Mostre treino de fundamentos',
    ]
  },
  {
    category: '🎯 Conquistas',
    ideas: [
      'Celebre títulos conquistados',
      'Marcos pessoais (100 jogos, 1000 pontos)',
      'Prêmios individuais',
      'Recordes batidos',
      'Convocações para seleção',
      'Renovação de contrato',
    ]
  },
  {
    category: '🔥 Motivação',
    ideas: [
      'Frases inspiradoras',
      'História de superação',
      'Objetivo para a temporada',
      'Mensagem para jovens atletas',
      'Reflexão sobre dedicação',
      'Agradecer apoio da família',
    ]
  },
  {
    category: '💡 Educativo',
    ideas: [
      'Dica técnica de fundamentos',
      'Explicar uma tática',
      'Ensinar uma jogada',
      'Falar sobre posicionamento',
      'Dicas de aquecimento',
      'Importância da alimentação',
    ]
  },
  {
    category: '🎬 Bastidores',
    ideas: [
      'Concentração pré-jogo',
      'Viagens com o time',
      'Momento engraçado no treino',
      'Rotina no dia do jogo',
      'Vestiário após vitória',
      'Hotel com a equipe',
    ]
  },
];

export const HASHTAG_SUGGESTIONS = {
  geral: ['#VolleyPro', '#Volei', '#Volleyball', '#Brasil'],
  competicoes: ['#Superliga', '#LigaDasNacoes', '#VNL', '#Mundial', '#Olimpiadas'],
  times: ['#Minas', '#Sesi', '#Praia', '#Flamengo', '#Sesc', '#Osasco', '#Dentil'],
  fundamentos: ['#Ataque', '#Bloqueio', '#Saque', '#Levantada', '#Defesa', '#Recepção'],
  inspiracao: ['#Motivacao', '#Foco', '#Dedicacao', '#Superacao', '#Determinacao'],
  treino: ['#Treino', '#PreparacaoFisica', '#Academia', '#Fundamentos'],
};

export function getTemplatesByCategory(category: PostTemplate['category']): PostTemplate[] {
  return POST_TEMPLATES.filter(t => t.category === category);
}

export function getRandomTemplate(): PostTemplate {
  return POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)];
}

export function getTemplateById(id: string): PostTemplate | undefined {
  return POST_TEMPLATES.find(t => t.id === id);
}

export const POST_TIPS = [
  '📸 Posts com fotos recebem 3x mais engajamento!',
  '🎬 Vídeos de jogadas incríveis viralizam facilmente!',
  '#️⃣ Use 3-5 hashtags relevantes em cada post',
  '⏰ Poste após jogos enquanto está quente!',
  '💬 Responda comentários para aumentar engajamento',
  '🏐 Mencione companheiros de equipe nos posts',
  '🎯 Seja autêntico - mostre sua personalidade!',
  '📊 Compartilhe suas estatísticas impressionantes',
  '🔥 Use emojis para tornar posts mais visuais',
  '💪 Inspire outros atletas com sua jornada!',
];
/**
 * Sistema Completo de Torneios VolleyPro
 * Gestão de competições, partidas, classificação e estatísticas
 */

export type TournamentFormat = 'single_elimination' | 'round_robin' | 'group_stage' | 'double_elimination';
export type TournamentStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
export type MatchStatus = 'scheduled' | 'ongoing' | 'finished' | 'cancelled';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  organizerId: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  location: string;
  format: TournamentFormat;
  status: TournamentStatus;
  maxTeams: number;
  registeredTeams: string[];
  prizes?: {
    first?: string;
    second?: string;
    third?: string;
  };
  rules?: string;
  contactEmail?: string;
  contactPhone?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName?: string;
  awayTeamName?: string;
  scheduledDate?: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  homeSets: number;
  awaySets: number;
  setScores?: number[][]; // [[25,23], [25,20], [22,25]]
  winnerId?: string;
  liveStreamId?: string;
  statistics?: MatchStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface MatchStatistics {
  homeTeam: TeamMatchStats;
  awayTeam: TeamMatchStats;
}

export interface TeamMatchStats {
  points: number;
  aces: number;
  blocks: number;
  attacks: number;
  attackErrors: number;
  receptionErrors: number;
  serviceErrors: number;
}

export interface Standing {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  pointsScored: number;
  pointsConceded: number;
  points: number; // Pontos na classificação
}

export interface PlayerStatistics {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  matches: number;
  points: number;
  aces: number;
  blocks: number;
  attacks: number;
  attackSuccess: number; // percentual
  receptions: number;
  receptionSuccess: number; // percentual
  rating: number; // 0-10
  votes: number; // votos para MVP
}

// ===============================================
// FUNÇÕES DE GERAÇÃO DE CHAVEAMENTO
// ===============================================

/**
 * Gera chaveamento de eliminatória simples
 */
export function generateSingleEliminationBracket(teamIds: string[]): Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'homeTeamName' | 'awayTeamName'>[] {
  const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
  const matches: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'homeTeamName' | 'awayTeamName'>[] = [];
  
  // Calcular número de rodadas (potência de 2)
  const totalRounds = Math.ceil(Math.log2(teamIds.length));
  
  // Primeira rodada
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        tournamentId: '', // Será preenchido depois
        round: 1,
        matchNumber: Math.floor(i / 2) + 1,
        homeTeamId: shuffled[i],
        awayTeamId: shuffled[i + 1],
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
        homeSets: 0,
        awaySets: 0,
      });
    }
  }
  
  // Criar placeholders para as próximas rodadas
  let previousRoundMatches = matches.length;
  for (let round = 2; round <= totalRounds; round++) {
    const matchesInRound = Math.ceil(previousRoundMatches / 2);
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        tournamentId: '',
        round,
        matchNumber: i + 1,
        homeTeamId: 'TBD', // A definir após resultado anterior
        awayTeamId: 'TBD',
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
        homeSets: 0,
        awaySets: 0,
      });
    }
    previousRoundMatches = matchesInRound;
  }
  
  return matches;
}

/**
 * Gera chaveamento de pontos corridos (todos contra todos)
 */
export function generateRoundRobinMatches(teamIds: string[]): Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'homeTeamName' | 'awayTeamName'>[] {
  const matches: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'homeTeamName' | 'awayTeamName'>[] = [];
  let matchNumber = 1;
  let round = 1;
  
  // Cada time joga contra todos os outros
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      matches.push({
        tournamentId: '',
        round,
        matchNumber: matchNumber++,
        homeTeamId: teamIds[i],
        awayTeamId: teamIds[j],
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
        homeSets: 0,
        awaySets: 0,
      });
      
      // A cada conjunto de jogos, incrementa a rodada
      if (matchNumber % (teamIds.length / 2) === 0) {
        round++;
      }
    }
  }
  
  return matches;
}

/**
 * Gera fase de grupos + mata-mata
 */
export function generateGroupStageMatches(teamIds: string[], groupsCount: number = 2): {
  groups: { [key: string]: string[] };
  matches: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'homeTeamName' | 'awayTeamName'>[];
} {
  const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
  const groups: { [key: string]: string[] } = {};
  const teamsPerGroup = Math.ceil(shuffled.length / groupsCount);
  
  // Distribuir times nos grupos
  for (let i = 0; i < groupsCount; i++) {
    const groupName = String.fromCharCode(65 + i); // A, B, C, D...
    groups[groupName] = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup);
  }
  
  const matches: Omit<Match, 'id' | 'createdAt' | 'updatedAt' | 'homeTeamName' | 'awayTeamName'>[] = [];
  let matchNumber = 1;
  
  // Gerar jogos dentro de cada grupo (round robin)
  Object.keys(groups).forEach((groupName, groupIndex) => {
    const groupTeams = groups[groupName];
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        matches.push({
          tournamentId: '',
          round: 1, // Fase de grupos é rodada 1
          matchNumber: matchNumber++,
          homeTeamId: groupTeams[i],
          awayTeamId: groupTeams[j],
          status: 'scheduled',
          homeScore: 0,
          awayScore: 0,
          homeSets: 0,
          awaySets: 0,
        });
      }
    }
  });
  
  // Criar placeholders para fase mata-mata (os melhores de cada grupo)
  // Semifinais
  matches.push(
    {
      tournamentId: '',
      round: 2,
      matchNumber: matchNumber++,
      homeTeamId: 'Winner Group A',
      awayTeamId: 'Runner-up Group B',
      status: 'scheduled',
      homeScore: 0,
      awayScore: 0,
      homeSets: 0,
      awaySets: 0,
    },
    {
      tournamentId: '',
      round: 2,
      matchNumber: matchNumber++,
      homeTeamId: 'Winner Group B',
      awayTeamId: 'Runner-up Group A',
      status: 'scheduled',
      homeScore: 0,
      awayScore: 0,
      homeSets: 0,
      awaySets: 0,
    }
  );
  
  // Final
  matches.push({
    tournamentId: '',
    round: 3,
    matchNumber: matchNumber++,
    homeTeamId: 'Winner Semi 1',
    awayTeamId: 'Winner Semi 2',
    status: 'scheduled',
    homeScore: 0,
    awayScore: 0,
    homeSets: 0,
    awaySets: 0,
  });
  
  return { groups, matches };
}

// ===============================================
// FUNÇÕES DE CÁLCULO DE CLASSIFICAÇÃO
// ===============================================

/**
 * Calcula tabela de classificação baseada nos resultados
 */
export function calculateStandings(matches: Match[], teams: any[]): Standing[] {
  const standings: { [teamId: string]: Partial<Standing> } = {};
  
  // Inicializar standings
  teams.forEach((team) => {
    standings[team.id] = {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      pointsScored: 0,
      pointsConceded: 0,
      points: 0,
    };
  });
  
  // Processar partidas finalizadas
  matches
    .filter((m) => m.status === 'finished')
    .forEach((match) => {
      const home = standings[match.homeTeamId];
      const away = standings[match.awayTeamId];
      
      if (!home || !away) return;
      
      // Atualizar jogos disputados
      home.played! += 1;
      away.played! += 1;
      
      // Atualizar sets
      home.setsWon! += match.homeSets;
      home.setsLost! += match.awaySets;
      away.setsWon! += match.awaySets;
      away.setsLost! += match.homeSets;
      
      // Atualizar pontos (score)
      home.pointsScored! += match.homeScore;
      home.pointsConceded! += match.awayScore;
      away.pointsScored! += match.awayScore;
      away.pointsConceded! += match.homeScore;
      
      // Determinar vencedor e atribuir pontos na classificação
      if (match.homeSets > match.awaySets) {
        home.wins! += 1;
        away.losses! += 1;
        
        // 3 pontos por vitória 3x0 ou 3x1, 2 pontos por vitória 3x2
        if (match.homeSets === 3 && match.awaySets <= 1) {
          home.points! += 3;
        } else {
          home.points! += 2;
        }
        
        // 1 ponto para o perdedor em 3x2
        if (match.awaySets === 2) {
          away.points! += 1;
        }
      } else {
        away.wins! += 1;
        home.losses! += 1;
        
        if (match.awaySets === 3 && match.homeSets <= 1) {
          away.points! += 3;
        } else {
          away.points! += 2;
        }
        
        if (match.homeSets === 2) {
          home.points! += 1;
        }
      }
    });
  
  // Converter para array e ordenar
  const standingsArray = Object.values(standings) as Standing[];
  standingsArray.sort((a, b) => {
    // 1. Pontos na classificação
    if (b.points !== a.points) return b.points - a.points;
    // 2. Número de vitórias
    if (b.wins !== a.wins) return b.wins - a.wins;
    // 3. Saldo de sets
    const aSetBalance = a.setsWon - a.setsLost;
    const bSetBalance = b.setsWon - b.setsLost;
    if (bSetBalance !== aSetBalance) return bSetBalance - aSetBalance;
    // 4. Saldo de pontos
    const aPointBalance = a.pointsScored - a.pointsConceded;
    const bPointBalance = b.pointsScored - b.pointsConceded;
    return bPointBalance - aPointBalance;
  });
  
  // Atribuir posições
  standingsArray.forEach((standing, index) => {
    standing.position = index + 1;
  });
  
  return standingsArray;
}

// ===============================================
// FUNÇÕES DE ESTATÍSTICAS
// ===============================================

/**
 * Calcula estatísticas de um jogador no torneio
 */
export function calculatePlayerStatistics(
  matches: Match[],
  playerId: string
): PlayerStatistics | null {
  // Por enquanto retorna mock, será implementado quando tivermos estatísticas detalhadas
  return null;
}

/**
 * Calcula ranking de MVP baseado em votos e performance
 */
export function calculateMVPRanking(
  playerStats: PlayerStatistics[]
): PlayerStatistics[] {
  return playerStats.sort((a, b) => {
    // Combinar rating e votos para o ranking final
    const aScore = a.rating * 0.6 + (a.votes / 1000) * 0.4;
    const bScore = b.rating * 0.6 + (b.votes / 1000) * 0.4;
    return bScore - aScore;
  });
}

// ===============================================
// FUNÇÕES AUXILIARES
// ===============================================

/**
 * Verifica se um torneio pode ser iniciado
 */
export function canStartTournament(tournament: Tournament): {
  canStart: boolean;
  reason?: string;
} {
  if (tournament.status !== 'upcoming') {
    return { canStart: false, reason: 'Torneio já iniciado ou finalizado' };
  }
  
  if (tournament.registeredTeams.length < 2) {
    return { canStart: false, reason: 'Mínimo de 2 times necessário' };
  }
  
  if (tournament.registeredTeams.length > tournament.maxTeams) {
    return { canStart: false, reason: 'Número de times excede o máximo permitido' };
  }
  
  return { canStart: true };
}

/**
 * Calcula próximos confrontos no mata-mata
 */
export function advanceWinnersInBracket(
  matches: Match[],
  completedMatchId: string
): Partial<Match>[] {
  const completedMatch = matches.find((m) => m.id === completedMatchId);
  if (!completedMatch || !completedMatch.winnerId) {
    return [];
  }
  
  const updates: Partial<Match>[] = [];
  
  // Encontrar próxima partida (rodada seguinte, número de jogo correspondente)
  const nextRound = completedMatch.round + 1;
  const nextMatchNumber = Math.ceil(completedMatch.matchNumber / 2);
  
  const nextMatch = matches.find(
    (m) => m.round === nextRound && m.matchNumber === nextMatchNumber
  );
  
  if (nextMatch) {
    // Se o número da partida completada é ímpar, o vencedor vai para homeTeam
    // Se é par, vai para awayTeam
    if (completedMatch.matchNumber % 2 === 1) {
      updates.push({
        id: nextMatch.id,
        homeTeamId: completedMatch.winnerId,
      });
    } else {
      updates.push({
        id: nextMatch.id,
        awayTeamId: completedMatch.winnerId,
      });
    }
  }
  
  return updates;
}

/**
 * Gera nome da rodada baseado no formato
 */
export function getRoundName(round: number, totalRounds: number, format: TournamentFormat): string {
  if (format === 'single_elimination' || format === 'double_elimination') {
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semifinal';
    if (round === totalRounds - 2) return 'Quartas de Final';
    if (round === totalRounds - 3) return 'Oitavas de Final';
    return `Rodada ${round}`;
  }
  
  if (format === 'group_stage') {
    if (round === 1) return 'Fase de Grupos';
    if (round === 2) return 'Semifinal';
    if (round === 3) return 'Final';
  }
  
  return `Rodada ${round}`;
}

/**
 * Formata saldo de sets
 */
export function formatSetBalance(setsWon: number, setsLost: number): string {
  const balance = setsWon - setsLost;
  return `${setsWon}-${setsLost} (${balance >= 0 ? '+' : ''}${balance})`;
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Calcula eficiência de ataque
 */
export function calculateAttackEfficiency(attacks: number, errors: number): number {
  if (attacks === 0) return 0;
  return ((attacks - errors) / attacks) * 100;
}
// Posts informativos sobre vôlei brasileiro e mundial
// Conteúdo temporário para entreter usuários enquanto o Feed é populado

export interface NewsPost {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  category: 'noticia' | 'curiosidade' | 'estatistica' | 'historia' | 'destaque';
  tags: string[];
  createdAt: string;
}

// DADOS FAKE REMOVIDOS - Sistema agora trabalha apenas com posts reais de usuários
export const VOLLEYBALL_NEWS: NewsPost[] = [];

export function getCategoryLabel(category: NewsPost['category']): string {
  const labels: Record<NewsPost['category'], string> = {
    noticia: '📰 Notícia',
    curiosidade: '💡 Curiosidade',
    estatistica: '📊 Estatísticas',
    historia: '📚 História',
    destaque: '⭐ Destaque',
  };
  return labels[category];
}

export function getCategoryColor(category: NewsPost['category']): string {
  const colors: Record<NewsPost['category'], string> = {
    noticia: 'bg-blue-500',
    curiosidade: 'bg-yellow-500',
    estatistica: 'bg-green-500',
    historia: 'bg-purple-500',
    destaque: 'bg-orange-500',
  };
  return colors[category];
}

// Função para embaralhar e pegar N posts aleatórios
export function getRandomNews(count: number = 5): NewsPost[] {
  const shuffled = [...VOLLEYBALL_NEWS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Função para formatar posts de notícias como posts do Feed
export function formatNewsAsPost(news: NewsPost) {
  return {
    id: news.id,
    content: news.content,
    authorName: 'VolleyPro Notícias',
    authorPhotoUrl: null,
    likes: Math.floor(Math.random() * 50) + 10, // 10-60 likes
    comments: Math.floor(Math.random() * 15) + 2, // 2-17 comentários
    shares: Math.floor(Math.random() * 8) + 1, // 1-9 compartilhamentos
    createdAt: news.createdAt,
    mediaUrl: news.mediaUrl,
    mediaType: news.mediaType,
    verified: true,
    isOfficial: true, // Flag para identificar posts oficiais
    category: news.category,
    tags: news.tags,
  };
}

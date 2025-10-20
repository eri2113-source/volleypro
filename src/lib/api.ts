import { projectId, publicAnonKey } from '../utils/supabase/info';

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
    const { createClient } = await import('../utils/supabase/client');
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao obter sessão:', error);
      return null;
    }
    
    if (session?.access_token) {
      // Salvar no localStorage para cache
      localStorage.setItem('volleypro_token', session.access_token);
      localStorage.setItem('volleypro_user_id', session.user.id);
      return session.access_token;
    }
    
    console.warn('⚠️ Nenhuma sessão ativa encontrada');
    return null;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error);
    return null;
  }
}

// Generic API call helper
async function apiCall(endpoint: string, options: RequestInit = {}, silent = false) {
  const token = await getAuthToken();
  
  if (!token && !silent) {
    console.warn('⚠️ Nenhum token de autenticação encontrado');
  }
  
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
        const { createClient } = await import('../utils/supabase/client');
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
    } catch (error) {
      console.error("❌ Erro na API de signup:", error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    console.log("📡 [Chrome-Optimized] Iniciando login...");
    try {
      const { createClient } = await import('../utils/supabase/client');
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
      const { createClient } = await import('../utils/supabase/client');
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

  async getSession() {
    try {
      const { createClient } = await import('../utils/supabase/client');
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
      const { createClient } = await import('../utils/supabase/client');
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
      
      console.error('❌ Erro desconhecido no upload:', error);
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

  async unregisterTeam(tournamentId: string) {
    return apiCall(`/tournaments/${tournamentId}/register`, {
      method: 'DELETE',
    });
  },

  // Beach volleyball - Individual registration
  async registerIndividual(tournamentId: string, partnerId?: string) {
    return apiCall(`/tournaments/${tournamentId}/register-individual`, {
      method: 'POST',
      body: JSON.stringify({ partnerId }),
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
  async getRoster(tournamentId: string, teamId: string) {
    return apiCall(`/tournaments/${tournamentId}/roster/${teamId}`);
  },

  // Save/Update roster
  async saveRoster(tournamentId: string, teamId: string, roster: any) {
    return apiCall(`/tournaments/${tournamentId}/roster`, {
      method: 'POST',
      body: JSON.stringify({ teamId, roster }),
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

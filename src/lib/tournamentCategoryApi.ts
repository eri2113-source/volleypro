import { projectId, publicAnonKey } from '../utils/supabase/info';
import { createClient } from '../utils/supabase/client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba`;

// Get auth token
async function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao obter sessão:', error);
      return null;
    }
    
    if (session?.access_token) {
      return session.access_token;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao obter token:', error);
    return null;
  }
}

// Category Format Interface
export interface CategoryFormat {
  name: string; // "Masculino", "Feminino", "Misto"
  format: "groups" | "round_robin"; // "groups" = chaves, "round_robin" = todos contra todos
  numGroups?: number; // Apenas para formato de chaves
  teamsPerGroup?: number; // Apenas para formato de chaves
  advancingPerGroup?: number; // Quantos passam por grupo (padrão: 2)
  teams: string[]; // IDs dos times inscritos nesta categoria
}

// Save category formats for a tournament
export async function saveCategoryFormats(
  tournamentId: string, 
  categories: CategoryFormat[]
): Promise<{ success: boolean; categoryFormats?: CategoryFormat[] }> {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('You must be logged in to save category formats');
    }
    
    const response = await fetch(
      `${API_BASE}/tournaments/${tournamentId}/category-formats`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categories })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save category formats');
    }
    
    return data;
  } catch (error: any) {
    console.error('❌ Error saving category formats:', error);
    throw error;
  }
}

// Get category formats for a tournament
export async function getCategoryFormats(
  tournamentId: string
): Promise<{ categoryFormats: CategoryFormat[] }> {
  try {
    const response = await fetch(
      `${API_BASE}/tournaments/${tournamentId}/category-formats`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get category formats');
    }
    
    return data;
  } catch (error: any) {
    console.error('❌ Error getting category formats:', error);
    throw error;
  }
}

// Generate groups for a category
export function generateGroups(
  teams: string[],
  numGroups: number
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].slice(0, numGroups);
  
  // Initialize groups
  groupNames.forEach(name => {
    groups[name] = [];
  });
  
  // Shuffle teams
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  
  // Distribute teams evenly
  shuffledTeams.forEach((team, index) => {
    const groupIndex = index % numGroups;
    groups[groupNames[groupIndex]].push(team);
  });
  
  return groups;
}

// Generate round robin matches
export function generateRoundRobinMatches(teams: string[]): Array<[string, string]> {
  const matches: Array<[string, string]> = [];
  
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push([teams[i], teams[j]]);
    }
  }
  
  return matches;
}

// Calculate optimal number of groups
export function calculateOptimalGroups(numTeams: number): number {
  if (numTeams <= 4) return 1;
  if (numTeams <= 8) return 2;
  if (numTeams <= 12) return 3;
  if (numTeams <= 16) return 4;
  return Math.ceil(numTeams / 4);
}

// Get bracket format for a category
export function getBracketFormat(categoryFormat: CategoryFormat): string {
  if (categoryFormat.format === 'round_robin') {
    return 'Todos contra Todos';
  }
  
  const numGroups = categoryFormat.numGroups || 1;
  const advancing = categoryFormat.advancingPerGroup || 2;
  
  return `${numGroups} ${numGroups === 1 ? 'Grupo' : 'Grupos'} • ${advancing} ${advancing === 1 ? 'avança' : 'avançam'}`;
}

// Export as default object
export const tournamentCategoryApi = {
  saveCategoryFormats,
  getCategoryFormats,
  generateGroups,
  generateRoundRobinMatches,
  calculateOptimalGroups,
  getBracketFormat
};

// Sistema de Categorias e Equipes para Times

export interface TeamCategory {
  id: string;
  name: string; // "Feminino" ou "Masculino"
  teams: TeamSquad[];
  createdAt: string;
}

export interface TeamSquad {
  id: string;
  name: string; // "Equipe A", "Equipe B", etc.
  categoryId: string;
  categoryName: string;
  players: TeamPlayer[];
  createdAt: string;
  active: boolean;
}

export interface TeamPlayer {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
  cpf?: string;
  addedAt: string;
}

export const CATEGORIES = {
  FEMALE: 'Feminino',
  MALE: 'Masculino',
} as const;

export const DEFAULT_SQUAD_NAMES = [
  'Equipe A',
  'Equipe B', 
  'Equipe C',
  'Equipe D',
  'Equipe E',
  'Equipe Sub-17',
  'Equipe Sub-19',
  'Equipe Sub-21',
  'Equipe Juvenil',
  'Equipe Adulto',
  'Equipe Master',
];

// Criar ID único para categoria
export function createCategoryId(teamId: string, categoryName: string): string {
  return `category:${teamId}:${categoryName.toLowerCase()}`;
}

// Criar ID único para equipe
export function createSquadId(categoryId: string, squadName: string): string {
  const timestamp = Date.now();
  return `squad:${categoryId}:${squadName.replace(/\s+/g, '-').toLowerCase()}:${timestamp}`;
}

// Validar se jogador já está em outra equipe do mesmo torneio
export function validatePlayerUniqueness(
  playerId: string,
  tournamentId: string,
  registeredSquads: string[]
): { valid: boolean; error?: string } {
  // Esta função será implementada no backend
  // para verificar se o jogador já está registrado em outra equipe
  return { valid: true };
}

// Agrupar equipes por categoria
export function groupSquadsByCategory(squads: TeamSquad[]): Map<string, TeamSquad[]> {
  const grouped = new Map<string, TeamSquad[]>();
  
  squads.forEach(squad => {
    const existing = grouped.get(squad.categoryName) || [];
    grouped.set(squad.categoryName, [...existing, squad]);
  });
  
  return grouped;
}

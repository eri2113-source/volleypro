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

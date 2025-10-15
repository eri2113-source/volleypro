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

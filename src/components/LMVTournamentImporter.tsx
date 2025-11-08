import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Edit2, Save, X, Plus, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Match {
  id: string;
  jogNumber: number;
  category: string;
  date: string;
  day: string;
  time: string;
  key: string;
  chave: string;
  quadra: string;
  teamA: string;
  teamB: string;
  set1A: string;
  set1B: string;
  set2A: string;
  set2B: string;
  set3A: string;
  set3B: string;
  teamALogo?: string;
  teamBLogo?: string;
}

interface Team {
  id: string;
  name: string;
  logo_url?: string;
}

const LMV_MATCHES: Omit<Match, 'id' | 'teamALogo' | 'teamBLogo'>[] = [
  { jogNumber: 1, category: 'M', date: '07/NOV', day: 'Sex', time: '19:15', key: 'B', chave: '2', quadra: 'ALPHA A', teamA: 'ALPHA A', teamB: 'SOBRINHOS A', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 2, category: 'M', date: '07/NOV', day: 'Sex', time: '19:15', key: 'A', chave: '1', quadra: 'CASTRO ALVES', teamA: 'CASTRO ALVES', teamB: 'THE BLACKS', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 3, category: 'M', date: '07/NOV', day: 'Sex', time: '20:45', key: 'A', chave: '1', quadra: 'CASTRO ALVES*', teamA: 'CASTRO ALVES*', teamB: 'SOBRINHOS B', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 4, category: 'M', date: '08/NOV', day: 'Sab', time: '09:00', key: 'A', chave: '2', quadra: 'GLADIADORES', teamA: 'GLADIADORES', teamB: 'THE BLACKS', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 5, category: 'M', date: '08/NOV', day: 'Sab', time: '10:30', key: 'B', chave: '2', quadra: 'MARKA SPORTS', teamA: 'MARKA SPORTS', teamB: 'ALPHA A', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 6, category: 'M', date: '08/NOV', day: 'Sab', time: '12:00', key: 'A', chave: '2', quadra: 'GLADIADORES', teamA: 'GLADIADORES', teamB: 'SOBRINHOS B', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 7, category: 'M', date: '08/NOV', day: 'Sab', time: '13:30', key: 'A', chave: '2', quadra: 'GLADIADORES*', teamA: 'GLADIADORES*', teamB: 'CASTROS ALVES', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 8, category: 'M', date: '08/NOV', day: 'Sab', time: '15:00', key: 'A', chave: '2', quadra: 'THE BLACKS', teamA: 'THE BLACKS', teamB: 'SOBRINHOS B', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 9, category: 'M', date: '08/NOV', day: 'Sab', time: '16:30', key: 'B', chave: '2', quadra: 'MARKA SPORTS*', teamA: 'MARKA SPORTS*', teamB: 'SOBRINHOS A', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 10, category: 'M', date: '08/NOV', day: 'sab', time: '18:00', key: 'SEMI FINAL', chave: '2', quadra: '1° CHAVE A', teamA: '1° CHAVE A', teamB: '2° CHAVE B', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 11, category: 'M', date: '08/NOV', day: 'sab', time: '19:30', key: 'SEMI FINAL', chave: '2', quadra: '1° CHAVE B', teamA: '1° CHAVE B', teamB: '2° CHAVE A', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 12, category: 'M', date: '09/NOV', day: 'Dom', time: '12:00', key: '3° LUGAR', chave: '1', quadra: 'PERDEDOR JOGO 10', teamA: 'PERDEDOR JOGO 10', teamB: 'PERDEDOR JOGO 11', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
  { jogNumber: 13, category: 'M', date: '09/NOV', day: 'Dom', time: '13:30', key: 'FINAL', chave: '1', quadra: 'VENCEDOR JOGO 10', teamA: 'VENCEDOR JOGO 10', teamB: 'VENCEDOR JOGO 11', set1A: 'x', set1B: 'x', set2A: 'x', set2B: 'x', set3A: 'x', set3B: 'x' },
];

const TEAM_NAME_MAPPING: { [key: string]: string } = {
  'ALPHA A': 'ALPHA A',
  'SOBRINHOS A': 'SOBRINHOS A',
  'CASTRO ALVES': 'CASTRO ALVES',
  'CASTRO ALVES*': 'CASTRO ALVES',
  'THE BLACKS': 'THE BLACKS',
  'SOBRINHOS B': 'SOBRINHOS B',
  'GLADIADORES': 'GLADIADORES',
  'GLADIADORES*': 'GLADIADORES',
  'MARKA SPORTS': 'MARKA SPORTS',
  'MARKA SPORTS*': 'MARKA SPORTS',
  'CASTROS ALVES': 'CASTRO ALVES',
};

export default function LMVTournamentImporter() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [tournamentId, setTournamentId] = useState<string | null>(null);
  const [creatorId, setCreatorId] = useState<string>('');
  const [teamLogos, setTeamLogos] = useState<{ [key: string]: string }>({});
  const [editingLogo, setEditingLogo] = useState<{ team: string; url: string } | null>(null);

  useEffect(() => {
    loadCurrentUser();
    loadRegisteredTeams();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCreatorId(user.id);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  // Buscar times cadastrados no sistema e relacionar com nomes LMV
  const loadRegisteredTeams = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/users?type=team`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) return;

      const { users: allTeams } = await response.json();
      
      // Mapeamento de nomes LMV para nomes reais de times cadastrados
      // Inclui variações comuns de como os times podem estar cadastrados
      const teamNameMatches: { [key: string]: string[] } = {
        'ALPHA A': ['ALPHA', 'ALPHA A', 'ALPHA SPORTS', 'ALPHASPORTS', 'ALPHA-A', 'TIME ALPHA'],
        'SOBRINHOS A': ['SOBRINHOS', 'SOBRINHOS A', 'OS SOBRINHOS', 'SOBRINHOS-A', 'TIME SOBRINHOS'],
        'SOBRINHOS B': ['SOBRINHOS B', 'SOBRINHOS 2', 'SOBRINHOS-B', 'SOBRINHOS II'],
        'CASTRO ALVES': ['CASTRO', 'CASTRO ALVES', 'CASTROS ALVES', 'CASTRO-ALVES', 'TIME CASTRO'],
        'THE BLACKS': ['BLACKS', 'THE BLACKS', 'BLACK', 'OS BLACKS'],
        'GLADIADORES': ['GLADIADORES', 'GLAD', 'GLADIADOR', 'TIME GLADIADORES'],
        'MARKA SPORTS': ['MARKA', 'MARKA SPORTS', 'MARKASPORTS', 'MARKA-SPORTS', 'TIME MARKA'],
      };

      const logosMap: { [key: string]: string } = {};

      // Para cada time LMV, tentar encontrar o time real cadastrado
      Object.entries(teamNameMatches).forEach(([lmvName, possibleNames]) => {
        const foundTeam = allTeams.find((team: any) => {
          const teamNameUpper = (team.name || '').toUpperCase().trim();
          
          // Tentar match exato primeiro
          const exactMatch = possibleNames.some(name => 
            teamNameUpper === name.toUpperCase()
          );
          
          if (exactMatch) return true;
          
          // Tentar match parcial (contém ou está contido)
          return possibleNames.some(name => {
            const nameUpper = name.toUpperCase();
            return teamNameUpper.includes(nameUpper) || nameUpper.includes(teamNameUpper);
          });
        });

        if (foundTeam && foundTeam.photoUrl) {
          logosMap[lmvName] = foundTeam.photoUrl;
          console.log(`✅ Logo encontrado para ${lmvName}:`, foundTeam.name, '→', foundTeam.photoUrl.substring(0, 50) + '...');
        } else {
          console.log(`⚠️ Logo NÃO encontrado para ${lmvName}`);
        }
      });

      setTeamLogos(logosMap);
      
      if (Object.keys(logosMap).length > 0) {
        toast.success(`${Object.keys(logosMap).length} logos de times encontrados automaticamente!`);
      }
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    }
  };

  const getTeamLogo = (teamName: string): string => {
    const mappedName = TEAM_NAME_MAPPING[teamName] || teamName;
    
    // Se já tiver logo customizado, usar
    if (teamLogos[mappedName]) {
      return teamLogos[mappedName];
    }

    // Logos SVG base64 dos times LMV
    const createSVGLogo = (text: string, bgColor: string, textColor: string = 'white') => {
      const svg = `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="${bgColor}" rx="8"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="${textColor}" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${text}</text>
      </svg>`;
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const defaultLogos: { [key: string]: string } = {
      'ALPHA A': createSVGLogo('ALPHA', '#3b82f6'),
      'SOBRINHOS A': createSVGLogo('SOBR A', '#22c55e'),
      'CASTRO ALVES': createSVGLogo('CASTRO', '#ef4444'),
      'THE BLACKS': createSVGLogo('BLACKS', '#1f2937'),
      'SOBRINHOS B': createSVGLogo('SOBR B', '#10b981'),
      'GLADIADORES': createSVGLogo('GLAD', '#f59e0b'),
      'MARKA SPORTS': createSVGLogo('MARKA', '#8b5cf6'),
    };

    return defaultLogos[mappedName] || createSVGLogo('TIME', '#6b7280');
  };

  const updateTeamLogo = (teamName: string, logoUrl: string) => {
    const mappedName = TEAM_NAME_MAPPING[teamName] || teamName;
    setTeamLogos(prev => ({ ...prev, [mappedName]: logoUrl }));
    
    // Atualizar todas as partidas com o novo logo
    setMatches(prev => prev.map(match => ({
      ...match,
      teamALogo: TEAM_NAME_MAPPING[match.teamA] === mappedName || match.teamA === mappedName 
        ? logoUrl 
        : match.teamALogo,
      teamBLogo: TEAM_NAME_MAPPING[match.teamB] === mappedName || match.teamB === mappedName 
        ? logoUrl 
        : match.teamBLogo,
    })));
    
    toast.success(`Logo do ${mappedName} atualizado!`);
  };

  const importTournament = async () => {
    if (!creatorId) {
      toast.error('Você precisa estar logado para importar o torneio');
      return;
    }

    setLoading(true);
    try {
      // Criar o torneio
      const tournamentData = {
        name: 'Liga Municipal de Voleibol 2025 - 2ª Etapa - Masculino',
        description: 'Segunda etapa da Liga Municipal de Voleibol 2025 - Categoria Masculina',
        startDate: '2025-11-07',
        endDate: '2025-11-09',
        location: 'Múltiplas Quadras',
        arena: 'Ginásio Municipal',
        city: 'Cidade',
        state: 'Estado',
        format: 'groups',
        modalityType: 'indoor',
        registrationDeadline: '2025-11-07',
        maxTeams: 7,
        categories: ['masculino'],
        divisions: ['Adulto'],
      };

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(tournamentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao criar torneio:', errorData);
        throw new Error(errorData.error || 'Erro ao criar torneio');
      }

      const { tournament } = await response.json();
      setTournamentId(tournament.id);

      // Preparar partidas com logos
      const matchesWithLogos = LMV_MATCHES.map((match, index) => {
        return {
          ...match,
          id: `match-${index}`,
          teamALogo: getTeamLogo(match.teamA),
          teamBLogo: getTeamLogo(match.teamB),
        };
      });

      setMatches(matchesWithLogos);
      setShowImportDialog(false);
      toast.success('Torneio LMV importado com sucesso!');
    } catch (error) {
      console.error('Erro ao importar torneio:', error);
      toast.error('Erro ao importar torneio');
    } finally {
      setLoading(false);
    }
  };

  const saveMatch = async (match: Match) => {
    setLoading(true);
    try {
      // Atualizar a partida localmente
      setMatches(prev => 
        prev.map(m => m.id === match.id ? match : m)
      );

      toast.success('Resultado salvo com sucesso!');
      setEditingMatch(null);
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      toast.error('Erro ao salvar resultado');
    } finally {
      setLoading(false);
    }
  };

  const exportToDatabase = async () => {
    if (!tournamentId) {
      toast.error('Importe o torneio primeiro');
      return;
    }

    setLoading(true);
    console.log('🚀 Iniciando exportação de partidas...');
    console.log('📋 Torneio ID:', tournamentId);
    console.log('📊 Total de partidas:', matches.length);
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      // Extrair apenas o ID do torneio (remover prefixo se houver)
      const cleanTournamentId = tournamentId.replace('tournament:', '');
      console.log('🔑 Tournament ID limpo:', cleanTournamentId);
      
      // Criar partidas via backend
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        console.log(`\n📤 Exportando partida ${i + 1}/${matches.length}:`, match.teamA, 'vs', match.teamB);
        const matchData = {
          tournamentId: cleanTournamentId,
          round: match.key,
          teamA: match.teamA,
          teamB: match.teamB,
          teamALogo: match.teamALogo || getTeamLogo(match.teamA),
          teamBLogo: match.teamBLogo || getTeamLogo(match.teamB),
          scheduledDate: match.date,
          scheduledTime: match.time,
          court: match.quadra,
          arena: match.arena || 'Ginásio Municipal',
          category: match.category || 'masculino',
          division: 'Adulto',
          sets: {
            teamA: [
              match.set1A !== 'x' ? parseInt(match.set1A) : null,
              match.set2A !== 'x' ? parseInt(match.set2A) : null,
              match.set3A !== 'x' ? parseInt(match.set3A) : null
            ].filter(s => s !== null),
            teamB: [
              match.set1B !== 'x' ? parseInt(match.set1B) : null,
              match.set2B !== 'x' ? parseInt(match.set2B) : null,
              match.set3B !== 'x' ? parseInt(match.set3B) : null
            ].filter(s => s !== null)
          },
          status: 'scheduled',
        };

        console.log('📝 Dados da partida:', matchData);

        const url = `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${cleanTournamentId}/matches`;
        console.log('🌐 URL:', url);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(matchData),
        });

        console.log('📡 Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Erro ao criar partida:', errorData);
          errorCount++;
          // Não parar a execução, continuar com próxima partida
          console.warn(`⚠️ Partida ${i + 1} falhou, continuando...`);
        } else {
          const result = await response.json();
          console.log('✅ Partida criada:', result);
          successCount++;
        }
      }

      console.log('\n📊 Resumo da exportação:');
      console.log(`✅ Sucesso: ${successCount}`);
      console.log(`❌ Erros: ${errorCount}`);
      console.log(`📝 Total: ${matches.length}`);

      if (successCount > 0) {
        toast.success(`${successCount} partida(s) exportada(s) com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.warning(`${errorCount} partida(s) falharam. Verifique o console.`);
      }
    } catch (error: any) {
      console.error('Erro ao exportar partidas:', error);
      toast.error(error.message || 'Erro ao exportar para o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Importador de Torneio LMV
          </h1>
          <p className="text-muted-foreground">
            Liga Municipal de Voleibol 2025 - 2ª Etapa - Masculino
          </p>
        </div>
        <div className="flex gap-2">
          {!tournamentId ? (
            <Button onClick={() => setShowImportDialog(true)} disabled={loading}>
              <Upload className="w-4 h-4 mr-2" />
              Importar Torneio
            </Button>
          ) : (
            <Button onClick={exportToDatabase} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Exportar para Banco
            </Button>
          )}
        </div>
      </div>

      {/* Gerenciar Logos dos Times */}
      {matches.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Gerenciar Logos e Chaves
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={loadRegisteredTeams}
                disabled={loading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Recarregar Logos
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Os logos são buscados automaticamente dos times cadastrados. Clique em "Recarregar" para atualizar ou no ícone de lápis para editar manualmente.
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Logo real encontrado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span>Placeholder SVG</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chave A */}
              <div>
                <h3 className="mb-3">Chave A</h3>
                <div className="space-y-2">
                  {['CASTRO ALVES', 'GLADIADORES', 'SOBRINHOS B', 'THE BLACKS'].map(team => {
                    const mappedName = TEAM_NAME_MAPPING[team] || team;
                    const hasRealLogo = teamLogos[mappedName] && !teamLogos[mappedName].startsWith('data:');
                    return (
                      <div key={team} className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="relative">
                            <img src={getTeamLogo(team)} alt={team} className="w-8 h-8 object-contain rounded" />
                            {hasRealLogo && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Logo real encontrado" />
                            )}
                          </div>
                          <span className="text-sm">{team}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingLogo({ team, url: getTeamLogo(team) })}
                          className="text-xs"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chave B */}
              <div>
                <h3 className="mb-3">Chave B</h3>
                <div className="space-y-2">
                  {['ALPHA A', 'MARKA SPORTS', 'SOBRINHOS A'].map(team => {
                    const mappedName = TEAM_NAME_MAPPING[team] || team;
                    const hasRealLogo = teamLogos[mappedName] && !teamLogos[mappedName].startsWith('data:');
                    return (
                      <div key={team} className="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="relative">
                            <img src={getTeamLogo(team)} alt={team} className="w-8 h-8 object-contain rounded" />
                            {hasRealLogo && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Logo real encontrado" />
                            )}
                          </div>
                          <span className="text-sm">{team}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingLogo({ team, url: getTeamLogo(team) })}
                          className="text-xs"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Partidas */}
      {matches.length > 0 && (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info da Partida */}
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-2xl">#{match.jogNumber}</div>
                      <div className="text-xs text-muted-foreground">{match.key}</div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {match.date} - {match.day}
                      </div>
                      <div>{match.time}</div>
                      <div className="text-xs">Quadra {match.chave}</div>
                    </div>
                  </div>

                  {/* Times e Placar */}
                  <div className="flex-1">
                    {/* Time A */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {match.teamALogo && (
                          <img src={match.teamALogo} alt={match.teamA} className="w-8 h-8 object-contain" />
                        )}
                        <span>{match.teamA}</span>
                      </div>
                      <div className="flex gap-2">
                        {editingMatch?.id === match.id ? (
                          <>
                            <Input
                              type="text"
                              value={editingMatch.set1A}
                              onChange={(e) => setEditingMatch({...editingMatch, set1A: e.target.value})}
                              className="w-12 text-center"
                              placeholder="0"
                            />
                            <Input
                              type="text"
                              value={editingMatch.set2A}
                              onChange={(e) => setEditingMatch({...editingMatch, set2A: e.target.value})}
                              className="w-12 text-center"
                              placeholder="0"
                            />
                            <Input
                              type="text"
                              value={editingMatch.set3A}
                              onChange={(e) => setEditingMatch({...editingMatch, set3A: e.target.value})}
                              className="w-12 text-center"
                              placeholder="0"
                            />
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-10 flex items-center justify-center border rounded">
                              {match.set1A}
                            </div>
                            <div className="w-12 h-10 flex items-center justify-center border rounded">
                              {match.set2A}
                            </div>
                            <div className="w-12 h-10 flex items-center justify-center border rounded">
                              {match.set3A}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Time B */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {match.teamBLogo && (
                          <img src={match.teamBLogo} alt={match.teamB} className="w-8 h-8 object-contain" />
                        )}
                        <span>{match.teamB}</span>
                      </div>
                      <div className="flex gap-2">
                        {editingMatch?.id === match.id ? (
                          <>
                            <Input
                              type="text"
                              value={editingMatch.set1B}
                              onChange={(e) => setEditingMatch({...editingMatch, set1B: e.target.value})}
                              className="w-12 text-center"
                              placeholder="0"
                            />
                            <Input
                              type="text"
                              value={editingMatch.set2B}
                              onChange={(e) => setEditingMatch({...editingMatch, set2B: e.target.value})}
                              className="w-12 text-center"
                              placeholder="0"
                            />
                            <Input
                              type="text"
                              value={editingMatch.set3B}
                              onChange={(e) => setEditingMatch({...editingMatch, set3B: e.target.value})}
                              className="w-12 text-center"
                              placeholder="0"
                            />
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-10 flex items-center justify-center border rounded">
                              {match.set1B}
                            </div>
                            <div className="w-12 h-10 flex items-center justify-center border rounded">
                              {match.set2B}
                            </div>
                            <div className="w-12 h-10 flex items-center justify-center border rounded">
                              {match.set3B}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {editingMatch?.id === match.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveMatch(editingMatch)}
                          disabled={loading}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMatch(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingMatch(match)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Importação */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Torneio LMV</DialogTitle>
            <DialogDescription>
              Isso irá criar o torneio "Liga Municipal de Voleibol 2025 - 2ª Etapa - Masculino" com todas as partidas da tabela.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="mb-2">O que será importado:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>13 partidas programadas</li>
                <li>7 times participantes (Chave A e Chave B)</li>
                <li>Datas: 07/NOV a 09/NOV</li>
                <li>Fase de grupos + Semifinais + Final</li>
                <li>Escudos dos times quando disponíveis</li>
              </ul>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={importTournament} disabled={loading || !creatorId}>
                {loading ? 'Importando...' : 'Importar Torneio'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar Logo */}
      <Dialog open={!!editingLogo} onOpenChange={(open) => !open && setEditingLogo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Logo - {editingLogo?.team}</DialogTitle>
            <DialogDescription>
              Cole a URL do logo do time. Use uma imagem hospedada na web (PNG, JPG, SVG).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo-url">URL do Logo</Label>
              <Input
                id="logo-url"
                type="url"
                placeholder="https://exemplo.com/logo.png"
                value={editingLogo?.url || ''}
                onChange={(e) => setEditingLogo(prev => prev ? { ...prev, url: e.target.value } : null)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Dica: Use sites como <a href="https://imgbb.com" target="_blank" className="text-blue-500 underline">ImgBB</a> para hospedar suas imagens
              </p>
            </div>
            {editingLogo?.url && (
              <div className="border rounded-lg p-4 flex flex-col items-center gap-2">
                <span className="text-sm text-muted-foreground">Preview:</span>
                <img 
                  src={editingLogo.url} 
                  alt="Preview" 
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80/6b7280/ffffff?text=ERRO';
                  }}
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingLogo(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (editingLogo) {
                    updateTeamLogo(editingLogo.team, editingLogo.url);
                    setEditingLogo(null);
                  }
                }}
                disabled={!editingLogo?.url}
              >
                Salvar Logo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mensagem quando não há partidas */}
      {matches.length === 0 && !showImportDialog && (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">Nenhum torneio importado</h3>
            <p className="text-muted-foreground mb-4">
              Clique em "Importar Torneio" para carregar a tabela da LMV
            </p>
            <Button onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Importar Torneio LMV
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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

  const getTeamLogo = (teamName: string): string => {
    const mappedName = TEAM_NAME_MAPPING[teamName] || teamName;
    
    // Se já tiver logo customizado, usar
    if (teamLogos[mappedName]) {
      return teamLogos[mappedName];
    }

    // Logos placeholder dos times LMV
    const defaultLogos: { [key: string]: string } = {
      'ALPHA A': 'https://via.placeholder.com/80/3b82f6/ffffff?text=ALPHA+A',
      'SOBRINHOS A': 'https://via.placeholder.com/80/22c55e/ffffff?text=SOBR+A',
      'CASTRO ALVES': 'https://via.placeholder.com/80/ef4444/ffffff?text=CASTRO',
      'THE BLACKS': 'https://via.placeholder.com/80/1f2937/ffffff?text=BLACKS',
      'SOBRINHOS B': 'https://via.placeholder.com/80/22c55e/ffffff?text=SOBR+B',
      'GLADIADORES': 'https://via.placeholder.com/80/f59e0b/ffffff?text=GLAD',
      'MARKA SPORTS': 'https://via.placeholder.com/80/8b5cf6/ffffff?text=MARKA',
    };

    return defaultLogos[mappedName] || 'https://via.placeholder.com/80/6b7280/ffffff?text=TIME';
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
        start_date: '2025-11-07',
        end_date: '2025-11-09',
        location: 'Múltiplas Quadras',
        format: 'groups',
        category: 'indoor',
        sport_type: 'indoor',
        registration_deadline: '2025-11-07',
        max_teams: 7,
        creator_id: creatorId,
        status: 'active',
        is_beach: false,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(tournamentData),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao criar torneio');
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
    try {
      const supabase = createClient();
      
      // Salvar todas as partidas no banco de dados
      const matchesData = matches.map(match => ({
        tournament_id: tournamentId,
        round: match.key,
        team_a: match.teamA,
        team_b: match.teamB,
        score_a: [match.set1A !== 'x' ? parseInt(match.set1A) : null, match.set2A !== 'x' ? parseInt(match.set2A) : null, match.set3A !== 'x' ? parseInt(match.set3A) : null].filter(s => s !== null),
        score_b: [match.set1B !== 'x' ? parseInt(match.set1B) : null, match.set2B !== 'x' ? parseInt(match.set2B) : null, match.set3B !== 'x' ? parseInt(match.set3B) : null].filter(s => s !== null),
        scheduled_time: `${match.date} ${match.time}`,
        court: match.quadra,
        status: 'scheduled',
      }));

      const { error } = await supabase
        .from('tournament_matches')
        .insert(matchesData);

      if (error) throw error;

      toast.success('Partidas exportadas para o banco de dados!');
    } catch (error) {
      console.error('Erro ao exportar partidas:', error);
      toast.error('Erro ao exportar para o banco de dados');
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
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Gerenciar Logos e Chaves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chave A */}
              <div>
                <h3 className="mb-3">Chave A</h3>
                <div className="space-y-2">
                  {['CASTRO ALVES', 'GLADIADORES', 'SOBRINHOS B', 'THE BLACKS'].map(team => (
                    <div key={team} className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={getTeamLogo(team)} alt={team} className="w-8 h-8 object-contain rounded" />
                        <span>{team}</span>
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
                  ))}
                </div>
              </div>

              {/* Chave B */}
              <div>
                <h3 className="mb-3">Chave B</h3>
                <div className="space-y-2">
                  {['ALPHA A', 'MARKA SPORTS', 'SOBRINHOS A'].map(team => (
                    <div key={team} className="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={getTeamLogo(team)} alt={team} className="w-8 h-8 object-contain rounded" />
                        <span>{team}</span>
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
                  ))}
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

// Rotas para edição manual de torneios
// Importar e usar no index.tsx

export function addTournamentEditorRoutes(app: any, kv: any, authMiddleware: any) {

  // ============= EDIÇÃO DE PARTIDAS =============

  // Get all matches for a tournament
  app.get('/make-server-0ea22bba/tournaments/:tournamentId/matches', async (c: any) => {
    try {
      const tournamentId = c.req.param('tournamentId');
      
      console.log('📋 Carregando partidas do torneio:', tournamentId);
      
      // Get all matches for this tournament
      const allMatches = await kv.getByPrefix(`match:${tournamentId}:`) || [];
      
      console.log(`✅ ${allMatches.length} partidas encontradas`);
      
      return c.json({ 
        matches: allMatches,
        count: allMatches.length 
      });
    } catch (error: any) {
      console.error('❌ Error getting matches:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  // Update a match (organizer only)
  app.put('/make-server-0ea22bba/tournaments/:tournamentId/matches/:matchId', authMiddleware, async (c: any) => {
    try {
      const userId = c.get('userId');
      const tournamentId = c.req.param('tournamentId');
      const matchId = c.req.param('matchId');
      
      console.log('✏️ Atualizando partida:', { tournamentId, matchId, userId });
      
      // Verify tournament access
      const tournamentKey = `tournament:${tournamentId}`;
      const tournament = await kv.get(tournamentKey);
      
      if (!tournament) {
        return c.json({ error: 'Tournament not found' }, 404);
      }
      
      // Check if user is organizer
      if (tournament.organizerId !== userId && tournament.createdBy !== userId) {
        return c.json({ error: 'Only organizer can edit matches' }, 403);
      }
      
      // Get match data from request
      const matchData = await c.req.json();
      
      // Save match
      const matchKey = matchId.startsWith('match:') ? matchId : `match:${tournamentId}:${matchId}`;
      
      const updatedMatch = {
        ...matchData,
        id: matchId,
        tournamentId,
        updatedAt: new Date().toISOString(),
        updatedBy: userId
      };
      
      await kv.set(matchKey, updatedMatch);
      
      console.log('✅ Partida atualizada com sucesso');
      
      return c.json({ 
        success: true,
        match: updatedMatch 
      });
    } catch (error: any) {
      console.error('❌ Error updating match:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  // Delete a match (organizer only)
  app.delete('/make-server-0ea22bba/tournaments/:tournamentId/matches/:matchId', authMiddleware, async (c: any) => {
    try {
      const userId = c.get('userId');
      const tournamentId = c.req.param('tournamentId');
      const matchId = c.req.param('matchId');
      
      console.log('🗑️ Excluindo partida:', { tournamentId, matchId, userId });
      
      // Verify tournament access
      const tournamentKey = `tournament:${tournamentId}`;
      const tournament = await kv.get(tournamentKey);
      
      if (!tournament) {
        return c.json({ error: 'Tournament not found' }, 404);
      }
      
      // Check if user is organizer
      if (tournament.organizerId !== userId && tournament.createdBy !== userId) {
        return c.json({ error: 'Only organizer can delete matches' }, 403);
      }
      
      // Delete match
      const matchKey = matchId.startsWith('match:') ? matchId : `match:${tournamentId}:${matchId}`;
      await kv.del(matchKey);
      
      console.log('✅ Partida excluída com sucesso');
      
      return c.json({ success: true });
    } catch (error: any) {
      console.error('❌ Error deleting match:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  // ============= EDIÇÃO DE CHAVEAMENTO =============

  // Get bracket for a tournament
  app.get('/make-server-0ea22bba/tournaments/:tournamentId/bracket', async (c: any) => {
    try {
      const tournamentId = c.req.param('tournamentId');
      const category = c.req.query('category') || 'masculino';
      const division = c.req.query('division') || '1';
      
      console.log('🏆 Carregando chaveamento:', { tournamentId, category, division });
      
      // Get bracket
      const bracketKey = `bracket:${tournamentId}:${category}:${division}`;
      const bracket = await kv.get(bracketKey) || [];
      
      console.log(`✅ Chaveamento encontrado: ${bracket.length} nós`);
      
      return c.json({ 
        bracket,
        category,
        division
      });
    } catch (error: any) {
      console.error('❌ Error getting bracket:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  // Update bracket (organizer only)
  app.put('/make-server-0ea22bba/tournaments/:tournamentId/bracket', authMiddleware, async (c: any) => {
    try {
      const userId = c.get('userId');
      const tournamentId = c.req.param('tournamentId');
      
      console.log('✏️ Atualizando chaveamento:', { tournamentId, userId });
      
      // Verify tournament access
      const tournamentKey = `tournament:${tournamentId}`;
      const tournament = await kv.get(tournamentKey);
      
      if (!tournament) {
        return c.json({ error: 'Tournament not found' }, 404);
      }
      
      // Check if user is organizer
      if (tournament.organizerId !== userId && tournament.createdBy !== userId) {
        return c.json({ error: 'Only organizer can edit bracket' }, 403);
      }
      
      // Get bracket data
      const { category, division, bracket } = await c.req.json();
      
      // Save bracket
      const bracketKey = `bracket:${tournamentId}:${category}:${division}`;
      await kv.set(bracketKey, bracket);
      
      console.log('✅ Chaveamento atualizado com sucesso');
      
      return c.json({ 
        success: true,
        bracket,
        category,
        division
      });
    } catch (error: any) {
      console.error('❌ Error updating bracket:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  // ============= GET TEAMS FOR TOURNAMENT =============

  // Get all teams registered in a tournament
  app.get('/make-server-0ea22bba/tournaments/:tournamentId/teams', async (c: any) => {
    try {
      const tournamentId = c.req.param('tournamentId');
      
      console.log('👥 Carregando times do torneio:', tournamentId);
      
      // Get tournament
      const tournamentKey = `tournament:${tournamentId}`;
      const tournament = await kv.get(tournamentKey);
      
      if (!tournament) {
        return c.json({ error: 'Tournament not found' }, 404);
      }
      
      // Get all registered teams
      const teamIds = tournament.registeredTeams || [];
      const teams = [];
      
      for (const teamId of teamIds) {
        const team = await kv.get(`user:${teamId}`);
        if (team) {
          teams.push({
            id: teamId,
            name: team.name,
            logo: team.photoUrl,
            category: team.category,
            division: team.division
          });
        }
      }
      
      console.log(`✅ ${teams.length} times encontrados`);
      
      return c.json({ 
        teams,
        count: teams.length 
      });
    } catch (error: any) {
      console.error('❌ Error getting teams:', error);
      return c.json({ error: error.message }, 500);
    }
  });

  console.log('✅ Tournament editor routes registered');
}

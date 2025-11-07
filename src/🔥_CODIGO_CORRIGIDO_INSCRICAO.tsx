// ============= TOURNAMENT SQUAD REGISTRATION ROUTES =============

// Register squad in tournament
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register-squad', async (c) => {
  console.log(`\n🏆 ====== POST /register-squad ======`);
  console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
  
  try {
    console.log(`   🔍 Passo 1/7: Obtendo dados da requisição...`);
    const tournamentId = c.req.param('tournamentId');
    const body = await c.req.json();
    const { teamId, squadId } = body;
    
    console.log(`   ✅ Dados recebidos:`);
    console.log(`      • tournamentId:`, tournamentId);
    console.log(`      • teamId:`, teamId);
    console.log(`      • squadId:`, squadId);
    console.log(`      • squadId === null:`, squadId === null);
    console.log(`      • squadId === undefined:`, squadId === undefined);
    console.log(`      • !squadId:`, !squadId);
    console.log(`      • Tipo inscrição:`, !squadId ? '🏢 TIME COMPLETO' : '🏐 EQUIPE ESPECÍFICA');
    
    console.log(`\n   🔍 Passo 2/7: Verificando time...`);
    console.log(`      • Buscando time: user:${teamId}`);
    const team = await kv.get(`user:${teamId}`);
    console.log(`      • Time encontrado:`, !!team);
    console.log(`      • Time type:`, team?.userType);
    console.log(`      • Time name:`, team?.name);
    
    if (!team || team.userType !== 'team') {
      console.error(`   ❌ ERRO: Time não encontrado ou inválido`);
      console.error(`      • team exists:`, !!team);
      console.error(`      • team.userType:`, team?.userType);
      return c.json({ error: 'Time não encontrado ou inválido' }, 404);
    }
    
    console.log(`   ✅ Time válido: ${team.name}`);
    
    console.log(`\n   🔍 Passo 3/7: Buscando torneio...`);
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    console.log(`      • fullTournamentId:`, fullTournamentId);
    
    const tournament = await kv.get(fullTournamentId);
    console.log(`      • Torneio encontrado:`, !!tournament);
    
    if (!tournament) {
      console.error(`   ❌ ERRO: Torneio não encontrado no KV`);
      return c.json({ error: 'Torneio não encontrado' }, 404);
    }
    console.log(`   ✅ Torneio encontrado: ${tournament.name}`);
    
    console.log(`\n   🔍 Passo 4/7: Inicializando arrays de inscrição...`);
    // Inicializar registrations se não existir
    if (!tournament.squadRegistrations) {
      tournament.squadRegistrations = [];
      console.log(`      • Array squadRegistrations criado`);
    } else {
      console.log(`      • Array squadRegistrations já existe (${tournament.squadRegistrations.length} itens)`);
    }
    
    let registration;
    
    console.log(`\n   🔍 Passo 5/7: Processando inscrição...`);
    // CASO 1: TIME SIMPLES (squadId = null) - Inscrição completa
    if (!squadId || squadId === null) {
      console.log(`\n   📋 ====== INSCRIÇÃO TIME COMPLETO ======`);
      console.log(`      • Nome do time: ${team.name}`);
      console.log(`      • Total de registrations ANTES: ${tournament.squadRegistrations?.length || 0}`);
      
      // Verificar se time já está inscrito (sem squad específico)
      const alreadyRegistered = tournament.squadRegistrations.find(
        (reg: any) => reg.teamId === teamId && (!reg.squadId || reg.squadId === null)
      );
      
      console.log(`      • Já inscrito:`, !!alreadyRegistered);
      if (alreadyRegistered) {
        console.log(`   ❌ Time já está inscrito!`);
        console.log(`      Registration:`, alreadyRegistered);
        return c.json({ error: 'Este time já está inscrito' }, 400);
      }
      console.log(`   ✅ Pode inscrever!`);
      
      // Criar registro de time completo
      registration = {
        id: `registration:${Date.now()}`,
        tournamentId: fullTournamentId,
        teamId,
        teamName: team.name,
        squadId: null,
        squadName: 'Equipe Principal', // Times simples = Equipe Principal
        categoryName: null,
        players: [],
        city: team.city || null,
        state: team.state || null,
        photoUrl: team.photoUrl || null,
        registeredAt: new Date().toISOString(),
        isFullTeam: true // Flag para identificar time completo
      };
      
      console.log(`   ✅ Time completo "${team.name}" inscrito com sucesso`);
      
    } 
    // CASO 2: TIME COM CATEGORIAS (squadId != null) - Inscrição de equipe específica
    else {
      console.log(`   📋 Buscando equipe específica: ${squadId}`);
      
      // Buscar dados da equipe
      const categories = await kv.get(`team:${teamId}:categories`) || [];
      let foundSquad = null;
      for (const category of categories) {
        if (category.squads) {
          const squad = category.squads.find((s: any) => s.id === squadId);
          if (squad) {
            foundSquad = squad;
            break;
          }
        }
      }
      
      if (!foundSquad) {
        return c.json({ error: 'Equipe não encontrada' }, 404);
      }
      
      // Verificar se já está inscrita
      const alreadyRegistered = tournament.squadRegistrations.find(
        (reg: any) => reg.teamId === teamId && reg.squadId === squadId
      );
      if (alreadyRegistered) {
        return c.json({ error: 'Esta equipe já está inscrita' }, 400);
      }
      
      // Criar registro de equipe específica
      registration = {
        id: `registration:${Date.now()}`,
        tournamentId: fullTournamentId,
        teamId,
        teamName: team.name,
        squadId,
        squadName: foundSquad.name,
        categoryName: foundSquad.categoryName,
        players: foundSquad.players || [],
        city: team.city || null,
        state: team.state || null,
        photoUrl: team.photoUrl || null,
        registeredAt: new Date().toISOString(),
        isFullTeam: false
      };
      
      console.log(`   ✅ Equipe "${foundSquad.name}" inscrita com sucesso`);
    }
    
    console.log(`\n   🔍 Passo 6/7: Adicionando aos arrays...`);
    tournament.squadRegistrations.push(registration);
    console.log(`      • squadRegistrations.length DEPOIS: ${tournament.squadRegistrations.length}`);
    
    // Também adicionar ao array legado registeredTeams (compatibilidade)
    if (!tournament.registeredTeams) {
      tournament.registeredTeams = [];
    }
    if (!tournament.registeredTeams.includes(teamId)) {
      tournament.registeredTeams.push(teamId);
    }
    console.log(`      • registeredTeams.length: ${tournament.registeredTeams.length}`);
    
    console.log(`\n   🔍 Passo 7/7: Salvando no banco de dados...`);
    await kv.set(fullTournamentId, tournament);
    console.log(`      • Salvo com sucesso!`);
    
    console.log(`\n✅ ====== INSCRIÇÃO CONCLUÍDA COM SUCESSO ======`);
    console.log(`   • Time: ${team.name}`);
    console.log(`   • Torneio: ${tournament.name}`);
    console.log(`   • Registration ID: ${registration.id}`);
    console.log(`   • Timestamp: ${new Date().toISOString()}`);
    
    return c.json({ registration });
  } catch (error: any) {
    console.error(`\n❌ ====== ERRO CRÍTICO NA INSCRIÇÃO ======`);
    console.error(`   • Message: ${error.message}`);
    console.error(`   • Name: ${error.name}`);
    console.error(`   • Stack:`, error.stack);
    console.error(`   • Timestamp: ${new Date().toISOString()}`);
    return c.json({ error: error.message }, 500);
  }
});

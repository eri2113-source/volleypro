# 🚨 TESTE URGENTE - COPIAR E COLAR NO CONSOLE

## ⚡ PASSO 1: VERIFICAR STATUS ATUAL

Abra o Console (F12) e cole este código:

```javascript
// ===== DIAGNÓSTICO COMPLETO =====
console.clear();
console.log('🔍 ===== DIAGNÓSTICO INSCRIÇÃO =====\n');

// 1. Verificar Login
const token = localStorage.getItem('volleypro_token');
const userId = localStorage.getItem('volleypro_user_id');
console.log('1️⃣ Login:', {
  temToken: !!token,
  userId: userId
});

if (!token || !userId) {
  console.error('❌ PROBLEMA: Você não está logado!');
  console.log('💡 SOLUÇÃO: Faça logout e login novamente');
  console.log('');
  console.log('localStorage.clear(); location.reload();');
} else {
  console.log('✅ Você está logado\n');
}

// 2. Verificar Perfil
console.log('2️⃣ Buscando seu perfil...');
fetch(`https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/profile`, {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(r => r.json())
.then(profile => {
  console.log('✅ Perfil carregado:', {
    id: profile.profile?.id,
    nome: profile.profile?.name,
    tipo: profile.profile?.userType
  });
  
  if (profile.profile?.userType !== 'team') {
    console.error('❌ PROBLEMA: Você não é um time!');
    console.log('   Tipo da conta:', profile.profile?.userType);
    console.log('   Apenas times podem se inscrever em torneios');
  } else {
    console.log('✅ Você é um time!\n');
  }
})
.catch(e => console.error('❌ Erro ao buscar perfil:', e));

// 3. Listar Torneios LMV
console.log('\n3️⃣ Buscando torneios LMV...');
fetch(`https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments`, {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(r => r.json())
.then(data => {
  const lmv = data.tournaments.filter(t => t.name.includes('LMV') || t.name.includes('Liga Municipal'));
  
  console.log(`✅ Encontrados ${lmv.length} torneio(s) LMV:\n`);
  
  lmv.forEach((t, i) => {
    console.log(`${i+1}. ${t.name}`);
    console.log(`   ID: ${t.id}`);
    console.log(`   Status: ${t.status}`);
    console.log(`   Inscritos (legado): ${t.registeredTeams?.length || 0}`);
    console.log(`   Inscritos (novo): ${t.squadRegistrations?.length || 0}`);
    console.log(`   Seu time está no array legado? ${t.registeredTeams?.includes(userId) ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   Seu time está no array novo? ${t.squadRegistrations?.some(r => r.teamId === userId) ? '✅ SIM' : '❌ NÃO'}`);
    console.log('');
  });
  
  if (lmv.length > 0) {
    window.LMV_TOURNAMENT_ID = lmv[0].id;
    console.log('💾 Salvou o ID do torneio em: window.LMV_TOURNAMENT_ID');
    console.log(`   Use este ID para os próximos testes: ${lmv[0].id}\n`);
  }
})
.catch(e => console.error('❌ Erro ao buscar torneios:', e));

console.log('\n✅ Diagnóstico completo!');
console.log('📋 Aguarde os resultados acima...\n');
```

---

## ⚡ PASSO 2: VERIFICAR INSCRIÇÕES DO SEU TIME

Depois que o PASSO 1 terminar, cole este código:

```javascript
// ===== VERIFICAR INSCRIÇÕES =====
const tournamentId = window.LMV_TOURNAMENT_ID; // Pegou do passo 1
const token = localStorage.getItem('volleypro_token');
const userId = localStorage.getItem('volleypro_user_id');

if (!tournamentId) {
  console.error('❌ Rode o PASSO 1 primeiro!');
} else {
  console.log(`🔍 Verificando inscrições do seu time no torneio ${tournamentId}...\n`);
  
  fetch(`https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/registrations/${userId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(r => r.json())
  .then(data => {
    console.log('✅ Resposta da API:', data);
    
    if (data.registrations && data.registrations.length > 0) {
      console.log(`\n✅ SEU TIME JÁ ESTÁ INSCRITO! (${data.registrations.length} inscrição(ões))`);
      console.log('\nDetalhes:');
      data.registrations.forEach((reg, i) => {
        console.log(`${i+1}. ${reg.squadName || 'Time Completo'}`);
        console.log(`   Squad ID: ${reg.squadId || 'null (time completo)'}`);
      });
      console.log('\n❗ O PROBLEMA É VISUAL - Time já está inscrito mas não aparece na lista!');
    } else {
      console.log('\n❌ SEU TIME NÃO ESTÁ INSCRITO');
      console.log('💡 Vá para o PASSO 3 para inscrever manualmente');
    }
  })
  .catch(e => {
    console.error('❌ Erro ao verificar inscrições:', e);
  });
}
```

---

## ⚡ PASSO 3: INSCREVER MANUALMENTE (SE NECESSÁRIO)

Se o PASSO 2 mostrar que **NÃO está inscrito**, cole este código:

```javascript
// ===== INSCREVER MANUALMENTE =====
const tournamentId = window.LMV_TOURNAMENT_ID;
const token = localStorage.getItem('volleypro_token');
const userId = localStorage.getItem('volleypro_user_id');

if (!tournamentId) {
  console.error('❌ Rode o PASSO 1 primeiro!');
} else {
  console.log('🚀 Inscrevendo seu time manualmente...\n');
  
  fetch(`https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/register-squad`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      teamId: userId,
      squadId: null  // TIME COMPLETO
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) {
      console.error('❌ ERRO:', data.error);
    } else {
      console.log('✅ SUCESSO! Time inscrito:', data);
      console.log('\n🎉 Recarregue a página para ver a inscrição!');
      console.log('   location.reload();');
    }
  })
  .catch(e => {
    console.error('❌ Erro na requisição:', e);
  });
}
```

---

## 📸 ENVIE OS RESULTADOS

Copie **TODOS** os resultados dos 3 passos e me envie.

Com isso vou descobrir o problema exato!

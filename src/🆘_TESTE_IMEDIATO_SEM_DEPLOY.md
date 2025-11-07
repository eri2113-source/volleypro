# 🆘 TESTE IMEDIATO - SEM ESPERAR DEPLOY

## ⚡ TESTE AGORA (30 SEGUNDOS)

### 1. Abrir Console (F12)

### 2. Colar este código:

```javascript
// TESTE MANUAL DE INSCRIÇÃO
async function testarInscricao() {
  console.log('🧪 ===== TESTE MANUAL DE INSCRIÇÃO =====');
  
  // Pegar dados do usuário
  const token = localStorage.getItem('volleypro_token');
  const userId = localStorage.getItem('volleypro_user_id');
  
  console.log('1️⃣ Token existe?', !!token);
  console.log('2️⃣ User ID:', userId);
  
  if (!token) {
    console.error('❌ SEM TOKEN - Faça login novamente!');
    return;
  }
  
  // SUBSTITUA AQUI pelo ID do torneio LMV
  const tournamentId = 'COLE_O_ID_DO_TORNEIO_AQUI'; // exemplo: tournament_123
  const teamId = userId;
  
  console.log('3️⃣ Tentando inscrever...');
  console.log('   • Tournament ID:', tournamentId);
  console.log('   • Team ID:', teamId);
  
  try {
    const response = await fetch(
      `https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/register-squad`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teamId: teamId,
          squadId: null // TIME COMPLETO
        })
      }
    );
    
    console.log('4️⃣ Status da resposta:', response.status);
    
    const data = await response.json();
    console.log('5️⃣ Resposta:', data);
    
    if (response.ok) {
      console.log('✅ SUCESSO! Time inscrito!');
      console.log('   Dados da inscrição:', data);
    } else {
      console.error('❌ ERRO na inscrição!');
      console.error('   Mensagem:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('❌ ERRO na requisição:', error);
  }
}

// Executar teste
testarInscricao();
```

### 3. ANTES DE EXECUTAR:

**IMPORTANTE:** Substitua `'COLE_O_ID_DO_TORNEIO_AQUI'` pelo ID real do torneio LMV!

**Como pegar o ID do torneio:**
- Abra o torneio LMV
- Veja a URL: `voleypro.net/#tournaments`
- Ou cole no console:
```javascript
// Ver todos os torneios
fetch('https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments', {
  headers: {'Authorization': 'Bearer ' + localStorage.getItem('volleypro_token')}
})
.then(r => r.json())
.then(d => {
  console.log('📋 Torneios:', d.tournaments);
  const lmv = d.tournaments.find(t => t.name.includes('LMV') || t.name.includes('Liga Municipal'));
  if (lmv) {
    console.log('🎯 Torneio LMV:', lmv);
    console.log('📝 ID para usar:', lmv.id);
  }
});
```

---

## 📊 RESULTADOS POSSÍVEIS

### ✅ SUCESSO:
```
✅ SUCESSO! Time inscrito!
   Dados da inscrição: {id: "...", teamName: "..."}
```
**Solução:** O sistema funciona! Problema é no frontend. Faça o deploy com os logs.

### ❌ ERRO 403 Unauthorized:
```
❌ ERRO na inscrição!
   Mensagem: Unauthorized
```
**Solução:** Faça logout e login novamente. Token expirou.

### ❌ ERRO 404:
```
❌ ERRO na inscrição!
   Mensagem: Torneio não encontrado
```
**Solução:** ID do torneio está errado. Veja o passo 3.

### ❌ ERRO 400:
```
❌ ERRO na inscrição!
   Mensagem: Este time já está inscrito
```
**Solução:** Time JÁ ESTÁ INSCRITO! Problema é só visual (lista não atualiza).

---

## 🎯 PRÓXIMO PASSO

**ENVIE O RESULTADO DO TESTE** que vou saber exatamente o que fazer!

# ⚡ RESOLVER INSCRIÇÃO - 3 OPÇÕES

## 🎯 ESCOLHA UMA OPÇÃO:

---

### 🚀 OPÇÃO 1: DEPLOY COM LOGS (5 MINUTOS)
**Melhor para descobrir o problema exato**

```bash
git add components/TournamentSquadSelectionModal.tsx lib/api.ts
git commit -m "🚨 Adiciona logs detalhados para debug"
git push
```

**Depois:**
1. Aguardar 2 min (build)
2. Ctrl+Shift+R (limpar cache)
3. Abrir Console (F12)
4. Tentar inscrever
5. **ME ENVIAR OS LOGS DO CONSOLE**

---

### 🧪 OPÇÃO 2: TESTE MANUAL (30 SEGUNDOS)
**Para testar AGORA sem deploy**

1. Abrir Console (F12)
2. Colar o código do arquivo: `🆘_TESTE_IMEDIATO_SEM_DEPLOY.md`
3. Executar
4. **ME ENVIAR O RESULTADO**

---

### 🔧 OPÇÃO 3: SOLUÇÕES RÁPIDAS (TESTAR NA ORDEM)

#### A) Logout + Login Novo
```javascript
// Cole no Console (F12):
localStorage.clear();
location.reload();
```
**Fazer:** Login novamente e testar

#### B) Ver se Time Já Está Inscrito
```javascript
// Cole no Console (F12):
const tournamentId = 'COLE_ID_DO_TORNEIO'; // exemplo: tournament_123
const token = localStorage.getItem('volleypro_token');
const userId = localStorage.getItem('volleypro_user_id');

fetch(`https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/registrations/${userId}`, {
  headers: {'Authorization': 'Bearer ' + token}
})
.then(r => r.json())
.then(d => {
  console.log('📋 Inscrições do seu time:', d);
  if (d.registrations?.length > 0) {
    console.log('✅ SEU TIME JÁ ESTÁ INSCRITO!');
    console.log('   Problema: Lista não está atualizando visualmente');
  } else {
    console.log('❌ Seu time NÃO está inscrito ainda');
  }
});
```

#### C) Inscrever Manualmente via Console
```javascript
// Cole no Console (F12):
const tournamentId = 'COLE_ID_DO_TORNEIO';
const token = localStorage.getItem('volleypro_token');
const userId = localStorage.getItem('volleypro_user_id');

fetch(`https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/register-squad`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({teamId: userId, squadId: null})
})
.then(r => r.json())
.then(d => {
  console.log('Resultado:', d);
  if (d.registration) {
    alert('✅ TIME INSCRITO COM SUCESSO!');
    location.reload();
  } else {
    alert('❌ Erro: ' + (d.error || 'Desconhecido'));
  }
});
```

---

## 🎯 RECOMENDAÇÃO

1. **PRIMEIRO:** Teste a Opção 3B (ver se já está inscrito)
2. **SE NÃO ESTIVER:** Teste Opção 3C (inscrever manual)
3. **SE DER ERRO:** Faça Opção 1 (deploy com logs) e me envie os logs

---

## 📸 SEMPRE ENVIAR

- Print do Console (F12)
- Print da tela
- Cópia dos logs

**Com isso vou resolver em 2 minutos!**

# 🚨 CORREÇÃO URGENTE - BOTÃO INSCREVER TIME LMV

## Problema Identificado

O botão **"Inscrever Time"** não funcionava por 2 motivos:

### 1. ❌ Frontend chamava função que NÃO EXISTE
- **Antes**: `tournamentApi.registerTeam(tournamentId)` ❌
- **Depois**: `tournamentApi.registerSquad(tournamentId, currentUser.id, null)` ✅

### 2. ❌ Backend usava variável errada
- **Linha 4867**: Usava `user.name` mas deveria usar `teamData.name`

## ✅ Correções Aplicadas

### Frontend (`/components/Tournaments.tsx`)
```typescript
// ANTES (ERRO):
await tournamentApi.registerTeam(tournamentId);

// DEPOIS (CORRETO):
await tournamentApi.registerSquad(tournamentId, currentUser.id, null);
```

### Backend (`/supabase/functions/server/index.tsx`)
Linha 4867 - Executar o script Python:

```bash
python3 fix_user_name.py
```

## 🚀 EXECUTAR AGORA (3 comandos)

```bash
# 1. Corrigir backend
python3 fix_user_name.py

# 2. Commit
git add -A
git commit -m "🔥 URGENTE: Corrigido botão Inscrever Time - LMV hoje"

# 3. Push (deploy automático na Vercel)
git push origin main
```

## 📋 Como Testar

1. Acesse: https://voleypro.net
2. Faça login como TIME
3. Vá em "Torneios" → LMV
4. Clique em **"🏐 Inscrever Time"**
5. Deve aparecer: "Time inscrito no torneio com sucesso!"

## 🎯 O que foi corrigido

- ✅ Botão agora chama a função CORRETA (`registerSquad`)
- ✅ Backend usa o nome correto do time (`teamData.name`)
- ✅ Inscrição funciona para times simples (sem categorias)
- ✅ Logs detalhados para debug

## ⚡ Tempo estimado de deploy

- Vercel: **2-3 minutos** após o push
- Aguarde a mensagem: **"✅ Deployment ready"**

---

**DEPOIS DO DEPLOY**: Teste imediatamente no site para confirmar!

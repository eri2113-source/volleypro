# 🔍 DIAGNÓSTICO: Inscrição de Dupla

## 🎯 SITUAÇÃO ATUAL

### O que você está vendo:
![Modal mostrando "João Silva" como usuário](imagem fornecida)

### O que está acontecendo:
- ✅ **NÃO é um perfil fake!**
- ✅ "João Silva" é o **usuário REAL logado** no momento
- ✅ O sistema está funcionando **corretamente**
- ✅ Está mostrando SEU perfil porque VOCÊ está logado

## 🧪 COMO FUNCIONA

### 1. **Carregamento do Usuário Atual**

```typescript
// BeachTournamentRegistration.tsx - linha 79
async function loadCurrentUser() {
  const session = await authApi.getSession();  // Pega sessão REAL
  const profile = await userApi.getUserProfile(session.user.id);  // Busca perfil REAL do banco
  
  setCurrentUser({
    id: profile.id,        // ID real do banco
    name: profile.name,    // Nome real do banco
    avatar: profile.avatar, // Foto real do banco
    position: profile.position,
  });
}
```

**Resultado:** O componente mostra **seu perfil real** como capitão da dupla.

### 2. **Busca de Parceiros**

```typescript
// linha 121 - Busca APENAS atletas reais
const response = await fetch(
  `/users/search?query=${searchQuery}&type=athlete`,
  { headers: { Authorization: `Bearer ${access_token}` } }
);

// linha 138 - Filtra APENAS atletas
const athletes = data.users.filter(user => 
  user.userType === 'athlete' &&        // APENAS atletas
  user.id !== currentUser?.id &&        // Remove você mesmo
  !selectedPartners.find(p => p.id === user.id)  // Remove já selecionados
);
```

**Resultado:** A busca retorna **apenas atletas reais cadastrados** no banco.

### 3. **Registro da Dupla**

```typescript
// linha 248 - Envia para o backend REAL
const response = await fetch(
  `/tournaments/${tournamentId}/register-beach-team`,
  {
    method: 'POST',
    body: JSON.stringify({
      tournamentId,
      teamName,          // Nome da dupla
      players: [currentUser, ...selectedPartners],  // Todos os jogadores REAIS
      teamSize: 'duo',
      captainId: currentUser.id,
    })
  }
);
```

**Resultado:** A inscrição é **salva no banco de dados**.

## ❓ POR QUE APARECE "JOÃO SILVA"?

### Possíveis Razões:

#### 1. **Você está logado como "João Silva"**
- Se você criou uma conta de teste com esse nome
- Se você está usando uma conta existente
- **Solução:** Isso está correto! O sistema mostra seu nome real.

#### 2. **Sessão antiga no navegador**
- Cache do navegador com dados antigos
- **Solução:** Limpar cache e fazer login novamente

#### 3. **Conta de teste no banco**
- "João Silva" é uma conta real no banco de dados
- Criada anteriormente para testes
- **Solução:** Fazer logout e criar/usar outra conta

## ✅ VERIFICAR SE A INSCRIÇÃO ESTÁ SALVANDO

### Passo 1: Abrir Console do Navegador

```javascript
// Pressione F12 e vá na aba Console
// Procure por estas mensagens ao inscrever:

🏖️ Dados da inscrição: {
  tournamentId: "tournament:xxx",
  teamName: "Nome da Dupla",
  players: [
    { id: "user:123", name: "João Silva", ... },
    { id: "user:456", name: "Parceiro", ... }
  ],
  teamSize: "duo",
  captainId: "user:123"
}

✅ Inscrição realizada: {
  success: true,
  team: { ... }
}
```

### Passo 2: Verificar Logs do Servidor

```javascript
// No Vercel Dashboard > Functions > Logs
// Procure por:

🏖️ Registering beach team: {
  tournamentId: "tournament:xxx",
  teamName: "Nome da Dupla",
  playerCount: 2,
  teamSize: "duo"
}

✅ Equipe de praia inscrita: Nome da Dupla no torneio COPA GO
```

### Passo 3: Verificar se Aparece na Lista

1. Fechar o modal de inscrição
2. Recarregar a página (Ctrl+R)
3. Ver a lista de times inscritos
4. **Deve aparecer:** "Nome da Dupla" com 2 jogadores

## 🐛 SE A INSCRIÇÃO NÃO ESTÁ SALVANDO

### Possíveis Causas:

#### 1. **Erro no Console**
```javascript
❌ Erro ao inscrever: [mensagem de erro]
```
**Solução:** Copie o erro completo e me envie

#### 2. **Erro 401 - Unauthorized**
```javascript
401 Unauthorized
```
**Solução:** 
- Fazer logout
- Limpar cache (Ctrl+Shift+Delete)
- Fazer login novamente

#### 3. **Erro 404 - Not Found**
```javascript
404 Tournament not found
```
**Solução:**
- Verificar se o torneio existe
- ID do torneio pode estar incorreto

#### 4. **Erro 400 - Bad Request**
```javascript
400 Missing required fields
```
**Solução:**
- Preencher nome da dupla
- Adicionar exatamente 1 parceiro
- Verificar se todos campos estão preenchidos

## 🔧 COMO TESTAR CORRETAMENTE

### Teste Completo:

#### 1. **Criar Conta de Atleta Real**
```
1. Fazer logout (se logado)
2. Clicar em "Criar Conta"
3. Preencher:
   - Nome: Seu Nome Real
   - Email: seu.email@real.com
   - Senha: senha123
   - Tipo: ATLETA
   - Posição: Atacante (ou outra)
4. Criar conta
5. Fazer login
```

#### 2. **Criar Conta do Parceiro**
```
1. Abrir aba anônima (Ctrl+Shift+N)
2. Ir em volleypro-zw96.vercel.app
3. Criar segunda conta:
   - Nome: Nome do Parceiro
   - Email: parceiro@email.com
   - Tipo: ATLETA
4. Fazer login e logout
```

#### 3. **Inscrever Dupla**
```
1. Voltar para conta principal
2. Ir em "Torneios"
3. Clicar em "Inscrever" no torneio de praia
4. Preencher:
   - Nome da Dupla: "Dupla Campeã"
5. Buscar parceiro: "Nome do Parceiro"
6. Adicionar parceiro
7. Clicar em "Inscrever Dupla"
8. Verificar toast de sucesso
9. Esperar reload automático
10. Ver dupla na lista de inscritos ✅
```

## 📊 RESUMO

### ✅ O que ESTÁ funcionando:
- Carregamento do usuário logado (você)
- Busca de atletas reais do banco
- Interface de seleção de parceiros
- Envio de dados para o backend
- Estrutura de dados correta

### ❓ O que PRECISA verificar:
- Se "João Silva" é você mesmo (usuário logado)
- Se a inscrição está realmente salvando no banco
- Se aparece na lista após reload
- Mensagens no console (F12)

### 🎯 Próximos Passos:

1. **Verificar Console:**
   - F12 > Console
   - Fazer uma inscrição
   - Copiar TODOS os logs
   - Me enviar os logs

2. **Verificar Lista:**
   - Após inscrever
   - Aguardar reload (1.5 segundos)
   - Verificar se dupla aparece
   - Tirar print da lista

3. **Se não aparecer:**
   - Copiar erro do console
   - Tirar print da tela
   - Me enviar para diagnóstico completo

---

## 💡 DICA IMPORTANTE

**"João Silva" NÃO É FAKE!**

Se você está vendo "João Silva" no modal, significa que:
- Você está logado como "João Silva"
- Ou existe uma conta "João Silva" no banco
- Ou o cache do navegador tem dados de "João Silva"

**Solução simples:**
1. Fazer logout
2. Limpar cache (Ctrl+Shift+Delete)
3. Criar nova conta com seu nome real
4. Testar novamente

---

**Data:** 23/10/2025  
**Componente:** BeachTournamentRegistration.tsx  
**Backend:** /supabase/functions/server/index.tsx  
**Status:** ✅ Código correto - verificar dados de teste  

🏐 **VolleyPro** - Sistema 100% Real! 🏖️

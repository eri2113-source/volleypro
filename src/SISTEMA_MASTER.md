# 👑 SISTEMA MASTER - ADMINISTRADOR TOTAL

## 📋 VISÃO GERAL

Sistema de administrador MASTER implementado para o email **eri.2113@gmail.com** com poderes completos sobre a plataforma VolleyPro.

---

## ✅ FUNCIONALIDADES IMPLEMENTADAS

### **1. VERIFICAÇÃO DE STATUS MASTER**

#### Backend (`/supabase/functions/server/index.tsx`)
```typescript
const MASTER_EMAIL = 'eri.2113@gmail.com';

async function isMasterUser(userId: string): Promise<boolean> {
  const user = await kv.get(`user:${userId}`);
  if (!user) return false;
  
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  return authUser?.user?.email === MASTER_EMAIL;
}
```

#### Rota de Verificação
```typescript
GET /admin/check-master
Authorization: Bearer {access_token}

Response:
{
  "isMaster": true/false
}
```

---

### **2. DELETAR POSTAGENS**

#### Funcionalidade
- Botão vermelho (🗑️) em **TODAS** as postagens no Feed
- Apenas visível para MASTER
- Confirmação antes de deletar
- Remove post + likes + comentários associados

#### Rota Backend
```typescript
DELETE /admin/posts/:postId
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "Post and associated data deleted successfully"
}
```

#### Frontend (`/components/Feed.tsx`)
```typescript
// Botão aparece em cada post
{isMaster && (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => handleDeletePost(post.id)}
    className="text-destructive hover:bg-destructive/10"
    title="Deletar postagem (Master)"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
)}
```

---

### **3. DELETAR TORNEIOS**

#### Funcionalidade
- Botão vermelho (🗑️) em **TODOS** os torneios
- Funciona em torneios "Em Andamento", "Próximos" e "Cancelados"
- Confirmação antes de deletar
- Remove torneio + jogos + votos MVP associados

#### Rota Backend
```typescript
DELETE /admin/tournaments/:tournamentId
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "Tournament and associated data deleted successfully"
}
```

#### Lógica de Prefixos
```typescript
// O backend aceita ID com ou sem prefixo "tournament:"
const tournamentId = tournamentIdParam.startsWith('tournament:') 
  ? tournamentIdParam 
  : `tournament:${tournamentIdParam}`;

// Busca matches usando ID base (sem prefixo)
const baseId = tournamentIdParam.replace('tournament:', '');
const allMatches = await kv.getByPrefix(`match:${baseId}:`);
```

#### Frontend (`/components/Tournaments.tsx`)
```typescript
// Botão aparece em cada card de torneio
{isMaster && (
  <Button
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteTournament(tournament.id, tournament.name);
    }}
    className="text-destructive hover:bg-destructive/10"
    title="Deletar torneio (Master)"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
)}
```

---

### **4. BADGE MASTER NO PERFIL**

#### Funcionalidade
- Badge dourado no header do perfil
- Gradiente amarelo/âmbar
- Ícone de coroa (Crown)
- Texto "MASTER"

#### Frontend (`/components/MyProfile.tsx`)
```typescript
{isMaster && (
  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-0 shadow-lg">
    <Crown className="h-3 w-3 mr-1" />
    MASTER
  </Badge>
)}
```

---

### **5. LISTAR TODOS OS USUÁRIOS**

#### Rota Backend
```typescript
GET /admin/users
Authorization: Bearer {access_token}

Response:
{
  "users": [...],
  "total": 150
}
```

---

### **6. DELETAR USUÁRIOS**

#### Funcionalidade
- Apenas MASTER pode deletar usuários
- Não pode deletar própria conta MASTER
- Remove usuário + suas postagens

#### Rota Backend
```typescript
DELETE /admin/users/:userId
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "User and associated data deleted successfully"
}
```

#### Validação
```typescript
// Verifica se é master
const isMaster = await isMasterUser(masterUserId);
if (!isMaster) {
  return c.json({ error: 'Master access required' }, 403);
}

// Não pode deletar conta master
const targetIsMaster = await isMasterUser(targetUserId);
if (targetIsMaster) {
  return c.json({ error: 'Cannot delete master account' }, 403);
}
```

---

## 🔒 VALIDAÇÕES E SEGURANÇA

### **Backend**
```
✅ Verifica email === 'eri.2113@gmail.com'
✅ Retorna 403 Forbidden se não for master
✅ Log detalhado de todas ações master
✅ Não pode deletar própria conta master
✅ Aceita IDs com ou sem prefixo
```

### **Frontend**
```
✅ Botões só aparecem se isMaster === true
✅ Confirmação antes de deletar
✅ Toast de sucesso/erro
✅ Recarrega dados após deletar
✅ Previne propagação de eventos (stopPropagation)
```

---

## 🎨 VISUAL

### **Badge Master no Perfil:**
```
┌─────────────────────────────────────┐
│ 👤 Eri Santos  [👑 MASTER]          │
│                   ↑ Dourado         │
│    Atleta | São Paulo               │
└─────────────────────────────────────┘
```

### **Botão Deletar Post:**
```
┌─────────────────────────────────────┐
│ João Silva                    [🗑️]  │
│ Publicado há 2 horas          ↑ Vermelho
│                                      │
│ Ótimo treino hoje! 🏐               │
└─────────────────────────────────────┘
```

### **Botão Deletar Torneio:**
```
┌─────────────────────────────────────┐
│ 🏆 Campeonato Regional  [🗑️]        │
│    Organizado por Time ABC    ↑ Vermelho
│    📅 Em andamento                   │
└─────────────────────────────────────┘
```

---

## 📡 API COMPLETA

### **masterAdminApi** (`/lib/api.ts`)

```typescript
export const masterAdminApi = {
  // Verificar status master
  async checkMasterStatus() {
    return apiCall('/admin/check-master');
  },

  // Deletar post
  async deletePost(postId: string) {
    return apiCall(`/admin/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  // Deletar torneio
  async deleteTournament(tournamentId: string) {
    return apiCall(`/admin/tournaments/${tournamentId}`, {
      method: 'DELETE',
    });
  },

  // Listar todos os usuários
  async getAllUsers() {
    return apiCall('/admin/users');
  },

  // Deletar usuário
  async deleteUser(userId: string) {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
```

---

## 🧪 COMO TESTAR

### **TESTE 1: Login como Master**
```bash
1. Abra https://volleypro.app
2. Login com eri.2113@gmail.com
3. Vá em "Perfil"
4. ✅ Badge "👑 MASTER" aparece (dourado)
```

### **TESTE 2: Deletar Post**
```bash
1. Login como master
2. Vá no Feed
3. ✅ Botão 🗑️ aparece em TODOS os posts (vermelho)
4. Clique no botão
5. ✅ Confirmação: "Tem certeza que deseja deletar esta postagem?"
6. Confirme
7. ✅ Post deletado + toast "🗑️ Postagem removida com sucesso!"
```

### **TESTE 3: Deletar Torneio**
```bash
1. Login como master
2. Vá em "Torneios"
3. ✅ Botão 🗑️ aparece em TODOS os torneios (vermelho)
4. Clique no botão
5. ✅ Confirmação: "Tem certeza que deseja DELETAR o torneio...?"
6. Confirme
7. ✅ Torneio deletado + toast "🗑️ Torneio deletado com sucesso!"
```

### **TESTE 4: Resetar Torneios**
```bash
1. Login como master
2. Vá em "Torneios"
3. Role até o final da página
4. ✅ Botão "🔄 Resetar Torneios (Admin)" aparece
5. Clique no botão
6. ✅ Confirmação aparece
7. Confirme
8. ✅ Todos os torneios deletados + "Campeonato Municipal 2025" criado
```

### **TESTE 5: Não Master**
```bash
1. Login com outro email (não eri.2113@gmail.com)
2. Vá no Feed/Torneios/Perfil
3. ✅ Botões 🗑️ NÃO aparecem
4. ✅ Badge MASTER NÃO aparece no perfil
5. ✅ Botão "Resetar Torneios" NÃO aparece
```

---

## 📊 LOGS NO BACKEND

### **Verificação Master**
```
👑 MASTER USER detected!
```

### **Deletar Post**
```
🗑️ [MASTER] Post deleted by master: post:abc123
```

### **Deletar Torneio**
```
🗑️ [MASTER] Deleting tournament: tournament:xyz789 (Campeonato Regional)
🗑️ [MASTER] Tournament deleted: tournament:xyz789 (5 matches, 12 votes)
```

### **Deletar Usuário**
```
🗑️ [MASTER] User deleted by master: user:def456
```

### **Erro de Permissão**
```
❌ Error deleting post (master): Error: Master access required
```

---

## 🔧 CORREÇÕES IMPLEMENTADAS

### **1. Erro de `import.meta.env`**
❌ **ANTES:**
```typescript
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
// TypeError: Cannot read properties of undefined
```

✅ **DEPOIS:**
```typescript
const { projectId } = await import('../utils/supabase/info');
// projectId = "waibxabxlcbfyxyagaow"
```

### **2. Erro "Tournament not found"**
❌ **ANTES:**
```typescript
const tournament = await kv.get(tournamentId);
// Busca "abc123" mas deveria buscar "tournament:abc123"
```

✅ **DEPOIS:**
```typescript
const tournamentId = tournamentIdParam.startsWith('tournament:') 
  ? tournamentIdParam 
  : `tournament:${tournamentIdParam}`;

const tournament = await kv.get(tournamentId);
// Busca corretamente "tournament:abc123"
```

---

## 📋 PERMISSÕES MASTER

```
✅ Ver badge "MASTER" no perfil (dourado)
✅ Deletar qualquer postagem
✅ Deletar qualquer torneio
✅ Deletar qualquer usuário (exceto si mesmo)
✅ Listar todos os usuários
✅ Resetar todos os torneios
✅ Usar todas funções de Fã
✅ Usar todas funções de Atleta
✅ Usar todas funções de Time
🔜 Liberar códigos premium (preparado para futuro)
```

---

## 🎯 STATUS

```
✅ Sistema 100% funcional
✅ Todos os erros corrigidos
✅ Validações implementadas
✅ Logs detalhados
✅ UI responsiva
✅ Segurança garantida
```

---

## 🚀 DEPLOY

O sistema está **100% funcional** em produção:
- **URL:** https://volleypro.app
- **Master Email:** eri.2113@gmail.com
- **Status:** ✅ ATIVO

---

## 📞 SUPORTE

Para reportar bugs ou solicitar novas funcionalidades administrativas, entre em contato com o desenvolvedor.

---

**🎉 SISTEMA MASTER COMPLETO E OPERACIONAL!** 👑✨

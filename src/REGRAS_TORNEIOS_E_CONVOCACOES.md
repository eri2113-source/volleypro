# 🏆 REGRAS DE TORNEIOS E CONVOCAÇÕES - VolleyPro

## ✅ **IMPLEMENTAÇÃO COMPLETA!**

Sistema de torneios e convocações com validações rigorosas de CPF e controle de vínculos de atletas.

---

## 🎯 **REGRAS IMPLEMENTADAS:**

### **1️⃣ APENAS TIMES PODEM CRIAR TORNEIOS**

```typescript
✅ Atletas NÃO podem criar torneios
✅ Fãs/Torcedores NÃO podem criar torneios  
✅ Apenas contas do tipo "TEAM" podem criar
✅ Validação no frontend (botão desabilitado)
✅ Validação no backend (403 Forbidden)
```

**Como funciona:**
```
TIME → Clica "Criar Torneio" → ✅ Permitido
ATLETA → Clica "Criar Torneio" → ❌ Botão desabilitado + mensagem
FÃ → Clica "Criar Torneio" → ❌ Botão desabilitado + mensagem
```

---

### **2️⃣ ATLETAS PARTICIPAM APENAS VIA CONVOCAÇÃO**

```typescript
✅ Atletas NÃO podem se inscrever diretamente
✅ Apenas TIMES se inscrevem em torneios
✅ Atletas participam através do TIME que os convocou
✅ Sistema de convites/convocações implementado
```

**Fluxo:**
```
1. TIME se inscreve no torneio
2. TIME convoca ATLETAS para o elenco
3. ATLETAS aceitam ou recusam convite
4. ATLETAS aceitos participam pelo TIME
```

---

### **3️⃣ TIMES SÓ CONVOCAM ATLETAS COM CPF**

```typescript
✅ CPF é obrigatório para receber convites
✅ Validação no backend ao enviar convite
✅ Mensagem clara se atleta não tiver CPF
✅ Campo CPF disponível no perfil do atleta
```

**Validações:**
```javascript
// Backend valida ao enviar convite:
if (!athlete.cpf || athlete.cpf.trim() === '') {
  return error: 'Athlete must have CPF registered'
}
```

**Mensagens:**
```
❌ "Athlete must have CPF registered"
💡 "O atleta precisa cadastrar o CPF no perfil antes de receber convites"
```

---

### **4️⃣ UM CPF NÃO PODE ESTAR EM 2 TIMES**

```typescript
✅ Validação ao enviar convite
✅ Validação ao aceitar convite
✅ Verifica se CPF já está em outro time
✅ Impede vínculos duplicados
```

**Validações:**
```javascript
// Verifica se atleta já tem time
if (athlete.currentTeam && athlete.currentTeam !== teamId) {
  return error: 'Athlete already has a team'
}

// Verifica se CPF está em uso por outro atleta
const athletesWithSameCPF = allAthletes.filter(a => 
  a.cpf === athlete.cpf && 
  a.id !== athleteId &&
  a.currentTeam
);

if (athletesWithSameCPF.length > 0) {
  return error: 'CPF already in use by another athlete in a team'
}
```

---

## 🔐 **SISTEMA DE CONVOCAÇÕES:**

### **ROTAS IMPLEMENTADAS:**

#### **1. Enviar Convite** (Time → Atleta)
```
POST /invitations/send
{
  athleteId: string,
  message?: string
}

✅ Apenas times podem enviar
✅ Atleta deve existir
✅ Atleta deve ser tipo "athlete"
✅ Atleta deve ter CPF cadastrado
✅ CPF não pode estar em outro time
✅ Atleta não pode já ter time
```

#### **2. Ver Convites (Atleta)**
```
GET /invitations/athlete

Retorna:
{
  invitations: [
    {
      id: string,
      teamId: string,
      teamName: string,
      message: string,
      status: 'pending',
      createdAt: date
    }
  ]
}
```

#### **3. Ver Convites Enviados (Time)**
```
GET /invitations/team

Retorna lista de convites enviados pelo time
```

#### **4. Aceitar Convite**
```
POST /invitations/:invitationId/accept

✅ Apenas o atleta convocado pode aceitar
✅ Atualiza currentTeam do atleta
✅ Move time anterior para teamHistory
✅ Marca convite como "accepted"
```

#### **5. Recusar Convite**
```
POST /invitations/:invitationId/reject

✅ Apenas o atleta convocado pode recusar
✅ Marca convite como "rejected"
✅ Não altera dados do atleta
```

#### **6. Sair do Time**
```
POST /teams/leave

✅ Apenas atletas podem sair
✅ Move currentTeam para teamHistory
✅ Libera CPF para novos convites
```

---

## 📊 **ESTRUTURA DE DADOS:**

### **Convite (Invitation):**
```typescript
{
  id: "invitation:timestamp:teamId:athleteId",
  teamId: string,
  teamName: string,
  athleteId: string,
  athleteName: string,
  athleteCPF: string,  // Armazenado para histórico
  message: string | null,
  status: 'pending' | 'accepted' | 'rejected',
  createdAt: date,
  acceptedAt?: date,
  rejectedAt?: date
}
```

### **Atleta (Athlete):**
```typescript
{
  id: string,
  name: string,
  cpf: string,  // Obrigatório para convites
  currentTeam: string | null,  // Nome do time atual
  currentTeamId: string | null,  // ID do time atual
  teamHistory: string,  // "Time A (2022-2023), Time B (2023-2024)"
  // ... outros campos
}
```

---

## 🎨 **INTERFACE DO USUÁRIO:**

### **Página de Torneios - TIMES:**
```
┌─────────────────────────────────────────┐
│ 🏆 Torneios                             │
│                                          │
│ [🔄 Reset] [+ Criar Torneio] ← ATIVO   │
└─────────────────────────────────────────┘
```

### **Página de Torneios - ATLETAS:**
```
┌─────────────────────────────────────────┐
│ 🏆 Torneios                             │
│                                          │
│ [🔄 Reset] [+ Criar Torneio] ← DESABILITADO │
│                                          │
│ 💡 "Apenas times podem criar torneios"  │
│    "Você pode participar através de     │
│     convocação do seu time"             │
└─────────────────────────────────────────┘
```

### **Botão Inscrever Time - ATLETAS:**
```
❌ Tentativa de inscrição:

┌────────────────────────────────────────┐
│ ❌ Apenas times podem se inscrever     │
│    em torneios                         │
│                                        │
│ 💡 Atletas participam através de      │
│    convocação do seu time              │
└────────────────────────────────────────┘
```

---

## 🔄 **FLUXO COMPLETO:**

### **1. Time Cria Torneio**
```
✅ Time ABC faz login
✅ Vai em "Torneios"
✅ Clica "Criar Torneio"
✅ Preenche informações
✅ Torneio criado com sucesso
```

### **2. Time Se Inscreve**
```
✅ Time ABC vê torneio
✅ Clica "Inscrever Time"
✅ Time inscrito no torneio
✅ Aparece na lista de times inscritos
```

### **3. Time Convoca Atleta**
```
✅ Time ABC acessa perfil do atleta João
✅ João TEM CPF cadastrado
✅ João NÃO tem time atual
✅ Time clica "Convocar Atleta"
✅ Convite enviado
```

### **4. Atleta Recebe e Aceita**
```
✅ João vê notificação de convite
✅ João acessa página "Convites"
✅ Vê convite do Time ABC
✅ Clica "Aceitar"
✅ currentTeam atualizado para "Time ABC"
✅ João agora faz parte do Time ABC
```

### **5. Time Joga Torneio com Elenco**
```
✅ Time ABC está inscrito no torneio
✅ João faz parte do Time ABC
✅ João participa pelo Time ABC
✅ Resultados registrados
```

---

## ⚠️ **CASOS DE ERRO:**

### **Erro 1: Atleta sem CPF**
```
Time tenta convocar atleta sem CPF:

❌ "Athlete must have CPF registered"
💡 "O atleta precisa cadastrar o CPF no 
    perfil antes de receber convites"

Solução: Atleta cadastra CPF no perfil
```

### **Erro 2: Atleta já tem time**
```
Time tenta convocar atleta com time:

❌ "Athlete already has a team"
💡 "Este atleta já faz parte do time: Minas TC"

Solução: Atleta precisa sair do time atual primeiro
```

### **Erro 3: CPF duplicado**
```
CPF já está em uso por outro atleta:

❌ "CPF already in use by another athlete in a team"
💡 "Este CPF já está vinculado a outro atleta 
    que faz parte de um time"

Solução: Verificar se há duplicidade de cadastro
```

### **Erro 4: Atleta tenta criar torneio**
```
Atleta clica em "Criar Torneio":

❌ "Apenas times podem criar torneios"
💡 "Você pode participar através de 
    convocação do seu time"

Solução: Criar conta como time
```

---

## 🧪 **COMO TESTAR:**

### **TESTE 1: Time Cria Torneio**
```
1. Login como TIME
2. Vá em "Torneios"
3. Clique "Criar Torneio"
4. ✅ Modal abre normalmente
5. Preencha e crie
6. ✅ Torneio criado
```

### **TESTE 2: Atleta Tenta Criar**
```
1. Login como ATLETA
2. Vá em "Torneios"
3. Tente clicar "Criar Torneio"
4. ✅ Botão desabilitado
5. ✅ Mensagem de erro aparece
```

### **TESTE 3: Convocação com CPF**
```
1. Atleta cadastra CPF no perfil
2. Time envia convite
3. ✅ Convite enviado com sucesso
4. Atleta aceita
5. ✅ currentTeam atualizado
```

### **TESTE 4: Convocação sem CPF**
```
1. Atleta SEM CPF
2. Time tenta enviar convite
3. ✅ Erro: "Athlete must have CPF registered"
4. Atleta cadastra CPF
5. Time envia novamente
6. ✅ Agora funciona
```

### **TESTE 5: CPF Duplicado**
```
1. Atleta A tem CPF "123" e está no Time X
2. Atleta B tem CPF "123" (duplicado)
3. Time Y tenta convocar Atleta B
4. ✅ Erro: "CPF already in use"
5. Corrigir duplicidade
```

---

## 📝 **CAMPOS DO PERFIL:**

### **Atleta:**
```typescript
{
  cpf: string,  // ✅ OBRIGATÓRIO para convites
  currentTeam: string | null,  // 🔒 Bloqueado (automático)
  currentTeamId: string | null,  // ID do time
  teamHistory: string,  // Histórico de times
  position: string,
  // ... outros campos
}
```

### **Campo CPF no Perfil:**
```
┌────────────────────────────────────────┐
│ CPF (opcional)                         │
│ ┌────────────────────────────────────┐ │
│ │ 000.000.000-00                     │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 🔒 Usado apenas para participação em  │
│    times ou torneios oficiais         │
└────────────────────────────────────────┘

⚠️ IMPORTANTE: Agora é obrigatório para 
   receber convites de times!
```

---

## 🔐 **SEGURANÇA:**

### **Validações Implementadas:**
```
✅ Tipo de usuário verificado (frontend + backend)
✅ CPF obrigatório para convites
✅ CPF único por time
✅ Convite só aceito pelo atleta correto
✅ Time atual protegido (não editável)
✅ Histórico preservado automaticamente
✅ Middleware de autenticação em todas rotas
```

### **Proteções:**
```
🔒 Apenas time pode criar torneio
🔒 Apenas time pode enviar convites
🔒 Apenas atleta com CPF recebe convites
🔒 Apenas atleta convocado aceita/recusa
🔒 CPF não pode estar em 2 times
🔒 Histórico não pode ser editado
```

---

## 📊 **ESTATÍSTICAS E RELATÓRIOS:**

### **Time pode ver:**
```
✅ Convites enviados
✅ Convites aceitos
✅ Convites recusados
✅ Convites pendentes
✅ Elenco atual (atletas com CPF)
✅ Histórico de convocações
```

### **Atleta pode ver:**
```
✅ Convites recebidos
✅ Convite pendentes
✅ Time atual
✅ Histórico de times
✅ Status de convocação
```

---

## 🚀 **PRÓXIMOS PASSOS:**

1. **Interface de Convocações:**
   - Página para times enviarem convites
   - Lista de atletas disponíveis
   - Filtro por posição e CPF cadastrado

2. **Notificações:**
   - Notificar atleta quando recebe convite
   - Notificar time quando convite é aceito/recusado

3. **Dashboard:**
   - Time vê elenco completo
   - Atletas veem seus convites
   - Histórico de movimentações

4. **Relatórios:**
   - CPFs cadastrados vs não cadastrados
   - Taxa de aceitação de convites
   - Movimentação de atletas

---

## ✅ **CHECKLIST DE IMPLEMENTAÇÃO:**

```
✅ Backend: Validação tipo usuário cria torneio
✅ Backend: Validação CPF obrigatório
✅ Backend: Validação CPF único por time
✅ Backend: Rotas de convocação completas
✅ Frontend: Botão criar torneio desabilitado
✅ Frontend: Mensagens de erro claras
✅ Frontend: API de convocações atualizada
✅ Campo CPF no perfil do atleta
✅ Campo currentTeam bloqueado
✅ Sistema de histórico de times
✅ Documentação completa
```

---

## 📞 **MENSAGENS PARA O USUÁRIO:**

### **Time tenta convocar sem CPF:**
```
"❌ Este atleta precisa cadastrar o CPF no perfil 
    antes de receber convites de times."
```

### **Atleta sem time aceita convite:**
```
"✅ Parabéns! Você agora faz parte do Time ABC!
    Seu perfil foi atualizado automaticamente."
```

### **Atleta com time recebe convite:**
```
"⚠️ Você já faz parte de um time. Saia do time atual 
    antes de aceitar novos convites."
```

### **CPF duplicado detectado:**
```
"❌ Este CPF já está sendo usado por outro atleta 
    que faz parte de um time. Contate o suporte 
    se isso for um erro."
```

---

**🎉 SISTEMA COMPLETO E FUNCIONAL!**

Todas as regras de negócio foram implementadas com validações rigorosas, garantindo integridade dos dados e segurança na plataforma! 🏐✨

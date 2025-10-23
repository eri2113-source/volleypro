# 🔍 Diagnóstico: Erro "User not found"

## 🎯 Problema identificado

O erro "User not found" que você está vendo **NÃO é da busca de jogadores**, mas sim **ao carregar seu próprio perfil** quando abre o modal de inscrição.

## 📋 O que foi melhorado

### 1. **Logs detalhados no carregamento do perfil**
```javascript
console.log("👤 Carregando perfil do usuário:", session.user.id);
console.log("✅ Perfil carregado:", profile);
```

### 2. **Logs detalhados na busca de jogadores (servidor)**
O servidor agora mostra:
- Total de usuários no banco
- Total de atletas no banco
- Quantos usuários correspondem ao nome buscado
- Quantos correspondem ao nome E ao tipo "athlete"
- Lista dos resultados encontrados

### 3. **Mensagens de erro mais específicas**
- "Perfil não encontrado. Por favor, complete seu cadastro."
- "Erro ao carregar perfil: [mensagem detalhada]"

## 🧪 Como testar agora

### Passo 1: Abra o Console (F12)

### Passo 2: Vá para a aba "Console"

### Passo 3: Tente inscrever uma dupla

Ao clicar em "Inscrever Dupla", você verá no console:

#### ✅ Se funcionar:
```
👤 Carregando perfil do usuário: [seu-id]
✅ Perfil carregado: { id: "...", name: "...", ... }
```

#### ❌ Se der erro:
```
👤 Carregando perfil do usuário: [seu-id]
❌ Erro ao carregar usuário: Error: User not found
```

### Passo 4: Tente buscar um jogador

Digite um nome e clique em "Buscar". Você verá no console:

```
🔍 Buscando atletas reais com nome: Gabriel
✅ Sessão válida encontrada
📡 URL da requisição: https://[projeto].supabase.co/functions/v1/make-server-0ea22bba/users/search?query=Gabriel&type=athlete
📥 Status da resposta: 200
```

## 🔍 Logs do servidor

No **servidor** (logs do Supabase Edge Functions), você verá:

```
🔍 Searching users: { query: "Gabriel", type: "athlete" }
📊 Total users in database: 5
🏃 Total athletes in database: 2
🔍 Users matching name "Gabriel": 1
🎯 Users matching name AND type "athlete": 1
✅ Found 1 users
📋 Results: [ "Gabriel Alves (athlete)" ]
```

## 🎯 Possíveis causas do erro

### 1. **Você está no Figma Make (ambiente de testes)**
- ❌ O Figma Make usa dados mockados
- ✅ **Solução:** Vá para o site em produção: https://volleypro-zw96.vercel.app

### 2. **Seu perfil não foi carregado corretamente**
- ❌ O perfil pode não existir no banco de dados
- ✅ **Solução:** 
  1. Faça logout
  2. Faça login novamente
  3. Verifique se seu nome aparece no canto superior direito

### 3. **Não há atletas cadastrados no sistema**
- ❌ Você pode ser o único usuário
- ✅ **Solução:** Crie outra conta com tipo "Atleta" para testar

## 📸 O que enviar para debug

Se o erro persistir, me envie:

1. **Screenshot do console completo** mostrando todos os logs
2. **Confirme se está no Figma Make ou em produção**
3. **Seu tipo de conta** (Atleta, Time, Fã)

## 🚀 Teste rápido em produção

1. Acesse: https://volleypro-zw96.vercel.app
2. Faça login com sua conta
3. Vá em Torneios → Torneios de Areia
4. Clique em "Inscrever" em algum torneio
5. Abra o console (F12)
6. Veja os logs detalhados

## ⚠️ Importante

O erro "User not found" que você viu **é normal se você está no Figma Make**, pois o ambiente de testes não tem acesso ao banco de dados real de produção.

Para usar o sistema completo com busca de jogadores real, você **DEVE** acessar o site em produção na Vercel.

---

**Arquivos modificados:**
- `/components/BeachTournamentRegistration.tsx` - Logs detalhados frontend
- `/supabase/functions/server/index.tsx` - Logs detalhados backend

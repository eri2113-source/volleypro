# 🔧 LIMPAR PERFIL "JOÃO SILVA" (SE NECESSÁRIO)

## ⚠️ ATENÇÃO

**ANTES DE DELETAR, LEIA:**

"João Silva" pode ser:
1. ✅ **Você mesmo** - Conta que você criou para teste
2. ✅ **Usuário real** - Conta legítima no sistema
3. ⚠️ **Conta de teste antiga** - Criada em testes anteriores

**Só delete se:**
- Você tem certeza que é uma conta de teste
- Você não está logado como "João Silva"
- Você tem outra conta para usar

---

## 📋 OPÇÃO 1: Verificar Se É Você

### Passo 1: Console do Navegador

```javascript
// F12 > Console > Colar:

const whoAmI = async () => {
  const token = localStorage.getItem('supabase.auth.token');
  if (!token) {
    console.log('❌ Você não está logado');
    return;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('👤 VOCÊ É:', {
      id: payload.sub,
      email: payload.email,
      expira: new Date(payload.exp * 1000).toLocaleString()
    });
    
    // Buscar perfil completo
    const response = await fetch(
      `https://jkxgmwzvrdntqpvlfyxv.supabase.co/functions/v1/make-server-0ea22bba/users/${payload.sub}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const user = await response.json();
    console.log('📋 SEU PERFIL:', {
      nome: user.name,
      tipo: user.userType,
      posicao: user.position,
      cidade: user.city
    });
    
    if (user.name === 'João Silva') {
      console.log('⚠️ VOCÊ É O JOÃO SILVA!');
      console.log('   Não delete esta conta, você está usando ela!');
    } else {
      console.log('✅ Você NÃO é João Silva');
      console.log('   Pode ser seguro deletar se for conta de teste');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

whoAmI();
```

**Resultado esperado:**
```javascript
👤 VOCÊ É: {
  id: "user:abc123...",
  email: "seu.email@exemplo.com",
  expira: "23/10/2025, 15:30:00"
}

📋 SEU PERFIL: {
  nome: "João Silva",      // <-- Se este for seu nome
  tipo: "athlete",
  posicao: "Atacante",
  cidade: "São Paulo"
}

⚠️ VOCÊ É O JOÃO SILVA!
   Não delete esta conta, você está usando ela!
```

---

## 📋 OPÇÃO 2: Buscar Todos "João Silva"

### Script de Busca

```javascript
// F12 > Console > Colar:

const buscarJoaoSilva = async () => {
  const token = localStorage.getItem('supabase.auth.token');
  if (!token) {
    console.log('❌ Faça login primeiro');
    return;
  }
  
  try {
    const response = await fetch(
      'https://jkxgmwzvrdntqpvlfyxv.supabase.co/functions/v1/make-server-0ea22bba/users/search?query=João Silva',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const data = await response.json();
    const joaoSilvas = data.users || [];
    
    console.log(`🔍 Encontrados ${joaoSilvas.length} usuário(s) "João Silva":`);
    
    joaoSilvas.forEach((user, i) => {
      console.log(`\n${i+1}. ${user.name}`, {
        id: user.id,
        email: user.email || '(não disponível)',
        tipo: user.userType,
        posicao: user.position,
        criado: user.createdAt
      });
    });
    
    if (joaoSilvas.length === 0) {
      console.log('✅ Nenhum "João Silva" encontrado!');
      console.log('   O perfil pode ter sido deletado ou não existe.');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

buscarJoaoSilva();
```

---

## 🗑️ OPÇÃO 3: Deletar "João Silva" (Cuidado!)

### ⚠️ ANTES DE DELETAR:

1. ✅ Verificar que NÃO é você (usar script acima)
2. ✅ Fazer logout da conta "João Silva"
3. ✅ Ter outra conta para usar
4. ✅ Ter certeza que é conta de teste

### Script de Deleção (USE COM CUIDADO!)

```javascript
// ⚠️ ATENÇÃO: Este script DELETA permanentemente!
// ⚠️ Só execute se tiver CERTEZA!

const deletarJoaoSilva = async () => {
  const confirmacao = prompt('Digite "DELETAR JOÃO SILVA" para confirmar:');
  
  if (confirmacao !== 'DELETAR JOÃO SILVA') {
    console.log('❌ Operação cancelada');
    return;
  }
  
  const token = localStorage.getItem('supabase.auth.token');
  if (!token) {
    console.log('❌ Faça login primeiro (com OUTRA conta!)');
    return;
  }
  
  try {
    // Primeiro, buscar o ID do João Silva
    const searchResponse = await fetch(
      'https://jkxgmwzvrdntqpvlfyxv.supabase.co/functions/v1/make-server-0ea22bba/users/search?query=João Silva',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const searchData = await searchResponse.json();
    const joaoSilva = searchData.users?.[0];
    
    if (!joaoSilva) {
      console.log('❌ João Silva não encontrado');
      return;
    }
    
    console.log('🎯 Encontrado:', joaoSilva.name, '(' + joaoSilva.id + ')');
    
    const finalConfirm = confirm(
      `ÚLTIMA CONFIRMAÇÃO:\n\n` +
      `Deletar usuário?\n` +
      `Nome: ${joaoSilva.name}\n` +
      `ID: ${joaoSilva.id}\n` +
      `Tipo: ${joaoSilva.userType}\n\n` +
      `Esta ação NÃO pode ser desfeita!`
    );
    
    if (!finalConfirm) {
      console.log('❌ Operação cancelada');
      return;
    }
    
    // Deletar usuário
    const deleteResponse = await fetch(
      `https://jkxgmwzvrdntqpvlfyxv.supabase.co/functions/v1/make-server-0ea22bba/users/${joaoSilva.id}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    if (deleteResponse.ok) {
      console.log('✅ João Silva deletado com sucesso!');
      console.log('   ID deletado:', joaoSilva.id);
    } else {
      const error = await deleteResponse.json();
      console.error('❌ Erro ao deletar:', error);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

// ⚠️ NÃO EXECUTAR AUTOMATICAMENTE!
// ⚠️ Só executar manualmente depois de verificar!
console.log('⚠️ Script carregado. Execute: deletarJoaoSilva()');
```

---

## 📋 OPÇÃO 4: Criar Nova Conta (RECOMENDADO)

### Em vez de deletar, crie uma conta nova:

#### Passo 1: Logout
```
1. Clicar no avatar no canto superior direito
2. Clicar em "Sair"
```

#### Passo 2: Criar Nova Conta
```
1. Clicar em "Criar Conta"
2. Preencher:
   
   Nome Completo: [Seu Nome Real]
   
   Email: seu.email@real.com
   
   Senha: [senha segura]
   
   Confirmar Senha: [mesma senha]
   
   Tipo de Conta: Atleta
   
   Posição: [Sua posição]
   
   Cidade: [Sua cidade]
   
   Estado: [Seu estado]

3. Clicar em "Criar Conta"
4. Fazer login
5. Testar inscrição novamente
```

---

## 🎯 RECOMENDAÇÃO

### ✅ FAZER:

1. **Verificar se você é João Silva** (script da Opção 1)
2. **Se for você:** Manter conta, ela está funcionando!
3. **Se não for você:** Criar nova conta (Opção 4)
4. **Testar com nova conta**

### ❌ NÃO FAZER:

1. ❌ Deletar sem verificar
2. ❌ Deletar se estiver logado como João Silva
3. ❌ Deletar se não souber de quem é a conta

---

## 🔍 ALTERNATIVA: Verificar Via Supabase Dashboard

### Se você tem acesso ao Supabase:

```
1. Ir em: https://supabase.com/dashboard/project/jkxgmwzvrdntqpvlfyxv

2. Authentication > Users

3. Buscar: "João Silva"

4. Ver detalhes:
   - Email
   - Data de criação
   - Última atividade

5. Se for conta de teste antiga:
   - Clicar nos 3 pontos
   - Delete User
   - Confirmar
```

---

## ✅ CONCLUSÃO

### O "João Silva" é fake?

**NÃO!** "João Silva" é um usuário REAL no banco de dados.

Pode ser:
- ✅ Você mesmo (conta que você criou)
- ✅ Conta de teste que você criou antes
- ✅ Outro usuário real do sistema

### O que fazer?

#### Se for VOCÊ:
```
✅ Manter a conta
✅ Continuar usando
✅ Sistema está funcionando corretamente
```

#### Se for CONTA DE TESTE:
```
✅ Criar nova conta com seu nome real
✅ Fazer logout da conta de teste
✅ Usar nova conta
❌ Não precisa deletar (opcional)
```

#### Se quiser DELETAR:
```
1. ✅ Verificar que NÃO é você (script)
2. ✅ Fazer logout
3. ✅ Estar logado em OUTRA conta
4. ⚠️ Usar script de deleção com cuidado
```

---

## 📞 SUPORTE

**Se precisar de ajuda:**

Me envie:
- Output do script "whoAmI"
- Output do script "buscarJoaoSilva"
- Print do modal de inscrição
- Descrição do que você quer fazer

---

**Data:** 23/10/2025  
**Objetivo:** Gerenciar conta "João Silva"  
**Status:** 🔧 Scripts prontos para uso  

🏐 **VolleyPro** - Gerencie suas contas! 👤

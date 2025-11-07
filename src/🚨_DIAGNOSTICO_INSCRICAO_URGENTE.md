# 🚨 DIAGNÓSTICO URGENTE - INSCRIÇÃO NÃO FUNCIONA

## 🔍 TESTE IMEDIATO

### Passo 1: Abrir Console do Navegador
1. Pressione **F12**
2. Vá na aba **Console**
3. Cole este código:

```javascript
// Ver se usuário está logado
console.log('🔍 Status Login:', {
  token: localStorage.getItem('volleypro_token'),
  userId: localStorage.getItem('volleypro_user_id'),
  temToken: !!localStorage.getItem('volleypro_token')
});
```

### Passo 2: Tentar Inscrever
1. Abra um torneio
2. Clique em "Inscrever Meu Time"
3. **OLHE O CONSOLE** - vai aparecer logs tipo:
   - `🏢 ====== TIME SEM CATEGORIAS ======`
   - `✅ Inscrevendo automaticamente...`
   - `✅ Inscrição TIME COMPLETO realizada!` OU `❌ Erro...`

### Passo 3: Copiar e Enviar
Copie **TODOS** os logs do console e envie para mim.

---

## ❓ PERGUNTAS RÁPIDAS

1. **Aparece toast verde "inscrito com sucesso"?**
   - [ ] SIM - mas não aparece na lista
   - [ ] NÃO - nem aparece toast

2. **Que mensagem aparece no console?**
   - [ ] `✅ Inscrição realizada`
   - [ ] `❌ Erro ao inscrever`
   - [ ] `❌ Unauthorized`
   - [ ] Nada aparece

3. **Você fez logout e login novamente hoje?**
   - [ ] SIM
   - [ ] NÃO

---

## 🔧 SOLUÇÕES RÁPIDAS (TESTAR NA ORDEM)

### Solução 1: Limpar Cache e Login Novo
```javascript
// Cole no Console (F12):
localStorage.clear();
location.reload();
```
**Depois:** Faça login novamente e teste

### Solução 2: Ver Erro Real
```javascript
// Cole no Console ANTES de tentar inscrever:
window.DEBUG_INSCRIPTION = true;

// Isso vai mostrar logs detalhados da inscrição
```

### Solução 3: Verificar Token
```javascript
// Cole no Console:
fetch('https://xvrnzgjxmtyrzbnfxiqh.supabase.co/functions/v1/make-server-0ea22bba/profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('volleypro_token')
  }
})
.then(r => r.json())
.then(d => console.log('✅ Token válido:', d))
.catch(e => console.error('❌ Token inválido:', e));
```

---

## 📸 ENVIAR PRINT

Tire print de:
1. **Tela do torneio** (onde clica em "Inscrever Meu Time")
2. **Console (F12)** mostrando os logs
3. **Toast** que aparece (se aparecer)

---

## ⚡ ENQUANTO ISSO, VOU ADICIONAR MAIS LOGS

Vou adicionar logs detalhados no código para descobrir exatamente onde está falhando.

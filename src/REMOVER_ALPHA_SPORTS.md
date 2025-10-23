# 🗑️ REMOVER "ALPHA SPORTS" DO BANCO DE DADOS

## 🎯 PROBLEMA IDENTIFICADO

"Alpha Sports" **NÃO ESTÁ NO CÓDIGO** - está no **BANCO DE DADOS SUPABASE!**

Por isso ainda aparece no site mesmo após remover do código.

---

## ✅ SOLUÇÃO (3 OPÇÕES)

### OPÇÃO 1: DELETAR VIA SUPABASE DASHBOARD (RECOMENDADO)

**Passo a passo visual:**

1. **Acesse:** https://supabase.com/dashboard
2. **Entre no seu projeto VolleyPro**
3. **Vá para:** `Table Editor` (menu lateral esquerdo)
4. **Abra a tabela:** `kv_store_0ea22bba`
5. **Procure por:** Alpha Sports
6. **Identifique as linhas:**
   - `user:xxx` (usuário Alpha Sports)
   - `profile:xxx` (perfil Alpha Sports)
   - `posts:xxx` (posts do Alpha Sports)
7. **Delete cada linha** clicando no ícone de lixeira

---

### OPÇÃO 2: SQL DIRETO (MAIS RÁPIDO)

**Passo a passo:**

1. **Acesse:** https://supabase.com/dashboard
2. **Entre no seu projeto**
3. **Vá para:** `SQL Editor` (menu lateral)
4. **Cole este SQL:**

```sql
-- 🔍 PRIMEIRO: Encontrar o ID do Alpha Sports
SELECT 
  key, 
  value->>'name' as name, 
  value->>'email' as email,
  value->>'userType' as type
FROM kv_store_0ea22bba 
WHERE key LIKE 'profile:%'
  AND value->>'name' ILIKE '%Alpha Sports%';

-- ⚠️ ANOTE O ID QUE APARECER (será algo como: profile:xxx)
-- Pegue apenas o número depois dos dois pontos

-- 🗑️ DEPOIS: Delete TUDO relacionado ao Alpha Sports
-- Substitua XXX pelo ID encontrado acima

DELETE FROM kv_store_0ea22bba 
WHERE key LIKE 'user:XXX'
   OR key LIKE 'profile:XXX'
   OR key LIKE 'posts:XXX'
   OR (key LIKE 'post:%' AND value->>'authorId' = 'XXX');

-- ✅ Confirme que deletou
SELECT COUNT(*) as total_deletado 
FROM kv_store_0ea22bba 
WHERE value->>'name' ILIKE '%Alpha Sports%';
-- Deve retornar 0
```

5. **Clique em:** `Run`

---

### OPÇÃO 3: VIA MASTER ADMIN (SE TIVER ACESSO)

Se você tem conta master no site:

1. **Entre no site:** https://volleypro-zw96.vercel.app
2. **Faça login** com conta master
3. **Vá para:** Feed
4. **Procure posts do Alpha Sports**
5. **Delete cada post** (botão de lixeira)
6. **Depois:** Vá para Teams
7. **Procure o time Alpha Sports**
8. **Se tiver opção de deletar, delete**

---

## 🔍 COMO VERIFICAR SE AINDA EXISTE

### VIA SQL:

```sql
-- Procurar qualquer menção a "Alpha Sports"
SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%'
LIMIT 20;
```

### VIA SITE:

1. Entre em: https://volleypro-zw96.vercel.app
2. Vá para **"Times"**
3. Procure por "Alpha"
4. **NÃO deve aparecer nada**

---

## 🎯 SCRIPT COMPLETO COPY/PASTE

**Use este script SQL completo:**

```sql
-- ============================================
-- 🗑️ REMOVER ALPHA SPORTS COMPLETAMENTE
-- ============================================

-- Passo 1: Ver quantos registros existem
SELECT 
  'Total de registros Alpha Sports' as descricao,
  COUNT(*) as quantidade
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%';

-- Passo 2: Ver detalhes (para confirmar antes de deletar)
SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email,
  value->>'userType' as tipo,
  value->>'team' as time_atual
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%'
ORDER BY key;

-- Passo 3: DELETAR TUDO relacionado a Alpha Sports
-- ⚠️ CUIDADO: Isso é IRREVERSÍVEL!

DELETE FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%';

-- Passo 4: Confirmar que deletou
SELECT 
  'Alpha Sports removido' as status,
  COUNT(*) as registros_restantes
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%';
-- Deve mostrar 0

-- Passo 5: Limpar posts órfãos (posts sem autor)
DELETE FROM kv_store_0ea22bba
WHERE key LIKE 'post:%'
  AND NOT EXISTS (
    SELECT 1 FROM kv_store_0ea22bba profiles
    WHERE profiles.key = 'profile:' || (kv_store_0ea22bba.value->>'authorId')
  );

-- ✅ PRONTO! Alpha Sports foi removido completamente
```

---

## 🚨 IMPORTANTE

### Antes de deletar:

- ✅ **Faça backup** se quiser (opcional)
- ✅ **Confirme** que é realmente Alpha Sports
- ✅ **Verifique** que não vai deletar dados importantes

### Depois de deletar:

1. **Limpe o cache do navegador:**
   - Chrome: Ctrl + Shift + Delete
   - Ou adicione na URL: `?clear_cache=true`

2. **Recarregue a página:**
   - F5 ou Ctrl + R

3. **Verifique:**
   - Vá para "Times"
   - Alpha Sports NÃO deve aparecer

---

## 🎯 POR QUE ISSO ACONTECEU?

**Código vs Banco de Dados:**

```
┌─────────────────────────────────────┐
│  CÓDIGO (GitHub/Vercel)             │
│  ✅ Não tem Alpha Sports            │
│  ✅ Usa apenas dados reais          │
└─────────────────────────────────────┘
              ↓ busca dados
┌─────────────────────────────────────┐
│  BANCO DE DADOS (Supabase)          │
│  ❌ AINDA TEM Alpha Sports          │
│  ❌ Cadastrado como usuário real    │
└─────────────────────────────────────┘
```

**O que acontece:**
1. Site carrega (código limpo ✅)
2. Site pede "me dê todos os times"
3. Banco retorna: [Time Real 1, Time Real 2, **Alpha Sports**]
4. Site exibe tudo que o banco mandou

**Solução:** Deletar do BANCO DE DADOS!

---

## 📋 CHECKLIST

Após executar o SQL:

- [ ] Alpha Sports NÃO aparece em "Times"
- [ ] Alpha Sports NÃO aparece no "Feed"
- [ ] Alpha Sports NÃO aparece em "Torneios"
- [ ] Nenhum post do Alpha Sports aparece
- [ ] SQL retorna 0 registros ao buscar

---

## 🆘 SE DER PROBLEMA

### Erro: "permission denied"

**Causa:** Você não tem permissão para deletar  
**Solução:** Use a conta de administrador do Supabase

### Erro: "syntax error"

**Causa:** SQL copiado errado  
**Solução:** Copie novamente, certifique-se de copiar todo o comando

### Alpha Sports ainda aparece

**Causa:** Cache do navegador  
**Solução:**
1. Ctrl + Shift + Delete
2. Limpar tudo
3. Fechar navegador
4. Abrir novamente
5. Adicionar `?clear_cache=true` na URL

---

## ✅ RESULTADO ESPERADO

**ANTES:**
```
Times:
- Time Real 1 ✅
- Time Real 2 ✅  
- Alpha Sports ❌ (FAKE)
- Time Real 3 ✅
```

**DEPOIS:**
```
Times:
- Time Real 1 ✅
- Time Real 2 ✅
- Time Real 3 ✅
```

---

## 🎯 AÇÃO RECOMENDADA

**FAÇA AGORA:**

1. Acesse: https://supabase.com/dashboard
2. Entre no projeto VolleyPro
3. Vá para: **SQL Editor**
4. Cole o **Script Completo** acima
5. Clique em: **Run**
6. Aguarde: 2-3 segundos
7. Verifique: Deve mostrar "0 registros restantes"
8. Teste no site: Alpha Sports sumiu! ✅

---

**PRONTO! ALPHA SPORTS SERÁ REMOVIDO PERMANENTEMENTE! 🗑️**

-- ============================================
-- 🗑️ REMOVER ALPHA SPORTS DO BANCO DE DADOS
-- ============================================
-- Execute este SQL no Supabase Dashboard
-- SQL Editor: https://supabase.com/dashboard > Seu Projeto > SQL Editor
-- ============================================

-- Passo 1: Ver o que será deletado (SEGURANÇA)
SELECT 
  '=== REGISTROS QUE SERÃO DELETADOS ===' as info,
  COUNT(*) as total
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%';

-- Passo 2: Ver detalhes
SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email,
  value->>'userType' as tipo
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%';

-- Passo 3: DELETAR (IRREVERSÍVEL!)
-- ⚠️ Descomente a linha abaixo para executar
-- DELETE FROM kv_store_0ea22bba WHERE value::text ILIKE '%Alpha Sports%';

-- Passo 4: Confirmar remoção
SELECT 
  '=== VERIFICAÇÃO PÓS-DELETE ===' as info,
  COUNT(*) as registros_restantes
FROM kv_store_0ea22bba
WHERE value::text ILIKE '%Alpha Sports%';
-- Deve retornar 0

-- ============================================
-- 📝 INSTRUÇÕES:
-- ============================================
-- 1. Execute PRIMEIRO os passos 1 e 2 para ver o que será deletado
-- 2. Se confirmar que é o Alpha Sports, descomente a linha do DELETE
-- 3. Execute novamente
-- 4. Verifique com o passo 4 que retorna 0
-- ============================================

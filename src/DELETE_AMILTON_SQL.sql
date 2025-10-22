-- 🗑️ DELETAR CONTA - amiltonsousa110999@gmail.com
-- Copie e cole no Supabase SQL Editor

-- Deletar conta
DELETE FROM auth.users WHERE email = 'amiltonsousa110999@gmail.com';

-- Verificar se foi deletado
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ CONTA DELETADA COM SUCESSO! Amilton pode se cadastrar novamente.'
    ELSE '❌ Erro: Conta ainda existe'
  END as resultado
FROM auth.users
WHERE email = 'amiltonsousa110999@gmail.com';

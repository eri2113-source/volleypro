#!/usr/bin/env python3
"""
Script para corrigir os erros no backend de inscrição
"""

import re

# Ler o arquivo
with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Correção 1: Remover \\n mal escapado na linha 4795
content = content.replace(
    r'console.error(`   ❌ ERRO: Time não encontrado ou não é do tipo correto`);\\n      console.error(`      • team exists:`, !!team);',
    r'console.error(`   ❌ ERRO: Time não encontrado ou inválido`);' + '\n' + '      console.error(`      • team exists:`, !!team);'
)

# Correção 2: Simplificar teamData
content = content.replace(
    '// Usar dados do time (não do user)\n    const teamData = team || user;',
    '// Usar dados do time\n    const teamData = team;'
)

# Correção 3: Corrigir user.name para team.name na linha 4866
content = content.replace(
    'console.log(`✅ Time completo \\"${user.name}\\" inscrito com sucesso`);',
    'console.log(`✅ Time completo \\"${team.name}\\" inscrito com sucesso`);'
)

# Salvar
with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Correções aplicadas com sucesso!")
print("")
print("Mudanças:")
print("1. ✅ Removido \\\\n mal escapado")
print("2. ✅ Simplificado teamData = team")
print("3. ✅ Corrigido user.name → team.name")

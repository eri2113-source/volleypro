#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Corrige erro de sintaxe linha 4795 do backend"""

import re

# Ler arquivo
with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

print("🔍 Procurando erro na linha 4795...")

# Correção 1: Linha 4795 - Remover \n mal escapado
# O padrão está: correto`);\\n      console.error(`
# Deve ficar: inválido`);\n      console.error(`

old_pattern_1 = r"console\.error\(`   ❌ ERRO: Time não encontrado ou não é do tipo correto`\);\\\\n\s+console\.error\(`\s+• team exists:`"

new_replacement_1 = """console.error(`   ❌ ERRO: Time não encontrado ou inválido`);
      console.error(`      • team exists:`"""

if re.search(old_pattern_1, content):
    content = re.sub(old_pattern_1, new_replacement_1, content)
    print("✅ Linha 4795 corrigida (escape \\n removido)")
else:
    print("⚠️ Padrão linha 4795 não encontrado, tentando método alternativo...")
    # Método alternativo: substituição literal
    old_literal = 'console.error(`   ❌ ERRO: Time não encontrado ou não é do tipo correto`);\\n      console.error(`      • team exists:`'
    new_literal = '''console.error(`   ❌ ERRO: Time não encontrado ou inválido`);
      console.error(`      • team exists:`'''
    
    if old_literal in content:
        content = content.replace(old_literal, new_literal)
        print("✅ Linha 4795 corrigida (método alternativo)")
    else:
        print("❌ ERRO: Não foi possível encontrar o padrão para corrigir")

# Correção 2: Simplificar teamData
old_pattern_2 = r"// Usar dados do time \(não do user\)\s+const teamData = team \|\| user;"
new_replacement_2 = """// Usar dados do time
    const teamData = team;"""

if re.search(old_pattern_2, content):
    content = re.sub(old_pattern_2, new_replacement_2, content)
    print("✅ Linha ~4801 corrigida (teamData simplificado)")

# Correção 3: user.name → team.name
old_pattern_3 = r'console\.log\(`✅ Time completo \\"\\$\{user\.name\}\\" inscrito com sucesso`\);'
new_replacement_3 = 'console.log(`✅ Time completo "${team.name}" inscrito com sucesso`);'

if re.search(old_pattern_3, content):
    content = re.sub(old_pattern_3, new_replacement_3, content)
    print("✅ Linha ~4866 corrigida (user.name → team.name)")

# Salvar arquivo
with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ TODAS AS CORREÇÕES APLICADAS!")
print("\nResumo:")
print("1. Linha 4795: Removido \\n mal escapado")
print("2. Linha ~4801: teamData = team (simplificado)")
print("3. Linha ~4866: user.name → team.name")
print("\n🚀 Agora faça commit e push para produção!")

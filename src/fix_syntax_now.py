#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix syntax error on line 4795 - escape character outside string"""

import sys

print("🔧 Corrigindo erro de sintaxe linha 4795...")

# Read file
with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 4795 (index 4794)
if len(lines) > 4794:
    original = lines[4794]
    
    # Check if it contains the problematic pattern
    if '`);\\n      console.error(`' in original or '`);\n      console.error(`' in original:
        print(f"❌ ERRO ENCONTRADO na linha 4795:")
        print(f"   {repr(original)}")
        
        # Replace the broken line with two correct lines
        lines[4794] = '      console.error(`   ❌ ERRO: Time não encontrado ou inválido`);\n'
        lines.insert(4795, '      console.error(`      • team exists:`, !!team);\n')
        
        print(f"\n✅ CORRIGIDO:")
        print(f"   Linha 4795: {repr(lines[4794])}")
        print(f"   Linha 4796: {repr(lines[4795])}")
    else:
        print(f"⚠️ Linha 4795 não contém o padrão esperado")
        print(f"   Conteúdo: {repr(original)}")
        sys.exit(1)
else:
    print("❌ Arquivo muito curto")
    sys.exit(1)

# Fix line ~4801: teamData = team || user → team
for i in range(4799, min(4806, len(lines))):
    if 'const teamData = team || user' in lines[i]:
        lines[i] = '    const teamData = team;\n'
        print(f"\n✅ Linha {i+1} corrigida: teamData simplificado")
        break

# Fix line ~4802: message
for i in range(4800, min(4807, len(lines))):
    if 'Permissões OK - Time:' in lines[i]:
        lines[i] = '    console.log(`   ✅ Time válido: ${teamData.name}`);\n'
        print(f"✅ Linha {i+1} corrigida: mensagem atualizada")
        break

# Write file
with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n" + "="*50)
print("✅ ARQUIVO CORRIGIDO COM SUCESSO!")
print("="*50)
print("\n📋 Resumo das correções:")
print("  1. Linha 4795: Removido escape \\n quebrado")
print("  2. Linha ~4801: teamData = team (simplificado)")
print("  3. Linha ~4802: Mensagem atualizada")
print("\n🚀 Agora faça:")
print("  git add supabase/functions/server/index.tsx")
print('  git commit -m "fix: Corrigido erro sintaxe linha 4795"')
print("  git push origin main")

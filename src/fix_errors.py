#!/usr/bin/env python3
"""Fix syntax errors in backend"""

with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix linha 4795: Remover \n mal escapado
if len(lines) > 4794:
    line_4795 = lines[4794]
    if '\\n' in line_4795 and 'Time não encontrado' in line_4795:
        # Quebrar em duas linhas corretamente
        lines[4794] = '      console.error(`   ❌ ERRO: Time não encontrado ou inválido`);\n'
        lines.insert(4795, '      console.error(`      • team exists:`, !!team);\n')
        print('✅ Linha 4795 corrigida (erro de sintaxe \\n)')

# Fix linha 4801: Simplificar teamData (agora linha 4802 após inserção)
for i in range(4800, min(4805, len(lines))):
    if 'const teamData = team || user' in lines[i]:
        lines[i] = '    const teamData = team;\n'
        print(f'✅ Linha {i+1} corrigida (teamData simplificado)')
        break

# Fix linha 4866: user.name → team.name (agora linha 4867 após inserção)
for i in range(4865, min(4870, len(lines))):
    if 'user.name' in lines[i] and 'Time completo' in lines[i]:
        lines[i] = lines[i].replace('user.name', 'team.name')
        print(f'✅ Linha {i+1} corrigida (user.name → team.name)')
        break

# Salvar
with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('\n✅ Todas as correções aplicadas!')
print('\nResumo:')
print('1. Linha 4795: Removido \\n mal escapado')
print('2. Linha ~4801: teamData = team (simplificado)')
print('3. Linha ~4866: user.name → team.name')

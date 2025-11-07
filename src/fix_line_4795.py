#!/usr/bin/env python3
"""Fix syntax error on line 4795"""

with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 4795: tem escape \n quebrado
if len(lines) > 4794:
    # Linha 4795 (índice 4794) tem o problema
    old_line = lines[4794]
    
    if '\\n' in old_line and 'ERRO' in old_line:
        print(f"ANTES: {repr(old_line)}")
        
        # Substituir a linha problemática
        lines[4794] = '      console.error(`   ❌ ERRO: Time não encontrado ou inválido`);\n'
        
        # Inserir a próxima linha corretamente
        lines.insert(4795, '      console.error(`      • team exists:`, !!team);\n')
        
        print(f"DEPOIS linha 4795: {repr(lines[4794])}")
        print(f"DEPOIS linha 4796: {repr(lines[4795])}")
        print("✅ Linha 4795 corrigida")
    else:
        print("⚠️ Linha 4795 não tem o padrão esperado")
        print(f"Conteúdo: {repr(old_line)}")

# Fix linha ~4801: teamData = team || user → team
for i in range(4798, min(4805, len(lines))):
    if 'const teamData = team || user' in lines[i]:
        lines[i] = '    const teamData = team;\n'
        print(f"✅ Linha {i+1} corrigida (teamData)")
        break

# Fix linha ~4866: user.name → team.name  
for i in range(4863, min(4870, len(lines))):
    if 'user.name' in lines[i] and 'Time completo' in lines[i]:
        lines[i] = lines[i].replace('user.name', 'team.name')
        print(f"✅ Linha {i+1} corrigida (user.name → team.name)")
        break

# Fix linha ~4802: mudar mensagem
for i in range(4799, min(4806, len(lines))):
    if 'Permissões OK - Time:' in lines[i]:
        lines[i] = '    console.log(`   ✅ Time válido: ${teamData.name}`);\n'
        print(f"✅ Linha {i+1} corrigida (mensagem)")
        break

# Salvar arquivo
with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('\n✅ TODAS CORREÇÕES APLICADAS!')
print('\nResumo:')
print('1. Linha 4795: Removido \\n mal escapado')  
print('2. Linha ~4801: teamData = team (simplificado)')
print('3. Linha ~4802: Mensagem atualizada')
print('4. Linha ~4866: user.name → team.name')

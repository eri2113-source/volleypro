#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix sintaxe linha 4795 - Solução definitiva"""

print("🔧 Lendo arquivo index.tsx...")

with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"✓ Arquivo lido: {len(content)} caracteres")

# Padrão EXATO do erro (com escape literal)
# A linha tem:  correto`);\\n      console.error(
# Onde \\n é LITERAL (dois caracteres: backslash e n)

original = "correto`);\\n      console.error(`      • team exists:"
replacement = "inválido`);\n      console.error(`      • team exists:"

if original in content:
    print("✓ Padrão encontrado! Corrigindo...")
    content = content.replace(original, replacement)
    
    # Simplificar teamData
    content = content.replace(
        "const teamData = team || user;",
        "const teamData = team;"
    )
    
    # Atualizar mensagem
    content = content.replace(
        "`   ✅ Permissões OK - Time: ${teamData.name}`",
        "`   ✅ Time válido: ${teamData.name}`"
    )
    
    # Salvar
    with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n" + "="*60)
    print("✅ ARQUIVO CORRIGIDO!")
    print("="*60)
    print("\n🎯 Mudanças:")
    print("  • Linha 4795: \\n literal removido")
    print("  • console.error dividido em 2 linhas")
    print("  • teamData simplificado (team ao invés de team || user)")
    print("  • Mensagem atualizada")
    print("\n🚀 Execute:")
    print("  git add supabase/functions/server/index.tsx")
    print('  git commit -m "fix: Corrigido sintaxe linha 4795"')
    print("  git push")
else:
    print("\n❌ Padrão não encontrado!")
    print("Procurando variações...")
    
    # Testar só a parte do erro
    test1 = "correto`);"
    test2 = "\\n"
    test3 = "team exists"
    
    if test1 in content:
        print(f"  ✓ Encontrado: {test1}")
    if test2 in content:
        print(f"  ✓ Encontrado: {test2}")
    if test3 in content:
        print(f"  ✓ Encontrado: {test3}")
    
    # Mostrar a área problemática
    idx = content.find("tipo correto")
    if idx > 0:
        print(f"\nÁrea ao redor de 'tipo correto':")
        print(repr(content[idx-50:idx+150]))

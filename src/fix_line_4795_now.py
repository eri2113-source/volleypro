#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix linha 4795 - Remover escape \\n quebrado"""

import sys

print("🔧 Corrigindo erro de sintaxe na linha 4795...")

try:
    # Ler arquivo
    with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"✓ Arquivo lido ({len(content)} caracteres)")
    
    # Padrão exato do erro (usando raw string para evitar problemas com escape)
    erro_pattern = r'console.error(`   ❌ ERRO: Time não encontrado ou não é do tipo correto`);\\n      console.error(`      • team exists:`, !!team);'
    
    # Correção (duas linhas separadas corretamente)
    correcao = '''console.error(`   ❌ ERRO: Time não encontrado ou inválido`);
      console.error(`      • team exists:`, !!team);'''
    
    # Verificar se o padrão existe
    if erro_pattern in content:
        print("✓ Erro encontrado!")
        content = content.replace(erro_pattern, correcao)
        print("✓ Erro corrigido - linha 4795 dividida em duas")
    else:
        # Tentar padrão alternativo (só a parte problemática)
        erro_alt = 'correto`);\\n      console'
        if erro_alt in content:
            print("✓ Erro encontrado (padrão alternativo)!")
            content = content.replace(erro_alt, 'inválido`);\n      console')
            print("✓ Erro corrigido - escape removido")
        else:
            print("❌ ERRO: Padrão não encontrado no arquivo")
            print("Procurando por linhas com 'tipo correto'...")
            lines = content.split('\n')
            for i, line in enumerate(lines, 1):
                if 'tipo correto' in line:
                    print(f"  Linha {i}: {line[:100]}")
            sys.exit(1)
    
    # Correção adicional: simplificar teamData
    content = content.replace(
        'const teamData = team || user;',
        'const teamData = team;'
    )
    print("✓ teamData simplificado")
    
    # Correção adicional: atualizar mensagem
    content = content.replace(
        'console.log(`   ✅ Permissões OK - Time: ${teamData.name}`);',
        'console.log(`   ✅ Time válido: ${teamData.name}`);'
    )
    print("✓ Mensagem atualizada")
    
    # Salvar arquivo
    with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n" + "="*60)
    print("✅ ARQUIVO CORRIGIDO COM SUCESSO!")
    print("="*60)
    print("\n🚀 Execute agora:")
    print("  git add supabase/functions/server/index.tsx")
    print('  git commit -m "fix: Corrigido escape \\n quebrado linha 4795"')
    print("  git push origin main")
    print("\n⏰ Deploy automático em 2-3 minutos")
    
except Exception as e:
    print(f"\n❌ ERRO: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

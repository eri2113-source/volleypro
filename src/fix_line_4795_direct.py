#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Correção DIRETA da linha 4795 - leitura linha por linha"""

print("🔧 Corrigindo linha 4795...")

# Ler arquivo linha por linha
with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"📄 Total de linhas: {len(lines)}")

# A linha 4795 é o índice 4794 (array começa em 0)
line_index = 4794

if len(lines) > line_index:
    original_line = lines[line_index]
    print(f"\n❌ LINHA ORIGINAL {line_index + 1}:")
    print(f"   {repr(original_line)}")
    
    # Verificar se contém o erro
    if 'tipo correto' in original_line and '\\n' in original_line:
        # Dividir a linha no ponto do erro
        # A linha tem: console.error(`...correto`);\\n      console.error(`...`)
        # Precisamos transformar em duas linhas
        
        # Primeira parte: até o primeiro console.error
        line1 = '      console.error(`   ❌ ERRO: Time não encontrado ou inválido`);\n'
        # Segunda parte: o segundo console.error que estava na mesma linha
        line2 = '      console.error(`      • team exists:`, !!team);\n'
        
        # Substituir a linha problemática
        lines[line_index] = line1
        # Inserir a nova linha depois
        lines.insert(line_index + 1, line2)
        
        print(f"\n✅ LINHA CORRIGIDA:")
        print(f"   {line_index + 1}: {repr(line1)}")
        print(f"   {line_index + 2}: {repr(line2)}")
        
        # Correção adicional: simplificar teamData
        for i in range(4798, min(4805, len(lines))):
            if 'const teamData = team || user' in lines[i]:
                lines[i] = '    const teamData = team;\n'
                print(f"\n✅ Linha {i+1} simplificada: teamData = team")
                break
        
        # Correção adicional: atualizar mensagem de log
        for i in range(4799, min(4806, len(lines))):
            if 'Permissões OK - Time:' in lines[i]:
                lines[i] = '    console.log(`   ✅ Time válido: ${teamData.name}`);\n'
                print(f"✅ Linha {i+1} atualizada: mensagem de log")
                break
        
        # Salvar arquivo
        with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        print("\n" + "="*60)
        print("✅ ARQUIVO CORRIGIDO COM SUCESSO!")
        print("="*60)
        print("\n🚀 Próximos passos:")
        print("  1. git add supabase/functions/server/index.tsx")
        print('  2. git commit -m "fix: Corrigido erro sintaxe linha 4795"')
        print("  3. git push origin main")
        print("\n⏰ Deploy em produção: 2-3 minutos")
        
    else:
        print("\n⚠️  Linha não contém o padrão esperado")
        print("    Procurando por: 'tipo correto' e '\\\\n'")
        if 'tipo correto' in original_line:
            print("    ✓ Encontrado 'tipo correto'")
        if '\\n' in original_line:
            print("    ✓ Encontrado '\\\\n'")
        exit(1)
else:
    print(f"❌ Arquivo tem apenas {len(lines)} linhas, esperava pelo menos {line_index + 1}")
    exit(1)

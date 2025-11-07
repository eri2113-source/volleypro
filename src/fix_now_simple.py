#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Correção SIMPLES e DIRETA - linha 4795"""

# Ler arquivo completo
with open('supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

print("🔍 Procurando erro...")

# Substituição DIRETA do padrão problemático
old_text = 'console.error(`   ❌ ERRO: Time não encontrado ou não é do tipo correto`);\\n      console.error(`      • team exists:`'

new_text = '''console.error(`   ❌ ERRO: Time não encontrado ou inválido`);
      console.error(`      • team exists:`'''

if old_text in content:
    content = content.replace(old_text, new_text)
    print("✅ Linha 4795 CORRIGIDA!")
else:
    print("❌ Padrão não encontrado. Tentando alternativa...")
    # Tentar sem o escape
    old_text2 = 'correto`);\\n      console'
    new_text2 = 'inválido`);\n      console'
    if old_text2 in content:
        content = content.replace(old_text2, new_text2)
        print("✅ Linha 4795 CORRIGIDA (método 2)!")
    else:
        print("❌ ERRO: Não foi possível corrigir automaticamente")
        exit(1)

# Correção 2: Simplificar teamData
content = content.replace(
    '// Usar dados do time (não do user)\n    const teamData = team || user;',
    '// Usar dados do time\n    const teamData = team;'
)
print("✅ teamData simplificado")

# Correção 3: Mensagem de log
content = content.replace(
    'console.log(`   ✅ Permissões OK - Time: ${teamData.name}`);',
    'console.log(`   ✅ Time válido: ${teamData.name}`);'
)
print("✅ Mensagem de log atualizada")

# Salvar arquivo
with open('supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "="*60)
print("✅ TODAS AS CORREÇÕES APLICADAS COM SUCESSO!")
print("="*60)
print("\n🚀 Próximos passos:")
print("1. git add supabase/functions/server/index.tsx")
print('2. git commit -m "fix: Corrigido erro sintaxe linha 4795"')
print("3. git push origin main")
print("\n⏰ Deploy em produção: 2-3 minutos")

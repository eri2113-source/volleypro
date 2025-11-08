#!/usr/bin/env python3
"""Corrige user.name para teamData.name na linha 4867"""

import re

# Ler o arquivo
with open('/supabase/functions/server/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Corrigir a linha 4867 (index 4866)
if len(lines) > 4866:
    old_line = lines[4866]
    if 'user.name' in old_line:
        lines[4866] = old_line.replace('user.name', 'teamData.name')
        print(f"✅ Linha 4867 corrigida!")
        print(f"   Antes: {old_line.strip()}")
        print(f"   Depois: {lines[4866].strip()}")
    else:
        print(f"⚠️ Linha 4867 não contém 'user.name'")
        print(f"   Conteúdo: {old_line.strip()}")
else:
    print(f"❌ Arquivo tem apenas {len(lines)} linhas")

# Salvar
with open('/supabase/functions/server/index.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n🎉 Arquivo salvo com sucesso!")

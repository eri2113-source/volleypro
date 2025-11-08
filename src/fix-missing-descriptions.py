#!/usr/bin/env python3
"""
Script para adicionar DialogDescription faltantes
"""

import os
import re

def fix_missing_descriptions(file_path):
    """Adiciona DialogDescription para DialogContent que tem aria-describedby mas não tem Description"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = []
    
    # Procura por DialogContent com aria-describedby
    pattern = r'<DialogContent[^>]*aria-describedby=["\']([^"\']+)["\'][^>]*>'
    matches = list(re.finditer(pattern, content))
    
    for match in matches:
        aria_id = re.search(r'aria-describedby=["\']([^"\']+)["\']', match.group(0)).group(1)
        
        # Verifica se já existe DialogDescription com esse ID
        description_pattern = rf'<DialogDescription\s+id=["\']' + re.escape(aria_id) + r'["\']'
        
        if not re.search(description_pattern, content):
            # Precisa adicionar DialogDescription
            # Procura por DialogHeader após este DialogContent
            search_start = match.end()
            header_match = re.search(r'<DialogHeader[^>]*>', content[search_start:])
            
            if header_match:
                # Encontra o fim do DialogHeader
                header_start = search_start + header_match.end()
                
                # Procura por DialogTitle
                title_match = re.search(r'<DialogTitle[^>]*>([^<]+)</DialogTitle>', content[header_start:header_start+500])
                
                if title_match:
                    # Adiciona DialogDescription logo após DialogTitle
                    insert_pos = header_start + title_match.end()
                    
                    # Gera descrição baseada no ID
                    description = "Dialog description"
                    if 'tournament' in aria_id:
                        description = "Tournament details and information"
                    elif 'profile' in aria_id:
                        description = "Edit your profile information"
                    elif 'invite' in aria_id:
                        description = "Invitation details"
                    elif 'create' in aria_id:
                        description = "Create new item"
                    elif 'auth' in aria_id:
                        description = "Authentication dialog"
                    
                    # Detecta indentação
                    line_start = content.rfind('\n', 0, insert_pos)
                    indent = '          '  # Padrão
                    
                    new_description = f'\n{indent}<DialogDescription id="{aria_id}">\n{indent}  {description}\n{indent}</DialogDescription>'
                    
                    content = content[:insert_pos] + new_description + content[insert_pos:]
                    changes.append(f"  ✓ Adicionado DialogDescription id=\"{aria_id}\"")
    
    # Salva se houve mudanças
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n📝 {file_path}")
        for change in changes:
            print(change)
        return True
    
    return False

def main():
    """Processa todos os arquivos .tsx"""
    
    print("🔧 Corrigindo DialogDescription faltantes...\n")
    
    files_to_check = []
    
    for root, dirs, files in os.walk('components'):
        if 'ui' in dirs:
            dirs.remove('ui')
        
        for file in files:
            if file.endswith('.tsx'):
                files_to_check.append(os.path.join(root, file))
    
    files_changed = 0
    
    for file_path in files_to_check:
        if fix_missing_descriptions(file_path):
            files_changed += 1
    
    print(f"\n✅ Concluído!")
    print(f"   {files_changed} arquivo(s) corrigido(s)")

if __name__ == '__main__':
    main()

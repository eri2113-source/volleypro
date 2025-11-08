#!/usr/bin/env python3
"""
Script para corrigir warnings de DialogContent sem DialogDescription
"""

import os
import re

def fix_dialog_descriptions(file_path):
    """Verifica e adiciona DialogDescription se estiver faltando"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = []
    
    # Procura por DialogContent com aria-describedby
    pattern = r'<DialogContent[^>]*aria-describedby=["\']([^"\']+)["\'][^>]*>'
    matches = list(re.finditer(pattern, content))
    
    for match in matches:
        aria_id_match = re.search(r'aria-describedby=["\']([^"\']+)["\']', match.group(0))
        if not aria_id_match:
            continue
            
        aria_id = aria_id_match.group(1)
        
        # Verifica se já existe DialogDescription com esse ID
        description_pattern = rf'<DialogDescription\s+id=["\']' + re.escape(aria_id) + r'["\']'
        
        if not re.search(description_pattern, content):
            # Precisa adicionar DialogDescription
            # Procura o DialogHeader mais próximo após o DialogContent
            search_start = match.end()
            
            # Procura DialogHeader
            header_match = re.search(r'<DialogHeader[^>]*>', content[search_start:search_start + 500])
            
            if header_match:
                header_pos = search_start + header_match.end()
                
                # Procura DialogTitle
                title_match = re.search(r'</DialogTitle>', content[header_pos:header_pos + 1000])
                
                if title_match:
                    # Insere DialogDescription logo após o DialogTitle
                    insert_pos = header_pos + title_match.end()
                    
                    # Detecta indentação da linha anterior
                    line_start = content.rfind('\n', 0, insert_pos)
                    next_line_start = content.find('\n', insert_pos)
                    if next_line_start > 0:
                        indent_line = content[insert_pos:next_line_start]
                        # Pega espaços do início
                        indent_match = re.match(r'^(\s+)', indent_line)
                        if indent_match:
                            indent = indent_match.group(1)
                        else:
                            indent = '            '
                    else:
                        indent = '            '
                    
                    # Gera descrição baseada no aria_id
                    description_text = 'Dialog content'
                    if 'live' in aria_id.lower():
                        description_text = 'Live player details'
                    elif 'led' in aria_id.lower() or 'panel' in aria_id.lower():
                        description_text = 'LED panel configuration'
                    elif 'tournament' in aria_id.lower():
                        description_text = 'Tournament information'
                    elif 'profile' in aria_id.lower():
                        description_text = 'Profile details'
                    
                    new_description = f'\n{indent}<DialogDescription id="{aria_id}">\n{indent}  {description_text}\n{indent}</DialogDescription>'
                    
                    content = content[:insert_pos] + new_description + content[insert_pos:]
                    changes.append(f"  ✓ Added DialogDescription for '{aria_id}' in {os.path.basename(file_path)}")
    
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
    
    print("🔍 Procurando DialogContent sem DialogDescription...\n")
    
    files_changed = 0
    files_to_check = []
    
    # Procura em components/
    for root, dirs, files in os.walk('components'):
        for file in files:
            if file.endswith('.tsx'):
                files_to_check.append(os.path.join(root, file))
    
    for file_path in files_to_check:
        if fix_dialog_descriptions(file_path):
            files_changed += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Verificação concluída!")
    print(f"   Arquivos verificados: {len(files_to_check)}")
    print(f"   Arquivos corrigidos: {files_changed}")
    
    if files_changed == 0:
        print(f"\n🎉 Todos os Dialogs já têm DialogDescription!")
    else:
        print(f"\n⚠️  {files_changed} arquivo(s) corrigido(s)")

if __name__ == '__main__':
    main()

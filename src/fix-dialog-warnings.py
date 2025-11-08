#!/usr/bin/env python3
"""
Script para corrigir warnings de acessibilidade em DialogContent
Adiciona aria-describedby para todos os DialogContent que não têm
"""

import os
import re

def fix_dialog_content(file_path):
    """Corrige DialogContent sem aria-describedby em um arquivo"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # Padrão 1: DialogContent sem aria-describedby no mesmo arquivo
    # Procura por <DialogContent...> que não tem aria-describedby
    pattern = r'<DialogContent\s+([^>]*?)(?<!aria-describedby=["\'][^"\']*["\'])>'
    
    def replace_dialog(match):
        full_match = match.group(0)
        attrs = match.group(1)
        
        # Se já tem aria-describedby, não mexe
        if 'aria-describedby' in full_match:
            return full_match
        
        # Gera um ID único baseado no contexto
        # Tenta extrair um nome do className ou gerar genérico
        id_suffix = 'description'
        if 'className' in attrs:
            class_match = re.search(r'className=["\']([^"\']*)["\']', attrs)
            if class_match:
                class_name = class_match.group(1)
                if 'tournament' in class_name.lower():
                    id_suffix = 'tournament-description'
                elif 'profile' in class_name.lower():
                    id_suffix = 'profile-description'
                elif 'team' in class_name.lower():
                    id_suffix = 'team-description'
                elif 'create' in class_name.lower():
                    id_suffix = 'create-description'
        
        # Adiciona aria-describedby
        if attrs.strip():
            new_content = f'<DialogContent {attrs} aria-describedby="{id_suffix}">'
        else:
            new_content = f'<DialogContent aria-describedby="{id_suffix}">'
        
        changes_made.append(f"  ✓ Adicionado aria-describedby='{id_suffix}'")
        return new_content
    
    content = re.sub(pattern, replace_dialog, content)
    
    # Se fez mudanças, salva o arquivo
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n📝 {file_path}")
        for change in changes_made:
            print(change)
        return True
    
    return False

def main():
    """Processa todos os arquivos .tsx do projeto"""
    
    print("🔍 Procurando DialogContent sem aria-describedby...\n")
    
    files_to_check = []
    
    # Procura em components/
    for root, dirs, files in os.walk('components'):
        # Ignora ui/ pois já está OK
        if 'ui' in dirs:
            dirs.remove('ui')
        
        for file in files:
            if file.endswith('.tsx'):
                files_to_check.append(os.path.join(root, file))
    
    files_changed = 0
    
    for file_path in files_to_check:
        if fix_dialog_content(file_path):
            files_changed += 1
    
    print(f"\n✅ Concluído!")
    print(f"   {files_changed} arquivo(s) corrigido(s)")
    
    if files_changed == 0:
        print("   ✨ Nenhuma correção necessária - tudo OK!")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Script para verificar se todos os DialogContent têm acessibilidade correta
"""

import os
import re

def check_dialog_accessibility(file_path):
    """Verifica acessibilidade de DialogContent em um arquivo"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # Procura por DialogContent
    dialog_pattern = r'<DialogContent[^>]*>'
    dialogs = list(re.finditer(dialog_pattern, content))
    
    for match in dialogs:
        dialog_tag = match.group(0)
        
        # Verifica se tem aria-describedby
        aria_match = re.search(r'aria-describedby=["\']([^"\']+)["\']', dialog_tag)
        
        if not aria_match:
            issues.append({
                'type': 'missing_aria',
                'line': content[:match.start()].count('\n') + 1,
                'tag': dialog_tag[:80] + '...' if len(dialog_tag) > 80 else dialog_tag
            })
        else:
            # Verifica se existe DialogDescription com o ID correspondente
            aria_id = aria_match.group(1)
            description_pattern = rf'<DialogDescription\s+id=["\']({aria_id})["\']'
            
            if not re.search(description_pattern, content):
                issues.append({
                    'type': 'missing_description',
                    'line': content[:match.start()].count('\n') + 1,
                    'aria_id': aria_id,
                    'tag': dialog_tag[:80] + '...' if len(dialog_tag) > 80 else dialog_tag
                })
    
    # Verifica AlertDialogContent também
    alert_pattern = r'<AlertDialogContent[^>]*>'
    alert_dialogs = list(re.finditer(alert_pattern, content))
    
    for match in alert_dialogs:
        dialog_tag = match.group(0)
        
        # Verifica se tem aria-describedby
        aria_match = re.search(r'aria-describedby=["\']([^"\']+)["\']', dialog_tag)
        
        if not aria_match:
            issues.append({
                'type': 'missing_aria_alert',
                'line': content[:match.start()].count('\n') + 1,
                'tag': dialog_tag[:80] + '...' if len(dialog_tag) > 80 else dialog_tag
            })
        else:
            # Verifica se existe AlertDialogDescription com o ID correspondente
            aria_id = aria_match.group(1)
            description_pattern = rf'<AlertDialogDescription\s+id=["\']({aria_id})["\']'
            
            if not re.search(description_pattern, content):
                issues.append({
                    'type': 'missing_alert_description',
                    'line': content[:match.start()].count('\n') + 1,
                    'aria_id': aria_id,
                    'tag': dialog_tag[:80] + '...' if len(dialog_tag) > 80 else dialog_tag
                })
    
    return issues

def main():
    """Verifica todos os arquivos .tsx do projeto"""
    
    print("🔍 Verificando acessibilidade dos Dialogs...\n")
    
    files_to_check = []
    
    # Procura em components/
    for root, dirs, files in os.walk('components'):
        for file in files:
            if file.endswith('.tsx'):
                files_to_check.append(os.path.join(root, file))
    
    total_issues = 0
    files_with_issues = 0
    
    for file_path in files_to_check:
        issues = check_dialog_accessibility(file_path)
        
        if issues:
            files_with_issues += 1
            print(f"\n⚠️  {file_path}")
            
            for issue in issues:
                total_issues += 1
                
                if issue['type'] == 'missing_aria':
                    print(f"   Linha {issue['line']}: Falta aria-describedby")
                    print(f"   {issue['tag']}")
                
                elif issue['type'] == 'missing_description':
                    print(f"   Linha {issue['line']}: Falta DialogDescription com id=\"{issue['aria_id']}\"")
                    print(f"   {issue['tag']}")
                
                elif issue['type'] == 'missing_aria_alert':
                    print(f"   Linha {issue['line']}: Falta aria-describedby em AlertDialogContent")
                    print(f"   {issue['tag']}")
                
                elif issue['type'] == 'missing_alert_description':
                    print(f"   Linha {issue['line']}: Falta AlertDialogDescription com id=\"{issue['aria_id']}\"")
                    print(f"   {issue['tag']}")
    
    print(f"\n{'='*60}")
    print(f"✅ Verificação concluída!")
    print(f"   Arquivos verificados: {len(files_to_check)}")
    print(f"   Arquivos com problemas: {files_with_issues}")
    print(f"   Total de problemas: {total_issues}")
    
    if total_issues == 0:
        print(f"\n🎉 Perfeito! Todos os Dialogs têm acessibilidade correta!")
    else:
        print(f"\n⚠️  Encontrados {total_issues} problema(s) de acessibilidade.")

if __name__ == '__main__':
    main()

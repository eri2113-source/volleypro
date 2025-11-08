#!/usr/bin/env python3
"""
Script para encontrar DialogContent sem DialogDescription
"""
import os
import re

def find_dialogs_without_description():
    """Encontra todos os Dialogs sem DialogDescription"""
    issues = []
    
    for root, dirs, files in os.walk('./components'):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Procurar por DialogContent seguido de DialogHeader e DialogTitle
                        # mas sem DialogDescription
                        pattern = r'<DialogContent[^>]*>(.*?)</DialogContent>'
                        matches = re.finditer(pattern, content, re.DOTALL)
                        
                        for match in matches:
                            dialog_content = match.group(1)
                            
                            has_header = '<DialogHeader' in dialog_content
                            has_title = '<DialogTitle' in dialog_content
                            has_description = '<DialogDescription' in dialog_content or 'aria-describedby' in match.group(0)
                            
                            if has_header and has_title and not has_description:
                                # Encontrar número da linha
                                line_num = content[:match.start()].count('\n') + 1
                                issues.append({
                                    'file': filepath,
                                    'line': line_num,
                                    'preview': dialog_content[:200].replace('\n', ' ')
                                })
                
                except Exception as e:
                    print(f"Erro ao processar {filepath}: {e}")
    
    return issues

if __name__ == '__main__':
    print("🔍 Procurando Dialogs sem DialogDescription...\n")
    
    issues = find_dialogs_without_description()
    
    if issues:
        print(f"❌ Encontrados {len(issues)} Dialogs sem DialogDescription:\n")
        for issue in issues:
            print(f"📍 {issue['file']}:{issue['line']}")
            print(f"   Preview: {issue['preview'][:100]}...\n")
    else:
        print("✅ Todos os Dialogs têm DialogDescription!")

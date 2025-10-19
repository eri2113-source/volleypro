#!/bin/bash

# 🚀 SCRIPT DE PUBLICAÇÃO AUTOMÁTICA - VOLLEYPRO
# Este script substitui o botão "Publicar" do Figma Make
# Uso: bash publicar.sh

echo "🏐 VolleyPro - Publicação Automática"
echo "======================================"
echo ""

# Verificar se há mudanças
if [[ -z $(git status -s) ]]; then
    echo "⚠️  Nenhuma mudança detectada para publicar."
    echo ""
    read -p "Pressione ENTER para sair..."
    exit 0
fi

# Mostrar arquivos modificados
echo "📝 Arquivos modificados:"
git status -s
echo ""

# Pedir confirmação
read -p "✅ Deseja publicar estas mudanças? (S/n): " confirmacao
confirmacao=${confirmacao:-S}

if [[ ! $confirmacao =~ ^[Ss]$ ]]; then
    echo "❌ Publicação cancelada."
    exit 0
fi

# Pedir mensagem (opcional)
read -p "💬 Mensagem da atualização (ou ENTER para usar padrão): " mensagem
if [[ -z "$mensagem" ]]; then
    mensagem="Atualização automática - $(date '+%d/%m/%Y %H:%M')"
fi

echo ""
echo "🔄 Publicando mudanças..."
echo ""

# Adicionar todos os arquivos
echo "1/3 Adicionando arquivos..."
git add .

# Fazer commit
echo "2/3 Criando commit..."
git commit -m "$mensagem"

# Fazer push
echo "3/3 Enviando para produção..."
git push origin main

echo ""
echo "✅ PUBLICAÇÃO CONCLUÍDA!"
echo ""
echo "⏱️  Seu site estará atualizado em 3-5 minutos em:"
echo "🌐 https://volleypro-zw96.vercel.app"
echo ""
echo "💡 Dica: Limpe o cache do navegador (Ctrl+Shift+R) para ver as mudanças"
echo ""
read -p "Pressione ENTER para sair..."

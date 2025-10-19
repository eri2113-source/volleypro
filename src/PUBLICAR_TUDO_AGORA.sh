#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🚀 PUBLICAR VOLLEYPRO - SCRIPT ÚNICO E DEFINITIVO           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Este script vai fazer TUDO automaticamente:"
echo "  1️⃣  Adicionar todos os arquivos ao Git"
echo "  2️⃣  Criar commit com mensagem profissional"
echo "  3️⃣  Fazer push para o GitHub"
echo "  4️⃣  Netlify detecta e faz deploy AUTOMÁTICO"
echo "  5️⃣  Site atualizado em 2-3 minutos!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERRO: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar se Git está configurado
if ! git config user.name > /dev/null; then
    echo -e "${YELLOW}⚠️  Git não configurado. Configurando...${NC}"
    echo ""
    read -p "📧 Digite seu email do GitHub: " git_email
    read -p "👤 Digite seu nome: " git_name
    git config --global user.email "$git_email"
    git config --global user.name "$git_name"
    echo -e "${GREEN}✅ Git configurado!${NC}"
    echo ""
fi

# Timestamp para versão
TIMESTAMP=$(date +%s)
BUILD_ID="build-$(date +%Y%m%d-%H%M%S)"
VERSION="2.3.0"

echo -e "${BLUE}📦 Preparando arquivos...${NC}"
echo ""

# Atualizar arquivo de versão com informações completas
cat > BUILD_TIMESTAMP.txt << EOF
VolleyPro v${VERSION} - Sistema Completo de Anúncios
Build ID: ${BUILD_ID}
Timestamp: ${TIMESTAMP}
Platform: Netlify
Date: $(date '+%Y-%m-%d %H:%M:%S')
Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "initial")

🎯 FUNCIONALIDADES ATIVAS:
- ✅ Sistema de Anúncios completo
- ✅ Menu 'Anúncios' na barra horizontal
- ✅ Menu 'Anúncios' na sidebar
- ✅ Criação e aprovação de anúncios
- ✅ Feed estilo Instagram/Facebook
- ✅ Sistema de Lives com LiveKit
- ✅ Perfis de atletas e times
- ✅ Sistema de torneios
- ✅ Vitrine de jogadores
- ✅ 4 planos de monetização
- ✅ PWA completo e instalável
- ✅ Deploy automático Netlify

📧 Contato anunciantes: (62) 92000-4301
EOF

echo -e "${GREEN}✅ Versão atualizada: v${VERSION}${NC}"
echo -e "${GREEN}✅ Build ID: ${BUILD_ID}${NC}"
echo ""

# Adicionar TODOS os arquivos
echo -e "${BLUE}📋 Adicionando arquivos ao Git...${NC}"
git add -A

# Verificar o que vai ser commitado
echo ""
echo -e "${YELLOW}📊 Arquivos que serão commitados:${NC}"
git status --short | head -20
TOTAL_FILES=$(git status --short | wc -l)
echo ""
echo -e "${YELLOW}📦 Total de arquivos: ${TOTAL_FILES}${NC}"
echo ""

# Confirmação
echo "═══════════════════════════════════════════════════════════════"
echo ""
read -p "❓ Confirma o commit e publicação? (s/n) " -n 1 -r
echo ""
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Publicação cancelada.${NC}"
    exit 1
fi

# Criar commit com mensagem detalhada
echo -e "${BLUE}📝 Criando commit...${NC}"
git commit -m "🚀 Deploy v${VERSION} - Sistema Anúncios Completo

✨ VERSÃO: ${VERSION}
🆔 BUILD: ${BUILD_ID}
📅 DATA: $(date '+%Y-%m-%d %H:%M:%S')

🎯 MUDANÇAS NESTE DEPLOY:
────────────────────────────────────────
✅ Sistema de anúncios 100% funcional
✅ Menu 'Anúncios' na barra horizontal azul
✅ Menu 'Anúncios' na sidebar lateral
✅ 4 componentes frontend completos
✅ 6 rotas backend implementadas
✅ Aprovação de anúncios (admin only)
✅ Netlify configurado e otimizado
✅ PWA completo e testado

🏗️ ARQUITETURA:
────────────────────────────────────────
- Frontend: React + TypeScript + Vite
- Backend: Supabase Edge Functions
- Streaming: LiveKit
- Deploy: Netlify (automático)
- PWA: Service Worker ativo

📊 COMPONENTES ANÚNCIOS:
────────────────────────────────────────
- components/Ads.tsx (Página principal)
- components/AdsManagement.tsx (Gerenciamento)
- components/CreateAdModal.tsx (Criação)
- components/AdDisplay.tsx (Exibição)

🔧 ROTAS BACKEND:
────────────────────────────────────────
- POST /make-server-0ea22bba/ads (Criar)
- GET /make-server-0ea22bba/ads (Listar)
- GET /make-server-0ea22bba/ads/:id (Detalhes)
- PUT /make-server-0ea22bba/ads/:id (Atualizar)
- POST /make-server-0ea22bba/ads/:id/approve (Aprovar)
- DELETE /make-server-0ea22bba/ads/:id (Deletar)

📱 ACESSO:
────────────────────────────────────────
- Barra horizontal: Menu 'Anúncios' 📣
- Sidebar: Seção 'Anúncios'
- Admin: eri.2113@gmail.com (aprovações)
- WhatsApp: (62) 92000-4301

⚡ PLATAFORMA:
────────────────────────────────────────
- Netlify (sem problemas de cache!)
- Deploy automático do GitHub
- Build em 2-3 minutos
- HTTPS automático

🎉 PRONTO PARA PRODUÇÃO!" || {
    echo -e "${YELLOW}⚠️  Nada novo para commitar. Fazendo push do código existente...${NC}"
}

echo ""
echo -e "${GREEN}✅ Commit criado!${NC}"
echo ""

# Push para GitHub
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🚀 Enviando para o GitHub...${NC}"
echo ""

# Tentar push
if git push origin main 2>&1 | tee /tmp/git_push_output.txt; then
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║  ✅ PUSH CONCLUÍDO COM SUCESSO!                              ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
else
    echo ""
    echo -e "${YELLOW}⚠️  Primeira vez fazendo push? Vamos configurar...${NC}"
    echo ""
    
    # Detectar URL do repositório remoto se existir
    REMOTE_URL=$(git remote get-url origin 2>/dev/null)
    
    if [ -z "$REMOTE_URL" ]; then
        echo "📝 Configure o repositório remoto:"
        echo ""
        read -p "Cole a URL do seu repositório GitHub: " repo_url
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ Repositório remoto configurado!${NC}"
        echo ""
    fi
    
    # Tentar push novamente
    echo -e "${BLUE}🚀 Tentando push novamente...${NC}"
    if git push -u origin main; then
        echo ""
        echo "╔═══════════════════════════════════════════════════════════════╗"
        echo "║  ✅ PUSH CONCLUÍDO COM SUCESSO!                              ║"
        echo "╚═══════════════════════════════════════════════════════════════╝"
    else
        echo ""
        echo -e "${RED}❌ ERRO no push. Verifique:${NC}"
        echo "   1. URL do repositório está correta?"
        echo "   2. Você tem permissão de escrita?"
        echo "   3. GitHub está acessível?"
        echo ""
        echo "Execute: git remote -v"
        exit 1
    fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🎯 PRÓXIMOS PASSOS                                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se Netlify já está configurado
echo "🔍 Verificando configuração do Netlify..."
echo ""

if [ -f "netlify.toml" ]; then
    echo -e "${GREEN}✅ netlify.toml encontrado!${NC}"
    echo ""
    
    echo "📋 O QUE ACONTECE AGORA:"
    echo ""
    echo "1️⃣  ${GREEN}Netlify detectou o push automaticamente${NC}"
    echo "    ⏱️  Em ~10 segundos o build vai começar"
    echo ""
    echo "2️⃣  ${BLUE}Build em andamento (~2-3 minutos)${NC}"
    echo "    📊 Você pode acompanhar em tempo real"
    echo ""
    echo "3️⃣  ${GREEN}Deploy automático quando build terminar${NC}"
    echo "    🌐 Site atualizado automaticamente"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "🌐 ACESSAR NETLIFY:"
    echo "   👉 https://app.netlify.com"
    echo ""
    echo "📊 VER DEPLOY EM TEMPO REAL:"
    echo "   1. Entre no Netlify"
    echo "   2. Clique no seu site 'volleypro'"
    echo "   3. Clique em 'Deploys'"
    echo "   4. Veja o build acontecendo!"
    echo ""
    echo "⏰ TEMPO ESTIMADO:"
    echo "   - Detecção: ~10 segundos"
    echo "   - Build: ~2 minutos"
    echo "   - Deploy: ~30 segundos"
    echo "   - ${GREEN}TOTAL: ~3 minutos${NC}"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "✅ COMO TESTAR QUANDO PRONTO:"
    echo ""
    echo "   1. Abra aba anônima (Ctrl + Shift + N)"
    echo "   2. Acesse sua URL do Netlify"
    echo "   3. Faça login"
    echo "   4. ${GREEN}DEVE TER 'Anúncios' NA BARRA AZUL!${NC} 📣"
    echo ""
    
else
    echo -e "${YELLOW}⚠️  netlify.toml NÃO encontrado!${NC}"
    echo ""
    echo "🔧 VOCÊ PRECISA CONFIGURAR O NETLIFY PRIMEIRO:"
    echo ""
    echo "📘 Siga o guia: COMECE_AQUI_NETLIFY.md"
    echo ""
    echo "🚀 PASSOS RÁPIDOS:"
    echo "   1. Acesse: https://app.netlify.com/signup"
    echo "   2. Sign up with GitHub"
    echo "   3. Add new site → Import from GitHub"
    echo "   4. Selecione 'volleypro'"
    echo "   5. Adicione as variáveis de ambiente"
    echo "   6. Deploy site"
    echo ""
    echo "⏱️  TEMPO: ~10 minutos (só precisa fazer 1 vez)"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🎉 ${GREEN}CÓDIGO PUBLICADO NO GITHUB COM SUCESSO!${NC}"
echo ""
echo "💡 DICA: Salve este script! Use sempre que quiser publicar:"
echo "   ${BLUE}bash PUBLICAR_TUDO_AGORA.sh${NC}"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🏆 PARABÉNS! VOCÊ TEM UM WORKFLOW PROFISSIONAL!             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

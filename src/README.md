# 🏐 VolleyPro - Rede Social Completa para o Mundo do Vôlei

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/volleypro)

## 🚀 Sobre o Projeto

VolleyPro é uma rede social completa e profissional dedicada ao mundo do vôlei, desenvolvida com React, TypeScript, Tailwind CSS e Supabase.

### ✨ Principais Funcionalidades

- 📱 **Feed Estilo Instagram/Facebook** - Posts, reações, comentários e compartilhamentos
- 👤 **Perfis de Atletas e Times** - Painéis detalhados com estatísticas e conquistas
- 🏆 **Sistema de Torneios** - Classificação, ranking MVP e gestão completa
- 🎯 **Vitrine de Jogadores Livres** - Mercado com sistema de convocação
- 📺 **Transmissões ao Vivo** - Sistema profissional com LiveKit
- ✉️ **Sistema de Convites** - Entre times e atletas
- 💰 **Monetização Completa** - 4 planos de assinatura + publicidade + comissões
- 📱 **PWA (Progressive Web App)** - Instalável em qualquer dispositivo
- 🔐 **Autenticação Segura** - PKCE Flow compatível com Google Chrome

### 🎨 Design

- Paleta de cores vibrantes: Azul energético (#0066ff) e Laranja (#ff6b35)
- Gradientes dinâmicos que refletem o espírito do vôlei
- Background azul claríssimo (#f0f7ff)
- Interface moderna e responsiva
- Tema claro/escuro

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth (PKCE Flow)
- **Storage**: Supabase Storage
- **Streaming**: LiveKit Cloud
- **UI Components**: Shadcn/ui + Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Deploy**: Vercel

## 📦 Instalação Local

```bash
# Clonar repositório
git clone https://github.com/SEU_USUARIO/volleypro.git
cd volleypro

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Rodar em desenvolvimento
npm run dev
```

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon

# LiveKit (opcional - para lives)
VITE_LIVEKIT_URL=wss://seu-livekit.livekit.cloud
```

## 🚀 Deploy na Vercel

### Via Dashboard da Vercel (Recomendado)

1. **Faça upload do código para GitHub**
2. **Acesse**: https://vercel.com/new
3. **Importe o repositório**
4. **Configure**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Node Version: `18.x`
5. **Adicione as variáveis de ambiente** (veja acima)
6. **Deploy!** 🚀

### Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 📱 PWA - Progressive Web App

O VolleyPro é um PWA completo e pode ser instalado em qualquer dispositivo!

### Recursos PWA:

- ✅ Service Worker configurado
- ✅ Manifest.json com todos os metadados
- ✅ 8 ícones em todos os tamanhos (72x72 até 512x512)
- ✅ Funciona offline (páginas visitadas)
- ✅ Instalável em Android, iOS e Desktop
- ✅ Atualizações automáticas
- ✅ Indicador de status offline

### Testar PWA:

Após o deploy, acesse: `https://sua-url.vercel.app/#pwa-test`

## 🗂️ Estrutura do Projeto

```
volleypro/
├── src/
│   └── main.tsx              # Entry point
├── components/               # Componentes React
│   ├── Feed.tsx             # Feed principal
│   ├── Athletes.tsx         # Lista de atletas
│   ├── Teams.tsx            # Lista de times
│   ├── Tournaments.tsx      # Sistema de torneios
│   ├── Lives.tsx            # Transmissões ao vivo
│   ├── Monetization.tsx     # Sistema de monetização
│   └── ui/                  # Componentes Shadcn
├── lib/                     # Lógica de negócio
│   ├── api.ts              # API calls
│   ├── mockData.ts         # Dados de exemplo
│   └── monetizationPlans.ts # Planos de assinatura
├── utils/                   # Utilitários
│   └── supabase/           # Configuração Supabase
├── public/                  # Assets estáticos
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Service Worker
│   └── icon-*.svg          # Ícones PWA (8 tamanhos)
├── styles/
│   └── globals.css         # Estilos globais (Tailwind v4)
└── supabase/
    └── functions/          # Edge Functions
        └── server/         # Backend Hono
```

## 💰 Sistema de Monetização

### Planos de Assinatura:

1. **FREE** - Grátis
   - Recursos básicos
   - Anúncios visíveis

2. **PRO** - R$ 19,90/mês
   - Sem anúncios
   - Badge PRO
   - Estatísticas avançadas

3. **PREMIUM** - R$ 39,90/mês
   - Tudo do PRO
   - Badge PREMIUM
   - Lives ilimitadas
   - Prioridade em torneios

4. **ELITE** - R$ 99,90/mês
   - Tudo do PREMIUM
   - Badge ELITE dourado
   - Consultoria exclusiva
   - Destaque em vitrine

### Cotas de Publicidade (para empresas):

- 💼 Bronze: R$ 299/mês
- 🥈 Prata: R$ 599/mês
- 🥇 Ouro: R$ 999/mês
- 💎 Diamante: R$ 1.999/mês
- 👑 Master: R$ 4.999/mês

### Comissões para Atletas:

6 formas de monetização com comissões de 70-85%

## 🧪 Testes

```bash
# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

### Testar PWA localmente:

⚠️ **IMPORTANTE**: PWA só funciona em HTTPS (produção)

Para testar localmente, use:
```bash
npm run build
npm run preview
# Acesse: http://localhost:3000/#pwa-test
```

## 📊 Analytics e Monitoramento

O projeto está configurado para:
- ✅ Vercel Analytics (automático no deploy)
- ✅ Error Boundary para captura de erros
- ✅ Console logging estruturado
- ✅ Cache busting automático

## 🔒 Segurança

- ✅ Autenticação PKCE Flow
- ✅ Row Level Security (RLS) no Supabase
- ✅ Tokens armazenados de forma segura
- ✅ HTTPS obrigatório em produção
- ✅ Sanitização de inputs
- ✅ CORS configurado

## 📝 Licença

Este projeto foi desenvolvido para uso educacional e comercial.

## 👨‍💻 Desenvolvido por

Desenvolvido 100% no **Figma Make** com foco em performance, segurança e experiência do usuário.

## 🆘 Suporte

Para bugs ou sugestões, abra uma issue no GitHub.

## 🎉 Status do Projeto

🚀 **EM PRODUÇÃO** - Pronto para uso!

### Próximas Funcionalidades:
- [ ] Notificações push
- [ ] Chat em tempo real
- [ ] Integração com redes sociais
- [ ] App mobile nativo (iOS/Android)
- [ ] Sistema de gamificação
- [ ] Marketplace de produtos

---

**Feito com ❤️ e 🏐 para a comunidade do vôlei!**

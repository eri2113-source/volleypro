# 📋 Documento de Requisitos - VolleyPro

## 🎯 Visão Geral do Projeto

**Nome:** VolleyPro  
**Versão:** 1.0  
**URL de Produção:** https://volleypro-zw96.vercel.app  
**Tipo:** Progressive Web App (PWA)  
**Plataforma:** Web (Responsiva para Desktop e Mobile)  

### Descrição
VolleyPro é uma rede social completa dedicada ao mundo do vôlei, conectando atletas, times, árbitros, federações e fãs em uma plataforma única e abrangente. O sistema oferece funcionalidades sociais (feed, perfis, mensagens), profissionais (torneios, transmissões ao vivo, vitrine de atletas) e comerciais (sistema de monetização com 4 planos de assinatura).

---

## 🎯 Objetivos do Projeto

### Objetivos de Negócio
- **Conectar** toda a comunidade do vôlei em uma única plataforma
- **Profissionalizar** a divulgação de atletas e times
- **Facilitar** a organização e gestão de torneios
- **Monetizar** através de planos de assinatura e anúncios
- **Transmitir** jogos e eventos ao vivo com qualidade profissional

### Objetivos Técnicos
- Aplicação 100% web (PWA) instalável em qualquer dispositivo
- Performance otimizada e responsiva
- Sistema de autenticação seguro
- Infraestrutura escalável com Supabase + Vercel
- Transmissão ao vivo em tempo real com LiveKit

---

## 👥 Tipos de Usuário

### 1. **Atleta** 🏐
- Perfil profissional com estatísticas
- Portfólio de fotos e vídeos
- Histórico de times
- Conquistas e troféus
- Participação em torneios (individual para praia, time para quadra)
- Divulgação na vitrine

### 2. **Time** 🏆
- Perfil institucional
- Gestão de elenco
- Convites para atletas
- Inscrição em torneios de quadra
- Histórico de conquistas
- Gestão de categorias e divisões

### 3. **Árbitro** 🎽
- Perfil profissional
- Informações de contato comercial
- Federações de arbitragem vinculadas
- Portfólio de jogos apitados
- Disponibilidade para contratação

### 4. **Federação/Entidade** 🏛️
- Perfil institucional
- Gestão de contatos profissionais
- Organização de torneios
- Divulgação de eventos

### 5. **Fã** ❤️
- Perfil básico
- Interação social (curtidas, comentários, compartilhamentos)
- Acompanhamento de atletas e times
- Acesso a lives e torneios
- Participação em enquetes

### 6. **Master/Admin** 👑
- Usuário: eri.2113@gmail.com
- Acesso total ao sistema
- Moderação de conteúdo
- Gestão de anúncios
- Exclusão de posts
- Reset de dados para testes

---

## 🔧 Requisitos Funcionais

### RF01 - Sistema de Autenticação
- **RF01.1** - Cadastro de usuários com email e senha
- **RF01.2** - Login com email e senha
- **RF01.3** - Autenticação social (Google OAuth)
- **RF01.4** - Recuperação de senha via email
- **RF01.5** - Reset de senha
- **RF01.6** - Sessões persistentes
- **RF01.7** - Logout

### RF02 - Gestão de Perfis
- **RF02.1** - Criação de perfil personalizado por tipo de usuário
- **RF02.2** - Upload de foto de perfil
- **RF02.3** - Upload de banner de perfil
- **RF02.4** - Edição de informações pessoais
- **RF02.5** - Altura formatada em padrão brasileiro (ex: 1,85m)
- **RF02.6** - Posições (para atletas)
- **RF02.7** - Categorias e divisões (para times)
- **RF02.8** - Histórico de times (para atletas)
- **RF02.9** - Conquistas e troféus
- **RF02.10** - Selo de verificado

### RF03 - Feed Social
- **RF03.1** - Criação de posts com texto
- **RF03.2** - Upload de imagens em posts
- **RF03.3** - Upload de vídeos em posts
- **RF03.4** - Reações específicas de vôlei (Saque, Bloqueio, Ace, Defesa, Levantada)
- **RF03.5** - Sistema de comentários
- **RF03.6** - Compartilhamento de posts
- **RF03.7** - Exclusão de posts próprios
- **RF03.8** - Exclusão de posts por Master
- **RF03.9** - Feed ordenado cronologicamente
- **RF03.10** - Templates de posts informativos sobre vôlei

### RF04 - Sistema de Relacionamento
- **RF04.1** - Seguir atletas/times/árbitros
- **RF04.2** - Deixar de seguir
- **RF04.3** - Visualizar seguidores
- **RF04.4** - Visualizar seguindo
- **RF04.5** - Contadores de seguidores em tempo real

### RF05 - Sistema de Times
- **RF05.1** - Criação de perfil de time
- **RF05.2** - Convite de atletas para time
- **RF05.3** - Aceitação de convites
- **RF05.4** - Recusa de convites
- **RF05.5** - Saída de time (atleta)
- **RF05.6** - Remoção de atleta (time)
- **RF05.7** - Time atual bloqueado (não editável manualmente)
- **RF05.8** - Histórico automático de times
- **RF05.9** - Gestão de categorias/divisões

### RF06 - Vitrine de Atletas
- **RF06.1** - Exibição de atletas em cards verticais
- **RF06.2** - Filtro por posição
- **RF06.3** - Busca por nome
- **RF06.4** - Overlay com contador de seguidores
- **RF06.5** - Apenas atletas reais (sem perfis fake)
- **RF06.6** - Link direto para perfil

### RF07 - Sistema de Torneios

#### Vôlei de Quadra
- **RF07.1** - Criação de torneios por times ou master
- **RF07.2** - Inscrição de times
- **RF07.3** - Cancelamento de inscrição
- **RF07.4** - 4 formatos de chaveamento:
  - Eliminação Simples
  - Eliminação Dupla (Repescagem)
  - Todos contra Todos (Round Robin)
  - Sistema Suíço
- **RF07.5** - Sorteio automático de chaves
- **RF07.6** - Visualização de bracket
- **RF07.7** - Lançamento de resultados
- **RF07.8** - Classificação automática
- **RF07.9** - Sistema de MVP
- **RF07.10** - Cancelamento de torneios (com motivo)
- **RF07.11** - Notificações de torneios

#### Vôlei de Praia
- **RF07.12** - Criação de torneios com campo Arena obrigatório
- **RF07.13** - Inscrição individual (qualquer tipo de usuário)
- **RF07.14** - Formação de duplas
- **RF07.15** - Inscrição sem time vinculado
- **RF07.16** - Mesmos 4 formatos de chaveamento
- **RF07.17** - Contador de duplas (não times)

### RF08 - Transmissões ao Vivo
- **RF08.1** - Criação de lives por qualquer usuário autenticado
- **RF08.2** - Título, descrição e thumbnail
- **RF08.3** - Integração com LiveKit para streaming profissional
- **RF08.4** - Chat em tempo real
- **RF08.5** - Contador de espectadores
- **RF08.6** - Pico de espectadores
- **RF08.7** - Reações durante live
- **RF08.8** - Estados: Agendada, Ao Vivo, Finalizada
- **RF08.9** - Iniciar/Finalizar live
- **RF08.10** - Exclusão de lives
- **RF08.11** - Permissões de câmera/microfone
- **RF08.12** - Teste de câmera antes da live

### RF09 - Sistema de Mensagens
- **RF09.1** - Chat privado entre usuários
- **RF09.2** - Lista de conversas
- **RF09.3** - Mensagens em tempo real
- **RF09.4** - Indicador de mensagens não lidas
- **RF09.5** - Busca de usuários para iniciar conversa
- **RF09.6** - Timestamp de mensagens

### RF10 - Contatos Profissionais (Árbitros)
- **RF10.1** - Cadastro de contatos (email, WhatsApp, telefone, Instagram)
- **RF10.2** - Edição de contatos
- **RF10.3** - Exclusão de contatos
- **RF10.4** - Exibição no perfil público
- **RF10.5** - Formatação automática de telefone/WhatsApp
- **RF10.6** - Links clicáveis para WhatsApp e Instagram

### RF11 - Sistema de Monetização
- **RF11.1** - 4 planos de assinatura:
  - **Gratuito**: Funcionalidades básicas
  - **Premium** (R$ 29,90/mês): Vitrine destacada + Selo verificado
  - **Pro** (R$ 59,90/mês): Premium + Lives ilimitadas + Chat prioritário
  - **Team** (R$ 149,90/mês): Pro + Gestão de elenco + Convocações
- **RF11.2** - Badge visual do plano no perfil
- **RF11.3** - Comparação de planos
- **RF11.4** - Dashboard de monetização
- **RF11.5** - Prompts de upgrade

### RF12 - Sistema de Anúncios
- **RF12.1** - Criação de anúncios com título, descrição, imagem e link
- **RF12.2** - Status: Pendente, Aprovado, Rejeitado
- **RF12.3** - Aprovação de anúncios (Master)
- **RF12.4** - Exibição de anúncios aprovados
- **RF12.5** - Clicks em anúncios rastreados
- **RF12.6** - Gestão de anúncios

### RF13 - Galeria de Mídia
- **RF13.1** - Upload de fotos
- **RF13.2** - Upload de vídeos
- **RF13.3** - Galeria visual
- **RF13.4** - Integração com Unsplash para imagens de exemplo

### RF14 - PWA (Progressive Web App)
- **RF14.1** - Instalável em qualquer dispositivo
- **RF14.2** - Ícones adaptativos (72x72 até 512x512)
- **RF14.3** - Splash screen personalizada
- **RF14.4** - Service Worker para cache
- **RF14.5** - Funciona offline (parcialmente)
- **RF14.6** - Prompt de instalação
- **RF14.7** - Manifesto completo

### RF15 - Recursos Adicionais
- **RF15.1** - Enquetes
- **RF15.2** - Banner de boas-vindas
- **RF15.3** - Aviso de migração do Figma Make
- **RF15.4** - Controle de acesso do Figma Make
- **RF15.5** - Modo offline indicator
- **RF15.6** - Loading screens
- **RF15.7** - Error boundaries
- **RF15.8** - Console help para desenvolvedores

---

## 🔒 Requisitos Não-Funcionais

### RNF01 - Performance
- **RNF01.1** - Tempo de carregamento inicial < 3s
- **RNF01.2** - Tempo de resposta de APIs < 500ms
- **RNF01.3** - Imagens otimizadas e lazy loading
- **RNF01.4** - Cache de dados frequentes
- **RNF01.5** - Debouncing em buscas

### RNF02 - Segurança
- **RNF02.1** - Autenticação JWT via Supabase
- **RNF02.2** - HTTPS obrigatório
- **RNF02.3** - Validação de inputs
- **RNF02.4** - Proteção contra XSS
- **RNF02.5** - Rate limiting em APIs
- **RNF02.6** - Variáveis de ambiente seguras
- **RNF02.7** - Service Role Key apenas no backend

### RNF03 - Usabilidade
- **RNF03.1** - Interface intuitiva e moderna
- **RNF03.2** - Design responsivo (mobile-first)
- **RNF03.3** - Feedback visual em todas ações
- **RNF03.4** - Toasts informativos
- **RNF03.5** - Estados de loading
- **RNF03.6** - Mensagens de erro claras
- **RNF03.7** - Acessibilidade (ARIA labels, descrições)

### RNF04 - Compatibilidade
- **RNF04.1** - Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **RNF04.2** - iOS Safari 14+
- **RNF04.3** - Android Chrome 90+
- **RNF04.4** - Resolução mínima: 320px
- **RNF04.5** - PWA instalável em iOS e Android

### RNF05 - Escalabilidade
- **RNF05.1** - Arquitetura serverless (Vercel + Supabase)
- **RNF05.2** - Edge Functions para APIs
- **RNF05.3** - CDN global
- **RNF05.4** - Banco de dados escalável (Postgres)
- **RNF05.5** - Storage distribuído

### RNF06 - Manutenibilidade
- **RNF06.1** - Código TypeScript tipado
- **RNF06.2** - Componentes reutilizáveis (React)
- **RNF06.3** - Separação de concerns (lib, components, utils)
- **RNF06.4** - Documentação inline
- **RNF06.5** - Error logging
- **RNF06.6** - Versionamento (Git + GitHub)

### RNF07 - Disponibilidade
- **RNF07.1** - Uptime mínimo: 99.5%
- **RNF07.2** - Deploy contínuo (Vercel)
- **RNF07.3** - Rollback automático em caso de erro
- **RNF07.4** - Monitoramento de erros

---

## 🏗️ Arquitetura Técnica

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilo:** Tailwind CSS v4.0
- **Componentes:** shadcn/ui
- **Roteamento:** React Router (SPA)
- **Estado:** React Hooks + Context API
- **Animações:** Motion (Framer Motion)
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Forms:** React Hook Form + Zod
- **Toast:** Sonner
- **PWA:** Service Worker + Manifest

### Backend
- **Arquitetura:** Three-tier (Frontend → Server → Database)
- **Runtime:** Deno (Supabase Edge Functions)
- **Web Server:** Hono
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage (buckets privados)
- **Auth:** Supabase Auth (JWT)
- **KV Store:** Tabela `kv_store_0ea22bba` para dados chave-valor

### Infraestrutura
- **Hosting:** Vercel (CDN global, deploy automático)
- **Backend:** Supabase (Database, Auth, Storage, Edge Functions)
- **Streaming:** LiveKit Cloud (transmissões ao vivo)
- **Domain:** volleypro-zw96.vercel.app

### Integrações
- **Autenticação Social:** Google OAuth
- **Imagens:** Unsplash API
- **Streaming:** LiveKit WebRTC
- **Email:** Supabase Email (recuperação de senha)

---

## 📊 Modelo de Dados

### Entidades Principais (KV Store)

#### `user:{userId}`
```typescript
{
  id: string
  email: string
  name: string
  nickname?: string
  userType: 'athlete' | 'team' | 'referee' | 'fan' | 'federation'
  photoUrl?: string
  bannerUrl?: string
  bio?: string
  verified?: boolean
  subscriptionPlan?: 'free' | 'premium' | 'pro' | 'team'
  
  // Atleta
  position?: string
  height?: string
  currentTeam?: string
  currentTeamId?: string
  teamHistory?: string
  achievements?: string[]
  
  // Time
  category?: string
  division?: string
  foundedYear?: string
  
  // Árbitro
  contacts?: {
    email?: string
    whatsapp?: string
    phone?: string
    instagram?: string
  }[]
  
  createdAt: string
  updatedAt: string
}
```

#### `post:{postId}`
```typescript
{
  id: string
  userId: string
  userName: string
  userPhoto?: string
  userType: string
  content: string
  imageUrl?: string
  videoUrl?: string
  reactions: {
    saque: number
    bloqueio: number
    ace: number
    defesa: number
    levantada: number
  }
  reactedBy: {
    [userId]: 'saque' | 'bloqueio' | 'ace' | 'defesa' | 'levantada'
  }
  comments: Array<{
    id: string
    userId: string
    userName: string
    userPhoto?: string
    content: string
    createdAt: string
  }>
  shares: number
  createdAt: string
  updatedAt: string
}
```

#### `tournament:{tournamentId}`
```typescript
{
  id: string
  name: string
  location: string
  arena?: string // Para vôlei de praia
  startDate: string
  endDate: string
  maxTeams: number
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss'
  modalityType: 'indoor' | 'beach'
  organizerId: string
  organizerName: string
  status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
  
  // Vôlei de quadra
  registeredTeams?: Array<{
    id: string
    name: string
    // ...
  }>
  
  // Vôlei de praia
  registeredPlayers?: Array<{
    id: string
    name: string
    partnerId?: string
    // ...
  }>
  
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}
```

#### `live:{liveId}`
```typescript
{
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  creatorId: string
  status: 'scheduled' | 'live' | 'ended'
  scheduledFor?: string
  startedAt?: string
  endedAt?: string
  viewers: number
  peakViewers: number
  livekitRoomName?: string
  createdAt: string
  updatedAt: string
}
```

#### `invitation:{invitationId}`
```typescript
{
  id: string
  teamId: string
  teamName: string
  athleteId: string
  athleteName: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  acceptedAt?: string
  rejectedAt?: string
}
```

#### `message:{conversationId}:{messageId}`
```typescript
{
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}
```

#### `ad_{adId}`
```typescript
{
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  status: 'pending' | 'approved' | 'rejected'
  clicks: number
  createdAt: string
  approvedAt?: string
}
```

---

## 🚀 Fluxos de Uso Principais

### Fluxo 1: Cadastro e Login
1. Usuário acessa a landing page
2. Clica em "Entrar" ou "Cadastrar"
3. Escolhe entre email/senha ou Google OAuth
4. Preenche dados do perfil (nome, tipo de usuário, etc)
5. Upload de foto de perfil (opcional)
6. Redirecionado para feed

### Fluxo 2: Criação de Torneio de Praia
1. Usuário (time ou master) acessa aba "Torneios"
2. Clica em "Criar Torneio"
3. Seleciona modalidade "🏖️ Vôlei de Praia"
4. Preenche: Nome, Local, **Arena (obrigatório)**, Datas, Número de Duplas
5. Seleciona formato de chaveamento
6. Clica em "Criar Torneio"
7. Torneio aparece em "Próximos"

### Fluxo 3: Inscrição Individual em Torneio de Praia
1. Usuário visualiza torneio de praia
2. Clica em "🏖️ Inscrever-se"
3. (Opcional) Seleciona parceiro de dupla
4. Confirma inscrição
5. Aparece na lista de participantes

### Fluxo 4: Transmissão ao Vivo
1. Usuário clica em "Lives" → "Criar Live"
2. Preenche título, descrição, thumbnail
3. Testa câmera e microfone
4. Clica em "Criar Live" (status: agendada)
5. Quando pronto, clica em "Iniciar Live"
6. LiveKit conecta e começa transmissão
7. Espectadores entram, interagem no chat
8. Criador clica em "Finalizar Live"

### Fluxo 5: Convite para Time
1. Time acessa perfil de atleta
2. Clica em "Convocar para o Time"
3. Confirma convite
4. Atleta recebe notificação em "Convocações"
5. Atleta aceita ou recusa
6. Se aceitar, time anterior vai para histórico
7. Time atual atualizado automaticamente

---

## 🎨 Design System

### Cores Principais
- **Primary:** Gradiente vibrante laranja/vermelho
- **Secondary:** Gradiente roxo/pink
- **Background:** Dark com glassmorphism
- **Cards:** Fundo escuro com borda sutil e blur

### Tipografia
- Sistema padrão definido em `globals.css`
- Não usar classes Tailwind de font-size/weight (exceto quando explicitamente necessário)

### Componentes
- **shadcn/ui:** Biblioteca base de componentes
- **Glassmorphism:** backdrop-blur, bordas sutis, transparência
- **Animações:** Transições suaves com Motion
- **Cards:** Elevação com hover, gradientes vibrantes

---

## 🔄 Workflow de Desenvolvimento

### Ambiente de Testes
- **Figma Make:** Ambiente visual para testes rápidos
- **URL:** Interface do Figma com preview em tempo real

### Ambiente de Produção
- **GitHub:** Repositório de código
- **GitHub Desktop:** Ferramenta para commit/push
- **Vercel:** Deploy automático ao fazer push
- **URL:** https://volleypro-zw96.vercel.app

### Processo de Atualização
1. Testar no Figma Make
2. Exportar código
3. Commit via GitHub Desktop
4. Push para repositório
5. Vercel detecta e faz deploy automático
6. Verificar em produção

---

## 📱 Recursos PWA

### Instalação
- **iOS:** Safari → Compartilhar → Adicionar à Tela Inicial
- **Android:** Chrome → Menu → Instalar app
- **Desktop:** Chrome → Ícone de instalação na barra de endereço

### Ícones
- **Tamanhos:** 72, 96, 128, 144, 152, 192, 384, 512
- **Formato:** SVG (adaptativo)
- **Geração:** Script `generate-icons.js`

### Service Worker
- Cache de assets estáticos
- Estratégia: Cache-First para assets, Network-First para API
- Atualização automática em background

---

## 🔐 Variáveis de Ambiente

### Supabase (Backend)
```env
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
SUPABASE_DB_URL=postgresql://[connection-string]
```

### LiveKit (Streaming)
```env
LIVEKIT_API_KEY=[api-key]
LIVEKIT_API_SECRET=[api-secret]
LIVEKIT_URL=wss://[project].livekit.cloud
```

### Frontend (Vercel)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🐛 Tratamento de Erros

### Frontend
- **Error Boundary:** Captura erros de renderização
- **Toast Notifications:** Feedback de erros ao usuário
- **Console Logging:** Logs detalhados para debug
- **Fallback UI:** Componentes de erro amigáveis

### Backend
- **Try/Catch:** Em todas as rotas
- **Error Responses:** JSON com mensagem descritiva e código HTTP
- **Logging:** Console.log com contexto completo
- **Validação:** Campos obrigatórios antes de processar

---

## 📊 Métricas e Analytics

### Métricas Rastreadas
- Usuários cadastrados por tipo
- Posts criados
- Reações e comentários
- Lives criadas e espectadores
- Torneios criados e participantes
- Taxa de conversão de planos
- Clicks em anúncios

### KPIs
- DAU/MAU (Daily/Monthly Active Users)
- Engagement rate
- Tempo médio na plataforma
- Taxa de retenção
- Receita por usuário (ARPU)

---

## 🚀 Roadmap Futuro

### Fase 2 - Melhorias de Curto Prazo
- [ ] Notificações push (PWA)
- [ ] Modo escuro/claro
- [ ] Suporte a mais idiomas
- [ ] Integração com redes sociais (compartilhamento externo)
- [ ] Sistema de badges e conquistas gamificadas
- [ ] Analytics dashboard completo

### Fase 3 - Funcionalidades Avançadas
- [ ] Marketplace de produtos de vôlei
- [ ] Sistema de rankings oficial
- [ ] Integração com federações estaduais
- [ ] API pública para desenvolvedores
- [ ] App nativo (React Native)
- [ ] IA para análise de jogadas (vídeos)

### Fase 4 - Expansão
- [ ] Internacionalização (EN, ES)
- [ ] Parcerias com marcas esportivas
- [ ] Sistema de agenciamento de atletas
- [ ] Plataforma de treinamento online
- [ ] E-sports de vôlei

---

## 📞 Suporte e Contato

### Usuário Master
- **Email:** eri.2113@gmail.com
- **Permissões:** Acesso total, moderação, reset de dados

### Documentação Técnica
- `/guidelines/Guidelines.md` - Diretrizes de desenvolvimento
- Arquivos `.md` na raiz - Instruções específicas
- Comentários inline no código

### Repositório
- **GitHub:** (configurar URL do repositório)
- **Issues:** Para bugs e sugestões
- **Pull Requests:** Contribuições da comunidade

---

## 📄 Anexos

### Documentos Relacionados
- `SISTEMA_TORNEIOS_COMPLETO.md` - Especificação de torneios
- `SISTEMA_MONETIZACAO_COMPLETO.md` - Detalhes de planos
- `SISTEMA_STREAMING_REALTIME.md` - Arquitetura de lives
- `PWA_RESUMO_EXECUTIVO.md` - Visão geral PWA
- `WORKFLOW_PROFISSIONAL.md` - Processo de desenvolvimento
- `TIPOS_DE_CONTA.md` - Detalhamento de perfis

### Tecnologias Utilizadas
```json
{
  "Frontend": ["React 18", "TypeScript", "Vite", "Tailwind CSS v4"],
  "UI": ["shadcn/ui", "Lucide Icons", "Recharts", "Motion"],
  "Backend": ["Supabase", "Deno", "Hono", "PostgreSQL"],
  "Infraestrutura": ["Vercel", "LiveKit", "Google OAuth"],
  "PWA": ["Service Worker", "Manifest", "Workbox"]
}
```

---

**Versão do Documento:** 1.0  
**Data:** 20 de Janeiro de 2025  
**Autor:** Erivaldo de Carvalho Barros  
**Produção:** Equipe VolleyPro  
**Status:** ✅ Em Produção

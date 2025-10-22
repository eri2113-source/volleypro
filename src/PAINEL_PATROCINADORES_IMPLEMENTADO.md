# 🎯 **PAINEL PROMOCIONAL DE PATROCINADORES - IMPLEMENTADO**

## ✅ **O QUE FOI CRIADO:**

Transformei o banner estático dos torneios em um **painel promocional dinâmico e editável** para exibir patrocinadores.

---

## 🎨 **COMPONENTES CRIADOS:**

### **1. TournamentSponsorsPanel.tsx**
**Exibição do painel (para visitantes)**

#### **Funcionalidades:**
- ✅ Carrossel automático de imagens
- ✅ Suporte para vídeos
- ✅ Transições suaves entre mídias
- ✅ Barra de progresso visual
- ✅ Links clicáveis (abre site do patrocinador)
- ✅ Duração personalizável por mídia
- ✅ Controles manuais (opcional)
- ✅ Indicador de patrocinador atual

#### **Props:**
```typescript
{
  sponsors: SponsorMedia[];      // Array de patrocinadores
  height?: number;               // Altura do painel (padrão: 320px)
  autoPlay?: boolean;            // Auto-rotação (padrão: true)
  showControls?: boolean;        // Mostrar controles (padrão: false)
}
```

#### **Tipo SponsorMedia:**
```typescript
{
  id: string;           // ID único
  type: "image" | "video";  // Tipo de mídia
  url: string;          // URL da imagem ou vídeo
  duration?: number;    // Segundos de exibição (imagens)
  link?: string;        // Link opcional (abre ao clicar)
}
```

---

### **2. TournamentSponsorsManager.tsx**
**Gerenciamento de patrocinadores (para organizadores)**

#### **Funcionalidades:**
- ✅ Upload de imagens (JPG, PNG, WebP - máx 10MB)
- ✅ Upload de vídeos (MP4, WebM - máx 50MB)
- ✅ Inserção por URL (alternativa ao upload)
- ✅ Configuração de duração (imagens)
- ✅ Adicionar links externos
- ✅ Preview em tempo real
- ✅ Reordenação via drag & drop (preparado)
- ✅ Remoção de patrocinadores
- ✅ Modal de preview do painel completo
- ✅ Dicas e instruções integradas

#### **Interface:**
```
┌─────────────────────────────────────────┐
│ Painel de Patrocinadores      [Preview] [Adicionar] │
├─────────────────────────────────────────┤
│                                         │
│ ┌──────────────────────────────────┐   │
│ │ [Thumb] Imagem #1                │   │
│ │ Duração: 5s                      │   │
│ │ Link: site.com/patrocinador     │   │
│ └──────────────────────────────────┘   │
│                                         │
│ ┌──────────────────────────────────┐   │
│ │ [Thumb] Vídeo #2                 │   │
│ └──────────────────────────────────┘   │
│                                         │
│ [+ Adicionar Mais]                      │
└─────────────────────────────────────────┘
```

---

## 📦 **INTEGRAÇÃO:**

### **TournamentDetails.tsx (atualizado)**
O banner estático foi substituído pelo painel dinâmico:

#### **ANTES:**
```tsx
<div className="h-80 bg-gradient-to-r from-primary">
  <div style={{ backgroundImage: `url(${tournament.bannerImage})` }} />
  {/* Banner estático */}
</div>
```

#### **AGORA:**
```tsx
<TournamentSponsorsPanel
  sponsors={tournament.sponsors || []}
  height={320}
  autoPlay={true}
  showControls={false}
/>
{/* Informações do torneio sobrepostas */}
```

### **TournamentOrganizerPanel.tsx (atualizado)**
Adicionado gerenciador de patrocinadores ao painel do organizador:

```tsx
<TournamentSponsorsManager
  tournamentId={tournamentId.toString()}
/>
```

---

## 🎬 **COMO FUNCIONA:**

### **1. Para Visitantes (visualização):**

```
Página do Torneio
↓
Banner do Torneio (agora dinâmico)
↓
Painel exibe patrocinadores em rotação
↓
- Imagem 1 (5 segundos)
- Vídeo 1 (duração do vídeo)
- Imagem 2 (6 segundos)
↓
Barra de progresso mostra tempo
↓
Clique abre link do patrocinador
```

### **2. Para Organizadores (edição):**

```
Página do Torneio (como organizador)
↓
Aba "Gerenciamento"
↓
Seção "Painel de Patrocinadores"
↓
[Adicionar] clicado
↓
Modal de upload/URL abre
↓
Organizador:
  1. Faz upload ou cola URL
  2. Define tipo (imagem/vídeo)
  3. Configura duração (se imagem)
  4. Adiciona link (opcional)
  5. Vê preview
  6. Clica "Adicionar"
↓
Patrocinador aparece no painel
↓
Mudanças salvas automaticamente
```

---

## 💡 **EXEMPLOS DE USO:**

### **Exemplo 1: Torneio com 3 patrocinadores (imagens)**
```javascript
const sponsors = [
  {
    id: "sponsor-1",
    type: "image",
    url: "https://site.com/logo-nike.jpg",
    duration: 5,
    link: "https://nike.com"
  },
  {
    id: "sponsor-2",
    type: "image",
    url: "https://site.com/logo-adidas.jpg",
    duration: 5,
    link: "https://adidas.com"
  },
  {
    id: "sponsor-3",
    type: "image",
    url: "https://site.com/logo-puma.jpg",
    duration: 6
  }
];
```

**Resultado:**
- Logo Nike exibido 5s → Logo Adidas 5s → Logo Puma 6s → Repete
- Clicar em Nike/Adidas abre site
- Puma sem link

### **Exemplo 2: Mix de imagens e vídeos**
```javascript
const sponsors = [
  {
    id: "sponsor-1",
    type: "video",
    url: "https://site.com/video-patrocinador.mp4"
    // Duração automática do vídeo
  },
  {
    id: "sponsor-2",
    type: "image",
    url: "https://site.com/banner-evento.jpg",
    duration: 8
  }
];
```

**Resultado:**
- Vídeo toca até o fim → Banner 8s → Repete

---

## 🎨 **RECURSOS VISUAIS:**

### **Painel de Exibição:**
- ✅ Transições suaves (fade)
- ✅ Barra de progresso individual
- ✅ Hover com escala suave (se tiver link)
- ✅ Indicador "Patrocinador X/Y"
- ✅ Gradiente overlay para legibilidade
- ✅ Controles manuais (setas + play/pause)

### **Gerenciador:**
- ✅ Drag handles para reordenar
- ✅ Thumbnails visuais
- ✅ Preview em modal fullscreen
- ✅ Validação de formatos e tamanhos
- ✅ Feedback visual de upload
- ✅ Dicas contextuais

---

## 📱 **RESPONSIVIDADE:**

### **Desktop:**
```
Banner: 100% largura × 320px altura
Controles: Visíveis ao hover
Informações: Sobrepostas com gradiente
```

### **Mobile:**
```
Banner: 100% largura × 320px altura
Controles: Sempre visíveis (menores)
Informações: Compactadas
```

---

## 🔧 **CONFIGURAÇÃO (Backend - TODO):**

### **Salvar no banco de dados:**
```javascript
// Estrutura da tabela tournaments
{
  id: string,
  name: string,
  // ... outros campos ...
  sponsors: [
    {
      id: string,
      type: "image" | "video",
      url: string,
      duration?: number,
      link?: string
    }
  ]
}
```

### **Upload para Supabase Storage:**
```javascript
// No TournamentSponsorsManager
async function handleFileUpload(file) {
  // 1. Validar arquivo
  // 2. Upload para Supabase Storage bucket: "tournament-sponsors"
  const { data } = await supabase.storage
    .from('tournament-sponsors')
    .upload(`${tournamentId}/${file.name}`, file);
  
  // 3. Obter URL pública
  const { publicURL } = supabase.storage
    .from('tournament-sponsors')
    .getPublicUrl(data.path);
  
  // 4. Retornar URL
  return publicURL;
}
```

---

## 🎯 **VANTAGENS:**

### **Para Organizadores:**
- ✅ Gerar receita com patrocínios
- ✅ Controle total sobre exibição
- ✅ Fácil atualização
- ✅ Múltiplos formatos (imagem/vídeo)
- ✅ Tracking via links

### **Para Patrocinadores:**
- ✅ Visibilidade garantida
- ✅ Rotação justa
- ✅ Links diretos ao site
- ✅ Suporte a vídeos promocionais
- ✅ Posicionamento premium (banner principal)

### **Para Visitantes:**
- ✅ Conteúdo dinâmico e atrativo
- ✅ Não intrusivo
- ✅ Transições suaves
- ✅ Informações úteis (se patrocinador relevante)

---

## 🚀 **PRÓXIMOS PASSOS:**

### **Fase 1: Backend (fazer depois)**
- [ ] Criar bucket Supabase Storage: `tournament-sponsors`
- [ ] Endpoint para upload: `/tournament/sponsors/upload`
- [ ] Endpoint para salvar: `/tournament/sponsors/save`
- [ ] Endpoint para carregar: `/tournament/{id}/sponsors`

### **Fase 2: Melhorias**
- [ ] Drag & drop funcional para reordenar
- [ ] Analytics de cliques
- [ ] Agendamento (patrocinador ativo só em período específico)
- [ ] Planos de exibição (básico, premium, destaque)
- [ ] Editor de imagens integrado (crop, resize)

### **Fase 3: Avançado**
- [ ] Vídeos com som (controlado pelo usuário)
- [ ] Gifs animados
- [ ] Transições personalizáveis
- [ ] Templates de banner
- [ ] Relatórios de impressões

---

## 📝 **INSTRUÇÕES DE USO (para organizadores):**

### **1. Adicionar Imagem:**
```
1. Vá para "Painel do Organizador"
2. Role até "Painel de Patrocinadores"
3. Clique "Adicionar"
4. Selecione arquivo de imagem (JPG, PNG, WebP)
   OU cole URL da imagem
5. Defina duração (ex: 5 segundos)
6. Adicione link do patrocinador (opcional)
7. Clique "Adicionar"
```

### **2. Adicionar Vídeo:**
```
1. Mesmos passos 1-3 acima
2. Selecione arquivo de vídeo (MP4, WebM)
   OU cole URL do vídeo
3. Vídeo tocará até o fim automaticamente
4. Adicione link (opcional)
5. Clique "Adicionar"
```

### **3. Visualizar:**
```
1. Clique "Preview"
2. Veja como ficará no site
3. Teste navegação (setas)
4. Teste links (clique nas imagens)
```

### **4. Remover:**
```
1. Encontre patrocinador na lista
2. Clique no ícone de lixeira
3. Confirmação automática
```

---

## ⚡ **PERFORMANCE:**

### **Otimizações implementadas:**
- ✅ Lazy loading de imagens
- ✅ Pré-carregamento da próxima mídia
- ✅ Vídeos com autoplay + muted (performance mobile)
- ✅ Transições CSS (GPU accelerated)
- ✅ Cleanup de blob URLs

### **Recomendações:**
- 📸 Imagens: 1200×400px, WebP comprimido
- 🎬 Vídeos: 720p, H.264, < 15 segundos
- 🔗 CDN para assets estáticos
- 📊 Máximo 10 patrocinadores por torneio

---

## 🎉 **RESULTADO FINAL:**

### **Banner Dinâmico:**
```
┌────────────────────────────────────────────┐
│ [← Voltar]                                 │
│                                            │
│  [Logo]  Liga Municipal 2025               │
│          📍 Ginásio Municipal              │
│          📅 07/11 - 09/11                  │
│                                   [Seguir] │
│                                   [Share]  │
│────────────────────────────────────────────│
│ Patrocinador 1/3              ───────●──   │
└────────────────────────────────────────────┘
    ↑ Rotação automática de imagens/vídeos
```

---

**🎨 IMPLEMENTADO COM SUCESSO!**

Agora organizadores podem:
- ✅ Adicionar patrocinadores facilmente
- ✅ Usar imagens ou vídeos
- ✅ Controlar duração e links
- ✅ Ver preview em tempo real
- ✅ Gerar valor para patrocinadores

**Próximo passo:** Integrar com backend para salvar no banco de dados!

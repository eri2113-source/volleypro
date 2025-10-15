# 🎴 CARD DE PERFIL VERTICAL - TIPO JOGADOR

## ✅ IMPLEMENTAÇÃO COMPLETA

Criei um **card retangular vertical** com a foto **preenchendo todo o espaço** e informações embaixo, igual aos cards de jogadores de futebol/vôlei!

---

## 📐 NOVO DESIGN

### **ESTRUTURA:**

```
┌─────────────────────┐
│                     │
│                     │
│                     │
│       FOTO          │ ← Foto GRANDE preenchendo
│      GRANDE         │   todo o espaço (256px altura)
│    (object-cover)   │   Tipo cartão de jogador
│                     │
│                     │
│                     │
├─────────────────────┤
│   João Silva        │ ← Nome (centralizado)
│   Ponteiro          │ ← Posição (se atleta)
│  🏐 Time Vôlei SP   │ ← Time (se tiver)
│  OU                 │
│  ✨ Disponível      │ ← Se SEM time
└─────────────────────┘
```

---

## 🎨 CARACTERÍSTICAS

### **1. CARD CONTAINER**
- ✅ Border radius: 12px (rounded-xl)
- ✅ Borda: 2px primary/20 → primary/40 no hover
- ✅ Sombra: lg → 2xl no hover
- ✅ Margin: 12px
- ✅ Transição suave 300ms

### **2. ÁREA DA FOTO (Retângulo Vertical)**
- ✅ **Altura:** 256px (h-64) - BEM ALTA!
- ✅ **Largura:** 100% do card
- ✅ **Proporção:** Retângulo vertical tipo cartão
- ✅ **Object-fit:** cover (preenche TODO o espaço)
- ✅ **Hover:** Zoom suave (scale-105) em 500ms
- ✅ **Gradiente overlay:** Preto 60% embaixo (para contraste)

### **3. FOTO**

**Se TEM foto:**
```tsx
<img 
  src={photoUrl} 
  className="object-cover"  // Preenche TODO o espaço!
  style="width: 100%; height: 100%"
/>
```

**Se NÃO tem foto:**
```
┌─────────────────────┐
│ ╔═══════════════╗   │
│ ║  Gradiente    ║   │
│ ║   Azul→Laranja║   │
│ ║               ║   │
│ ║      JS       ║   │ ← Iniciais GRANDES (6xl)
│ ║               ║   │
│ ║               ║   │
│ ╚═══════════════╝   │
└─────────────────────┘
```

### **4. BADGE DE VERIFICADO**
- ✅ Se `verified === true`
- ✅ Posição: Canto superior direito
- ✅ Ícone: CheckCircle2
- ✅ Background: Primary azul
- ✅ Sombra

### **5. SEÇÃO DE INFORMAÇÕES**
- ✅ Background: Branco (dark: card)
- ✅ Padding: 16px (p-4)
- ✅ Espaçamento: 8px entre itens (space-y-2)
- ✅ Tudo centralizado

### **6. NOME**
- ✅ Font: Semibold
- ✅ Alinhamento: Centro
- ✅ Truncado se muito grande
- ✅ Hover: Fica azul (primary)

### **7. POSIÇÃO (se atleta)**
- ✅ Font: Small (sm)
- ✅ Cor: Muted foreground
- ✅ Centro
- ✅ Só aparece se for atleta E tiver posição

### **8. TIME OU DISPONÍVEL (se atleta)**

**Se TEM time:**
```
🏐 Time Vôlei SP
```
- Cor: Primary (azul)
- Font: Medium
- Emoji de vôlei

**Se NÃO tem time:**
```
✨ Disponível
```
- Cor: Secondary (laranja)
- Font: Medium
- Emoji de estrela

### **9. TIPO DE CONTA (se não atleta)**

**Se for Time:**
```
⚡ Time
```

**Se for Fã:**
```
🎉 Fã/Torcedor
```

---

## 📏 DIMENSÕES EXATAS

```css
Card Total:
- Largura: 100% (com margin 12px)
- Border radius: 12px (rounded-xl)
- Borda: 2px (border-2)
- Shadow: lg → 2xl no hover

Área da Foto:
- Altura: 256px (h-64) ← GRANDE!
- Largura: 100%
- Object-fit: cover ← Preenche TODO espaço
- Overflow: hidden

Gradiente Overlay:
- Altura: 96px (h-24)
- Posição: Bottom
- Cor: from-black/60 to-transparent

Badge Verificado:
- Posição: top-3 right-3
- Padding: 6px (p-1.5)
- Icon: 20px (h-5 w-5)

Seção Info:
- Padding: 16px (p-4)
- Space-y: 8px (space-y-2)

Textos:
- Nome: base (16px), semibold
- Posição: sm (14px), muted
- Time/Disponível: sm (14px), medium
- Tipo: sm (14px), muted
```

---

## 🎨 PALETA DE CORES

```css
Card:
- Borda: primary/20 → primary/40 (hover)
- Background info: white / card (dark)

Foto (se não tem):
- Gradiente: from-primary to-secondary
- Iniciais: text-white, text-6xl

Overlay:
- from-black/60 to-transparent
- Só embaixo (h-24)

Badge Verificado:
- Background: primary
- Text: white
- Shadow: lg

Textos:
- Nome: sidebar-foreground → primary (hover)
- Posição: muted-foreground
- Time: primary (azul)
- Disponível: secondary (laranja)
- Tipo conta: muted-foreground

Hover effects:
- Borda: opacity aumenta
- Shadow: lg → 2xl
- Foto: scale 105%
- Nome: foreground → primary
```

---

## ✨ EFEITOS INTERATIVOS

### **Hover no Card:**
```css
- Border: primary/20 → primary/40
- Shadow: lg → 2xl
- Foto: scale(1) → scale(1.05) [zoom suave]
- Nome: foreground → primary
- Cursor: pointer
- Transições:
  - Card: 300ms
  - Foto: 500ms (mais lento, mais suave)
```

### **Click:**
```javascript
onClick={onProfileClick}
// Abre "Meu Perfil"
```

---

## 🧪 TESTE AGORA (2 MINUTOS)

### **Passo 1: Recarregar**
```
F5 (recarrega a página)
```

### **Passo 2: Verificar Sidebar**

**DEVE VER:**

```
┌─────────────────────────┐
│  VolleyPro 🏐          │
├─────────────────────────┤
│ ┏━━━━━━━━━━━━━━━━━━━┓ │
│ ┃                   ┃ │
│ ┃                   ┃ │
│ ┃      FOTO         ┃ │ ← Foto GRANDE
│ ┃     GRANDE        ┃ │   Retângulo vertical
│ ┃   (ou iniciais)   ┃ │   256px de altura
│ ┃                   ┃ │
│ ┃                   ┃ │
│ ┣━━━━━━━━━━━━━━━━━━━┫ │
│ ┃   João Silva      ┃ │ ← Nome
│ ┃   Ponteiro        ┃ │ ← Posição
│ ┃ 🏐 Time Vôlei SP  ┃ │ ← Time
│ ┃ OU                ┃ │
│ ┃ ✨ Disponível     ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━┛ │
├─────────────────────────┤
│  Menu Principal         │
```

---

### **Passo 3: Verificar COM Foto**

**Se você tem foto de perfil:**

- [ ] Foto **preenche TODO o espaço** (não tem bordas brancas)
- [ ] Foto está em modo **cover** (não distorcida)
- [ ] Gradiente escuro embaixo da foto
- [ ] Badge de verificado (se aplicável)

---

### **Passo 4: Verificar SEM Foto**

**Se você NÃO tem foto ainda:**

- [ ] Fundo gradiente azul → laranja
- [ ] Iniciais GRANDES no centro (ex: "JS")
- [ ] Iniciais brancas
- [ ] Fundo vibrante e bonito

---

### **Passo 5: Testar Hover**

**Passe o mouse sobre o card:**

- [ ] Borda fica mais forte (azul)
- [ ] Sombra aumenta
- [ ] Foto dá zoom suave (scale 105%)
- [ ] Nome fica azul
- [ ] Cursor vira mãozinha

---

### **Passo 6: Verificar Informações**

**ATLETA COM TIME:**
```
João Silva
Ponteiro
🏐 Time Vôlei SP
```

**ATLETA SEM TIME:**
```
João Silva
Ponteiro
✨ Disponível
```

**TIME:**
```
Vôlei SP
⚡ Time
```

**FÃ/TORCEDOR:**
```
João Torcedor
🎉 Fã/Torcedor
```

---

## 🔍 DETALHES TÉCNICOS

### **1. Estrutura HTML:**

```tsx
<div className="card-container">
  {/* Photo area - vertical rectangle */}
  <div className="photo-area h-64">
    {photoUrl ? (
      <img src={photoUrl} className="object-cover" />
    ) : (
      <div className="gradient-fallback">
        <span className="initials">{initials}</span>
      </div>
    )}
    
    {/* Gradient overlay */}
    <div className="overlay-bottom" />
    
    {/* Verified badge */}
    {verified && <CheckCircle2 />}
  </div>
  
  {/* Info section */}
  <div className="info-section">
    <h3>Name</h3>
    {position && <p>Position</p>}
    {team ? <p>🏐 Team</p> : <p>✨ Disponível</p>}
  </div>
</div>
```

### **2. CSS Aplicado:**

```css
Card Container:
- m-3 mb-4: Margins
- rounded-xl: Border radius 12px
- overflow-hidden: Esconde overflow
- cursor-pointer: Mão ao hover
- group: Permite hover effects
- shadow-lg → hover:shadow-2xl
- border-2 border-primary/20 → hover:border-primary/40
- transition-all duration-300

Photo Area:
- relative: Para overlay absoluto
- h-64: Altura 256px (ALTO!)
- bg-gradient-to-br: Gradiente fallback
- overflow-hidden: Para zoom effect

Image (se tem foto):
- absolute inset-0: Preenche tudo
- w-full h-full: 100% width e height
- object-cover: Preenche espaço SEM distorcer
- group-hover:scale-105: Zoom no hover
- transition-transform duration-500: Suave

Fallback (se não tem foto):
- absolute inset-0
- bg-gradient-to-br from-primary to-secondary
- flex items-center justify-center
- text-6xl: Iniciais GRANDES

Overlay Bottom:
- absolute inset-x-0 bottom-0
- h-24: Altura 96px
- bg-gradient-to-t from-black/60 to-transparent

Verified Badge:
- absolute top-3 right-3
- bg-primary text-white
- rounded-full p-1.5
- shadow-lg

Info Section:
- bg-white dark:bg-card
- p-4: Padding 16px
- space-y-2: Gap 8px entre elementos

Name:
- font-semibold
- text-center
- truncate
- group-hover:text-primary

Position:
- text-sm
- text-center
- text-muted-foreground
- truncate

Team/Available:
- text-sm
- text-center
- font-medium
- truncate
- Team: text-primary
- Available: text-secondary
```

---

## 📊 COMPARAÇÃO

### **VERSÃO ANTERIOR (Banner Horizontal):**
```
✗ Banner horizontal
✗ Foto pequena circular
✗ Muitas informações
✗ Estatísticas
```

### **VERSÃO NOVA (Card Vertical):**
```
✓ Card retangular VERTICAL
✓ Foto GRANDE preenchendo tudo
✓ Tipo cartão de jogador
✓ Informações essenciais
✓ "Disponível" se sem time
✓ Muito mais clean!
```

---

## 🎯 LÓGICA DE EXIBIÇÃO

### **ATLETA:**

```typescript
// Nome
displayName

// Posição (se tiver)
if (position) → "Ponteiro"

// Time ou Disponível
if (currentTeam) → "🏐 Time Vôlei SP"
else → "✨ Disponível"
```

### **TIME:**

```typescript
// Nome do time
displayName

// Tipo
"⚡ Time"
```

### **FÃ/TORCEDOR:**

```typescript
// Nome
displayName

// Tipo
"🎉 Fã/Torcedor"
```

---

## 🔄 ATUALIZAÇÃO EM TEMPO REAL

### **Evento "profileUpdated":**

Quando você **edita o perfil**:

```
1. Salva alterações
   ↓
2. Dispara evento "profileUpdated"
   ↓
3. Sidebar escuta evento
   ↓
4. Recarrega perfil
   ↓
5. Card atualiza INSTANTANEAMENTE! ✨
```

**Campos que atualizam:**
- ✅ Foto (photoUrl)
- ✅ Nome (name/nickname)
- ✅ Posição (position)
- ✅ Time (currentTeam)
- ✅ Verificado (verified)

---

## 💡 OBJECT-COVER EXPLICADO

### **O que é object-cover?**

```css
object-cover: Preenche TODO o container SEM distorcer
```

**Exemplo:**

**Foto original: 800×600 (horizontal)**  
**Container: 240×256 (vertical)**

```
COM object-cover:
┌─────────┐
│ [FOTO]  │ ← Centraliza e corta
│ [CORTA] │   Mostra parte central
│ [CENT]  │   SEM distorcer
└─────────┘

SEM object-cover (contain):
┌─────────┐
│         │ ← Espaços vazios
│ [FOTO]  │   Foto inteira
│         │   mas pequena
└─────────┘

SEM object-cover (fill):
┌─────────┐
│ [FOTO]  │ ← Distorcida!
│ [DIST]  │   Esticada
│ [ORCE]  │   Horrível
└─────────┘
```

**object-cover é PERFEITO para cards de perfil!**

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### **Visual:**
- [ ] Card retangular vertical
- [ ] Foto preenche TODO o espaço
- [ ] Foto NÃO está distorcida
- [ ] Gradiente escuro embaixo da foto
- [ ] Badge verificado (se aplicável)
- [ ] Nome centralizado
- [ ] Posição visível (se atleta)
- [ ] Time ou "Disponível" (se atleta)
- [ ] Borda azul sutil

### **Interatividade:**
- [ ] Hover aumenta sombra
- [ ] Hover fortalece borda
- [ ] Hover zoom na foto (suave)
- [ ] Hover nome fica azul
- [ ] Cursor vira mãozinha
- [ ] Click abre "Meu Perfil"

### **Responsividade:**
- [ ] Card se ajusta ao container
- [ ] Foto sempre preenche
- [ ] Textos truncam se muito grandes
- [ ] Funciona em diferentes larguras

---

## 🆘 TROUBLESHOOTING

### **PROBLEMA: Foto distorcida**

**Causa:** object-fit não está sendo aplicado

**Solução:**
```tsx
// Verificar se className está correto:
className="... object-cover ..."
```

### **PROBLEMA: Foto não preenche**

**Causa:** Width ou height não está 100%

**Solução:**
```tsx
// Verificar classes:
className="absolute inset-0 w-full h-full object-cover"
```

### **PROBLEMA: Card muito alto/baixo**

**Ajustar altura da foto:**
```tsx
// Atual: h-64 (256px)
// Mais baixo: h-56 (224px)
// Mais alto: h-72 (288px)

<div className="... h-64 ...">
```

### **PROBLEMA: Iniciais muito grandes**

**Ajustar tamanho:**
```tsx
// Atual: text-6xl
// Menor: text-5xl ou text-4xl
// Maior: text-7xl ou text-8xl

<span className="... text-6xl ...">
```

### **PROBLEMA: "Disponível" não aparece**

**Verificar:**
1. Usuário é atleta?
2. Campo `currentTeam` está null/vazio?

**Console (F12):**
```javascript
// Procure:
📊 Perfil carregado na sidebar: {
  userType: "athlete",
  currentTeam: null  // ← Se null, deve mostrar "Disponível"
}
```

---

## 🎨 CUSTOMIZAÇÕES POSSÍVEIS

### **Alterar altura do card:**

```tsx
// Atual: h-64 (256px)
<div className="... h-64 ...">

// Mais compacto: h-56 (224px)
<div className="... h-56 ...">

// Mais alto: h-72 (288px)
<div className="... h-72 ...">

// Muito alto: h-80 (320px)
<div className="... h-80 ...">
```

### **Remover gradiente overlay:**

```tsx
// Deletar ou comentar:
<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
```

### **Mudar cores do gradiente fallback:**

```tsx
// Atual:
className="bg-gradient-to-br from-primary to-secondary"

// Só azul:
className="bg-gradient-to-br from-primary to-primary"

// Escuro:
className="bg-gradient-to-br from-slate-800 to-slate-900"
```

---

## 📐 PROPORÇÕES RECOMENDADAS

### **Para fotos de perfil:**

**Ideal:**
- 1:1 (quadrada) → object-cover corta perfeitamente
- 3:4 (vertical) → se ajusta bem

**Funciona:**
- 4:3 (horizontal) → object-cover centraliza e corta
- 16:9 (horizontal) → object-cover corta mais

**Recomendação:**
```
Foto ideal: 800×800 (quadrada)
OU
Foto ideal: 600×800 (vertical)

Resolução mínima: 480×640
Formato: JPG, PNG, WEBP
Tamanho: < 5MB
```

---

## 🚀 PRÓXIMOS PASSOS

1. **TESTE AGORA!**
   - F5 → Veja o card vertical
   - Confira se foto preenche tudo
   - Veja "Disponível" se não tem time

2. **Adicione Foto (se não tem):**
   - Click no card
   - "Editar Perfil"
   - "Adicionar Foto"
   - Escolha foto legal
   - Salve

3. **Teste Hover:**
   - Passe mouse sobre card
   - Foto dá zoom suave
   - Borda fica azul
   - Sombra aumenta

4. **Me Avise:**
   - ✅ Card ficou perfeito?
   - 📸 Foto preenche tudo?
   - ✨ "Disponível" aparece?
   - 🎨 Quer ajustar algo?

---

## 🎉 RESULTADO FINAL

Quando tudo funcionar:

✅ **Card retangular VERTICAL tipo jogador**  
✅ **Foto GRANDE preenchendo TODO o espaço**  
✅ **Object-cover (sem distorção)**  
✅ **Gradiente overlay elegante**  
✅ **Nome + Posição + Time centralizados**  
✅ **"✨ Disponível" se sem time**  
✅ **Badge de verificado**  
✅ **Hover zoom suave na foto**  
✅ **Borda e sombra no hover**  
✅ **Click abre perfil**  
✅ **Design profissional de cartão de atleta!** 🎴✨  

---

**🎴 TESTE O CARD VERTICAL e me conte!**

Foto preenche todo o espaço? 📸  
Aparece "Disponível" se sem time? ✨  
Ficou igual à imagem de referência? 🎯  
Quer ajustar alguma coisa? 🔧

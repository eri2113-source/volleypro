# 🎨 IDENTIDADE VISUAL - VOLLEYPRO

## 📌 NOME OFICIAL

**VolleyPro** (tudo junto, sem espaço)

- ✅ **CORRETO**: VolleyPro
- ❌ **ERRADO**: Volley Pro, VolleyPRO, volleypro, Volleypro

---

## 🎨 LOGO

### Composição
O logo é composto por **2 elementos principais**:

#### 1. **Ícone - Bola de Vôlei**
- Imagem real de bola de vôlei Mikasa
- Formato: Círculo recortado (circle clip-path)
- Tamanhos:
  - **Full**: 56x56px
  - **Compact**: 40x40px
  - **Icon**: 48x48px

#### 2. **Texto "VolleyPro"**
- Dividido em duas partes com gradientes distintos:

**"Volley"** (Primeira parte):
- Gradiente: Linear 135deg
- Cores: `#0066ff` → `#0052cc` (Azul energético)
- Font: Black (900)
- Tamanho: 3xl (30px) na versão full, 2xl (24px) na compact

**"Pro"** (Segunda parte):
- Gradiente: Linear 135deg
- Cores: `#FFC72C` → `#ff6b35` (Amarelo/Laranja)
- Font: Black (900)
- Tamanho: 3xl (30px) na versão full, 2xl (24px) na compact

#### 3. **Tagline** (apenas na versão full)
- Texto: "Rede Social do Vôlei"
- Tamanho: 11px
- Estilo: Uppercase, letra espaçada (tracking-widest)
- Cor: text-muted-foreground

---

## 🎨 PALETA DE CORES

### **Cores Principais**

#### Azul Energético (Primary)
```
--primary: #0066ff
--primary-foreground: #ffffff
```
- Usado em: Botões principais, links, headers, gradientes
- RGB: rgb(0, 102, 255)
- HSL: hsl(216, 100%, 50%)

#### Laranja (Secondary/Accent)
```
--secondary: #ff6b35
--accent: #ff6b35
--secondary-foreground: #ffffff
```
- Usado em: CTAs secundárias, destaques, gradientes
- RGB: rgb(255, 107, 53)
- HSL: hsl(16, 100%, 60%)

#### Amarelo Dourado
```
#FFC72C
```
- Usado em: Gradientes do "Pro", badges premium
- RGB: rgb(255, 199, 44)

---

### **Cores de Suporte**

#### Background
```
Light: #f8fafc (Slate 50)
Dark: #0a0e1a (Navy escuro)
```

#### Foreground (Texto)
```
Light: #0f172a (Slate 900)
Dark: #f8fafc (Slate 50)
```

#### Cards
```
Light: #ffffff
Dark: #111827
```

#### Muted (Secundário)
```
Light: #f1f5f9 (Slate 100)
Dark: #1e293b (Slate 800)
```

#### Border
```
Light: #e2e8f0 (Slate 200)
Dark: #1e293b (Slate 800)
```

#### Destructive (Erros)
```
--destructive: #ef4444 (Red 500)
--destructive-foreground: #ffffff
```

---

## 🌈 GRADIENTES ESPECIAIS

### **Gradiente Header Principal**
```css
background: linear-gradient(to right, #0066ff, #0052cc, #0066ff);
```
- Usado em: Barra superior de navegação

### **Gradiente Botões Premium**
```css
background: linear-gradient(to right, #0066ff, #0052cc);
```
- Usado em: CTAs principais, botões de destaque

### **Gradiente Cards Destaque**
```css
background: linear-gradient(to bottom right, #0066ff, #ff6b35);
```
- Usado em: Headers de sidebar, cards especiais

### **Gradiente Badge Master**
```css
background: linear-gradient(to right, #fbbf24, #f59e0b);
```
- Usado em: Badge do usuário MASTER

---

## 📐 TIPOGRAFIA

### **Font Weights**
```
--font-weight-normal: 400
--font-weight-medium: 500
Black (em logos): 900
```

### **Font Sizes (Padrão)**
```
h1: 2xl (1.5rem / 24px)
h2: xl (1.25rem / 20px)
h3: lg (1.125rem / 18px)
h4: base (1rem / 16px)
p: base (1rem / 16px)
button: base (1rem / 16px)
```

### **Line Height**
- Padrão: 1.5

---

## 🎯 VARIANTES DO LOGO

### **1. Full Logo**
```tsx
<Logo />
```
- Ícone (56x56px) + Texto completo + Tagline
- Uso: Landing page, páginas de apresentação

### **2. Compact Logo**
```tsx
<Logo variant="compact" />
```
- Ícone (40x40px) + Texto sem tagline
- Uso: Barra de navegação, sidebar, headers

### **3. Icon Only**
```tsx
<Logo variant="icon" />
```
- Apenas ícone (48x48px)
- Uso: Favicon, notificações, loading screens

---

## 🌙 MODO ESCURO (DARK MODE)

### **Cores Adaptadas**

```css
.dark {
  --background: #0a0e1a;
  --foreground: #f8fafc;
  --card: #111827;
  --primary: #3b82f6; /* Azul mais claro para contraste */
  --muted: #1e293b;
  --border: #1e293b;
}
```

**Nota**: O logo mantém os mesmos gradientes em ambos os modos para consistência da marca.

---

## 🎨 APLICAÇÕES PRÁTICAS

### **Botão Primário**
```tsx
className="bg-gradient-to-r from-primary to-[#0052cc] hover:from-primary/90 hover:to-[#0052cc]/90"
```

### **Card com Borda Destacada**
```tsx
className="border-l-4 border-l-primary hover:shadow-xl transition-all"
```

### **Badge Verificado**
```tsx
className="bg-primary/10 text-primary border-primary/20"
```

### **Avatar com Gradiente**
```tsx
className="bg-gradient-to-br from-primary to-secondary"
```

---

## 📏 RADIUS (CANTOS ARREDONDADOS)

```
--radius: 0.75rem (12px)
--radius-sm: 8px
--radius-md: 10px
--radius-lg: 12px
--radius-xl: 16px
```

---

## ✨ EFEITOS VISUAIS

### **Shadow para Logo com Brilho**
```tsx
textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)'
filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))'
```

### **Shadow para Cards**
```
hover:shadow-xl
shadow-2xl shadow-primary/50
```

### **Pattern de Background**
```css
background-image: url("data:image/svg+xml,...") /* Bolinhas de vôlei */
opacity: 0.05
```

---

## 📱 RESPONSIVIDADE

### **Breakpoints**
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### **Logo Responsivo**
- Mobile: Compact variant (ícone + texto menor)
- Tablet+: Full variant (ícone + texto + tagline)

---

## 🎯 CHECKLIST DE USO

### **✅ Sempre use:**
- Nome "VolleyPro" (tudo junto)
- Gradientes oficiais nas cores corretas
- Font Black (900) para o nome
- Ícone circular da bola de vôlei

### **❌ Nunca use:**
- "Volley Pro" (com espaço)
- Cores fora da paleta oficial
- Logo esticado ou distorcido
- Ícone em formato quadrado

---

## 📦 ARQUIVOS

### **Logo Components**
```
/components/Logo.tsx
```

### **Imagem da Bola**
```
figma:asset/67bd6f31bc6e950b2dd7989fff8ddb235a0b77a2.png
```

### **CSS Global**
```
/styles/globals.css
```

---

## 🎨 IDENTIDADE EM RESUMO

**VolleyPro** é uma marca:
- ⚡ **Energética** (azul vibrante #0066ff)
- 🔥 **Apaixonada** (laranja intenso #ff6b35)
- 🏐 **Autêntica** (bola de vôlei real)
- 💪 **Profissional** (tipografia bold, layout clean)
- 🌟 **Moderna** (gradientes, animações suaves)

---

**🎉 MARCA REGISTRADA: VolleyPro™ - A Rede Social do Vôlei** 🏐

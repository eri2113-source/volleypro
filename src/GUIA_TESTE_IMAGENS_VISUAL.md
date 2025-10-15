# 🎨 GUIA: TESTE VISUAL DE IMAGENS NAS LIVES

## 📋 CHECKLIST RÁPIDO

### **1. ABRA O VOLLEYPRO**
```
URL: https://seu-volleypro.vercel.app
```

### **2. FAÇA LOGIN**
```
Use qualquer conta (Google ou email/senha)
```

### **3. VÁ EM "LIVES"**
```
Barra superior → Clique em "Lives" (ícone📻)
```

---

## 🎨 O QUE VOCÊ DEVE VER

### **Cards de Live (ANTES de clicar):**

```
┌─────────────────────────────┐
│                             │
│  🎨 FUNDO COM GRADIENTE    │
│     (azul, laranja,         │
│      roxo ou verde)         │
│                             │
│  📻 Ícone Radio grande     │
│     (semi-transparente)     │
│                             │
│  [🔴 AO VIVO] (badge)      │
│                             │
│  👁️ 123 (viewers)          │
│                             │
└─────────────────────────────┘
│  📷 Foto do criador        │
│  Nome do criador            │
│                             │
│  Título da Live             │
│  Descrição...               │
│                             │
│  [Assistir] [Share] [...]   │
└─────────────────────────────┘
```

### **🌈 CORES DOS GRADIENTES:**

Cada live terá UMA destas cores:

1. **Azul Energético** - `#0066ff` gradiente
2. **Laranja Vibrante** - `#ff6b35` gradiente  
3. **Roxo Moderno** - roxo → rosa gradiente
4. **Verde Fresco** - verde → esmeralda gradiente

---

## 🧪 TESTE 1: VER LIVES EXISTENTES

```bash
1. Abrir página de Lives
2. ✅ DEVE VER: Cards com cores vibrantes
3. ✅ DEVE VER: Ícone de radio no centro
4. ✅ DEVE VER: Badge "AO VIVO" ou "Programada"
5. ✅ DEVE VER: Contador de viewers (se live)

❌ NÃO DEVE VER: Tudo preto/vazio
```

---

## 🧪 TESTE 2: CRIAR LIVE NOVA

```bash
1. Clicar "Iniciar Transmissão"
2. Preencher:
   - Título: "Teste Visual"
   - Descrição: "Testando as cores"
   - Thumbnail: DEIXAR VAZIO
3. Clicar "Criar Live"
4. ✅ Card aparece COM GRADIENTE COLORIDO
5. ✅ Ícone de radio visível
6. ✅ Badge "AO VIVO"
```

---

## 🧪 TESTE 3: WEBCAM (CRIADOR)

```bash
1. Criar live (passo anterior)
2. Clicar no card da live
3. Player abre
4. ✅ Navegador pede permissão de câmera
5. Clicar "Permitir"
6. ✅ SUA WEBCAM APARECE!
7. ✅ Vídeo HD ao vivo
8. ✅ Controles [📹] [🎤] funcionam
9. ✅ Badge "🔴 AO VIVO"
```

---

## 🧪 TESTE 4: CONSISTÊNCIA

```bash
1. Olhar ID de uma live específica
2. Ver a cor do gradiente
3. Recarregar página
4. ✅ MESMA live = MESMA cor
5. ✅ Não muda aleatoriamente
```

---

## ❓ SE NÃO APARECER NADA

### **Console do Navegador (F12):**

1. Abrir console (F12 ou Ctrl+Shift+I)
2. Ir na aba "Console"
3. Procurar por:
   - ✅ `📺 Lives carregadas: X`
   - ❌ Erros vermelhos

### **Verificar Rede:**

1. F12 → Aba "Network"
2. Recarregar página
3. Procurar requisições falhando
4. Ver se há erro 404, 500, CORS, etc

---

## 🔍 DEBUG MANUAL

### **Abrir Console e Digitar:**

```javascript
// Ver lives carregadas
console.log(localStorage.getItem('volleypro_lives'));

// Ver se está autenticado
console.log(localStorage.getItem('volleypro_token'));

// Limpar cache (se necessário)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 📸 O QUE ENVIAR SE NÃO FUNCIONAR

1. **Screenshot da página de Lives**
2. **Screenshot do Console (F12)**
3. **Navegador que está usando** (Chrome/Firefox/Safari)
4. **Sistema Operacional** (Windows/Mac/Linux)
5. **URL que está acessando**

---

## ✅ SE FUNCIONAR

Você vai ver:
- ✅ Cards coloridos (nunca preto)
- ✅ Gradientes bonitos
- ✅ Ícones visíveis
- ✅ Webcam funciona (se você criou a live)
- ✅ Visual profissional

---

## 🎯 RESULTADO ESPERADO

### **Feed de Lives:**
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 🟦 Azul │ │ 🟧 Lara  │ │ 🟪 Roxo │
│          │ │   nja    │ │          │
│ 📻      │ │  📻     │ │  📻     │
│ [VIVO]   │ │ [VIVO]   │ │ [VIVO]   │
└──────────┘ └──────────┘ └──────────┘
```

Colorido, vibrante, profissional! 🎨✨

---

**Data:** 12/10/2025  
**Versão:** React (Vite) + Supabase  
**Status:** 🧪 AGUARDANDO TESTE

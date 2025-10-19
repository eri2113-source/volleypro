# 🔥 CORREÇÃO DE 1 LINHA - DEPLOY JÁ!

## 🐛 BUG ENCONTRADO

O script verificava `figma.com` mas o Figma Make usa `figma.site`!

URL real: `52755640.figma.site` ← NÃO era detectado!

## ✅ CORREÇÃO (1 LINHA)

**Arquivo**: `/public/figma-blocker.js`
**Linha 20**: Adicionada verificação `figma.site`

```javascript
// ANTES (linha 18-22):
const isFigmaMake = 
  hostname.includes('figma.com') ||      // ❌ Só verificava .com
  hostname.includes('fig.ma') ||
  hostname.includes('make.fig') ||
  (hostname.includes('localhost') && !href.includes('vercel.app'));

// AGORA (linha 18-23):
const isFigmaMake = 
  hostname.includes('figma.com') ||
  hostname.includes('figma.site') ||     // ✅ ADICIONADO!
  hostname.includes('fig.ma') ||
  hostname.includes('make.fig') ||
  (hostname.includes('localhost') && !href.includes('vercel.app'));
```

## 🚀 DEPLOY - 3 PASSOS

### 1. GitHub Desktop
```
Ver: 1 arquivo modificado
✅ public/figma-blocker.js
```

### 2. Commit + Push
```
Mensagem: 🔥 Corrigir detecção .figma.site no bloqueio
```

### 3. Aguardar
```
3 minutos → Deploy automático Vercel
```

## 🧪 TESTAR

1. **Aba anônima** → Figma Make
2. ✅ **AGORA BLOQUEIA!**
3. ✅ Countdown 3 segundos
4. ✅ Redireciona

## 📊 RESULTADO

**ANTES**: ❌ Liberava (bug)
**AGORA**: ✅ Bloqueia (correto)

---

**1 LINHA = PROBLEMA RESOLVIDO!** ⚡

**FAZER DEPLOY AGORA!** 🚀

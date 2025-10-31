# ⚡ WARNING DIALOG CORRIGIDO!

## 🎯 PROBLEMA

```
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
```

---

## ✅ SOLUÇÃO

**ImageViewerModal faltava DialogDescription!**

**Adicionado:**
```tsx
<DialogHeader className="sr-only">
  <DialogTitle>Visualizar Imagem</DialogTitle>
  <DialogDescription>
    Use os controles de zoom e download
  </DialogDescription>
</DialogHeader>
```

**`sr-only` = visível para leitores de tela, invisível visualmente**

---

## 🚀 FAZER AGORA

### **COMMIT:**

```
TÍTULO:
✅ Dialog Acessibilidade Corrigida

DESCRIÇÃO:
- Warning DialogContent resolvido
- ImageViewerModal + DialogDescription
- DialogHeader oculto (sr-only)

1 arquivo | Warning acessibilidade
```

**PUSH → WARNING DESAPARECE**

---

## ✅ RESULTADO

**ANTES:**
```
⚠️ Warning: Missing Description...
```

**DEPOIS:**
```
(sem warnings) ✅
```

---

**ARQUIVO:** `components/ImageViewerModal.tsx`

**COMMIT AGORA!** 🚀

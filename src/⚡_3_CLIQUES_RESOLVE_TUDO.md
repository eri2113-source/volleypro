# ⚡ 3 CLIQUES PARA RESOLVER O ERRO LED

## 🎯 O QUE FAZER AGORA

O erro `failed to fetch` no painel LED acontece porque o código em **produção** (voleypro.net) ainda está desatualizado.

A correção JÁ ESTÁ PRONTA aqui no Figma Make. Só precisa aplicar em produção:

---

## ✅ PASSO 1: EXPORTAR
**No Figma Make (esta janela):**
1. Clique em **"Export"** (botão no topo)
2. Aguarde download do ZIP
3. Descompacte no projeto local

⏱️ **30 segundos**

---

## ✅ PASSO 2: COMMIT
**No GitHub Desktop:**
1. Abra o GitHub Desktop
2. Você verá **2 arquivos** modificados
3. Mensagem do commit:
   ```
   Corrigir erro LED - importações
   ```
4. Clique **"Commit to main"**

⏱️ **1 minuto**

---

## ✅ PASSO 3: PUSH
**No GitHub Desktop:**
1. Clique **"Push origin"** (botão azul no topo)
2. Aguarde a barra de progresso completar
3. Aguarde **2-3 minutos** para deploy na Vercel

⏱️ **3 minutos**

---

## 🎉 PRONTO!

Teste em: **https://voleypro.net**
- Torneios → Painel LED → Upload de fotos

**Deve funcionar sem erros!** ✅

---

## 🆘 SE NÃO FUNCIONAR

1. **Limpe o cache** do navegador:
   - Chrome: `Ctrl + Shift + Delete`
   - Marque "Cache" e "Última hora"

2. **Hard reload**:
   - Chrome: `Ctrl + Shift + R`
   - Firefox: `Ctrl + F5`

3. **Aguarde mais 2 minutos** - deploy pode demorar

---

## 📁 O QUE FOI CORRIGIDO

```diff
❌ ANTES: const { projectId } = await import('../utils/supabase/info');
✅ DEPOIS: import { projectId } from "../utils/supabase/info";
```

Arquivos modificados:
- `components/Tournaments.tsx`
- `components/LivesDiagnostic.tsx`

---

**⏰ TEMPO TOTAL: 5 MINUTOS**

**🚀 AÇÃO: EXPORTAR → COMMIT → PUSH**

# 🗑️ DELETAR ALPHA SPORTS - 4 CLIQUES

## 🎯 PROBLEMA

Alpha Sports **NÃO ESTÁ NO CÓDIGO** ✅  
Alpha Sports **ESTÁ NO BANCO DE DADOS** ❌

**Por isso ainda aparece no site!**

---

## ✅ SOLUÇÃO RÁPIDA (2 MINUTOS)

### 1️⃣ ABRA SUPABASE

**Link:** https://supabase.com/dashboard

- Entre com sua conta
- Selecione o projeto **VolleyPro**

---

### 2️⃣ ABRA O SQL EDITOR

**Menu lateral esquerdo:**
- Clique em: **SQL Editor** (ícone de </> )

---

### 3️⃣ COLE E EXECUTE

**Cole este código:**

```sql
-- Deletar Alpha Sports
DELETE FROM kv_store_0ea22bba 
WHERE value::text ILIKE '%Alpha Sports%';

-- Verificar
SELECT COUNT(*) FROM kv_store_0ea22bba 
WHERE value::text ILIKE '%Alpha Sports%';
```

**Clique em:** `RUN` (botão azul no canto superior direito)

---

### 4️⃣ CONFIRME

**Resultado esperado:**
```
COUNT
-----
  0
```

Se mostrar **0** = Alpha Sports foi deletado! ✅

---

## 🧹 LIMPAR CACHE

**No seu navegador:**

1. Pressione: `Ctrl + Shift + Delete`
2. Marque: "Imagens e arquivos em cache"
3. Clique: "Limpar dados"

**OU**

Acesse: https://volleypro-zw96.vercel.app**?clear_cache=true**

---

## ✅ TESTAR

1. Vá para: https://volleypro-zw96.vercel.app
2. Clique em: **"Times"**
3. Procure por: "Alpha"

**Resultado esperado:**
- ❌ Alpha Sports NÃO aparece
- ✅ Apenas times reais aparecem

---

## 🎯 RESUMO

```
ANTES:
Código ✅ Limpo
Banco  ❌ Com Alpha Sports
Site   ❌ Mostra Alpha Sports

DEPOIS:
Código ✅ Limpo
Banco  ✅ Limpo
Site   ✅ Sem Alpha Sports
```

---

## 🆘 PROBLEMAS?

### "Não consigo acessar SQL Editor"
- Verifique se está logado no Supabase
- Verifique se selecionou o projeto correto

### "Deu erro ao executar SQL"
- Copie o SQL novamente
- Certifique-se de copiar TODO o código
- Tente um por vez

### "Alpha Sports ainda aparece"
1. Limpe o cache (Ctrl + Shift + Delete)
2. Feche o navegador completamente
3. Abra novamente
4. Teste em aba anônima

---

## 📝 ARQUIVO SQL COMPLETO

Se preferir mais opções, use:
📄 **DELETE_ALPHA_SPORTS.sql**

---

**PRONTO! ALPHA SPORTS SERÁ REMOVIDO! 🗑️✅**

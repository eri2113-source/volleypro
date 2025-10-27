# 🔧 CORRIGIR TAG DO GOOGLE ADS - SOLUÇÃO RÁPIDA

## ⚠️ PROBLEMA:
```
"Seu site não tem uma tag do Google"
Instale uma tag do Google no seu site para ativar a otimização e gerar resultados.
```

## ✅ SOLUÇÃO EM 3 PASSOS:

---

## PASSO 1: PEGAR O ID DE CONVERSÃO DO GOOGLE ADS

1. **No Google Ads**, clique em:
   - **Ferramentas** (ícone de chave inglesa no topo)
   - **Medição** → **Conversões**

2. Clique em **+ Nova conversão**

3. Selecione: **Site**

4. Escolha o tipo de conversão:
   - ✅ **"Envio de formulário"** (para cadastros)
   - Ou **"Cadastro"**

5. Configure:
   - **Nome da conversão:** `Cadastro VolleyPro`
   - **Categoria:** Cadastro
   - **Valor:** 1 (opcional)
   - **Contagem:** Uma por clique

6. Clique em **Criar e continuar**

7. **COPIE O ID DE CONVERSÃO** que aparece:
   - Formato: `AW-XXXXXXXXXX` ou só `XXXXXXXXXX`
   - Exemplo: `AW-123456789` ou `987654321`

8. **COPIE TAMBÉM O RÓTULO DE CONVERSÃO**:
   - Formato: `abcdefghijk`

---

## PASSO 2: ADICIONAR NO GOOGLE TAG MANAGER

### **MÉTODO A: Adicionar Tag de Conversão (RECOMENDADO)**

1. Entre em: **tagmanager.google.com**

2. Selecione o container: **GTM-MV9D2M4P** (VolleyPro)

3. Vá em **Tags** → **Nova**

4. **Configure a Tag:**
   - **Nome:** `Google Ads - Conversão Cadastro`
   - **Tipo de tag:** Clique em **Configuração da tag**
   - Procure e selecione: **Google Ads - Rastreamento de conversões**

5. **Preencha os campos:**
   - **ID de conversão:** Cole o `AW-XXXXXXXXXX` (SEM o "AW-", só os números)
   - **Rótulo de conversão:** Cole o código do rótulo
   - **Valor da conversão:** 1 (opcional)

6. **Configure o Acionador:**
   - Clique em **Acionadores** → **+**
   - **Nome:** `Cadastro Concluído`
   - **Tipo:** Escolha **Evento personalizado**
   - **Nome do evento:** `signup_complete` (vamos adicionar isso no código)
   - Marque: **Usar correspondência regex:** NÃO
   - Salve

7. Clique em **Salvar**

---

### **MÉTODO B: Adicionar Tag Global do Google Ads (ALTERNATIVA)**

Se o Método A for complicado, faça assim:

1. No Google Ads, vá em **Ferramentas** → **Medição** → **Conversões**

2. Clique em **Configuração da tag do Google**

3. Copie o **ID do Google Ads** (formato: `AW-XXXXXXXXXX`)

4. No GTM, crie uma nova tag:
   - **Nome:** `Google Ads - Tag Global`
   - **Tipo:** **Google Ads - Remarketing**
   - **ID de conversão:** Cole o ID (sem "AW-")
   - **Acionador:** All Pages (Todas as páginas)

5. Salve

---

## PASSO 3: PUBLICAR NO GTM

1. No GTM, clique em **Enviar** (botão azul no topo direito)

2. **Nome da versão:** `Adicionada tag Google Ads`

3. **Descrição:** `Tag de conversão e remarketing Google Ads`

4. Clique em **Publicar**

---

## PASSO 4: VERIFICAR SE FUNCIONOU

### **4.1 - Teste Imediato:**

1. Abra seu site: **voleypro.net**

2. Pressione **F12** (abre o console)

3. Vá na aba **Network** (Rede)

4. Filtre por: `google`

5. Recarregue a página (**F5**)

6. Procure por:
   - ✅ `gtag/js?id=AW-XXXXXXXXXX`
   - ✅ `googleadservices.com/pagead/conversion`

7. **Se aparecer** → Tag instalada com sucesso! ✅

---

### **4.2 - Teste no Google Ads:**

1. Volte no Google Ads → **Ferramentas** → **Configuração da tag do Google**

2. Clique em **Verificar instalação**

3. Digite: `voleypro.net`

4. Clique em **Verificar**

5. **Aguarde até 48 horas** para o Google detectar (mas geralmente é imediato)

---

## 🎯 SOLUÇÃO RÁPIDA (SE TIVER PRESSA):

Se você só quer SAIR do erro e não precisa de conversões detalhadas AGORA:

### **OPÇÃO FÁCIL: Tag de Remarketing**

1. No Google Ads, vá em: **Ferramentas** → **Biblioteca compartilhada** → **Gerenciador de públicos-alvo**

2. Clique em **Tag do Google Ads**

3. **Copie o ID** (tipo: `AW-123456789`)

4. No GTM:
   - **Nova tag** → **Google Ads - Remarketing**
   - **ID de conversão:** Cole o número (sem "AW-")
   - **Acionador:** All Pages
   - **Salvar e Publicar**

5. **PRONTO!** O erro vai sumir em 24-48h

---

## ❓ PERGUNTAS FREQUENTES:

### **1. Quanto tempo demora para o Google detectar?**
**R:** Geralmente 1-24 horas, mas pode levar até 48h.

### **2. Posso usar sem configurar conversões?**
**R:** Sim! A tag de remarketing já resolve o erro. Conversões são opcionais.

### **3. Preciso adicionar código no site?**
**R:** NÃO! Como você já tem o GTM instalado, tudo é feito no painel do GTM.

### **4. E se der erro "ID de conversão inválido"?**
**R:** Use só os NÚMEROS do ID, remova o "AW-" e as letras.

---

## 🚨 SE AINDA DER ERRO:

### **SOLUÇÃO GARANTIDA:**

1. No Google Ads, copie o **código JavaScript completo** da tag de conversão

2. Adicione no GTM como:
   - **Tipo de tag:** HTML personalizado
   - Cole o código completo
   - **Acionador:** All Pages
   - Publique

Isso SEMPRE funciona!

---

## ✅ RESUMO EXECUTIVO:

**O QUE FAZER AGORA:**

1. ✅ Pegue o ID do Google Ads (tipo: `AW-123456789`)
2. ✅ Entre no GTM (tagmanager.google.com)
3. ✅ Crie uma tag: **Google Ads - Remarketing**
4. ✅ Cole o ID (só os números, sem "AW-")
5. ✅ Acionador: **All Pages**
6. ✅ Publique
7. ✅ Aguarde 24h e verifique no Google Ads

**PRONTO! O erro vai sumir!** 🎉

---

Criado para: **VolleyPro** (voleypro.net)  
Data: 26 de outubro de 2025

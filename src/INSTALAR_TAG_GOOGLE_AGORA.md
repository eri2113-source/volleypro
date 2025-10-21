# ⚡ INSTALAR TAG DO GOOGLE AGORA - 3 PASSOS

## 🎯 PROBLEMA
O Google Ads está reclamando: "A tag do Google não foi detectada no seu site"

## ✅ SOLUÇÃO JÁ IMPLEMENTADA
O código já está pronto! Só falta você substituir o ID do GTM.

---

## 📋 PASSO 1: CRIAR CONTA NO GOOGLE TAG MANAGER (5 MIN)

1. **Acesse:** https://tagmanager.google.com/
2. **Clique em "Criar conta"**
3. **Preencha:**
   ```
   Nome da conta: VolleyPro
   País: Brasil
   Nome do contêiner: volleypro-zw96.vercel.app
   Plataforma de destino: WEB
   ```
4. **Aceite os termos** e clique em "Criar"

### 📸 Você verá uma tela com códigos

**NÃO PRECISA COPIAR OS CÓDIGOS!**

Você só precisa do **ID do contêiner** que aparece no topo:

```
GTM-XXXXXXX  ← COPIE ESTE ID!
```

Exemplo: `GTM-ABC123` ou `GTM-5XYZW8`

---

## 📋 PASSO 2: SUBSTITUIR NO CÓDIGO (1 MIN)

### Opção A: GitHub Web (Mais Fácil)

1. Vá para: https://github.com/SEU_USUARIO/volleypro
2. Clique no arquivo: `index.html`
3. Clique no botão de edição (lápis) ✏️
4. Procure por: `GTM-XXXXXXX` (aparece 2 vezes)
5. Substitua ambos pelo seu ID real (ex: `GTM-ABC123`)
6. Clique em "Commit changes" (verde)

### Opção B: GitHub Desktop (Você já usa)

1. Abra o projeto no VS Code ou editor
2. Abra o arquivo `/index.html`
3. **Linha ~37:** Substitua `GTM-XXXXXXX` pelo seu ID
4. **Linha ~45:** Substitua `GTM-XXXXXXX` pelo seu ID novamente
5. Salve o arquivo
6. Abra GitHub Desktop
7. Commit: "✅ Configura Google Tag Manager"
8. Push origin

---

## 📋 PASSO 3: AGUARDAR DEPLOY E TESTAR (3 MIN)

### Aguardar Deploy Automático
- A Vercel faz deploy automaticamente em 2-3 minutos
- Acesse: https://vercel.com/seu-usuario/volleypro
- Aguarde aparecer "✅ Ready"

### Testar se Funcionou

**Teste 1: Console do Navegador (Mais Rápido)**
```javascript
1. Abra: https://volleypro-zw96.vercel.app
2. Pressione F12
3. Vá para a aba "Console"
4. Digite: window.dataLayer
5. Pressione Enter
```

**✅ Funcionou se aparecer:** `Array [ {…}, {…} ]`  
**❌ Erro se aparecer:** `undefined`

**Teste 2: Verificar Código Fonte**
```
1. Abra: https://volleypro-zw96.vercel.app
2. Clique com botão direito > "Ver código-fonte"
3. Procure por: GTM-ABC123 (seu ID)
```

**✅ Funcionou se:** Você encontrar seu ID (não mais GTM-XXXXXXX)  
**❌ Erro se:** Ainda aparecer GTM-XXXXXXX

---

## 🎯 VOLTAR AO GOOGLE ADS

Agora que a tag está instalada:

1. **Volte ao Google Ads**
2. Vá em: **Ferramentas e Configurações** > **Medição** > **Conversões**
3. Clique em: **"Nova conversão"**
4. Escolha: **"Website"**
5. O Google Ads detectará sua tag automaticamente! ✅

### Configurar Conversões Importantes

**Conversão Principal: Compra de Plano**
```
Nome: Compra de Plano PRO
Valor: R$ 99,90
Categoria: Compra
Evento do GTM: purchase
```

**Conversão Secundária: Cadastro**
```
Nome: Cadastro VolleyPro
Valor: R$ 0
Categoria: Inscrição
Evento do GTM: sign_up
```

---

## 🚀 EVENTOS JÁ RASTREANDO AUTOMATICAMENTE

O VolleyPro já está rastreando:

- ✅ **sign_up** - Cadastro (CONVERSÃO!)
- ✅ **login** - Login
- ✅ **purchase** - Compra de plano (CONVERSÃO PRINCIPAL!)
- ✅ **begin_checkout** - Clicou em "Assinar"
- ✅ **view_item_list** - Visualizou página de planos
- ✅ **create_tournament** - Criou torneio
- ✅ **start_live_stream** - Começou transmissão

**Tudo está pronto para funcionar assim que você substituir o ID!**

---

## ❓ TROUBLESHOOTING RÁPIDO

### "Ainda não detectou a tag"
**Causa:** Você não substituiu GTM-XXXXXXX  
**Solução:** Volte ao Passo 2

### "Deploy não aconteceu"
**Causa:** Não fez Push no GitHub  
**Solução:** Abra GitHub Desktop e clique em "Push origin"

### "dataLayer is undefined"
**Causa 1:** Aguarde 2-3 minutos após deploy  
**Causa 2:** Limpe o cache (Ctrl+Shift+Delete)  
**Solução:** Aguarde e teste em aba anônima

### "GTM-XXXXXXX ainda aparece no código"
**Causa:** Deploy antigo em cache  
**Solução:** 
1. Aguarde 3-5 minutos
2. Force refresh (Ctrl+Shift+R)
3. Teste em aba anônima

---

## 📊 DICA PRO: PREVIEW MODE

Para ver eventos em tempo real:

1. No GTM, clique em **"Preview"** (topo direito)
2. Digite: https://volleypro-zw96.vercel.app
3. Clique em "Connect"
4. Navegue no site em outra aba
5. Veja todos os eventos acontecendo em tempo real!

---

## ⏰ TEMPO TOTAL: 10 MINUTOS

- Passo 1: 5 min
- Passo 2: 1 min
- Passo 3: 3 min
- Buffer: 1 min

**VOCÊ CONSEGUE! 💪**

---

## 📞 PRÓXIMOS PASSOS

Depois de configurar:

1. ✅ Aguardar 24-48h para dados começarem a aparecer
2. ✅ Configurar conversões no Google Ads
3. ✅ Marcar "purchase" como conversão principal
4. ✅ Iniciar campanhas com rastreamento de conversões

---

**🎉 BOA SORTE!**

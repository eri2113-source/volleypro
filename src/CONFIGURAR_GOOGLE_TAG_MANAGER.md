# 🎯 Configuração do Google Tag Manager - VolleyPro

## ✅ O QUE JÁ FOI FEITO

A tag do Google Tag Manager (GTM) já foi adicionada ao código do VolleyPro:
- ✅ Script GTM no `<head>` do index.html
- ✅ Iframe noscript no `<body>` do index.html
- ✅ Funções utilitárias para rastrear conversões criadas
- ✅ Sistema de eventos personalizado pronto

## 📋 O QUE VOCÊ PRECISA FAZER AGORA

### PASSO 1: Criar Conta no Google Tag Manager

1. Acesse: https://tagmanager.google.com/
2. Clique em **"Criar conta"** (se ainda não tiver)
3. Preencha:
   - **Nome da conta**: VolleyPro
   - **País**: Brasil
   - **Nome do contêiner**: volleypro-zw96.vercel.app
   - **Plataforma de destino**: **Web**
4. Aceite os termos de serviço
5. Clique em **"Criar"**

### PASSO 2: Copiar o ID do GTM

Após criar, você verá uma tela com dois códigos. Você só precisa do **ID do contêiner**.

O ID será algo como: **GTM-XXXXXXX**

**COPIE ESTE ID!**

### PASSO 3: Substituir no Código

Abra o arquivo `/index.html` e substitua **GTM-XXXXXXX** (aparece 2 vezes) pelo seu ID real:

```html
<!-- Linha ~37 -->
})(window,document,'script','dataLayer','GTM-XXXXXXX'); // ← Substituir aqui

<!-- Linha ~45 -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" // ← Substituir aqui
```

**Exemplo:** Se seu ID for GTM-ABC123, substitua:
```javascript
// DE:
'GTM-XXXXXXX'

// PARA:
'GTM-ABC123'
```

### PASSO 4: Fazer Commit e Deploy

Depois de substituir o ID:

1. Abra o **GitHub Desktop**
2. Você verá a mudança no `index.html`
3. Faça commit: "✅ Adiciona Google Tag Manager para conversões"
4. Clique em **"Push origin"**
5. Aguarde o deploy automático na Vercel (2-3 minutos)

### PASSO 5: Verificar se Está Funcionando

1. Acesse: https://volleypro-zw96.vercel.app
2. Abra o **Console do navegador** (F12 > Console)
3. Digite: `window.dataLayer`
4. Você deve ver um array com dados

OU use a extensão do Chrome:
- **Google Tag Assistant Legacy** (extensão gratuita)

### PASSO 6: Conectar ao Google Ads

Agora que o GTM está instalado:

1. Volte para o Google Ads
2. Vá em **Ferramentas e Configurações** > **Medição** > **Conversões**
3. Clique em **"Nova conversão"**
4. Escolha **"Website"**
5. Configure a conversão (exemplo: compra de plano)
6. O Google Ads detectará automaticamente sua tag GTM!

## 🎯 CONVERSÕES IMPORTANTES PARA CONFIGURAR

Depois de conectar, configure estas conversões no Google Ads:

1. **Cadastro** (Sign Up)
   - Evento: `sign_up`
   - Valor: R$ 0 (conversão de engajamento)

2. **Compra de Plano PRO** (Principal!)
   - Evento: `purchase`
   - Valor: R$ 99,90
   - Esta é a conversão mais importante!

3. **Início de Checkout**
   - Evento: `begin_checkout`
   - Valor: variável por plano

4. **Criação de Torneio**
   - Evento: `create_tournament`
   - Valor: R$ 0 (conversão de engajamento)

## 📊 EVENTOS QUE JÁ ESTÃO IMPLEMENTADOS

O VolleyPro já está rastreando automaticamente:

- ✅ `sign_up` - Cadastro de novo usuário
- ✅ `login` - Login de usuário
- ✅ `purchase` - Compra de plano (CONVERSÃO!)
- ✅ `begin_checkout` - Início do checkout
- ✅ `view_item_list` - Visualização dos planos
- ✅ `create_post` - Criação de post
- ✅ `create_tournament` - Criação de torneio
- ✅ `start_live_stream` - Início de transmissão
- ✅ `engagement` - Curtidas, comentários, etc
- ✅ `page_view` - Visualizações de página

## 🔍 COMO TESTAR SE ESTÁ FUNCIONANDO

### Teste 1: Console do Navegador
```javascript
// Abra o Console (F12)
window.dataLayer
// Deve mostrar um array com eventos
```

### Teste 2: Google Tag Manager Preview
1. No painel do GTM, clique em **"Preview"**
2. Digite: https://volleypro-zw96.vercel.app
3. Você verá todos os eventos em tempo real

### Teste 3: Extensão Chrome
Instale **Google Tag Assistant** e visite seu site
- Tag verde = funcionando ✅
- Tag vermelha = erro ❌

## ❓ TROUBLESHOOTING

### "A tag do Google não foi detectada"

**Causa**: Você ainda tem GTM-XXXXXXX no código
**Solução**: Substitua pelo ID real e faça deploy

### "Erro de CORS"

**Causa**: Improvável, mas pode acontecer
**Solução**: Limpe o cache (Ctrl+Shift+Delete)

### "dataLayer is not defined"

**Causa**: Tag não carregou
**Solução**: Verifique se fez deploy e limpe cache

## 📱 IMPORTANTE PARA GOOGLE ADS

Depois de configurar:

1. Aguarde **24-48 horas** para dados começarem a aparecer
2. No Google Ads, marque a conversão de **"purchase"** como **conversão principal**
3. Configure o valor de conversão correto (R$ 99,90 para PRO)
4. Ative o **Acompanhamento de conversões aprimorado** (opcional, mas recomendado)

## 🎓 RECURSOS ÚTEIS

- [Guia oficial do GTM](https://support.google.com/tagmanager/answer/6103696)
- [Como configurar conversões](https://support.google.com/google-ads/answer/6095821)
- [Teste de conversões](https://support.google.com/google-ads/answer/6095803)

## 🚀 PRÓXIMOS PASSOS

Depois de configurar o GTM:

1. **Integrar eventos no código** - Adicionar rastreamento em mais lugares
2. **Configurar Facebook Pixel** - Se quiser anunciar no Facebook também
3. **Adicionar Google Analytics 4** - Para análises detalhadas
4. **Configurar metas personalizadas** - No GTM dashboard

---

## 📞 NEED HELP?

Se tiver qualquer dúvida:
1. Verifique se substituiu GTM-XXXXXXX pelo ID real
2. Verifique se fez deploy na Vercel
3. Aguarde 2-3 minutos após deploy
4. Teste no modo incógnito
5. Limpe o cache do navegador

**BOA SORTE! 🎉**

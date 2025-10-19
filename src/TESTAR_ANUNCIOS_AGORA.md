# 🎯 GUIA COMPLETO: TESTAR SISTEMA DE ANÚNCIOS

## ❌ NÃO CONSEGUIU TESTAR? SIGA ESTE GUIA!

---

## 📋 PASSO 1: VERIFICAR SE A PÁGINA CARREGA

### **O que fazer:**
```
1. Pressione F5 (ou Ctrl+R) para recarregar a página
2. Aguarde carregar completamente (até aparecer a página)
3. Veja se aparece algum erro na tela
```

### **Se aparecer erro na tela:**
- ❌ Tela branca = Erro de compilação
- ❌ Mensagem de erro = Problema no código
- ✅ Página carrega normal = Prossiga para o Passo 2

### **Como ver erros técnicos:**
```
1. Pressione F12 (abre DevTools)
2. Clique na aba "Console"
3. Veja se há mensagens vermelhas
4. Copie e me envie se tiver
```

---

## 📋 PASSO 2: PROCURAR O MENU "ANÚNCIOS"

### **Onde procurar:**
```
1. Na BARRA AZUL no topo da página
2. Procure pelos botões: Feed | Atletas | Times | Torneios | Vitrine | Lives | Convites | 📣 Anúncios
3. O botão "Anúncios" tem ícone de megafone 📣
```

### **Se NÃO aparecer o menu "Anúncios":**

**OPÇÃO A: Limpar cache e recarregar**
```
1. Pressione Ctrl+Shift+R (recarregar forçado)
2. OU Ctrl+F5 (limpar cache)
3. Aguarde carregar novamente
```

**OPÇÃO B: Abrir em aba anônima**
```
1. Pressione Ctrl+Shift+N (Chrome) ou Ctrl+Shift+P (Firefox)
2. Cole o endereço do site na aba anônima
3. Tente novamente
```

**OPÇÃO C: Verificar se está logado**
```
1. Você precisa estar logado para ver o menu
2. Se não estiver, faça login
3. O menu deve aparecer
```

---

## 📋 PASSO 3: ABRIR PÁGINA DE ANÚNCIOS

### **O que fazer:**
```
1. Clique no botão "📣 Anúncios" na barra azul
2. Aguarde a página carregar
```

### **O que você DEVE ver:**

**Se você É ADMIN (email: eri.2113@gmail.com):**
```
✅ Título: "Anúncios"
✅ Subtítulo: "Gerencie anúncios da plataforma"
✅ Painel com 3 cards:
   - Pendentes (0)
   - Aprovados (0)
   - Rejeitados (0)
✅ 3 abas: Pendentes | Aprovados | Rejeitados
✅ SEM botão "Criar Anúncio Grátis"
```

**Se você NÃO é admin (outro email):**
```
✅ Título: "Anúncios"
✅ Subtítulo: "Divulgue seu negócio gratuitamente"
✅ Botão grande: "✨ Criar Anúncio Grátis"
✅ Abas: Informações | Benefícios
✅ Textos sobre anúncios grátis
```

### **Se NÃO aparecer nada:**
```
1. Abra o Console (F12)
2. Procure por erros vermelhos
3. Tire print e me envie
```

---

## 📋 PASSO 4: CRIAR ANÚNCIO TESTE (Usuário Normal)

### **Pré-requisito:**
- Você precisa estar logado com um email que NÃO seja eri.2113@gmail.com

### **Como criar:**

**1. Abrir o modal:**
```
- Clique no botão "✨ Criar Anúncio Grátis"
- Deve abrir um modal grande com formulário
```

**2. Preencher formulário:**

```
📌 Tipo de Anúncio:
   - Selecione: "📦 Card Médio (No feed)"

✍️ Título do Anúncio:
   - Digite: "Academia de Vôlei - 50% OFF"

📝 Descrição:
   - Digite: "Primeira mensalidade com desconto! Matricule-se agora!"

🖼️ Imagem do Anúncio:
   - Clique na área de upload
   - Selecione QUALQUER imagem do seu computador
   - Aguarde aparecer o preview
   - ⚠️ Máximo 5MB

🔗 Link (opcional):
   - Digite: "https://instagram.com/teste"

👤 Nome (opcional):
   - Digite: "João Silva"

📧 Email *:
   - Digite: "joao@teste.com"
   - ⚠️ OBRIGATÓRIO

📱 Telefone (opcional):
   - Digite: "(11) 99999-9999"
```

**3. Enviar:**
```
- Clique em "Enviar para Aprovação"
- Deve aparecer toast verde: "🎉 Anúncio enviado para aprovação!"
- Modal fecha automaticamente
```

### **Se der erro:**
```
Erros comuns:

❌ "Título é obrigatório!" → Preencha o título
❌ "Descrição é obrigatória!" → Preencha a descrição
❌ "Adicione uma imagem!" → Faça upload de imagem
❌ "Email inválido!" → Use formato correto (teste@email.com)
❌ "Imagem muito grande!" → Use imagem menor que 5MB
```

---

## 📋 PASSO 5: APROVAR ANÚNCIO (Admin)

### **Pré-requisito:**
- Você precisa estar logado com: **eri.2113@gmail.com**

### **Como aprovar:**

**1. Ir para Anúncios:**
```
- Clique em "📣 Anúncios" no menu
- Você verá o painel administrativo (diferente dos outros usuários)
```

**2. Ver anúncio pendente:**
```
- Na aba "Pendentes", o número deve mostrar (1)
- Clique na aba "Pendentes"
- Você verá um card com:
  ✓ Imagem do anúncio
  ✓ Título: "Academia de Vôlei - 50% OFF"
  ✓ Descrição
  ✓ Email: joao@teste.com
  ✓ Botões: Aprovar | Rejeitar
```

**3. Aprovar:**
```
- Clique no botão verde "✓ Aprovar"
- Aparece confirmação: "Aprovar anúncio?"
- Clique em "Aprovar" novamente
- Toast verde: "✅ Anúncio aprovado!"
- O anúncio some da aba "Pendentes"
- Aparece na aba "Aprovados"
```

**4. Verificar aprovação:**
```
- Clique na aba "Aprovados"
- O anúncio deve estar lá
- Status: "Aprovado" (badge verde)
```

---

## 📋 PASSO 6: VER ANÚNCIO NO FEED

### **Como ver:**

**1. Ir para o Feed:**
```
- Clique em "Feed" no menu
- Role a página para baixo
```

**2. Procurar anúncios:**
```
Posições onde aparecem:

📍 Após 2 posts → BANNER GRANDE (anúncio 1)
📍 Após 5 posts → CARD MÉDIO (anúncio 2)
📍 Após 8 posts → CARD MÉDIO (anúncio 3)

Se você criou só 1 anúncio tipo "Card", ele aparece na posição 2.
```

**3. Identificar anúncio:**
```
O anúncio tem:
✓ Indicador "✨ Anúncio" no topo
✓ Sua imagem
✓ Título: "Academia de Vôlei - 50% OFF"
✓ Descrição
✓ Botão "Acessar" (se tiver link)
✓ Botão X para fechar
```

**4. Testar funcionalidade:**
```
- Clique no anúncio → Abre link em nova aba
- Clique no X → Anúncio desaparece
```

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### **1. Menu "Anúncios" não aparece**

**Causa:** Cache do navegador
**Solução:**
```
1. Ctrl+Shift+R (recarregar forçado)
2. Ou Ctrl+F5
3. Ou abrir aba anônima (Ctrl+Shift+N)
```

---

### **2. Página de Anúncios não carrega**

**Causa:** Erro de importação
**Solução:**
```
1. Abra Console (F12)
2. Veja erro
3. Me envie o erro
```

---

### **3. Modal de criar anúncio não abre**

**Causa:** Botão não funciona
**Solução:**
```
1. Verifique se clicou no botão certo
2. Tente recarregar a página
3. Veja Console (F12) por erros
```

---

### **4. Erro ao enviar anúncio**

**Causas possíveis:**
```
❌ Backend não responde
❌ Campos obrigatórios vazios
❌ Imagem muito grande
❌ Email inválido
```

**Solução:**
```
1. Preencha TODOS os campos obrigatórios
2. Use imagem < 5MB
3. Use email válido (teste@email.com)
4. Veja Console (F12) por erros
```

---

### **5. Não vejo painel administrativo**

**Causa:** Não está logado como admin
**Solução:**
```
1. Faça logout
2. Faça login com: eri.2113@gmail.com
3. Vá em "Anúncios" novamente
4. Deve ver painel administrativo
```

---

### **6. Anúncio não aparece no Feed**

**Causas possíveis:**
```
❌ Anúncio não foi aprovado
❌ Anúncio é de tipo diferente (banner vs card)
❌ Não rolou o Feed até a posição certa
❌ Feed não tem posts suficientes
```

**Solução:**
```
1. Confirme que anúncio foi aprovado
2. Verifique o tipo do anúncio:
   - Banner = Após 2 posts
   - Card = Após 5 e 8 posts
3. Role o Feed até ver
4. Se necessário, crie mais posts de teste
```

---

## 🎯 CHECKLIST COMPLETO

Use esta lista para testar tudo:

### **Como Usuário Normal:**
- [ ] Página "Anúncios" carrega
- [ ] Vejo botão "Criar Anúncio Grátis"
- [ ] Vejo textos informativos
- [ ] Modal de criação abre
- [ ] Consigo fazer upload de imagem
- [ ] Preview da imagem aparece
- [ ] Consigo preencher todos os campos
- [ ] Validações funcionam (campos obrigatórios)
- [ ] Consigo enviar anúncio
- [ ] Toast de sucesso aparece
- [ ] Modal fecha após enviar

### **Como Admin (eri.2113@gmail.com):**
- [ ] Vejo painel administrativo
- [ ] Vejo 3 cards de estatísticas
- [ ] Vejo aba "Pendentes" com (1)
- [ ] Anúncio pendente aparece na lista
- [ ] Consigo ver preview do anúncio
- [ ] Consigo ver dados do anunciante
- [ ] Botão "Aprovar" funciona
- [ ] Confirmação aparece
- [ ] Toast de aprovação aparece
- [ ] Anúncio vai para "Aprovados"
- [ ] Estatísticas atualizam

### **No Feed:**
- [ ] Anúncio aprovado aparece
- [ ] Está na posição correta
- [ ] Tem indicador "Anúncio"
- [ ] Imagem aparece
- [ ] Texto aparece
- [ ] Botão funciona
- [ ] Link abre em nova aba
- [ ] Botão X remove anúncio

---

## 📸 O QUE ME ENVIAR SE DER ERRO

Se algo não funcionar, me envie:

### **1. Print da tela:**
```
- Tire screenshot (Print Screen)
- Me mostre o que você vê
```

### **2. Erro do Console:**
```
1. Pressione F12
2. Clique em "Console"
3. Copie mensagens vermelhas
4. Me envie o texto
```

### **3. Descrição do problema:**
```
Exemplo:
"Cliquei em Anúncios mas a página não carrega.
No console aparece: Error: AdDisplay is not defined"
```

---

## 🎬 ORDEM IDEAL DE TESTE

Para testar tudo em sequência:

```
1️⃣ Faça login com EMAIL NORMAL (não admin)
2️⃣ Vá em "Anúncios"
3️⃣ Clique "Criar Anúncio Grátis"
4️⃣ Preencha formulário
5️⃣ Envie
6️⃣ Faça LOGOUT
7️⃣ Faça login com eri.2113@gmail.com
8️⃣ Vá em "Anúncios"
9️⃣ Aprove o anúncio
🔟 Vá para "Feed"
1️⃣1️⃣ Role e veja o anúncio
```

---

## ⚡ TESTE RÁPIDO (1 MINUTO)

Se quiser testar rapidamente:

```
✅ F5 para recarregar
✅ Clique em "📣 Anúncios"
✅ Viu a página? → FUNCIONOU!
✅ Não viu? → Me envie erro do Console
```

---

## 🆘 ÚLTIMO RECURSO

Se NADA funcionar:

**Limpar tudo e começar de novo:**
```
1. Feche todas as abas do site
2. Limpe cache do navegador:
   Chrome: Ctrl+Shift+Del → Limpar dados
3. Feche o navegador
4. Abra novamente
5. Acesse o site
6. Teste novamente
```

**Se ainda não funcionar:**
```
Me envie:
- Print da tela
- Erros do Console (F12)
- Qual passo deu erro
```

---

## ✅ ESTÁ FUNCIONANDO?

Se você conseguiu:
- ✅ Ver menu "Anúncios"
- ✅ Criar um anúncio
- ✅ Aprovar como admin
- ✅ Ver no Feed

**PARABÉNS! 🎉** 

O sistema está 100% funcional e pronto para publicar no Vercel!

---

## 🚀 PRÓXIMOS PASSOS

Quando tudo funcionar aqui:

```
1. Me confirme que está OK
2. Vou criar guia para publicar no Vercel
3. Você publica em produção
4. Seus usuários podem criar anúncios!
```

---

**Dúvidas? Me envie:**
- Qual passo deu erro
- Print da tela
- Erro do Console (F12)

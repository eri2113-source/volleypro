# ✅ CHECKLIST DE TESTE - FUNCIONALIDADES DO ATLETA

## 🎯 COMO TESTAR TODAS AS CORREÇÕES

### **TESTE 1: Cadastro no Chrome** 🌐

**Objetivo:** Verificar se consegue criar conta de atleta no Google Chrome

**Passos:**
1. ✅ Abra o site no **Google Chrome**
2. ✅ Clique em "Entrar / Cadastrar"
3. ✅ Vá na aba "Criar Conta"
4. ✅ Selecione "⭐ Atleta" no tipo de conta
5. ✅ Preencha:
   - Nome: Seu nome completo
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
   - Posição: (opcional) ex: Ponteiro
6. ✅ Clique "Criar Conta"

**✅ ESPERADO:**
- Conta criada com sucesso
- Mensagem: "Bem-vindo(a)! 🏐"
- Modal fecha automaticamente
- Você está logado

**❌ SE DER ERRO:**
- Abra o Console (F12)
- Copie toda a mensagem de erro
- Me envie para análise

---

### **TESTE 2: Acessar Meu Perfil** 👤

**Objetivo:** Verificar se consegue ver seu próprio perfil

**Passos:**
1. ✅ Após fazer login, clique no botão **"Meu Perfil"** no header (canto superior direito)
2. ✅ Você deve ver uma página com:
   - Seu nome (ou apelido se já preencheu)
   - Avatar com suas iniciais
   - Botão "Editar Perfil"
   - Cards com suas informações (se já preencheu)

**✅ ESPERADO:**
- Página carrega sem erros
- Informações aparecem corretamente
- Design bonito com gradiente azul/laranja

---

### **TESTE 3: Editar Perfil Completo** ✏️

**Objetivo:** Preencher todos os campos do perfil

**Passos:**
1. ✅ Clique "Editar Perfil"
2. ✅ Preencha todos os campos:

**CAMPOS BÁSICOS:**
- ✅ Nome Completo: (ex: João Silva Santos)
- ✅ Apelido: (ex: Bruninho) - **Teste este campo!**
- ✅ Cidade: (ex: São Paulo, SP)
- ✅ Bio: Conte sobre você

**CAMPOS PESSOAIS:**
- ✅ Data de Nascimento: (ex: 15/03/1995)
- ✅ Sexo: Masculino / Feminino / Outro
- ✅ Altura: (ex: 185)
- ✅ Peso: (ex: 75)

**CAMPOS DE CARREIRA:**
- ✅ Posição: (ex: Ponteiro)
- ✅ Time Atual: (ex: Minas Tênis Clube)
- ✅ Histórico de Times: (ex: "Sesi-SP (2018-2020), Flamengo (2020-2022)")
- ✅ Conquistas: (ex: "Campeão Paulista 2021, MVP Sul-Americano 2022")
- ✅ CPF: (opcional) 000.000.000-00

3. ✅ Clique "Salvar Alterações"

**✅ ESPERADO:**
- Toast: "Perfil atualizado com sucesso! 🎉"
- Modal fecha
- Recarrega página automaticamente

---

### **TESTE 4: Verificar Apelido** 🏷️

**Objetivo:** Confirmar que apelido aparece no lugar do nome

**Passos:**
1. ✅ No perfil, preencha o campo **Apelido** (ex: "Bruninho")
2. ✅ Salve o perfil
3. ✅ Clique "Meu Perfil" novamente
4. ✅ Verifique no topo da página

**✅ ESPERADO:**
- Título mostra: **"Bruninho"** (João Silva Santos)
- Apelido em destaque
- Nome completo entre parênteses

**SE NÃO PREENCHEU APELIDO:**
- Deve mostrar apenas: **"João Silva Santos"**

---

### **TESTE 5: Visualizar Informações** 📊

**Objetivo:** Ver todas as informações no perfil

**Passos:**
1. ✅ Acesse "Meu Perfil"
2. ✅ Navegue pelas abas:

**ABA "INFORMAÇÕES":**
- ✅ Card com "Sobre" (sua bio)
- ✅ Card com "Informações do Atleta"
- ✅ Cards pequenos: Idade, Altura, Peso, Sexo

**ABA "HISTÓRICO":**
- ✅ Mostra seu histórico de times

**ABA "CONQUISTAS":**
- ✅ Lista suas conquistas

**✅ ESPERADO:**
- Todas as abas funcionam
- Informações aparecem corretamente
- Se campo vazio, mostra mensagem sugestiva

---

### **TESTE 6: Botão de Seguir** ❤️

**Objetivo:** Seguir outro atleta (não seguir automaticamente)

**Passos:**
1. ✅ Vá na página **"Atletas"** (menu lateral)
2. ✅ Clique em qualquer atleta
3. ✅ Observe o botão no perfil do atleta

**ESTADO INICIAL:**
- ✅ Botão: "Seguir"
- ✅ Ícone de coração vazio
- ✅ Fundo branco

4. ✅ Clique no botão "Seguir"

**DEPOIS DE CLICAR:**
- ✅ Toast: "Agora você está seguindo [Nome]! 🎉"
- ✅ Botão muda para: "Seguindo"
- ✅ Ícone de coração preenchido
- ✅ Fundo cinza

5. ✅ Clique novamente

**DEPOIS DE CLICAR DE NOVO:**
- ✅ Toast: "Você deixou de seguir [Nome]"
- ✅ Botão volta para: "Seguir"
- ✅ Ícone de coração vazio

---

### **TESTE 7: Calcular Idade** 📅

**Objetivo:** Verificar se idade é calculada automaticamente

**Passos:**
1. ✅ Edite seu perfil
2. ✅ Preencha **Data de Nascimento**: (ex: 15/03/1995)
3. ✅ Salve
4. ✅ Acesse "Meu Perfil"
5. ✅ Veja os cards no topo

**✅ ESPERADO:**
- Card "Idade" mostra: **29** (ou sua idade real)
- Calculada automaticamente baseada na data

---

### **TESTE 8: CPF Opcional** 🔒

**Objetivo:** Verificar que CPF é opcional

**Passos:**
1. ✅ Edite seu perfil
2. ✅ Veja o campo **CPF**
3. ✅ Deve ter texto: "(opcional)"
4. ✅ Deve ter dica: "🔒 Usado apenas para participação em times ou torneios oficiais"
5. ✅ Tente salvar sem preencher CPF

**✅ ESPERADO:**
- Salva normalmente sem CPF
- Não exige preenchimento

---

## 🚨 ERROS COMUNS E SOLUÇÕES

### **ERRO 1: Cadastro não funciona**
```
SOLUÇÃO:
1. Limpe o cache do navegador
2. Abra uma aba anônima
3. Tente novamente
4. Se persistir, abra Console (F12) e envie logs
```

### **ERRO 2: Perfil não carrega**
```
SOLUÇÃO:
1. Faça logout e login novamente
2. Recarregue a página (F5)
3. Verifique se está realmente logado
4. Console (F12) para ver erros
```

### **ERRO 3: Apelido não aparece**
```
SOLUÇÃO:
1. Certifique-se de que preencheu o campo "Apelido"
2. Salvou o perfil
3. Recarregou a página
4. Se não funcionar, edite novamente
```

### **ERRO 4: Botão "Seguir" não muda**
```
SOLUÇÃO:
1. Aguarde 1-2 segundos após clicar
2. Veja se toast apareceu
3. Recarregue a página do perfil
4. Tente em outro navegador
```

---

## 📸 CHECKLIST VISUAL

### **✅ O QUE VOCÊ DEVE VER:**

**NO HEADER:**
- [ ] Botão "Meu Perfil" (quando logado)
- [ ] Botão "Sair"
- [ ] Logo VolleyPro

**NO SEU PERFIL:**
- [ ] Avatar grande com iniciais
- [ ] Nome (ou apelido se preencheu)
- [ ] Botão "Editar Perfil"
- [ ] Cards com: Idade, Altura, Peso, Sexo
- [ ] 3 Abas: Informações, Histórico, Conquistas

**NO PERFIL DE OUTRO ATLETA:**
- [ ] Botão "Seguir" (não "Seguindo" automaticamente)
- [ ] Botão "Enviar Mensagem"
- [ ] Informações públicas do atleta

**NO MODAL DE EDIÇÃO:**
- [ ] 12+ campos para preencher
- [ ] Scroll se tiver muitos campos
- [ ] Dicas em campos opcionais
- [ ] Botões "Cancelar" e "Salvar"

---

## 🎯 RESULTADO ESPERADO FINAL

Após completar todos os testes:

✅ Cadastro funciona no Chrome
✅ Consegue acessar próprio perfil
✅ Todos os campos salvam corretamente
✅ Apelido aparece no lugar do nome (se preenchido)
✅ Idade calculada automaticamente
✅ CPF é opcional
✅ Botão "Seguir" funciona (não segue automaticamente)
✅ Toast notifications aparecem
✅ Navegação fluida entre telas

---

## 🆘 PRECISA DE AJUDA?

**Se algo não funcionar:**

1. **Console do navegador (F12):**
   - Vá na aba "Console"
   - Copie TODAS as mensagens (principalmente as vermelhas)
   - Envie para mim

2. **Informações úteis:**
   - Navegador usado: Chrome / Firefox / Safari
   - Sistema operacional: Windows / Mac / Linux
   - Passo exato onde travou
   - Mensagem de erro que apareceu

3. **Screenshots:**
   - Tire print da tela onde ocorreu o erro
   - Me envie junto com a descrição

---

## 🎉 BOM TESTE!

Siga este checklist passo a passo e me avise:
- ✅ O que funcionou perfeitamente
- ❌ O que deu erro
- 💡 Sugestões de melhorias

**Vamos garantir que tudo está 100% funcional! 🏐⭐**

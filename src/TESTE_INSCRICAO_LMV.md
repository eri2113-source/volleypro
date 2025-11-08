# ✅ TESTE RÁPIDO - INSCRIÇÃO LMV

## 🎯 Objetivo
Validar que o botão "Inscrever Time" está funcionando perfeitamente.

## 📋 Pré-requisitos
- ✅ Deploy concluído na Vercel
- ✅ Conta criada como **TIME** (não atleta)
- ✅ Logado no site

## 🧪 Passo a Passo

### 1️⃣ Acesse o Site
```
https://voleypro.net
```

### 2️⃣ Faça Login
- Use sua conta de **TIME**
- Se não tiver, crie uma nova:
  - Clique em "Entrar"
  - "Criar conta"
  - Selecione: **"Sou um Time"**

### 3️⃣ Vá até Torneios
- Menu lateral: **"Torneios"** 🏆
- Ou clique no ícone de troféu

### 4️⃣ Encontre o LMV
- Procure: **"LMV - Liga Municipal de Vôlei"**
- Deve estar na aba **"Próximos"** (azul)

### 5️⃣ Clique em "Inscrever Time"
- Botão verde: **"🏐 Inscrever Time"**
- **NÃO** clique em "Ver Detalhes"

### 6️⃣ Verifique o Toast
Deve aparecer no canto superior direito:
```
✅ Time inscrito no torneio com sucesso!
```

### 7️⃣ Confirme a Inscrição
- Clique em **"Ver Detalhes"** agora
- Vá na aba **"Times Inscritos"**
- Seu time deve aparecer na lista!

## ❌ Se Algo Der Errado

### Erro: "Apenas times podem se inscrever"
- ✅ Você está logado como **atleta**
- 🔧 Solução: Crie/use conta de **time**

### Erro: "Time já está inscrito"
- ✅ Você já se inscreveu antes
- 🔧 Solução: Tudo certo! Vá para "Ver Detalhes"

### Erro: "Erro ao inscrever time"
- ❌ Bug no backend
- 🔧 Solução: 
  1. Abra o Console do Navegador (F12)
  2. Vá na aba "Console"
  3. Copie a mensagem de erro
  4. Me envie para análise

### Botão não aparece
- ✅ Você não está logado como time
- ✅ O torneio não aceita inscrições
- 🔧 Solução: Verifique se está logado corretamente

## 🎮 Teste Avançado

### Console do Navegador (F12)
Quando clicar em "Inscrever Time", deve aparecer:

```javascript
🔥 Inscrevendo time: {
  tournamentId: "...",
  teamId: "..."
}

✅ API: Inscrição retornou sucesso!
```

### Se aparecer erro:
```javascript
❌ API: Erro na inscrição!
  • Message: "..."
  • Status: ...
```

Copie a mensagem completa e me envie.

## 📊 Teste Com Múltiplos Times

1. **Time 1**: Inscreva normalmente
2. **Saia** e faça login com **Time 2**
3. **Inscreva Time 2** também
4. Ambos devem aparecer na lista

## ⚠️ Casos Especiais

### Torneio com Categorias (Masculino/Feminino)
- Se o torneio tiver categorias separadas
- Você precisará **selecionar a equipe** antes
- Use o modal de seleção de squad

### Time com Sub-equipes
- Se seu time tem categorias (Sub-18, Adulto, etc.)
- O sistema perguntará **qual equipe** inscrever
- Selecione e confirme

## 🎉 Sucesso!
Se tudo funcionar:
- ✅ Toast verde aparece
- ✅ Time aparece na lista
- ✅ Inscrição está salva no banco

**O bug está 100% corrigido!**

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Tire um **print** da tela
2. Copie o **erro do console** (F12)
3. Me envie os detalhes

---

**Boa sorte com o torneio! 🏐**

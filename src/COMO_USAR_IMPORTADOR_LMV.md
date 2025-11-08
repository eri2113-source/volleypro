# 🏐 Como Usar o Importador de Torneio LMV

## ✅ O que foi criado

Foi criado um **Importador de Torneio LMV** completo que transforma a tabela da imagem em um torneio editável no VolleyPro.

## 📍 Como Acessar

1. **Faça login** no VolleyPro (https://voleypro.net)
2. Clique no botão **"Mais..."** no menu superior
3. Selecione **"Importar LMV"**

## 🎯 Funcionalidades

### 1. Importar Torneio
- Clique em **"Importar Torneio"**
- O sistema criará automaticamente:
  - ✅ Torneio "Liga Municipal de Voleibol 2025 - 2ª Etapa - Masculino"
  - ✅ 13 partidas programadas (07/NOV a 09/NOV)
  - ✅ Times com escudos correspondentes do sistema
  - ✅ Estrutura de Chaves (A e B)
  - ✅ Formato completo: Grupos → Semifinais → Final

### 2. Times Incluídos

**Chave A:**
- CASTRO ALVES
- GLADIADORES
- SOBRINHOS B
- THE BLACKS

**Chave B:**
- ALPHA A
- MARKA SPORTS
- SOBRINHOS A

### 3. Editar Resultados

Para cada partida você pode:
- Clicar no botão **✏️ (Editar)**
- Inserir os placares dos 3 sets
- Clicar em **💾 (Salvar)** para confirmar
- Ou **✖️ (Cancelar)** para descartar

### 4. Estrutura das Partidas

Cada partida mostra:
- **Número do jogo** (1 a 13)
- **Fase** (Chave A/B, Semifinal, 3º Lugar, Final)
- **Data e horário**
- **Quadra**
- **Times com escudos** (quando disponíveis)
- **Placar editável** (3 sets)

### 5. Exportar para Banco

Depois de configurar os resultados:
- Clique em **"Exportar para Banco"**
- Todas as partidas serão salvas no banco de dados
- Os resultados ficarão disponíveis para todos os usuários

## 📊 Detalhes da Tabela Original

O importador recria fielmente a tabela com:

| Jogo | Data | Hora | Fase | Times |
|------|------|------|------|-------|
| 1 | 07/NOV Sex | 19:15 | Chave B | ALPHA A vs SOBRINHOS A |
| 2 | 07/NOV Sex | 19:15 | Chave A | CASTRO ALVES vs THE BLACKS |
| 3 | 07/NOV Sex | 20:45 | Chave A | CASTRO ALVES vs SOBRINHOS B |
| 4 | 08/NOV Sab | 09:00 | Chave A | GLADIADORES vs THE BLACKS |
| 5 | 08/NOV Sab | 10:30 | Chave B | MARKA SPORTS vs ALPHA A |
| 6 | 08/NOV Sab | 12:00 | Chave A | GLADIADORES vs SOBRINHOS B |
| 7 | 08/NOV Sab | 13:30 | Chave A | GLADIADORES vs CASTRO ALVES |
| 8 | 08/NOV Sab | 15:00 | Chave A | THE BLACKS vs SOBRINHOS B |
| 9 | 08/NOV Sab | 16:30 | Chave B | MARKA SPORTS vs SOBRINHOS A |
| 10 | 08/NOV Sab | 18:00 | Semifinal | 1º Chave A vs 2º Chave B |
| 11 | 08/NOV Sab | 19:30 | Semifinal | 1º Chave B vs 2º Chave A |
| 12 | 09/NOV Dom | 12:00 | 3º Lugar | Perdedor Jogo 10 vs Perdedor Jogo 11 |
| 13 | 09/NOV Dom | 13:30 | Final | Vencedor Jogo 10 vs Vencedor Jogo 11 |

## 🎨 Escudos dos Times

O sistema inclui **logos placeholder** para todos os times. Você pode **personalizá-los facilmente**:

### Como Adicionar Logos Reais:

1. **Clique no botão ✏️** ao lado do nome de cada time
2. **Cole a URL** da imagem do logo (PNG, JPG ou SVG)
3. **Visualize o preview** antes de salvar
4. **Clique em "Salvar Logo"**

**Mapeamento de nomes:**
- "CASTRO ALVES*" → CASTRO ALVES
- "GLADIADORES*" → GLADIADORES
- "MARKA SPORTS*" → MARKA SPORTS
- "CASTROS ALVES" → CASTRO ALVES (correção de digitação)

**Dica:** Hospede os logos no ImgBB, Imgur ou outro serviço de imagens para obter URLs diretas.

## 🔄 Fluxo Completo

```
1. Acessar "Importar LMV" no menu
        ↓
2. Clicar em "Importar Torneio"
        ↓
3. Sistema cria torneio + 13 partidas
        ↓
4. Editar resultados conforme jogos acontecem
        ↓
5. Clicar "Exportar para Banco"
        ↓
6. Torneio completo disponível no sistema!
```

## 💡 Dicas

- ✅ Você pode editar os resultados **quantas vezes quiser**
- ✅ Os escudos aparecem **automaticamente** se o time estiver cadastrado
- ✅ A interface é **totalmente responsiva** (mobile + desktop)
- ✅ Use "x" para indicar sets ainda não jogados
- ✅ O criador do torneio será automaticamente o usuário logado

## 🎯 Próximos Passos

Após importar e configurar:

1. **Atualize resultados** conforme os jogos acontecem
2. **Exporte para o banco** para salvar permanentemente
3. **Compartilhe** com os times participantes
4. **Acompanhe** as classificações em tempo real

## 🚀 Commit para Produção

Quando estiver pronto para publicar, faça:

```bash
git add .
git commit -m "feat: adiciona importador LMV com edição de resultados"
git push
```

---

**Criado especificamente para:** Liga Municipal de Voleibol 2025 - 2ª Etapa - Masculino  
**Data do torneio:** 07 a 09 de Novembro de 2025  
**Status:** ✅ Pronto para uso

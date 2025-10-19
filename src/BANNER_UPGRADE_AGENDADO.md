# 🗓️ Banner de Upgrade Agendado - Ativar Após Torneio

## 📅 Datas Importantes

| Data | Evento |
|------|--------|
| **19 de Outubro de 2025** | Data atual (hoje) |
| **07-09 de Novembro de 2025** | 🏐 **TORNEIO - Liga Municipal de Voleibol** |
| **10 de Novembro de 2025** | 🎯 **ATIVAÇÃO DO BANNER** (após torneio) |

---

## ✅ O QUE FOI FEITO

### **Banner "Desbloqueie Todo o Potencial do VolleyPro!" ESCONDIDO**

**Arquivo modificado:** `/components/UpgradeBanner.tsx`

### **Código Adicionado:**

```typescript
// 🎯 ATIVAR APENAS APÓS O TORNEIO (07, 08 e 09 de novembro = ativa em 10/11/2025)
const ACTIVATION_DATE = new Date('2025-11-10T00:00:00-03:00'); // 10 de novembro de 2025
const currentDate = new Date();

// Se ainda não chegou a data de ativação, não mostrar
if (currentDate < ACTIVATION_DATE) {
  return null;
}
```

---

## 🎯 Como Funciona

### **ANTES DE 10/11/2025:**
```
✅ Usuário logado (plano Free)
❌ Banner NÃO APARECE
✅ Feed normal sem banner de upgrade
🏐 TORNEIO acontecendo (07-09/11)
```

### **APÓS 10/11/2025:**
```
✅ Usuário logado (plano Free)
✅ Banner APARECE automaticamente
✅ Incentivo para fazer upgrade
🏆 Torneio concluído
```

---

## 📊 Comparação

### **ANTES (até 09/11/2025 23:59):**
```
Feed.tsx
├─ Posts
├─ Comentários
├─ Reações
└─ (sem banner de upgrade)
└─ 🏐 TORNEIO EM ANDAMENTO (07-09/11)
```

### **DEPOIS (a partir de 10/11/2025 00:00):**
```
Feed.tsx
├─ 🎉 Banner de Upgrade (aparece!)
│   ├─ "Desbloqueie Todo o Potencial do VolleyPro! 🚀"
│   ├─ Potencial: R$ 2K-10K/mês
│   ├─ Comissão: 70-80%
│   └─ Botão "Ver Planos"
├─ Posts
├─ Comentários
└─ Reações
└─ ✅ Torneio concluído
```

---

## ⚙️ Detalhes Técnicos

### **1. Verificação Automática**
- Sistema verifica data automaticamente
- Nenhuma intervenção manual necessária
- Banner aparece automaticamente após 03/11/2025

### **2. Timezone**
- Timezone: **GMT-3** (Brasília)
- Data exata: **10/11/2025 00:00:00** (meia-noite)
- Ativa no dia seguinte ao fim do torneio

### **3. Comportamento Após Ativação**
- Banner aparece para usuários **plano Free**
- Usuários podem **dispensar** o banner
- Banner volta a aparecer após **7 dias** (se dispensado)

---

## 🧪 Como Testar

### **Método 1: Mudar Data do Computador (Local)**
```
1. Ir em Configurações → Data e Hora
2. Desativar "Definir hora automaticamente"
3. Mudar para 04/11/2025
4. Abrir site (localhost)
5. ✅ Banner deve aparecer!
```

### **Método 2: Mudar Código Temporariamente**
```typescript
// APENAS PARA TESTE - NÃO COMMITAR!
const ACTIVATION_DATE = new Date('2025-10-19T00:00:00-03:00'); // Hoje
```

### **Método 3: Console do Navegador**
```javascript
// Ver quantos dias faltam
const activationDate = new Date('2025-11-10T00:00:00-03:00');
const today = new Date();
const daysLeft = Math.ceil((activationDate - today) / (1000 * 60 * 60 * 24));
console.log(`Faltam ${daysLeft} dias para ativar o banner`);
```

---

## 📝 Para Alterar a Data de Ativação

Se precisar mudar a data (ex: adiar ou antecipar):

**Arquivo:** `/components/UpgradeBanner.tsx`

**Linha 14:**
```typescript
const ACTIVATION_DATE = new Date('2025-11-10T00:00:00-03:00');
```

**Exemplos:**

| Quer ativar em | Mudar para |
|----------------|------------|
| 1 semana (26/10) | `'2025-10-26T00:00:00-03:00'` |
| 10 dias (29/10) | `'2025-10-29T00:00:00-03:00'` |
| 20 dias (08/11) | `'2025-11-08T00:00:00-03:00'` |
| 1 mês (19/11) | `'2025-11-19T00:00:00-03:00'` |

---

## ✅ Checklist de Publicação

Quando publicar essa mudança na Vercel:

- [ ] Exportar projeto do Figma Make
- [ ] Copiar para pasta GitHub local
- [ ] GitHub Desktop: Commit
  - **Mensagem:** "Agendar banner de upgrade para 10/11/2025 (após torneio Liga Municipal)"
- [ ] GitHub Desktop: Push
- [ ] Aguardar Vercel (3 min)
- [ ] Testar em produção:
  - [ ] Banner NÃO aparece (antes de 10/11)
  - [ ] Feed normal funcionando
  - [ ] Console sem erros

---

## 🎯 Objetivo Estratégico

### **Por que esperar 15 dias?**

1. **🏐 Liga Municipal de Voleibol (07-09/11)**
   - Segunda Etapa do torneio
   - Foco total na competição
   - Sem distrações de monetização
   - Experiência pura da plataforma

2. **📈 Construir Base de Usuários**
   - 22 dias para criar conteúdo
   - Ganhar seguidores
   - Ver o valor da plataforma
   - Cobertura do torneio

3. **💰 Monetização no Momento Certo**
   - Após torneio, usuários estarão engajados
   - Viram o potencial da plataforma
   - Mais propensos a fazer upgrade
   - Torneio gerou tráfego e engajamento

---

## 📊 Linha do Tempo

```
19/10 (Hoje)
│
├─ Usuários se cadastram
├─ Criam perfis
├─ Postam conteúdo
│
07-09/11 (TORNEIO)
│
├─ 🏐 Liga Municipal de Voleibol
├─ Segunda Etapa
├─ Premiação R$ 550 + Troféu + Medalhas
├─ Cobertura ao vivo
│
10/11 (Ativação)
│
├─ 🎉 Banner aparece!
├─ "Desbloqueie Todo o Potencial!"
├─ Usuários veem opções Premium
└─ Conversões para planos pagos
```

---

## ⚠️ IMPORTANTE

### **NÃO MEXER NESTA DATA SEM AVISO!**

A data de ativação (`03/11/2025`) está alinhada com:
- 📅 Calendário do torneio
- 🎯 Estratégia de marketing
- 💰 Lançamento da monetização

**Qualquer mudança deve ser:**
1. Discutida previamente
2. Documentada neste arquivo
3. Comunicada à equipe

---

## 📱 O Que os Usuários Veem

### **HOJE (19/10 - 09/11):**
```
Feed Limpo
├─ Posts de vôlei
├─ Comentários
├─ Reações
├─ 🏐 Torneio acontecendo (07-09/11)
└─ Sem banners de upgrade
```

### **APÓS TORNEIO (10/11+):**
```
Feed com Incentivo
├─ 🎉 Banner Premium
│   └─ "Ganhe R$ 2K-10K/mês!"
├─ Posts de vôlei
├─ Comentários
└─ Reações
```

---

## 🚀 Após Ativação

Quando o banner for ativado (03/11), você pode:

1. **Monitorar conversões:**
   - Quantos clicaram "Ver Planos"
   - Quantos fizeram upgrade
   - Taxa de conversão

2. **Ajustar mensagem:**
   - Se necessário, alterar textos
   - Otimizar valores exibidos
   - Testar diferentes CTAs

3. **Campanhas de Marketing:**
   - E-mail para usuários Free
   - Posts sobre monetização
   - Depoimentos de primeiros Premium

---

## ✅ Status Atual

| Item | Status |
|------|--------|
| **Código implementado** | ✅ Pronto |
| **Banner escondido até 03/11** | ✅ Ativo |
| **Teste local funcionando** | ✅ OK |
| **Publicado na Vercel** | ⏳ Aguardando |

---

## 📞 Suporte

Se precisar alterar algo:

1. **Adiar ativação:** Mudar data na linha 14 do arquivo
2. **Antecipar ativação:** Mudar data na linha 14 do arquivo
3. **Desativar permanentemente:** Comentar linha `if (currentDate < ACTIVATION_DATE)`
4. **Testar agora:** Mudar data para hoje temporariamente

---

**Arquivo criado em:** 19/10/2025  
**Ativação agendada para:** 10/11/2025 (22 dias)  
**Torneio:** Liga Municipal de Voleibol (07-09/11/2025)  
**Status:** ⏰ Aguardando torneio  

# ✅ SISTEMA DE CATEGORIAS MÚLTIPLAS COM FORMATOS DIFERENTES

## 🎯 OBJETIVO

Permitir que o Torneio LMV tenha:
- **MASCULINO (7 times):** Formato de CHAVES com 2 grupos
- **FEMININO (4 times):** Formato TODOS CONTRA TODOS

Tudo dentro do **MESMO TORNEIO**!

---

## 📦 ARQUIVOS CRIADOS

### **1. Componente Frontend**
**Arquivo:** `/components/TournamentCategoryFormatManager.tsx`

**O que faz:**
- Interface visual para configurar formatos das categorias
- Permite escolher entre "Chaves" ou "Todos contra Todos"
- Configura número de grupos e times que avançam
- Mostra resumo de todas as categorias

**Como usar:**
```tsx
import { TournamentCategoryFormatManager } from './components/TournamentCategoryFormatManager';

<TournamentCategoryFormatManager
  tournamentId="tournament:1730909876543"
  categories={[
    {
      name: "Masculino",
      format: "groups",
      numGroups: 2,
      advancingPerGroup: 2,
      teams: ["team1", "team2", "team3", ...]
    },
    {
      name: "Feminino",
      format: "round_robin",
      teams: ["team1", "team2", ...]
    }
  ]}
  onSave={(categories) => {
    // Salvar configuração
  }}
  canEdit={true}
/>
```

---

### **2. API Backend**
**Arquivo:** `/supabase/functions/server/index.tsx`

**Rotas Adicionadas:**

#### **POST** `/tournaments/:tournamentId/category-formats`
Salva configuração das categorias

**Request:**
```json
{
  "categories": [
    {
      "name": "Masculino",
      "format": "groups",
      "numGroups": 2,
      "teamsPerGroup": 3.5,
      "advancingPerGroup": 2,
      "teams": ["team1", "team2", ...]
    },
    {
      "name": "Feminino",
      "format": "round_robin",
      "teams": ["team1", "team2", ...]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "categoryFormats": [...]
}
```

#### **GET** `/tournaments/:tournamentId/category-formats`
Busca configuração das categorias

**Response:**
```json
{
  "categoryFormats": [...]
}
```

---

### **3. API Frontend**
**Arquivo:** `/lib/tournamentCategoryApi.ts`

**Funções Disponíveis:**

```typescript
// Salvar configuração
await saveCategoryFormats(tournamentId, categories);

// Buscar configuração
const { categoryFormats } = await getCategoryFormats(tournamentId);

// Gerar grupos automaticamente
const groups = generateGroups(['team1', 'team2', ...], 2);
// Resultado: { A: ['team1', 'team3'], B: ['team2', 'team4'] }

// Gerar jogos de todos contra todos
const matches = generateRoundRobinMatches(['team1', 'team2', 'team3', 'team4']);
// Resultado: [['team1', 'team2'], ['team1', 'team3'], ...]

// Calcular número ideal de grupos
const numGroups = calculateOptimalGroups(7); // Retorna 2

// Obter descrição do formato
const description = getBracketFormat(categoryFormat);
// Retorna: "2 Grupos • 2 avançam" ou "Todos contra Todos"
```

---

## 📚 DOCUMENTAÇÃO

### **1. Guia Completo**
**Arquivo:** `/🏐_TORNEIO_LMV_MULTIPLAS_CATEGORIAS.md`
- 15 páginas de documentação detalhada
- Passo a passo visual
- Cronograma sugerido (3 dias)
- Tabelas completas de jogos
- FAQs

### **2. Guia Rápido**
**Arquivo:** `/⚡_LMV_CONFIG_RAPIDA.md`
- Resumo executivo (1 página)
- Configuração em 5 passos
- Código de exemplo
- Checklist

---

## 🎮 COMO USAR NO VOLLEYPRO

### **PASSO 1: Integrar o Componente**

No arquivo `/components/TournamentDetails.tsx` ou `/components/TournamentDetailsModal.tsx`:

```typescript
import { TournamentCategoryFormatManager } from './TournamentCategoryFormatManager';
import { tournamentCategoryApi } from '../lib/tournamentCategoryApi';
import { useState, useEffect } from 'react';

// Dentro do componente:
const [categoryFormats, setCategoryFormats] = useState([]);

// Carregar formatos existentes
useEffect(() => {
  loadCategoryFormats();
}, [tournamentId]);

async function loadCategoryFormats() {
  try {
    const { categoryFormats } = await tournamentCategoryApi.getCategoryFormats(tournamentId);
    setCategoryFormats(categoryFormats);
  } catch (error) {
    console.error('Erro ao carregar formatos:', error);
  }
}

// Salvar formatos
async function handleSaveCategoryFormats(categories) {
  try {
    await tournamentCategoryApi.saveCategoryFormats(tournamentId, categories);
    toast.success('Configuração salva!');
  } catch (error) {
    toast.error('Erro ao salvar configuração');
  }
}

// Renderizar
<TournamentCategoryFormatManager
  tournamentId={tournamentId}
  categories={categoryFormats}
  onSave={handleSaveCategoryFormats}
  canEdit={isOrganizer}
/>
```

---

### **PASSO 2: Adicionar Aba nas Configurações**

Em `/components/TournamentDetails.tsx`, adicionar nova aba:

```tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
    <TabsTrigger value="teams">Times</TabsTrigger>
    <TabsTrigger value="schedule">Jogos</TabsTrigger>
    {/* NOVA ABA */}
    <TabsTrigger value="categories">Categorias</TabsTrigger>
  </TabsList>
  
  {/* ... outras tabs ... */}
  
  <TabsContent value="categories">
    <TournamentCategoryFormatManager
      tournamentId={tournament.id}
      categories={categoryFormats}
      onSave={handleSaveCategoryFormats}
      canEdit={isOrganizer}
    />
  </TabsContent>
</Tabs>
```

---

## 🔧 CONFIGURAÇÃO PARA O LMV

### **Dados para Copiar e Colar:**

```typescript
const lmvCategoryFormats = [
  {
    name: "Masculino",
    format: "groups",
    numGroups: 2,
    teamsPerGroup: 3.5, // 4 times no grupo A, 3 no grupo B
    advancingPerGroup: 2,
    teams: [
      "the-blacks",
      "sobrinhos-a",
      "sobrinhos-b",
      "alpha-a",
      "gladiadores",
      "marka-sports",
      "castro-alves"
    ]
  },
  {
    name: "Feminino",
    format: "round_robin",
    teams: [
      "volei-vera",
      "lotus",
      "marka-sports-fem",
      "buriti"
    ]
  }
];

// Salvar
await tournamentCategoryApi.saveCategoryFormats(
  "tournament:lmv-2025",
  lmvCategoryFormats
);
```

---

## 📊 ESTRUTURA DE DADOS

### **No Banco de Dados (KV Store):**

```json
{
  "id": "tournament:1730909876543",
  "name": "Liga Municipal de Vôlei - LMV",
  "categoryFormats": [
    {
      "name": "Masculino",
      "format": "groups",
      "numGroups": 2,
      "teamsPerGroup": 3.5,
      "advancingPerGroup": 2,
      "teams": ["team1", "team2", ...]
    },
    {
      "name": "Feminino",
      "format": "round_robin",
      "teams": ["team1", "team2", ...]
    }
  ]
}
```

---

## ✅ VALIDAÇÕES IMPLEMENTADAS

### **Frontend:**
- ✅ Formato deve ser "groups" ou "round_robin"
- ✅ Para chaves: numGroups >= 1
- ✅ Para chaves: advancingPerGroup <= teamsPerGroup
- ✅ Categoria deve ter nome e formato

### **Backend:**
- ✅ Verificar permissões (apenas organizador)
- ✅ Validar formato de categoria
- ✅ Validar campos obrigatórios
- ✅ Verificar se torneio existe
- ✅ Salvar com timestamp de atualização

---

## 🎯 FUNCIONALIDADES

### **✅ O QUE JÁ FUNCIONA:**

1. **Salvar configuração** de múltiplas categorias
2. **Buscar configuração** salva
3. **Interface visual** para gerenciar
4. **Validações** completas
5. **Permissões** de edição
6. **Funções auxiliares:**
   - Calcular grupos ideais
   - Gerar sorteio de grupos
   - Gerar jogos todos contra todos
   - Descrição automática do formato

### **⏳ PRÓXIMOS PASSOS (Opcional):**

1. Aplicar filtros nas abas (Classificação/Jogos) por categoria
2. Painel LED com alternância entre categorias
3. Estatísticas separadas por categoria
4. Prêmios por categoria

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Backend:**
- [x] Rota POST para salvar formatos
- [x] Rota GET para buscar formatos
- [x] Validações de permissão
- [x] Validações de dados
- [x] Salvar no KV Store

### **Frontend - API:**
- [x] Função saveCategoryFormats
- [x] Função getCategoryFormats
- [x] Funções auxiliares (generateGroups, etc.)
- [x] Tipos TypeScript (CategoryFormat)

### **Frontend - Componente:**
- [x] TournamentCategoryFormatManager
- [x] Interface de seleção de formato
- [x] Configuração de grupos
- [x] Preview de configuração
- [x] Validações visuais

### **Documentação:**
- [x] Guia completo (15 páginas)
- [x] Guia rápido (1 página)
- [x] Exemplos de código
- [x] FAQs

---

## 🚀 DEPLOY

### **Arquivos para Commit:**

```bash
# Componente
/components/TournamentCategoryFormatManager.tsx

# API Frontend
/lib/tournamentCategoryApi.ts

# Backend (já modificado)
/supabase/functions/server/index.tsx

# Documentação
/🏐_TORNEIO_LMV_MULTIPLAS_CATEGORIAS.md
/⚡_LMV_CONFIG_RAPIDA.md
/✅_SISTEMA_CATEGORIAS_MULTIPLAS_PRONTO.md
```

### **Mensagem de Commit:**

```
🏆 Sistema de categorias múltiplas com formatos diferentes

- Componente TournamentCategoryFormatManager
- API tournamentCategoryApi com funções auxiliares
- Rotas backend para salvar/buscar formatos
- Documentação completa
- Suporte para chaves E todos contra todos
- Preparado para Torneio LMV

Permite configurar diferentes formatos por categoria:
- Masculino: 2 grupos, melhores avançam
- Feminino: Todos contra todos
```

---

## 💡 EXEMPLO DE USO

### **Cenário: Torneio LMV**

**Organizador acessa:**
1. Vai em "Torneios" → "Liga Municipal LMV"
2. Clica em "Configurações"
3. Vai na aba "Categorias"
4. Vê o componente TournamentCategoryFormatManager

**Configuração Masculino:**
1. Seleciona "Masculino"
2. Escolhe formato "Chaves"
3. Define: 2 grupos
4. Define: 2 times avançam por grupo
5. Vê preview: "Grupo A: 4 times, Grupo B: 3 times"

**Configuração Feminino:**
1. Seleciona "Feminino"
2. Escolhe formato "Todos contra Todos"
3. Vê preview: "4 times, 6 jogos no total"

**Salvar:**
1. Clica em "Salvar Configuração"
2. Sistema valida e salva
3. Toast de sucesso aparece
4. Configuração fica salva no banco

**Resultado:**
- Masculino terá chaveamento com grupos
- Feminino terá tabela de pontos corrida
- Ambos no mesmo torneio!

---

## 🎉 BENEFÍCIOS

### **Para o Organizador:**
✅ Flexibilidade total
✅ Configuração simples
✅ Visual intuitivo
✅ Validações automáticas
✅ Sem erro de configuração

### **Para os Times:**
✅ Formatos adequados por categoria
✅ Masculino: mais jogos eliminatórios
✅ Feminino: todos jogam o mesmo número de vezes
✅ Justiça esportiva

### **Para o VolleyPro:**
✅ Sistema escalável
✅ Suporta N categorias
✅ Suporta N formatos
✅ Código limpo e documentado
✅ Pronto para produção

---

## 🆘 SUPORTE

### **Problemas Comuns:**

**1. "Não consigo salvar a configuração"**
- Verificar se está logado
- Verificar se é organizador do torneio
- Verificar console do navegador para erros

**2. "Times não aparecem na categoria"**
- Verificar se times estão inscritos no torneio
- Verificar se array de teams está correto
- Verificar se IDs dos times estão corretos

**3. "Validação falha ao salvar"**
- Verificar se numGroups >= 1
- Verificar se advancingPerGroup <= teamsPerGroup
- Verificar se formato é "groups" ou "round_robin"

---

## 📞 CONTATO

**Dúvidas sobre implementação:**
- Revisar documentação em `/🏐_TORNEIO_LMV_MULTIPLAS_CATEGORIAS.md`
- Revisar exemplos em `/⚡_LMV_CONFIG_RAPIDA.md`
- Verificar código em `/components/TournamentCategoryFormatManager.tsx`

---

**SISTEMA COMPLETO E PRONTO PARA USO! 🏐🏆**

**#VolleyPro #TorneioLMV #MultiplasCategor ias #SistemaCompleto**

---

*Criado em: 06/11/2025*
*Versão: 1.0 - Production Ready*

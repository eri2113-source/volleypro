# ⚡ CONFIGURAÇÃO RÁPIDA - TORNEIO LMV

## 🎯 RESUMO EXECUTIVO

**MASCULINO (7 times)** → Chaves com 2 grupos  
**FEMININO (4 times)** → Todos contra todos

---

## 📱 CONFIGURAR EM 5 PASSOS

### **1️⃣ ACESSAR TORNEIO**
```
VolleyPro → Torneios → Liga Municipal LMV → Configurações
```

### **2️⃣ MASCULINO**
```
✅ Categoria: Masculino
✅ Formato: Chaves
✅ Grupos: 2 (A e B)
✅ Avançam: 2 por grupo
✅ Times: 7
```

### **3️⃣ FEMININO**
```
✅ Categoria: Feminino
✅ Formato: Todos contra Todos
✅ Times: 4
✅ Jogos: 6 partidas
```

### **4️⃣ INSCREVER TIMES**

**Masculino:**
- The Blacks ✅
- Sobrinhos A
- Sobrinhos B
- Alpha A ✅
- Gladiadores ✅
- MarKa Sports ✅
- Castro Alves ✅

**Feminino:**
- Volei Vera ✅
- Lótus ✅
- Marka Sports ✅
- Buriti ✅

### **5️⃣ SORTEAR/GERAR**

**Masculino:** Clicar em "Realizar Sorteio"  
**Feminino:** Clicar em "Gerar Tabela"

---

## 📊 RESULTADO ESPERADO

### **MASCULINO (13 jogos)**
```
Fase 1: Grupos (9 jogos)
├─ Grupo A: 6 jogos
└─ Grupo B: 3 jogos

Fase 2: Semifinais (2 jogos)
├─ 1º A vs 2º B
└─ 1º B vs 2º A

Fase 3: Finais (2 jogos)
├─ 3º Lugar
└─ FINAL
```

### **FEMININO (6 jogos)**
```
Todos contra Todos
├─ Rodada 1: 2 jogos
├─ Rodada 2: 2 jogos
└─ Rodada 3: 2 jogos

🏆 Campeã = Mais Pontos
```

---

## 🎮 COMPONENTE CRIADO

Arquivo: `/components/TournamentCategoryFormatManager.tsx`

**Como usar:**
```tsx
<TournamentCategoryFormatManager
  tournamentId="lmv-2025"
  categories={[
    {
      name: "Masculino",
      format: "groups",
      numGroups: 2,
      advancingPerGroup: 2,
      teams: ["time1", "time2", ...]
    },
    {
      name: "Feminino",
      format: "round_robin",
      teams: ["time1", "time2", ...]
    }
  ]}
  onSave={(cats) => console.log(cats)}
  canEdit={true}
/>
```

---

## ⚙️ BACKEND NECESSÁRIO

### **Nova Rota: Salvar Configuração**

```typescript
// POST /tournaments/:id/category-formats
{
  categories: [
    {
      name: "Masculino",
      format: "groups",
      numGroups: 2,
      advancingPerGroup: 2
    },
    {
      name: "Feminino",
      format: "round_robin"
    }
  ]
}
```

### **Atualizar Rota Existente**

```typescript
// GET /tournaments/:id
// Retornar campo "categoryFormats"
```

---

## 📅 CRONOGRAMA (3 DIAS)

**DIA 1:** Grupos Masc. + Rodada 1 Fem.  
**DIA 2:** Finalizar Grupos + Rodadas 2-3 Fem.  
**DIA 3:** Semifinais + Finais

**TOTAL:** 19 jogos

---

## ✅ CHECKLIST

- [ ] Componente criado
- [ ] Backend atualizado (rota de save)
- [ ] Times inscritos nas categorias
- [ ] Sorteio/Tabela gerados
- [ ] Horários definidos
- [ ] Painel LED configurado

---

**PRONTO EM 5 MINUTOS! 🚀**

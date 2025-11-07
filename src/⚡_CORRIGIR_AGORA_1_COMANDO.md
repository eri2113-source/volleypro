# ⚡ CORRIGIR ERRO EM 1 COMANDO

## ❌ ERRO ATUAL

```
Expected unicode escape at line 4795:80
...correto`);\n      console.error(`...
```

**Problema:** Linha 4795 tem `\n` FORA da string causando erro de sintaxe

---

## ✅ SOLUÇÃO - 1 COMANDO

### Windows:
```cmd
CORRIGIR_E_DEPLOY.bat
```

### Linux/Mac:
```bash
chmod +x CORRIGIR_E_DEPLOY.sh
./CORRIGIR_E_DEPLOY.sh
```

---

## 🎯 O QUE VAI ACONTECER

1. ✅ Script Python corrige linha 4795
2. ✅ Simplifica `teamData = team`
3. ✅ Atualiza mensagens de log
4. ✅ Faz commit automático
5. ✅ Push para produção
6. ⏰ Deploy em 2-3 minutos

---

## 📋 LINHA 4795 - ANTES (QUEBRADO):

```typescript
console.error(`...correto`);\n      console.error(`...`);
                            ^^ ESCAPE FORA DA STRING
```

## 📋 LINHA 4795 - DEPOIS (CORRETO):

```typescript
console.error(`...inválido`);
console.error(`      • team exists:`, !!team);
```

---

## ⏰ APÓS EXECUTAR

1. **Aguarde** 2-3 minutos (deploy automático Vercel)
2. **Acesse** https://voleypro.net
3. **Teste** inscrição do torneio LMV
4. ✅ **Funcionando!**

---

## 🚀 EXECUTE AGORA

**Windows:** `CORRIGIR_E_DEPLOY.bat`

**Linux/Mac:** `./CORRIGIR_E_DEPLOY.sh`

**1 comando resolve tudo!** 🎯

# ⚡ CONFIGURAR LIVEKIT - GUIA RÁPIDO

## ✅ **CÓDIGO JÁ ESTÁ IMPLEMENTADO!**

O sistema híbrido já está funcionando:
- ✅ **LiveKit configurado:** Streaming profissional HD 60 FPS
- ✅ **LiveKit NÃO configurado:** Fallback experimental 1 FPS

---

## 🚀 **PASSO A PASSO - 15 MINUTOS:**

### **1. CRIAR CONTA LIVEKIT** (5 min)

```bash
1. Acesse: https://cloud.livekit.io
2. Clique "Sign Up"
3. Use email ou Google/GitHub
4. Verifique email
5. ✅ Conta criada!
```

---

### **2. CRIAR PROJETO** (2 min)

```bash
1. No dashboard LiveKit, clique "Create Project"
2. Nome do projeto: "VolleyPro Campeonatos"
3. Região: Selecione "São Paulo" (ou mais próxima)
   • us-west-2 (Califórnia)
   • us-east-1 (Virginia)
   • eu-central-1 (Frankfurt)
4. Clique "Create Project"
5. ✅ Projeto criado!
```

---

### **3. GERAR API KEYS** (3 min)

```bash
1. No projeto, vá em "Settings" → "Keys"
2. Clique "Generate Key Pair"
3. Copie os 3 valores:

   API Key: lk_api_xxxxxxxxxxxxxxxxxxxx
   API Secret: yyyyyyyyyyyyyyyyyyyyyyyyyyy
   WebSocket URL: wss://volleypro-xxxxx.livekit.cloud

4. ⚠️ GUARDE EM SEGURANÇA!
   (Você só verá o Secret uma vez)
```

---

### **4. CONFIGURAR SECRETS NO SUPABASE** (5 min)

```bash
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto VolleyPro
3. Vá em "Project Settings" → "Edge Functions"
4. Clique na aba "Secrets"
5. Adicione os 3 secrets:

   Nome: LIVEKIT_API_KEY
   Valor: lk_api_xxxxxxxxxxxxxxxxxxxx
   [Add Secret]

   Nome: LIVEKIT_API_SECRET
   Valor: yyyyyyyyyyyyyyyyyyyyyyyyyyy
   [Add Secret]

   Nome: LIVEKIT_URL
   Valor: wss://volleypro-xxxxx.livekit.cloud
   [Add Secret]

6. ✅ Secrets configurados!
```

---

### **5. DEPLOY DAS EDGE FUNCTIONS** (1 min)

```bash
# Se você está usando a CLI do Supabase:
supabase functions deploy

# OU: As funções já devem estar deployadas
# Quando você acessar a live, vai usar automaticamente!
```

---

## ✅ **PRONTO! TESTANDO:**

### **Teste 1: Verificar se está configurado**

```bash
1. Abra Console do navegador (F12)
2. Crie ou abra uma live
3. Procure no console:

   ✅ "LiveKit configurado e disponível!"
   ✅ "Usando streaming profissional HD 60 FPS"

   OU

   ⚠️ "LiveKit não configurado"
   ⚠️ "Usando sistema experimental 1 FPS"
```

### **Teste 2: Transmitir com LiveKit**

```bash
1. Crie uma live no VolleyPro
2. Clique "Iniciar Live"
3. Permitir webcam

SE LIVEKIT CONFIGURADO:
✅ Vê badge: "TRANSMITINDO AO VIVO HD"
✅ Vídeo fluido 60 FPS
✅ Áudio sincronizado
✅ Controles profissionais

SE LIVEKIT NÃO CONFIGURADO:
⚠️ Vê badge: "Modo Experimental (1 fps)"
⚠️ Vídeo 1 FPS
⚠️ Sem áudio
⚠️ Sistema fallback
```

---

## 🎯 **CHECKLIST:**

- [ ] Conta LiveKit criada
- [ ] Projeto criado
- [ ] API keys geradas
- [ ] 3 secrets configurados no Supabase:
  - [ ] LIVEKIT_API_KEY
  - [ ] LIVEKIT_API_SECRET
  - [ ] LIVEKIT_URL
- [ ] Edge functions deployed
- [ ] Testado criando uma live
- [ ] Confirmado que badge mostra "HD"

---

## 🐛 **TROUBLESHOOTING:**

### **Problema: "LiveKit não configurado"**

```bash
CAUSA: Secrets não foram salvos corretamente

SOLUÇÃO:
1. Verifique os 3 secrets no Supabase
2. Certifique que os nomes estão EXATOS:
   • LIVEKIT_API_KEY (não livekit_api_key)
   • LIVEKIT_API_SECRET
   • LIVEKIT_URL
3. Certifique que não tem espaços extras
4. Faça redeploy: supabase functions deploy
```

### **Problema: "Token inválido"**

```bash
CAUSA: API Key ou Secret incorretos

SOLUÇÃO:
1. Volte no LiveKit Dashboard
2. Settings → Keys
3. Gere um NOVO par de keys
4. Atualize os secrets no Supabase
5. Aguarde 1-2 minutos
6. Tente novamente
```

### **Problema: "Failed to connect"**

```bash
CAUSA: WebSocket URL incorreta

SOLUÇÃO:
1. Verifique LIVEKIT_URL no Supabase
2. Deve começar com: wss://
3. Deve terminar com: .livekit.cloud
4. Copie exatamente do LiveKit Dashboard
```

### **Problema: "Ainda usando sistema experimental"**

```bash
CAUSA: Secrets não foram aplicados

SOLUÇÃO:
1. Abra Console (F12)
2. Procure por erro de token
3. Verifique todos os 3 secrets
4. Faça redeploy das functions
5. Recarregue a página
```

---

## 💰 **CUSTOS - LEMBRE-SE:**

### **Plan Gratuito (Starter):**
```
• $0/mês
• 1000 minutos inclusos
• 50 viewers simultâneos
• Perfeito para TESTAR
```

### **Quando precisa pagar:**
```
• Mais de 1000 minutos/mês
• Mais de 50 viewers simultâneos
• Gravações em HD
• Analytics avançado

→ Plan Developer: $49/mês
→ Plan Growth: $199/mês
```

---

## 📊 **COMPARAÇÃO VISUAL:**

### **SEM LIVEKIT (Experimental):**
```
┌─────────────────────────────────────┐
│ 🧪 Modo Experimental (1 fps)        │
│                                     │
│  [Imagem atualiza a cada 1s]       │
│  Sem áudio                          │
│  ~10-20 viewers                     │
│  $0/mês                             │
└─────────────────────────────────────┘
```

### **COM LIVEKIT (Profissional):**
```
┌─────────────────────────────────────┐
│ 🎥 TRANSMITINDO AO VIVO HD          │
│                                     │
│  [Vídeo fluido 60 FPS]             │
│  Áudio HD sincronizado              │
│  100-1000+ viewers                  │
│  $0-199/mês (conforme uso)          │
└─────────────────────────────────────┘
```

---

## 🎬 **PRÓXIMOS PASSOS:**

### **Depois de configurar:**

1. **Teste com live real:**
   - Crie live
   - Transmita 5 minutos
   - Verifique qualidade

2. **Teste com espectador:**
   - Outra aba/dispositivo
   - Assista a live
   - Confirme vídeo fluido

3. **Configure gravações (opcional):**
   - LiveKit Dashboard → Settings → Recording
   - Enable "Auto Recording"
   - Gravações em HD automáticas

4. **Configure webhook (opcional):**
   - LiveKit Dashboard → Settings → Webhooks
   - URL: https://SEU_PROJETO.supabase.co/functions/v1/make-server-0ea22bba/livekit/webhook
   - Eventos: room_started, room_finished, etc

5. **Monitore uso:**
   - LiveKit Dashboard → Usage
   - Veja minutos consumidos
   - Planeje upgrade se necessário

---

## ✅ **RESUMO:**

```
Tempo total: ~15 minutos
Custo inicial: $0 (plano grátis)
Dificuldade: ⭐⭐⚪⚪⚪ (Fácil)

Resultado:
✅ Streaming profissional HD 60 FPS
✅ Áudio sincronizado
✅ 100+ espectadores simultâneos
✅ Gravações automáticas
✅ Sistema robusto para campeonatos

Sistema continua funcionando:
✅ Com LiveKit: Profissional
✅ Sem LiveKit: Experimental (fallback)
```

---

## 🎯 **CONFIGURAR AGORA:**

**Siga os 5 passos acima e em 15 minutos você terá streaming profissional!**

1. ✅ Criar conta LiveKit
2. ✅ Criar projeto
3. ✅ Gerar API keys
4. ✅ Configurar secrets
5. ✅ Testar!

---

**Qualquer dúvida, consulte o guia completo em `/GUIA_LIVEKIT_PROFISSIONAL.md`** 📚

**Bom streaming profissional! 🎥🚀**

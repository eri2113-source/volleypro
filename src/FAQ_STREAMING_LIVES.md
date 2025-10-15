# ❓ FAQ - STREAMING DE LIVES

## **PERGUNTAS FREQUENTES:**

---

### **1. Por que é "experimental"?**

**R:** Porque usa 1 frame por segundo ao invés de 30 FPS como vídeo profissional.

```
Experimental (ATUAL):
• 1 FPS = 1 frame por segundo
• Imagem atualiza devagar
• Grátis via Supabase
• Bom para demonstração

Profissional (FUTURO):
• 30-60 FPS = vídeo fluido
• Imagem atualiza instantaneamente
• ~$100-500/mês (LiveKit/Agora)
• Produção real
```

---

### **2. Por que não tem áudio?**

**R:** Áudio requer WebRTC peer-to-peer ou serviço externo.

```
Sistema atual:
✅ Vídeo via Realtime (frames)
❌ Áudio (precisa P2P ou serviço)

Para áudio seria necessário:
• WebRTC signaling server
• TURN/STUN servers
• Ou LiveKit/Agora/Cloudflare
```

---

### **3. Por que tem delay de 1-2 segundos?**

**R:** Supabase Realtime tem latência natural + captura de frames.

```
Delay total: 1-2 segundos
• Captura frame: ~100ms
• Compressão JPEG: ~50ms
• Envio Realtime: ~500-1000ms
• Recepção + decode: ~200ms
• TOTAL: ~1-2s

WebRTC seria <500ms
```

---

### **4. Quantos espectadores suporta?**

**R:** ~10-20 espectadores simultâneos.

```
Limite atual: 10-20
• Broadcast tem limites
• Cada frame ~30KB
• 30KB/s por espectador
• 20 espectadores = ~600KB/s

Com SFU profissional: 100-1000+
```

---

### **5. Posso melhorar a qualidade?**

**R:** Sim, mas com trade-offs.

```
Aumentar FPS (3-5 frames/s):
• Editar: broadcastInterval = 200ms (ao invés de 1000ms)
• ✅ Vídeo mais fluido
• ❌ Mais dados (90KB/s)
• ❌ Menos espectadores

Aumentar resolução:
• Editar: width: 1280, height: 720
• ✅ Imagem maior
• ❌ MUITO mais dados (~200KB/frame)
• ❌ Pode travar

Aumentar qualidade JPEG:
• Editar: quality: 0.8 (ao invés de 0.6)
• ✅ Imagem mais nítida
• ❌ Frames maiores (~50KB)
```

---

### **6. Por que o primeiro frame demora?**

**R:** Tempo de conexão + negociação Realtime.

```
Tempo de conexão:
1. Espectador abre live: 0s
2. Conecta ao canal: 1-3s
3. Canal estabelecido: +1s
4. Criador envia frame: +1s
5. Frame recebido: 5-10s total

Próximos frames: 1s cada
```

---

### **7. Funciona em celular?**

**R:** SIM! Em iOS e Android.

```
✅ Chrome Android
✅ Safari iOS
✅ Firefox Mobile
✅ Edge Mobile

Recomendado:
• Chrome (melhor)
• Boa conexão 4G/5G ou WiFi
```

---

### **8. Gasta muita internet?**

**R:** Não, é otimizado.

```
Criador (transmitindo):
• Upload: ~30KB/s
• 1 hora = ~108MB

Espectador (assistindo):
• Download: ~30KB/s  
• 1 hora = ~108MB

Comparação:
• Vídeo HD YouTube = 3MB/s (100x mais!)
• Vídeo profissional = 1-2MB/s
• Nossa live = 0.03MB/s (leve!)
```

---

### **9. Posso salvar/gravar a live?**

**R:** Não implementado, mas possível.

```
Sistema atual:
❌ Frames não são salvos
❌ Apenas transmissão ao vivo

Para salvar seria necessário:
• Salvar frames no Supabase Storage
• Montar vídeo depois (FFmpeg)
• Ou usar OBS Studio para gravar localmente
```

---

### **10. Por que vejo minha própria imagem espelhada?**

**R:** É o comportamento padrão da webcam (como espelho).

```
Criador vê: Imagem espelhada (normal)
Espectadores veem: Imagem normal (não espelhada)

Para desespelhar (criador):
• Adicionar CSS: transform: scaleX(-1)
• Mas confunde a maioria das pessoas
• Espelhar é padrão (Zoom, Meet, etc)
```

---

### **11. Posso usar filtros/efeitos?**

**R:** Sim, é possível adicionar.

```
Possível adicionar:
✅ Blur de fundo
✅ Filtros de cor
✅ Overlays/logos
✅ Textos/legendas

Requer:
• Editar LiveStreamBroadcast.tsx
• Aplicar filtros no canvas
• Exemplos disponíveis online
```

---

### **12. É seguro? Quem pode ver?**

**R:** Sim, apenas usuários autenticados.

```
Segurança:
✅ Apenas usuários logados
✅ Canal específico da live (liveId)
✅ Dados temporários (não salvos)
✅ Supabase RLS (Row Level Security)

NÃO podem ver:
❌ Usuários não logados
❌ Outras lives (canal separado)
❌ Histórico (não salvo)
```

---

### **13. Posso adicionar chat de voz/vídeo?**

**R:** Possível, mas complexo.

```
Sistema atual:
✅ Chat de texto (funciona!)
❌ Voz/vídeo entre espectadores

Para adicionar:
• WebRTC mesh ou SFU
• Servidor de signaling
• TURN servers
• OU usar LiveKit SDK
```

---

### **14. Por que frames param de atualizar?**

**R:** Possíveis causas:

```
1. Internet instável
   → Reconecte WiFi/4G

2. Aba em segundo plano
   → Mantenha aba ativa

3. Criador pausou câmera
   → Criador deve reativar

4. Broadcast travou
   → Criador: feche e reabra live

5. Canal desconectou
   → Espectador: recarregue página
```

---

### **15. Posso ter múltiplas lives simultâneas?**

**R:** SIM! Cada live tem canal separado.

```
✅ Live A: canal `live:123`
✅ Live B: canal `live:456`
✅ Live C: canal `live:789`

Não interferem entre si!
Cada canal independente.
```

---

### **16. Qual a diferença do Twitch/YouTube?**

**R:** São plataformas profissionais com infraestrutura.

```
VolleyPro (Atual):
• 1 FPS
• Delay 1-2s
• Grátis
• Experimental
• Para comunidade pequena

Twitch/YouTube:
• 30-60 FPS
• Delay <5s
• Infraestrutura global
• Profissional
• Milhões de viewers
• $$$ para manter
```

---

### **17. Vai melhorar no futuro?**

**R:** Pode! Depende do feedback.

```
Melhorias possíveis:
1. Aumentar para 3-5 FPS
2. Adicionar áudio
3. Integrar LiveKit (profissional)
4. Salvar/gravar lives
5. Filtros/efeitos
6. Chat de voz
7. Mais espectadores (100+)

Mas requer:
• Tempo de desenvolvimento
• Possível custo mensal ($)
• Testes extensivos
```

---

### **18. Como reporto bugs?**

**R:** Use o Debug Panel!

```
1. Clique "Debug Live" (botão amarelo)
2. Tire print da tela
3. Abra Console (F12)
4. Tire print do console
5. Descreva o problema
6. Me envie tudo!

Informações úteis:
• Navegador usado
• Dispositivo (PC/Mobile)
• Velocidade internet
• O que esperava vs o que aconteceu
```

---

### **19. Funciona offline?**

**R:** NÃO, precisa internet.

```
Requer internet para:
❌ Capturar webcam (funciona offline)
✅ Enviar frames (precisa internet!)
✅ Receber frames (precisa internet!)
✅ Autenticação (precisa internet!)
✅ Chat (precisa internet!)

Sem internet = não funciona
```

---

### **20. Vale a pena usar?**

**R:** Depende do seu objetivo!

```
✅ SIM, se você quer:
   • Demonstrar algo
   • Testar funcionalidade
   • Comunidade pequena (10-20)
   • Custo $0
   • Feedback rápido

❌ NÃO, se você precisa:
   • Vídeo profissional
   • 30+ FPS fluido
   • Áudio sincronizado
   • 100+ espectadores
   • Gravar/salvar
   • Zero delay

Para hobby/teste: ✅ PERFEITO!
Para profissional: ⚠️ Considere LiveKit
```

---

## 💡 **RESUMO DAS RESPOSTAS:**

| Pergunta | Resposta Curta |
|----------|----------------|
| Por que experimental? | 1 FPS ao invés de 30 FPS |
| Tem áudio? | Não (apenas vídeo) |
| Delay? | 1-2 segundos |
| Quantos espectadores? | ~10-20 simultâneos |
| Funciona em celular? | ✅ SIM! |
| Gasta muita internet? | Não (~30KB/s) |
| É seguro? | ✅ SIM! |
| Pode melhorar? | Sim, no futuro |
| Grátis? | ✅ SIM! |
| Vale a pena? | ✅ Para teste/demo SIM! |

---

## 🎯 **ÚLTIMA PALAVRA:**

Este sistema é **experimental** mas **funcional**!

```
✅ Espectadores VEEM você
✅ Atualiza em tempo real
✅ Grátis
✅ Simples de usar
✅ Bom para demonstração

⚠️ Não é Netflix/Twitch
⚠️ Vídeo não é fluido
⚠️ Sem áudio
⚠️ Delay existe

Para o objetivo do VolleyPro:
• Comunidade de vôlei
• Lives de treinos/jogos
• Transmissões curtas
• Interação via chat

É PERFEITO! 🎯
```

---

**Tem outra pergunta? Me pergunte! 💬**

Estou aqui para ajudar você a usar o sistema da melhor forma! 🚀

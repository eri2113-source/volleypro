# 🎥 GUIA COMPLETO: LiveKit Profissional para Campeonatos

## 🏆 **STREAMING PROFISSIONAL PARA CAMPEONATOS**

Este guia mostra como implementar LiveKit Cloud no VolleyPro para transmissões profissionais de campeonatos de vôlei.

---

## 📋 **O QUE VOCÊ VAI TER:**

```
✅ Vídeo 30-60 FPS (fluido como TV)
✅ Áudio sincronizado e limpo
✅ Latência ultra-baixa (<1s)
✅ 100-1000+ espectadores simultâneos
✅ Gravação automática de lives
✅ Qualidade HD (720p) ou FullHD (1080p)
✅ Chat de vídeo/voz entre comentaristas
✅ Compartilhamento de tela
✅ Múltiplas câmeras (quadra, placar, torcida)
✅ Estatísticas em tempo real
✅ Mobile (iOS/Android) compatível
```

---

## 💰 **CUSTOS ESTIMADOS:**

### **LiveKit Cloud Pricing:**

```
Plan Starter (até 1000 min/mês):
• $0 grátis (teste)
• 1000 minutos inclusos
• 50 viewers simultâneos

Plan Developer ($49/mês):
• 5000 minutos inclusos
• 100 viewers simultâneos
• Gravação incluída
• Suporte técnico

Plan Growth ($199/mês):
• 20000 minutos inclusos
• 500 viewers simultâneos
• Gravação HD
• Analytics avançado
• Suporte prioritário

Plan Business ($499/mês):
• 100000 minutos inclusos
• 2000+ viewers simultâneos
• Multi-região
• SLA 99.9%
• Suporte 24/7
```

### **Exemplo Campeonato:**

```
Campeonato de 10 jogos:
• 10 jogos x 90 min = 900 minutos
• 50 viewers médio
• Total: ~900 minutos de uso

Custo: $0-49/mês (Plan Starter ou Developer)

Campeonato grande (30 jogos):
• 30 jogos x 90 min = 2700 minutos
• 200 viewers médio
• Total: ~2700 minutos

Custo: $199/mês (Plan Growth)
```

---

## 🎯 **PASSO 1: CRIAR CONTA LIVEKIT**

### **1.1 Cadastro:**

```bash
1. Acesse: https://cloud.livekit.io
2. Clique "Sign Up"
3. Crie conta com email
4. Verifique email
5. ✅ Conta criada!
```

### **1.2 Criar Projeto:**

```bash
1. Dashboard → "Create Project"
2. Nome: "VolleyPro Campeonatos"
3. Região: "São Paulo" ou "us-west-2"
4. Clique "Create"
5. ✅ Projeto criado!
```

### **1.3 Obter Credenciais:**

```bash
1. Settings → API Keys
2. Clique "Generate API Key"
3. Copie:
   • API Key: lk_api_xxxxxxxxxxxx
   • API Secret: yyyyyyyyyyyyyyy
   • WebSocket URL: wss://vollleypro-xxxxx.livekit.cloud

4. ⚠️ GUARDE EM SEGURANÇA!
```

---

## 🔧 **PASSO 2: CONFIGURAR SUPABASE SECRETS**

Você precisa salvar as credenciais do LiveKit nos secrets do Supabase:

### **2.1 Via Supabase Dashboard:**

```bash
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto VolleyPro
3. Settings → Edge Functions → Secrets
4. Adicione os secrets:

   • LIVEKIT_API_KEY: lk_api_xxxxxxxxxxxx
   • LIVEKIT_API_SECRET: yyyyyyyyyyyyyyy
   • LIVEKIT_URL: wss://vollleypro-xxxxx.livekit.cloud

5. Clique "Add secret" para cada um
6. ✅ Secrets salvos!
```

### **2.2 Verificar no código:**

```typescript
// No servidor, você vai acessar assim:
const apiKey = Deno.env.get('LIVEKIT_API_KEY');
const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');
const wsUrl = Deno.env.get('LIVEKIT_URL');
```

---

## 📦 **PASSO 3: INSTALAR DEPENDÊNCIAS**

O LiveKit tem pacotes NPM para React. Vou instalá-los automaticamente quando criar os componentes.

```typescript
// Pacotes necessários (já vou importar no código):
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { Room, RoomEvent, Track } from 'livekit-client';
import { AccessToken } from 'livekit-server-sdk';
```

---

## 🎨 **PASSO 4: ARQUITETURA DO SISTEMA**

```
┌─────────────────────────────────────────────┐
│          CRIADOR (Transmissor)              │
│  ┌──────────────────────────────────┐       │
│  │  📹 Webcam + 🎤 Microfone        │       │
│  │  LiveKit SDK captura AV          │       │
│  │  Upload → LiveKit Cloud          │       │
│  └──────────────────────────────────┘       │
└─────────────────────────────────────────────┘
                    ↓
        📡 LiveKit Cloud SFU Server
        (Selective Forwarding Unit)
                    ↓
    ┌───────────┬───────────┬───────────┐
    ↓           ↓           ↓           ↓
┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐
│ 👤 1  │  │ 👤 2  │  │ 👤 3  │  │ 👤... │
│Viewer │  │Viewer │  │Viewer │  │Viewer │
└───────┘  └───────┘  └───────┘  └───────┘

Features:
✅ Broadcaster vê preview
✅ Viewers veem stream 60 FPS
✅ Áudio sincronizado
✅ Chat em tempo real
✅ Gravação automática
✅ Qualidade adaptativa
```

---

## 🏗️ **PASSO 5: IMPLEMENTAÇÃO - BACKEND**

Vou criar as rotas no servidor Supabase Edge Functions:

### **Arquivo: `/supabase/functions/server/livekit.tsx`**

```typescript
import { AccessToken } from "npm:livekit-server-sdk@2.5.5";
import { Hono } from "npm:hono@4";

const app = new Hono();

// Gerar token de acesso para broadcaster
app.post("/make-server-0ea22bba/livekit/broadcaster-token", async (c) => {
  try {
    const { liveId, userId, userName } = await c.req.json();
    
    const apiKey = Deno.env.get('LIVEKIT_API_KEY');
    const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');
    
    if (!apiKey || !apiSecret) {
      return c.json({ error: "LiveKit not configured" }, 500);
    }
    
    // Criar token com permissões de broadcaster
    const token = new AccessToken(apiKey, apiSecret, {
      identity: `broadcaster_${userId}`,
      name: userName,
      metadata: JSON.stringify({
        userId,
        liveId,
        role: 'broadcaster'
      })
    });
    
    // Permissões do broadcaster
    token.addGrant({
      roomJoin: true,
      room: `live_${liveId}`,
      canPublish: true,       // Pode transmitir
      canPublishData: true,   // Pode enviar dados
      canSubscribe: true      // Pode receber (próprio preview)
    });
    
    const jwt = await token.toJwt();
    const wsUrl = Deno.env.get('LIVEKIT_URL');
    
    return c.json({
      token: jwt,
      wsUrl: wsUrl,
      roomName: `live_${liveId}`
    });
  } catch (error) {
    console.error("Error generating broadcaster token:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Gerar token de acesso para viewer
app.post("/make-server-0ea22bba/livekit/viewer-token", async (c) => {
  try {
    const { liveId, userId, userName } = await c.req.json();
    
    const apiKey = Deno.env.get('LIVEKIT_API_KEY');
    const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');
    
    if (!apiKey || !apiSecret) {
      return c.json({ error: "LiveKit not configured" }, 500);
    }
    
    // Criar token com permissões de viewer
    const token = new AccessToken(apiKey, apiSecret, {
      identity: `viewer_${userId}_${Date.now()}`,
      name: userName,
      metadata: JSON.stringify({
        userId,
        liveId,
        role: 'viewer'
      })
    });
    
    // Permissões do viewer
    token.addGrant({
      roomJoin: true,
      room: `live_${liveId}`,
      canPublish: false,      // NÃO pode transmitir
      canPublishData: true,   // Pode enviar chat
      canSubscribe: true      // Pode assistir
    });
    
    const jwt = await token.toJwt();
    const wsUrl = Deno.env.get('LIVEKIT_URL');
    
    return c.json({
      token: jwt,
      wsUrl: wsUrl,
      roomName: `live_${liveId}`
    });
  } catch (error) {
    console.error("Error generating viewer token:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Webhook para eventos do LiveKit
app.post("/make-server-0ea22bba/livekit/webhook", async (c) => {
  try {
    const event = await c.req.json();
    
    console.log("LiveKit event:", event);
    
    // Processar eventos
    switch (event.event) {
      case 'room_started':
        console.log(`Room ${event.room.name} started`);
        // Atualizar status da live no DB
        break;
        
      case 'room_finished':
        console.log(`Room ${event.room.name} finished`);
        // Atualizar status, salvar gravação, etc
        break;
        
      case 'participant_joined':
        console.log(`Participant ${event.participant.identity} joined`);
        // Incrementar contador de viewers
        break;
        
      case 'participant_left':
        console.log(`Participant ${event.participant.identity} left`);
        // Decrementar contador de viewers
        break;
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
```

### **Adicionar rotas ao index.tsx:**

```typescript
// No arquivo /supabase/functions/server/index.tsx
import livekitRoutes from './livekit.tsx';

// ... código existente ...

// Adicionar rotas do LiveKit
app.route('/', livekitRoutes);
```

---

## 🎨 **PASSO 6: IMPLEMENTAÇÃO - FRONTEND**

Vou criar componentes React para broadcaster e viewer:

### **Componente: `/components/LiveKitBroadcaster.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, Radio } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LiveKitBroadcasterProps {
  liveId: string;
  userId: string;
  userName: string;
  onDisconnect?: () => void;
}

export function LiveKitBroadcaster({ 
  liveId, 
  userId, 
  userName,
  onDisconnect 
}: LiveKitBroadcasterProps) {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBroadcasterToken();
  }, [liveId, userId]);

  async function fetchBroadcasterToken() {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/livekit/broadcaster-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ liveId, userId, userName })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get broadcaster token');
      }

      const data = await response.json();
      
      setToken(data.token);
      setWsUrl(data.wsUrl);
      
      toast.success("Conectado ao LiveKit! 🎥", {
        description: "Iniciando transmissão profissional..."
      });
    } catch (err: any) {
      console.error("Error fetching token:", err);
      setError(err.message);
      toast.error("Erro ao conectar", {
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Conectando ao servidor LiveKit...</p>
        </div>
      </div>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h3 className="text-xl mb-2">Erro na conexão</h3>
          <p className="text-sm text-white/70 mb-4">{error || "Token inválido"}</p>
          <Button onClick={fetchBroadcasterToken}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Badge de transmissão */}
      <div className="absolute top-4 left-4 z-50">
        <Badge className="bg-red-500 text-white px-4 py-2">
          <Radio className="h-4 w-4 mr-2 animate-pulse" />
          TRANSMITINDO AO VIVO
        </Badge>
      </div>

      {/* LiveKit Room */}
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        connect={true}
        audio={true}
        video={true}
        onDisconnected={onDisconnect}
        className="livekit-room-broadcaster"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
```

### **Componente: `/components/LiveKitViewer.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LiveKitViewerProps {
  liveId: string;
  userId: string;
  userName: string;
}

export function LiveKitViewer({ liveId, userId, userName }: LiveKitViewerProps) {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchViewerToken();
  }, [liveId, userId]);

  async function fetchViewerToken() {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/livekit/viewer-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ liveId, userId, userName })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get viewer token');
      }

      const data = await response.json();
      
      setToken(data.token);
      setWsUrl(data.wsUrl);
      
      toast.success("Conectado! 📺", {
        description: "Assistindo transmissão ao vivo"
      });
    } catch (err: any) {
      console.error("Error fetching token:", err);
      setError(err.message);
      toast.error("Erro ao conectar");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Conectando à transmissão...</p>
        </div>
      </div>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h3 className="text-xl mb-2">Erro na conexão</h3>
          <p className="text-sm text-white/70 mb-4">{error || "Token inválido"}</p>
          <Button onClick={fetchViewerToken}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Badge de visualização */}
      <div className="absolute top-4 left-4 z-50">
        <Badge className="bg-blue-500 text-white px-4 py-2">
          <Eye className="h-4 w-4 mr-2" />
          ASSISTINDO AO VIVO
        </Badge>
      </div>

      {/* LiveKit Room */}
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        connect={true}
        audio={true}
        video={true}
        className="livekit-room-viewer"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
```

---

## 🔄 **PASSO 7: INTEGRAÇÃO COM LiveVideoPlayer**

Atualizar `LiveVideoPlayer.tsx` para usar LiveKit quando disponível:

```typescript
// No LiveVideoPlayer.tsx, adicionar lógica:

const [useLiveKit, setUseLiveKit] = useState(false);

// Verificar se LiveKit está configurado
useEffect(() => {
  async function checkLiveKit() {
    try {
      const response = await fetch(/* check endpoint */);
      setUseLiveKit(response.ok);
    } catch {
      setUseLiveKit(false);
    }
  }
  checkLiveKit();
}, []);

// Renderizar LiveKit OU sistema experimental
if (useLiveKit && isCreator) {
  return <LiveKitBroadcaster liveId={live.id} userId={userId} userName={userName} />;
}

if (useLiveKit && !isCreator) {
  return <LiveKitViewer liveId={live.id} userId={userId} userName={userName} />;
}

// Fallback para sistema experimental
return <LiveStreamBroadcast ... />;
```

---

## 📱 **PASSO 8: ESTILOS E CUSTOMIZAÇÃO**

Adicionar estilos do LiveKit ao `globals.css`:

```css
/* Estilos LiveKit customizados */
.livekit-room-broadcaster {
  aspect-ratio: 16/9;
  background: black;
}

.livekit-room-viewer {
  aspect-ratio: 16/9;
  background: black;
}

/* Customizar controles */
.livekit-control-bar {
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}
```

---

## 🧪 **PASSO 9: TESTE LOCAL**

```bash
1. Configurar secrets no Supabase
2. Deploy das Edge Functions
3. Criar uma live no VolleyPro
4. Sistema detecta LiveKit
5. Broadcaster inicia transmissão
6. Viewer assiste com qualidade HD
7. ✅ Teste completo!
```

---

## 🚀 **PASSO 10: DEPLOY PRODUÇÃO**

```bash
1. Verificar secrets no Supabase produção
2. Deploy Edge Functions: supabase functions deploy
3. Testar com live real
4. Monitorar LiveKit Dashboard
5. ✅ Produção!
```

---

## 📊 **FEATURES AVANÇADAS:**

### **1. Gravação Automática:**

```typescript
// No LiveKit Dashboard:
Settings → Recording → Enable

// Gravações ficam disponíveis em:
LiveKit Dashboard → Recordings
// Fazer download e hospedar no Supabase Storage
```

### **2. Múltiplas Câmeras:**

```typescript
// Broadcaster pode compartilhar:
- Webcam principal
- Câmera secundária (USB)
- Tela (compartilhamento)
- Audio mix (comentarista + jogo)
```

### **3. Analytics:**

```typescript
// LiveKit Dashboard mostra:
- Viewers em tempo real
- Qualidade de conexão
- Bandwidth usado
- Latência
- Erros
```

### **4. Qualidade Adaptativa:**

```typescript
// LiveKit ajusta automaticamente:
- 1080p para conexões boas
- 720p para conexões médias
- 480p para conexões ruins
```

---

## 💡 **DICAS PROFISSIONAIS:**

### **Para Campeonatos:**

```
✅ Teste 1-2 dias antes
✅ Tenha backup (celular 4G)
✅ Use câmera boa (DSLR via OBS)
✅ Microfone externo
✅ Iluminação adequada
✅ Internet cabeada (não WiFi)
✅ Anuncie live 1h antes
✅ Faça preview 15min antes
```

### **Configuração Ideal:**

```
Hardware:
• Webcam Logitech C920 ou superior
• Microfone Blue Yeti / HyperX
• PC: i5/Ryzen 5 + 8GB RAM
• Internet: 10 Mbps upload mínimo

Software:
• Chrome (melhor WebRTC)
• OBS Studio (câmera virtual)
• Monitor secundário (controles)
```

---

## 🆘 **SUPORTE E TROUBLESHOOTING:**

### **Problema: "Token inválido"**
```
Causa: Secrets não configurados
Solução: Verificar LIVEKIT_API_KEY e LIVEKIT_API_SECRET
```

### **Problema: "Vídeo não aparece"**
```
Causa: Permissão de câmera negada
Solução: Permitir câmera no navegador
```

### **Problema: "Alta latência"**
```
Causa: Internet lenta
Solução: Aumentar velocidade ou trocar região LiveKit
```

### **Problema: "Muitos espectadores, travando"**
```
Causa: Plan inadequado
Solução: Upgrade para plan maior
```

---

## 📞 **CONTATOS E RECURSOS:**

```
LiveKit Docs:
https://docs.livekit.io

LiveKit GitHub:
https://github.com/livekit

LiveKit Discord:
https://livekit.io/discord

LiveKit Suporte:
support@livekit.io
```

---

## 🎯 **RESUMO EXECUTIVO:**

| Item | Sistema Atual | Com LiveKit |
|------|---------------|-------------|
| FPS | 1 | 30-60 |
| Áudio | ❌ | ✅ Sim |
| Latência | 1-2s | <1s |
| Viewers | 10-20 | 1000+ |
| Qualidade | Baixa | HD/FullHD |
| Gravação | ❌ | ✅ Automática |
| Custo/mês | $0 | $50-200 |
| Para campeonato? | ❌ Não | ✅ SIM! |

---

## ✅ **CHECKLIST DE IMPLEMENTAÇÃO:**

- [ ] Criar conta LiveKit Cloud
- [ ] Gerar API keys
- [ ] Configurar secrets no Supabase
- [ ] Criar arquivo `livekit.tsx` no servidor
- [ ] Criar componentes `LiveKitBroadcaster` e `LiveKitViewer`
- [ ] Integrar com `LiveVideoPlayer`
- [ ] Adicionar estilos ao `globals.css`
- [ ] Testar com live de teste
- [ ] Configurar gravação
- [ ] Fazer live de teste pública
- [ ] ✅ Pronto para campeonato!

---

## 🏆 **RESULTADO FINAL:**

Com LiveKit implementado, você terá:

```
🎥 Transmissões profissionais 60 FPS
🎤 Áudio limpo e sincronizado
📹 Gravações automáticas em HD
📊 Analytics em tempo real
👥 Centenas de espectadores simultâneos
⚡ Latência ultra-baixa
💪 Sistema robusto e escalável
🏆 Pronto para campeonatos oficiais!
```

---

**🚀 QUER QUE EU IMPLEMENTE AGORA?**

Posso criar todos os arquivos necessários para você ter LiveKit funcionando no VolleyPro!

É só confirmar e vou implementar:
1. Rotas do servidor (`livekit.tsx`)
2. Componentes React (`LiveKitBroadcaster` e `LiveKitViewer`)
3. Integração com `LiveVideoPlayer`
4. Estilos necessários
5. Guia de configuração de secrets

**Responda "SIM" e eu implemento tudo agora! 🎯**

O sistema experimental de 1 FPS continua funcionando como fallback para quem não quer pagar LiveKit.

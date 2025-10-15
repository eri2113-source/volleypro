import { Hono } from "npm:hono@4";
import * as jose from "npm:jose@5.2.0";

const app = new Hono();

/**
 * Gerar JWT do LiveKit manualmente usando a biblioteca jose
 * Mais confiável que depender do SDK que pode ter problemas de versão
 */
async function generateLiveKitToken(
  apiKey: string,
  apiSecret: string,
  identity: string,
  name: string,
  metadata: Record<string, any>,
  grants: {
    roomJoin: boolean;
    room: string;
    canPublish: boolean;
    canPublishData: boolean;
    canSubscribe: boolean;
  }
) {
  const videoGrant: any = {
    roomJoin: grants.roomJoin,
    room: grants.room,
    canPublish: grants.canPublish,
    canPublishData: grants.canPublishData,
    canSubscribe: grants.canSubscribe,
  };

  const payload = {
    video: videoGrant,
    iss: apiKey,
    sub: identity,
    name: name,
    metadata: JSON.stringify(metadata),
    nbf: Math.floor(Date.now() / 1000) - 10, // Not before (10 segundos atrás)
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 6), // Expira em 6 horas
  };

  // Criar JWT usando jose
  const secret = new TextEncoder().encode(apiSecret);
  
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(apiKey)
    .setSubject(identity)
    .setExpirationTime('6h')
    .sign(secret);

  return jwt;
}

/**
 * ROTA: Gerar token de acesso para BROADCASTER (criador da live)
 * 
 * O broadcaster tem permissão para:
 * - Publicar vídeo e áudio
 * - Enviar dados (chat)
 * - Receber (ver próprio preview)
 */
app.post("/make-server-0ea22bba/livekit/broadcaster-token", async (c) => {
  try {
    const { liveId, userId, userName } = await c.req.json();
    
    console.log("🎥 Gerando token de broadcaster:", { liveId, userId, userName });
    
    const apiKey = Deno.env.get('LIVEKIT_API_KEY');
    const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');
    const wsUrl = Deno.env.get('LIVEKIT_URL');
    
    if (!apiKey || !apiSecret || !wsUrl) {
      console.error("❌ LiveKit não configurado. Secrets necessários:", {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasWsUrl: !!wsUrl
      });
      return c.json({ 
        error: "LiveKit não configurado. Configure os secrets: LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL",
        configured: false
      }, 500);
    }
    
    // Gerar token manualmente
    const token = await generateLiveKitToken(
      apiKey,
      apiSecret,
      `broadcaster_${userId}`,
      userName || "Broadcaster",
      {
        userId,
        liveId,
        role: 'broadcaster',
        timestamp: Date.now()
      },
      {
        roomJoin: true,
        room: `live_${liveId}`,
        canPublish: true,       // Pode transmitir vídeo/áudio
        canPublishData: true,   // Pode enviar dados (chat)
        canSubscribe: true      // Pode receber (próprio preview)
      }
    );
    
    console.log("✅ Token de broadcaster gerado com sucesso");
    
    return c.json({
      token: token,
      wsUrl: wsUrl,
      roomName: `live_${liveId}`,
      configured: true
    });
  } catch (error: any) {
    console.error("❌ Erro ao gerar token de broadcaster:", error);
    return c.json({ 
      error: error.message || "Erro ao gerar token",
      configured: false
    }, 500);
  }
});

/**
 * ROTA: Gerar token de acesso para VIEWER (espectador)
 * 
 * O viewer tem permissão para:
 * - Assistir vídeo e áudio
 * - Enviar dados (chat)
 * - NÃO pode publicar vídeo/áudio
 */
app.post("/make-server-0ea22bba/livekit/viewer-token", async (c) => {
  try {
    const { liveId, userId, userName } = await c.req.json();
    
    console.log("👁️ Gerando token de viewer:", { liveId, userId, userName });
    
    const apiKey = Deno.env.get('LIVEKIT_API_KEY');
    const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');
    const wsUrl = Deno.env.get('LIVEKIT_URL');
    
    if (!apiKey || !apiSecret || !wsUrl) {
      console.error("❌ LiveKit não configurado");
      return c.json({ 
        error: "LiveKit não configurado",
        configured: false
      }, 500);
    }
    
    // Gerar token manualmente
    const token = await generateLiveKitToken(
      apiKey,
      apiSecret,
      `viewer_${userId}_${Date.now()}`, // Timestamp para permitir múltiplas abas
      userName || "Espectador",
      {
        userId,
        liveId,
        role: 'viewer',
        timestamp: Date.now()
      },
      {
        roomJoin: true,
        room: `live_${liveId}`,
        canPublish: false,      // NÃO pode transmitir
        canPublishData: true,   // Pode enviar chat
        canSubscribe: true      // Pode assistir
      }
    );
    
    console.log("✅ Token de viewer gerado com sucesso");
    
    return c.json({
      token: token,
      wsUrl: wsUrl,
      roomName: `live_${liveId}`,
      configured: true
    });
  } catch (error: any) {
    console.error("❌ Erro ao gerar token de viewer:", error);
    return c.json({ 
      error: error.message || "Erro ao gerar token",
      configured: false
    }, 500);
  }
});

/**
 * ROTA: Verificar se LiveKit está configurado
 * 
 * Retorna true/false para o frontend saber se deve usar LiveKit ou fallback
 */
app.get("/make-server-0ea22bba/livekit/status", async (c) => {
  try {
    const apiKey = Deno.env.get('LIVEKIT_API_KEY');
    const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');
    const wsUrl = Deno.env.get('LIVEKIT_URL');
    
    const configured = !!(apiKey && apiSecret && wsUrl);
    
    console.log("🔍 Status do LiveKit:", { configured });
    
    return c.json({
      configured,
      message: configured 
        ? "LiveKit configurado e pronto para uso" 
        : "LiveKit não configurado. Configure os secrets para ativar streaming profissional."
    });
  } catch (error: any) {
    console.error("❌ Erro ao verificar status:", error);
    return c.json({ 
      configured: false,
      message: "Erro ao verificar configuração"
    }, 500);
  }
});

/**
 * ROTA: Webhook para eventos do LiveKit
 * 
 * LiveKit pode enviar eventos quando:
 * - Live inicia
 * - Live termina
 * - Participante entra
 * - Participante sai
 * - Gravação disponível
 * etc.
 */
app.post("/make-server-0ea22bba/livekit/webhook", async (c) => {
  try {
    const event = await c.req.json();
    
    console.log("📡 LiveKit webhook recebido:", event);
    
    // Processar eventos
    switch (event.event) {
      case 'room_started':
        console.log(`🎬 Room ${event.room?.name} iniciada`);
        // TODO: Atualizar status da live no banco de dados
        break;
        
      case 'room_finished':
        console.log(`🎬 Room ${event.room?.name} finalizada`);
        // TODO: Atualizar status, salvar gravação, etc
        break;
        
      case 'participant_joined':
        console.log(`👤 Participante ${event.participant?.identity} entrou`);
        // TODO: Incrementar contador de viewers
        break;
        
      case 'participant_left':
        console.log(`👤 Participante ${event.participant?.identity} saiu`);
        // TODO: Decrementar contador de viewers
        break;
        
      case 'recording_finished':
        console.log(`📹 Gravação disponível:`, event.egressInfo);
        // TODO: Fazer download e salvar no Supabase Storage
        break;
        
      default:
        console.log(`📡 Evento não tratado: ${event.event}`);
    }
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error("❌ Erro ao processar webhook:", error);
    return c.json({ 
      error: error.message || "Erro ao processar webhook"
    }, 500);
  }
});

export default app;

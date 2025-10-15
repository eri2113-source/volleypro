/**
 * Utilitários para gerenciamento de permissões de câmera e microfone
 */

export interface CameraPermissionResult {
  success: boolean;
  error?: string;
  errorType?: 'permission_denied' | 'not_found' | 'in_use' | 'overconstrained' | 'unknown';
  stream?: MediaStream;
}

/**
 * Testa se câmera e microfone estão acessíveis
 */
export async function testCameraAccess(): Promise<CameraPermissionResult> {
  try {
    console.log("🎥 [CameraPermission] Solicitando acesso à câmera e microfone...");
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    console.log("✅ [CameraPermission] Acesso concedido com sucesso!");
    
    return {
      success: true,
      stream
    };
  } catch (err: any) {
    console.error("❌ [CameraPermission] Erro ao acessar mídia:", err);
    
    let error = "Erro ao acessar câmera";
    let errorType: CameraPermissionResult['errorType'] = 'unknown';

    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      error = "Permissão negada. Clique no ícone de cadeado na barra de endereço e permita o acesso à câmera.";
      errorType = 'permission_denied';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      error = "Nenhuma câmera ou microfone encontrado neste dispositivo.";
      errorType = 'not_found';
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      error = "Câmera ou microfone está sendo usado por outro aplicativo. Feche outros programas e tente novamente.";
      errorType = 'in_use';
    } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
      error = "Sua câmera não suporta as configurações solicitadas.";
      errorType = 'overconstrained';
    } else if (err.name === 'TypeError') {
      error = "Seu navegador não suporta acesso a câmera. Use Chrome, Firefox, Safari ou Edge.";
      errorType = 'unknown';
    } else if (err.name === 'SecurityError') {
      error = "Acesso bloqueado por segurança. Certifique-se de estar usando HTTPS.";
      errorType = 'permission_denied';
    }

    return {
      success: false,
      error,
      errorType
    };
  }
}

/**
 * Para um stream de mídia ativo
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return;
  
  console.log("🛑 [CameraPermission] Parando stream de mídia...");
  
  stream.getTracks().forEach(track => {
    track.stop();
    console.log(`  └─ Track parado: ${track.kind} (${track.label})`);
  });
}

/**
 * Verifica o status da permissão de câmera (sem solicitar acesso)
 */
export async function checkCameraPermissionStatus(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
  try {
    if (!navigator.permissions) {
      console.warn("⚠️ [CameraPermission] API de permissões não suportada");
      return 'unsupported';
    }

    const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
    console.log(`📹 [CameraPermission] Status da permissão de câmera: ${cameraPermission.state}`);
    
    return cameraPermission.state as 'granted' | 'denied' | 'prompt';
  } catch (error) {
    console.error("❌ [CameraPermission] Erro ao verificar permissão:", error);
    return 'unsupported';
  }
}

/**
 * Verifica se o navegador suporta getUserMedia
 */
export function isCameraSupported(): boolean {
  const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  
  if (!supported) {
    console.error("❌ [CameraPermission] getUserMedia não é suportado neste navegador");
  }
  
  return supported;
}

/**
 * Retorna informações úteis sobre o ambiente para debugging
 */
export function getCameraDebugInfo(): {
  supported: boolean;
  isSecureContext: boolean;
  userAgent: string;
  platform: string;
} {
  return {
    supported: isCameraSupported(),
    isSecureContext: window.isSecureContext,
    userAgent: navigator.userAgent,
    platform: navigator.platform
  };
}

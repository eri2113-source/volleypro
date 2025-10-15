import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Camera, CheckCircle2, AlertCircle, Loader2, XCircle } from "lucide-react";
import { WebcamPermissionGuide } from "./WebcamPermissionGuide";
import { testCameraAccess, stopMediaStream } from "../utils/cameraPermission";

interface CameraTestProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

export function CameraTest({ onSuccess, onSkip }: CameraTestProps) {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    // Cleanup ao desmontar
    return () => {
      stopMediaStream(stream);
    };
  }, [stream]);

  async function testCamera() {
    setStatus('testing');
    setError(null);

    const result = await testCameraAccess();

    if (result.success && result.stream) {
      setStream(result.stream);
      setStatus('success');
      
      // Auto-continuar após 2 segundos
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.error || "Erro desconhecido");
      setStatus('error');
    }
  }

  // Se deu erro, mostrar guia de permissão
  if (status === 'error' && error) {
    return (
      <WebcamPermissionGuide 
        error={error}
        onRetry={() => {
          setStatus('idle');
          setError(null);
          testCamera();
        }}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {status === 'idle' && <Camera className="h-8 w-8 text-primary" />}
            {status === 'testing' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-8 w-8 text-green-500" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-destructive" />}
          </div>
          <h3 className="mb-2">Teste de Câmera e Microfone</h3>
          <p className="text-sm text-muted-foreground">
            Antes de iniciar a live, vamos verificar se sua câmera e microfone estão funcionando
          </p>
        </div>

        {/* Preview da câmera */}
        {stream && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Funcionando!
            </Badge>
          </div>
        )}

        {/* Status messages */}
        {status === 'testing' && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Aguardando permissão... Clique em "Permitir" quando o navegador perguntar.
            </AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Perfeito! Sua câmera e microfone estão funcionando. Redirecionando...
            </AlertDescription>
          </Alert>
        )}

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-2">
          {status === 'idle' && (
            <>
              <Button 
                onClick={testCamera}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Testar Câmera
              </Button>
              {onSkip && (
                <Button 
                  variant="outline"
                  onClick={onSkip}
                >
                  Pular Teste
                </Button>
              )}
            </>
          )}

          {status === 'success' && (
            <Button 
              onClick={onSuccess}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Continuar para Live
            </Button>
          )}
        </div>

        {/* Dica */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          💡 Dica: Você verá uma solicitação de permissão no topo do navegador
        </div>
      </CardContent>
    </Card>
  );
}

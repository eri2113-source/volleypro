import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Camera, AlertCircle, Chrome, Globe, RefreshCw } from "lucide-react";

interface WebcamPermissionGuideProps {
  error?: string;
  onRetry: () => void;
}

export function WebcamPermissionGuide({ error, onRetry }: WebcamPermissionGuideProps) {
  // Detectar navegador
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  const browserName = isChrome ? "Chrome" : isFirefox ? "Firefox" : isSafari ? "Safari" : "seu navegador";
  const BrowserIcon = isChrome ? Chrome : Globe;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="h-10 w-10 text-red-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl text-white mb-2">Permissão da Câmera Necessária</h2>
            <p className="text-white/70">
              Para transmitir ao vivo, você precisa permitir o acesso à sua câmera
            </p>
            {error && (
              <Badge variant="destructive" className="mt-3">
                {error}
              </Badge>
            )}
          </div>

          {/* Instruções passo a passo */}
          <div className="bg-black/30 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <p className="text-sm">
                Clique no botão <strong className="text-primary">"Permitir Câmera"</strong> abaixo
              </p>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <p className="text-sm">
                O {browserName} vai mostrar uma mensagem no topo da página
              </p>
            </div>

            <div className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <p className="text-sm">
                Clique em <strong className="text-green-400">"Permitir"</strong> ou <strong className="text-green-400">"Allow"</strong>
              </p>
            </div>
          </div>

          {/* Instruções se já foi bloqueado */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-white flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <span>Já bloqueou a câmera antes?</span>
            </h3>
            <div className="text-sm text-white/80 space-y-2">
              <p>Se você bloqueou acidentalmente, siga estes passos:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Clique no <strong className="text-white">ícone de cadeado</strong> {" "}
                  <span className="inline-flex items-center gap-1">
                    🔒
                  </span>
                  {" "} na barra de endereço (canto superior esquerdo)
                </li>
                <li>Procure por <strong className="text-white">"Câmera"</strong> ou <strong className="text-white">"Camera"</strong></li>
                <li>Altere de <span className="text-red-400">"Bloquear"</span> para <span className="text-green-400">"Permitir"</span></li>
                <li>Recarregue a página ou clique no botão abaixo</li>
              </ol>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onRetry} 
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white"
            >
              <Camera className="h-5 w-5 mr-2" />
              Permitir Câmera
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.reload()}
              className="sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Recarregar Página
            </Button>
          </div>

          {/* Dicas adicionais */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3 text-xs text-white/60">
              <BrowserIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong className="text-white/80">Dica:</strong> Esta permissão é necessária apenas uma vez. 
                O {browserName} vai lembrar sua escolha para futuras transmissões.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

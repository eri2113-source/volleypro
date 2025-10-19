import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink, X } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const PRODUCTION_URL = 'https://volleypro-zw96.vercel.app';

export function FigmaMakeWarning() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar se foi dismissado nesta sessão
    const wasDismissed = sessionStorage.getItem('figma_warning_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Detectar se está no Figma Make
    const hostname = window.location.hostname;
    const href = window.location.href;
    
    const isFigma = 
      hostname.includes('figma.com') || 
      hostname.includes('fig.ma') ||
      (hostname.includes('localhost') && !href.includes('vercel.app')) ||
      hostname.includes('make.fig');
    
    if (isFigma) {
      console.log('⚠️ Mostrando aviso do Figma Make');
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('figma_warning_dismissed', 'true');
    setDismissed(true);
    setShow(false);
  };

  const handleGoToProduction = () => {
    window.location.href = PRODUCTION_URL;
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] bg-yellow-500 text-black shadow-lg animate-in slide-in-from-top duration-500">
      <Alert className="border-0 rounded-none bg-yellow-500 text-black py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" />
            <div>
              <AlertTitle className="text-black font-bold mb-1">
                ⚠️ Ambiente de Testes - Não Oficial
              </AlertTitle>
              <AlertDescription className="text-black/90 text-sm">
                Você está no <strong>Figma Make (ambiente de desenvolvimento)</strong>. 
                Para a melhor experiência, use o site oficial em produção.
              </AlertDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleGoToProduction}
              className="bg-black text-yellow-500 hover:bg-black/90"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir para Produção
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-black hover:bg-black/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}

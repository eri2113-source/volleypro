import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar se já está instalado
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
    setIsStandalone(isInStandaloneMode);

    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Verificar se usuário já fechou o prompt antes
    const hasClosedPrompt = localStorage.getItem('volleypro_pwa_prompt_closed');
    
    // Listener para o evento beforeinstallprompt (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      
      // Mostrar prompt após 10 segundos se usuário não fechou antes
      if (!hasClosedPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      console.log('✅ PWA instalado com sucesso!');
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('volleypro_pwa_installed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar o prompt nativo de instalação
    await deferredPrompt.prompt();

    // Aguardar a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'rejeitou'} a instalação`);

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('volleypro_pwa_prompt_closed', 'true');
  };

  // Não mostrar se já está instalado
  if (isStandalone) {
    return null;
  }

  // Prompt para iOS
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Instale o VolleyPro</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Instale nosso app para uma experiência completa!
                </p>
                
                <div className="bg-muted/50 rounded-lg p-3 mb-3 space-y-2 text-sm">
                  <p className="font-medium">Como instalar no iOS:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Toque no botão de compartilhar <span className="inline-block">□↑</span></li>
                    <li>Role e toque em "Adicionar à Tela Inicial"</li>
                    <li>Toque em "Adicionar"</li>
                  </ol>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="w-full"
                >
                  Fechar
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prompt para Android/Chrome
  if (deferredPrompt && showPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Instale o VolleyPro</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Instale nosso app e tenha acesso rápido, notificações e experiência completa offline!
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstallClick}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Instalar App
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    Agora não
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  💡 O app funciona offline e é mais rápido!
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

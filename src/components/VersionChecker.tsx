import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { RefreshCw, X } from 'lucide-react';

const CURRENT_VERSION = '__BUILD_TIMESTAMP__'; // Será substituído no build

export function VersionChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Verifica versão a cada 20 segundos
    const checkVersion = () => {
      fetch('/BUILD_TIMESTAMP.txt?' + Date.now(), { cache: 'no-store' })
        .then(res => res.text())
        .then(serverVersion => {
          const currentVersion = CURRENT_VERSION.replace('__BUILD_TIMESTAMP__', '');
          const newVersion = serverVersion.trim();
          
          console.log('🔍 [VERSION] Versão atual:', currentVersion || 'development');
          console.log('🔍 [VERSION] Versão no servidor:', newVersion);
          
          if (currentVersion && newVersion && currentVersion !== newVersion) {
            console.log('🆕 [VERSION] Nova versão detectada! Forçando atualização...');
            setForceUpdate(true);
            setUpdateAvailable(true);
          }
        })
        .catch(err => {
          console.log('⚠️ [VERSION] Erro ao verificar versão:', err);
        });
    };

    // Verifica imediatamente após 2 segundos
    const initialCheck = setTimeout(checkVersion, 2000);
    
    // Verifica a cada 20 segundos
    const interval = setInterval(checkVersion, 20000);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Verifica se há atualização disponível
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('✅ [SW] Nova versão disponível!');
                setUpdateAvailable(true);
                setForceUpdate(true);
              }
            });
          }
        });

        // Força verificação de atualização a cada minuto
        setInterval(() => {
          reg.update().catch(err => {
            console.log('⚠️ [SW] Erro ao verificar atualização:', err);
          });
        }, 60000);
      });

      // Detecta quando um novo service worker assume o controle
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 [SW] Novo service worker ativo, recarregando...');
        handleForceUpdate();
      });
    }

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, []);

  // Countdown para atualização automática
  useEffect(() => {
    if (forceUpdate && !dismissed && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      console.log('🔄 [VERSION] Atualizando automaticamente...');
      handleForceUpdate();
    }
  }, [forceUpdate, dismissed, countdown]);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Envia mensagem para o SW pular a espera
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Se não tem SW esperando, força reload
      handleForceUpdate();
    }
  };

  const handleForceUpdate = () => {
    console.log('🔄 [UPDATE] Iniciando atualização forçada...');
    
    // Limpa todos os caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          console.log('🗑️ [CACHE] Removendo:', name);
          caches.delete(name);
        });
      });
    }

    // Desregistra service workers antigos
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('🗑️ [SW] Desregistrando service worker');
          registration.unregister();
        });
      });
    }

    // Recarrega com força (bypass cache) após pequeno delay
    setTimeout(() => {
      window.location.href = window.location.href + '?v=' + Date.now();
    }, 500);
  };

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto z-[9999] max-w-md mx-auto md:mx-0">
      <Alert className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none shadow-2xl">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <AlertDescription className="space-y-2">
              <p className="font-bold text-base">🆕 Atualização Disponível!</p>
              <p className="text-sm opacity-95">
                {forceUpdate 
                  ? `Atualizando automaticamente em ${countdown} segundos...`
                  : 'Uma nova versão está disponível. Atualize para ver as melhorias.'}
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold flex-1"
                >
                  Atualizar Agora
                </Button>
                {!forceUpdate && (
                  <Button
                    onClick={() => setDismissed(true)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}

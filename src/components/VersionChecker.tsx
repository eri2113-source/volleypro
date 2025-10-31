import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { RefreshCw, X } from 'lucide-react';

const CURRENT_VERSION = '__BUILD_TIMESTAMP__'; // Será substituído no build
const VERSION_CHECK_KEY = 'volleypro_version_checked';
const LAST_VERSION_KEY = 'volleypro_last_version';

export function VersionChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verifica versão APENAS UMA VEZ no carregamento
    const checkVersion = () => {
      const currentVersion = CURRENT_VERSION.replace('__BUILD_TIMESTAMP__', '');
      
      // Se não tem versão (desenvolvimento), não verifica
      if (!currentVersion || currentVersion === '__BUILD_TIMESTAMP__') {
        console.log('⚠️ [VERSION] Modo desenvolvimento, verificação desabilitada');
        return;
      }

      // Pega a última versão checada
      const lastCheckedVersion = localStorage.getItem(LAST_VERSION_KEY);
      
      // Se já checou esta versão, não verifica de novo
      if (lastCheckedVersion === currentVersion) {
        console.log('✅ [VERSION] Versão já verificada:', currentVersion);
        return;
      }

      console.log('🔍 [VERSION] Verificando versão...');
      console.log('🔍 [VERSION] Versão atual:', currentVersion);
      console.log('🔍 [VERSION] Última verificada:', lastCheckedVersion);

      fetch('/BUILD_TIMESTAMP.txt?' + Date.now(), { cache: 'no-store' })
        .then(res => res.text())
        .then(serverVersion => {
          const newVersion = serverVersion.trim();
          
          console.log('🔍 [VERSION] Versão no servidor:', newVersion);
          
          // Se a versão do servidor é diferente da atual E ainda não foi checada
          if (newVersion && currentVersion !== newVersion && lastCheckedVersion !== newVersion) {
            console.log('🆕 [VERSION] Nova versão detectada!');
            setUpdateAvailable(true);
          } else {
            console.log('✅ [VERSION] Versão atualizada');
            // Marca como verificada
            localStorage.setItem(LAST_VERSION_KEY, currentVersion);
          }
        })
        .catch(err => {
          console.log('⚠️ [VERSION] Erro ao verificar versão:', err);
        });
    };

    // Verifica APENAS uma vez, após 3 segundos
    const timer = setTimeout(checkVersion, 3000);

    return () => clearTimeout(timer);
  }, []); // Executa APENAS uma vez

  const handleUpdate = () => {
    console.log('🔄 [UPDATE] Iniciando atualização...');
    
    // Limpa todos os caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          console.log('🗑️ [CACHE] Removendo:', name);
          caches.delete(name);
        });
      });
    }

    // Desregistra service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('🗑️ [SW] Desregistrando service worker');
          registration.unregister();
        });
      });
    }

    // Limpa o storage para forçar nova verificação
    localStorage.removeItem(LAST_VERSION_KEY);
    localStorage.removeItem(VERSION_CHECK_KEY);

    // Recarrega
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDismiss = () => {
    // Marca versão atual como verificada para não mostrar de novo
    const currentVersion = CURRENT_VERSION.replace('__BUILD_TIMESTAMP__', '');
    if (currentVersion && currentVersion !== '__BUILD_TIMESTAMP__') {
      localStorage.setItem(LAST_VERSION_KEY, currentVersion);
    }
    setDismissed(true);
  };

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto z-[9999] max-w-md mx-auto md:mx-0">
      <Alert className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-2xl">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <AlertDescription className="space-y-2">
              <p className="font-bold text-base">🆕 Nova Versão Disponível!</p>
              <p className="text-sm opacity-95">
                Uma atualização está pronta. Clique para ver as novidades.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold flex-1"
                >
                  Atualizar Agora
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Banner que força atualização em celulares
 * Detecta versões antigas do cache
 */
export function ForceUpdateBanner() {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    // Verifica se é mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Se não é mobile, não mostra
    if (!isMobile) {
      return;
    }

    // Verifica a última atualização
    const lastUpdate = localStorage.getItem('volleypro_last_update');
    const now = Date.now();
    
    // Se faz mais de 1 hora desde a última atualização, mostra banner
    if (!lastUpdate || (now - parseInt(lastUpdate)) > 3600000) {
      console.log('⚠️ [UPDATE] Cache antigo detectado, mostrando banner de atualização');
      setShow(true);
    }

    // Countdown para atualização automática
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleForceUpdate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleForceUpdate = () => {
    console.log('🔄 [FORCE UPDATE] Limpando cache e atualizando...');
    
    // Marca o horário da atualização
    localStorage.setItem('volleypro_last_update', Date.now().toString());
    
    // Limpa todos os caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          console.log('🗑️ [CACHE] Removendo:', name);
          caches.delete(name);
        });
      });
    }

    // Desregistra todos os service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => {
          console.log('🗑️ [SW] Desregistrando');
          reg.unregister();
        });
      });
    }

    // Força reload completo
    setTimeout(() => {
      window.location.href = window.location.href.split('?')[0] + '?force=' + Date.now();
    }, 500);
  };

  const handleDismiss = () => {
    // Marca como atualizado para não mostrar de novo
    localStorage.setItem('volleypro_last_update', Date.now().toString());
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-1 max-w-md w-full animate-pulse">
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Atualização Necessária</h2>
              <p className="text-sm text-gray-600">Nova versão disponível</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700">
              Para garantir que você veja as últimas atualizações e correções, precisamos limpar o cache do aplicativo.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800 font-medium">
                ⏱️ Atualizando automaticamente em {countdown} segundos...
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleForceUpdate}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Agora
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="px-6"
            >
              Depois
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Isso vai recarregar a página e pode levar alguns segundos
          </p>
        </div>
      </div>
    </div>
  );
}

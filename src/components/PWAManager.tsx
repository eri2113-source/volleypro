import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";

export function PWAManager() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    // Registrar Service Worker apenas em produção
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      console.log('🔄 [PWA] Registrando Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('✅ [PWA] Service Worker registrado:', registration.scope);

      // Verificar atualizações a cada hora
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Listener para quando houver uma nova versão esperando
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          console.log('🆕 [PWA] Nova versão encontrada!');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('⏳ [PWA] Nova versão pronta para ativar');
              setWaitingWorker(newWorker);
              setShowReload(true);
              
              // Notificar usuário sobre atualização disponível
              toast.info('Nova versão disponível!', {
                description: 'Clique aqui para atualizar',
                duration: Infinity,
                action: {
                  label: 'Atualizar',
                  onClick: () => updateServiceWorker()
                }
              });
            }
          });
        }
      });

      // Verificar se já existe um worker esperando
      if (registration.waiting) {
        console.log('⏳ [PWA] Service Worker esperando para ativar');
        setWaitingWorker(registration.waiting);
        setShowReload(true);
      }

      // Listener para mensagens do Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_CLEARED') {
          console.log('✅ [PWA] Cache limpo pelo Service Worker');
          toast.success('Cache limpo com sucesso!');
        }
      });

      // Detectar quando o controle muda (nova versão ativada)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        console.log('🔄 [PWA] Nova versão ativada, recarregando...');
        window.location.reload();
      });

    } catch (error) {
      console.error('❌ [PWA] Erro ao registrar Service Worker:', error);
    }
  }

  function updateServiceWorker() {
    if (!waitingWorker) return;

    console.log('🔄 [PWA] Ativando nova versão...');
    
    // Envia mensagem para o Service Worker pular a espera
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    
    setShowReload(false);
    
    toast.success('Atualizando...', {
      description: 'A página será recarregada'
    });
  }

  // Este componente não renderiza nada visualmente
  // Ele apenas gerencia o Service Worker em background
  return null;
}

// Função utilitária para limpar cache (pode ser chamada de qualquer lugar)
export async function clearPWACache() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('🧹 [PWA] Solicitando limpeza de cache...');
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    
    return new Promise<void>((resolve) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'CACHE_CLEARED') {
          navigator.serviceWorker.removeEventListener('message', handleMessage);
          resolve();
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);
    });
  }
}

// Função para verificar se está rodando como PWA instalado
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

// Função para verificar se está online
export function isOnline(): boolean {
  return navigator.onLine;
}

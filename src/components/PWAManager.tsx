import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";

export function PWAManager() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    // 🔥 SERVICE WORKER DESATIVADO TEMPORARIAMENTE
    // Causa erro 404 porque o arquivo service-worker.js não existe
    // Será reativado quando o Google Ads estiver funcionando
    
    // Desregistrar qualquer Service Worker antigo
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log('🗑️ [PWA] Service Worker antigo removido:', registration.scope);
        });
      });
    }
  }, []);

  // Este componente não renderiza nada visualmente
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
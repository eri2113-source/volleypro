import { useEffect } from "react";

/**
 * Componente para forçar atualização e limpar cache
 * Adiciona timestamp de build para forçar reload
 */
export function CacheBuster() {
  useEffect(() => {
    // Versão atual do código
    const CURRENT_VERSION = "2.1.0-camera-fix";
    const STORED_VERSION = localStorage.getItem("volleypro_version");
    
    if (STORED_VERSION !== CURRENT_VERSION) {
      console.log("🔄 Nova versão detectada! Limpando cache...");
      console.log(`   Antiga: ${STORED_VERSION || "nenhuma"}`);
      console.log(`   Nova: ${CURRENT_VERSION}`);
      
      // Limpar cache do service worker se existir
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
            console.log("   ✅ Service worker removido");
          });
        });
      }
      
      // Limpar cache de assets
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
            console.log(`   ✅ Cache ${name} removido`);
          });
        });
      }
      
      // Atualizar versão no localStorage
      localStorage.setItem("volleypro_version", CURRENT_VERSION);
      
      console.log("✅ Cache limpo! A página será recarregada...");
      
      // Recarregar página uma única vez
      if (!sessionStorage.getItem("volleypro_reloaded")) {
        sessionStorage.setItem("volleypro_reloaded", "true");
        window.location.reload();
      }
    } else {
      // Limpar flag de reload
      sessionStorage.removeItem("volleypro_reloaded");
    }
  }, []);
  
  return null;
}

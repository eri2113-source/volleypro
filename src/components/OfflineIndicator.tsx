import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('✅ Conectado à internet');
      setIsOnline(true);
      setShowIndicator(true);
      
      toast.success('Você está online!', {
        description: 'Conexão restabelecida',
        icon: <Wifi className="h-5 w-5 text-green-500" />
      });
      
      // Esconder indicador após 3 segundos
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      console.log('❌ Sem conexão com internet');
      setIsOnline(false);
      setShowIndicator(true);
      
      toast.error('Você está offline', {
        description: 'Algumas funcionalidades podem estar limitadas',
        icon: <WifiOff className="h-5 w-5 text-red-500" />,
        duration: Infinity
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar estado inicial
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mostrar apenas quando offline ou acabou de voltar online
  if (!showIndicator) {
    return null;
  }

  return (
    <div 
      className={`
        fixed top-20 right-4 z-50 
        px-4 py-2 rounded-full shadow-lg
        flex items-center gap-2
        transition-all duration-300
        ${isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
        }
      `}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Offline</span>
        </>
      )}
    </div>
  );
}

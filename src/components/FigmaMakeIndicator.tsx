import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from './ui/button';

export function FigmaMakeIndicator() {
  const [isFigmaMake, setIsFigmaMake] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    const isFigma = window.location.hostname.includes('figma') || 
                    window.location.hostname.includes('localhost');
    setIsFigmaMake(isFigma);
    
    // Verificar se já foi dispensado
    const wasDismissed = sessionStorage.getItem('figma_indicator_dismissed');
    setDismissed(wasDismissed === 'true');
  }, []);
  
  if (!isFigmaMake || dismissed) return null;
  
  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('figma_indicator_dismissed', 'true');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 pr-12 relative animate-in slide-in-from-bottom-5 duration-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-white/20 text-white"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold mb-1">Modo de Visualização</p>
            <p className="text-sm text-blue-50 opacity-90">
              Você está no Figma Make. Os dados são exemplos. 
              <a 
                href="https://volleypro-zw96.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 underline font-semibold hover:text-white"
              >
                Acessar versão completa →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

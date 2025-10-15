import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Logo } from "./Logo";
import { useState } from "react";

interface WelcomeBannerProps {
  onLoginClick: () => void;
}

export function WelcomeBanner({ onLoginClick }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <Card className="relative overflow-hidden border-primary/50 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="pr-8">
          <div className="mb-4">
            <Logo variant="full" />
          </div>
          <p className="text-muted-foreground mb-4">
            A primeira rede social completa dedicada ao vôlei brasileiro. 
            Conecte-se com atletas, times, torcedores e toda a comunidade!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium text-sm">Feed Social</p>
                <p className="text-xs text-muted-foreground">Publique e interaja</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium text-sm">Torneios</p>
                <p className="text-xs text-muted-foreground">Crie e participe</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <p className="font-medium text-sm">Conexões</p>
                <p className="text-xs text-muted-foreground">Times e atletas</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={onLoginClick}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Criar Conta Grátis
            </Button>
            <Button 
              onClick={onLoginClick}
              variant="outline"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

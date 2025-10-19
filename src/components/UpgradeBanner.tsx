import { Button } from "./ui/button";
import { X, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";

interface UpgradeBannerProps {
  onUpgrade: () => void;
  dismissible?: boolean;
}

export function UpgradeBanner({ onUpgrade, dismissible = true }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    // Verificar se o banner foi dispensado anteriormente
    return localStorage.getItem('upgrade_banner_dismissed') === 'true';
  });

  // 🎯 ATIVAR APENAS APÓS O TORNEIO (07, 08 e 09 de novembro = ativa em 10/11/2025)
  const ACTIVATION_DATE = new Date('2025-11-10T00:00:00-03:00'); // 10 de novembro de 2025
  const currentDate = new Date();
  
  // Se ainda não chegou a data de ativação, não mostrar
  if (currentDate < ACTIVATION_DATE) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('upgrade_banner_dismissed', 'true');
    // Banner volta a aparecer após 7 dias
    setTimeout(() => {
      localStorage.removeItem('upgrade_banner_dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 shadow-lg mb-6">
      {/* Background animado */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(90deg, #0066ff 0%, #8b5cf6 50%, #f59e0b 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 8s ease infinite',
        }}
      />

      <div className="relative p-6">
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pr-8">
          {/* Ícone */}
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold">
              Desbloqueie Todo o Potencial do VolleyPro! 🚀
            </h3>
            <p className="text-muted-foreground">
              Faça upgrade para <strong>Premium</strong> e comece a monetizar seu conteúdo.
              Ganhe até <strong className="text-primary">70-80%</strong> de comissão em lives, 
              patrocínios e muito mais!
            </p>

            {/* Stats rápidos */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 rounded-lg bg-green-100">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">R$ 2K-10K/mês</p>
                  <p className="text-xs text-muted-foreground">Potencial de ganhos</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 rounded-lg bg-blue-100">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">70-80%</p>
                  <p className="text-xs text-muted-foreground">Comissão</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">6 formas</p>
                  <p className="text-xs text-muted-foreground">De monetizar</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button 
              size="lg"
              onClick={onUpgrade}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Ver Planos
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              A partir de R$ 19,90/mês
            </p>
          </div>
        </div>
      </div>

      {/* Linha de progresso animada */}
      <div className="h-1 bg-gradient-to-r from-primary via-purple-600 to-amber-500" 
        style={{
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 3s ease infinite',
        }}
      />
    </div>
  );
}

// Adicionar animação de gradiente
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;
document.head.appendChild(style);

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "./ui/utils";

interface UpgradePromptProps {
  variant?: 'banner' | 'card' | 'floating';
  message?: string;
  feature?: string;
  onUpgrade: () => void;
  dismissible?: boolean;
  className?: string;
}

export function UpgradePrompt({
  variant = 'card',
  message = "Desbloqueie recursos premium e leve sua presença ao próximo nível!",
  feature,
  onUpgrade,
  dismissible = false,
  className,
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Banner horizontal
  if (variant === 'banner') {
    return (
      <div 
        className={cn(
          "relative overflow-hidden border-2 border-primary/30 rounded-lg",
          className
        )}
        style={{
          background: 'linear-gradient(90deg, #0066ff15 0%, #8b5cf615 50%, #f59e0b15 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230066ff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {feature ? `${feature} é um recurso Premium` : 'Upgrade para Premium'}
              </p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={onUpgrade} className="gap-2">
              <Zap className="h-4 w-4" />
              Ver Planos
            </Button>
            {dismissible && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card destacado
  if (variant === 'card') {
    return (
      <Card 
        className={cn(
          "relative overflow-hidden border-2 border-primary/30 hover:shadow-xl transition-all",
          className
        )}
        style={{
          background: 'linear-gradient(135deg, #0066ff08 0%, #8b5cf608 50%, #f59e0b08 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Sparkles className="w-full h-full text-primary" />
        </div>

        <CardContent className="relative p-6 space-y-4">
          {dismissible && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">
                {feature ? `${feature} - Premium` : 'Upgrade Disponível'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground pr-8">
              {message}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
              <Sparkles className="h-3 w-3" />
              Posts ilimitados
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs">
              <Sparkles className="h-3 w-3" />
              Lives ilimitadas
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs">
              <Sparkles className="h-3 w-3" />
              Monetização
            </div>
          </div>

          <Button onClick={onUpgrade} className="w-full gap-2">
            <Zap className="h-4 w-4" />
            Ver Planos e Preços
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Floating (canto inferior direito)
  if (variant === 'floating') {
    return (
      <div 
        className={cn(
          "fixed bottom-6 right-6 z-50 max-w-sm",
          "animate-in slide-in-from-bottom-5 fade-in duration-500",
          className
        )}
      >
        <Card 
          className="border-2 border-primary/30 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #0066ff15 0%, #8b5cf615 100%)',
          }}
        >
          <CardContent className="p-4 space-y-3">
            {dismissible && (
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setDismissed(true)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            <div className="flex items-start gap-3 pr-6">
              <div className="p-2 rounded-lg bg-primary shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  {feature || 'Desbloqueie o Premium'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Monetize seu conteúdo e ganhe 70-80% de comissão
                </p>
              </div>
            </div>

            <Button onClick={onUpgrade} size="sm" className="w-full gap-2">
              <Zap className="h-3 w-3" />
              Ver Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

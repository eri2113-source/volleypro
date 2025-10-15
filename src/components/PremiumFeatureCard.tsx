import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Lock, Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "./ui/utils";

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  requiredPlan: 'pro' | 'premium' | 'elite';
  onUpgrade: () => void;
  icon?: React.ReactNode;
  features?: string[];
  className?: string;
}

const PLAN_INFO = {
  pro: {
    label: 'PRO',
    color: '#0066ff',
    gradient: 'from-blue-500/20 to-blue-600/20',
    icon: Sparkles,
  },
  premium: {
    label: 'PREMIUM',
    color: '#8b5cf6',
    gradient: 'from-purple-500/20 to-purple-600/20',
    icon: Zap,
  },
  elite: {
    label: 'ELITE',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-amber-600/20',
    icon: Crown,
  },
};

export function PremiumFeatureCard({
  title,
  description,
  requiredPlan,
  onUpgrade,
  icon,
  features = [],
  className,
}: PremiumFeatureCardProps) {
  const planInfo = PLAN_INFO[requiredPlan];
  const PlanIcon = planInfo.icon;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-2 transition-all hover:shadow-xl",
        className
      )}
      style={{
        borderColor: `${planInfo.color}40`,
        background: `linear-gradient(135deg, ${planInfo.color}08 0%, ${planInfo.color}15 100%)`,
      }}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${planInfo.color.replace('#', '%23')}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: `${planInfo.color}15`,
                  border: `2px solid ${planInfo.color}30`
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          
          <Badge 
            className="shrink-0 text-white font-semibold"
            style={{ backgroundColor: planInfo.color }}
          >
            <PlanIcon className="h-3 w-3 mr-1" />
            {planInfo.label}
          </Badge>
        </div>
      </CardHeader>

      {features.length > 0 && (
        <CardContent className="relative space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div 
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: planInfo.color }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </CardContent>
      )}

      <CardContent className="relative pt-0">
        <Button 
          onClick={onUpgrade}
          className="w-full gap-2 text-white font-semibold shadow-lg"
          style={{ backgroundColor: planInfo.color }}
        >
          <Sparkles className="h-4 w-4" />
          Fazer Upgrade para {planInfo.label}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          Desbloqueie este recurso e muito mais
        </p>
      </CardContent>
    </Card>
  );
}

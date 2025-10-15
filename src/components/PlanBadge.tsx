import { Badge } from "./ui/badge";
import { Crown, Star, Sparkles, Zap } from "lucide-react";
import { cn } from "./ui/utils";

interface PlanBadgeProps {
  plan: 'free' | 'pro' | 'premium' | 'elite';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const PLAN_CONFIG = {
  free: {
    label: 'Free',
    icon: null,
    color: '#64748b',
    gradient: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
  },
  pro: {
    label: 'PRO',
    icon: Star,
    color: '#0066ff',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    shine: true,
  },
  premium: {
    label: 'PREMIUM',
    icon: Sparkles,
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    shine: true,
  },
  elite: {
    label: 'ELITE',
    icon: Crown,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    shine: true,
    glow: true,
  },
};

export function PlanBadge({ plan, size = 'md', showIcon = true, className }: PlanBadgeProps) {
  const config = PLAN_CONFIG[plan];
  const Icon = config.icon;
  
  if (plan === 'free') {
    return null; // Não mostrar badge para usuários free
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <Badge
      className={cn(
        'relative overflow-hidden border-2 font-semibold transition-all',
        sizeClasses[size],
        config.bgColor,
        config.textColor,
        config.borderColor,
        config.glow && 'shadow-lg animate-pulse',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${config.color}15 0%, ${config.color}25 100%)`,
      }}
    >
      {/* Efeito de brilho animado */}
      {config.shine && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${config.color}40 50%, transparent 100%)`,
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />
      )}
      
      {showIcon && Icon && <Icon className={iconSizes[size]} />}
      <span className="relative z-10">{config.label}</span>
    </Badge>
  );
}

// Adicionar keyframes para animação de brilho
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }
`;
document.head.appendChild(style);

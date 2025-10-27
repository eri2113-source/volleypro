import { cn } from "../components/ui/utils";
import ballImage from "figma:asset/67bd6f31bc6e950b2dd7989fff8ddb235a0b77a2.png";

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  className?: string;
  withShadow?: boolean;
}

export function Logo({ variant = 'full', className, withShadow = false }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div 
        className={cn("relative rounded-full bg-gradient-to-br from-blue-50 to-orange-50", className)} 
        style={{ 
          width: '48px', 
          height: '48px',
          backgroundImage: `url(${ballImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      />
    );
  }

  if (variant === 'compact') {
    const textStyle = withShadow ? {
      textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)',
      filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))'
    } : {};

    return (
      <div className={cn("flex items-center gap-3", className)} translate="no">
        <div 
          className="relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-50 to-orange-50" 
          style={{ 
            width: '40px', 
            height: '40px',
            backgroundImage: `url(${ballImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            filter: withShadow ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
          }}
        />
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-black tracking-tight" style={{ 
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            ...textStyle
          }}>
            Volley
          </span>
          <span className="text-2xl font-black tracking-tight" style={{ 
            background: 'linear-gradient(135deg, #FFC72C 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            ...textStyle
          }}>
            Pro
          </span>
        </div>
      </div>
    );
  }

  // Full logo
  return (
    <div className={cn("flex items-center gap-3", className)} translate="no">
      {/* VolleyPro Logo - Bola de Vôlei */}
      <div 
        className="relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-50 to-orange-50" 
        style={{ 
          width: '56px', 
          height: '56px',
          backgroundImage: `url(${ballImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Texto VolleyPro */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span className="text-3xl font-black tracking-tight" style={{ 
            background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Volley
          </span>
          <span className="text-3xl font-black tracking-tight" style={{ 
            background: 'linear-gradient(135deg, #FFC72C 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Pro
          </span>
        </div>
        <span className="text-[11px] tracking-widest uppercase text-muted-foreground ml-0.5" translate="yes">
          Rede Social do Vôlei
        </span>
      </div>
    </div>
  );
}
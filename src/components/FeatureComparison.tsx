import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

interface Feature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
  elite: boolean | string;
}

const features: Feature[] = [
  { name: "Posts por mês", free: "10", pro: "∞", premium: "∞", elite: "∞" },
  { name: "Fotos", free: "5/sem", pro: "∞", premium: "∞", elite: "∞" },
  { name: "Vídeos", free: "1/sem", pro: "10/sem", premium: "∞", elite: "∞" },
  { name: "Lives", free: false, pro: "2/sem", premium: "∞", elite: "∞" },
  { name: "Armazenamento", free: "500MB", pro: "5GB", premium: "20GB", elite: "∞" },
  { name: "Analytics", free: false, pro: true, premium: true, elite: true },
  { name: "Sem anúncios", free: false, pro: true, premium: true, elite: true },
  { name: "Badge verificado", free: false, pro: false, premium: true, elite: true },
  { name: "Monetização", free: false, pro: false, premium: "70%", elite: "80%" },
  { name: "Patrocínios", free: false, pro: false, premium: true, elite: true },
  { name: "Transmissão HD", free: false, pro: false, premium: true, elite: "4K" },
  { name: "Suporte prioritário", free: false, pro: true, premium: true, elite: "24/7" },
  { name: "API de integração", free: false, pro: false, premium: false, elite: true },
  { name: "Gerente de conta", free: false, pro: false, premium: false, elite: true },
];

interface FeatureComparisonProps {
  onSelectPlan: (planId: string) => void;
}

export function FeatureComparison({ onSelectPlan }: FeatureComparisonProps) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm font-semibold">{value}</span>;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Compare os Planos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-semibold min-w-[200px]">Recurso</th>
                <th className="text-center p-4 min-w-[120px]">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-slate-600 border-slate-300">
                      Free
                    </Badge>
                    <div className="text-2xl">R$ 0</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectPlan('free')}
                    >
                      Atual
                    </Button>
                  </div>
                </th>
                <th className="text-center p-4 min-w-[120px] bg-blue-50/50">
                  <div className="space-y-2">
                    <Badge className="bg-primary text-white">
                      Pro
                    </Badge>
                    <div>
                      <div className="text-2xl">R$ 19,90</div>
                      <div className="text-xs text-muted-foreground">/mês</div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onSelectPlan('pro')}
                      className="bg-primary"
                    >
                      Escolher
                    </Button>
                  </div>
                </th>
                <th className="text-center p-4 min-w-[120px] bg-purple-50/50 border-x-2 border-purple-300">
                  <div className="space-y-2">
                    <Badge className="bg-purple-600 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                    <div>
                      <div className="text-2xl">R$ 49,90</div>
                      <div className="text-xs text-muted-foreground">/mês</div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onSelectPlan('premium')}
                      className="bg-purple-600"
                    >
                      Escolher
                    </Button>
                    <div className="text-xs font-semibold text-purple-600">
                      Mais Popular
                    </div>
                  </div>
                </th>
                <th className="text-center p-4 min-w-[120px] bg-amber-50/50">
                  <div className="space-y-2">
                    <Badge className="bg-amber-500 text-white">
                      Elite
                    </Badge>
                    <div>
                      <div className="text-2xl">R$ 99,90</div>
                      <div className="text-xs text-muted-foreground">/mês</div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onSelectPlan('elite')}
                      className="bg-amber-500"
                    >
                      Escolher
                    </Button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr 
                  key={idx} 
                  className={`
                    border-b transition-colors hover:bg-muted/20
                    ${idx % 2 === 0 ? '' : 'bg-muted/10'}
                  `}
                >
                  <td className="p-4 text-sm font-medium">{feature.name}</td>
                  <td className="p-4 text-center">{renderValue(feature.free)}</td>
                  <td className="p-4 text-center bg-blue-50/20">{renderValue(feature.pro)}</td>
                  <td className="p-4 text-center bg-purple-50/20 border-x-2 border-purple-100">
                    {renderValue(feature.premium)}
                  </td>
                  <td className="p-4 text-center bg-amber-50/20">{renderValue(feature.elite)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Final */}
        <div className="p-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-amber-500/10 text-center space-y-3">
          <p className="font-semibold">
            Escolha o plano ideal para você e comece a monetizar hoje mesmo!
          </p>
          <p className="text-sm text-muted-foreground">
            Todos os planos incluem 7 dias de teste grátis. Cancele quando quiser.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button 
              size="lg"
              onClick={() => onSelectPlan('premium')}
              className="gap-2 bg-purple-600"
            >
              <Sparkles className="h-4 w-4" />
              Começar com Premium
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => onSelectPlan('pro')}
            >
              Começar com Pro
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

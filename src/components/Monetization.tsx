import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { FeatureComparison } from "./FeatureComparison";
import { 
  SUBSCRIPTION_PLANS, 
  ADVERTISING_QUOTAS,
  ATHLETE_MONETIZATION_OPTIONS,
  formatPrice,
  getYearlyPrice,
  getYearlySavings,
  formatImpressions 
} from "../lib/monetizationPlans";
import { 
  Check, 
  Zap, 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign,
  Sparkles,
  Crown,
  Star,
  Rocket,
  BarChart3,
  Shield,
  Gift,
  Info
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { trackViewPlans, trackBeginCheckout } from "../utils/googleTagManager";

export function Monetization() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTab, setSelectedTab] = useState('plans');

  // Rastrear visualização de planos quando componente monta
  useState(() => {
    trackViewPlans();
  });

  const handleSelectPlan = (planId: string) => {
    // Encontrar o plano selecionado
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (plan && plan.price > 0) {
      const price = billingCycle === 'yearly' ? getYearlyPrice(plan) : plan.price;
      // Rastrear início do checkout (conversão importante!)
      trackBeginCheckout(plan.name, price);
    }
    
    toast.info("Em breve! 🚀", {
      description: "Sistema de pagamentos será implementado em breve. Entre em contato para mais informações."
    });
  };

  const handleSelectQuota = (quotaId: string) => {
    toast.info("Interesse registrado! 📊", {
      description: "Nossa equipe comercial entrará em contato em breve para apresentar a proposta."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-10 w-10 text-primary" />
          <h1 className="text-4xl">Monetização VolleyPro</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Cresça sua presença, monetize seu talento e conecte-se com oportunidades no mundo do vôlei! 🏐✨
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="plans" className="gap-2">
            <Star className="h-4 w-4" />
            Planos de Assinatura
          </TabsTrigger>
          <TabsTrigger value="advertising" className="gap-2">
            <Target className="h-4 w-4" />
            Publicidade
          </TabsTrigger>
          <TabsTrigger value="athletes" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Ganhe como Atleta
          </TabsTrigger>
        </TabsList>

        {/* TAB: Planos de Assinatura */}
        <TabsContent value="plans" className="space-y-8">
          {/* Toggle de período */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('monthly')}
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('yearly')}
              className="gap-2"
            >
              Anual
              <Badge variant="secondary" className="bg-green-500 text-white">
                Economize até 30%
              </Badge>
            </Button>
          </div>

          {/* Grid de planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const price = billingCycle === 'yearly' ? getYearlyPrice(plan) / 12 : plan.price;
              const savings = billingCycle === 'yearly' ? getYearlySavings(plan) : 0;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`
                    relative transition-all hover:shadow-xl
                    ${plan.popular ? 'border-primary border-2 shadow-lg scale-105' : ''}
                  `}
                  style={{ 
                    background: `linear-gradient(135deg, ${plan.color}10 0%, ${plan.color}05 100%)`,
                    borderColor: plan.popular ? plan.color : undefined
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white shadow-lg px-4 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-2">{plan.icon}</div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="min-h-[40px]">
                      {plan.description}
                    </CardDescription>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl">{formatPrice(price)}</span>
                        <span className="text-muted-foreground">/mês</span>
                      </div>
                      {billingCycle === 'yearly' && plan.price > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Economize {formatPrice(savings)}/ano
                        </p>
                      )}
                      {billingCycle === 'yearly' && plan.price > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Cobrado {formatPrice(getYearlyPrice(plan))} anualmente
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(plan.id)}
                      style={{ 
                        backgroundColor: plan.popular ? plan.color : undefined,
                        borderColor: plan.color,
                        color: plan.popular ? '#ffffff' : plan.color
                      }}
                    >
                      {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                    </Button>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Recursos:</p>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.athleteFeatures && plan.athleteFeatures.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-semibold flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Para Atletas:
                          </p>
                          {plan.athleteFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {plan.teamFeatures && plan.teamFeatures.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-semibold flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            Para Times:
                          </p>
                          {plan.teamFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparação detalhada de recursos */}
          <div className="mt-12">
            <FeatureComparison onSelectPlan={handleSelectPlan} />
          </div>

          {/* Informações importantes */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Por que fazer upgrade?</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ <strong>Monetize</strong> seu conteúdo e ganhe 70-80% de comissão</li>
                    <li>✅ <strong>Sem limites</strong> de posts, fotos e vídeos</li>
                    <li>✅ <strong>Lives ilimitadas</strong> com doações e super chats</li>
                    <li>✅ <strong>Patrocínios</strong> de marcas através do nosso marketplace</li>
                    <li>✅ <strong>Analytics avançado</strong> para acompanhar seu crescimento</li>
                    <li>✅ <strong>Badge verificado</strong> para ganhar credibilidade</li>
                    <li>✅ <strong>Suporte prioritário</strong> para resolver qualquer dúvida</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Publicidade para Empresas */}
        <TabsContent value="advertising" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2">Anuncie no VolleyPro</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conecte sua marca com milhares de atletas, times e fãs apaixonados por vôlei.
              Escolha a cota ideal para seu investimento! 📊
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVERTISING_QUOTAS.map((quota) => (
              <Card 
                key={quota.id}
                className={`
                  relative transition-all hover:shadow-xl
                  ${quota.popular ? 'border-primary border-2 shadow-lg' : ''}
                `}
                style={{ 
                  background: `linear-gradient(135deg, ${quota.color}15 0%, ${quota.color}05 100%)`
                }}
              >
                {quota.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white shadow-lg px-4 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Melhor Custo-Benefício
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{quota.icon}</div>
                  <CardTitle className="text-2xl">{quota.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">
                    {quota.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl">{formatPrice(quota.price)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      por {quota.duration} dias
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button 
                    className="w-full gap-2" 
                    style={{ 
                      backgroundColor: quota.color,
                      color: '#ffffff'
                    }}
                    onClick={() => handleSelectQuota(quota.id)}
                  >
                    <Rocket className="h-4 w-4" />
                    Contratar Agora
                  </Button>

                  <Separator />

                  {/* Métricas */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Impressões</p>
                      <p className="font-semibold">
                        {formatImpressions(quota.impressions.min)}-{formatImpressions(quota.impressions.max)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">CTR Médio</p>
                      <p className="font-semibold text-green-600">{quota.ctr}</p>
                    </div>
                    <div className="text-center col-span-2">
                      <p className="text-xs text-muted-foreground">ROI Estimado</p>
                      <p className="font-semibold text-blue-600">{quota.roi}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">O que está incluso:</p>
                    {quota.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA para empresas */}
          <Card className="mt-12 bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">Precisa de uma solução personalizada?</h3>
              <p className="mb-6 opacity-90">
                Entre em contato com nossa equipe comercial para criar um plano sob medida para sua empresa.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => toast.info("Contato registrado!", {
                  description: "Nossa equipe comercial entrará em contato em até 24 horas."
                })}
              >
                Falar com Consultor
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Monetização para Atletas */}
        <TabsContent value="athletes" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-2">Transforme sua Paixão em Renda</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Atletas Premium e Elite podem monetizar seu conteúdo de diversas formas.
              Ganhe enquanto faz o que ama! 💪✨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ATHLETE_MONETIZATION_OPTIONS.map((option) => {
              const requiredPlan = SUBSCRIPTION_PLANS.find(p => p.id === option.minimumPlan);
              
              return (
                <Card 
                  key={option.id}
                  className="transition-all hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${option.color}15 0%, ${option.color}05 100%)`
                  }}
                >
                  <CardHeader>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3"
                      style={{ 
                        backgroundColor: option.color + '20',
                        border: `2px solid ${option.color}40`
                      }}
                    >
                      {option.icon}
                    </div>
                    <CardTitle>{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Comissão */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 text-center">
                        Você recebe <span className="font-bold text-lg">{option.commission}%</span> de comissão
                      </p>
                    </div>

                    {/* Plano necessário */}
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        className="text-white"
                        style={{ backgroundColor: requiredPlan?.color }}
                      >
                        Requer {requiredPlan?.name}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Recursos:</p>
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: option.color }} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full mt-4"
                      style={{ 
                        backgroundColor: option.color,
                        color: '#ffffff'
                      }}
                      onClick={() => handleSelectPlan(option.minimumPlan)}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Começar a Ganhar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Exemplo de ganhos */}
          <Card className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Gift className="h-6 w-6" />
                Potencial de Ganhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">Atleta Iniciante</p>
                  <p className="text-2xl font-bold text-green-600">R$ 500-2K</p>
                  <p className="text-xs text-muted-foreground mt-1">por mês</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-green-500">
                  <p className="text-sm text-muted-foreground mb-1">Atleta Estabelecido</p>
                  <p className="text-2xl font-bold text-green-600">R$ 2K-10K</p>
                  <p className="text-xs text-muted-foreground mt-1">por mês</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">Atleta Top</p>
                  <p className="text-2xl font-bold text-green-600">R$ 10K+</p>
                  <p className="text-xs text-muted-foreground mt-1">por mês</p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                *Valores estimados baseados em engajamento médio. Resultados podem variar.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold mb-1">Posso cancelar minha assinatura a qualquer momento?</p>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode cancelar a qualquer momento. Assinaturas mensais param no final do período pago, e anuais podem ser reembolsadas proporcionalmente.
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-semibold mb-1">Como funciona o pagamento de comissões para atletas?</p>
            <p className="text-sm text-muted-foreground">
              Pagamentos são processados mensalmente via PIX ou transferência bancária. Você acompanha seus ganhos em tempo real no dashboard.
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-semibold mb-1">As empresas podem segmentar seus anúncios?</p>
            <p className="text-sm text-muted-foreground">
              Sim! Oferecemos segmentação por localização, idade, tipo de esporte, nível de atleta e muito mais.
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-semibold mb-1">Qual a diferença entre Premium e Elite?</p>
            <p className="text-sm text-muted-foreground">
              Elite inclui tudo do Premium mais recursos profissionais como armazenamento ilimitado, transmissão 4K, API de integração e gerente de conta dedicado.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
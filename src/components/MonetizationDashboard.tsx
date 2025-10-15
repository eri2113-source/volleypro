import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Eye,
  Users,
  Video,
  ShoppingBag,
  Target,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Crown,
  Gift,
  BarChart3
} from "lucide-react";

interface MonetizationDashboardProps {
  userPlan?: 'free' | 'pro' | 'premium' | 'elite';
}

export function MonetizationDashboard({ userPlan = 'free' }: MonetizationDashboardProps) {
  // Mock data - será substituído por dados reais do backend
  const stats = {
    totalEarnings: 4567.80,
    thisMonth: 1234.50,
    lastMonth: 987.30,
    pendingPayments: 234.50,
    liveViews: 12450,
    contentSales: 45,
    sponsorships: 3,
    subscribers: 67,
  };

  const monthlyGrowth = ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100;

  const revenueBySource = [
    { source: 'Lives', amount: 567.80, percentage: 46, color: '#ef4444' },
    { source: 'Conteúdo Exclusivo', amount: 345.20, percentage: 28, color: '#8b5cf6' },
    { source: 'Patrocínios', amount: 234.50, percentage: 19, color: '#0066ff' },
    { source: 'Coaching', amount: 87.00, percentage: 7, color: '#10b981' },
  ];

  const canMonetize = userPlan === 'premium' || userPlan === 'elite';

  if (!canMonetize) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Monetização Premium</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Faça upgrade para Premium ou Elite e comece a ganhar dinheiro com seu conteúdo!
            </p>
            <Button size="lg" className="gap-2">
              <Zap className="h-5 w-5" />
              Fazer Upgrade Agora
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-card rounded-lg">
                <div className="text-2xl mb-1">70-80%</div>
                <p className="text-sm text-muted-foreground">Comissão</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <div className="text-2xl mb-1">6 formas</div>
                <p className="text-sm text-muted-foreground">De monetizar</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <div className="text-2xl mb-1">R$ 2K+</div>
                <p className="text-sm text-muted-foreground">Potencial/mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Dashboard de Monetização</h1>
          <p className="text-muted-foreground">
            Acompanhe seus ganhos e performance em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500 text-white">
            <DollarSign className="h-3 w-3 mr-1" />
            Plano {userPlan === 'premium' ? 'Premium' : 'Elite'}
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="gradient-blue border-volleyball-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Acumulado</p>
              <DollarSign className="h-5 w-5 text-volleyball-blue" />
            </div>
            <div className="text-2xl mb-1">
              R$ {stats.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              +23% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-green border-volleyball-green/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Este Mês</p>
              <TrendingUp className="h-5 w-5 text-volleyball-green" />
            </div>
            <div className="text-2xl mb-1">
              R$ {stats.thisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className={`text-xs flex items-center gap-1 ${monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyGrowth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}% vs último mês
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-orange border-volleyball-orange/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">A Receber</p>
              <Calendar className="h-5 w-5 text-volleyball-orange" />
            </div>
            <div className="text-2xl mb-1">
              R$ {stats.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximo pagamento em 15 dias
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-purple border-volleyball-purple/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Assinantes</p>
              <Users className="h-5 w-5 text-volleyball-purple" />
            </div>
            <div className="text-2xl mb-1">{stats.subscribers}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              +12 novos esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Receita por Fonte
            </CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueBySource.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.source}
                  </span>
                  <span className="font-semibold">
                    R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Meta do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">
                R$ {stats.thisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-muted-foreground">de R$ 2.000,00</p>
            </div>
            <Progress value={(stats.thisMonth / 2000) * 100} className="h-3 mb-2" />
            <p className="text-center text-sm text-muted-foreground">
              {((stats.thisMonth / 2000) * 100).toFixed(1)}% da meta atingida
            </p>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Falta para a meta:</span>
                <span className="font-semibold">R$ {(2000 - stats.thisMonth).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Média por dia:</span>
                <span className="font-semibold">R$ {(stats.thisMonth / 20).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="lives">Lives</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="sponsorships">Patrocínios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Lives
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl">{stats.liveViews.toLocaleString('pt-BR')}</p>
                  <p className="text-sm text-muted-foreground">Visualizações totais</p>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Média por live:</span>
                  <span className="font-semibold">245 viewers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    Vendas
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl">{stats.contentSales}</p>
                  <p className="text-sm text-muted-foreground">Conteúdos vendidos</p>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de conversão:</span>
                  <span className="font-semibold text-green-600">3.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Patrocínios
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl">{stats.sponsorships}</p>
                  <p className="text-sm text-muted-foreground">Contratos ativos</p>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor total:</span>
                  <span className="font-semibold">R$ 1.500/mês</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas atividades de monetização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Live', description: 'Doações - Live de Treino', amount: 45.80, date: 'Hoje, 14:30', icon: Video, color: 'red' },
                  { type: 'Conteúdo', description: 'Venda - Tutorial de Saque', amount: 19.90, date: 'Hoje, 11:15', icon: ShoppingBag, color: 'purple' },
                  { type: 'Assinatura', description: 'Novo assinante - Clube Bronze', amount: 9.90, date: 'Ontem, 18:45', icon: Users, color: 'green' },
                  { type: 'Patrocínio', description: 'Nike Brasil - Post Instagram', amount: 500.00, date: 'Ontem, 10:00', icon: Gift, color: 'blue' },
                  { type: 'Live', description: 'Super Chats - Live de Jogo', amount: 87.50, date: '2 dias atrás', icon: Video, color: 'red' },
                ].map((transaction, idx) => {
                  const Icon = transaction.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${transaction.color}-100 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 text-${transaction.color}-600`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lives">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Estatísticas detalhadas de lives em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Análise de vendas de conteúdo em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsorships">
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Gestão de patrocínios em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

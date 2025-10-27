import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Logo } from "./Logo";
import { 
  Users, 
  Trophy, 
  Radio, 
  Shield, 
  CheckCircle2, 
  Star,
  TrendingUp,
  MessageSquare,
  Heart,
  Award,
  Zap,
  Target
} from "lucide-react";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: "Conecte-se com Atletas",
      description: "Siga seus jogadores favoritos, acompanhe suas carreiras e interaja com a comunidade do vôlei."
    },
    {
      icon: Shield,
      title: "Times e Equipes",
      description: "Crie perfis de times, gerencie elencos e mantenha sua equipe sempre atualizada."
    },
    {
      icon: Trophy,
      title: "Torneios e Competições",
      description: "Organize torneios, acompanhe tabelas, classificações e rankings MVP em tempo real."
    },
    {
      icon: Radio,
      title: "Transmissões ao Vivo",
      description: "Assista e transmita jogos ao vivo, compartilhe momentos especiais com a comunidade."
    },
    {
      icon: Target,
      title: "Vitrine de Jogadores",
      description: "Atletas livres no mercado podem se destacar e receber convites de times interessados."
    },
    {
      icon: MessageSquare,
      title: "Feed Social Completo",
      description: "Publique fotos, vídeos, enquetes e interaja com curtidas, comentários e compartilhamentos."
    }
  ];

  const stats = [
    { value: "1000+", label: "Atletas" },
    { value: "200+", label: "Times" },
    { value: "50+", label: "Torneios" },
    { value: "10k+", label: "Torcedores" }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header/Navbar */}
      <header className="border-b bg-gradient-to-r from-primary via-[#0052cc] to-primary shadow-lg fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo variant="compact" className="[&_img]:w-9 [&_img]:h-9 [&_span]:text-white" withShadow />
          <Button 
            onClick={onLoginClick} 
            className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
            size="lg"
          >
            Entrar / Cadastrar
          </Button>
        </div>
      </header>

      {/* Spacer para compensar o header fixo */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230066ff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo grande */}
            <div className="flex justify-center mb-8">
              <Logo className="[&_img]:w-20 [&_img]:h-20" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-[#0052cc] to-secondary bg-clip-text text-transparent">
              A Rede Social do Vôlei
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Conecte-se com atletas, times e torcedores. Organize torneios, transmita jogos ao vivo e faça parte da maior comunidade de vôlei do Brasil!
            </p>

            {/* Banner Beta */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20 rounded-xl p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary text-lg">VERSÃO BETA - TESTE GRÁTIS!</span>
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Seja um dos primeiros testadores do VolleyPro! Crie sua conta gratuitamente, 
                complete seu perfil e ajude-nos a construir a melhor rede social do vôlei. 
                <strong className="text-foreground"> Todas as funcionalidades estão liberadas!</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onLoginClick}
                size="lg"
                className="bg-gradient-to-r from-primary to-[#0052cc] hover:from-primary/90 hover:to-[#0052cc]/90 text-white shadow-2xl shadow-primary/50 text-lg px-8 py-6 h-auto"
              >
                <Star className="mr-2 h-5 w-5" />
                Criar Conta Grátis!
              </Button>
              
              <Button 
                onClick={onLoginClick}
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6 h-auto"
              >
                Já tenho conta
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Sem Anúncios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Dados Seguros</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary via-[#0052cc] to-secondary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para atletas, times e fãs do vôlei profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-3 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Para quem é o VolleyPro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Três tipos de perfis para atender toda a comunidade do vôlei
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Atleta */}
            <Card className="border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-primary to-[#0052cc] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">🏐 Atletas</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Crie seu perfil profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Entre na vitrine de jogadores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Receba convites de times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Compartilhe sua jornada</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Time */}
            <Card className="border-2 border-secondary/20 hover:border-secondary transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-secondary to-[#ff8555] rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">⚡ Times</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Gerencie seu elenco</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Convide jogadores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Organize torneios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Cresça sua torcida</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Fã/Torcedor */}
            <Card className="border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">🎉 Fãs/Torcedores</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Siga seus ídolos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acompanhe times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Assista lives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Interaja com a comunidade</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-[#0052cc] to-secondary relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Star className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Pronto para fazer parte?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90">
              Junte-se a milhares de atletas, times e torcedores na maior rede social do vôlei brasileiro!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onLoginClick}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-2xl text-lg px-10 py-7 h-auto font-bold"
              >
                <Award className="mr-2 h-6 w-6" />
                Criar Minha Conta Grátis
              </Button>
            </div>
            <p className="mt-8 text-white/70 text-sm">
              Não é necessário cartão de crédito • Comece em menos de 2 minutos
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Logo variant="compact" className="[&_img]:w-8 [&_img]:h-8" />
              <span className="text-muted-foreground">
                © 2024 VolleyPro. Todos os direitos reservados.
              </span>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.hash = 'download-logos'}
                className="text-muted-foreground hover:text-primary"
              >
                🎨 Baixar Logos
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
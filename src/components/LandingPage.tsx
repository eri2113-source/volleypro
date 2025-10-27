import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Logo } from "./Logo";
import { motion } from "motion/react";
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
  Target,
  Sparkles,
  Rocket,
  Play,
  ArrowRight
} from "lucide-react";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: "Conecte-se com Atletas",
      description: "Siga seus jogadores favoritos, acompanhe suas carreiras e interaja com a comunidade do vôlei.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Times e Equipes",
      description: "Crie perfis de times, gerencie elencos e mantenha sua equipe sempre atualizada.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Trophy,
      title: "Torneios e Competições",
      description: "Organize torneios, acompanhe tabelas, classificações e rankings MVP em tempo real.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Radio,
      title: "Transmissões ao Vivo",
      description: "Assista e transmita jogos ao vivo, compartilhe momentos especiais com a comunidade.",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: Target,
      title: "Vitrine de Jogadores",
      description: "Atletas livres no mercado podem se destacar e receber convites de times interessados.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageSquare,
      title: "Feed Social Completo",
      description: "Publique fotos, vídeos, enquetes e interaja com curtidas, comentários e compartilhamentos.",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const stats = [
    { value: "1000+", label: "Atletas", icon: Users },
    { value: "200+", label: "Times", icon: Shield },
    { value: "50+", label: "Torneios", icon: Trophy },
    { value: "10k+", label: "Torcedores", icon: Heart }
  ];

  const benefits = [
    { text: "100% Gratuito na Beta", icon: CheckCircle2 },
    { text: "Sem Anúncios Intrusivos", icon: CheckCircle2 },
    { text: "Dados Seguros e Protegidos", icon: CheckCircle2 },
    { text: "Todas as Funcionalidades Liberadas", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Header/Navbar com Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-background/80 shadow-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo variant="compact" />
          <Button 
            onClick={onLoginClick} 
            className="bg-gradient-to-r from-primary to-[#0052cc] hover:from-primary/90 hover:to-[#0052cc]/90 text-white shadow-lg font-semibold"
            size="lg"
          >
            Entrar / Cadastrar
          </Button>
        </div>
      </header>

      {/* Spacer para compensar o header fixo */}
      <div className="h-16"></div>

      {/* Hero Section com Gradiente Animado */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Gradient Animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 199, 44, 0.2) 0%, transparent 50%)'
          }}></div>
        </div>

        {/* Padrão de Bolas de Vôlei */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230066ff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge de Lançamento */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full px-6 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">🎉 Agora em BETA - Cadastre-se GRÁTIS!</span>
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
            </motion.div>

            {/* Logo grande */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <Logo className="[&_img]:w-24 [&_img]:h-24" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-[#0052cc] to-secondary bg-clip-text text-transparent">
                  A Primeira Rede Social
                </span>
                <br />
                <span className="bg-gradient-to-r from-secondary via-[#ff8800] to-primary bg-clip-text text-transparent">
                  100% Vôlei
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto font-medium">
                Conecte-se com <span className="text-primary font-bold">atletas</span>, 
                crie seu <span className="text-secondary font-bold">time</span>, 
                organize <span className="text-primary font-bold">torneios</span> e 
                transmita <span className="text-secondary font-bold">lives</span>!
              </p>

              {/* CTAs Principais */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={onLoginClick}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-[#0052cc] hover:from-primary/90 hover:to-[#0052cc]/90 text-white shadow-2xl shadow-primary/50 text-xl px-10 py-7 h-auto font-bold"
                  >
                    <Rocket className="mr-2 h-6 w-6" />
                    Criar Conta GRÁTIS
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={onLoginClick}
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-xl px-10 py-7 h-auto font-bold transition-all duration-300"
                  >
                    Já tenho conta
                  </Button>
                </motion.div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border rounded-full px-4 py-2"
                  >
                    <benefit.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section com Cards Flutuantes */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#0052cc] to-secondary opacity-95"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/90 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section com Cards Modernos */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tudo que você precisa
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Uma plataforma completa para atletas, times e fãs do vôlei brasileiro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
              >
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl h-full bg-gradient-to-br from-background to-primary/5">
                  <CardContent className="p-8">
                    <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 w-fit mb-6 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0052cc] to-secondary"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-6">
              <Zap className="h-16 w-16 text-white mx-auto mb-4" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Junte-se à maior comunidade de vôlei do Brasil e leve sua paixão pelo esporte a um novo nível!
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onLoginClick}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-2xl text-2xl px-12 py-8 h-auto font-black"
              >
                <Star className="mr-3 h-7 w-7" />
                Criar Minha Conta Agora
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </motion.div>

            <p className="text-white/70 mt-6 text-sm">
              Sem cartão de crédito • Cadastro em 30 segundos • Todas as funcionalidades liberadas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo variant="compact" />
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2025 VolleyPro. A rede social do vôlei brasileiro.
              <br />
              Feito com <Heart className="inline h-4 w-4 text-red-500" /> para a comunidade do vôlei.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

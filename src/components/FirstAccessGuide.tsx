import { useState, useEffect } from "react";
import { X, Camera, UserCircle2, Trophy, Radio, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";

interface FirstAccessGuideProps {
  userType: "athlete" | "team" | "fan";
  onComplete: () => void;
}

export function FirstAccessGuide({ userType, onComplete }: FirstAccessGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Verificar se é o primeiro acesso
    const hasSeenGuide = localStorage.getItem("volleypro_first_access_guide");
    if (!hasSeenGuide) {
      // Pequeno delay para suavizar a abertura
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("volleypro_first_access_guide", "true");
    setIsOpen(false);
    onComplete();
  };

  const steps = {
    athlete: [
      {
        icon: Camera,
        title: "Complete seu perfil",
        description: "Adicione uma foto, suas estatísticas, posição e informações importantes. Um perfil completo recebe até 5x mais visibilidade!",
        action: "Ir para Perfil",
        color: "text-blue-500"
      },
      {
        icon: Users,
        title: "Conecte-se com a comunidade",
        description: "Siga outros atletas, times e fãs. Explore a página de Atletas e Times para encontrar pessoas do seu interesse.",
        action: "Ver Atletas",
        color: "text-green-500"
      },
      {
        icon: Trophy,
        title: "Participe de torneios",
        description: "Inscreva-se em torneios para competir e mostrar suas habilidades. Acompanhe rankings e estatísticas.",
        action: "Ver Torneios",
        color: "text-orange-500"
      },
      {
        icon: Radio,
        title: "Crie conteúdo",
        description: "Publique no feed, compartilhe treinos e partidas. Use Lives para transmitir seus jogos ao vivo!",
        action: "Começar",
        color: "text-purple-500"
      }
    ],
    team: [
      {
        icon: Camera,
        title: "Configure seu time",
        description: "Adicione logo, informações do time, ano de fundação e títulos conquistados. Um perfil completo atrai mais jogadores!",
        action: "Ir para Perfil",
        color: "text-blue-500"
      },
      {
        icon: Users,
        title: "Monte seu elenco",
        description: "Convide atletas para seu time através da Vitrine de Jogadores. Gerencie escalações e avaliações dos jogadores.",
        action: "Ver Vitrine",
        color: "text-green-500"
      },
      {
        icon: Trophy,
        title: "Crie torneios",
        description: "Organize campeonatos e competições. Gerencie inscrições, chaveamentos e acompanhe resultados.",
        action: "Criar Torneio",
        color: "text-orange-500"
      },
      {
        icon: Radio,
        title: "Transmita partidas",
        description: "Use Lives para transmitir jogos do seu time. Mantenha torcedores e atletas sempre conectados!",
        action: "Começar",
        color: "text-purple-500"
      }
    ],
    fan: [
      {
        icon: Camera,
        title: "Personalize seu perfil",
        description: "Adicione foto, time favorito e jogador preferido. Mostre sua paixão pelo vôlei!",
        action: "Ir para Perfil",
        color: "text-blue-500"
      },
      {
        icon: Users,
        title: "Siga seus ídolos",
        description: "Acompanhe atletas e times favoritos. Receba atualizações sobre treinos, jogos e bastidores.",
        action: "Ver Atletas",
        color: "text-green-500"
      },
      {
        icon: Trophy,
        title: "Acompanhe torneios",
        description: "Veja classificações, resultados e rankings MVP. Torça pelo seu time e jogadores favoritos!",
        action: "Ver Torneios",
        color: "text-orange-500"
      },
      {
        icon: Radio,
        title: "Interaja com Lives",
        description: "Assista transmissões ao vivo, comente e reaja. Participe da comunidade em tempo real!",
        action: "Começar",
        color: "text-purple-500"
      }
    ]
  };

  const currentSteps = steps[userType] || steps.fan;
  const step = currentSteps[currentStep];
  const StepIcon = step?.icon;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleComplete()}>
      <DialogContent className="max-w-2xl" aria-describedby="first-access-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            Bem-vindo ao VolleyPro!
          </DialogTitle>
          <DialogDescription id="first-access-description" className="sr-only">
            Guia de primeiros passos para conhecer a plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="flex gap-2">
            {currentSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-primary/10 ${step.color}`}>
                  <StepIcon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="mb-2">{step.title}</CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tips based on user type */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              💡 Dica importante:
            </p>
            {userType === "athlete" && (
              <p className="text-sm text-muted-foreground">
                Atletas com perfil completo e foto recebem muito mais convites de times e visualizações!
              </p>
            )}
            {userType === "team" && (
              <p className="text-sm text-muted-foreground">
                Times ativos que publicam conteúdo regularmente atraem os melhores jogadores!
              </p>
            )}
            {userType === "fan" && (
              <p className="text-sm text-muted-foreground">
                Quanto mais você interagir (curtir, comentar, reagir), melhor será sua experiência!
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={handleComplete}
              className="text-muted-foreground"
            >
              Pular tutorial
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} de {currentSteps.length}
              </span>
              
              {currentStep < currentSteps.length - 1 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  Começar a usar! 🚀
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

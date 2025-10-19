import { AlertCircle, ExternalLink, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";

export function MigrationNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar se usuário já dispensou a mensagem
    const wasDismissed = localStorage.getItem('migration-notice-dismissed');
    if (wasDismissed === 'true') {
      setIsVisible(false);
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('migration-notice-dismissed', 'true');
    setIsVisible(false);
    setDismissed(true);
  };

  const handleGoToNewSite = () => {
    window.location.href = 'https://volleypro-zw96.vercel.app';
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-primary shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardContent className="p-6 sm:p-8">
          {/* Botão fechar */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar aviso"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Ícone e título */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🚀 VolleyPro Evoluiu!
              </h2>
              <p className="text-muted-foreground">
                Importante: O site mudou de endereço
              </p>
            </div>
          </div>

          {/* Conteúdo principal */}
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              Período de Testes Encerrado
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-2">
              <p>
                O período de testes no Figma Make foi encerrado com sucesso! 🎉
              </p>
              <p>
                Agora o <strong>VolleyPro</strong> está rodando em uma infraestrutura profissional, 
                muito mais rápida e confiável.
              </p>
            </AlertDescription>
          </Alert>

          {/* Novo endereço */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Novo endereço oficial:
            </p>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-md p-3 border">
              <code className="flex-1 text-sm font-mono text-primary break-all">
                https://volleypro-zw96.vercel.app
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText('https://volleypro-zw96.vercel.app');
                }}
                className="shrink-0"
              >
                Copiar
              </Button>
            </div>
          </div>

          {/* Benefícios */}
          <div className="mb-6 space-y-2">
            <p className="font-medium text-foreground mb-3">
              O que mudou para melhor:
            </p>
            <div className="grid gap-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500 shrink-0">✅</span>
                <span className="text-muted-foreground">
                  <strong>10x mais rápido</strong> - Carregamento ultrarrápido
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500 shrink-0">✅</span>
                <span className="text-muted-foreground">
                  <strong>PWA instalável</strong> - Use como app no celular
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500 shrink-0">✅</span>
                <span className="text-muted-foreground">
                  <strong>Backup automático</strong> - Seus dados sempre seguros
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500 shrink-0">✅</span>
                <span className="text-muted-foreground">
                  <strong>Infraestrutura profissional</strong> - Mais estabilidade
                </span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGoToNewSite}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir para o Novo Site
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="lg"
              className="sm:w-auto"
            >
              Continuar Aqui (não recomendado)
            </Button>
          </div>

          {/* Aviso final */}
          <p className="text-xs text-center text-muted-foreground mt-6">
            💡 Salve o novo endereço nos seus favoritos!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

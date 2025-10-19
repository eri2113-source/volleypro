import { useEffect, useState } from "react";
import { AlertCircle, ExternalLink, Shield } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

// 🔒 CONTROLE DE ACESSO FIGMA MAKE
// Apenas admin e teste@volleypro.com podem acessar o Figma Make
// Todos outros usuários são redirecionados para a Vercel

const ALLOWED_EMAILS = [
  'eri.2113@gmail.com',      // Admin
  'teste@volleypro.com'       // Conta de testes
];

const PRODUCTION_URL = 'https://volleypro-zw96.vercel.app';

export function FigmaMakeAccessControl({ userEmail }: { userEmail: string | null }) {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isFigmaMake, setIsFigmaMake] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Detectar se está no Figma Make
    const hostname = window.location.hostname;
    const href = window.location.href;
    
    // Considerar Figma Make se:
    // 1. Hostname contém figma.com ou fig.ma
    // 2. É localhost MAS não é Vercel preview
    const isFigma = 
      hostname.includes('figma.com') || 
      hostname.includes('fig.ma') ||
      (hostname.includes('localhost') && !href.includes('vercel.app')) ||
      hostname.includes('make.fig');
    
    console.log('🔍 Detectando ambiente:', { hostname, isFigma, href });
    setIsFigmaMake(isFigma);

    // Se não está no Figma Make, não fazer nada
    if (!isFigma) {
      return;
    }

    // 🔒 BLOQUEAR TODOS que não estão na lista de autorizados
    // Incluindo usuários NÃO LOGADOS (userEmail = null)
    if (!userEmail) {
      // Usuário não está logado = BLOQUEAR
      console.log('🚫 Acesso negado no Figma Make: Usuário não está logado');
      setShouldRedirect(true);
    } else if (!ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
      // Usuário logado mas NÃO autorizado = BLOQUEAR
      console.log('🚫 Acesso negado no Figma Make para:', userEmail);
      setShouldRedirect(true);
    } else {
      // Usuário autorizado = LIBERAR
      console.log('✅ Acesso autorizado no Figma Make para:', userEmail);
      setShouldRedirect(false);
    }
  }, [userEmail]);

  // Countdown automático para redirecionamento
  useEffect(() => {
    if (!shouldRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirecionar
          window.location.href = PRODUCTION_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shouldRedirect]);

  // Não mostrar nada se não precisa redirecionar
  if (!shouldRedirect || !isFigmaMake) {
    return null;
  }

  const handleRedirectNow = () => {
    window.location.href = PRODUCTION_URL;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-primary shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardContent className="p-6 sm:p-8">
          {/* Ícone de segurança */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🔒 Ambiente de Desenvolvimento
              </h2>
              <p className="text-muted-foreground">
                Esta é uma área restrita para testes
              </p>
            </div>
          </div>

          {/* Alerta principal */}
          <Alert className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-900 dark:text-red-100">
              Acesso Não Autorizado
            </AlertTitle>
            <AlertDescription className="text-red-800 dark:text-red-200 space-y-2">
              <p>
                Você está no <strong>ambiente de testes</strong> do Figma Make.
              </p>
              <p>
                Apenas administradores e contas autorizadas podem acessar este ambiente.
              </p>
            </AlertDescription>
          </Alert>

          {/* Informações do usuário */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Conta atual:
            </p>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-md p-3 border">
              <code className="flex-1 text-sm font-mono text-foreground">
                {userEmail || 'Não logado'}
              </code>
              <span className="shrink-0 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                Não Autorizado
              </span>
            </div>
          </div>

          {/* Site oficial */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Acesse o site oficial:
            </p>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-md p-3 border">
              <code className="flex-1 text-sm font-mono text-primary break-all">
                {PRODUCTION_URL}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(PRODUCTION_URL);
                }}
                className="shrink-0"
              >
                Copiar
              </Button>
            </div>
          </div>

          {/* Benefícios do site oficial */}
          <div className="mb-6 space-y-2">
            <p className="font-medium text-foreground mb-3">
              Por que usar o site oficial?
            </p>
            <div className="grid gap-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500 shrink-0">✅</span>
                <span className="text-muted-foreground">
                  <strong>10x mais rápido</strong> - Performance profissional
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-500 shrink-0">✅</span>
                <span className="text-muted-foreground">
                  <strong>Sempre atualizado</strong> - Últimas funcionalidades
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
                  <strong>Dados seguros</strong> - Backup automático
                </span>
              </div>
            </div>
          </div>

          {/* Countdown e ação */}
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-center text-sm text-muted-foreground mb-2">
              Redirecionamento automático em:
            </p>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">
                {countdown}
              </span>
              <span className="text-sm text-muted-foreground ml-2">segundos</span>
            </div>
          </div>

          {/* Botão de ação */}
          <Button
            onClick={handleRedirectNow}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            size="lg"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ir para o Site Oficial Agora
          </Button>

          {/* Informação adicional */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              💡 Este é um ambiente de testes. O site oficial oferece uma experiência muito melhor!
            </p>
          </div>

          {/* Para administradores */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              <strong>Administrador?</strong> Entre com a conta autorizada para acessar este ambiente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

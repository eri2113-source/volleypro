import { useEffect, useState } from "react";
import { AlertCircle, ExternalLink, Shield } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

// 🔒 CONTROLE DE ACESSO VERCEL
// Apenas admin e teste@volleypro.com podem acessar o Vercel para testes
// Todos outros usuários são redirecionados para voleypro.net

const ALLOWED_EMAILS = [
  'eri.2113@gmail.com',      // Admin/Master
  'teste@volleypro.com'       // Conta de testes
];

const PRODUCTION_URL = 'https://voleypro.net';

export function VercelAccessControl({ userEmail }: { userEmail: string | null }) {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isVercel, setIsVercel] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Detectar se está no Vercel (mas não no domínio principal voleypro.net)
    const hostname = window.location.hostname;
    const href = window.location.href;
    
    // Considerar Vercel se:
    // 1. Hostname contém vercel.app
    // 2. NÃO é voleypro.net
    const isVercelDeployment = 
      hostname.includes('vercel.app') &&
      !hostname.includes('voleypro.net');
    
    console.log('🔍 Detectando ambiente Vercel:', { hostname, isVercelDeployment, href });
    setIsVercel(isVercelDeployment);

    // Se não está no Vercel (está em voleypro.net ou localhost), não fazer nada
    if (!isVercelDeployment) {
      return;
    }

    // 🔒 BLOQUEAR TODOS que não estão na lista de autorizados
    // Incluindo usuários NÃO LOGADOS (userEmail = null)
    if (!userEmail) {
      // Usuário não está logado = BLOQUEAR
      console.log('🚫 Acesso negado no Vercel: Usuário não está logado');
      setShouldRedirect(true);
    } else if (!ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
      // Usuário logado mas NÃO autorizado = BLOQUEAR
      console.log('🚫 Acesso negado no Vercel para:', userEmail);
      setShouldRedirect(true);
    } else {
      // Usuário autorizado = LIBERAR
      console.log('✅ Acesso autorizado no Vercel para:', userEmail);
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
  if (!shouldRedirect || !isVercel) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-orange-500 shadow-2xl">
        <CardContent className="pt-8 space-y-6">
          {/* Cabeçalho com Ícone */}
          <div className="flex justify-center">
            <div className="p-6 bg-orange-500/20 rounded-full border-4 border-orange-500">
              <Shield className="h-16 w-16 text-orange-500" />
            </div>
          </div>

          {/* Alerta Principal */}
          <Alert className="border-orange-500 bg-orange-500/10">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <AlertTitle className="text-xl">Acesso Restrito - Ambiente de Testes</AlertTitle>
            <AlertDescription className="text-base mt-2 space-y-2">
              <p>
                <strong>Você está tentando acessar o ambiente de testes do Vercel.</strong>
              </p>
              <p>
                Este ambiente é reservado apenas para:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Administradores do sistema</li>
                <li>Contas de teste autorizadas</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Informações */}
          <div className="space-y-3 text-center">
            <p className="text-lg">
              Por favor, acesse o site oficial em:
            </p>
            <div className="p-4 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-xl border-2 border-dashed border-orange-500">
              <p className="font-mono text-xl font-bold text-orange-500">
                voleypro.net
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center space-y-4">
            <div className="p-6 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">
                Redirecionando automaticamente em:
              </p>
              <div className="text-6xl font-bold text-orange-500 font-mono">
                {countdown}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                segundos
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShouldRedirect(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white"
                onClick={() => window.location.href = PRODUCTION_URL}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ir para voleypro.net Agora
              </Button>
            </div>
          </div>

          {/* Nota de Rodapé */}
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Se você é um testador autorizado, por favor{" "}
              <span className="font-semibold">faça login</span> com sua conta de testes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

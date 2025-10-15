import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExternalLink, Info } from "lucide-react";
import { Button } from "./ui/button";

export function GoogleAuthSetup() {
  return (
    <Alert className="mt-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertTitle className="text-amber-900 dark:text-amber-400">
        Configuração Necessária para Login com Google
      </AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-300">
        <p className="mb-3 text-sm">
          Para habilitar o login com Google, você precisa configurar o Google OAuth no Supabase Dashboard:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm mb-3">
          <li>Acesse o Supabase Dashboard do seu projeto</li>
          <li>Vá em Authentication → Providers</li>
          <li>Habilite o Google Provider</li>
          <li>Configure as credenciais do Google OAuth</li>
        </ol>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30"
          onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-google', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Documentação Completa
        </Button>
      </AlertDescription>
    </Alert>
  );
}

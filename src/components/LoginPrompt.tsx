import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface LoginPromptProps {
  onLoginClick: () => void;
  title?: string;
  description?: string;
}

export function LoginPrompt({ 
  onLoginClick, 
  title = "Faça login para continuar",
  description = "Você precisa estar logado para usar esta funcionalidade"
}: LoginPromptProps) {
  return (
    <Alert className="border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10">
      <LogIn className="h-5 w-5 text-primary" />
      <AlertTitle className="text-primary">{title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-muted-foreground">{description}</p>
        <div className="flex gap-2">
          <Button onClick={onLoginClick} size="sm" className="bg-gradient-to-r from-primary to-secondary">
            <UserPlus className="h-4 w-4 mr-2" />
            Criar Conta Grátis
          </Button>
          <Button onClick={onLoginClick} variant="outline" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Já tenho conta
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

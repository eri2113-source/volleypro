import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🔴 ErrorBoundary capturou erro:", error, errorInfo);
    console.error("📍 Stack trace:", error.stack);
    console.error("📍 Component stack:", errorInfo.componentStack);
    
    // 🛡️ Detectar erros de removeChild (conflitos de portal)
    if (error?.message?.includes('removeChild') || error?.message?.includes('portal')) {
      console.error("⚠️ ERRO DE PORTAL DETECTADO - Pode ser necessário recarregar a página");
      // Limpar states que podem estar causando conflito
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <div>
                  <h2 className="text-xl">Algo deu errado</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ocorreu um erro inesperado na aplicação
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <p className="text-sm font-semibold">Mensagem:</p>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {this.state.error?.message || "Erro desconhecido"}
                </p>
                {this.state.error?.stack && (
                  <>
                    <p className="text-sm font-semibold mt-2">Detalhes técnicos:</p>
                    <p className="text-xs font-mono text-muted-foreground break-all max-h-32 overflow-y-auto">
                      {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recarregar Página
                </Button>
                <Button
                  variant="outline"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

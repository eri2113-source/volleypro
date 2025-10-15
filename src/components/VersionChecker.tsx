import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RefreshCw, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function VersionChecker() {
  const [expanded, setExpanded] = useState(false);
  
  const CURRENT_VERSION = "2.1.0-camera-fix";
  const storedVersion = localStorage.getItem("volleypro_version");
  const isUpToDate = storedVersion === CURRENT_VERSION;

  function handleClearCache() {
    if (!confirm("Isso vai limpar todo o cache e recarregar a página. Continuar?")) {
      return;
    }

    console.log("🧹 Limpando cache manualmente...");
    
    // Limpar localStorage (exceto dados importantes)
    const keysToKeep = ["volleypro_token", "volleypro_user_id"];
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Limpar versão
    localStorage.removeItem("volleypro_version");
    
    // Limpar sessionStorage
    sessionStorage.clear();
    
    // Limpar cache de assets
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    toast.success("Cache limpo!", {
      description: "Recarregando em 2 segundos..."
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  if (!expanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm border shadow-lg"
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        v{CURRENT_VERSION}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl border-primary/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Informações do Sistema</h3>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
            ✕
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Versão Atual:</span>
            <Badge variant={isUpToDate ? "default" : "destructive"}>
              {CURRENT_VERSION}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Versão Carregada:</span>
            <Badge variant="outline">
              {storedVersion || "Nenhuma"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status:</span>
            {isUpToDate ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Atualizado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Desatualizado</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar Página
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="w-full"
            onClick={handleClearCache}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Cache
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p><strong>Nova Correção:</strong> Sistema de teste de câmera implementado</p>
          <p className="mt-1">Se não ver as mudanças, clique em "Limpar Cache"</p>
        </div>
      </CardContent>
    </Card>
  );
}

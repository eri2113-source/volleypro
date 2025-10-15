import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Bug, ChevronDown, ChevronUp, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LiveDebugPanelProps {
  live: any;
  isCreator: boolean;
}

export function LiveDebugPanel({ live, isCreator }: LiveDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const debugData = {
    "🆔 ID da Live": live?.id || "❌ Não disponível",
    "📝 Título": live?.title || "❌ Não disponível",
    "🎬 Status": live?.status || "❌ Não disponível",
    "👤 Você é criador?": isCreator ? "✅ SIM" : "❌ NÃO (espectador)",
    "🖼️ Thumbnail URL": live?.thumbnailUrl || "❌ Sem thumbnail",
    "👥 Criador Nome": live?.creator?.name || "❌ Não disponível",
    "📧 Criador Email": live?.creator?.email || "❌ Não disponível",
    "👁️ Viewers": live?.viewers?.toString() || "0",
    "💬 Chat habilitado?": live?.chatEnabled ? "✅ SIM" : "❌ NÃO",
    "📝 Descrição": live?.description || "❌ Sem descrição",
    "📅 Criado em": live?.createdAt ? new Date(live.createdAt).toLocaleString('pt-BR') : "❌ Não disponível",
    "🕐 Agendado para": live?.scheduledFor ? new Date(live.scheduledFor).toLocaleString('pt-BR') : "❌ Não agendada",
  };

  function handleCopy() {
    const text = JSON.stringify(live, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Dados copiados!", {
      description: "JSON completo da live copiado para área de transferência"
    });
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-yellow-500/90 hover:bg-yellow-600 text-black border-yellow-600 shadow-lg"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Live
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 p-4 max-w-md bg-black/95 text-white border-yellow-500 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-yellow-500" />
          <h3 className="font-bold">Debug da Live</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 text-white hover:bg-white/10"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-white/10"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(debugData).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2 text-sm">
            <span className="text-yellow-500 font-mono shrink-0">{key}:</span>
            <span className="text-white/80 break-all font-mono text-xs">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="text-xs text-white/60 space-y-1">
          <p>💡 <strong>Dica:</strong> Abra o Console do navegador (F12) para ver logs detalhados</p>
          <p>🐛 Status esperado para assistir: <Badge className="ml-1 bg-red-500">live</Badge></p>
          <p>👥 Como espectador, você deve ver o player visual</p>
        </div>
      </div>
    </Card>
  );
}

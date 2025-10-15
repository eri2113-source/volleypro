import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function DebugPanel() {
  const [status, setStatus] = useState<string>("");
  const [testing, setTesting] = useState(false);

  async function testBackend() {
    setTesting(true);
    setStatus("🔄 Testando conexão com o backend...");

    try {
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba`;
      
      console.log("📡 Testando URL:", API_BASE);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test123',
          name: 'Test',
          userType: 'athlete',
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("✅ Backend está funcionando! (Este email já existe ou foi criado)");
      } else {
        setStatus(`⚠️ Backend respondeu com erro: ${data.error || 'Erro desconhecido'}`);
      }
      
      console.log("Backend response:", data);
    } catch (error: any) {
      console.error("Backend test error:", error);
      
      if (error.name === 'AbortError') {
        setStatus("❌ TIMEOUT: Backend não respondeu em 5 segundos. Pode estar offline ou lento.");
      } else if (error.message?.includes('fetch')) {
        setStatus("❌ ERRO DE REDE: Não foi possível conectar ao backend. Verifique sua internet.");
      } else {
        setStatus(`❌ Erro: ${error.message}`);
      }
    } finally {
      setTesting(false);
    }
  }

  return (
    <Card className="p-4 space-y-3 border-2 border-dashed">
      <div>
        <h3 className="text-sm font-medium mb-1">🔧 Painel de Debug</h3>
        <p className="text-xs text-muted-foreground">
          Use este painel para testar se o backend está funcionando
        </p>
      </div>
      
      <Button
        onClick={testBackend}
        disabled={testing}
        size="sm"
        variant="outline"
        className="w-full"
      >
        {testing ? "Testando..." : "Testar Conexão Backend"}
      </Button>
      
      {status && (
        <div className="p-3 bg-muted rounded text-xs font-mono">
          {status}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Project ID:</strong> {projectId}</p>
        <p><strong>API Base:</strong> https://{projectId}.supabase.co/functions/v1/make-server-0ea22bba</p>
      </div>
    </Card>
  );
}

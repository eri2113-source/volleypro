import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { liveApi } from "../lib/api";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function LivesDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  async function runDiagnostics() {
    setTesting(true);
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Check API connectivity
    try {
      console.log("🔍 Test 1: Verificando conectividade com API...");
      const { lives } = await liveApi.getLives();
      diagnostics.tests.push({
        name: "Conectividade API",
        status: "success",
        message: `✅ API respondeu! ${lives?.length || 0} lives encontradas`,
        data: lives
      });
      console.log("✅ API OK -", lives?.length || 0, "lives");
    } catch (error: any) {
      diagnostics.tests.push({
        name: "Conectividade API",
        status: "error",
        message: `❌ Erro: ${error.message}`,
        error: error
      });
      console.error("❌ Erro na API:", error);
    }

    // Test 2: Check authentication
    try {
      console.log("🔍 Test 2: Verificando autenticação...");
      const token = localStorage.getItem('volleypro_token');
      const userId = localStorage.getItem('volleypro_user_id');
      
      if (token && userId) {
        diagnostics.tests.push({
          name: "Autenticação",
          status: "success",
          message: `✅ Token presente (${userId.substring(0, 8)}...)`,
          data: { hasToken: true, userId: userId.substring(0, 12) + "..." }
        });
        console.log("✅ Auth OK");
      } else {
        diagnostics.tests.push({
          name: "Autenticação",
          status: "warning",
          message: "⚠️ Sem token no localStorage",
          data: { hasToken: false }
        });
        console.warn("⚠️ Sem token");
      }
    } catch (error: any) {
      diagnostics.tests.push({
        name: "Autenticação",
        status: "error",
        message: `❌ Erro: ${error.message}`,
        error: error
      });
    }

    // Test 3: Try creating a test live
    try {
      console.log("🔍 Test 3: Tentando criar live de teste...");
      const testLive = await liveApi.createLive({
        title: "🧪 Live de Teste - Diagnóstico",
        description: "Esta é uma live automática criada para testar o sistema",
        thumbnailUrl: null,
      });
      
      diagnostics.tests.push({
        name: "Criar Live",
        status: "success",
        message: `✅ Live criada com sucesso! ID: ${testLive.live.id}`,
        data: testLive.live
      });
      console.log("✅ Live criada:", testLive.live.id);
      
      // Test 4: Try getting the created live
      try {
        console.log("🔍 Test 4: Buscando live criada...");
        const fetchedLive = await liveApi.getLive(testLive.live.id.replace('live:', ''));
        diagnostics.tests.push({
          name: "Buscar Live",
          status: "success",
          message: `✅ Live recuperada! Título: ${fetchedLive.live.title}`,
          data: fetchedLive.live
        });
        console.log("✅ Live recuperada");
      } catch (error: any) {
        diagnostics.tests.push({
          name: "Buscar Live",
          status: "error",
          message: `❌ Erro ao buscar: ${error.message}`,
          error: error
        });
        console.error("❌ Erro ao buscar live");
      }
    } catch (error: any) {
      diagnostics.tests.push({
        name: "Criar Live",
        status: "error",
        message: `❌ Erro ao criar: ${error.message}`,
        error: error
      });
      console.error("❌ Erro ao criar live:", error);
    }

    // Test 5: Check Supabase connection
    try {
      console.log("🔍 Test 5: Verificando Supabase...");
      diagnostics.tests.push({
        name: "Configuração Supabase",
        status: "success",
        message: `✅ Project ID: ${projectId.substring(0, 15)}...`,
        data: { 
          projectId: projectId.substring(0, 20) + "...",
          hasAnonKey: !!publicAnonKey
        }
      });
      console.log("✅ Supabase OK");
    } catch (error: any) {
      diagnostics.tests.push({
        name: "Configuração Supabase",
        status: "error",
        message: `❌ Erro: ${error.message}`,
        error: error
      });
    }

    setResults(diagnostics);
    setTesting(false);
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card className="p-6">
        <h2 className="mb-4">🔧 Diagnóstico do Sistema de Lives</h2>
        <p className="text-muted-foreground mb-6">
          Este painel executa testes automáticos para identificar problemas no sistema de transmissões ao vivo.
        </p>

        <Button 
          onClick={runDiagnostics} 
          disabled={testing}
          className="mb-6"
        >
          {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {testing ? "Executando testes..." : "🧪 Executar Diagnóstico"}
        </Button>

        {results && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Executado em: {new Date(results.timestamp).toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              {results.tests.map((test: any, index: number) => (
                <div 
                  key={index}
                  className={`
                    p-4 rounded-lg border-2
                    ${test.status === 'success' ? 'border-green-500/20 bg-green-500/5' : ''}
                    ${test.status === 'error' ? 'border-red-500/20 bg-red-500/5' : ''}
                    ${test.status === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {test.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {test.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                      {test.status === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1">{test.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{test.message}</p>
                      
                      {test.data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-primary hover:underline">
                            Ver detalhes técnicos
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                            {JSON.stringify(test.data, null, 2)}
                          </pre>
                        </details>
                      )}
                      
                      {test.error && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-destructive hover:underline">
                            Ver erro completo
                          </summary>
                          <pre className="mt-2 p-2 bg-destructive/10 rounded overflow-x-auto text-destructive">
                            {JSON.stringify(test.error, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">📊 Resumo</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {results.tests.filter((t: any) => t.status === 'success').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Sucesso</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {results.tests.filter((t: any) => t.status === 'warning').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Avisos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {results.tests.filter((t: any) => t.status === 'error').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Erros</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

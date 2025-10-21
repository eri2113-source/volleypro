import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Wifi, WifiOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkNetworkConnection, waitForNetwork } from '../utils/supabaseRetry';
import { createClient } from '../utils/supabase/client';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
}

export default function NetworkDiagnostic() {
  const [isVisible, setIsVisible] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  // Monitor de rede em tempo real
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine);
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  // Mostrar automaticamente se houver problemas
  useEffect(() => {
    const checkForErrors = () => {
      const hasConsoleErrors = window.performance?.getEntriesByType?.('navigation')?.[0]?.transferSize === 0;
      if (!networkStatus || hasConsoleErrors) {
        setIsVisible(true);
      }
    };

    // Verificar após 5 segundos de carregamento
    const timer = setTimeout(checkForErrors, 5000);
    return () => clearTimeout(timer);
  }, [networkStatus]);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (test: string, updates: Partial<DiagnosticResult>) => {
    setResults(prev => prev.map(result => 
      result.test === test ? { ...result, ...updates } : result
    ));
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // Teste 1: Conectividade básica
    addResult({
      test: 'Internet',
      status: 'loading',
      message: 'Verificando conexão com a internet...'
    });

    try {
      const internetOK = await checkNetworkConnection();
      updateResult('Internet', {
        status: internetOK ? 'success' : 'error',
        message: internetOK ? 'Conexão com internet OK' : 'Sem conexão com internet',
        details: internetOK ? 'Ping ao Google funcionando' : 'Verifique sua conexão Wi-Fi/dados móveis'
      });
    } catch (error) {
      updateResult('Internet', {
        status: 'error',
        message: 'Erro ao verificar internet',
        details: (error as Error).message
      });
    }

    // Teste 2: Status do Supabase
    addResult({
      test: 'Supabase Status',
      status: 'loading',
      message: 'Verificando status do Supabase...'
    });

    try {
      const response = await fetch('https://status.supabase.com/api/v2/status.json');
      const statusData = await response.json();
      const isUp = statusData.status.indicator === 'none';
      
      updateResult('Supabase Status', {
        status: isUp ? 'success' : 'warning',
        message: isUp ? 'Supabase operacional' : 'Supabase com problemas',
        details: statusData.status.description || 'Status público disponível'
      });
    } catch (error) {
      updateResult('Supabase Status', {
        status: 'warning',
        message: 'Não foi possível verificar status público',
        details: 'Continuando com testes diretos...'
      });
    }

    // Teste 3: Conexão direta com projeto Supabase
    addResult({
      test: 'Projeto Supabase',
      status: 'loading',
      message: 'Testando conexão direta com waibxabxlcbfyxyagaow...'
    });

    try {
      const response = await fetch('https://waibxabxlcbfyxyagaow.supabase.co/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaWJ4YWJ4bGNiZnl4eWFnYW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzg2MzYsImV4cCI6MjA3NTcxNDYzNn0.NbBYwWHQ0dcdPk1QTXc5tPgsr0NPuoFUDS6uVd4PVqw'
        },
        signal: AbortSignal.timeout(10000)
      });

      updateResult('Projeto Supabase', {
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Projeto acessível' : `Projeto retornou ${response.status}`,
        details: response.ok ? `Status: ${response.status}` : 'Verifique as credenciais do projeto'
      });
    } catch (error) {
      updateResult('Projeto Supabase', {
        status: 'error',
        message: 'Erro ao conectar com projeto',
        details: (error as Error).message
      });
    }

    // Teste 4: Cliente Supabase
    addResult({
      test: 'Cliente Supabase',
      status: 'loading',
      message: 'Testando cliente Supabase...'
    });

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('kv_store_0ea22bba')
        .select('count')
        .limit(1);

      if (error && !error.message.includes('permission denied')) {
        throw error;
      }

      updateResult('Cliente Supabase', {
        status: 'success',
        message: 'Cliente funcionando',
        details: error?.message.includes('permission denied') ? 
          'Conexão OK (RLS ativo)' : 
          `Dados retornados: ${data?.length || 0} registros`
      });
    } catch (error) {
      updateResult('Cliente Supabase', {
        status: 'error',
        message: 'Erro no cliente Supabase',
        details: (error as Error).message
      });
    }

    // Teste 5: Autenticação
    addResult({
      test: 'Autenticação',
      status: 'loading',
      message: 'Verificando sistema de auth...'
    });

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      updateResult('Autenticação', {
        status: error ? 'error' : 'success',
        message: error ? 'Erro na autenticação' : 'Sistema de auth OK',
        details: error ? error.message : 
          data.session ? `Usuário logado: ${data.session.user.email}` : 'Nenhum usuário logado'
      });
    } catch (error) {
      updateResult('Autenticação', {
        status: 'error',
        message: 'Erro ao verificar auth',
        details: (error as Error).message
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'loading': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'loading': return 'bg-blue-500';
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        {networkStatus ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        Diagnóstico
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {networkStatus ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
            Diagnóstico de Rede - VolleyPro
          </CardTitle>
          <CardDescription>
            Verificação completa da conectividade e status dos serviços
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status geral */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Status da rede:</strong> {networkStatus ? 'Online' : 'Offline'}
              {!networkStatus && ' - Algumas funcionalidades podem estar limitadas'}
            </AlertDescription>
          </Alert>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={isRunning}>
              {isRunning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Executar Diagnóstico
            </Button>
            <Button variant="outline" onClick={() => setIsVisible(false)}>
              Fechar
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Resultados dos Testes:</h3>
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getStatusIcon(result.status)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.test}</span>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(result.status)} text-white border-none`}
                        >
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Informações adicionais */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>URL do projeto:</strong> https://waibxabxlcbfyxyagaow.supabase.co</p>
            <p><strong>Região:</strong> us-east-1</p>
            <p><strong>Status público:</strong> https://status.supabase.com/</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
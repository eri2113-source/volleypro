import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Search, AlertCircle } from "lucide-react";
import { projectId } from "../utils/supabase/info";

export function AthletesDebugPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAthletes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/debug/athletes-count`
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      console.log("📊 Debug data:", result);
    } catch (err: any) {
      console.error("❌ Erro ao buscar dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Debug: Atletas no Banco de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkAthletes} disabled={loading} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Buscando..." : "Verificar Atletas no Banco"}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Erro</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{data.total_users}</p>
                    <p className="text-sm text-muted-foreground">Total de Usuários</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{data.athletes}</p>
                    <p className="text-sm text-muted-foreground">Atletas</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{data.teams}</p>
                    <p className="text-sm text-muted-foreground">Times</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{data.fans}</p>
                    <p className="text-sm text-muted-foreground">Fãs</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {data.athlete_list && data.athlete_list.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lista de Atletas Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {data.athlete_list.map((athlete: any, index: number) => (
                      <div
                        key={athlete.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{athlete.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {athlete.position || "Sem posição definida"}
                          </p>
                        </div>
                        <Badge variant="secondary">{athlete.id.substring(0, 8)}...</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                <p className="font-medium text-yellow-900">Nenhum atleta cadastrado</p>
                <p className="text-sm text-yellow-700 mt-2">
                  Este é o problema! Você precisa criar pelo menos 2 contas de atletas para
                  poder testar a busca de parceiros.
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Dica:</strong> Para testar a busca de parceiros, você precisa ter pelo
                menos 2 contas de atletas cadastradas. Crie outra conta com tipo "Atleta" e
                depois tente buscar por esse nome ao inscrever uma dupla.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

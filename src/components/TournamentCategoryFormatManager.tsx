import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Trophy, 
  Users, 
  Grid3x3, 
  Circle, 
  Settings,
  Plus,
  Trash2,
  Save
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CategoryFormat {
  name: string; // "Masculino", "Feminino", "Misto"
  format: "groups" | "round_robin"; // "groups" = chaves, "round_robin" = todos contra todos
  numGroups?: number; // Apenas para formato de chaves
  teamsPerGroup?: number; // Apenas para formato de chaves
  advancingPerGroup?: number; // Quantos passam por grupo (padrão: 2)
  teams: string[]; // IDs dos times inscritos nesta categoria
}

interface TournamentCategoryFormatManagerProps {
  tournamentId: string;
  categories: CategoryFormat[];
  onSave: (categories: CategoryFormat[]) => void;
  canEdit?: boolean;
}

export function TournamentCategoryFormatManager({ 
  tournamentId, 
  categories: initialCategories,
  onSave,
  canEdit = false 
}: TournamentCategoryFormatManagerProps) {
  const [categories, setCategories] = useState<CategoryFormat[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategories[0]?.name || "");

  const currentCategory = categories.find(c => c.name === selectedCategory);

  function updateCategoryFormat(categoryName: string, format: "groups" | "round_robin") {
    setCategories(prev => prev.map(cat => {
      if (cat.name === categoryName) {
        if (format === "groups") {
          // Calcular grupos ideais baseado no número de times
          const numTeams = cat.teams.length;
          const numGroups = calculateOptimalGroups(numTeams);
          const teamsPerGroup = Math.ceil(numTeams / numGroups);
          
          return {
            ...cat,
            format,
            numGroups,
            teamsPerGroup,
            advancingPerGroup: 2
          };
        } else {
          // Remover campos de grupos
          const { numGroups, teamsPerGroup, advancingPerGroup, ...rest } = cat;
          return {
            ...rest,
            format
          };
        }
      }
      return cat;
    }));
  }

  function calculateOptimalGroups(numTeams: number): number {
    if (numTeams <= 4) return 1;
    if (numTeams <= 8) return 2;
    if (numTeams <= 12) return 3;
    if (numTeams <= 16) return 4;
    return Math.ceil(numTeams / 4);
  }

  function updateNumGroups(categoryName: string, numGroups: number) {
    setCategories(prev => prev.map(cat => {
      if (cat.name === categoryName) {
        const teamsPerGroup = Math.ceil(cat.teams.length / numGroups);
        return {
          ...cat,
          numGroups,
          teamsPerGroup
        };
      }
      return cat;
    }));
  }

  function updateAdvancingPerGroup(categoryName: string, advancingPerGroup: number) {
    setCategories(prev => prev.map(cat => {
      if (cat.name === categoryName) {
        return {
          ...cat,
          advancingPerGroup
        };
      }
      return cat;
    }));
  }

  function handleSave() {
    // Validações
    for (const cat of categories) {
      if (cat.format === "groups") {
        if (!cat.numGroups || cat.numGroups < 1) {
          toast.error(`Configure o número de grupos para ${cat.name}`);
          return;
        }
        if (cat.advancingPerGroup && cat.advancingPerGroup > (cat.teamsPerGroup || 0)) {
          toast.error(`${cat.name}: Não podem avançar mais times do que há no grupo`);
          return;
        }
      }
    }

    onSave(categories);
    toast.success("Configuração de categorias salva!");
  }

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Formato das Categorias
          </CardTitle>
          <CardDescription>
            Configuração dos formatos de disputa por categoria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(cat => (
            <div key={cat.name} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                  {cat.name}
                  <Badge variant="outline">{cat.teams.length} times</Badge>
                </h4>
                <Badge>
                  {cat.format === "groups" ? "Chaves" : "Todos contra Todos"}
                </Badge>
              </div>
              
              {cat.format === "groups" && (
                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Grupos:</span> {cat.numGroups}
                  </div>
                  <div>
                    <span className="font-medium">Times/Grupo:</span> {cat.teamsPerGroup}
                  </div>
                  <div>
                    <span className="font-medium">Avançam:</span> {cat.advancingPerGroup || 2}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurar Formato das Categorias
        </CardTitle>
        <CardDescription>
          Defina como cada categoria será disputada no torneio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletor de Categoria */}
        <div className="space-y-2">
          <Label>Selecione a Categoria</Label>
          <div className="flex gap-2">
            {categories.map(cat => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.name)}
                className="flex-1"
              >
                {cat.name}
                <Badge variant="secondary" className="ml-2">
                  {cat.teams.length}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {currentCategory && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{currentCategory.name}</h3>
              <Badge variant="outline">{currentCategory.teams.length} times inscritos</Badge>
            </div>

            {/* Seletor de Formato */}
            <div className="space-y-2">
              <Label>Formato de Disputa</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={currentCategory.format === "groups" ? "default" : "outline"}
                  onClick={() => updateCategoryFormat(currentCategory.name, "groups")}
                  className="h-auto flex-col gap-2 p-4"
                >
                  <Grid3x3 className="h-6 w-6" />
                  <div className="space-y-1">
                    <div className="font-semibold">Chaves</div>
                    <div className="text-xs opacity-80">
                      Times divididos em grupos, melhores avançam
                    </div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant={currentCategory.format === "round_robin" ? "default" : "outline"}
                  onClick={() => updateCategoryFormat(currentCategory.name, "round_robin")}
                  className="h-auto flex-col gap-2 p-4"
                >
                  <Circle className="h-6 w-6" />
                  <div className="space-y-1">
                    <div className="font-semibold">Todos contra Todos</div>
                    <div className="text-xs opacity-80">
                      Cada time joga contra todos os outros
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Configurações de Chaves */}
            {currentCategory.format === "groups" && (
              <div className="space-y-4 p-4 border-l-4 border-primary bg-background rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  Configuração das Chaves
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numGroups">Número de Grupos</Label>
                    <Select
                      value={currentCategory.numGroups?.toString() || "2"}
                      onValueChange={(value) => updateNumGroups(currentCategory.name, parseInt(value))}
                    >
                      <SelectTrigger id="numGroups">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Grupo</SelectItem>
                        <SelectItem value="2">2 Grupos (A e B)</SelectItem>
                        <SelectItem value="3">3 Grupos (A, B e C)</SelectItem>
                        <SelectItem value="4">4 Grupos (A, B, C e D)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {currentCategory.teamsPerGroup} times por grupo
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advancing">Times que Avançam por Grupo</Label>
                    <Select
                      value={currentCategory.advancingPerGroup?.toString() || "2"}
                      onValueChange={(value) => updateAdvancingPerGroup(currentCategory.name, parseInt(value))}
                    >
                      <SelectTrigger id="advancing">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1º colocado</SelectItem>
                        <SelectItem value="2">1º e 2º colocados</SelectItem>
                        <SelectItem value="3">1º, 2º e 3º colocados</SelectItem>
                        <SelectItem value="4">Todos classificam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    📊 <strong>Fase de Grupos:</strong> {currentCategory.numGroups} grupos com {currentCategory.teamsPerGroup} times cada.
                    <br />
                    🏆 <strong>Classificação:</strong> {currentCategory.advancingPerGroup || 2} melhores de cada grupo avançam para a próxima fase.
                  </p>
                </div>
              </div>
            )}

            {/* Informações Todos contra Todos */}
            {currentCategory.format === "round_robin" && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-900 dark:text-green-100">
                  ♻️ <strong>Todos contra Todos:</strong> Cada um dos {currentCategory.teams.length} times jogará contra todos os outros.
                  <br />
                  📊 <strong>Total de jogos:</strong> {(currentCategory.teams.length * (currentCategory.teams.length - 1)) / 2} partidas
                  <br />
                  🏆 O time com mais pontos será o campeão!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão Salvar */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configuração
          </Button>
        </div>

        {/* Resumo de Todas as Categorias */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">RESUMO</h4>
          <div className="grid gap-2">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {cat.teams.length} times • {cat.format === "groups" ? `${cat.numGroups} grupos` : "Todos contra todos"}
                    </div>
                  </div>
                </div>
                <Badge variant={cat.format === "groups" ? "default" : "secondary"}>
                  {cat.format === "groups" ? "Chaves" : "Round Robin"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

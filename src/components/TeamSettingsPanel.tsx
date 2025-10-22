import { useState, useEffect } from "react";
import {
  Settings,
  Users,
  Image as ImageIcon,
  Globe,
  Trophy,
  BarChart3,
  Save,
  Loader2,
  Camera,
  UserPlus,
  Edit,
  Trash2,
  Star,
  Shield,
  Info,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Target,
  Palette,
  Flag,
  DollarSign,
  X,
  Check,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { formatHeight } from "../utils/formatters";
import { teamRosterApi } from "../lib/api";

interface TeamData {
  id: number;
  name: string;
  city?: string;
  state?: string;
  founded?: number;
  bio?: string;
  photoUrl?: string;
  coverPhoto?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  president?: string;
  coach?: string;
  assistantCoach?: string;
  physicalTrainer?: string;
  category?: string;
  division?: string;
  league?: string;
  arena?: string;
  colors?: string;
  mascot?: string;
  rivalTeams?: string;
  mainSponsor?: string;
  sponsors?: string[];
}

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age?: number;
  height?: number;
  photoUrl?: string;
  cpf?: string;
  isCaptain?: boolean;
  isStarter?: boolean;
  gamesPlayed?: number;
  points?: number;
}

interface TeamSettingsPanelProps {
  teamData: TeamData;
  players: Player[];
  onSave: (data: Partial<TeamData>) => Promise<void>;
  onAddPlayer: (player: Partial<Player>) => Promise<void>;
  onUpdatePlayer: (playerId: string, data: Partial<Player>) => Promise<void>;
  onRemovePlayer: (playerId: string) => Promise<void>;
  onClose: () => void;
}

export function TeamSettingsPanel({
  teamData,
  players,
  onSave,
  onAddPlayer,
  onUpdatePlayer,
  onRemovePlayer,
  onClose,
}: TeamSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<TeamData>(teamData);
  const [rosterData, setRosterData] = useState<Player[]>(players);
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [sortBy, setSortBy] = useState<"number" | "name" | "position">("number");

  useEffect(() => {
    setFormData(teamData);
  }, [teamData]);

  useEffect(() => {
    setRosterData(players);
  }, [players]);

  async function handleSaveGeneral() {
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar informações");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(field: keyof TeamData, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Filtrar e ordenar jogadores
  const filteredPlayers = rosterData
    .filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.number.toString().includes(searchQuery);
      const matchesPosition = filterPosition === "all" || player.position === filterPosition;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      if (sortBy === "number") return a.number - b.number;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "position") return a.position.localeCompare(b.position);
      return 0;
    });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0" aria-describedby="team-settings-description">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <DialogTitle>Configurações do Time</DialogTitle>
                  <DialogDescription id="team-settings-description">
                    Gerencie todas as informações e configurações do seu time
                  </DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Conteúdo com scroll */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2 bg-muted/50 p-1">
                <TabsTrigger value="general" className="gap-2">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Informações</span>
                </TabsTrigger>
                <TabsTrigger value="roster" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Elenco</span>
                </TabsTrigger>
                <TabsTrigger value="photos" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Fotos</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Redes Sociais</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Comissão</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Detalhes</span>
                </TabsTrigger>
              </TabsList>

              {/* ABA: Informações Gerais */}
              <TabsContent value="general" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Informações Básicas
                    </CardTitle>
                    <CardDescription>Dados principais do time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Time *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Ex: Vôlei Campeões"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="founded">Ano de Fundação</Label>
                        <Input
                          id="founded"
                          type="number"
                          value={formData.founded || ""}
                          onChange={(e) => updateField("founded", parseInt(e.target.value) || undefined)}
                          placeholder="Ex: 2010"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={formData.city || ""}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder="Ex: São Paulo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Select value={formData.state || ""} onValueChange={(value) => updateField("state", value)}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Sobre o Time</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ""}
                        onChange={(e) => updateField("bio", e.target.value)}
                        placeholder="Conte a história do seu time..."
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        {(formData.bio || "").length}/500 caracteres
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="h-4 w-4 inline mr-2" />
                          E-mail de Contato
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="contato@time.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="h-4 w-4 inline mr-2" />
                          Telefone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveGeneral} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ABA: Elenco */}
              <TabsContent value="roster" className="space-y-6 mt-6">
                <RosterManager
                  players={filteredPlayers}
                  onAddPlayer={() => setShowAddPlayerDialog(true)}
                  onEditPlayer={setEditingPlayer}
                  onRemovePlayer={onRemovePlayer}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterPosition={filterPosition}
                  setFilterPosition={setFilterPosition}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </TabsContent>

              {/* ABA: Fotos */}
              <TabsContent value="photos" className="space-y-6 mt-6">
                <PhotosManager formData={formData} updateField={updateField} onSave={handleSaveGeneral} isSaving={isSaving} />
              </TabsContent>

              {/* ABA: Redes Sociais */}
              <TabsContent value="social" className="space-y-6 mt-6">
                <SocialMediaManager formData={formData} updateField={updateField} onSave={handleSaveGeneral} isSaving={isSaving} />
              </TabsContent>

              {/* ABA: Comissão Técnica */}
              <TabsContent value="staff" className="space-y-6 mt-6">
                <StaffManager formData={formData} updateField={updateField} onSave={handleSaveGeneral} isSaving={isSaving} />
              </TabsContent>

              {/* ABA: Detalhes do Time */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <TeamDetailsManager formData={formData} updateField={updateField} onSave={handleSaveGeneral} isSaving={isSaving} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Dialog de Adicionar Jogador */}
        <AddPlayerDialog
          open={showAddPlayerDialog}
          onClose={() => setShowAddPlayerDialog(false)}
          onAdd={async (player) => {
            await onAddPlayer(player);
            setShowAddPlayerDialog(false);
          }}
        />

        {/* Dialog de Editar Jogador */}
        {editingPlayer && (
          <EditPlayerDialog
            player={editingPlayer}
            onClose={() => setEditingPlayer(null)}
            onUpdate={async (data) => {
              await onUpdatePlayer(editingPlayer.id, data);
              setEditingPlayer(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Componente: Gerenciador de Elenco
function RosterManager({
  players,
  onAddPlayer,
  onEditPlayer,
  onRemovePlayer,
  searchQuery,
  setSearchQuery,
  filterPosition,
  setFilterPosition,
  sortBy,
  setSortBy,
}: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciar Elenco
            </CardTitle>
            <CardDescription>
              {players.length} {players.length === 1 ? "atleta" : "atletas"} no elenco
            </CardDescription>
          </div>
          <Button onClick={onAddPlayer}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Atleta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterPosition} onValueChange={setFilterPosition}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Posições</SelectItem>
              <SelectItem value="Levantador">Levantador</SelectItem>
              <SelectItem value="Oposto">Oposto</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
              <SelectItem value="Ponteiro">Ponteiro</SelectItem>
              <SelectItem value="Líbero">Líbero</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="position">Posição</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Jogadores */}
        {players.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Nenhum atleta no elenco</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione atletas para começar a montar seu time
            </p>
            <Button onClick={onAddPlayer}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Atleta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player: Player) => (
              <Card key={player.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.photoUrl} />
                      <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-bold">
                          #{player.number}
                        </Badge>
                        {player.isCaptain && (
                          <Badge variant="default" className="gap-1">
                            <Star className="h-3 w-3" />
                            Capitão
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold mt-1 truncate">{player.name}</h4>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                      {player.height && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Altura: {formatHeight(player.height)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onEditPlayer(player)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePlayer(player.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente: Gerenciador de Fotos
function PhotosManager({ formData, updateField, onSave, isSaving }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto de Perfil
          </CardTitle>
          <CardDescription>Logotipo ou escudo do time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-border">
              <AvatarImage src={formData.photoUrl} />
              <AvatarFallback className="text-2xl">{formData.name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Label>URL da Foto de Perfil</Label>
                <Input
                  value={formData.photoUrl || ""}
                  onChange={(e) => updateField("photoUrl", e.target.value)}
                  placeholder="https://exemplo.com/logo.jpg"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Recomendado: Imagem quadrada, mínimo 400x400px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Foto de Capa
          </CardTitle>
          <CardDescription>Imagem de fundo do perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.coverPhoto && (
            <div className="aspect-[3/1] rounded-lg overflow-hidden border">
              <img src={formData.coverPhoto} alt="Capa" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-2">
            <Label>URL da Foto de Capa</Label>
            <Input
              value={formData.coverPhoto || ""}
              onChange={(e) => updateField("coverPhoto", e.target.value)}
              placeholder="https://exemplo.com/capa.jpg"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Recomendado: 1200x400px ou proporção 3:1
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Fotos
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Componente: Gerenciador de Redes Sociais
function SocialMediaManager({ formData, updateField, onSave, isSaving }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Redes Sociais e Contato
        </CardTitle>
        <CardDescription>Links e informações de contato</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">
              <Globe className="h-4 w-4 inline mr-2" />
              Website
            </Label>
            <Input
              id="website"
              value={formData.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://www.seutime.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">
              Instagram
            </Label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0">@</span>
              <Input
                id="instagram"
                value={formData.instagram || ""}
                onChange={(e) => updateField("instagram", e.target.value)}
                placeholder="seutime"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">
              Facebook
            </Label>
            <Input
              id="facebook"
              value={formData.facebook || ""}
              onChange={(e) => updateField("facebook", e.target.value)}
              placeholder="facebook.com/seutime"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">
              Twitter / X
            </Label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0">@</span>
              <Input
                id="twitter"
                value={formData.twitter || ""}
                onChange={(e) => updateField("twitter", e.target.value)}
                placeholder="seutime"
                className="rounded-l-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Redes Sociais
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Gerenciador de Comissão Técnica
function StaffManager({ formData, updateField, onSave, isSaving }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Comissão Técnica
        </CardTitle>
        <CardDescription>Membros da diretoria e comissão técnica</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="president">Presidente</Label>
            <Input
              id="president"
              value={formData.president || ""}
              onChange={(e) => updateField("president", e.target.value)}
              placeholder="Nome do presidente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coach">Técnico Principal</Label>
            <Input
              id="coach"
              value={formData.coach || ""}
              onChange={(e) => updateField("coach", e.target.value)}
              placeholder="Nome do técnico"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assistantCoach">Auxiliar Técnico</Label>
            <Input
              id="assistantCoach"
              value={formData.assistantCoach || ""}
              onChange={(e) => updateField("assistantCoach", e.target.value)}
              placeholder="Nome do auxiliar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicalTrainer">Preparador Físico</Label>
            <Input
              id="physicalTrainer"
              value={formData.physicalTrainer || ""}
              onChange={(e) => updateField("physicalTrainer", e.target.value)}
              placeholder="Nome do preparador"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Comissão
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Detalhes do Time
function TeamDetailsManager({ formData, updateField, onSave, isSaving }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Informações Competitivas
          </CardTitle>
          <CardDescription>Categoria, liga e arena</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category || ""} onValueChange={(value) => updateField("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="division">Divisão</Label>
              <Select value={formData.division || ""} onValueChange={(value) => updateField("division", value)}>
                <SelectTrigger id="division">
                  <SelectValue placeholder="Selecione a divisão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1ª Divisão</SelectItem>
                  <SelectItem value="2">2ª Divisão</SelectItem>
                  <SelectItem value="3">3ª Divisão</SelectItem>
                  <SelectItem value="4">4ª Divisão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="league">Liga/Campeonato</Label>
              <Input
                id="league"
                value={formData.league || ""}
                onChange={(e) => updateField("league", e.target.value)}
                placeholder="Ex: Superliga"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arena">Arena/Ginásio</Label>
              <Input
                id="arena"
                value={formData.arena || ""}
                onChange={(e) => updateField("arena", e.target.value)}
                placeholder="Ex: Ginásio Municipal"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Identidade do Time
          </CardTitle>
          <CardDescription>Cores, mascote e rivalidades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colors">Cores do Time</Label>
              <Input
                id="colors"
                value={formData.colors || ""}
                onChange={(e) => updateField("colors", e.target.value)}
                placeholder="Ex: Azul e Branco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mascot">Mascote</Label>
              <Input
                id="mascot"
                value={formData.mascot || ""}
                onChange={(e) => updateField("mascot", e.target.value)}
                placeholder="Ex: Leão"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="rivalTeams">Times Rivais</Label>
              <Input
                id="rivalTeams"
                value={formData.rivalTeams || ""}
                onChange={(e) => updateField("rivalTeams", e.target.value)}
                placeholder="Ex: Time A, Time B"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Patrocínios
          </CardTitle>
          <CardDescription>Patrocinadores do time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mainSponsor">Patrocinador Master</Label>
            <Input
              id="mainSponsor"
              value={formData.mainSponsor || ""}
              onChange={(e) => updateField("mainSponsor", e.target.value)}
              placeholder="Ex: Empresa XYZ"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Detalhes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Dialog: Adicionar Jogador
function AddPlayerDialog({ open, onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    name: "",
    position: "Ponteiro",
    number: 1,
    age: undefined as number | undefined,
    height: undefined as number | undefined,
    cpf: "",
    photoUrl: "",
    isCaptain: false,
    isStarter: false,
  });

  function handleSubmit() {
    if (!formData.name || !formData.position || !formData.number) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    onAdd(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="add-player-description">
        <DialogHeader>
          <DialogTitle>Adicionar Atleta</DialogTitle>
          <DialogDescription id="add-player-description">
            Preencha as informações do novo atleta
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Nome Completo *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do atleta"
              />
            </div>
            <div className="space-y-2">
              <Label>Posição *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Levantador">Levantador</SelectItem>
                  <SelectItem value="Oposto">Oposto</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Ponteiro">Ponteiro</SelectItem>
                  <SelectItem value="Líbero">Líbero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número *</Label>
              <Input
                type="number"
                min="1"
                max="99"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input
                type="number"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                value={formData.height || ""}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || undefined })}
                placeholder="180"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>CPF</Label>
              <Input
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>URL da Foto</Label>
              <Input
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isCaptain}
                  onCheckedChange={(checked) => setFormData({ ...formData, isCaptain: checked })}
                />
                <Label className="cursor-pointer">Capitão</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isStarter}
                  onCheckedChange={(checked) => setFormData({ ...formData, isStarter: checked })}
                />
                <Label className="cursor-pointer">Titular</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Dialog: Editar Jogador
function EditPlayerDialog({ player, onClose, onUpdate }: any) {
  const [formData, setFormData] = useState(player);

  function handleSubmit() {
    onUpdate(formData);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent aria-describedby="edit-player-description">
        <DialogHeader>
          <DialogTitle>Editar Atleta</DialogTitle>
          <DialogDescription id="edit-player-description">
            Atualize as informações do atleta
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Posição</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Levantador">Levantador</SelectItem>
                  <SelectItem value="Oposto">Oposto</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Ponteiro">Ponteiro</SelectItem>
                  <SelectItem value="Líbero">Líbero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                type="number"
                min="1"
                max="99"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input
                type="number"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                value={formData.height || ""}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isCaptain}
                  onCheckedChange={(checked) => setFormData({ ...formData, isCaptain: checked })}
                />
                <Label>Capitão</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isStarter}
                  onCheckedChange={(checked) => setFormData({ ...formData, isStarter: checked })}
                />
                <Label>Titular</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

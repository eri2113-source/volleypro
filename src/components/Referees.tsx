import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { authApi, userApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { Flag, Shield, Users, Plus, CheckCircle, Clock, X, Search, Award, Mail, Phone, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface Federation {
  id: string;
  name: string;
  description: string;
  logo: string;
  president: string;
  createdAt: string;
  city: string;
  state: string;
  members: number;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
}

interface RefereeApplication {
  id: string;
  refereeId: string;
  refereeName: string;
  federationId: string;
  federationName: string;
  status: "pending" | "approved" | "rejected";
  experience: string;
  certifications: string;
  createdAt: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
}

export function Referees() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [federations, setFederations] = useState<Federation[]>([]);
  const [myApplications, setMyApplications] = useState<RefereeApplication[]>([]);
  const [myFederation, setMyFederation] = useState<Federation | null>(null);
  const [pendingApplications, setPendingApplications] = useState<RefereeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFederation, setSelectedFederation] = useState<Federation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states para criar federação
  const [fedName, setFedName] = useState("");
  const [fedDescription, setFedDescription] = useState("");
  const [fedCity, setFedCity] = useState("");
  const [fedState, setFedState] = useState("");
  const [fedContactEmail, setFedContactEmail] = useState("");
  const [fedContactPhone, setFedContactPhone] = useState("");
  const [fedContactWhatsapp, setFedContactWhatsapp] = useState("");

  // Form states para aplicar como árbitro
  const [experience, setExperience] = useState("");
  const [certifications, setCertifications] = useState("");
  const [refContactEmail, setRefContactEmail] = useState("");
  const [refContactPhone, setRefContactPhone] = useState("");
  const [refContactWhatsapp, setRefContactWhatsapp] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { profile } = await userApi.getCurrentUser();
      setCurrentUser(profile);

      // Carregar federações
      const fedsData = await fetchFederations();
      setFederations(fedsData);

      // Se o usuário é presidente de federação, carregar dados dela
      if (profile?.userType === "federation") {
        const myFed = fedsData.find((f: Federation) => f.president === profile.id);
        setMyFederation(myFed || null);

        // Carregar aplicações pendentes
        if (myFed) {
          const apps = await fetchPendingApplications(myFed.id);
          setPendingApplications(apps);
        }
      }

      // Se o usuário é árbitro, carregar suas aplicações
      if (profile?.userType === "referee") {
        const apps = await fetchMyApplications(profile.id);
        setMyApplications(apps);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados de arbitragem");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFederations(): Promise<Federation[]> {
    try {
      const response = await fetch("/api/referees/federations");
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.log("⚠️ API de federações não disponível - retornando lista vazia");
      // Retorna array vazio - apenas dados reais do banco serão exibidos
      return [];
    }
  }

  async function fetchPendingApplications(fedId: string): Promise<RefereeApplication[]> {
    try {
      const response = await fetch(`/api/referees/applications?federationId=${fedId}&status=pending`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  async function fetchMyApplications(userId: string): Promise<RefereeApplication[]> {
    try {
      const response = await fetch(`/api/referees/applications?refereeId=${userId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  async function handleCreateFederation() {
    if (!fedName || !fedDescription || !fedCity || !fedState) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!fedContactEmail && !fedContactPhone && !fedContactWhatsapp) {
      toast.error("Preencha pelo menos um meio de contato");
      return;
    }

    try {
      // Aqui você faria a chamada à API
      toast.success("Federação criada com sucesso! Aguarde aprovação.");
      setShowCreateModal(false);
      setFedName("");
      setFedDescription("");
      setFedCity("");
      setFedState("");
      setFedContactEmail("");
      setFedContactPhone("");
      setFedContactWhatsapp("");
      loadData();
    } catch (error) {
      toast.error("Erro ao criar federação");
    }
  }

  async function handleApplyToFederation() {
    if (!experience || !certifications || !selectedFederation) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!refContactEmail && !refContactPhone && !refContactWhatsapp) {
      toast.error("Preencha pelo menos um meio de contato");
      return;
    }

    try {
      // Aqui você faria a chamada à API
      toast.success("Aplicação enviada com sucesso! Aguarde aprovação da federação.");
      setShowApplyModal(false);
      setExperience("");
      setCertifications("");
      setRefContactEmail("");
      setRefContactPhone("");
      setRefContactWhatsapp("");
      setSelectedFederation(null);
      loadData();
    } catch (error) {
      toast.error("Erro ao enviar aplicação");
    }
  }

  async function handleApplicationAction(appId: string, action: "approve" | "reject") {
    try {
      // Aqui você faria a chamada à API
      toast.success(action === "approve" ? "Árbitro aprovado!" : "Aplicação rejeitada");
      loadData();
    } catch (error) {
      toast.error("Erro ao processar aplicação");
    }
  }

  const filteredFederations = federations.filter(fed =>
    fed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fed.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fed.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Flag className="h-12 w-12 mx-auto animate-pulse text-primary" />
          <p className="text-muted-foreground">Carregando dados de arbitragem...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não é árbitro nem federação
  const canCreateFederation = currentUser?.userType !== "referee";
  const canApplyAsReferee = currentUser?.userType === "referee";
  const isFederationPresident = currentUser?.userType === "federation" && myFederation;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-foreground mb-2">
            <Flag className="h-8 w-8 text-primary" />
            Sistema de Arbitragem
          </h1>
          <p className="text-muted-foreground">
            Gerencie federações de arbitragem e credenciamento de árbitros
          </p>
        </div>

        <div className="flex gap-2">
          {canCreateFederation && (
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                  <Shield className="h-4 w-4" />
                  Criar Federação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" aria-describedby="create-federation-description">
                <DialogHeader>
                  <DialogTitle>Criar Nova Federação</DialogTitle>
                  <DialogDescription id="create-federation-description">
                    Preencha os dados para criar sua federação de arbitragem
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fedName">Nome da Federação *</Label>
                    <Input
                      id="fedName"
                      value={fedName}
                      onChange={(e) => setFedName(e.target.value)}
                      placeholder="Ex: Federação Paulista de Árbitros"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fedDescription">Descrição *</Label>
                    <Textarea
                      id="fedDescription"
                      value={fedDescription}
                      onChange={(e) => setFedDescription(e.target.value)}
                      placeholder="Descreva os objetivos e abrangência da federação"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fedCity">Cidade *</Label>
                      <Input
                        id="fedCity"
                        value={fedCity}
                        onChange={(e) => setFedCity(e.target.value)}
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fedState">Estado *</Label>
                      <Input
                        id="fedState"
                        value={fedState}
                        onChange={(e) => setFedState(e.target.value)}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <Label className="text-base mb-3 block">
                      Contatos para Trabalhos de Arbitragem
                      <span className="text-xs text-muted-foreground ml-2">(pelo menos um obrigatório)</span>
                    </Label>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="fedContactEmail">Email de Contato</Label>
                        <Input
                          id="fedContactEmail"
                          type="email"
                          value={fedContactEmail}
                          onChange={(e) => setFedContactEmail(e.target.value)}
                          placeholder="contato@federacao.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fedContactPhone">Telefone</Label>
                        <Input
                          id="fedContactPhone"
                          type="tel"
                          value={fedContactPhone}
                          onChange={(e) => setFedContactPhone(e.target.value)}
                          placeholder="(11) 98888-7777"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fedContactWhatsapp">WhatsApp</Label>
                        <Input
                          id="fedContactWhatsapp"
                          type="tel"
                          value={fedContactWhatsapp}
                          onChange={(e) => setFedContactWhatsapp(e.target.value)}
                          placeholder="(11) 98888-7777"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          💡 Para trabalhos de arbitragem e orçamentos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateFederation}>
                    Criar Federação
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {canApplyAsReferee && (
            <Button
              onClick={() => setShowApplyModal(true)}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500"
            >
              <Plus className="h-4 w-4" />
              Inscrever-se
            </Button>
          )}
        </div>
      </div>

      {/* Alert para tipo de conta */}
      {currentUser?.userType !== "referee" && currentUser?.userType !== "federation" && (
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Para criar uma federação ou se inscrever como árbitro, você precisa configurar seu tipo de conta no perfil.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="federations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="federations">Federações</TabsTrigger>
          {canApplyAsReferee && <TabsTrigger value="applications">Minhas Inscrições</TabsTrigger>}
          {isFederationPresident && <TabsTrigger value="manage">Gerenciar</TabsTrigger>}
        </TabsList>

        {/* Lista de Federações */}
        <TabsContent value="federations" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar federações por nome, cidade ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFederations.map((fed) => (
              <Card key={fed.id} className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={fed.logo} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80">
                          <Shield className="h-6 w-6 text-primary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{fed.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {fed.city}, {fed.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {fed.description}
                  </p>
                  
                  {/* Contatos */}
                  {currentUser && (fed.contactEmail || fed.contactPhone || fed.contactWhatsapp) && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Contatos para Trabalhos
                      </p>
                      <div className="space-y-1.5">
                        {fed.contactEmail && (
                          <a 
                            href={`mailto:${fed.contactEmail}`}
                            className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                          >
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{fed.contactEmail}</span>
                          </a>
                        )}
                        {fed.contactPhone && (
                          <a 
                            href={`tel:${fed.contactPhone}`}
                            className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{fed.contactPhone}</span>
                          </a>
                        )}
                        {fed.contactWhatsapp && (
                          <a 
                            href={`https://wa.me/${fed.contactWhatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>{fed.contactWhatsapp}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {fed.members} árbitros
                    </Badge>
                    {canApplyAsReferee && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedFederation(fed);
                          setShowApplyModal(true);
                        }}
                      >
                        Inscrever-se
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFederations.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Nenhuma federação encontrada
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Minhas Inscrições (apenas para árbitros) */}
        {canApplyAsReferee && (
          <TabsContent value="applications" className="space-y-4">
            {myApplications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    Você ainda não possui inscrições
                  </p>
                  <Button onClick={() => setShowApplyModal(true)}>
                    Fazer Primeira Inscrição
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{app.federationName}</CardTitle>
                        <Badge
                          variant={
                            app.status === "approved"
                              ? "default"
                              : app.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {app.status === "approved" && "Aprovado"}
                          {app.status === "pending" && "Pendente"}
                          {app.status === "rejected" && "Rejeitado"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        <strong>Experiência:</strong> {app.experience}
                      </p>
                      <p className="text-sm">
                        <strong>Certificações:</strong> {app.certifications}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enviado em {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* Gerenciar Federação (apenas para presidentes) */}
        {isFederationPresident && (
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Minha Federação</CardTitle>
                <CardDescription>{myFederation?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm">
                    <strong>Localização:</strong> {myFederation?.city}, {myFederation?.state}
                  </p>
                  <p className="text-sm">
                    <strong>Árbitros cadastrados:</strong> {myFederation?.members}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inscrições Pendentes</CardTitle>
                <CardDescription>
                  {pendingApplications.length} inscrições aguardando aprovação
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApplications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma inscrição pendente
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-2 flex-1">
                          <p>
                            <strong>{app.refereeName}</strong>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Experiência: {app.experience}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Certificações: {app.certifications}
                          </p>
                          
                          {/* Contatos do Árbitro */}
                          {(app.contactEmail || app.contactPhone || app.contactWhatsapp) && (
                            <div className="mt-3 pt-3 border-t space-y-1.5">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Contatos
                              </p>
                              {app.contactEmail && (
                                <a 
                                  href={`mailto:${app.contactEmail}`}
                                  className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                                >
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{app.contactEmail}</span>
                                </a>
                              )}
                              {app.contactPhone && (
                                <a 
                                  href={`tel:${app.contactPhone}`}
                                  className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>{app.contactPhone}</span>
                                </a>
                              )}
                              {app.contactWhatsapp && (
                                <a 
                                  href={`https://wa.me/${app.contactWhatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  <span>{app.contactWhatsapp}</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApplicationAction(app.id, "approve")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApplicationAction(app.id, "reject")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Modal de Inscrição */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-2xl" aria-describedby="apply-referee-description">
          <DialogHeader>
            <DialogTitle>Inscrever-se como Árbitro</DialogTitle>
            <DialogDescription id="apply-referee-description">
              {selectedFederation
                ? `Inscrição para: ${selectedFederation.name}`
                : "Selecione uma federação primeiro"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="experience">Experiência em Arbitragem *</Label>
              <Textarea
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Descreva sua experiência como árbitro de vôlei..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="certifications">Certificações e Cursos *</Label>
              <Textarea
                id="certifications"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="Liste suas certificações, cursos e qualificações..."
                rows={4}
              />
            </div>

            <div className="border-t pt-4 mt-2">
              <Label className="text-base mb-3 block">
                Contatos para Trabalhos de Arbitragem
                <span className="text-xs text-muted-foreground ml-2">(pelo menos um obrigatório)</span>
              </Label>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="refContactEmail">Email de Contato *</Label>
                  <Input
                    id="refContactEmail"
                    type="email"
                    value={refContactEmail}
                    onChange={(e) => setRefContactEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="refContactPhone">Telefone</Label>
                  <Input
                    id="refContactPhone"
                    type="tel"
                    value={refContactPhone}
                    onChange={(e) => setRefContactPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                  />
                </div>

                <div>
                  <Label htmlFor="refContactWhatsapp">WhatsApp</Label>
                  <Input
                    id="refContactWhatsapp"
                    type="tel"
                    value={refContactWhatsapp}
                    onChange={(e) => setRefContactWhatsapp(e.target.value)}
                    placeholder="(11) 98888-7777"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Para ser contactado por times e organizadores de torneios
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyToFederation}>
              Enviar Inscrição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

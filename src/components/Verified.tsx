import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { CheckCircle2, Shield, Upload, FileText, Award, AlertCircle, Clock } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";

interface VerificationRequest {
  id: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reason?: string;
}

export function Verified() {
  const [hasRequest, setHasRequest] = useState(false);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "cpf",
    documentNumber: "",
    phone: "",
    achievements: "",
    socialProof: ""
  });

  const handleSubmitRequest = () => {
    const newRequest: VerificationRequest = {
      id: 1,
      status: "pending",
      submittedAt: new Date().toISOString()
    };

    setVerificationRequest(newRequest);
    setHasRequest(true);
  };

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Selo de Verificado",
      description: "Badge azul ao lado do seu nome em todo o site"
    },
    {
      icon: Shield,
      title: "Maior Credibilidade",
      description: "Autenticidade confirmada pela plataforma"
    },
    {
      icon: Award,
      title: "Destaque no Feed",
      description: "Suas publicações terão mais visibilidade"
    },
    {
      icon: FileText,
      title: "Prioridade em Convites",
      description: "Times priorizam atletas verificados"
    }
  ];

  const requirements = [
    "Ser atleta profissional ou semi-profissional",
    "Ter participado de competições oficiais",
    "Documento de identidade válido",
    "Comprovação de vínculo com times ou federações",
    "Perfil completo e ativo na plataforma"
  ];

  if (hasRequest && verificationRequest) {
    return (
      <div className="container mx-auto max-w-4xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Verificação de Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Status da sua solicitação de verificação
          </p>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-primary">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {verificationRequest.status === "pending" && (
                  <>
                    <Clock className="h-6 w-6 text-yellow-500" />
                    Solicitação em Análise
                  </>
                )}
                {verificationRequest.status === "approved" && (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    Perfil Verificado!
                  </>
                )}
                {verificationRequest.status === "rejected" && (
                  <>
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    Solicitação Rejeitada
                  </>
                )}
              </CardTitle>
              <Badge
                variant={
                  verificationRequest.status === "pending" ? "secondary" :
                  verificationRequest.status === "approved" ? "default" :
                  "destructive"
                }
                className="text-sm"
              >
                {verificationRequest.status === "pending" && "Pendente"}
                {verificationRequest.status === "approved" && "Aprovado"}
                {verificationRequest.status === "rejected" && "Rejeitado"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {verificationRequest.status === "pending" && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Sua solicitação está sendo analisada pela nossa equipe. 
                  O processo pode levar até 3-5 dias úteis. Você receberá uma notificação assim que houver uma atualização.
                </AlertDescription>
              </Alert>
            )}

            {verificationRequest.status === "approved" && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  Parabéns! Seu perfil foi verificado com sucesso. 
                  Agora você possui o selo de verificação em todo o site.
                </AlertDescription>
              </Alert>
            )}

            {verificationRequest.status === "rejected" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Infelizmente sua solicitação foi rejeitada. 
                  Motivo: {verificationRequest.reason || "Documentação incompleta ou inválida."}
                  <br />
                  Você pode enviar uma nova solicitação após corrigir as pendências.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Enviado em</p>
                <p className="font-semibold">
                  {new Date(verificationRequest.submittedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {verificationRequest.reviewedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Revisado em</p>
                  <p className="font-semibold">
                    {new Date(verificationRequest.reviewedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            {verificationRequest.status === "rejected" && (
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setHasRequest(false);
                    setVerificationRequest(null);
                  }}
                >
                  Enviar Nova Solicitação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Benefícios da Verificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <div className="bg-primary/10 rounded-lg p-2 h-fit">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Verificação de Perfil
        </h1>
        <p className="text-muted-foreground mt-1">
          Obtenha o selo de verificação oficial do VolleyPro
        </p>
      </div>

      {/* Benefits */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Por que verificar seu perfil?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-3 h-fit">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requisitos para Verificação</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitar Verificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                placeholder="Seu nome completo"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <select
                id="documentType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              >
                <option value="cpf">CPF</option>
                <option value="rg">RG</option>
                <option value="cnh">CNH</option>
                <option value="passport">Passaporte</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Número do Documento</Label>
              <Input
                id="documentNumber"
                placeholder="000.000.000-00"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Principais Conquistas</Label>
            <Textarea
              id="achievements"
              placeholder="Liste suas principais conquistas, títulos, times que jogou, competições que participou..."
              rows={4}
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialProof">Links de Comprovação</Label>
            <Textarea
              id="socialProof"
              placeholder="Links para matérias, redes sociais oficiais, registro em federações, etc."
              rows={3}
              value={formData.socialProof}
              onChange={(e) => setFormData({ ...formData, socialProof: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Adicione links que comprovem sua identidade e carreira (Instagram verificado, site oficial, matérias, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Documentos (Opcional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">
                Click para fazer upload
              </p>
              <p className="text-xs text-muted-foreground">
                Documento de identidade, comprovante de vínculo com times, certificados, etc.
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Todas as informações fornecidas serão mantidas em sigilo e utilizadas apenas para o processo de verificação.
              O prazo de análise é de 3-5 dias úteis.
            </AlertDescription>
          </Alert>

          <Button
            className="w-full bg-gradient-to-r from-primary to-[#0052cc]"
            size="lg"
            onClick={handleSubmitRequest}
          >
            <Shield className="h-5 w-5 mr-2" />
            Enviar Solicitação de Verificação
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Dúvidas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Quanto tempo leva a verificação?</h4>
            <p className="text-sm text-muted-foreground">
              O processo de análise geralmente leva de 3 a 5 dias úteis.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">A verificação é paga?</h4>
            <p className="text-sm text-muted-foreground">
              Não! A verificação no VolleyPro é 100% gratuita.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Posso perder o selo de verificado?</h4>
            <p className="text-sm text-muted-foreground">
              Sim, se violarmos as regras da comunidade ou fornecermos informações falsas, o selo pode ser removido.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Fãs e torcedores podem ser verificados?</h4>
            <p className="text-sm text-muted-foreground">
              A verificação é destinada principalmente a atletas profissionais e times. 
              Fãs influentes podem se qualificar em casos especiais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

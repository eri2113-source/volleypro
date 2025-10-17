import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { CreateAdModal } from "./CreateAdModal";
import { AdsManagement } from "./AdsManagement";
import {
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  CheckCircle,
  Info,
  Shield,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { masterAdminApi } from "../lib/api";

export function Ads() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      // Verificar diretamente o email do usuário logado
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email === 'eri.2113@gmail.com') {
        setIsAdmin(true);
        console.log('✅ Admin detectado:', session.user.email);
      } else {
        setIsAdmin(false);
        console.log('✅ Usuário normal:', session?.user?.email || 'não logado');
      }
    } catch (error) {
      console.error("Erro ao verificar status admin:", error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  }

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            Anúncios
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? "Gerencie anúncios da plataforma"
              : "Divulgue seu negócio gratuitamente"}
          </p>
        </div>
        {!isAdmin && (
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={() => setShowCreateModal(true)}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Criar Anúncio Grátis
          </Button>
        )}
      </div>

      {isAdmin ? (
        // Painel do Admin
        <AdsManagement />
      ) : (
        // Página Pública
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="benefits">Benefícios</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            {/* Promoção */}
            <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <Sparkles className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-base">
                <strong className="text-lg">🎉 Promoção de Lançamento!</strong>
                <p className="mt-2">
                  Anuncie seu negócio <strong>100% GRÁTIS</strong> durante nosso
                  período de divulgação! Seja uma das primeiras empresas a alcançar
                  milhares de atletas, times e fãs de vôlei em todo o Brasil.
                </p>
                <p className="mt-3 pt-3 border-t border-green-300">
                  <strong>📱 Dúvidas?</strong> Entre em contato pelo WhatsApp:{" "}
                  <a 
                    href="https://wa.me/5562920004301" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-green-700 hover:text-green-800 underline"
                  >
                    (62) 92000-4301
                  </a>
                </p>
              </AlertDescription>
            </Alert>

            {/* Como funciona */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                      1
                    </div>
                    <h3 className="font-semibold mb-2">Crie seu Anúncio</h3>
                    <p className="text-sm text-muted-foreground">
                      Preencha os dados, adicione imagem e link. É rápido e fácil!
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold mb-3">
                      2
                    </div>
                    <h3 className="font-semibold mb-2">Aguarde Aprovação</h3>
                    <p className="text-sm text-muted-foreground">
                      Nossa equipe analisa em até 24h. Você recebe email quando aprovado.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mb-3">
                      3
                    </div>
                    <h3 className="font-semibold mb-2">Seu Anúncio no Ar!</h3>
                    <p className="text-sm text-muted-foreground">
                      Milhares de pessoas vão ver seu produto ou serviço!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Anúncios */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Anúncios Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-3 p-3 rounded-lg border">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      🖼️
                    </div>
                    <div>
                      <h4 className="font-semibold">Banner Grande</h4>
                      <p className="text-sm text-muted-foreground">
                        Destaque no topo da página principal
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg border">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      📦
                    </div>
                    <div>
                      <h4 className="font-semibold">Card no Feed</h4>
                      <p className="text-sm text-muted-foreground">
                        Aparece entre os posts do feed
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg border">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      📌
                    </div>
                    <div>
                      <h4 className="font-semibold">Sidebar</h4>
                      <p className="text-sm text-muted-foreground">
                        Fixo na barra lateral
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg border">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-semibold">Story</h4>
                      <p className="text-sm text-muted-foreground">
                        Formato vertical no carrossel
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">
                  Pronto para começar?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Aproveite a promoção de lançamento e anuncie gratuitamente!
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary text-lg px-8"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Criar Meu Anúncio Agora
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Alcance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Público Segmentado</p>
                      <p className="text-sm text-muted-foreground">
                        Atletas, times e fãs apaixonados por vôlei
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Todo o Brasil</p>
                      <p className="text-sm text-muted-foreground">
                        Usuários de todas as regiões do país
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Alta Frequência</p>
                      <p className="text-sm text-muted-foreground">
                        Usuários acessam diariamente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    Visibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Múltiplos Formatos</p>
                      <p className="text-sm text-muted-foreground">
                        Banner, Card, Sidebar e Story
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Posicionamento Premium</p>
                      <p className="text-sm text-muted-foreground">
                        Locais estratégicos na plataforma
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Design Profissional</p>
                      <p className="text-sm text-muted-foreground">
                        Anúncios otimizados para conversão
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Resultados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Mais Clientes</p>
                      <p className="text-sm text-muted-foreground">
                        Aumente suas vendas e conversões
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Reconhecimento</p>
                      <p className="text-sm text-muted-foreground">
                        Fortaleça sua marca no vôlei
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">ROI Positivo</p>
                      <p className="text-sm text-muted-foreground">
                        100% grátis = lucro garantido
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Moderação</p>
                      <p className="text-sm text-muted-foreground">
                        Todos anúncios são aprovados manualmente
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Confiabilidade</p>
                      <p className="text-sm text-muted-foreground">
                        Ambiente seguro e profissional
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Qualidade</p>
                      <p className="text-sm text-muted-foreground">
                        Apenas conteúdo relevante e de qualidade
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Modal de Criação */}
      <CreateAdModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}

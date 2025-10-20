import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  POST_TEMPLATES, 
  CONTENT_IDEAS, 
  HASHTAG_SUGGESTIONS,
  POST_TIPS,
  PostTemplate 
} from "../lib/postTemplates";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Lightbulb, 
  Hash, 
  TrendingUp,
  BookOpen,
  Zap
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ContentInspirationModalProps {
  open: boolean;
  onClose: () => void;
  onUseTemplate: (template: string) => void;
}

export function ContentInspirationModal({ 
  open, 
  onClose, 
  onUseTemplate 
}: ContentInspirationModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? POST_TEMPLATES 
    : POST_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleCopyTemplate = async (template: string, id: string) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedTemplate(id);
      toast.success("Template copiado! 📋", {
        description: "Cole no campo de criação de post"
      });
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (error) {
      toast.error("Erro ao copiar template");
    }
  };

  const handleUseTemplate = (template: string) => {
    onUseTemplate(template);
    onClose();
    toast.success("Template aplicado! ✨", {
      description: "Personalize e publique seu conteúdo"
    });
  };

  const categoryColors: Record<string, string> = {
    jogo: 'bg-green-500',
    treino: 'bg-orange-500',
    motivacao: 'bg-red-500',
    conquista: 'bg-purple-500',
    estatistica: 'bg-blue-500',
    dica: 'bg-yellow-500',
    bastidores: 'bg-pink-500',
    convocacao: 'bg-emerald-500',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0" aria-describedby="content-inspiration-description">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Ferramentas de Inspiração</DialogTitle>
              <DialogDescription id="content-inspiration-description">
                Templates, ideias e dicas para criar conteúdo incrível! 🏐✨
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <div className="px-6 border-b">
            <TabsList className="w-full grid grid-cols-4 bg-muted/50">
              <TabsTrigger value="templates" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="ideas" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Ideias</span>
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="gap-2">
                <Hash className="h-4 w-4" />
                <span className="hidden sm:inline">Hashtags</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dicas</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB: Templates */}
          <TabsContent value="templates" className="m-0 p-0">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Categorias:</span>
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="h-7"
                >
                  Todas
                </Button>
                {Array.from(new Set(POST_TEMPLATES.map(t => t.category))).map(cat => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className="h-7 capitalize"
                  >
                    {POST_TEMPLATES.find(t => t.category === cat)?.icon} {cat}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[500px] px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {filteredTemplates.map((template) => {
                  // Mapear categoria para background gradient
                  const categoryBgMap: Record<string, string> = {
                    jogo: 'gradient-green',
                    treino: 'gradient-orange',
                    motivacao: 'gradient-pink',
                    conquista: 'gradient-purple',
                    estatistica: 'gradient-blue',
                    dica: 'gradient-yellow',
                    bastidores: 'gradient-cyan',
                    convocacao: 'gradient-green',
                  };
                  
                  return (
                    <Card 
                      key={template.id} 
                      className={`hover:shadow-xl transition-all cursor-pointer border-2 ${categoryBgMap[template.category] || ''}`}
                      style={{ borderColor: template.color + '40' }}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-md"
                              style={{ 
                                backgroundColor: template.color + '20',
                                border: `2px solid ${template.color}40`
                              }}
                            >
                              {template.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold">{template.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            className={`${categoryColors[template.category]} text-white text-xs shadow-sm`}
                          >
                            {template.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div 
                          className="rounded-lg p-3 text-sm font-mono border-2"
                          style={{ 
                            backgroundColor: template.color + '10',
                            borderColor: template.color + '20'
                          }}
                        >
                          {template.template.substring(0, 80)}...
                        </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyTemplate(template.template, template.id);
                          }}
                          className="flex-1 gap-2"
                        >
                          {copiedTemplate === template.id ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copiar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(template.template);
                          }}
                          className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
                        >
                          <Zap className="h-3 w-3" />
                          Usar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB: Ideias */}
          <TabsContent value="ideas" className="m-0 p-0">
            <ScrollArea className="h-[600px] px-6 py-4">
              <div className="space-y-6">
                {CONTENT_IDEAS.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      {section.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.ideas.map((idea, ideaIdx) => {
                        // Cores alternadas para as ideias
                        const ideaColors = [
                          { bg: 'gradient-blue', dot: '#0066ff' },
                          { bg: 'gradient-orange', dot: '#ff6b35' },
                          { bg: 'gradient-green', dot: '#10b981' },
                          { bg: 'gradient-purple', dot: '#8b5cf6' },
                          { bg: 'gradient-yellow', dot: '#f59e0b' },
                          { bg: 'gradient-pink', dot: '#ec4899' },
                        ];
                        const colorIndex = (idx + ideaIdx) % ideaColors.length;
                        const ideaColor = ideaColors[colorIndex];
                        
                        return (
                          <Card 
                            key={ideaIdx} 
                            className={`hover:shadow-lg transition-all cursor-pointer border-2 ${ideaColor.bg}`}
                            onClick={() => {
                              navigator.clipboard.writeText(idea);
                              toast.success("Ideia copiada! 💡");
                            }}
                          >
                            <CardContent className="p-4 flex items-start gap-3">
                              <div 
                                className="w-2 h-2 rounded-full mt-2" 
                                style={{ backgroundColor: ideaColor.dot }}
                              />
                              <p className="text-sm flex-1">{idea}</p>
                              <Copy className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    {idx < CONTENT_IDEAS.length - 1 && <Separator className="my-6" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB: Hashtags */}
          <TabsContent value="hashtags" className="m-0 p-0">
            <ScrollArea className="h-[600px] px-6 py-4">
              <div className="space-y-6">
                {Object.entries(HASHTAG_SUGGESTIONS).map(([category, hashtags]) => (
                  <div key={category}>
                    <h3 className="text-lg capitalize mb-3 flex items-center gap-2">
                      <Hash className="h-5 w-5 text-primary" />
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag, tagIdx) => {
                        // Cores diferentes para cada categoria de hashtag
                        const hashtagColors = [
                          'hover:bg-volleyball-blue hover:border-volleyball-blue',
                          'hover:bg-volleyball-orange hover:border-volleyball-orange',
                          'hover:bg-volleyball-green hover:border-volleyball-green',
                          'hover:bg-volleyball-purple hover:border-volleyball-purple',
                          'hover:bg-volleyball-yellow hover:border-volleyball-yellow',
                          'hover:bg-volleyball-pink hover:border-volleyball-pink',
                        ];
                        const colorClass = hashtagColors[tagIdx % hashtagColors.length];
                        
                        return (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`cursor-pointer hover:text-white transition-all text-sm px-3 py-1 border-2 ${colorClass}`}
                            onClick={() => {
                              navigator.clipboard.writeText(tag);
                              toast.success(`${tag} copiado! 📋`);
                            }}
                          >
                            {tag}
                            <Copy className="h-3 w-3 ml-2" />
                          </Badge>
                        );
                      })}
                    </div>
                    <Separator className="my-6" />
                  </div>
                ))}

                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Dica de Hashtags
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use 3-5 hashtags por post</li>
                      <li>• Misture hashtags populares e específicas</li>
                      <li>• Sempre use #VolleyPro para aparecer na rede</li>
                      <li>• Adicione hashtag do seu time/competição</li>
                      <li>• Crie sua hashtag pessoal (ex: #EquipeNome)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB: Dicas */}
          <TabsContent value="tips" className="m-0 p-0">
            <ScrollArea className="h-[600px] px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POST_TIPS.map((tip, idx) => (
                  <Card 
                    key={idx} 
                    className="hover:shadow-lg transition-all border-l-4 border-l-primary/50 hover:border-l-primary"
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm flex-1">{tip}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <Card className="bg-gradient-to-br from-primary via-[#0052cc] to-secondary text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Fórmula do Post Perfeito
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold w-6">1.</span>
                      <span className="flex-1"><strong>Gancho:</strong> Comece com emoji ou frase impactante</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold w-6">2.</span>
                      <span className="flex-1"><strong>Contexto:</strong> Explique o que aconteceu</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold w-6">3.</span>
                      <span className="flex-1"><strong>Emoção:</strong> Compartilhe o que você sentiu</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold w-6">4.</span>
                      <span className="flex-1"><strong>Call to Action:</strong> Pergunte algo ou motive</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold w-6">5.</span>
                      <span className="flex-1"><strong>Hashtags:</strong> 3-5 hashtags relevantes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Template Selecionado */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-2xl" aria-describedby="template-detail-description">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedTemplate.icon}</span>
                  {selectedTemplate.title}
                </DialogTitle>
                <DialogDescription id="template-detail-description">{selectedTemplate.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">📝 Template:</h4>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                    {selectedTemplate.template}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">💡 Placeholder de Exemplo:</h4>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground italic">
                    {selectedTemplate.placeholder}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">✨ Exemplos Reais:</h4>
                  <div className="space-y-3">
                    {selectedTemplate.examples.map((example, idx) => (
                      <Card key={idx} className="bg-card/50">
                        <CardContent className="p-4 text-sm whitespace-pre-wrap">
                          {example}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">#️⃣ Hashtags Sugeridas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      handleCopyTemplate(selectedTemplate.template, selectedTemplate.id);
                      setSelectedTemplate(null);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copiar Template
                  </Button>
                  <Button
                    className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
                    onClick={() => {
                      handleUseTemplate(selectedTemplate.template);
                      setSelectedTemplate(null);
                    }}
                  >
                    <Zap className="h-4 w-4" />
                    Usar Agora
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

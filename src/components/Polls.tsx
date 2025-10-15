import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BarChart3, Plus, Clock, CheckCircle2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  hasVoted: boolean;
  userVote?: number;
}

const mockPolls: Poll[] = [
  {
    id: 1,
    question: "Qual foi o melhor jogador da última partida?",
    options: [
      { id: 1, text: "João Silva - Ponteiro", votes: 45 },
      { id: 2, text: "Maria Santos - Levantadora", votes: 32 },
      { id: 3, text: "Pedro Costa - Líbero", votes: 18 },
      { id: 4, text: "Ana Lima - Oposta", votes: 25 }
    ],
    totalVotes: 120,
    createdBy: "Time Vôlei SP",
    createdAt: "2 horas atrás",
    expiresAt: "em 22 horas",
    hasVoted: false
  },
  {
    id: 2,
    question: "Qual técnica você mais gosta de treinar?",
    options: [
      { id: 1, text: "Saque", votes: 67 },
      { id: 2, text: "Ataque", votes: 89 },
      { id: 3, text: "Bloqueio", votes: 34 },
      { id: 4, text: "Defesa", votes: 45 }
    ],
    totalVotes: 235,
    createdBy: "Carlos Técnico",
    createdAt: "1 dia atrás",
    expiresAt: "em 5 dias",
    hasVoted: true,
    userVote: 2
  },
  {
    id: 3,
    question: "Melhor horário para treinos?",
    options: [
      { id: 1, text: "Manhã (6h-9h)", votes: 42 },
      { id: 2, text: "Tarde (14h-17h)", votes: 58 },
      { id: 3, text: "Noite (18h-21h)", votes: 91 }
    ],
    totalVotes: 191,
    createdBy: "Vôlei Pro Community",
    createdAt: "3 dias atrás",
    expiresAt: "em 4 dias",
    hasVoted: false
  }
];

export function Polls() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);

  const handleVote = (pollId: number, optionId: number) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        return {
          ...poll,
          hasVoted: true,
          userVote: optionId,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    }));
  };

  const handleCreatePoll = () => {
    if (!newQuestion.trim()) return;
    
    const validOptions = newOptions.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("Adicione pelo menos 2 opções!");
      return;
    }

    const newPoll: Poll = {
      id: polls.length + 1,
      question: newQuestion,
      options: validOptions.map((text, idx) => ({
        id: idx + 1,
        text,
        votes: 0
      })),
      totalVotes: 0,
      createdBy: "Você",
      createdAt: "agora",
      expiresAt: "em 7 dias",
      hasVoted: false
    };

    setPolls([newPoll, ...polls]);
    setShowCreateDialog(false);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Enquetes
          </h1>
          <p className="text-muted-foreground mt-1">
            Vote e participe das discussões da comunidade
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-[#0052cc]">
              <Plus className="h-4 w-4 mr-2" />
              Criar Enquete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Nova Enquete</DialogTitle>
              <DialogDescription>
                Crie uma enquete para coletar a opinião da comunidade
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Pergunta</Label>
                <Textarea
                  id="question"
                  placeholder="Ex: Qual foi o melhor jogador da partida?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Opções</Label>
                {newOptions.map((option, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Opção ${idx + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[idx] = e.target.value;
                      setNewOptions(updated);
                    }}
                    className="mt-2"
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePoll}>
                Criar Enquete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold">{polls.length}</div>
            <div className="text-sm text-muted-foreground">Enquetes Ativas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto text-secondary mb-2" />
            <div className="text-2xl font-bold">
              {polls.reduce((acc, poll) => acc + poll.totalVotes, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total de Votos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">
              {polls.filter(p => p.hasVoted).length}
            </div>
            <div className="text-sm text-muted-foreground">Você Votou</div>
          </CardContent>
        </Card>
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.map(poll => (
          <Card key={poll.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{poll.question}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {poll.totalVotes} votos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {poll.createdAt}
                    </span>
                  </div>
                </div>
                {poll.hasVoted && (
                  <Badge variant="secondary" className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Votado
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-3">
              {poll.options.map(option => {
                const percentage = poll.totalVotes > 0 
                  ? Math.round((option.votes / poll.totalVotes) * 100)
                  : 0;
                
                const isUserVote = poll.hasVoted && poll.userVote === option.id;

                return (
                  <div key={option.id}>
                    {poll.hasVoted ? (
                      // Mostrar resultados
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isUserVote ? "font-semibold text-primary" : ""}>
                            {option.text}
                            {isUserVote && " ✓"}
                          </span>
                          <span className="text-muted-foreground">
                            {percentage}% ({option.votes})
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ) : (
                      // Botão para votar
                      <Button
                        variant="outline"
                        className="w-full justify-start hover:bg-primary/10 hover:border-primary"
                        onClick={() => handleVote(poll.id, option.id)}
                      >
                        {option.text}
                      </Button>
                    )}
                  </div>
                );
              })}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
                <span>Por {poll.createdBy}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Expira {poll.expiresAt}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {polls.length === 0 && (
        <Card className="p-12 text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma enquete ativa</h3>
          <p className="text-muted-foreground mb-4">
            Seja o primeiro a criar uma enquete!
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Enquete
          </Button>
        </Card>
      )}
    </div>
  );
}

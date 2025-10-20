import { useState, useEffect } from "react";
import { MessageCircle, Search, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChatWindow } from "./ChatWindow";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Conversation {
  userId: string;
  name: string;
  photoUrl?: string;
  verified?: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setLoading(true);
    try {
      const token = localStorage.getItem('volleypro_token');
      if (!token) {
        console.log('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/messages/conversations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        console.error('Erro ao carregar conversas');
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedUserId) {
    return (
      <ChatWindow
        otherUserId={selectedUserId}
        onBack={() => {
          setSelectedUserId(null);
          loadConversations(); // Recarregar conversas ao voltar
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl sm:text-2xl">Mensagens</h1>
              <p className="text-white/80 text-xs sm:text-sm">
                {conversations.length} {conversations.length === 1 ? 'conversa' : 'conversas'}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4 space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2">
                  {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma mensagem ainda'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery 
                    ? 'Tente buscar por outro nome'
                    : 'Comece uma conversa visitando o perfil de um atleta ou time'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conv) => (
              <Card
                key={conv.userId}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedUserId(conv.userId)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3 items-start">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={conv.photoUrl} alt={conv.name} />
                      <AvatarFallback>
                        {conv.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="truncate">{conv.name}</h3>
                          {conv.verified && (
                            <Badge variant="secondary" className="flex-shrink-0 h-5 px-1.5">
                              ✓
                            </Badge>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-primary flex-shrink-0">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatMessageTime(conv.lastMessageAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  });
}

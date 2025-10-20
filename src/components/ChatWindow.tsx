import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { projectId } from "../utils/supabase/info";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhotoUrl?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ChatWindowProps {
  otherUserId: string;
  onBack: () => void;
}

export function ChatWindow({ otherUserId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadMessages();
    loadOtherUserProfile();
    getCurrentUserId();

    // Mark messages as read
    markAsRead();

    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function getCurrentUserId() {
    const token = localStorage.getItem('volleypro_token');
    if (!token) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/users/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.profile.id);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
    }
  }

  async function loadOtherUserProfile() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/users/${otherUserId}`
      );

      if (response.ok) {
        const data = await response.json();
        setOtherUser(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  async function loadMessages() {
    try {
      const token = localStorage.getItem('volleypro_token');
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/messages/${otherUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead() {
    try {
      const token = localStorage.getItem('volleypro_token');
      if (!token) return;

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/messages/${otherUserId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  }

  async function handleSendMessage() {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('volleypro_token');
      if (!token) {
        toast.error('Você precisa estar logado');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/messages/${otherUserId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: messageText }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setMessageText("");
        
        // Focus back on textarea
        textareaRef.current?.focus();
      } else {
        toast.error('Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 shadow-lg flex-shrink-0">
        <div className="container mx-auto max-w-4xl flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {otherUser && (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser.photoUrl} alt={otherUser.name} />
                <AvatarFallback>
                  {otherUser.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-white truncate">{otherUser.name}</h2>
                  {otherUser.verified && (
                    <CheckCircle2 className="h-4 w-4 text-white flex-shrink-0" />
                  )}
                </div>
                {otherUser.position && (
                  <p className="text-white/80 text-sm truncate">{otherUser.position}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : messages.length === 0 ? (
            <Card className="border-dashed">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="mb-2">Comece a conversa</h3>
                <p className="text-muted-foreground text-sm">
                  Envie sua primeira mensagem para {otherUser?.name}
                </p>
              </div>
            </Card>
          ) : (
            <>
              {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.senderPhotoUrl} alt={message.senderName} />
                        <AvatarFallback className="text-xs">
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur p-4 flex-shrink-0">
        <div className="container mx-auto max-w-4xl flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Digite sua mensagem..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sending || !messageText.trim()}
            size="icon"
            className="h-11 w-11 flex-shrink-0"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
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
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 0) return 'Hoje ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

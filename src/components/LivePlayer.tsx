import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { WebcamStream } from "./WebcamStream";
import { LiveVideoPlayer } from "./LiveVideoPlayer";

import { 
  X, 
  Radio, 
  Eye, 
  MessageCircle, 
  Send, 
  Maximize, 
  Minimize,
  Share2,
  MoreVertical,
  Trash2
} from "lucide-react";
import { liveApi, authApi, masterAdminApi } from "../lib/api";
import { toast } from "sonner@2.0.3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LivePlayerProps {
  liveId: string;
  open: boolean;
  onClose: () => void;
  onLiveEnded?: () => void;
}

export function LivePlayer({ liveId, open, onClose, onLiveEnded }: LivePlayerProps) {
  const [live, setLive] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMaster, setIsMaster] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPollInterval = useRef<any>(null);

  useEffect(() => {
    if (open && liveId) {
      loadLive();
      loadMessages();
      checkMasterStatus();
      
      // Poll for new messages every 3 seconds
      chatPollInterval.current = setInterval(loadMessages, 3000);
      
      // Join as viewer
      liveApi.updateViewerCount(liveId, 'join').catch(console.error);
      
      return () => {
        if (chatPollInterval.current) {
          clearInterval(chatPollInterval.current);
        }
        // Leave as viewer
        liveApi.updateViewerCount(liveId, 'leave').catch(console.error);
      };
    }
  }, [open, liveId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadLive() {
    setLoading(true);
    try {
      const { live: liveData } = await liveApi.getLive(liveId);
      setLive(liveData);
      
      // Check if current user is creator
      const currentUserId = authApi.getCurrentUserId();
      setIsCreator(liveData.creatorId === currentUserId);
    } catch (error: any) {
      console.error("❌ Erro ao carregar live:", error);
      toast.error("Erro ao carregar live");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    try {
      const { messages: msgs } = await liveApi.getChatMessages(liveId, 100);
      setMessages(msgs);
    } catch (error) {
      console.error("❌ Erro ao carregar mensagens:", error);
    }
  }

  async function checkMasterStatus() {
    try {
      const { isMaster: masterStatus } = await masterAdminApi.checkMasterStatus();
      setIsMaster(masterStatus);
    } catch (error) {
      setIsMaster(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      await liveApi.sendChatMessage(liveId, newMessage.trim());
      setNewMessage("");
      // Reload messages immediately
      await loadMessages();
    } catch (error: any) {
      console.error("❌ Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    }
  }

  async function handleEndLive() {
    if (!confirm("Tem certeza que deseja encerrar esta live?")) return;

    try {
      await liveApi.endLive(liveId);
      toast.success("Live encerrada com sucesso!");
      onLiveEnded?.();
      onClose();
    } catch (error: any) {
      console.error("❌ Erro ao encerrar live:", error);
      toast.error("Erro ao encerrar live");
    }
  }

  async function handleDeleteLive() {
    if (!confirm("Tem certeza que deseja deletar esta live? Esta ação não pode ser desfeita.")) return;

    try {
      await liveApi.deleteLive(liveId);
      toast.success("Live deletada com sucesso!");
      onLiveEnded?.();
      onClose();
    } catch (error: any) {
      console.error("❌ Erro ao deletar live:", error);
      toast.error("Erro ao deletar live");
    }
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!", {
      description: "Compartilhe esta live com seus amigos"
    });
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className={`
          ${isFullscreen ? 'max-w-full h-screen m-0 rounded-none' : 'max-w-6xl'}
          p-0 gap-0 overflow-hidden
        `}
      >
        {/* Títulos para acessibilidade - visualmente escondidos */}
        <DialogTitle className="sr-only">
          {live?.title || "Live Player"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {live?.status === 'live' 
            ? `Assistindo transmissão ao vivo: ${live?.title}`
            : `Visualizando: ${live?.title}`
          }
        </DialogDescription>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Radio className="h-12 w-12 animate-pulse text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando live...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Video Area */}
            <div className="flex-1 bg-black relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Live Badge */}
              {live?.status === 'live' && (
                <Badge className="absolute top-4 left-16 z-10 bg-red-500">
                  <Radio className="h-3 w-3 mr-1 animate-pulse" />
                  AO VIVO
                </Badge>
              )}

              {/* Viewer count */}
              <div className="absolute top-4 right-4 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {live?.viewers?.toLocaleString() || 0}
              </div>

              {/* Actions */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <Share2 className="h-5 w-5" />
                </Button>

                {/* Creator/Master options */}
                {(isCreator || isMaster) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/50 hover:bg-black/70 text-white"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isCreator && live?.status === 'live' && (
                        <DropdownMenuItem onClick={handleEndLive}>
                          <Radio className="h-4 w-4 mr-2" />
                          Encerrar Live
                        </DropdownMenuItem>
                      )}
                      {(isCreator || isMaster) && (
                        <DropdownMenuItem onClick={handleDeleteLive} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar Live
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Video player profissional */}
              <LiveVideoPlayer
                live={live}
                isCreator={isCreator}
                onStreamStart={(stream) => {
                  console.log("📹 Stream iniciado:", stream);
                }}
                onStreamStop={() => {
                  console.log("🛑 Stream parado");
                }}
              />

              {/* Info bar */}
              <div className="bg-gray-900 p-4 text-white">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={live?.creator?.photoUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {live?.creator?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{live?.creator?.name}</h3>
                    {live?.description && (
                      <p className="text-sm text-white/70 mt-1">{live.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-full lg:w-96 bg-card border-l flex flex-col h-[400px] lg:h-auto">
              {/* Chat header */}
              <div className="p-4 border-b">
                <h3 className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat ao Vivo
                </h3>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma mensagem ainda</p>
                      <p className="text-xs">Seja o primeiro a comentar!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.userPhotoUrl} />
                          <AvatarFallback className="text-xs">
                            {msg.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{msg.userName}</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message input */}
              {live?.chatEnabled && live?.status === 'live' ? (
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      maxLength={200}
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 border-t text-center text-sm text-muted-foreground">
                  Chat desabilitado
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>

    </Dialog>
  );
}

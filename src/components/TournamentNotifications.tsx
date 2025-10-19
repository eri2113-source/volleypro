import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell, BellOff, Trophy, X, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TournamentNotificationsProps {
  tournamentId: number;
  userId: string;
  category: string;
  division: string;
}

interface Notification {
  id: string;
  type: "match_result" | "match_starting" | "classification_update";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  matchId?: number;
}

export function TournamentNotifications({ 
  tournamentId, 
  userId, 
  category, 
  division 
}: TournamentNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Conectar ao sistema de notificações em tempo real
    connectToRealtimeNotifications();

    // Carregar notificações anteriores
    loadPreviousNotifications();

    return () => {
      // Cleanup
    };
  }, [tournamentId, category, division, isEnabled]);

  useEffect(() => {
    // Contar notificações não lidas
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  async function connectToRealtimeNotifications() {
    try {
      // Simular conexão WebSocket/Polling para notificações em tempo real
      // TODO: Implementar com Supabase Realtime ou WebSocket
      const interval = setInterval(async () => {
        await checkNewNotifications();
      }, 5000); // Verificar a cada 5 segundos

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Erro ao conectar notificações:", error);
    }
  }

  async function checkNewNotifications() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournament/notifications?` +
        `tournamentId=${tournamentId}&userId=${userId}&category=${category}&division=${division}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Verificar se há novas notificações
        const newNotifications = data.notifications.filter(
          (n: Notification) => !notifications.find(existing => existing.id === n.id)
        );

        if (newNotifications.length > 0) {
          // Adicionar novas notificações
          setNotifications(prev => [...newNotifications, ...prev]);

          // Mostrar toast para cada nova notificação
          newNotifications.forEach((notification: Notification) => {
            showNotificationToast(notification);
          });

          // Tocar som se ativado
          if (soundEnabled) {
            playNotificationSound();
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar notificações:", error);
    }
  }

  async function loadPreviousNotifications() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournament/notifications/history?` +
        `tournamentId=${tournamentId}&userId=${userId}&category=${category}&division=${division}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }

  function showNotificationToast(notification: Notification) {
    const icon = notification.type === "match_result" ? "🏐" : 
                 notification.type === "match_starting" ? "⏰" : "📊";

    toast.info(`${icon} ${notification.title}`, {
      description: notification.message,
      duration: 5000,
      action: notification.matchId ? {
        label: "Ver Jogo",
        onClick: () => {
          // Navegar para o jogo
          console.log("Navegar para jogo:", notification.matchId);
        }
      } : undefined
    });
  }

  function playNotificationSound() {
    try {
      // Criar um beep simples
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Erro ao tocar som:", error);
    }
  }

  function toggleNotifications() {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    toast.success(
      newState ? "🔔 Notificações ativadas!" : "🔕 Notificações desativadas",
      {
        description: newState 
          ? `Você receberá alertas sobre resultados de ${category} - ${division}ª Divisão`
          : "Você não receberá mais alertas deste torneio"
      }
    );
  }

  function markAsRead(notificationId: string) {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Todas as notificações foram marcadas como lidas");
  }

  function clearNotification(notificationId: string) {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "match_result":
        return <Trophy className="h-4 w-4" />;
      case "match_starting":
        return <Bell className="h-4 w-4" />;
      case "classification_update":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  }

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleNotifications}
          className={isEnabled ? "border-green-500" : ""}
        >
          {isEnabled ? (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Alertas Ativos
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Alertas Desativados
            </>
          )}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1.5 py-0 h-5 min-w-[20px]">
              {unreadCount}
            </Badge>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Desativar som" : "Ativar som"}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            Ver {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
          </Button>
        )}
      </div>

      {/* Lista de Notificações */}
      {showNotifications && (
        <Card className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Notificações</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.read 
                        ? "bg-background hover:bg-muted/50" 
                        : "bg-blue-500/10 border-blue-500 hover:bg-blue-500/20"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getNotificationIcon(notification.type)}
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

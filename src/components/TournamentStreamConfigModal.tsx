import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Video, Radio, Youtube, Twitch, Facebook, Globe, Copy, Check, AlertCircle, Play, StopCircle, Info } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId } from '../utils/supabase/info';

interface StreamConfig {
  platform: 'youtube' | 'twitch' | 'facebook' | 'custom';
  streamUrl?: string;
  streamKey?: string;
  embedUrl?: string;
  title?: string;
  isLive: boolean;
  startedAt?: string;
  organizerId?: string;
}

interface TournamentStreamConfigModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  isOrganizer: boolean;
}

export function TournamentStreamConfigModal({
  open,
  onClose,
  tournamentId,
  tournamentName,
  isOrganizer
}: TournamentStreamConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>({
    platform: 'youtube',
    isLive: false
  });
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (open) {
      loadStreamConfig();
    }
  }, [open, tournamentId]);

  const loadStreamConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/stream-config`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('volleypro_token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setStreamConfig(data.config);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de stream:', error);
    }
  };

  const saveStreamConfig = async () => {
    if (!isOrganizer) {
      toast.error('Apenas organizadores podem configurar transmissões');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/stream-config`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('volleypro_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(streamConfig)
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao salvar configuração');
      }

      toast.success('✅ Configuração de transmissão salva!');
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar stream config:', error);
      toast.error(error.message || 'Erro ao salvar configuração');
    } finally {
      setLoading(false);
    }
  };

  const toggleLive = async () => {
    if (!isOrganizer) {
      toast.error('Apenas organizadores podem controlar transmissões');
      return;
    }

    try {
      setLoading(true);
      const newIsLive = !streamConfig.isLive;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0ea22bba/tournaments/${tournamentId}/stream-toggle`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('volleypro_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isLive: newIsLive })
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao alternar transmissão');
      }

      setStreamConfig(prev => ({
        ...prev,
        isLive: newIsLive,
        startedAt: newIsLive ? new Date().toISOString() : undefined
      }));

      toast.success(newIsLive ? '🔴 Transmissão iniciada!' : '⚫ Transmissão encerrada');
    } catch (error: any) {
      console.error('Erro ao alternar live:', error);
      toast.error(error.message || 'Erro ao alternar transmissão');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'key' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
    toast.success('📋 Copiado!');
  };

  const getPlatformInstructions = () => {
    switch (streamConfig.platform) {
      case 'youtube':
        return {
          icon: <Youtube className="h-5 w-5 text-red-600" />,
          name: 'YouTube Live',
          instructions: [
            '1. Acesse YouTube Studio → Transmissão ao vivo',
            '2. Copie a "Chave de transmissão"',
            '3. Cole no campo "Stream Key" abaixo',
            '4. No OBS: Configurações → Transmissão → Serviço: YouTube',
            '5. Cole a chave de transmissão no OBS',
            '6. Clique em "Iniciar Transmissão" no OBS'
          ],
          serverUrl: 'rtmp://a.rtmp.youtube.com/live2/'
        };
      case 'twitch':
        return {
          icon: <Twitch className="h-5 w-5 text-purple-600" />,
          name: 'Twitch',
          instructions: [
            '1. Acesse Dashboard da Twitch → Configurações',
            '2. Copie sua "Chave de Transmissão Primária"',
            '3. Cole no campo "Stream Key" abaixo',
            '4. No OBS: Configurações → Transmissão → Serviço: Twitch',
            '5. Cole a chave de transmissão no OBS',
            '6. Clique em "Iniciar Transmissão" no OBS'
          ],
          serverUrl: 'rtmp://live.twitch.tv/app/'
        };
      case 'facebook':
        return {
          icon: <Facebook className="h-5 w-5 text-blue-600" />,
          name: 'Facebook Live',
          instructions: [
            '1. Acesse Facebook → Transmissão ao vivo',
            '2. Copie a "Chave de transmissão"',
            '3. Cole no campo "Stream Key" abaixo',
            '4. No OBS: Configurações → Transmissão → Serviço: Facebook Live',
            '5. Cole a chave de transmissão no OBS',
            '6. Clique em "Iniciar Transmissão" no OBS'
          ],
          serverUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/'
        };
      default:
        return {
          icon: <Globe className="h-5 w-5 text-primary" />,
          name: 'URL Personalizada',
          instructions: [
            '1. Obtenha a URL do player de sua plataforma',
            '2. Cole no campo "URL do Embed" abaixo',
            '3. Configure o OBS com os dados de sua plataforma',
            '4. Inicie a transmissão'
          ],
          serverUrl: ''
        };
    }
  };

  const platformInfo = getPlatformInstructions();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="stream-config-description">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                Transmissão Externa
                {streamConfig.isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Radio className="h-3 w-3 mr-1" />
                    AO VIVO
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription id="stream-config-description">
                Configure transmissão via OBS Studio, YouTube, Twitch ou Facebook para {tournamentName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!isOrganizer ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Apenas organizadores do torneio podem configurar transmissões externas.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="instructions">Como Usar</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4">
              {/* Plataforma */}
              <div className="space-y-2">
                <Label>Plataforma de Transmissão</Label>
                <Select
                  value={streamConfig.platform}
                  onValueChange={(value: any) => setStreamConfig(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-600" />
                        YouTube Live
                      </div>
                    </SelectItem>
                    <SelectItem value="twitch">
                      <div className="flex items-center gap-2">
                        <Twitch className="h-4 w-4 text-purple-600" />
                        Twitch
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook Live
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        URL Personalizada
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label>Título da Transmissão (Opcional)</Label>
                <Input
                  placeholder="Ex: Final do Campeonato - Jogo 1"
                  value={streamConfig.title || ''}
                  onChange={(e) => setStreamConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {streamConfig.platform !== 'custom' ? (
                <>
                  {/* Stream Key */}
                  <div className="space-y-2">
                    <Label>Chave de Transmissão (Stream Key)</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showStreamKey ? 'text' : 'password'}
                        placeholder="Cole a chave de transmissão aqui"
                        value={streamConfig.streamKey || ''}
                        onChange={(e) => setStreamConfig(prev => ({ ...prev, streamKey: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowStreamKey(!showStreamKey)}
                      >
                        👁️
                      </Button>
                      {streamConfig.streamKey && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(streamConfig.streamKey!, 'key')}
                        >
                          {copiedKey ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Mantenha sua chave em segredo! Não compartilhe com ninguém.
                    </p>
                  </div>

                  {/* URL do Embed */}
                  <div className="space-y-2">
                    <Label>URL do Player (para exibir no site)</Label>
                    <Input
                      placeholder="Ex: https://www.youtube.com/embed/SEU_VIDEO_ID"
                      value={streamConfig.embedUrl || ''}
                      onChange={(e) => setStreamConfig(prev => ({ ...prev, embedUrl: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Cole a URL de incorporação do vídeo para exibir no torneio
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label>URL do Embed / Player</Label>
                  <Textarea
                    placeholder="Cole aqui o código de incorporação (iframe) ou URL do player"
                    value={streamConfig.embedUrl || ''}
                    onChange={(e) => setStreamConfig(prev => ({ ...prev, embedUrl: e.target.value }))}
                    rows={4}
                  />
                </div>
              )}

              {/* Info Box */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Servidor RTMP {platformInfo.name}:</strong><br />
                  <code className="text-xs bg-muted px-2 py-1 rounded">{platformInfo.serverUrl || 'Configure na plataforma'}</code>
                  {platformInfo.serverUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(platformInfo.serverUrl, 'url')}
                    >
                      {copiedUrl ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  {platformInfo.icon}
                  <h3 className="font-semibold text-lg">{platformInfo.name}</h3>
                </div>

                <div className="space-y-2">
                  {platformInfo.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                      <p className="text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Dica profissional:</strong> Após configurar no OBS, você pode usar o botão "Iniciar Transmissão" 
                    abaixo para ativar o player no torneio e avisar os espectadores que a live começou!
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isOrganizer && streamConfig.streamKey && streamConfig.embedUrl && (
            <Button
              onClick={toggleLive}
              disabled={loading}
              variant={streamConfig.isLive ? "destructive" : "default"}
              className="w-full sm:w-auto"
            >
              {streamConfig.isLive ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Encerrar Transmissão
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Transmissão
                </>
              )}
            </Button>
          )}
          
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
            Cancelar
          </Button>
          
          {isOrganizer && (
            <Button onClick={saveStreamConfig} disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

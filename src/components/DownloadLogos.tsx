import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, Copy, Check } from "lucide-react";
import { toast } from "sonner@2.0.3";
import ballImage from "figma:asset/67bd6f31bc6e950b2dd7989fff8ddb235a0b77a2.png";

export default function DownloadLogos() {
  const [copiedLogo, setCopiedLogo] = useState<string | null>(null);

  const downloadImage = (type: 'horizontal' | 'completa' | 'icone') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = ballImage;

    img.onload = () => {
      if (type === 'horizontal') {
        // Logo Horizontal - 400x100px
        canvas.width = 400;
        canvas.height = 100;
        
        // Desenhar a bola
        ctx.save();
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 10, 10, 80, 80);
        ctx.restore();
        
        // Texto "Volley" - Azul
        ctx.font = "900 42px Arial, sans-serif";
        const volleyGradient = ctx.createLinearGradient(110, 0, 250, 0);
        volleyGradient.addColorStop(0, "#0066ff");
        volleyGradient.addColorStop(1, "#0052cc");
        ctx.fillStyle = volleyGradient;
        ctx.fillText("Volley", 110, 60);
        
        // Texto "Pro" - Laranja/Amarelo
        const proGradient = ctx.createLinearGradient(260, 0, 360, 0);
        proGradient.addColorStop(0, "#FFC72C");
        proGradient.addColorStop(1, "#ff6b35");
        ctx.fillStyle = proGradient;
        ctx.fillText("Pro", 260, 60);
        
      } else if (type === 'completa') {
        // Logo Completa - 320x360px
        canvas.width = 320;
        canvas.height = 360;
        
        // Desenhar a bola grande
        ctx.save();
        ctx.beginPath();
        ctx.arc(160, 90, 75, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 85, 15, 150, 150);
        ctx.restore();
        
        // Texto "Volley" - Azul
        ctx.font = "900 52px Arial, sans-serif";
        ctx.textAlign = "center";
        const volleyGradient = ctx.createLinearGradient(0, 0, 320, 0);
        volleyGradient.addColorStop(0, "#0066ff");
        volleyGradient.addColorStop(1, "#0052cc");
        ctx.fillStyle = volleyGradient;
        ctx.fillText("Volley", 160, 230);
        
        // Texto "Pro" - Laranja/Amarelo
        const proGradient = ctx.createLinearGradient(0, 0, 320, 0);
        proGradient.addColorStop(0, "#FFC72C");
        proGradient.addColorStop(1, "#ff6b35");
        ctx.fillStyle = proGradient;
        ctx.fillText("Pro", 160, 285);
        
        // Tagline
        ctx.font = "600 18px Arial, sans-serif";
        ctx.fillStyle = "#666";
        ctx.fillText("REDE SOCIAL DO VÔLEI", 160, 320);
        
      } else if (type === 'icone') {
        // Ícone - 200x200px - Apenas a bola
        canvas.width = 200;
        canvas.height = 200;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(100, 100, 85, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 15, 15, 170, 170);
        ctx.restore();
      }

      // Converter para PNG e baixar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `logo-volleypro-${type}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success(`✅ Logo baixada com sucesso!`);
        }
      }, 'image/png');
    };

    img.onerror = () => {
      toast.error("❌ Erro ao carregar a imagem da bola");
    };
  };

  const copyImageURL = (type: string) => {
    const url = `${window.location.origin}${ballImage}`;
    
    // Tentar usar clipboard API primeiro
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopiedLogo(type);
          toast.success(`✅ URL da imagem copiada!`);
          setTimeout(() => setCopiedLogo(null), 2000);
        })
        .catch(() => {
          // Fallback: criar textarea temporário
          copyToClipboardFallback(url, type);
        });
    } else {
      // Fallback para navegadores/ambientes sem clipboard API
      copyToClipboardFallback(url, type);
    }
  };

  const copyToClipboardFallback = (text: string, type: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedLogo(type);
        toast.success(`✅ URL da imagem copiada!`);
        setTimeout(() => setCopiedLogo(null), 2000);
      } else {
        toast.error(`❌ Não foi possível copiar. URL: ${text}`);
      }
    } catch (err) {
      toast.error(`❌ Não foi possível copiar. URL: ${text}`);
    }
    
    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🏐 Logos VolleyPro
          </h1>
          <p className="text-lg text-muted-foreground">
            Baixe as logos profissionais com a bola oficial do site
          </p>
        </div>

        {/* Alert de Instruções */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              💡 Como Usar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Download PNG:</strong> Clique em "Baixar PNG" para salvar a logo</p>
            <p>✅ <strong>Bola Original:</strong> Usa a mesma imagem do site oficial</p>
            <p>✅ <strong>Para Google Ads:</strong> Use a Logo Horizontal</p>
            <p>✅ <strong>Alta Qualidade:</strong> Imagens PNG prontas para uso profissional</p>
          </CardContent>
        </Card>

        {/* Logos Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Logo Horizontal */}
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                ➡️ Logo Horizontal
              </CardTitle>
              <CardDescription>
                ⭐ IDEAL PARA GOOGLE ADS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Preview - Renderiza a logo REAL */}
              <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center min-h-[180px]">
                <div className="flex items-center gap-3 scale-125">
                  <div className="relative flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                    <img 
                      src={ballImage} 
                      alt="VolleyPro" 
                      className="w-full h-full object-cover"
                      style={{ 
                        clipPath: 'circle(50% at 50% 50%)',
                        objectPosition: 'center'
                      }}
                    />
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-black tracking-tight" style={{ 
                      background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Volley
                    </span>
                    <span className="text-2xl font-black tracking-tight" style={{ 
                      background: 'linear-gradient(135deg, #FFC72C 0%, #ff6b35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Pro
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                <p>📏 Dimensão: 400x100px</p>
                <p>🏐 Bola idêntica ao site</p>
                <p>📦 Formato: PNG (alta qualidade)</p>
                <p>✨ Uso: Anúncios, email, redes sociais</p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => downloadImage('horizontal')}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                >
                  <Download className="h-4 w-4" />
                  Baixar PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyImageURL('horizontal')}
                  className="gap-2"
                >
                  {copiedLogo === "horizontal" ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar URL
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logo Completa */}
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                📄 Logo Completa
              </CardTitle>
              <CardDescription>
                Com tagline "Rede Social do Vôlei"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Preview - Renderiza a logo REAL */}
              <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center min-h-[280px]">
                <div className="flex flex-col items-center gap-3 scale-110">
                  <div className="relative flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                    <img 
                      src={ballImage} 
                      alt="VolleyPro - Rede Social do Vôlei" 
                      className="w-full h-full object-cover"
                      style={{ 
                        clipPath: 'circle(50% at 50% 50%)',
                        objectPosition: 'center'
                      }}
                    />
                  </div>
                  <div className="flex flex-col leading-none items-center">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-black tracking-tight" style={{ 
                        background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        Volley
                      </span>
                      <span className="text-3xl font-black tracking-tight" style={{ 
                        background: 'linear-gradient(135deg, #FFC72C 0%, #ff6b35 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        Pro
                      </span>
                    </div>
                    <span className="text-[11px] tracking-widest uppercase text-muted-foreground">
                      Rede Social do Vôlei
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                <p>📏 Dimensão: 320x360px</p>
                <p>🏐 Bola idêntica ao site</p>
                <p>📦 Formato: PNG (alta qualidade)</p>
                <p>✨ Uso: Site, apresentações, capas</p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => downloadImage('completa')}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                >
                  <Download className="h-4 w-4" />
                  Baixar PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyImageURL('completa')}
                  className="gap-2"
                >
                  {copiedLogo === "completa" ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar URL
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ícone */}
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                ⚪ Ícone / Avatar
              </CardTitle>
              <CardDescription>
                Apenas a bola do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Preview - Renderiza a bola REAL */}
              <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center min-h-[180px]">
                <div className="relative" style={{ width: '120px', height: '120px' }}>
                  <img 
                    src={ballImage} 
                    alt="VolleyPro" 
                    className="w-full h-full object-cover"
                    style={{ 
                      clipPath: 'circle(50% at 50% 50%)',
                      objectPosition: 'center'
                    }}
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                <p>📏 Dimensão: 200x200px</p>
                <p>🏐 Bola idêntica ao site</p>
                <p>📦 Formato: PNG (alta qualidade)</p>
                <p>✨ Uso: Avatar, favicon, ícone app</p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => downloadImage('icone')}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                >
                  <Download className="h-4 w-4" />
                  Baixar PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyImageURL('icone')}
                  className="gap-2"
                >
                  {copiedLogo === "icone" ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar URL
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nota */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ℹ️ Sobre as Logos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Bola Original:</strong> Usa exatamente a mesma imagem do site voleypro.net</p>
            <p>✅ <strong>Cores Oficiais:</strong> Gradientes azul (#0066ff → #0052cc) e laranja/amarelo (#FFC72C → #ff6b35)</p>
            <p>✅ <strong>Alta Qualidade:</strong> Exportadas em PNG para máxima compatibilidade</p>
            <p>✅ <strong>Prontas para Uso:</strong> Google Ads, redes sociais, impressão, apresentações</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
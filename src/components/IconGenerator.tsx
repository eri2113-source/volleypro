import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Download } from "lucide-react";

export function IconGenerator() {
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  useEffect(() => {
    // Gerar todos os ícones
    sizes.forEach(size => {
      generateIcon(size);
    });
  }, []);

  const generateIcon = (size: number) => {
    const canvas = canvasRefs.current[size];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradiente (azul VolleyPro)
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#0066ff');
    gradient.addColorStop(1, '#0052cc');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Bola de vôlei branca no centro
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.32;

    // Círculo branco
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Linhas da bola de vôlei (azul)
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = size * 0.02;

    // Linha vertical esquerda
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.quadraticCurveTo(
      centerX - radius * 0.4, centerY,
      centerX, centerY + radius
    );
    ctx.stroke();

    // Linha vertical direita
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.quadraticCurveTo(
      centerX + radius * 0.4, centerY,
      centerX, centerY + radius
    );
    ctx.stroke();

    // Linha horizontal superior
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.quadraticCurveTo(
      centerX, centerY - radius * 0.4,
      centerX + radius, centerY
    );
    ctx.stroke();

    // Linha horizontal inferior
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.quadraticCurveTo(
      centerX, centerY + radius * 0.4,
      centerX + radius, centerY
    );
    ctx.stroke();

    // Texto "VP" (apenas em ícones grandes)
    if (size >= 192) {
      ctx.fillStyle = '#0066ff';
      ctx.font = `bold ${size * 0.25}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VP', centerX, centerY);
    }
  };

  const downloadIcon = (size: number) => {
    const canvas = canvasRefs.current[size];
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `icon-${size}x${size}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const downloadAll = () => {
    sizes.forEach((size, index) => {
      setTimeout(() => {
        downloadIcon(size);
      }, index * 300); // Delay para não baixar tudo de uma vez
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎨 Gerador de Ícones PWA - VolleyPro
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Gere todos os ícones necessários para o PWA em um clique!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview dos ícones */}
        <div className="grid grid-cols-4 gap-4">
          {sizes.map(size => (
            <div key={size} className="space-y-2">
              <canvas
                ref={el => canvasRefs.current[size] = el}
                width={size}
                height={size}
                className="w-full border-2 border-primary/20 rounded-lg"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <div className="text-center space-y-1">
                <p className="text-xs font-medium">{size}x{size}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadIcon(size)}
                  className="w-full"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Botão para baixar tudo */}
        <div className="flex gap-3">
          <Button
            onClick={downloadAll}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Baixar Todos os Ícones (8 arquivos)
          </Button>
        </div>

        {/* Instruções */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            📋 Próximos Passos:
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Clique em "Baixar Todos os Ícones"</li>
            <li>Mova os 8 arquivos PNG para a pasta <code className="bg-background px-1 rounded">/public/</code></li>
            <li>Faça commit e push para o repositório</li>
            <li>Deploy automático ativará o PWA!</li>
          </ol>
        </div>

        {/* Checklist */}
        <div className="bg-card-blue rounded-lg p-4 space-y-2">
          <h3 className="font-semibold flex items-center gap-2 text-primary">
            ✅ Arquivos Necessários:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {sizes.map(size => (
              <div key={size} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <code className="text-xs">icon-{size}x{size}.png</code>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

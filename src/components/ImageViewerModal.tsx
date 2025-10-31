import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface ImageViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt?: string;
}

export function ImageViewerModal({ 
  open, 
  onOpenChange, 
  imageUrl, 
  alt = "Imagem" 
}: ImageViewerModalProps) {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = alt || 'imagem-volleypro.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 50));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none" aria-describedby="image-viewer-description">
        {/* Accessibility - Hidden but present */}
        <DialogHeader className="sr-only">
          <DialogTitle>Visualizar Imagem</DialogTitle>
          <DialogDescription id="image-viewer-description">
            Use os controles de zoom e download para interagir com a imagem
          </DialogDescription>
        </DialogHeader>
        
        {/* Header com controles */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleZoomOut}
            size="icon"
            variant="ghost"
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handleZoomIn}
            size="icon"
            variant="ghost"
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleDownload}
            size="icon"
            variant="ghost"
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <Download className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            size="icon"
            variant="ghost"
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Indicador de zoom */}
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {zoom}%
        </div>

        {/* Imagem */}
        <div className="flex items-center justify-center min-h-[95vh] p-8 overflow-auto">
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full h-auto object-contain transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100})`,
              cursor: zoom > 100 ? 'move' : 'default'
            }}
            onClick={(e) => {
              // Impedir que clique na imagem feche o modal
              e.stopPropagation();
            }}
          />
        </div>

        {/* Instruções */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded text-sm">
          Clique fora da imagem para fechar
        </div>
      </DialogContent>
    </Dialog>
  );
}

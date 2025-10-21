import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Camera, Heart, MessageSquare, Share2, Download, Eye, Upload, Grid3x3, List } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Photo {
  id: number;
  url: string;
  caption: string;
  author: {
    name: string;
    avatar?: string;
    type: "athlete" | "team" | "fan";
  };
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  tags: string[];
}

// Array vazio - fotos virão do backend/upload real dos usuários
const mockPhotos: Photo[] = [];

export function Photos() {
  const [photos] = useState<Photo[]>(mockPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "athletes" | "teams">("all");

  const filteredPhotos = photos.filter(photo => {
    if (filter === "all") return true;
    if (filter === "athletes") return photo.author.type === "athlete";
    if (filter === "teams") return photo.author.type === "team";
    return true;
  });

  const handleLike = (photoId: number) => {
    console.log("Curtir foto:", photoId);
    // Implementar lógica de curtida
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-primary" />
            Fotos
          </h1>
          <p className="text-muted-foreground mt-1">
            Galeria de fotos da comunidade VolleyPro
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Todas ({photos.length})
        </Button>
        <Button
          variant={filter === "athletes" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("athletes")}
        >
          Atletas ({photos.filter(p => p.author.type === "athlete").length})
        </Button>
        <Button
          variant={filter === "teams" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("teams")}
        >
          Times ({photos.filter(p => p.author.type === "team").length})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="h-6 w-6 mx-auto text-primary mb-1" />
            <div className="text-xl font-bold">{photos.length}</div>
            <div className="text-xs text-muted-foreground">Fotos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto text-red-500 mb-1" />
            <div className="text-xl font-bold">
              {photos.reduce((acc, p) => acc + p.likes, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Curtidas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto text-blue-500 mb-1" />
            <div className="text-xl font-bold">
              {photos.reduce((acc, p) => acc + p.comments, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Comentários</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 mx-auto text-green-500 mb-1" />
            <div className="text-xl font-bold">
              {photos.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Visualizações</div>
          </CardContent>
        </Card>
      </div>

      {/* Photos Grid/List */}
      {filteredPhotos.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Nenhuma foto ainda</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "Seja o primeiro a compartilhar uma foto!" 
                  : `Nenhuma foto de ${filter === "athletes" ? "atletas" : "times"} ainda.`
                }
              </p>
            </div>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Fazer Upload de Foto
            </Button>
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map(photo => (
            <Card
              key={photo.id}
              className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative aspect-square">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {photo.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {photo.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {photo.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPhotos.map(photo => (
            <Card key={photo.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={photo.author.avatar} />
                          <AvatarFallback>
                            {photo.author.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{photo.author.name}</div>
                          <div className="text-xs text-muted-foreground">{photo.createdAt}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {photo.author.type === "athlete" ? "🏐 Atleta" : "⚡ Time"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm">{photo.caption}</p>
                    
                    <div className="flex gap-2">
                      {photo.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(photo.id)}>
                        <Heart className="h-4 w-4 mr-1" />
                        {photo.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {photo.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {photo.views}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0" aria-describedby="photo-detail-description">
          <DialogHeader className="sr-only">
            <DialogTitle>Detalhes da Foto</DialogTitle>
            <DialogDescription id="photo-detail-description">
              Visualização detalhada da foto
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="grid md:grid-cols-2">
              <div className="bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedPhoto.author.avatar} />
                    <AvatarFallback>
                      {selectedPhoto.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedPhoto.author.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPhoto.createdAt}</p>
                  </div>
                </div>

                <p>{selectedPhoto.caption}</p>

                <div className="flex gap-2">
                  {selectedPhoto.tags.map(tag => (
                    <Badge key={tag} variant="outline">#{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-around py-4 border-y">
                  <div className="text-center">
                    <div className="font-bold">{selectedPhoto.likes}</div>
                    <div className="text-xs text-muted-foreground">Curtidas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{selectedPhoto.comments}</div>
                    <div className="text-xs text-muted-foreground">Comentários</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{selectedPhoto.views}</div>
                    <div className="text-xs text-muted-foreground">Visualizações</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleLike(selectedPhoto.id)}>
                    <Heart className="h-4 w-4 mr-2" />
                    Curtir
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comentar
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
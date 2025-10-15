import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Video, Play, Heart, MessageSquare, Share2, Eye, Upload, Clock, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface VideoItem {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  author: {
    name: string;
    avatar?: string;
    type: "athlete" | "team" | "fan";
  };
  views: number;
  likes: number;
  comments: number;
  uploadedAt: string;
  category: string;
}

const mockVideos: VideoItem[] = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    title: "Melhores Saques do Campeonato 2024",
    description: "Compilação dos saques mais potentes e efetivos da temporada",
    duration: "8:45",
    author: {
      name: "VolleyPro Oficial",
      avatar: "https://i.pravatar.cc/150?img=50",
      type: "team"
    },
    views: 12543,
    likes: 892,
    comments: 143,
    uploadedAt: "2 horas atrás",
    category: "Highlights"
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=800",
    title: "Tutorial: Como Melhorar o Bloqueio",
    description: "Técnicas avançadas para aperfeiçoar seu bloqueio no vôlei",
    duration: "12:30",
    author: {
      name: "João Silva",
      avatar: "https://i.pravatar.cc/150?img=12",
      type: "athlete"
    },
    views: 8234,
    likes: 654,
    comments: 89,
    uploadedAt: "1 dia atrás",
    category: "Tutorial"
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800",
    title: "Final Emocionante - Time A vs Time B",
    description: "Reviva todos os momentos da grande final do campeonato estadual",
    duration: "45:20",
    author: {
      name: "Time Vôlei SP",
      avatar: "https://i.pravatar.cc/150?img=20",
      type: "team"
    },
    views: 25678,
    likes: 2134,
    comments: 567,
    uploadedAt: "3 dias atrás",
    category: "Partidas"
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800",
    title: "Treino de Defesa - Exercícios Práticos",
    description: "Rotina completa de treino focada em defesa e recepção",
    duration: "15:00",
    author: {
      name: "Maria Santos",
      avatar: "https://i.pravatar.cc/150?img=25",
      type: "athlete"
    },
    views: 5432,
    likes: 423,
    comments: 67,
    uploadedAt: "5 dias atrás",
    category: "Treino"
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
    title: "Análise Tática: Sistemas de Jogo",
    description: "Entenda os principais sistemas táticos utilizados no vôlei profissional",
    duration: "20:15",
    author: {
      name: "Carlos Técnico",
      avatar: "https://i.pravatar.cc/150?img=35",
      type: "team"
    },
    views: 3456,
    likes: 289,
    comments: 45,
    uploadedAt: "1 semana atrás",
    category: "Análise"
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=60",
    title: "Aquecimento Pré-Jogo Completo",
    description: "Sequência ideal de aquecimento antes das partidas",
    duration: "10:00",
    author: {
      name: "Pedro Costa",
      avatar: "https://i.pravatar.cc/150?img=15",
      type: "athlete"
    },
    views: 4567,
    likes: 345,
    comments: 34,
    uploadedAt: "1 semana atrás",
    category: "Treino"
  }
];

const categories = ["Todos", "Highlights", "Tutorial", "Partidas", "Treino", "Análise"];

export function Videos() {
  const [videos] = useState<VideoItem[]>(mockVideos);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredVideos = selectedCategory === "Todos"
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <Video className="h-8 w-8 text-primary" />
            Vídeos
          </h1>
          <p className="text-muted-foreground mt-1">
            Aprenda, reviva e compartilhe os melhores momentos do vôlei
          </p>
        </div>

        <Button className="bg-gradient-to-r from-primary to-[#0052cc]">
          <Upload className="h-4 w-4 mr-2" />
          Upload Vídeo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Video className="h-6 w-6 mx-auto text-primary mb-1" />
            <div className="text-xl font-bold">{videos.length}</div>
            <div className="text-xs text-muted-foreground">Vídeos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 mx-auto text-blue-500 mb-1" />
            <div className="text-xl font-bold">
              {videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Visualizações</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 mx-auto text-red-500 mb-1" />
            <div className="text-xl font-bold">
              {videos.reduce((acc, v) => acc + v.likes, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Curtidas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto text-green-500 mb-1" />
            <div className="text-xl font-bold">
              {videos.reduce((acc, v) => acc + v.comments, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Comentários</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <Card key={video.id} className="overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
            <div className="relative">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">{video.category}</Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={video.author.avatar} />
                    <AvatarFallback>
                      {video.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{video.author.name}</div>
                    <div className="text-xs text-muted-foreground">{video.uploadedAt}</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {video.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {video.comments}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Curtir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Trending Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-secondary" />
          <h2 className="text-2xl font-bold">Em Alta</h2>
        </div>
        
        <div className="space-y-4">
          {videos
            .sort((a, b) => b.views - a.views)
            .slice(0, 3)
            .map((video, index) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold flex-shrink-0">
                      #{index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/80 rounded-full p-2">
                          <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={video.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {video.author.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{video.author.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {video.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {video.uploadedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

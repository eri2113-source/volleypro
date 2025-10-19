import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { tournamentApi } from "../lib/api";
import { toast } from "sonner@2.0.3";

interface CreateTournamentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTournamentModal({ open, onClose, onSuccess }: CreateTournamentModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxTeams, setMaxTeams] = useState("16");
  const [format, setFormat] = useState<'single_elimination' | 'round_robin'>("single_elimination");

  const handleCreate = async () => {
    if (!name || !location || !startDate || !endDate) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await tournamentApi.createTournament({
        name,
        location,
        startDate,
        endDate,
        maxTeams: parseInt(maxTeams),
        format,
      });

      toast.success("🏆 Torneio criado com sucesso!");
      onSuccess();
      onClose();
      
      // Reset form
      setName("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setMaxTeams("16");
    } catch (error: any) {
      console.error("Error creating tournament:", error);
      toast.error(error.message || "Erro ao criar torneio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="create-tournament-description">
        <DialogHeader>
          <DialogTitle>Criar Novo Torneio</DialogTitle>
          <DialogDescription id="create-tournament-description">
            Organize um torneio e convide times para participar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tournament-name">Nome do Torneio</Label>
            <Input
              id="tournament-name"
              placeholder="Ex: Copa VolleyPro 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tournament-location">Local</Label>
            <Input
              id="tournament-location"
              placeholder="Ex: São Paulo, SP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data de Início</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Data de Término</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-teams">Número Máximo de Times</Label>
            <Input
              id="max-teams"
              type="number"
              min="4"
              max="64"
              value={maxTeams}
              onChange={(e) => setMaxTeams(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Formato do Torneio</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_elimination">🏆 Eliminação Simples</SelectItem>
                <SelectItem value="round_robin">🔄 Todos contra Todos</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {format === 'single_elimination' 
                ? '⚡ Bracket estilo playoff - quem perde está eliminado'
                : '🔄 Cada time joga contra todos os outros'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Criando..." : "Criar Torneio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [arena, setArena] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxTeams, setMaxTeams] = useState("16");
  const [format, setFormat] = useState<'single_elimination' | 'round_robin' | 'double_elimination' | 'swiss'>("single_elimination");
  const [modalityType, setModalityType] = useState<'indoor' | 'beach'>("indoor");

  const handleCreate = async () => {
    if (!name || !location || !startDate || !endDate) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Para vôlei de praia, arena é obrigatória
    if (modalityType === 'beach' && !arena) {
      toast.error("Preencha o campo Arena para torneios de vôlei de praia");
      return;
    }

    setLoading(true);
    try {
      await tournamentApi.createTournament({
        name,
        location,
        arena: modalityType === 'beach' ? arena : undefined,
        startDate,
        endDate,
        maxTeams: parseInt(maxTeams),
        format,
        modalityType,
      });

      toast.success("🏆 Torneio criado com sucesso!");
      onSuccess();
      onClose();
      
      // Reset form
      setName("");
      setLocation("");
      setArena("");
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
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col" aria-describedby="create-tournament-description">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Criar Novo Torneio</DialogTitle>
          <DialogDescription id="create-tournament-description">
            {modalityType === 'beach' 
              ? 'Organize um torneio de vôlei de praia com inscrições individuais'
              : 'Organize um torneio de vôlei de quadra e convide times para participar'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          {/* Tipo de Modalidade */}
          <div className="space-y-2">
            <Label htmlFor="modality-type">Modalidade</Label>
            <Select value={modalityType} onValueChange={(v: any) => setModalityType(v)}>
              <SelectTrigger id="modality-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indoor">🏐 Vôlei de Quadra (Times)</SelectItem>
                <SelectItem value="beach">🏖️ Vôlei de Praia (Duplas/Individual)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {modalityType === 'beach' 
                ? '🏖️ Inscrições individuais - qualquer usuário pode participar'
                : '🏐 Inscrições por times - apenas times podem se inscrever'
              }
            </p>
          </div>

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

          {/* Campo Arena - apenas para vôlei de praia */}
          {modalityType === 'beach' && (
            <div className="space-y-2">
              <Label htmlFor="tournament-arena">
                Arena <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tournament-arena"
                placeholder="Ex: Arena Beach Park, Praia de Copacabana"
                value={arena}
                onChange={(e) => setArena(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                🏖️ Nome da arena ou praia onde o torneio será disputado
              </p>
            </div>
          )}

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
            <Label htmlFor="max-teams">
              {modalityType === 'beach' ? 'Número Máximo de Duplas' : 'Número Máximo de Times'}
            </Label>
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
            <Label htmlFor="format">Formato do Torneio (Chaveamento)</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_elimination">🏆 Eliminação Simples</SelectItem>
                <SelectItem value="double_elimination">💪 Eliminação Dupla (Repescagem)</SelectItem>
                <SelectItem value="round_robin">🔄 Todos contra Todos</SelectItem>
                <SelectItem value="swiss">♟️ Sistema Suíço</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {format === 'single_elimination' && '⚡ Bracket estilo playoff - quem perde está eliminado'}
              {format === 'double_elimination' && '💪 Segunda chance - chave de perdedores'}
              {format === 'round_robin' && '🔄 Cada participante joga contra todos os outros'}
              {format === 'swiss' && '♟️ Pareamentos baseados em performance - sem eliminação'}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={loading || !name || !location || !startDate || !endDate || (modalityType === 'beach' && !arena)}
          >
            {loading ? "Criando..." : "Criar Torneio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

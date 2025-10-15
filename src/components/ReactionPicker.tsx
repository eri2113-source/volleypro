import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

export interface Reaction {
  emoji: string;
  label: string;
  color: string;
}

export const VOLLEYBALL_REACTIONS: Reaction[] = [
  { emoji: "🏐", label: "Vôlei", color: "#0066ff" },
  { emoji: "⚡", label: "Ataque", color: "#fbbf24" },
  { emoji: "🔥", label: "Pegou Fogo", color: "#ef4444" },
  { emoji: "💪", label: "Força", color: "#8b5cf6" },
  { emoji: "🙌", label: "Levantada", color: "#22c55e" },
  { emoji: "🎯", label: "Precisão", color: "#ec4899" },
  { emoji: "🏆", label: "MVP", color: "#f59e0b" },
  { emoji: "❤️", label: "Emoção", color: "#dc2626" },
];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, isOpen, onClose }: ReactionPickerProps) {
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop invisível para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          
          {/* Picker de reações */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-2 z-50"
          >
            <div className="bg-card border border-border rounded-full shadow-2xl px-2 py-2 flex items-center gap-1">
              {VOLLEYBALL_REACTIONS.map((reaction) => (
                <motion.button
                  key={reaction.emoji}
                  onClick={() => handleSelect(reaction.emoji)}
                  onMouseEnter={() => setHoveredReaction(reaction.emoji)}
                  onMouseLeave={() => setHoveredReaction(null)}
                  className="relative flex flex-col items-center group"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors">
                    <span className="text-2xl">{reaction.emoji}</span>
                  </div>
                  
                  {/* Tooltip com o nome da reação */}
                  <AnimatePresence>
                    {hoveredReaction === reaction.emoji && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-10 whitespace-nowrap bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg"
                      >
                        {reaction.label}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 bg-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ReactionDisplayProps {
  reactions: { [emoji: string]: number };
  userReaction?: string;
  onReactionClick: (emoji: string) => void;
  compact?: boolean;
}

export function ReactionDisplay({ reactions, userReaction, onReactionClick, compact = false }: ReactionDisplayProps) {
  if (Object.keys(reactions).length === 0) {
    return null;
  }

  const sortedReactions = Object.entries(reactions)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  if (sortedReactions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {sortedReactions.map(([emoji, count]) => {
        const isUserReaction = userReaction === emoji;
        const reactionData = VOLLEYBALL_REACTIONS.find(r => r.emoji === emoji);
        
        return (
          <motion.button
            key={emoji}
            onClick={() => onReactionClick(emoji)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
              transition-all duration-200
              ${isUserReaction 
                ? 'bg-primary/20 border border-primary/50 text-primary' 
                : 'bg-muted/50 hover:bg-muted border border-transparent text-muted-foreground hover:text-foreground'
              }
            `}
            style={isUserReaction && reactionData ? {
              borderColor: reactionData.color + '80',
              backgroundColor: reactionData.color + '20',
            } : {}}
          >
            <span className={compact ? "text-base" : "text-sm"}>{emoji}</span>
            <span className="font-medium">{count}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

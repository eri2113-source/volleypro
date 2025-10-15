import { motion } from "motion/react";
import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center z-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center justify-center mb-6"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Logo variant="icon" className="w-24 h-24 drop-shadow-2xl" />
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-4xl font-black text-white tracking-tight">
            Volley
          </span>
          <span className="text-4xl font-black text-[#FFC72C] tracking-tight">
            Pro
          </span>
        </motion.div>
        
        <motion.p
          className="text-white/90 mt-4 text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Carregando a rede social do vôlei...
        </motion.p>
        
        <motion.div
          className="mt-6 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

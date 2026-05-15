import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootScreenProps {
  onComplete: () => void;
}

const bootLines = [
  { text: "SUBHAM OS v2.0.26 — INITIALIZING NEURAL CORE...", delay: 0 },
  { text: "> Establishing secure connection...", delay: 300 },
  { text: "> Loading AI modules... [████████████] 100%", delay: 600 },
  { text: "> TensorFlow Runtime........... LOADED", delay: 900 },
  { text: "> LangChain Orchestrator........ LOADED", delay: 1100 },
  { text: "> Neural network initialization. COMPLETE", delay: 1300 },
  { text: "> MLOps pipeline................ CONNECTED", delay: 1500 },
  { text: "> Security protocols............ ACTIVE", delay: 1700 },
  { text: "> ChromaDB Vector Store......... ONLINE", delay: 1900 },
  { text: "> Threat intelligence feed...... STREAMING", delay: 2100 },
  { text: "> LLM nodes..................... SYNCHRONIZED", delay: 2300 },
  { text: "", delay: 2500 },
  { text: "██ SYSTEM ONLINE — WELCOME TO SUBHAM OS ██", delay: 2700, highlight: true },
];

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    bootLines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        setProgress(Math.round(((i + 1) / bootLines.length) * 100));
      }, line.delay);
    });
    setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 800);
    }, 3400);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 bg-[#050508] flex flex-col items-center justify-center p-8"
        >
          <div className="scanline absolute inset-0 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="text-[#00f5ff] text-xs terminal-text tracking-[0.3em] mb-2 flicker">
              CLASSIFIED — TOP SECRET
            </div>
            <div
              className="text-4xl font-bold glow-cyan"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              SUBHAM OS
            </div>
            <div className="text-[#00f5ff]/60 text-xs terminal-text mt-1 tracking-widest">
              AI SECURITY COMMAND CENTER v2.0.26
            </div>
          </motion.div>

          <div
            className="w-full max-w-2xl border border-[#00f5ff]/20 rounded bg-black/40 backdrop-blur p-6"
            style={{ boxShadow: "0 0 30px rgba(0, 245, 255, 0.1)" }}
          >
            <div className="space-y-1 min-h-[280px]">
              {bootLines.map((line, i) => (
                <AnimatePresence key={i}>
                  {visibleLines.includes(i) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`terminal-text text-sm ${
                        line.highlight
                          ? "text-[#00f5ff] glow-cyan font-bold text-center py-2"
                          : "text-[#00f5ff]/80"
                      }`}
                    >
                      {line.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[10px] terminal-text text-[#00f5ff]/60 mb-1">
                <span>SYSTEM INITIALIZATION</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-[#00f5ff]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00f5ff] rounded-full"
                  style={{ boxShadow: "0 0 10px #00f5ff" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-6">
            {["AI CORE", "SECURITY", "MLOPS", "NEURAL NET"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: Math.random() * 2 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
                />
                <span className="terminal-text text-[10px] text-[#00ff88]/70 tracking-widest">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

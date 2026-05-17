import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

type ProjectId = string;

const WORLD_THEMES: Record<string, {
  title: string;
  subtitle: string;
  environment: string;
  color: string;
  bgColor: string;
  elements: string[];
  ambientLines: number;
}> = {
  "neo-stats": {
    title: "KNOWLEDGE GALAXY",
    subtitle: "Multi-LLM Intelligence Cosmos",
    environment: "AI KNOWLEDGE UNIVERSE",
    color: "#00f5ff",
    bgColor: "radial-gradient(ellipse at center, #000820 0%, #050508 100%)",
    elements: ["VECTOR CLUSTER", "LLM ROUTING", "RAG PIPELINE", "MEMORY STORE"],
    ambientLines: 40,
  },
  "ai-nids": {
    title: "CYBER WAR ROOM",
    subtitle: "Network Intrusion Detection Center",
    environment: "SECURITY OPERATIONS CENTER",
    color: "#ff4444",
    bgColor: "radial-gradient(ellipse at center, #200505 0%, #050508 100%)",
    elements: ["THREAT RADAR", "ANOMALY ENGINE", "PACKET STREAM", "DEFENSE GRID"],
    ambientLines: 30,
  },
  "healthcare-agent": {
    title: "MEDICAL LABORATORY",
    subtitle: "Multimodal AI Diagnostic Chamber",
    environment: "CLINICAL AI ENVIRONMENT",
    color: "#00ff88",
    bgColor: "radial-gradient(ellipse at center, #002510 0%, #050508 100%)",
    elements: ["DIAGNOSTICS", "IMAGING AI", "CLINICAL DB", "GROQ ENGINE"],
    ambientLines: 25,
  },
  "nova-assistant": {
    title: "COGNITION CHAMBER",
    subtitle: "Voice Neural Architecture Space",
    environment: "SPEECH INTELLIGENCE LAYER",
    color: "#8b5cf6",
    bgColor: "radial-gradient(ellipse at center, #0d0520 0%, #050508 100%)",
    elements: ["SPEECH ENGINE", "NLU CORE", "INTENT MATRIX", "TTS OUTPUT"],
    ambientLines: 35,
  },
  "pii-detector": {
    title: "SECURE VAULT",
    subtitle: "Privacy Intelligence Compliance Zone",
    environment: "DATA PROTECTION ENVIRONMENT",
    color: "#00e5ff",
    bgColor: "radial-gradient(ellipse at center, #001825 0%, #050508 100%)",
    elements: ["ENCRYPT LAYER", "PII SCANNER", "REDACT ENGINE", "AUDIT TRAIL"],
    ambientLines: 20,
  },
};

function WorldCanvas({ color, ambientLines }: { color: string; ambientLines: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number }> = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        life: Math.random() * 200, maxLife: 200 + Math.random() * 200,
      });
    }

    let frame = 0;
    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random() * W; p.y = Math.random() * H;
          p.vx = (Math.random() - 0.5) * 0.6; p.vy = (Math.random() - 0.5) * 0.6;
          p.life = 0; p.maxLife = 200 + Math.random() * 200;
        }
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      if (frame % 60 === 0) {
        const x1 = Math.random() * W, y1 = Math.random() * H;
        const x2 = Math.random() * W, y2 = Math.random() * H;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = color + "18";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [color]);

  return <canvas ref={canvasRef} width={800} height={500} className="absolute inset-0 w-full h-full opacity-40" style={{ pointerEvents: "none" }} />;
}

interface ProjectWorldModalProps {
  projectId: ProjectId | null;
  onClose: () => void;
}

export function ProjectWorldModal({ projectId, onClose }: ProjectWorldModalProps) {
  const project = PORTFOLIO_DATA.projects.find((p) => p.id === projectId);
  const theme = projectId ? (WORLD_THEMES[projectId] || {
    title: `${project?.name?.toUpperCase()} WORLD`,
    subtitle: project?.tagline || "",
    environment: project?.category || "AI ENVIRONMENT",
    color: project?.color || "#00f5ff",
    bgColor: "radial-gradient(ellipse at center, #020210 0%, #050508 100%)",
    elements: project?.tech?.slice(0, 4) || [],
    ambientLines: 30,
  }) : null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && theme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: theme.bgColor }}
          onClick={onClose}
        >
          <WorldCanvas color={theme.color} ambientLines={theme.ambientLines} />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(5,5,8,0.6) 100%)" }}
          />

          <div className="relative z-10 flex flex-col h-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ background: theme.color }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="terminal-text text-xs tracking-widest" style={{ color: `${theme.color}80` }}>
                  {theme.environment} — IMMERSIVE MODE
                </div>
              </div>
              <button
                onClick={onClose}
                className="terminal-text text-sm px-4 py-2 rounded border transition-all hover:bg-white/5"
                style={{ color: theme.color, borderColor: `${theme.color}40` }}
              >
                EXIT WORLD [ESC]
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-6"
              >
                <div className="terminal-text text-xs tracking-[0.5em] mb-2" style={{ color: `${theme.color}50` }}>
                  {project.category}
                </div>
                <h1
                  className="text-5xl md:text-7xl font-black mb-3"
                  style={{ fontFamily: "Orbitron, sans-serif", color: theme.color, textShadow: `0 0 60px ${theme.color}60` }}
                >
                  {theme.title}
                </h1>
                <div className="text-white/50 text-lg">{theme.subtitle}</div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 text-base leading-relaxed max-w-2xl mb-8"
              >
                {project.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 justify-center mb-8"
              >
                {theme.elements.map((el, i) => (
                  <motion.div
                    key={el}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
                    className="px-4 py-2 rounded-lg terminal-text text-xs tracking-widest"
                    style={{
                      background: `${theme.color}12`,
                      border: `1px solid ${theme.color}40`,
                      color: theme.color,
                      boxShadow: `0 0 20px ${theme.color}15`,
                    }}
                  >
                    {el}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-2 justify-center mb-8"
              >
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="terminal-text text-[10px] px-2 py-1 rounded"
                    style={{ background: `${theme.color}08`, border: `1px solid ${theme.color}20`, color: `${theme.color}80` }}
                  >
                    {t}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-text text-sm px-6 py-3 rounded border transition-all hover:bg-white/5 inline-block"
                  style={{ color: theme.color, borderColor: `${theme.color}60`, background: `${theme.color}10` }}
                >
                  &lt;/&gt; VIEW ON GITHUB
                </a>
              </motion.div>
            </div>

            <div className="flex justify-center gap-2 pb-4">
              {project.features.slice(0, 4).map((f) => (
                <div key={f} className="terminal-text text-[9px] text-white/20 px-2">{f.slice(0, 20)}...</div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

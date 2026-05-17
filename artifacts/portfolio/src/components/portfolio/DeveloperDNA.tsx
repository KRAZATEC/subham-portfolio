import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const TRAITS = [
  { label: "AI-FIRST THINKING", detail: "Every system designed with AI augmentation as a first principle", color: "#8b5cf6" },
  { label: "SECURITY-ORIENTED", detail: "Zero-trust architecture, threat modeling from day one", color: "#ff4444" },
  { label: "CLOUD-NATIVE", detail: "Infrastructure as code, containerization, auto-scaling by default", color: "#ff8c00" },
  { label: "DATA-DRIVEN", detail: "Evidence-based decisions, metrics-first engineering culture", color: "#00f5ff" },
  { label: "SCALABLE BY DESIGN", detail: "Horizontal scaling, distributed systems thinking always", color: "#00ff88" },
  { label: "MLOPS MINDSET", detail: "Models are software — CI/CD, testing, monitoring included", color: "#00e5ff" },
  { label: "RAPID PROTOTYPER", detail: "From concept to deployed POC in hours, not weeks", color: "#ff006e" },
  { label: "SYSTEM THINKER", detail: "End-to-end ownership — infra, model, API, UI, observability", color: "#8b5cf6" },
];

const PHILOSOPHY = [
  { label: "BUILD FOR PROD", sub: "Not just demos", color: "#00f5ff" },
  { label: "OWN THE STACK", sub: "Full vertical ownership", color: "#8b5cf6" },
  { label: "AUTOMATE FIRST", sub: "Humans for decisions, not tasks", color: "#00ff88" },
  { label: "SECURITY = FEATURE", sub: "Not an afterthought", color: "#ff4444" },
];

function DNACanvas({ width, height, active }: { width: number; height: number; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!active) return;

      frameRef.current++;
      const t = frameRef.current * 0.03;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const amplitude = width * 0.22;
      const frequency = (2 * Math.PI) / (height / 3);
      const COLORS_A = ["#00f5ff", "#8b5cf6", "#00ff88", "#ff8c00", "#ff4444"];
      const COLORS_B = ["#8b5cf6", "#00ff88", "#ff8c00", "#ff4444", "#00f5ff"];

      // Draw rungs first (behind strands)
      const rungSpacing = 20;
      for (let y = 0; y <= height; y += rungSpacing) {
        const progress = y / height;
        const colorIdx = Math.floor(progress * COLORS_A.length);
        const col = COLORS_A[colorIdx % COLORS_A.length];
        const x1 = cx + Math.sin(y * frequency + t) * amplitude;
        const x2 = cx + Math.sin(y * frequency + t + Math.PI) * amplitude;
        const alpha = 0.3 + Math.abs(Math.sin(y * frequency + t)) * 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = col + Math.round(alpha * 160).toString(16).padStart(2, "0");
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rung dots
        ctx.beginPath();
        ctx.arc(x1, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = col + "cc";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x2, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = col + "cc";
        ctx.fill();
      }

      // Draw strand A
      ctx.beginPath();
      for (let y = 0; y <= height; y += 2) {
        const x = cx + Math.sin(y * frequency + t) * amplitude;
        if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const gradA = ctx.createLinearGradient(0, 0, 0, height);
      COLORS_A.forEach((c, i) => gradA.addColorStop(i / (COLORS_A.length - 1), c + "cc"));
      ctx.strokeStyle = gradA;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw strand B
      ctx.beginPath();
      for (let y = 0; y <= height; y += 2) {
        const x = cx + Math.sin(y * frequency + t + Math.PI) * amplitude;
        if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const gradB = ctx.createLinearGradient(0, 0, 0, height);
      COLORS_B.forEach((c, i) => gradB.addColorStop(i / (COLORS_B.length - 1), c + "cc"));
      ctx.strokeStyle = gradB;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height, active]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded"
      style={{ filter: "blur(0px)" }}
    />
  );
}

export function DeveloperDNA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const helixRef = useRef<HTMLDivElement>(null);

  return (
    <section id="developer-dna" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#8b5cf6]/40 text-xs tracking-[0.4em] mb-3">
            &gt; SEQUENCING DEVELOPER DNA...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            DEVELOPER <span className="text-[#8b5cf6]" style={{ textShadow: "0 0 20px #8b5cf644" }}>DNA</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            ENGINEERING PHILOSOPHY & MINDSET ARCHITECTURE
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            {TRAITS.slice(0, 4).map((trait, i) => (
              <motion.div
                key={trait.label}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-3 rounded-lg"
                style={{ background: `${trait.color}08`, border: `1px solid ${trait.color}25` }}
              >
                <div className="terminal-text text-[9px] font-bold tracking-widest mb-1" style={{ color: trait.color }}>
                  ▸ {trait.label}
                </div>
                <div className="text-white/40 text-[10px] leading-snug">{trait.detail}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <motion.div
              ref={helixRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="relative w-full max-w-[160px]"
              style={{ height: 400 }}
            >
              <DNACanvas width={160} height={400} active={inView} />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.8) 100%)",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <div className="terminal-text text-[10px] text-[#8b5cf6]/60 tracking-widest mb-1">GENOME ID</div>
              <div className="terminal-text text-xs text-white/50">KRAZATEC-AI-v2.0.26</div>
            </motion.div>
          </div>

          <div className="space-y-3">
            {TRAITS.slice(4).map((trait, i) => (
              <motion.div
                key={trait.label}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-3 rounded-lg"
                style={{ background: `${trait.color}08`, border: `1px solid ${trait.color}25` }}
              >
                <div className="terminal-text text-[9px] font-bold tracking-widest mb-1" style={{ color: trait.color }}>
                  ▸ {trait.label}
                </div>
                <div className="text-white/40 text-[10px] leading-snug">{trait.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <div className="terminal-text text-[10px] text-white/30 tracking-widest mb-4 text-center">ENGINEERING PHILOSOPHY</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PHILOSOPHY.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="p-4 rounded-lg text-center hologram"
                style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}
              >
                <div
                  className="terminal-text text-[10px] font-bold tracking-widest mb-1"
                  style={{ color: p.color, fontFamily: "Orbitron, sans-serif", fontSize: 10 }}
                >
                  {p.label}
                </div>
                <div className="terminal-text text-[9px] text-white/30">{p.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const TWO_PI = Math.PI * 2;

const PROJECT_NODES = PORTFOLIO_DATA.projects.map((p, i) => {
  const angle = (i / PORTFOLIO_DATA.projects.length) * TWO_PI - Math.PI / 2;
  const rx = 0.38;
  const ry = 0.28;
  return {
    ...p,
    cx: 0.5 + Math.cos(angle) * rx,
    cy: 0.5 + Math.sin(angle) * ry,
    angle,
  };
});

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  nodeIdx: number;
}

function NeuralCanvas({
  selectedId,
  width,
  height,
}: {
  selectedId: string | null;
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const spawnParticle = useCallback((nodeIdx: number) => {
    const node = PROJECT_NODES[nodeIdx];
    particles.current.push({
      x: node.cx * width,
      y: node.cy * height,
      vx: (0.5 - node.cx) * 2.5,
      vy: (0.5 - node.cy) * 2.5,
      life: 0,
      maxLife: 60 + Math.random() * 30,
      nodeIdx,
    });
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      frame++;
      timeRef.current = frame;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;

      // Draw background glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.4);
      bgGrad.addColorStop(0, "rgba(139,92,246,0.06)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw connection lines
      PROJECT_NODES.forEach((node) => {
        const nx = node.cx * width;
        const ny = node.cy * height;
        const isSelected = node.id === selectedId;

        ctx.beginPath();
        ctx.moveTo(nx, ny);

        const midX = (nx + cx) * 0.5 + (Math.random() * 0 - 0);
        const midY = (ny + cy) * 0.5;
        ctx.quadraticCurveTo(midX, midY, cx, cy);

        const color = isSelected ? node.color : "#00f5ff";
        const alpha = isSelected ? 0.6 : 0.12 + Math.sin(frame * 0.02 + node.angle) * 0.04;
        ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = isSelected ? 1.5 : 0.8;
        ctx.stroke();

        // Animated pulse along line
        if (frame % 4 === 0 && Math.random() < 0.15) {
          spawnParticle(PROJECT_NODES.indexOf(node));
        }
      });

      // Update and draw particles
      particles.current = particles.current.filter((p) => p.life < p.maxLife);
      particles.current.forEach((p) => {
        p.x += p.vx * 0.6;
        p.y += p.vy * 0.6;
        p.life++;
        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.8;
        const node = PROJECT_NODES[p.nodeIdx];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, TWO_PI);
        ctx.fillStyle = node.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Draw central core glow rings
      const pulse = Math.sin(frame * 0.05) * 0.5 + 0.5;
      for (let r = 3; r >= 1; r--) {
        const radius = 18 + r * 12 + pulse * 6;
        const alpha = (0.15 - r * 0.04) * (1 - pulse * 0.3);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(0,245,255,${alpha * 2})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, TWO_PI);
        ctx.fill();
      }

      // Orbit ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, width * 0.38, height * 0.28, 0, 0, TWO_PI);
      ctx.strokeStyle = `rgba(0,245,255,${0.06 + Math.sin(frame * 0.01) * 0.02})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height, selectedId, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}

export function NeuralUniverse() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 440 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const selectedProject = PROJECT_NODES.find((n) => n.id === selectedId);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    });
    obs.observe(el);
    setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="neural-universe" className="py-24 px-4 relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="terminal-text text-[#8b5cf6]/40 text-xs tracking-[0.4em] mb-3">
            &gt; RENDERING NEURAL UNIVERSE...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            NEURAL <span className="text-[#8b5cf6]" style={{ textShadow: "0 0 20px #8b5cf644" }}>UNIVERSE</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            CLICK ANY NODE TO EXPLORE THE PROJECT
          </div>
        </motion.div>

        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            border: "1px solid rgba(139,92,246,0.2)",
            background: "linear-gradient(135deg, #020206 0%, #050510 100%)",
            height: 460,
          }}
          ref={containerRef}
        >
          <NeuralCanvas
            selectedId={selectedId}
            width={containerSize.w}
            height={containerSize.h}
          />

          {/* Central core node */}
          <motion.div
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, rgba(0,245,255,0.2) 0%, rgba(0,245,255,0.05) 100%)",
                border: "1px solid rgba(0,245,255,0.5)",
                boxShadow: "0 0 40px rgba(0,245,255,0.3), 0 0 80px rgba(0,245,255,0.1)",
              }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(0,245,255,0.2), 0 0 60px rgba(0,245,255,0.08)",
                  "0 0 50px rgba(0,245,255,0.4), 0 0 100px rgba(0,245,255,0.15)",
                  "0 0 30px rgba(0,245,255,0.2), 0 0 60px rgba(0,245,255,0.08)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-[#00f5ff]"
                style={{ boxShadow: "0 0 15px #00f5ff" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="terminal-text text-[8px] text-[#00f5ff]/60 tracking-widest mt-1.5 text-center">
              NEURAL<br />CORE
            </div>
          </motion.div>

          {/* Project nodes */}
          {PROJECT_NODES.map((node, i) => {
            const isSelected = node.id === selectedId;
            const left = `${node.cx * 100}%`;
            const top = `${node.cy * 100}%`;

            return (
              <motion.button
                key={node.id}
                className="absolute flex flex-col items-center"
                style={{
                  left,
                  top,
                  transform: "translate(-50%, -50%)",
                  zIndex: isSelected ? 20 : 5,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 200 }}
                onClick={() => setSelectedId(isSelected ? null : node.id)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: isSelected ? `${node.color}30` : `${node.color}12`,
                    border: `1px solid ${isSelected ? node.color : node.color + "50"}`,
                  }}
                  animate={{
                    boxShadow: isSelected
                      ? [`0 0 20px ${node.color}60`, `0 0 40px ${node.color}`, `0 0 20px ${node.color}60`]
                      : [`0 0 8px ${node.color}20`, `0 0 16px ${node.color}40`, `0 0 8px ${node.color}20`],
                  }}
                  transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity }}
                >
                  <div
                    className="w-3 h-3 rounded-sm rotate-45"
                    style={{
                      background: node.color,
                      boxShadow: `0 0 8px ${node.color}`,
                      opacity: isSelected ? 1 : 0.7,
                    }}
                  />
                </motion.div>
                <div
                  className="terminal-text text-center mt-1 leading-tight max-w-[80px]"
                  style={{
                    color: isSelected ? node.color : `${node.color}80`,
                    fontSize: 8,
                    letterSpacing: 1,
                    textShadow: isSelected ? `0 0 8px ${node.color}` : "none",
                  }}
                >
                  {node.name}
                </div>
              </motion.button>
            );
          })}

          {/* Selected project detail panel */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="absolute top-4 right-4 w-64 p-4 rounded-lg z-30"
                style={{
                  background: "rgba(5,5,8,0.97)",
                  border: `1px solid ${selectedProject.color}40`,
                  boxShadow: `0 0 40px ${selectedProject.color}20`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="terminal-text text-[9px] tracking-widest mb-1" style={{ color: `${selectedProject.color}60` }}>
                  {selectedProject.category}
                </div>
                <div
                  className="font-bold mb-2"
                  style={{ fontFamily: "Orbitron, sans-serif", color: selectedProject.color, fontSize: 13 }}
                >
                  {selectedProject.name}
                </div>
                <p className="text-white/50 text-[11px] leading-relaxed mb-3">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedProject.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="terminal-text text-[9px] px-1.5 py-0.5 rounded"
                      style={{
                        background: `${selectedProject.color}15`,
                        color: selectedProject.color,
                        border: `1px solid ${selectedProject.color}25`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-text text-[9px] px-2 py-1 rounded border transition-all hover:opacity-80"
                    style={{
                      color: selectedProject.color,
                      borderColor: `${selectedProject.color}30`,
                      background: `${selectedProject.color}10`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    &lt;/&gt; GITHUB
                  </a>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="terminal-text text-[9px] text-white/30 hover:text-white/60"
                  >
                    ✕ CLOSE
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom node indicators */}
          <div
            className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 py-3"
            style={{ background: "linear-gradient(transparent, rgba(5,5,8,0.8))" }}
          >
            {PROJECT_NODES.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(selectedId === n.id ? null : n.id)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: selectedId === n.id ? n.color : `${n.color}40`,
                  boxShadow: selectedId === n.id ? `0 0 8px ${n.color}` : "none",
                  transform: selectedId === n.id ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

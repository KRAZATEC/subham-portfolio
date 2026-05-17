import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface InfraNode {
  id: string;
  label: string;
  icon: string;
  color: string;
  row: number;
  col: number;
  detail: string;
  status: string;
}

const INFRA_NODES: InfraNode[] = [
  { id: "cdn", label: "CDN / WAF", icon: "⬡", color: "#00f5ff", row: 0, col: 2, detail: "CloudFront + WAF for global content delivery and DDoS protection", status: "EDGE LAYER" },
  { id: "gateway", label: "API GATEWAY", icon: "◈", color: "#8b5cf6", row: 1, col: 2, detail: "Kong / AWS API Gateway — rate limiting, auth, routing", status: "INGRESS" },
  { id: "lb", label: "LOAD BALANCER", icon: "⬢", color: "#00f5ff", row: 2, col: 2, detail: "NLB with health checks, weighted routing, SSL termination", status: "TRAFFIC" },
  { id: "k8s", label: "K8S CLUSTER", icon: "◉", color: "#ff8c00", row: 3, col: 1, detail: "EKS/GKE with HPA autoscaling, resource limits, rolling deploys", status: "COMPUTE" },
  { id: "llm", label: "LLM ENGINE", icon: "⬟", color: "#8b5cf6", row: 3, col: 2, detail: "Multi-LLM router: GPT-4 / Groq / Gemini with fallback chain", status: "AI CORE" },
  { id: "vector", label: "VECTOR DB", icon: "◫", color: "#00e5ff", row: 3, col: 3, detail: "ChromaDB / Pinecone — HNSW indexing, 768-dim embeddings", status: "RETRIEVAL" },
  { id: "redis", label: "REDIS CACHE", icon: "◈", color: "#ff4444", row: 4, col: 1, detail: "Semantic cache, session store, rate limiting state", status: "CACHE" },
  { id: "mlflow", label: "MLFLOW", icon: "⬡", color: "#00ff88", row: 4, col: 2, detail: "Experiment tracking, model registry, artifact storage", status: "MLOPS" },
  { id: "postgres", label: "POSTGRES", icon: "⬢", color: "#ff8c00", row: 4, col: 3, detail: "Primary datastore with read replicas and PgVector extension", status: "DATA" },
  { id: "prometheus", label: "PROMETHEUS", icon: "◈", color: "#00f5ff", row: 5, col: 1, detail: "Metrics collection, alerting rules, Grafana dashboards", status: "OBSERVABILITY" },
  { id: "grafana", label: "GRAFANA", icon: "◉", color: "#ff8c00", row: 5, col: 2, detail: "Real-time dashboards for model performance, infra health, errors", status: "MONITORING" },
  { id: "evidently", label: "EVIDENTLY AI", icon: "⬟", color: "#8b5cf6", row: 5, col: 3, detail: "Data drift detection, model performance monitoring, alerts", status: "DRIFT" },
];

const EDGES: Array<[string, string]> = [
  ["cdn", "gateway"],
  ["gateway", "lb"],
  ["lb", "k8s"],
  ["lb", "llm"],
  ["lb", "vector"],
  ["k8s", "redis"],
  ["llm", "mlflow"],
  ["vector", "postgres"],
  ["k8s", "prometheus"],
  ["llm", "grafana"],
  ["vector", "evidently"],
];

const ROWS = 6;
const COLS = 5;

function getNodeStyle(node: InfraNode, containerW: number, containerH: number) {
  const cellW = containerW / COLS;
  const cellH = containerH / ROWS;
  return {
    left: node.col * cellW + cellW / 2,
    top: node.row * cellH + cellH / 2,
  };
}

function buildSequence(nodes: InfraNode[]): number[] {
  return nodes.map((_, i) => i);
}

export function ArchitectureReconstruction() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 600, h: 380 });

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

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
      INFRA_NODES.forEach((node, i) => {
        setTimeout(() => {
          setActiveNodes((prev) => new Set([...prev, node.id]));
        }, 300 + i * 220);
      });
    }
  }, [inView, started]);

  return (
    <section id="arch-reconstruct" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff8c00]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#ff8c00]/40 text-xs tracking-[0.4em] mb-3">
            &gt; RECONSTRUCTING INFRASTRUCTURE HOLOGRAM...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            LIVE ARCHITECTURE <span className="text-[#ff8c00]" style={{ textShadow: "0 0 20px #ff8c0044" }}>RECONSTRUCTION</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            ENTERPRISE AI INFRASTRUCTURE — ASSEMBLING LIVE — CLICK NODES TO INSPECT
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-lg overflow-hidden relative"
            style={{ background: "#020206", border: "1px solid rgba(255,140,0,0.2)", height: 510 }}
            ref={containerRef}
          >
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              {EDGES.map(([fromId, toId], i) => {
                const from = INFRA_NODES.find((n) => n.id === fromId)!;
                const to = INFRA_NODES.find((n) => n.id === toId)!;
                const fp = getNodeStyle(from, containerSize.w, containerSize.h);
                const tp = getNodeStyle(to, containerSize.w, containerSize.h);
                const bothActive = activeNodes.has(fromId) && activeNodes.has(toId);
                if (!bothActive) return null;
                return (
                  <motion.line
                    key={i}
                    x1={fp.left}
                    y1={fp.top}
                    x2={tp.left}
                    y2={tp.top}
                    stroke={from.color}
                    strokeWidth={1}
                    strokeOpacity={0.25}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}
            </svg>

            {INFRA_NODES.map((node) => {
              const pos = getNodeStyle(node, containerSize.w, containerSize.h);
              const isActive = activeNodes.has(node.id);
              const isSelected = selectedNode?.id === node.id;
              return (
                <AnimatePresence key={node.id}>
                  {isActive && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        transform: "translate(-50%, -50%)",
                        zIndex: isSelected ? 20 : 5,
                      }}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                        style={{
                          background: `${node.color}15`,
                          border: `1px solid ${isSelected ? node.color + "80" : node.color + "30"}`,
                        }}
                        animate={{
                          boxShadow: isSelected
                            ? [`0 0 15px ${node.color}40`, `0 0 30px ${node.color}80`, `0 0 15px ${node.color}40`]
                            : [`0 0 5px ${node.color}15`, `0 0 10px ${node.color}30`, `0 0 5px ${node.color}15`],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span style={{ color: node.color, fontSize: 14 }}>{node.icon}</span>
                      </motion.div>
                      <div
                        className="terminal-text text-center mt-1"
                        style={{ color: isSelected ? node.color : `${node.color}70`, fontSize: 7, letterSpacing: 1, maxWidth: 64 }}
                      >
                        {node.label}
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>
              );
            })}

            <div className="absolute bottom-2 left-3 terminal-text text-[8px] text-white/20">
              {activeNodes.size}/{INFRA_NODES.length} COMPONENTS DEPLOYED
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 rounded-lg"
                  style={{ background: `${selectedNode.color}08`, border: `1px solid ${selectedNode.color}30` }}
                >
                  <div className="terminal-text text-[8px] tracking-widest mb-1" style={{ color: `${selectedNode.color}60` }}>
                    {selectedNode.status}
                  </div>
                  <div className="font-bold mb-2" style={{ fontFamily: "Orbitron, sans-serif", color: selectedNode.color, fontSize: 12 }}>
                    {selectedNode.label}
                  </div>
                  <p className="text-white/50 text-[11px] leading-relaxed mb-3">{selectedNode.detail}</p>
                  <div className="space-y-1">
                    {["DEPLOYED", "HEALTHY", "AUTO-SCALE ON"].map((s) => (
                      <div key={s} className="terminal-text text-[9px] flex items-center gap-1.5 text-white/40">
                        <span className="text-[#00ff88]">✓</span>{s}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="terminal-text text-[8px] text-white/20 hover:text-white/50 mt-3 block">
                    ✕ CLOSE
                  </button>
                </motion.div>
              ) : (
                <motion.div key="placeholder" className="p-4 rounded-lg text-center"
                  style={{ background: "rgba(255,140,0,0.04)", border: "1px solid rgba(255,140,0,0.1)" }}>
                  <div className="terminal-text text-[9px] text-white/20 tracking-widest">CLICK ANY COMPONENT TO INSPECT</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-3 rounded-lg" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}>
              <div className="terminal-text text-[9px] text-[#00ff88]/60 tracking-widest mb-2">DEPLOYMENT LOG</div>
              <div className="h-32 overflow-y-auto space-y-1">
                {INFRA_NODES.filter((n) => activeNodes.has(n.id)).map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="terminal-text text-[8px] text-white/40 flex items-center gap-1.5"
                  >
                    <span className="text-[#00ff88]">✓</span>
                    <span style={{ color: n.color }}>{n.label}</span>
                    <span>deployed</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

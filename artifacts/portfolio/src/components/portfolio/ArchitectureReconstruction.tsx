import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface InfraNode {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  row: number;
  col: number;
  detail: string;
  layer: string;
}

const INFRA_NODES: InfraNode[] = [
  { id: "cdn",        label: "CDN / WAF",       sublabel: "CloudFront",       icon: "⬡", color: "#00f5ff", row: 0, col: 2, layer: "EDGE",          detail: "CloudFront + WAF — global content delivery, DDoS protection, TLS termination." },
  { id: "gateway",    label: "API GATEWAY",     sublabel: "Kong / AWS",       icon: "◈", color: "#8b5cf6", row: 1, col: 2, layer: "INGRESS",        detail: "Kong / AWS API Gateway — rate limiting, auth middleware, request routing." },
  { id: "lb",         label: "LOAD BALANCER",   sublabel: "Network LB",       icon: "⬢", color: "#00f5ff", row: 2, col: 2, layer: "TRAFFIC",        detail: "NLB with health checks, weighted routing, SSL termination at scale." },
  { id: "k8s",        label: "K8S CLUSTER",     sublabel: "EKS / GKE",        icon: "◉", color: "#ff8c00", row: 3, col: 0, layer: "COMPUTE",        detail: "EKS/GKE with HPA autoscaling, resource limits, rolling deploys." },
  { id: "llm",        label: "LLM ENGINE",      sublabel: "GPT-4 / Groq",     icon: "⬟", color: "#8b5cf6", row: 3, col: 2, layer: "AI CORE",        detail: "Multi-LLM router: GPT-4 / Groq / Gemini with fallback chain." },
  { id: "vector",     label: "VECTOR DB",       sublabel: "Pinecone",         icon: "◫", color: "#00e5ff", row: 3, col: 4, layer: "RETRIEVAL",      detail: "ChromaDB / Pinecone — HNSW indexing, 768-dim embeddings at scale." },
  { id: "redis",      label: "REDIS CACHE",     sublabel: "Semantic Cache",   icon: "◈", color: "#ff4444", row: 4, col: 0, layer: "CACHE",          detail: "Semantic cache, session store, distributed rate limiting state." },
  { id: "mlflow",     label: "MLFLOW",          sublabel: "Model Registry",   icon: "⬡", color: "#00ff88", row: 4, col: 2, layer: "MLOPS",          detail: "Experiment tracking, model registry, artifact storage + lineage." },
  { id: "postgres",   label: "POSTGRES",        sublabel: "PgVector",         icon: "⬢", color: "#ff8c00", row: 4, col: 4, layer: "DATA",           detail: "Primary datastore with read replicas and PgVector extension." },
  { id: "prometheus", label: "PROMETHEUS",      sublabel: "Metrics",          icon: "◈", color: "#00f5ff", row: 5, col: 0, layer: "OBSERVABILITY",  detail: "Metrics collection, alerting rules, Grafana dashboard sources." },
  { id: "grafana",    label: "GRAFANA",         sublabel: "Dashboards",       icon: "◉", color: "#ff8c00", row: 5, col: 2, layer: "MONITORING",     detail: "Real-time dashboards for model perf, infra health, error rates." },
  { id: "evidently",  label: "EVIDENTLY AI",    sublabel: "Drift Detection",  icon: "⬟", color: "#8b5cf6", row: 5, col: 4, layer: "DRIFT",          detail: "Data drift detection, model performance monitoring + alerts." },
];

const EDGES: Array<[string, string]> = [
  ["cdn",     "gateway"],
  ["gateway", "lb"],
  ["lb",      "k8s"],
  ["lb",      "llm"],
  ["lb",      "vector"],
  ["k8s",     "redis"],
  ["llm",     "mlflow"],
  ["vector",  "postgres"],
  ["k8s",     "prometheus"],
  ["llm",     "grafana"],
  ["vector",  "evidently"],
];

const ROWS = 6;
const COLS = 5;
const NODE_W = 120;
const NODE_H = 68;

function getNodeCenter(node: InfraNode, cW: number, cH: number) {
  const cellW = cW / COLS;
  const cellH = cH / ROWS;
  return {
    cx: node.col * cellW + cellW / 2,
    cy: node.row * cellH + cellH / 2,
  };
}

export function ArchitectureReconstruction() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 700, h: 520 });

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
        }, 200 + i * 180);
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
          {/* Main diagram */}
          <div
            className="lg:col-span-2 rounded-xl overflow-hidden relative"
            style={{ background: "#020206", border: "1px solid rgba(255,140,0,0.2)", height: 520 }}
            ref={containerRef}
          >
            {/* SVG edge layer */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              {EDGES.map(([fromId, toId], i) => {
                const from = INFRA_NODES.find((n) => n.id === fromId)!;
                const to   = INFRA_NODES.find((n) => n.id === toId)!;
                const fp   = getNodeCenter(from, containerSize.w, containerSize.h);
                const tp   = getNodeCenter(to,   containerSize.w, containerSize.h);
                if (!activeNodes.has(fromId) || !activeNodes.has(toId)) return null;
                return (
                  <motion.line
                    key={i}
                    x1={fp.cx} y1={fp.cy}
                    x2={tp.cx} y2={tp.cy}
                    stroke={from.color}
                    strokeWidth={1}
                    strokeOpacity={0.3}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                );
              })}
            </svg>

            {/* Node boxes */}
            {INFRA_NODES.map((node) => {
              const { cx, cy } = getNodeCenter(node, containerSize.w, containerSize.h);
              const isActive   = activeNodes.has(node.id);
              const isSelected = selectedNode?.id === node.id;
              return (
                <AnimatePresence key={node.id}>
                  {isActive && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      className="absolute flex flex-col items-center justify-between rounded-lg overflow-hidden"
                      style={{
                        left: cx,
                        top:  cy,
                        width:  NODE_W,
                        height: NODE_H,
                        transform: "translate(-50%, -50%)",
                        background: isSelected ? `${node.color}18` : `${node.color}0c`,
                        border: `1px solid ${isSelected ? node.color + "90" : node.color + "40"}`,
                        boxShadow: isSelected
                          ? `0 0 24px ${node.color}50, inset 0 0 12px ${node.color}10`
                          : `0 0 10px ${node.color}20`,
                        zIndex: isSelected ? 20 : 5,
                      }}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                    >
                      {/* Top layer stripe */}
                      <div
                        className="w-full h-0.5"
                        style={{ background: `linear-gradient(90deg, transparent, ${node.color}, transparent)` }}
                      />
                      {/* Icon */}
                      <motion.div
                        className="text-lg leading-none"
                        style={{ color: node.color }}
                        animate={{ opacity: isSelected ? 1 : [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        {node.icon}
                      </motion.div>
                      {/* Label */}
                      <div className="px-1.5 pb-1.5 text-center w-full">
                        <div
                          className="terminal-text font-bold leading-tight"
                          style={{ color: node.color, fontSize: 9, letterSpacing: 0.5 }}
                        >
                          {node.label}
                        </div>
                        <div className="terminal-text leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontSize: 7 }}>
                          {node.sublabel}
                        </div>
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>
              );
            })}

            {/* Progress counter */}
            <div className="absolute bottom-2.5 left-3 terminal-text text-[8px] text-white/20">
              {activeNodes.size}/{INFRA_NODES.length} COMPONENTS DEPLOYED
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-5 rounded-lg"
                  style={{ background: `${selectedNode.color}08`, border: `1px solid ${selectedNode.color}35` }}
                >
                  <div className="terminal-text text-[8px] tracking-widest mb-1" style={{ color: `${selectedNode.color}70` }}>
                    {selectedNode.layer}
                  </div>
                  <div className="font-bold mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: selectedNode.color, fontSize: 13 }}>
                    {selectedNode.label}
                  </div>
                  <div className="terminal-text text-[10px] text-white/35 mb-3">{selectedNode.sublabel}</div>
                  <p className="text-white/55 text-[11px] leading-relaxed mb-3">{selectedNode.detail}</p>
                  <div className="space-y-1 mb-3">
                    {["DEPLOYED", "HEALTHY", "AUTO-SCALE ON"].map((s) => (
                      <div key={s} className="terminal-text text-[9px] flex items-center gap-1.5 text-white/40">
                        <span className="text-[#00ff88]">✓</span>{s}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="terminal-text text-[8px] text-white/20 hover:text-white/50 transition-colors"
                  >
                    ✕ CLOSE
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="p-4 rounded-lg text-center"
                  style={{ background: "rgba(255,140,0,0.04)", border: "1px solid rgba(255,140,0,0.12)" }}
                >
                  <div className="terminal-text text-[9px] text-white/20 leading-relaxed tracking-widest">
                    CLICK ANY NODE TO INSPECT THE COMPONENT
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Layer legend */}
            <div className="p-3 rounded-lg" style={{ background: "rgba(255,140,0,0.04)", border: "1px solid rgba(255,140,0,0.12)" }}>
              <div className="terminal-text text-[9px] text-[#ff8c00]/60 tracking-widest mb-2">LAYER LEGEND</div>
              <div className="space-y-1.5">
                {[
                  { layer: "EDGE",          color: "#00f5ff" },
                  { layer: "INGRESS",       color: "#8b5cf6" },
                  { layer: "TRAFFIC",       color: "#00f5ff" },
                  { layer: "COMPUTE / AI",  color: "#ff8c00" },
                  { layer: "DATA / MLOPS",  color: "#00ff88" },
                  { layer: "OBSERVABILITY", color: "#ff4444" },
                ].map((l) => (
                  <div key={l.layer} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: l.color, boxShadow: `0 0 4px ${l.color}80` }} />
                    <span className="terminal-text text-[8px] text-white/40">{l.layer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment log */}
            <div className="p-3 rounded-lg" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}>
              <div className="terminal-text text-[9px] text-[#00ff88]/60 tracking-widest mb-2">DEPLOYMENT LOG</div>
              <div className="h-36 overflow-y-auto space-y-1 pr-1">
                {INFRA_NODES.filter((n) => activeNodes.has(n.id)).map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="terminal-text text-[8px] text-white/40 flex items-center gap-1.5"
                  >
                    <span className="text-[#00ff88] shrink-0">✓</span>
                    <span style={{ color: n.color }}>{n.label}</span>
                    <span className="text-white/25">deployed</span>
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

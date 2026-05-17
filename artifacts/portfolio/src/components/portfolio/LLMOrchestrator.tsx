import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface OrchestratorNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  color: string;
  icon: string;
  detail: string;
}

const NODES: OrchestratorNode[] = [
  { id: "query", label: "USER QUERY", sub: "Input", x: 50, y: 10, color: "#00f5ff", icon: "◈", detail: "Natural language query entered by the user. Tokenized and classified before routing." },
  { id: "analyzer", label: "QUERY ANALYZER", sub: "Intent Classification", x: 50, y: 22, color: "#8b5cf6", icon: "⬡", detail: "Classifies intent, extracts entities, determines retrieval strategy and relevant agents." },
  { id: "retriever", label: "RETRIEVER AGENT", sub: "Semantic Search", x: 25, y: 37, color: "#00f5ff", icon: "⬢", detail: "Embeds query, performs cosine similarity search, retrieves top-k relevant documents." },
  { id: "vectordb", label: "VECTOR SEARCH DB", sub: "ChromaDB / Pinecone", x: 75, y: 37, color: "#00e5ff", icon: "◉", detail: "Stores high-dimensional embeddings. HNSW index enables sub-millisecond retrieval at scale." },
  { id: "memory", label: "MEMORY CONTEXT", sub: "Injection Layer", x: 25, y: 53, color: "#00ff88", icon: "◫", detail: "Injects conversation history, user profile, and retrieved documents into the context window." },
  { id: "reasoning", label: "LLM REASONING", sub: "GPT-4 / Groq / Gemini", x: 50, y: 67, color: "#8b5cf6", icon: "⬟", detail: "Multi-step chain-of-thought reasoning with dynamic model routing based on task complexity." },
  { id: "tools", label: "TOOL CALLING", sub: "Function Execution", x: 20, y: 80, color: "#ff8c00", icon: "◈", detail: "Executes tool calls: web search, code execution, API calls, database queries, calculations." },
  { id: "apis", label: "EXTERNAL APIS", sub: "Services Layer", x: 80, y: 80, color: "#ff4444", icon: "⬡", detail: "Connects to external services: news APIs, weather, databases, knowledge bases." },
  { id: "synthesis", label: "RESPONSE SYNTHESIS", sub: "Output Generation", x: 50, y: 90, color: "#00ff88", icon: "⬢", detail: "Aggregates all context, tool outputs, and reasoning chains into a coherent final response." },
];

const EDGES = [
  { from: "query", to: "analyzer", color: "#8b5cf6" },
  { from: "analyzer", to: "retriever", color: "#00f5ff" },
  { from: "analyzer", to: "vectordb", color: "#00e5ff" },
  { from: "retriever", to: "vectordb", color: "#00e5ff", dashed: true },
  { from: "retriever", to: "memory", color: "#00ff88" },
  { from: "vectordb", to: "memory", color: "#00ff88" },
  { from: "memory", to: "reasoning", color: "#8b5cf6" },
  { from: "reasoning", to: "tools", color: "#ff8c00" },
  { from: "reasoning", to: "apis", color: "#ff4444" },
  { from: "tools", to: "synthesis", color: "#00ff88" },
  { from: "apis", to: "synthesis", color: "#00ff88" },
];

const CONTAINER_W = 700;
const CONTAINER_H = 420;

function getNodePos(node: OrchestratorNode) {
  return {
    cx: (node.x / 100) * CONTAINER_W,
    cy: (node.y / 100) * CONTAINER_H,
  };
}

function getMidPoint(n1: OrchestratorNode, n2: OrchestratorNode) {
  const p1 = getNodePos(n1);
  const p2 = getNodePos(n2);
  return {
    mx: (p1.cx + p2.cx) / 2,
    my: (p1.cy + p2.cy) / 2 - 20,
  };
}

function PathDef({ edge, idx }: { edge: typeof EDGES[0]; idx: number }) {
  const n1 = NODES.find((n) => n.id === edge.from)!;
  const n2 = NODES.find((n) => n.id === edge.to)!;
  const p1 = getNodePos(n1);
  const p2 = getNodePos(n2);
  const { mx, my } = getMidPoint(n1, n2);
  const d = `M ${p1.cx} ${p1.cy} Q ${mx} ${my} ${p2.cx} ${p2.cy}`;

  return (
    <path
      id={`edge-${idx}`}
      d={d}
      fill="none"
      stroke={edge.color}
      strokeWidth={edge.dashed ? 0.8 : 1}
      strokeDasharray={edge.dashed ? "4 4" : undefined}
      opacity={0.25}
    />
  );
}

function DataPacket({ edgeIdx, color, delay }: { edgeIdx: number; color: string; delay: number }) {
  return (
    <circle r="3.5" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
      <animateMotion
        dur={`${1.8 + delay * 0.3}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
      >
        <mpath href={`#edge-${edgeIdx}`} />
      </animateMotion>
    </circle>
  );
}

export function LLMOrchestrator() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [running, setRunning] = useState(true);

  const selected = NODES.find((n) => n.id === selectedNode);

  return (
    <section id="llm-orchestrator" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#8b5cf6]/40 text-xs tracking-[0.4em] mb-3">
            &gt; INITIALIZING LLM ORCHESTRATION ENGINE...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            LLM <span className="text-[#8b5cf6]" style={{ textShadow: "0 0 20px #8b5cf644" }}>ORCHESTRATOR</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            LIVE REASONING ENGINE — CLICK ANY NODE TO INSPECT
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-lg overflow-hidden relative"
            style={{ background: "#020206", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#8b5cf6]/10">
              <div className="terminal-text text-[10px] text-[#8b5cf6]/60 tracking-widest">ORCHESTRATION GRAPH</div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: running ? "#00ff88" : "#ff4444" }}
                  animate={{ opacity: running ? [1, 0.3, 1] : 1 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <button
                  onClick={() => setRunning(!running)}
                  className="terminal-text text-[9px] text-white/40 hover:text-white/70"
                >
                  {running ? "PAUSE" : "RESUME"}
                </button>
              </div>
            </div>

            <div className="relative" style={{ height: CONTAINER_H }}>
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${CONTAINER_W} ${CONTAINER_H}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0"
              >
                <defs>
                  <filter id="glow-purple">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {EDGES.map((edge, i) => (
                  <PathDef key={i} edge={edge} idx={i} />
                ))}

                {running && EDGES.map((edge, i) => (
                  <DataPacket key={i} edgeIdx={i} color={edge.color} delay={i * 0.35} />
                ))}
              </svg>

              {NODES.map((node, i) => {
                const { cx, cy } = getNodePos(node);
                const isSelected = selectedNode === node.id;
                return (
                  <motion.button
                    key={node.id}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${(cx / CONTAINER_W) * 100}%`,
                      top: `${(cy / CONTAINER_H) * 100}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: isSelected ? 20 : 5,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.06, type: "spring" }}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="px-2 py-1 rounded text-center"
                      style={{
                        background: isSelected ? `${node.color}25` : `${node.color}10`,
                        border: `1px solid ${isSelected ? node.color + "80" : node.color + "30"}`,
                        minWidth: 90,
                      }}
                      animate={isSelected ? {
                        boxShadow: [`0 0 15px ${node.color}40`, `0 0 30px ${node.color}80`, `0 0 15px ${node.color}40`],
                      } : {
                        boxShadow: [`0 0 5px ${node.color}20`, `0 0 10px ${node.color}30`, `0 0 5px ${node.color}20`],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="terminal-text font-bold" style={{ color: node.color, fontSize: 8, letterSpacing: 1 }}>
                        {node.icon} {node.label}
                      </div>
                      <div className="terminal-text" style={{ color: "rgba(255,255,255,0.3)", fontSize: 7 }}>
                        {node.sub}
                      </div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-5 rounded-lg"
                  style={{ background: `${selected.color}08`, border: `1px solid ${selected.color}30` }}
                >
                  <div className="terminal-text text-lg mb-1" style={{ color: selected.color }}>{selected.icon}</div>
                  <div className="font-bold mb-2" style={{ fontFamily: "Orbitron, sans-serif", color: selected.color, fontSize: 13 }}>
                    {selected.label}
                  </div>
                  <div className="terminal-text text-[10px] text-white/40 mb-2">{selected.sub}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{selected.detail}</p>
                  <button onClick={() => setSelectedNode(null)} className="terminal-text text-[9px] text-white/30 hover:text-white/60 mt-3 block">
                    ✕ CLOSE
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 rounded-lg text-center"
                  style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.15)" }}
                >
                  <div className="terminal-text text-xs text-white/20 tracking-widest">
                    CLICK ANY NODE TO INSPECT THE ORCHESTRATION LAYER
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <div className="terminal-text text-[10px] text-white/30 tracking-widest">PIPELINE METRICS</div>
              {[
                { label: "AVG LATENCY", value: "142ms", color: "#00f5ff" },
                { label: "TOKENS/SEC", value: "48,200", color: "#8b5cf6" },
                { label: "CACHE HIT RATE", value: "78%", color: "#00ff88" },
                { label: "ACTIVE AGENTS", value: "7/8", color: "#ff8c00" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between p-2 rounded"
                  style={{ background: `${m.color}08`, border: `1px solid ${m.color}15` }}
                >
                  <span className="terminal-text text-[9px] text-white/40">{m.label}</span>
                  <motion.span
                    className="terminal-text text-xs font-bold"
                    style={{ color: m.color }}
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                  >
                    {m.value}
                  </motion.span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg" style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}>
              <div className="terminal-text text-[9px] text-[#00f5ff]/60 tracking-widest mb-2">REASONING LOG</div>
              {[
                "Query tokenized: 12 tokens",
                "Intent: RETRIEVAL + SYNTHESIS",
                "Semantic similarity: 0.847",
                "Context window: 4,200 tokens",
                "Tool calls: 2 (search, calc)",
                "Response generated: 340ms",
              ].map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="terminal-text text-[9px] text-white/40 py-0.5"
                >
                  <span className="text-[#00f5ff]/50">▸ </span>{log}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

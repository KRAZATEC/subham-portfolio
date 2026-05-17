import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface FeedItem {
  id: number;
  title: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  time: string;
  color: string;
  summary: string;
  tags: string[];
}

const FEED_DATA: FeedItem[] = [
  {
    id: 1, title: "GPT-4o-mini achieves 95% of GPT-4 performance at 10% cost",
    category: "GENERATIVE AI", priority: "HIGH", time: "2h ago", color: "#8b5cf6",
    summary: "OpenAI's efficiency breakthrough enables enterprise-scale LLM deployment at dramatically reduced inference costs.",
    tags: ["LLM", "Cost Optimization", "Production AI"],
  },
  {
    id: 2, title: "Critical zero-day in Apache HTTP Server — active exploitation detected",
    category: "SECURITY ALERTS", priority: "CRITICAL", time: "4h ago", color: "#ff4444",
    summary: "CVE-2025-0001 allows remote code execution. 50,000+ servers exposed. Patch immediately.",
    tags: ["CVE", "RCE", "Apache", "Urgent"],
  },
  {
    id: 3, title: "AWS launches Bedrock Model Evaluation — automated ML quality gates",
    category: "CLOUD INFRASTRUCTURE", priority: "MEDIUM", time: "6h ago", color: "#ff8c00",
    summary: "Automated evaluation pipelines for foundation models now available in all AWS regions with custom metric support.",
    tags: ["AWS", "Bedrock", "MLOps", "Evaluation"],
  },
  {
    id: 4, title: "LangGraph 0.4 releases multi-agent checkpointing and time-travel debugging",
    category: "AI RESEARCH", priority: "HIGH", time: "8h ago", color: "#00f5ff",
    summary: "New persistence layer enables stateful multi-agent workflows with full audit trails and state replay capability.",
    tags: ["LangGraph", "Multi-Agent", "LangChain"],
  },
  {
    id: 5, title: "Kubernetes 2.0 — AI workload scheduling with GPU-aware autoscaling",
    category: "MLOPS", priority: "MEDIUM", time: "10h ago", color: "#00ff88",
    summary: "Intelligent scheduler learns from historical GPU utilization patterns to optimize inference cluster resource allocation.",
    tags: ["K8s", "GPU", "MLOps", "Autoscaling"],
  },
  {
    id: 6, title: "Microsoft Presidio 2.5 — neural PII detection with 99.4% accuracy",
    category: "ENTERPRISE AI", priority: "MEDIUM", time: "12h ago", color: "#00e5ff",
    summary: "New neural entity recognition model outperforms rule-based systems across 18 PII types including medical identifiers.",
    tags: ["Presidio", "NLP", "Compliance", "Privacy"],
  },
  {
    id: 7, title: "Groq achieves 1,000 tokens/sec on Llama-3 70B — inference record broken",
    category: "GENERATIVE AI", priority: "HIGH", time: "14h ago", color: "#8b5cf6",
    summary: "LPU architecture enables real-time streaming inference at scale, fundamentally changing LLM deployment economics.",
    tags: ["Groq", "Inference Speed", "Llama", "LPU"],
  },
  {
    id: 8, title: "MLflow 3.0 — unified model registry for PyTorch, TF, and LLM deployments",
    category: "MLOPS", priority: "MEDIUM", time: "16h ago", color: "#00ff88",
    summary: "Single registry now tracks traditional ML models and fine-tuned LLMs with unified lineage and governance.",
    tags: ["MLflow", "Model Registry", "Governance"],
  },
  {
    id: 9, title: "AI-powered phishing detection achieves 99.7% accuracy in enterprise tests",
    category: "SECURITY ALERTS", priority: "HIGH", time: "20h ago", color: "#ff4444",
    summary: "URL analysis model combining lexical features, domain reputation, and visual similarity reduces click-through by 94%.",
    tags: ["Phishing", "Security AI", "Enterprise"],
  },
  {
    id: 10, title: "RAG architecture benchmark: ChromaDB vs Pinecone vs Weaviate",
    category: "AI RESEARCH", priority: "LOW", time: "1d ago", color: "#00f5ff",
    summary: "Comprehensive study across 5M vectors shows ChromaDB optimal for sub-100K embeddings; Pinecone leads at scale.",
    tags: ["RAG", "Vector DB", "Benchmark", "ChromaDB"],
  },
];

const PRIORITY_COLORS: Record<FeedItem["priority"], string> = {
  CRITICAL: "#ff4444",
  HIGH: "#ff8c00",
  MEDIUM: "#00f5ff",
  LOW: "#00ff88",
};

function FeedCard({ item, delay }: { item: FeedItem; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="p-4 rounded-lg cursor-pointer transition-all hologram"
      style={{
        background: `${item.color}06`,
        border: `1px solid ${item.color}${expanded ? "40" : "15"}`,
        boxShadow: expanded ? `0 0 20px ${item.color}10` : "none",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="terminal-text text-[8px] px-1.5 py-0.5 rounded font-bold tracking-widest shrink-0"
              style={{ background: `${PRIORITY_COLORS[item.priority]}20`, color: PRIORITY_COLORS[item.priority], border: `1px solid ${PRIORITY_COLORS[item.priority]}30` }}
            >
              {item.priority}
            </span>
            <span className="terminal-text text-[8px] tracking-widest" style={{ color: `${item.color}70` }}>
              {item.category}
            </span>
          </div>
          <h3 className="text-white/85 text-sm font-medium leading-snug mb-1">{item.title}</h3>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-white/50 text-xs leading-relaxed mt-2 mb-2">{item.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="terminal-text text-[8px] px-1.5 py-0.5 rounded"
                      style={{ background: `${item.color}10`, color: `${item.color}80`, border: `1px solid ${item.color}15` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="text-right shrink-0">
          <div className="terminal-text text-[9px] text-white/25">{item.time}</div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="terminal-text text-[9px] mt-1"
            style={{ color: `${item.color}50` }}
          >
            ▼
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const CATEGORIES = ["ALL", "GENERATIVE AI", "SECURITY ALERTS", "CLOUD INFRASTRUCTURE", "AI RESEARCH", "MLOPS", "ENTERPRISE AI"];

export function IntelligenceFeed() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("ALL");
  const [live, setLive] = useState(true);
  const [ticker, setTicker] = useState(0);

  const filtered = filter === "ALL" ? FEED_DATA : FEED_DATA.filter((f) => f.category === filter);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => setTicker((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <section id="intel-feed" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff4444]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#ff4444]/40 text-xs tracking-[0.4em] mb-3">
            &gt; CONNECTING TO INTELLIGENCE NETWORK...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            LIVE INTELLIGENCE <span className="text-[#ff4444]" style={{ textShadow: "0 0 20px #ff444444" }}>NETWORK</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            REAL-TIME AI & SECURITY INTELLIGENCE FEED
          </div>
        </motion.div>

        <div
          className="p-3 rounded-lg mb-6 overflow-hidden"
          style={{ background: "rgba(255,68,68,0.06)", border: "1px solid rgba(255,68,68,0.2)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#ff4444]"
                animate={{ opacity: live ? [1, 0.3, 1] : 0.3 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="terminal-text text-[9px] text-[#ff4444] tracking-widest">{live ? "LIVE" : "PAUSED"}</span>
            </div>
            <div className="overflow-hidden flex-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ticker}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="terminal-text text-[10px] text-white/40 block truncate"
                >
                  {FEED_DATA[ticker % FEED_DATA.length].title}
                </motion.span>
              </AnimatePresence>
            </div>
            <button
              onClick={() => setLive(!live)}
              className="terminal-text text-[9px] text-white/30 hover:text-white/60 shrink-0"
            >
              {live ? "PAUSE" : "RESUME"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="terminal-text text-[9px] px-2.5 py-1.5 rounded tracking-widest transition-all"
              style={{
                background: filter === cat ? "rgba(255,68,68,0.2)" : "transparent",
                border: `1px solid ${filter === cat ? "rgba(255,68,68,0.6)" : "rgba(255,68,68,0.15)"}`,
                color: filter === cat ? "#ff4444" : "rgba(255,68,68,0.5)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, i) => (
            <FeedCard key={item.id} item={item} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

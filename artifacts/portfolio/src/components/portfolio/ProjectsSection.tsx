import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { ProjectWorldModal } from "@/components/portfolio/ProjectWorldModal";

const ARCHITECTURES: Record<string, Array<{ label: string; sub?: string; color?: string }[]>> = {
  "neo-stats": [
    [{ label: "USER", color: "#00f5ff" }],
    [{ label: "STREAMLIT UI", sub: "Frontend" }],
    [{ label: "QUERY PROCESSOR", sub: "Routing" }],
    [{ label: "ChromaDB", sub: "Vector Store" }, { label: "MEMORY", sub: "Context" }],
    [{ label: "GPT-4", color: "#00ff88" }, { label: "GROQ", color: "#8b5cf6" }, { label: "GEMINI", color: "#ff8c00" }],
    [{ label: "AGGREGATOR", sub: "Synthesis" }],
    [{ label: "RESPONSE", color: "#00f5ff" }],
  ],
  "ai-nids": [
    [{ label: "TRAFFIC CAPTURE", color: "#ff4444" }],
    [{ label: "FEATURE EXTRACTOR", sub: "44 features" }],
    [{ label: "RANDOM FOREST", color: "#00ff88" }, { label: "SVM", color: "#8b5cf6" }, { label: "NEURAL NET", color: "#00f5ff" }],
    [{ label: "ENSEMBLE VOTER", sub: "Weighted" }],
    [{ label: "ALERT", color: "#ff4444" }, { label: "BLOCK", color: "#ff8c00" }, { label: "LOG", color: "#00f5ff" }],
  ],
  "customer-support-agent": [
    [{ label: "USER INPUT", color: "#8b5cf6" }],
    [{ label: "LANGGRAPH", sub: "Workflow" }],
    [{ label: "ROUTER NODE", sub: "Intent" }],
    [{ label: "KNOWLEDGE BASE" }, { label: "CRM API" }, { label: "GROQ LLM", color: "#8b5cf6" }],
    [{ label: "RESPONSE GEN", sub: "Synthesis" }],
    [{ label: "USER RESPONSE", color: "#8b5cf6" }],
  ],
  "phis-guard": [
    [{ label: "URL INPUT", color: "#ff8c00" }],
    [{ label: "FEATURE ENG", sub: "20+ features" }],
    [{ label: "ML CLASSIFIER", sub: "Random Forest" }],
    [{ label: "SAFE", color: "#00ff88" }, { label: "PHISHING", color: "#ff4444" }],
  ],
  "pii-detector": [
    [{ label: "INPUT TEXT", color: "#00e5ff" }],
    [{ label: "spaCy NLP", sub: "Tokenizer" }],
    [{ label: "PRESIDIO ENGINE", sub: "Microsoft" }],
    [{ label: "NAMES" }, { label: "EMAILS" }, { label: "SSNs" }, { label: "PHONES" }],
    [{ label: "REDACTOR", sub: "Masking" }],
    [{ label: "CLEAN OUTPUT", color: "#00e5ff" }],
  ],
  "nova-assistant": [
    [{ label: "VOICE INPUT", color: "#00ff88" }],
    [{ label: "STT ENGINE", sub: "Speech→Text" }],
    [{ label: "NLU PIPELINE", sub: "Intent/Entity" }],
    [{ label: "INTENT ROUTER" }],
    [{ label: "LLM CORE", color: "#00ff88" }, { label: "KNOWLEDGE BASE" }],
    [{ label: "TTS OUTPUT", sub: "Text→Speech" }],
  ],
  "healthcare-agent": [
    [{ label: "TEXT QUERY", color: "#00ff66" }, { label: "MEDICAL IMAGE" }],
    [{ label: "MULTIMODAL PROC.", sub: "Vision+Text" }],
    [{ label: "GROQ LLM", sub: "Inference", color: "#00ff66" }],
    [{ label: "MEDICAL DB" }, { label: "CLINICAL KB" }],
    [{ label: "CLINICAL OUTPUT", color: "#00ff66" }],
  ],
  "ai-soc": [
    [{ label: "SECURITY EVENTS", color: "#ff006e" }],
    [{ label: "COLLECTOR", sub: "Ingest" }],
    [{ label: "NORMALIZER", sub: "Parse" }],
    [{ label: "ML ANOMALY ENGINE", sub: "Isolation Forest" }],
    [{ label: "THREAT DB" }, { label: "CLASSIFIER" }],
    [{ label: "DASHBOARD" }, { label: "INCIDENT RESP.", color: "#ff006e" }],
  ],
};

function ArchitectureView({ projectId, color }: { projectId: string; color: string }) {
  const arch = ARCHITECTURES[projectId];
  if (!arch) return (
    <div className="text-center py-6 terminal-text text-xs text-white/20">Architecture diagram coming soon</div>
  );

  return (
    <div className="py-2 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        {arch.map((layer, li) => (
          <div key={li} className="flex items-center gap-2">
            <div className="flex flex-col gap-1.5 items-center">
              {layer.map((node, ni) => (
                <motion.div
                  key={ni}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: li * 0.12 + ni * 0.05, duration: 0.3 }}
                  className="px-2 py-1 rounded text-center"
                  style={{
                    background: `${node.color || color}12`,
                    border: `1px solid ${node.color || color}30`,
                    minWidth: 72,
                  }}
                >
                  <div className="terminal-text text-[8px] font-bold leading-tight" style={{ color: node.color || color }}>
                    {node.label}
                  </div>
                  {node.sub && (
                    <div className="terminal-text text-[7px] text-white/30 leading-tight mt-0.5">{node.sub}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {li < arch.length - 1 && (
              <div className="flex flex-col items-center gap-1" style={{ minWidth: 20 }}>
                {Array.from({ length: Math.max(layer.length, arch[li + 1].length) }).map((_, ai) => (
                  <motion.div
                    key={ai}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: li * 0.12 + 0.3 }}
                    className="flex items-center"
                    style={{ height: 28 }}
                  >
                    <div className="relative h-px w-5 overflow-hidden" style={{ background: `${color}30` }}>
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: li * 0.3 }}
                      />
                    </div>
                    <div style={{ color: `${color}60`, fontSize: 8 }}>▶</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpenWorld }: { project: typeof PORTFOLIO_DATA.projects[0]; index: number; onOpenWorld: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"features" | "arch">("features");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className="relative rounded border cursor-pointer hologram group overflow-hidden"
      style={{
        borderColor: expanded ? `${project.color}60` : `${project.color}20`,
        background: `linear-gradient(135deg, rgba(5,5,8,0.98) 0%, ${project.color}06 100%)`,
        boxShadow: expanded ? `0 0 40px ${project.color}20` : `0 0 15px ${project.color}08`,
        transition: "all 0.3s ease",
      }}
      onClick={() => setExpanded(!expanded)}
      data-testid={`card-project-${project.id}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div
              className="terminal-text text-[10px] tracking-widest mb-1"
              style={{ color: `${project.color}70` }}
            >
              {project.category}
            </div>
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "Orbitron, sans-serif", color: project.color, textShadow: `0 0 15px ${project.color}50` }}
            >
              {project.name}
            </h3>
            <div className="text-white/50 text-xs mt-0.5">{project.tagline}</div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onOpenWorld(project.id); }}
              className="terminal-text text-[8px] px-2 py-1 rounded tracking-widest transition-all hover:opacity-100"
              style={{
                background: `${project.color}15`,
                border: `1px solid ${project.color}40`,
                color: project.color,
                opacity: 0.7,
              }}
            >
              ⬡ WORLD
            </button>
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center animate-pulse-cyan"
              style={{ borderColor: `${project.color}40`, background: `${project.color}10` }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: project.color, boxShadow: `0 0 10px ${project.color}` }}
              />
            </div>
          </div>
        </div>

        <p className="text-white/60 text-sm leading-relaxed mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="terminal-text text-[10px] px-2 py-0.5 rounded border"
              style={{ color: `${project.color}80`, borderColor: `${project.color}20`, background: `${project.color}08` }}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="terminal-text text-[10px] text-white/30">+{project.tech.length - 4}</span>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t pt-4 mt-2" style={{ borderColor: `${project.color}15` }}>
                <div
                  className="flex gap-1 mb-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(["features", "arch"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="terminal-text text-[9px] px-3 py-1 rounded tracking-widest transition-all"
                      style={{
                        background: tab === t ? `${project.color}20` : "transparent",
                        border: `1px solid ${tab === t ? project.color + "50" : project.color + "15"}`,
                        color: tab === t ? project.color : `${project.color}50`,
                      }}
                    >
                      {t === "features" ? "FEATURES" : "ARCHITECTURE"}
                    </button>
                  ))}
                </div>

                {tab === "features" && (
                  <>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {project.features.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <span className="terminal-text text-xs" style={{ color: project.color }}>▸</span>
                          <span className="text-white/70 text-xs">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="terminal-text text-[10px] px-2 py-0.5 rounded border"
                          style={{ color: `${project.color}80`, borderColor: `${project.color}20`, background: `${project.color}08` }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {tab === "arch" && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <div className="terminal-text text-[9px] text-white/30 tracking-widest mb-3">
                      LIVE ARCHITECTURE — ANIMATED DATA FLOW
                    </div>
                    <ArchitectureView projectId={project.id} color={project.color} />
                  </div>
                )}

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`link-github-${project.id}`}
                  className="inline-flex items-center gap-2 terminal-text text-xs px-4 py-2 rounded border transition-all hover:bg-opacity-20 mt-2"
                  style={{
                    color: project.color,
                    borderColor: `${project.color}40`,
                    background: `${project.color}10`,
                  }}
                >
                  &lt;/&gt; VIEW ON GITHUB
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-3">
          <div className="terminal-text text-[10px] text-white/20">
            {expanded ? "CLICK TO COLLAPSE" : "CLICK TO EXPAND"}
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="terminal-text text-xs"
            style={{ color: `${project.color}60` }}
          >
            ▼
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState<string | null>(null);
  const [worldProject, setWorldProject] = useState<string | null>(null);

  const categories = Array.from(new Set(PORTFOLIO_DATA.projects.map((p) => p.category)));
  const filtered = filter ? PORTFOLIO_DATA.projects.filter((p) => p.category === filter) : PORTFOLIO_DATA.projects;

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5ff]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; SCANNING PROJECT NEURAL NODES...
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            NEURAL <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>NETWORK</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            {PORTFOLIO_DATA.projects.length} ACTIVE NODES — EXPAND TO VIEW ARCHITECTURE
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter(null)}
            data-testid="filter-all"
            className="terminal-text text-[10px] px-3 py-1.5 rounded border tracking-widest transition-all"
            style={{
              color: filter === null ? "#050508" : "#00f5ff",
              background: filter === null ? "#00f5ff" : "transparent",
              borderColor: "#00f5ff40",
            }}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat === filter ? null : cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
              className="terminal-text text-[10px] px-3 py-1.5 rounded border tracking-widest transition-all"
              style={{
                color: filter === cat ? "#050508" : "#00f5ff80",
                background: filter === cat ? "#00f5ff" : "transparent",
                borderColor: "#00f5ff20",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpenWorld={setWorldProject} />
          ))}
        </div>
      </div>

      <ProjectWorldModal projectId={worldProject} onClose={() => setWorldProject(null)} />
    </section>
  );
}

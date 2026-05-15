import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const PIPELINE_STAGES = [
  {
    id: "data",
    label: "DATA INGESTION",
    icon: "⬡",
    color: "#00f5ff",
    tools: ["Pandas", "NumPy", "SQL"],
    detail: "Raw data collection from multiple sources, validation, schema enforcement, and deduplication pipelines.",
  },
  {
    id: "features",
    label: "FEATURE ENGINEERING",
    icon: "◈",
    color: "#8b5cf6",
    tools: ["Scikit-learn", "spaCy", "OpenCV"],
    detail: "Feature extraction, normalization, PCA dimensionality reduction, and automated feature selection.",
  },
  {
    id: "train",
    label: "MODEL TRAINING",
    icon: "⬢",
    color: "#00ff88",
    tools: ["PyTorch", "TensorFlow", "Keras"],
    detail: "Distributed training with experiment tracking. Hyperparameter search with Optuna. GPU-accelerated batches.",
  },
  {
    id: "track",
    label: "EXPERIMENT TRACKING",
    icon: "◉",
    color: "#ff8c00",
    tools: ["MLflow", "W&B", "TensorBoard"],
    detail: "Full experiment lineage — parameters, metrics, artifacts, and model registry with version control.",
  },
  {
    id: "validate",
    label: "MODEL VALIDATION",
    icon: "◫",
    color: "#00e5ff",
    tools: ["Evidently", "Great Expectations"],
    detail: "Data drift detection, model performance validation, bias/fairness checks across all production models.",
  },
  {
    id: "build",
    label: "CI/CD BUILD",
    icon: "⬟",
    color: "#ff006e",
    tools: ["GitHub Actions", "Docker", "pytest"],
    detail: "Automated testing pipeline, Docker multi-stage builds, image scanning, and artifact registry push.",
  },
  {
    id: "deploy",
    label: "DEPLOYMENT",
    icon: "◈",
    color: "#00f5ff",
    tools: ["Kubernetes", "Helm", "Terraform"],
    detail: "Rolling deployments to K8s cluster. HPA auto-scaling, resource limits, health checks, rollback support.",
  },
  {
    id: "monitor",
    label: "MONITORING",
    icon: "⬡",
    color: "#00ff88",
    tools: ["MLflow", "Prometheus", "Grafana"],
    detail: "Real-time performance dashboards, latency tracking, prediction drift alerts, and auto-retraining triggers.",
  },
];

const CLOUD_PROVIDERS = [
  { name: "AWS", color: "#ff8c00", icon: "▲" },
  { name: "Azure", color: "#0080ff", icon: "◈" },
  { name: "GCP", color: "#00f5ff", icon: "⬢" },
];

function PipelineStage({
  stage,
  index,
  active,
  onHover,
}: {
  stage: typeof PIPELINE_STAGES[0];
  index: number;
  active: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative flex flex-col items-center"
      onMouseEnter={() => onHover(stage.id)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div
        className="w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
        animate={{
          background: active ? `${stage.color}20` : `${stage.color}08`,
          borderColor: active ? `${stage.color}80` : `${stage.color}20`,
          boxShadow: active ? `0 0 30px ${stage.color}40` : `0 0 10px ${stage.color}10`,
        }}
        style={{ border: `1px solid ${stage.color}20` }}
      >
        <span style={{ color: stage.color, fontSize: 18 }}>{stage.icon}</span>
        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}` }}
          />
        )}
      </motion.div>
      <div
        className="terminal-text text-[8px] tracking-widest text-center mt-2 max-w-[70px] leading-tight"
        style={{ color: active ? stage.color : "rgba(255,255,255,0.4)" }}
      >
        {stage.label}
      </div>
    </motion.div>
  );
}

function FlowArrow({ color, active }: { color: string; active: boolean }) {
  return (
    <div className="flex items-center self-start mt-5 mx-1">
      <div className="h-px w-8 relative overflow-hidden" style={{ background: active ? color : "rgba(255,255,255,0.1)" }}>
        {active && (
          <motion.div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      <div style={{ color: active ? color : "rgba(255,255,255,0.15)", fontSize: 10 }}>▶</div>
    </div>
  );
}

export function MLOpsPipeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [activeCloud, setActiveCloud] = useState(0);

  const hovered = PIPELINE_STAGES.find((s) => s.id === hoveredStage);

  return (
    <section id="mlops" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff8c00]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#ff8c00]/40 text-xs tracking-[0.4em] mb-3">
            &gt; LOADING MLOPS INFRASTRUCTURE...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            MLOPS <span className="text-[#ff8c00]" style={{ textShadow: "0 0 20px #ff8c0044" }}>PIPELINE</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            ENTERPRISE AI INFRASTRUCTURE — HOVER ANY STAGE
          </div>
        </motion.div>

        <div
          className="p-6 rounded-lg mb-8"
          style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(255,140,0,0.15)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="terminal-text text-[10px] text-white/40 tracking-widest">ACTIVE PIPELINE</div>
            <div className="flex gap-2">
              {CLOUD_PROVIDERS.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActiveCloud(i)}
                  className="terminal-text text-[9px] px-2.5 py-1 rounded transition-all"
                  style={{
                    background: activeCloud === i ? `${c.color}20` : "transparent",
                    border: `1px solid ${activeCloud === i ? c.color + "60" : c.color + "20"}`,
                    color: activeCloud === i ? c.color : `${c.color}60`,
                  }}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex items-start gap-0 min-w-max">
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={stage.id} className="flex items-start">
                  <PipelineStage
                    stage={stage}
                    index={i}
                    active={hoveredStage === stage.id}
                    onHover={setHoveredStage}
                  />
                  {i < PIPELINE_STAGES.length - 1 && (
                    <FlowArrow
                      color={stage.color}
                      active={hoveredStage === stage.id}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {hovered ? (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-lg"
              style={{
                background: `${hovered.color}08`,
                border: `1px solid ${hovered.color}30`,
                boxShadow: `0 0 30px ${hovered.color}10`,
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ color: hovered.color, fontSize: 20 }}>{hovered.icon}</span>
                    <div className="font-bold" style={{ fontFamily: "Orbitron, sans-serif", color: hovered.color, fontSize: 14 }}>
                      {hovered.label}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{hovered.detail}</p>
                </div>
                <div className="shrink-0">
                  <div className="terminal-text text-[9px] text-white/30 mb-2 tracking-widest">TOOLS</div>
                  <div className="flex flex-col gap-1.5">
                    {hovered.tools.map((t) => (
                      <span
                        key={t}
                        className="terminal-text text-[10px] px-2.5 py-1 rounded"
                        style={{ background: `${hovered.color}15`, border: `1px solid ${hovered.color}30`, color: hovered.color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-lg text-center"
              style={{ background: "rgba(255,140,0,0.03)", border: "1px solid rgba(255,140,0,0.1)" }}
            >
              <div className="terminal-text text-xs text-white/20 tracking-widest">
                HOVER OVER A PIPELINE STAGE TO VIEW INFRASTRUCTURE DETAILS
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "MODELS DEPLOYED", value: "12+", color: "#00f5ff" },
            { label: "PIPELINE RUNS", value: "240+", color: "#00ff88" },
            { label: "AVG DEPLOY TIME", value: "~6 min", color: "#8b5cf6" },
            { label: "UPTIME SLA", value: "99.9%", color: "#ff8c00" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="p-4 rounded text-center"
              style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}20` }}
            >
              <div className="terminal-text text-2xl font-black mb-1" style={{ color: stat.color, fontFamily: "Orbitron, sans-serif" }}>
                {stat.value}
              </div>
              <div className="terminal-text text-[9px] text-white/40 tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

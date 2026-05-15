import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Metric {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
  status: string;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const INITIAL_METRICS: Metric[] = [
  { label: "GPU LOAD", value: 73, unit: "%", max: 100, color: "#00f5ff", status: "NOMINAL" },
  { label: "LLM NODES", value: 8, unit: "/8", max: 8, color: "#00ff88", status: "ALL ACTIVE" },
  { label: "INFERENCE MS", value: 142, unit: "ms", max: 500, color: "#8b5cf6", status: "FAST" },
  { label: "THREAT LEVEL", value: 12, unit: "%", max: 100, color: "#ff4444", status: "NOMINAL" },
  { label: "PIPELINE", value: 98, unit: "%", max: 100, color: "#00ff88", status: "HEALTHY" },
  { label: "DEPLOYMENT", value: 100, unit: "%", max: 100, color: "#00f5ff", status: "LIVE" },
  { label: "CLOUD SYNC", value: 94, unit: "%", max: 100, color: "#8b5cf6", status: "SYNCED" },
  { label: "AI SECURITY", value: 99, unit: "%", max: 100, color: "#00ff88", status: "SECURE" },
];

function SparkLine({ color, data }: { color: string; data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 20;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommandDashboard() {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [history, setHistory] = useState<Record<string, number[]>>(
    Object.fromEntries(INITIAL_METRICS.map((m) => [m.label, [m.value]]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          let newVal: number;
          if (m.label === "LLM NODES") newVal = 8;
          else if (m.label === "DEPLOYMENT") newVal = 100;
          else if (m.label === "THREAT LEVEL") newVal = randomBetween(5, 25);
          else if (m.label === "INFERENCE MS") newVal = randomBetween(120, 280);
          else newVal = randomBetween(Math.max(0, m.value - 10), Math.min(m.max, m.value + 10));
          return { ...m, value: newVal };
        })
      );
      setMetrics((current) => {
        setHistory((h) =>
          Object.fromEntries(
            current.map((m) => [m.label, [...(h[m.label] || [m.value]).slice(-15), m.value]])
          )
        );
        return current;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 w-6 h-20 flex items-center justify-center"
        style={{
          background: "rgba(5,5,8,0.9)",
          border: "1px solid rgba(0,245,255,0.2)",
          borderLeft: "none",
          borderRadius: "0 6px 6px 0",
        }}
        whileHover={{ x: 2 }}
      >
        <span className="terminal-text text-[#00f5ff]/60" style={{ writingMode: "vertical-rl", fontSize: 8, letterSpacing: 2 }}>
          {open ? "◀" : "▶"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-30 w-64 overflow-hidden"
            style={{
              background: "rgba(5,5,8,0.95)",
              borderRight: "1px solid rgba(0,245,255,0.15)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="p-4 border-b border-[#00f5ff]/10">
              <div className="terminal-text text-xs text-[#00f5ff] tracking-widest">AI COMMAND CENTER</div>
              <div className="terminal-text text-[9px] text-white/30 mt-0.5">REAL-TIME TELEMETRY</div>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-px"
                  style={{ top: `${30 + i * 30}%`, background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.1), transparent)" }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </div>

            <div className="p-3 space-y-2 overflow-y-auto h-full pb-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00ff88]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="terminal-text text-[9px] text-[#00ff88] tracking-widest">SYSTEM ONLINE</span>
                </div>
              </div>

              {metrics.map((m) => (
                <motion.div
                  key={m.label}
                  className="p-2.5 rounded"
                  style={{ background: `${m.color}08`, border: `1px solid ${m.color}20` }}
                  whileHover={{ borderColor: `${m.color}40` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="terminal-text text-[9px] text-white/40 tracking-widest">{m.label}</span>
                    <span className="terminal-text text-[9px]" style={{ color: m.color }}>{m.status}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-0.5">
                      <motion.span
                        key={m.value}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="terminal-text text-lg font-bold"
                        style={{ color: m.color, lineHeight: 1 }}
                      >
                        {m.value}
                      </motion.span>
                      <span className="terminal-text text-[9px] text-white/30">{m.unit}</span>
                    </div>
                    <SparkLine color={m.color} data={history[m.label] || [m.value]} />
                  </div>
                  <div className="mt-1.5 h-0.5 rounded-full bg-white/5">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${(m.value / m.max) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ background: m.color, boxShadow: `0 0 6px ${m.color}60` }}
                    />
                  </div>
                </motion.div>
              ))}

              <div className="mt-4 p-3 rounded" style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.15)" }}>
                <div className="terminal-text text-[9px] text-[#00f5ff]/60 tracking-widest mb-2">ROTATING AI CORE</div>
                <div className="flex justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-[#00f5ff]/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ boxShadow: "0 0 20px rgba(0,245,255,0.2)" }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full border border-[#8b5cf6]/40 flex items-center justify-center"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#00f5ff]/40" style={{ boxShadow: "0 0 10px #00f5ff" }} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <div className="p-2.5 rounded" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}>
                <div className="terminal-text text-[9px] text-white/40 tracking-widest mb-2">LIVE EVENTS</div>
                {[
                  "LLM inference completed 142ms",
                  "Anomaly scan: CLEAR",
                  "Pipeline health: 98%",
                  "Cloud sync: Active",
                ].map((e, i) => (
                  <motion.div
                    key={e}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="terminal-text text-[9px] text-white/40 py-0.5"
                  >
                    <span className="text-[#00ff88]">▸ </span>{e}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

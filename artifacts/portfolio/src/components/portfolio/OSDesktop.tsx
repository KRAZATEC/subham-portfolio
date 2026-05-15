import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

interface AppDef {
  id: string;
  title: string;
  icon: string;
  color: string;
  width: number;
  height: number;
}

const APPS: AppDef[] = [
  { id: "neostats", title: "NeoStats.exe", icon: "◈", color: "#00f5ff", width: 560, height: 420 },
  { id: "aisoc", title: "AISOC.exe", icon: "⬡", color: "#ff4444", width: 580, height: 440 },
  { id: "neurallab", title: "NeuralLab.exe", icon: "⬢", color: "#8b5cf6", width: 520, height: 400 },
  { id: "threatcenter", title: "ThreatCenter.exe", icon: "◉", color: "#ff8c00", width: 560, height: 420 },
  { id: "healthai", title: "HealthAI.exe", icon: "⬟", color: "#00ff88", width: 520, height: 400 },
  { id: "resumearchive", title: "ResumeArchive.exe", icon: "◫", color: "#00e5ff", width: 600, height: 480 },
];

interface WindowState {
  id: string;
  minimized: boolean;
  zIndex: number;
  defaultX: number;
  defaultY: number;
}

function DraggableWindow({
  app,
  win,
  onFocus,
  onMinimize,
  onClose,
}: {
  app: AppDef;
  win: WindowState;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onClose: (id: string) => void;
}) {
  const x = useMotionValue(win.defaultX);
  const y = useMotionValue(win.defaultY);
  const dragRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {!win.minimized && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          dragListener={false}
          style={{
            x,
            y,
            position: "absolute",
            zIndex: win.zIndex,
            width: app.width,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onMouseDown={() => onFocus(app.id)}
          ref={dragRef}
        >
          <div
            className="rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${app.color}40`,
              background: "rgba(5,5,8,0.96)",
              boxShadow: `0 0 60px ${app.color}20, 0 20px 40px rgba(0,0,0,0.8)`,
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              className="flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing select-none"
              style={{
                background: `linear-gradient(90deg, ${app.color}15 0%, rgba(5,5,8,0.8) 100%)`,
                borderBottom: `1px solid ${app.color}20`,
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                const startX = e.clientX - x.get();
                const startY = e.clientY - y.get();
                const onMove = (me: PointerEvent) => {
                  x.set(me.clientX - startX);
                  y.set(me.clientY - startY);
                };
                const onUp = () => {
                  window.removeEventListener("pointermove", onMove);
                  window.removeEventListener("pointerup", onUp);
                };
                window.addEventListener("pointermove", onMove);
                window.addEventListener("pointerup", onUp);
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: app.color, fontSize: 14 }}>{app.icon}</span>
                <span className="terminal-text text-xs tracking-widest" style={{ color: app.color }}>
                  {app.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onMinimize(app.id)}
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: "#ff8c00" }}
                />
                <button
                  onClick={() => onClose(app.id)}
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: "#ff4444" }}
                />
              </div>
            </motion.div>

            <div
              className="overflow-auto scanline"
              style={{ height: app.height - 42, padding: "16px" }}
            >
              <WindowContent appId={app.id} color={app.color} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WindowContent({ appId, color }: { appId: string; color: string }) {
  const neo = PORTFOLIO_DATA.projects.find((p) => p.id === "neo-stats");
  const soc = PORTFOLIO_DATA.projects.find((p) => p.id === "ai-soc");
  const health = PORTFOLIO_DATA.projects.find((p) => p.id === "healthcare-agent");

  if (appId === "neostats") {
    return (
      <div className="space-y-4">
        <div className="terminal-text text-xs" style={{ color }}>▸ NEO-STATS INTELLIGENCE HUB</div>
        <div className="text-white/70 text-sm leading-relaxed">{neo?.description}</div>
        <div className="grid grid-cols-3 gap-3">
          {["RAG", "Multi-LLM", "ChromaDB", "Streamlit", "Python", "Orchestration"].map((t) => (
            <div key={t} className="p-2 rounded text-center terminal-text text-[10px]"
              style={{ background: `${color}10`, border: `1px solid ${color}20`, color: `${color}` }}>
              {t}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="terminal-text text-[10px] text-white/40 tracking-widest">ARCHITECTURE FLOW</div>
          <div className="flex items-center gap-2 flex-wrap">
            {["USER", "→", "STREAMLIT", "→", "ORCHESTRATOR", "→", "ChromaDB", "→", "GPT-4 / GROQ", "→", "RESPONSE"].map((n, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="terminal-text text-[10px]"
                style={{ color: n === "→" ? "rgba(255,255,255,0.3)" : color }}
              >
                {n}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Multi-LLM Routing", "Vector DB Search", "Context Retrieval", "Response Synthesis"].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-white/60 text-xs">{f}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === "aisoc") {
    return (
      <div className="space-y-4">
        <div className="terminal-text text-xs" style={{ color }}>▸ AI-SOC SECURITY OPERATIONS CENTER</div>
        <div className="text-white/70 text-sm leading-relaxed">{soc?.description}</div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "THREAT LEVEL", value: "NOMINAL", ok: true },
            { label: "ANOMALIES", value: "0 DETECTED", ok: true },
            { label: "PACKETS/SEC", value: "14,293", ok: true },
            { label: "SYSTEM HEALTH", value: "98.7%", ok: true },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
              <div className="terminal-text text-[9px] text-white/40 tracking-widest">{m.label}</div>
              <div className="terminal-text text-sm mt-1" style={{ color }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="terminal-text text-[10px] text-white/40">RECENT EVENTS</div>
          {["[INFO] System initialized successfully", "[SCAN] Network baseline established", "[OK] No anomalies detected in last 24h", "[OK] Docker containers healthy"].map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="terminal-text text-[11px] text-white/50">{e}</motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === "neurallab") {
    return (
      <div className="space-y-4">
        <div className="terminal-text text-xs" style={{ color }}>▸ NEURAL INTELLIGENCE MATRIX</div>
        {PORTFOLIO_DATA.skills.map((skill) => (
          <div key={skill.category}>
            <div className="terminal-text text-[10px] mb-2 tracking-widest" style={{ color: skill.color }}>
              {skill.category}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {skill.items.map((item) => (
                <span key={item} className="terminal-text text-[10px] px-2 py-0.5 rounded"
                  style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}20`, color: skill.color }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appId === "threatcenter") {
    return (
      <div className="space-y-4">
        <div className="terminal-text text-xs" style={{ color }}>▸ THREAT INTELLIGENCE CENTER</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "ACTIVE THREATS", value: "0", status: "CLEAR" },
            { label: "PHISHING SCANS", value: "1,247", status: "COMPLETE" },
            { label: "INTRUSIONS BLOCKED", value: "893", status: "ACTIVE" },
            { label: "PII REDACTIONS", value: "4,562", status: "PROCESSED" },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
              <div className="terminal-text text-[9px] text-white/40 tracking-widest">{m.label}</div>
              <div className="terminal-text text-xl mt-1 font-bold" style={{ color }}>{m.value}</div>
              <div className="terminal-text text-[9px] mt-1" style={{ color: `${color}80` }}>{m.status}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="terminal-text text-[10px] text-white/40">THREAT MATRIX</div>
          {[
            { label: "Phishing Detection", pct: 99.2, color: "#00ff88" },
            { label: "Anomaly Detection", pct: 97.8, color: "#00f5ff" },
            { label: "PII Accuracy", pct: 98.5, color: "#8b5cf6" },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/50">{m.label}</span>
                <span style={{ color: m.color }}>{m.pct}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === "healthai") {
    return (
      <div className="space-y-4">
        <div className="terminal-text text-xs" style={{ color }}>▸ HEALTHCARE AI DIAGNOSTIC SYSTEM</div>
        <div className="text-white/70 text-sm leading-relaxed">{health?.description}</div>
        <div className="grid grid-cols-2 gap-3">
          {["Groq LLM", "Medical Imaging", "Multimodal AI", "Clinical Support"].map((t) => (
            <div key={t} className="p-2 rounded text-center terminal-text text-[10px]"
              style={{ background: `${color}10`, border: `1px solid ${color}20`, color }}>
              {t}
            </div>
          ))}
        </div>
        <div className="space-y-2 mt-2">
          <div className="terminal-text text-[10px] text-white/40 tracking-widest">DIAGNOSTIC PIPELINE</div>
          {["Medical Query / Image Input", "Multimodal Processor", "Groq LLM Reasoning", "Medical Knowledge Base", "Clinical Decision Output"].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-white/60 text-xs">{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === "resumearchive") {
    return (
      <div className="space-y-4">
        <div className="terminal-text text-xs" style={{ color }}>▸ RESUME INTELLIGENCE ARCHIVE</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded space-y-1" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
            <div className="terminal-text text-[9px] text-white/40">IDENTITY</div>
            <div className="text-sm font-bold" style={{ fontFamily: "Orbitron, sans-serif", color }}>SUBHAM PATRO</div>
            <div className="text-white/50 text-[11px]">AI/ML Engineer</div>
          </div>
          <div className="p-3 rounded space-y-1" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
            <div className="terminal-text text-[9px] text-white/40">EDUCATION</div>
            <div className="text-white/80 text-[11px]">Gitam University</div>
            <div className="text-white/50 text-[11px]">B.Tech CS — GPA 8.13</div>
          </div>
        </div>
        <div>
          <div className="terminal-text text-[10px] text-white/40 mb-2 tracking-widest">ACTIVE MISSIONS</div>
          {PORTFOLIO_DATA.experience.map((e) => (
            <div key={e.id} className="p-3 rounded mb-2" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
              <div className="terminal-text text-[10px]" style={{ color: e.color }}>{e.role}</div>
              <div className="text-white/70 text-xs">{e.company}</div>
              <div className="terminal-text text-[9px] text-white/30 mt-0.5">{e.period}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="terminal-text text-[10px] text-white/40 mb-2 tracking-widest">CERTIFICATIONS ({PORTFOLIO_DATA.certifications.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {PORTFOLIO_DATA.certifications.map((c) => (
              <span key={c.code} className="terminal-text text-[9px] px-2 py-0.5 rounded"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color }}>
                {c.code}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface OSDesktopProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OSDesktop({ isOpen, onClose }: OSDesktopProps) {
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [zCounter, setZCounter] = useState(100);

  const openApp = (id: string) => {
    const existing = openWindows.find((w) => w.id === id);
    if (existing) {
      if (existing.minimized) {
        setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: false, zIndex: zCounter + 1 } : w));
        setZCounter((z) => z + 1);
      } else {
        focusWindow(id);
      }
      return;
    }
    const idx = APPS.findIndex((a) => a.id === id);
    const offsetX = 80 + idx * 30;
    const offsetY = 60 + idx * 25;
    setOpenWindows((prev) => [
      ...prev,
      { id, minimized: false, zIndex: zCounter + 1, defaultX: offsetX, defaultY: offsetY },
    ]);
    setZCounter((z) => z + 1);
  };

  const focusWindow = (id: string) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, zIndex: zCounter + 1 } : w));
    setZCounter((z) => z + 1);
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: true } : w));
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const time = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ background: "#020206" }}
        >
          <div
            className="absolute inset-0 grid-bg opacity-30 pointer-events-none"
            style={{ backgroundSize: "60px 60px" }}
          />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 300 + i * 100,
                height: 300 + i * 100,
                left: `${10 + i * 15}%`,
                top: `${5 + i * 10}%`,
                background: `radial-gradient(circle, ${["#00f5ff", "#8b5cf6", "#00ff88"][i % 3]}08 0%, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-2 z-10"
            style={{ background: "rgba(5,5,8,0.8)", borderBottom: "1px solid rgba(0,245,255,0.1)" }}
          >
            <div className="flex items-center gap-4">
              <span className="terminal-text text-xs text-[#00f5ff] tracking-widest">SUBHAM OS v2.0.26</span>
              <span className="terminal-text text-[10px] text-white/30">AI SECURITY COMMAND CENTER</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="terminal-text text-xs text-[#00ff88] animate-pulse">● SYSTEM ONLINE</span>
              <span className="terminal-text text-xs text-white/50">{time}</span>
              <button
                onClick={onClose}
                className="terminal-text text-[10px] px-3 py-1 rounded border border-[#ff4444]/40 text-[#ff4444] hover:bg-[#ff4444]/10 transition-all"
              >
                EXIT OS
              </button>
            </div>
          </div>

          <div className="absolute inset-0 pt-10 pb-16 overflow-hidden">
            {APPS.map((app) => {
              const win = openWindows.find((w) => w.id === app.id);
              if (!win) return null;
              return (
                <DraggableWindow
                  key={app.id}
                  app={app}
                  win={win}
                  onFocus={focusWindow}
                  onMinimize={minimizeWindow}
                  onClose={closeWindow}
                />
              );
            })}
          </div>

          {openWindows.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 pb-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-6xl font-black mb-4 glow-cyan" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff20" }}>
                  SUBHAM OS
                </div>
                <div className="terminal-text text-xs text-white/20 tracking-widest">
                  CLICK AN APPLICATION IN THE DOCK TO LAUNCH
                </div>
              </motion.div>
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 py-3 px-6"
            style={{ background: "rgba(5,5,8,0.85)", borderTop: "1px solid rgba(0,245,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            {APPS.map((app) => {
              const win = openWindows.find((w) => w.id === app.id);
              const isOpen = !!win;
              const isMinimized = win?.minimized;
              return (
                <motion.button
                  key={app.id}
                  onClick={() => openApp(app.id)}
                  whileHover={{ scale: 1.15, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex flex-col items-center gap-1 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all"
                    style={{
                      background: isOpen ? `${app.color}20` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isOpen ? app.color + "60" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: isOpen ? `0 0 20px ${app.color}30` : "none",
                      color: app.color,
                    }}
                  >
                    {app.icon}
                  </div>
                  <span className="terminal-text text-[8px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap"
                    style={{ color: app.color }}>
                    {app.title}
                  </span>
                  {isOpen && !isMinimized && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full" style={{ background: app.color }} />
                  )}
                  {isMinimized && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/30" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

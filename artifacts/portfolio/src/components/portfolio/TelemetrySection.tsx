import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const LANGUAGE_DATA = [
  { skill: "Python", value: 95 },
  { skill: "PyTorch/TF", value: 88 },
  { skill: "JavaScript", value: 75 },
  { skill: "Docker/K8s", value: 82 },
  { skill: "SQL", value: 78 },
  { skill: "LangChain", value: 90 },
];

const COMMIT_DATA = [
  { month: "Jun", commits: 34 },
  { month: "Jul", commits: 52 },
  { month: "Aug", commits: 41 },
  { month: "Sep", commits: 63 },
  { month: "Oct", commits: 78 },
  { month: "Nov", commits: 55 },
  { month: "Dec", commits: 49 },
  { month: "Jan", commits: 67 },
  { month: "Feb", commits: 91 },
  { month: "Mar", commits: 88 },
  { month: "Apr", commits: 112 },
  { month: "May", commits: 94 },
];

const REPOS = [
  { name: "AI-SOC-Platform", lang: "Python", stars: 12, color: "#ff006e", desc: "ML-powered Security Operations Center" },
  { name: "Neo-Stats", lang: "Python", stars: 19, color: "#00f5ff", desc: "Multi-LLM RAG Intelligence Hub" },
  { name: "Presidio-PII-Detector", lang: "Python", stars: 8, color: "#00e5ff", desc: "Production-grade PII Redaction API" },
  { name: "AI-NIDS", lang: "Python", stars: 15, color: "#ff4444", desc: "Network Intrusion Detection System" },
];

const CONTRIBUTION_GRID = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const val = Math.random();
    const hasActivity = Math.random() > 0.35;
    return hasActivity ? val : 0;
  })
);

function ContributionCell({ value, delay }: { value: number; delay: number }) {
  const color =
    value === 0 ? "rgba(255,255,255,0.04)" :
    value < 0.25 ? "rgba(0,245,255,0.2)" :
    value < 0.5 ? "rgba(0,245,255,0.45)" :
    value < 0.75 ? "rgba(0,245,255,0.7)" :
    "rgba(0,245,255,0.95)";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
      className="w-2.5 h-2.5 rounded-sm"
      style={{ background: color, border: "1px solid rgba(0,0,0,0.2)" }}
      title={value > 0 ? `${Math.round(value * 10)} contributions` : "No contributions"}
    />
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="terminal-text text-[10px] px-2 py-1.5 rounded"
        style={{ background: "rgba(5,5,8,0.95)", border: "1px solid rgba(0,245,255,0.3)", color: "#00f5ff" }}>
        <div>{label}: <span className="font-bold">{payload[0].value}</span> commits</div>
      </div>
    );
  }
  return null;
}

export function TelemetrySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredRepo, setHoveredRepo] = useState<string | null>(null);

  const totalCommits = COMMIT_DATA.reduce((a, b) => a + b.commits, 0);

  return (
    <section id="telemetry" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5ff]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; SYNCHRONIZING DEVELOPMENT TELEMETRY...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            DEVELOPMENT <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>TELEMETRY</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            GITHUB INTELLIGENCE DASHBOARD — KRAZATEC
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "REPOSITORIES", value: "15+", color: "#00f5ff" },
            { label: "TOTAL COMMITS", value: totalCommits.toLocaleString(), color: "#8b5cf6" },
            { label: "AI PROJECTS", value: "8", color: "#00ff88" },
            { label: "GITHUB HANDLE", value: "KRAZATEC", color: "#ff8c00" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded text-center hologram"
              style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}20` }}
            >
              <div className="terminal-text text-xl font-black mb-1" style={{ color: stat.color, fontFamily: "Orbitron, sans-serif" }}>
                {stat.value}
              </div>
              <div className="terminal-text text-[9px] text-white/40 tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-lg mb-6"
          style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(0,245,255,0.15)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="terminal-text text-xs text-[#00f5ff]/60 tracking-widest">CONTRIBUTION ACTIVITY</div>
            <div className="terminal-text text-[9px] text-white/30">May 2025 — May 2026</div>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
              {CONTRIBUTION_GRID.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((val, di) => (
                    <ContributionCell
                      key={di}
                      value={val}
                      delay={inView ? (wi * 7 + di) * 0.002 : 0}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="terminal-text text-[8px] text-white/20">LESS</span>
            {["rgba(255,255,255,0.04)", "rgba(0,245,255,0.2)", "rgba(0,245,255,0.45)", "rgba(0,245,255,0.7)", "rgba(0,245,255,0.95)"].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
            ))}
            <span className="terminal-text text-[8px] text-white/20">MORE</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="p-5 rounded-lg"
            style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(139,92,246,0.15)" }}
          >
            <div className="terminal-text text-xs text-[#8b5cf6]/60 tracking-widest mb-4">SKILL RADAR</div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={LANGUAGE_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-lg"
            style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(0,245,255,0.15)" }}
          >
            <div className="terminal-text text-xs text-[#00f5ff]/60 tracking-widest mb-4">COMMIT ACTIVITY</div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COMMIT_DATA} barCategoryGap="20%">
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,245,255,0.04)" }} />
                  <Bar dataKey="commits" radius={[2, 2, 0, 0]}>
                    {COMMIT_DATA.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.commits > 80 ? "#00f5ff" : "#00f5ff60"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPOS.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              onMouseEnter={() => setHoveredRepo(repo.name)}
              onMouseLeave={() => setHoveredRepo(null)}
              className="p-4 rounded-lg transition-all hologram cursor-pointer"
              style={{
                background: `${repo.color}06`,
                border: `1px solid ${hoveredRepo === repo.name ? repo.color + "50" : repo.color + "15"}`,
                boxShadow: hoveredRepo === repo.name ? `0 0 25px ${repo.color}15` : "none",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: repo.color }} />
                    <span className="terminal-text text-xs font-bold" style={{ color: repo.color }}>{repo.name}</span>
                  </div>
                  <p className="text-white/50 text-[11px] mb-2">{repo.desc}</p>
                  <div className="flex items-center gap-3">
                    <span className="terminal-text text-[9px] text-white/30">{repo.lang}</span>
                    <span className="terminal-text text-[9px]" style={{ color: `${repo.color}80` }}>
                      ★ {repo.stars}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://github.com/KRAZATEC`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-text text-[9px] px-2 py-1 rounded border transition-all hover:opacity-80 shrink-0"
                  style={{ color: repo.color, borderColor: `${repo.color}30`, background: `${repo.color}10` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  VIEW
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

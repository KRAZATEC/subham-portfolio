import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const CAPABILITY_DATA = [
  { skill: "Generative AI", value: 95 },
  { skill: "MLOps", value: 88 },
  { skill: "Cybersecurity", value: 90 },
  { skill: "Cloud Infra", value: 82 },
  { skill: "LLM Eng.", value: 93 },
  { skill: "System Design", value: 85 },
];

const ROLE_MATCHES = [
  { role: "AI/ML Engineer", match: 97, color: "#00f5ff", why: "LLM engineering, RAG systems, production ML pipelines" },
  { role: "MLOps Engineer", match: 91, color: "#00ff88", why: "Docker, Kubernetes, MLflow, CI/CD automation" },
  { role: "AI Security Engineer", match: 93, color: "#ff4444", why: "AI NIDS, SOC platform, phishing detection systems" },
  { role: "Generative AI Engineer", match: 95, color: "#8b5cf6", why: "LangChain, LangGraph, multi-agent orchestration" },
];

const SCAN_SEQUENCE = [
  "Initializing candidate profile analysis...",
  "Loading resume intelligence vectors...",
  "Scanning skill clusters: AI/ML, Security, Cloud...",
  "Cross-referencing against 10,000+ role requirements...",
  "Analyzing project architecture complexity...",
  "Evaluating enterprise readiness indicators...",
  "Running internship impact assessment...",
  "Generating capability matrix...",
  "ANALYSIS COMPLETE — Candidate: T SUBHAM PATRO",
];

const STRENGTHS = [
  { label: "GENERATIVE AI SYSTEMS", detail: "LLM orchestration, RAG pipelines, multi-agent workflows", color: "#8b5cf6" },
  { label: "AI SECURITY ARCHITECTURE", detail: "NIDS, SOC platforms, anti-phishing, PII protection", color: "#ff4444" },
  { label: "ENTERPRISE MLOPS", detail: "Docker, K8s, MLflow, GitHub Actions, cloud deployment", color: "#00ff88" },
  { label: "CLOUD-NATIVE INFRASTRUCTURE", detail: "AWS/Azure/GCP certified, infrastructure-as-code", color: "#ff8c00" },
];

export function RecruiterAnalysis() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [scanIdx, setScanIdx] = useState(-1);
  const [scanDone, setScanDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
      let i = 0;
      const next = () => {
        if (i < SCAN_SEQUENCE.length) {
          setScanIdx(i);
          i++;
          setTimeout(next, 400 + Math.random() * 200);
        } else {
          setTimeout(() => setScanDone(true), 600);
        }
      };
      setTimeout(next, 500);
    }
  }, [inView, started]);

  return (
    <section id="recruiter" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#00ff88]/40 text-xs tracking-[0.4em] mb-3">
            &gt; CANDIDATE INTELLIGENCE SCAN INITIATED...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            CANDIDATE <span className="text-[#00ff88]" style={{ textShadow: "0 0 20px #00ff8844" }}>INTELLIGENCE</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            AI-POWERED RECRUITER ANALYSIS ENGINE
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-lg" style={{ background: "rgba(5,5,8,0.9)", border: "1px solid rgba(0,255,136,0.2)" }}>
            <div className="terminal-text text-xs text-[#00ff88]/60 tracking-widest mb-4">ANALYSIS SEQUENCE</div>
            <div className="space-y-1.5 h-56 overflow-hidden">
              {SCAN_SEQUENCE.slice(0, scanIdx + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="terminal-text text-xs flex items-start gap-2"
                  style={{ color: i === SCAN_SEQUENCE.length - 1 ? "#00ff88" : "rgba(255,255,255,0.6)" }}
                >
                  <span style={{ color: "#00ff88", opacity: 0.5 }}>
                    {i < scanIdx ? "✓" : i === scanIdx ? "▸" : " "}
                  </span>
                  {line}
                </motion.div>
              ))}
              {!scanDone && scanIdx >= 0 && (
                <motion.div
                  className="terminal-text text-xs text-[#00ff88]/40"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  ▌
                </motion.div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-lg" style={{ background: "rgba(5,5,8,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="terminal-text text-xs text-[#8b5cf6]/60 tracking-widest mb-4">CAPABILITY RADAR</div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={CAPABILITY_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  />
                  <Radar
                    name="Capability"
                    dataKey="value"
                    stroke="#00ff88"
                    fill="#00ff88"
                    fillOpacity={scanDone ? 0.2 : 0}
                    strokeWidth={scanDone ? 1.5 : 0}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {scanDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="p-5 rounded-lg" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.25)" }}>
                <div className="terminal-text text-xs text-[#00ff88]/60 tracking-widest mb-4">ADVANCED EXPERTISE CONFIRMED</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STRENGTHS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 rounded"
                      style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}
                    >
                      <div className="terminal-text text-[9px] font-bold tracking-widest mb-1" style={{ color: s.color }}>
                        ▸ {s.label}
                      </div>
                      <div className="text-white/50 text-[11px]">{s.detail}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <div className="terminal-text text-[10px] text-white/30 tracking-widest mb-4">ROLE MATCH ANALYSIS</div>
                <div className="space-y-3">
                  {ROLE_MATCHES.map((role, i) => (
                    <motion.div
                      key={role.role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="p-4 rounded-lg"
                      style={{ background: `${role.color}06`, border: `1px solid ${role.color}20` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif", color: role.color, fontSize: 12 }}>
                            {role.role}
                          </div>
                          <div className="text-white/40 text-[10px] mt-0.5">{role.why}</div>
                        </div>
                        <div
                          className="terminal-text text-xl font-black"
                          style={{ color: role.color, fontFamily: "Orbitron, sans-serif" }}
                        >
                          {role.match}%
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${role.match}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: role.color, boxShadow: `0 0 8px ${role.color}60` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="p-5 rounded-lg text-center"
                style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.3)" }}
              >
                <div className="terminal-text text-xs text-[#00ff88]/60 tracking-widest mb-2">FINAL ASSESSMENT</div>
                <div className="text-white/80 text-sm leading-relaxed max-w-2xl mx-auto">
                  Subham demonstrates <span className="text-[#00ff88]">exceptional senior-level AI engineering capabilities</span> for a 3rd-year undergraduate.
                  The combination of production deployments, enterprise internship experience, and 9 cloud certifications
                  places this profile in the <span className="text-[#00f5ff]">top 3%</span> of AI engineering candidates.
                </div>
                <a
                  href="mailto:subham.t.patro.2005@gmail.com"
                  className="inline-block mt-4 terminal-text text-xs px-6 py-2.5 rounded border transition-all hover:bg-[#00ff88]/20"
                  style={{ color: "#00ff88", borderColor: "rgba(0,255,136,0.4)" }}
                >
                  INITIATE CONTACT PROTOCOL
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const ERA_DETAILS = {
  "2023": {
    environment: "INITIALIZING",
    skills: ["Python", "Algorithms", "ML Basics"],
    achievement: "Enrolled in B.Tech CS & Business Systems",
  },
  "2024": {
    environment: "DEVELOPING",
    skills: ["Deep Learning", "OpenCV", "spaCy", "Scikit-learn"],
    achievement: "Built first production ML pipeline + AI NIDS",
  },
  "2025": {
    environment: "ENGINEERING",
    skills: ["LangChain", "LangGraph", "FastAPI", "Docker", "RAG"],
    achievement: "Mastered LLM engineering — 5 AI projects deployed",
  },
  "2026": {
    environment: "ENTERPRISE",
    skills: ["MLOps", "K8s", "Cloud", "BFSI AI", "Security"],
    achievement: "Dual internships — Enterprise AI at scale",
  },
};

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeYear, setActiveYear] = useState<string | null>(null);

  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/3 to-transparent" />
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${15 + i * 20}%`,
              top: `${10 + i * 15}%`,
              background: `radial-gradient(circle, ${PORTFOLIO_DATA.timeline[i]?.color || "#00f5ff"}06 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; ACCESSING MEMORY CORE...
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            MEMORY <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>CORE</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            AI ENGINEER EVOLUTION — CINEMATIC TIMELINE ARCHIVE
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px">
            <motion.div
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full"
              style={{ background: "linear-gradient(to bottom, #00f5ff80, #8b5cf680, #00ff8880, #ff8c0080)" }}
            />
          </div>

          <div className="space-y-10">
            {PORTFOLIO_DATA.timeline.map((node, i) => {
              const era = ERA_DETAILS[node.year as keyof typeof ERA_DETAILS];
              const isActive = activeYear === node.year;
              return (
                <motion.div
                  key={node.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.18 }}
                  className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row items-start gap-8`}
                >
                  <div className={`hidden md:flex ${i % 2 === 0 ? "w-1/2 justify-end" : "w-1/2 justify-start"}`}>
                    {isActive && era && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded max-w-xs ${i % 2 === 0 ? "mr-8 text-right" : "ml-8 text-left"}`}
                        style={{ background: `${node.color}08`, border: `1px solid ${node.color}25` }}
                      >
                        <div className="terminal-text text-[9px] tracking-widest mb-2" style={{ color: `${node.color}60` }}>
                          ERA STATUS
                        </div>
                        <div className="terminal-text text-xs mb-3" style={{ color: node.color }}>{era.environment}</div>
                        <div className="terminal-text text-[9px] text-white/30 mb-1.5 tracking-widest">SKILLS UNLOCKED</div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {era.skills.map((s) => (
                            <span key={s} className="terminal-text text-[9px] px-1.5 py-0.5 rounded"
                              style={{ background: `${node.color}15`, color: node.color, border: `1px solid ${node.color}20` }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="absolute left-0 md:left-1/2 w-8 h-8 -translate-x-0 md:-translate-x-4 flex items-center justify-center z-10">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveYear(isActive ? null : node.year)}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: node.color,
                        background: isActive ? node.color : "#050508",
                        boxShadow: `0 0 ${isActive ? 30 : 15}px ${node.color}${isActive ? "80" : "40"}`,
                      }}
                      data-testid={`button-timeline-${node.year}`}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: isActive ? "#050508" : node.color }}
                      />
                    </motion.button>
                  </div>

                  <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:w-1/2 md:pl-8" : "md:w-1/2 md:pr-8"}`}>
                    <motion.div
                      className="p-5 rounded border cursor-pointer hologram transition-all"
                      style={{
                        borderColor: isActive ? `${node.color}50` : `${node.color}20`,
                        background: `linear-gradient(135deg, rgba(5,5,8,0.95) 0%, ${node.color}06 100%)`,
                        boxShadow: isActive ? `0 0 40px ${node.color}20, 0 0 80px ${node.color}08` : `0 0 10px ${node.color}08`,
                      }}
                      onClick={() => setActiveYear(isActive ? null : node.year)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <motion.span
                          className="text-3xl font-black"
                          style={{ fontFamily: "Orbitron, sans-serif", color: node.color, textShadow: `0 0 20px ${node.color}60` }}
                          animate={isActive ? { textShadow: [`0 0 20px ${node.color}60`, `0 0 40px ${node.color}`, `0 0 20px ${node.color}60`] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {node.year}
                        </motion.span>
                        <div>
                          <span
                            className="terminal-text text-[10px] px-2 py-0.5 rounded border tracking-widest"
                            style={{ color: node.color, borderColor: `${node.color}40`, background: `${node.color}15` }}
                          >
                            {node.label}
                          </span>
                          {era && isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="terminal-text text-[9px] mt-1 text-white/40"
                            >
                              {era.achievement}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 mt-3 pt-3 border-t" style={{ borderColor: `${node.color}15` }}>
                              {node.events.map((ev, j) => (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.08 }}
                                  className="flex gap-2"
                                >
                                  <span className="terminal-text text-xs mt-0.5" style={{ color: node.color }}>▸</span>
                                  <p className="text-white/70 text-sm">{ev}</p>
                                </motion.div>
                              ))}
                            </div>

                            {era && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-3 pt-3 border-t md:hidden"
                                style={{ borderColor: `${node.color}10` }}
                              >
                                <div className="terminal-text text-[9px] text-white/30 mb-1.5 tracking-widest">SKILLS UNLOCKED</div>
                                <div className="flex flex-wrap gap-1">
                                  {era.skills.map((s) => (
                                    <span key={s} className="terminal-text text-[9px] px-1.5 py-0.5 rounded"
                                      style={{ background: `${node.color}15`, color: node.color, border: `1px solid ${node.color}20` }}>
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isActive && (
                        <div className="terminal-text text-[10px] text-white/30 mt-1">
                          {node.events.length} MILESTONES — CLICK TO UNLOCK
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 p-6 rounded-lg text-center"
          style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.15)" }}
        >
          <div className="terminal-text text-[10px] text-[#00f5ff]/50 tracking-widest mb-2">CURRENT MISSION</div>
          <div className="text-white/80 text-sm leading-relaxed max-w-2xl mx-auto">
            Building enterprise AI systems at the intersection of{" "}
            <span className="text-[#00f5ff]">machine learning</span>,{" "}
            <span className="text-[#8b5cf6]">generative AI</span>,{" "}
            <span className="text-[#ff8c00]">MLOps</span>, and{" "}
            <span className="text-[#ff4444]">cybersecurity</span>.
            Currently contributing to Sense AI at JMR Infotech — powering the BFSI domain with production-grade AI.
          </div>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            {["Gitam University • GPA 8.13", "B.Tech CS & Business Systems", "Expected 2027"].map((tag) => (
              <span key={tag} className="terminal-text text-[10px] px-3 py-1 rounded border border-[#00f5ff]/15 text-white/40">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

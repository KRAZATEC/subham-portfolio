import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeYear, setActiveYear] = useState<string | null>(null);

  return (
    <section id="about" className="py-24 px-4 relative">
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
            AI ENGINEER EVOLUTION — TIMELINE ARCHIVE
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f5ff]/60 via-[#8b5cf6]/60 to-[#00ff88]/60" />

          <div className="space-y-8">
            {PORTFOLIO_DATA.timeline.map((node, i) => (
              <motion.div
                key={node.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row items-start gap-8`}
              >
                <div
                  className={`hidden md:flex ${i % 2 === 0 ? "w-1/2 justify-end" : "w-1/2 justify-start"} pr-8 pl-8`}
                >
                  <div />
                </div>

                <div className="absolute left-0 md:left-1/2 w-8 h-8 -translate-x-0 md:-translate-x-4 flex items-center justify-center z-10">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveYear(activeYear === node.year ? null : node.year)}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: node.color,
                      background: activeYear === node.year ? node.color : "#050508",
                      boxShadow: `0 0 20px ${node.color}60`,
                    }}
                    data-testid={`button-timeline-${node.year}`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: activeYear === node.year ? "#050508" : node.color }}
                    />
                  </motion.button>
                </div>

                <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:w-1/2 md:pl-8" : "md:w-1/2 md:pr-8"}`}>
                  <div
                    className="p-5 rounded border cursor-pointer hologram transition-all"
                    style={{
                      borderColor: activeYear === node.year ? `${node.color}50` : `${node.color}20`,
                      background: `linear-gradient(135deg, rgba(5,5,8,0.95) 0%, ${node.color}06 100%)`,
                      boxShadow: activeYear === node.year ? `0 0 30px ${node.color}20` : `0 0 10px ${node.color}08`,
                    }}
                    onClick={() => setActiveYear(activeYear === node.year ? null : node.year)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-2xl font-black"
                        style={{ fontFamily: "Orbitron, sans-serif", color: node.color, textShadow: `0 0 15px ${node.color}60` }}
                      >
                        {node.year}
                      </span>
                      <span
                        className="terminal-text text-[10px] px-2 py-0.5 rounded border tracking-widest"
                        style={{ color: node.color, borderColor: `${node.color}40`, background: `${node.color}15` }}
                      >
                        {node.label}
                      </span>
                    </div>

                    <AnimatePresence>
                      {activeYear === node.year && (
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
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {activeYear !== node.year && (
                      <div className="terminal-text text-[10px] text-white/30 mt-1">
                        {node.events.length} MILESTONES — CLICK TO EXPAND
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

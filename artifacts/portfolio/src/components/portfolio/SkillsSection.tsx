import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

export function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; MAPPING NEURAL SKILL CLUSTERS...
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            INTELLIGENCE <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>MATRIX</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            INTERCONNECTED AI SKILL MODULES — HOVER TO INSPECT
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO_DATA.skills.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: gi * 0.1 }}
              className="p-5 rounded border backdrop-blur-sm hologram"
              style={{
                borderColor: `${group.color}25`,
                background: `linear-gradient(135deg, rgba(5,5,8,0.95) 0%, ${group.color}06 100%)`,
                boxShadow: `0 0 20px ${group.color}10`,
              }}
              data-testid={`card-skill-${gi}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded border flex items-center justify-center text-sm"
                  style={{ borderColor: `${group.color}40`, background: `${group.color}15` }}
                >
                  {group.icon}
                </div>
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ fontFamily: "Orbitron, sans-serif", color: group.color, textShadow: `0 0 10px ${group.color}50` }}
                  >
                    {group.category}
                  </div>
                  <div className="terminal-text text-[9px] text-white/30 tracking-widest">
                    {group.items.length} MODULES
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.items.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: gi * 0.1 + si * 0.05 }}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="terminal-text text-[11px] px-2.5 py-1 rounded border cursor-default transition-all duration-300"
                    style={{
                      color: hoveredSkill === skill ? "#050508" : `${group.color}90`,
                      borderColor: hoveredSkill === skill ? group.color : `${group.color}25`,
                      background: hoveredSkill === skill ? group.color : `${group.color}08`,
                      boxShadow: hoveredSkill === skill ? `0 0 15px ${group.color}60` : "none",
                    }}
                    data-testid={`skill-${skill.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 p-5 rounded border"
          style={{ borderColor: "rgba(0,245,255,0.1)", background: "rgba(0,245,255,0.02)" }}
        >
          <div className="terminal-text text-[#00f5ff]/40 text-[10px] tracking-widest mb-4 text-center">
            EDUCATION CORE
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div
                className="text-xl font-bold text-white"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                Gitam University
              </div>
              <div className="text-white/60 text-sm mt-0.5">
                B.Tech — Computer Science and Business Systems
              </div>
              <div className="terminal-text text-[#00f5ff]/60 text-xs mt-0.5">
                August 2023 — Present
              </div>
            </div>
            <div
              className="px-5 py-3 rounded border text-center"
              style={{ borderColor: "#00f5ff30", background: "#00f5ff08" }}
            >
              <div className="terminal-text text-[10px] text-[#00f5ff]/40 tracking-widest mb-1">GPA</div>
              <div
                className="text-3xl font-black text-[#00f5ff]"
                style={{ fontFamily: "Orbitron, sans-serif", textShadow: "0 0 20px #00f5ff60" }}
              >
                8.13
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

function MissionCard({ exp, index }: { exp: typeof PORTFOLIO_DATA.experience[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className="relative p-6 rounded border backdrop-blur-sm hologram"
      style={{
        borderColor: `${exp.color}30`,
        background: `linear-gradient(135deg, rgba(5,5,8,0.95) 0%, ${exp.color}08 100%)`,
        boxShadow: `0 0 30px ${exp.color}15`,
      }}
      data-testid={`card-experience-${exp.id}`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span
              className="terminal-text text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-widest"
              style={{ color: exp.color, borderColor: `${exp.color}50`, background: `${exp.color}15` }}
            >
              {exp.status === "ACTIVE" ? "● ACTIVE MISSION" : "✓ COMPLETED"}
            </span>
          </div>
          <h3
            className="text-2xl font-bold"
            style={{ fontFamily: "Orbitron, sans-serif", color: exp.color, textShadow: `0 0 20px ${exp.color}60` }}
          >
            {exp.company}
          </h3>
          <div className="text-white/80 font-medium mt-1">{exp.role}</div>
          <div className="terminal-text text-xs text-white/40 mt-0.5">{exp.location}</div>
        </div>
        <div
          className="terminal-text text-xs px-3 py-2 rounded border text-right shrink-0"
          style={{ borderColor: `${exp.color}30`, color: `${exp.color}80` }}
        >
          <div className="text-[10px] tracking-widest mb-0.5">DEPLOYMENT PERIOD</div>
          <div className="font-bold" style={{ color: exp.color }}>{exp.period}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {exp.metrics.map((m) => (
          <div
            key={m.label}
            className="p-3 rounded border text-center"
            style={{ borderColor: `${exp.color}20`, background: `${exp.color}08` }}
          >
            <div className="terminal-text text-[10px] text-white/40 tracking-widest mb-1">{m.label}</div>
            <div className="text-lg font-bold" style={{ color: exp.color, fontFamily: "Orbitron, sans-serif" }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        {exp.achievements.map((a, i) => (
          <div key={i} className="flex gap-3">
            <span className="terminal-text shrink-0 mt-0.5" style={{ color: exp.color }}>▹</span>
            <p className="text-white/70 text-sm leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {exp.tags.map((tag) => (
          <span
            key={tag}
            className="terminal-text text-[10px] px-2 py-0.5 rounded border tracking-wider"
            style={{ color: `${exp.color}80`, borderColor: `${exp.color}20`, background: `${exp.color}08` }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; LOADING DEPLOYMENT RECORDS...
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            MISSION <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>LOGS</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            ENTERPRISE DEPLOYMENTS — CLASSIFIED BRIEFINGS
          </div>
        </motion.div>

        <div className="space-y-8">
          {PORTFOLIO_DATA.experience.map((exp, i) => (
            <MissionCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

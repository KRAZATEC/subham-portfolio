import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

function ProjectCard({ project, index }: { project: typeof PORTFOLIO_DATA.projects[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
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
          <div
            className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0 animate-pulse-cyan"
            style={{ borderColor: `${project.color}40`, background: `${project.color}10` }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: project.color, boxShadow: `0 0 10px ${project.color}` }}
            />
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
                <div className="terminal-text text-[10px] tracking-widest mb-3" style={{ color: `${project.color}60` }}>
                  CORE FEATURES
                </div>
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
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`link-github-${project.id}`}
                  className="inline-flex items-center gap-2 terminal-text text-xs px-4 py-2 rounded border transition-all hover:bg-opacity-20"
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
            8 ACTIVE NODES — AI RESEARCH & ENGINEERING PROJECTS
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ParticleCanvas } from "./ParticleCanvas";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse text-[#00f5ff]">|</span>
    </span>
  );
}

interface HeroProps {
  onOpenTerminal: () => void;
}

export function HeroSection({ onOpenTerminal }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="grid-bg absolute inset-0" />
      <ParticleCanvas />

      <div className="scanline absolute inset-0 pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4"
        >
          <span className="terminal-text text-[#00f5ff]/60 text-xs tracking-[0.4em] border border-[#00f5ff]/20 px-4 py-1 rounded-full">
            SUBHAM OS v2.0.26 — AI SECURITY COMMAND CENTER
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-8xl font-black mb-4 tracking-tight glitch-effect"
          data-text="T SUBHAM PATRO"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          <span className="text-white">T SUBHAM </span>
          <span className="text-[#00f5ff]" style={{ textShadow: "0 0 30px #00f5ff, 0 0 60px #00f5ff44" }}>
            PATRO
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl text-[#00f5ff]/80 mb-3 terminal-text h-8"
        >
          <TypingText texts={PORTFOLIO_DATA.typingRoles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm text-[#8b5cf6]/80 terminal-text tracking-[0.15em] mb-10"
        >
          Bengaluru, India &nbsp;•&nbsp; BFSI AI &nbsp;•&nbsp; MLOps &nbsp;•&nbsp; Cybersecurity
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
            data-testid="button-explore-projects"
            className="px-6 py-3 text-sm terminal-text rounded border border-[#00f5ff] text-[#00f5ff] hover:bg-[#00f5ff] hover:text-[#050508] transition-all duration-300 tracking-[0.15em]"
            style={{ boxShadow: "0 0 20px rgba(0, 245, 255, 0.2)" }}
          >
            EXPLORE PROJECTS
          </a>
          <button
            onClick={onOpenTerminal}
            data-testid="button-open-terminal"
            className="px-6 py-3 text-sm terminal-text rounded border border-[#8b5cf6]/60 text-[#8b5cf6] hover:bg-[#8b5cf6]/10 transition-all duration-300 tracking-[0.15em]"
          >
            &gt;_ TERMINAL
          </button>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            data-testid="button-contact"
            className="px-6 py-3 text-sm terminal-text rounded border border-[#00ff88]/60 text-[#00ff88] hover:bg-[#00ff88]/10 transition-all duration-300 tracking-[0.15em]"
          >
            CONTACT
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto"
        >
          {PORTFOLIO_DATA.systemStatus.map((status, i) => (
            <motion.div
              key={status.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="border border-[#00f5ff]/10 rounded p-2 backdrop-blur bg-black/30"
              data-testid={`status-${status.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="terminal-text text-[9px] text-[#00f5ff]/40 tracking-widest mb-1">
                {status.label}
              </div>
              <div
                className="terminal-text text-xs font-bold"
                style={{ color: status.color, textShadow: `0 0 10px ${status.color}` }}
              >
                {status.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#00f5ff]/40 terminal-text text-xs tracking-widest"
      >
        SCROLL TO EXPLORE ↓
      </motion.div>
    </section>
  );
}

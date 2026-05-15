import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "SYSTEM", href: "#hero" },
  { label: "MISSIONS", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "NEURAL", href: "#neural-universe" },
  { label: "SKILLS", href: "#skills" },
  { label: "MLOPS", href: "#mlops" },
  { label: "MEMORY", href: "#about" },
  { label: "THREATS", href: "#threat-sim" },
  { label: "VAULT", href: "#certifications" },
];

interface NavigationProps {
  onOpenTerminal: () => void;
  onOpenOS: () => void;
}

export function Navigation({ onOpenTerminal, onOpenOS }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-[#050508]/90 backdrop-blur-xl border-b border-[#00f5ff]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div
            className="w-7 h-7 rounded border border-[#00f5ff]/60 flex items-center justify-center animate-pulse-cyan"
            style={{ background: "rgba(0, 245, 255, 0.05)" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00f5ff]" style={{ boxShadow: "0 0 8px #00f5ff" }} />
          </div>
          <span
            className="text-xs font-bold tracking-[0.2em] text-[#00f5ff]"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            SUBHAM OS
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="px-2.5 py-1.5 text-[9px] tracking-[0.15em] text-[#00f5ff]/50 hover:text-[#00f5ff] hover:bg-[#00f5ff]/5 rounded transition-all duration-200 terminal-text"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <motion.button
            onClick={onOpenOS}
            data-testid="button-os-mode"
            className="px-3 py-1.5 text-[9px] tracking-[0.2em] terminal-text rounded border transition-all"
            style={{
              borderColor: "rgba(139,92,246,0.4)",
              color: "#8b5cf6",
              background: "rgba(139,92,246,0.05)",
            }}
            whileHover={{ background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.7)" }}
          >
            ⬢ OS MODE
          </motion.button>
          <button
            onClick={onOpenTerminal}
            data-testid="button-terminal"
            className="px-3 py-1.5 text-[9px] tracking-[0.2em] terminal-text rounded border border-[#00f5ff]/40 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all"
            style={{ boxShadow: "0 0 10px rgba(0, 245, 255, 0.1)" }}
          >
            &gt;_ TERMINAL
          </button>
        </div>

        <button
          className="lg:hidden text-[#00f5ff] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-[#00f5ff]" />
            <div className="w-5 h-0.5 bg-[#00f5ff]" />
            <div className="w-5 h-0.5 bg-[#00f5ff]" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#050508]/95 backdrop-blur-xl border-b border-[#00f5ff]/10 px-4 pb-4"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="block w-full text-left py-2 text-[11px] tracking-[0.2em] text-[#00f5ff]/60 hover:text-[#00f5ff] terminal-text"
              >
                &gt; {item.label}
              </button>
            ))}
            <button
              onClick={() => { onOpenOS(); setMobileOpen(false); }}
              className="block w-full text-left py-2 text-[11px] tracking-[0.2em] text-[#8b5cf6] terminal-text border-t border-[#00f5ff]/10 mt-1 pt-2"
            >
              ⬢ OS MODE
            </button>
            <button
              onClick={() => { onOpenTerminal(); setMobileOpen(false); }}
              className="block w-full text-left py-2 text-[11px] tracking-[0.2em] text-[#00f5ff] terminal-text"
            >
              &gt;_ TERMINAL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

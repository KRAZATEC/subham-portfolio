import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

const contactLinks = [
  {
    label: "GITHUB",
    value: "github.com/KRAZATEC",
    href: PORTFOLIO_DATA.github,
    color: "#00f5ff",
    icon: "</> ",
  },
  {
    label: "LINKEDIN",
    value: "linkedin.com/in/krazatec",
    href: PORTFOLIO_DATA.linkedin,
    color: "#8b5cf6",
    icon: "⬡ ",
  },
  {
    label: "EMAIL",
    value: PORTFOLIO_DATA.email,
    href: `mailto:${PORTFOLIO_DATA.email}`,
    color: "#00ff88",
    icon: "@ ",
  },
  {
    label: "PHONE",
    value: PORTFOLIO_DATA.phone,
    href: `tel:${PORTFOLIO_DATA.phone}`,
    color: "#ff8c00",
    icon: "◈ ",
  },
];

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [transmitting, setTransmitting] = useState<string | null>(null);

  const handleContact = (label: string, href: string) => {
    setTransmitting(label);
    setTimeout(() => {
      window.open(href, "_blank");
      setTransmitting(null);
    }, 800);
  };

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#00f5ff]/3 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; INITIALIZING SECURE CHANNEL...
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            COMM <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>TERMINAL</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            ENCRYPTED TRANSMISSION — SECURE CHANNEL ACTIVE
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded border backdrop-blur-sm"
          style={{ borderColor: "rgba(0,245,255,0.15)", background: "rgba(0,245,255,0.02)", boxShadow: "0 0 40px rgba(0,245,255,0.08)" }}
        >
          <div className="terminal-text text-[#00f5ff]/50 text-xs mb-6 tracking-[0.2em]">
            SUBHAM@KRAZATEC:~$ initiate_secure_contact --encrypted
          </div>

          <div className="text-center mb-8">
            <div
              className="text-3xl font-black text-white mb-2"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              SUBHAM PATRO
            </div>
            <div className="text-[#00f5ff]/70 text-sm">
              AI/ML Engineer — Open to Enterprise AI Opportunities
            </div>
            <div className="terminal-text text-white/30 text-xs mt-1 tracking-widest">
              {PORTFOLIO_DATA.location}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                onClick={() => handleContact(link.label, link.href)}
                data-testid={`link-contact-${link.label.toLowerCase()}`}
                className="relative p-4 rounded border text-left transition-all hologram overflow-hidden group"
                style={{
                  borderColor: transmitting === link.label ? link.color : `${link.color}25`,
                  background: transmitting === link.label ? `${link.color}15` : `${link.color}05`,
                  boxShadow: transmitting === link.label ? `0 0 20px ${link.color}40` : "none",
                }}
              >
                <div className="terminal-text text-[10px] tracking-widest mb-1" style={{ color: `${link.color}60` }}>
                  {link.icon}{link.label}
                </div>
                <div className="text-sm font-medium" style={{ color: link.color }}>
                  {link.value}
                </div>
                {transmitting === link.label && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 terminal-text text-xs" style={{ color: link.color }}>
                    TRANSMITTING...
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to right, transparent, ${link.color}, transparent)` }}
                />
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-[#00f5ff]/10 text-center"
          >
            <div className="terminal-text text-white/20 text-[11px] tracking-widest">
              ALL TRANSMISSIONS ENCRYPTED — RESPONSE TIME: 24-48 HRS
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
                style={{ boxShadow: "0 0 6px #00ff88" }}
              />
              <span className="terminal-text text-[#00ff88]/60 text-xs">SECURE CHANNEL OPEN</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-12 terminal-text text-white/15 text-xs tracking-widest"
        >
          SUBHAM OS v2.0.26 — AI SECURITY COMMAND CENTER — BUILT WITH NEURAL PRECISION
        </motion.div>
      </div>
    </section>
  );
}

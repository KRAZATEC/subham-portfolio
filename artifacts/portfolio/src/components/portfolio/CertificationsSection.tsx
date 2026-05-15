import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

export function CertificationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b5cf6]/2 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="terminal-text text-[#8b5cf6]/60 text-xs tracking-[0.4em] mb-3">
            &gt; ACCESSING CREDENTIAL VAULT...
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            SECURE <span className="text-[#8b5cf6]" style={{ textShadow: "0 0 20px #8b5cf666" }}>VAULT</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            VERIFIED CREDENTIALS — AUTHENTICATED & ENCRYPTED
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_DATA.certifications.map((cert, i) => (
            <motion.div
              key={cert.code}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="relative p-4 rounded border hologram group overflow-hidden"
              style={{
                borderColor: `${cert.color}25`,
                background: `linear-gradient(135deg, rgba(5,5,8,0.98) 0%, ${cert.color}08 100%)`,
                boxShadow: `0 0 20px ${cert.color}10`,
              }}
              data-testid={`card-cert-${cert.code}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="terminal-text text-[10px] px-2 py-0.5 rounded border font-bold tracking-[0.2em]"
                  style={{ color: cert.color, borderColor: `${cert.color}40`, background: `${cert.color}15` }}
                >
                  {cert.code}
                </div>
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88" }}
                  />
                  <span className="terminal-text text-[9px] text-[#00ff88]/80 tracking-widest">
                    {cert.status}
                  </span>
                </div>
              </div>

              <div
                className="text-sm font-bold mb-1 leading-snug"
                style={{ color: cert.color, fontFamily: "Orbitron, sans-serif", textShadow: `0 0 10px ${cert.color}40` }}
              >
                {cert.name}
              </div>

              <div className="terminal-text text-[11px] text-white/40 mt-2">
                ISSUED BY: {cert.issuer}
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 group-hover:opacity-100 opacity-0 transition-opacity"
                style={{ background: `linear-gradient(to right, transparent, ${cert.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

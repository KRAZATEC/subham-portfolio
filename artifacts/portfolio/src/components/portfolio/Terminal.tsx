import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "system";
  content: string;
}

const HELP_TEXT = `
SUBHAM OS v2.0.26 — Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  about          — Display system profile
  projects       — List all AI projects
  skills         — Show intelligence matrix
  experience     — View mission logs
  certifications — Access credential vault
  contact        — Open comm channel
  education      — View education records
  clear          — Clear terminal
  help           — Show this help menu

Hidden Commands:
  sudo reveal-secret  — Unlock classified data
  sudo matrix         — Initialize matrix protocol

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

const ABOUT_TEXT = `
SYSTEM PROFILE — SUBHAM PATRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role     : AI/ML Engineer | Generative AI | MLOps | Cybersecurity
Status   : ACTIVE — JMR Infotech (BFSI AI, Sense AI Platform)
Location : Bengaluru, Karnataka, India
GitHub   : github.com/KRAZATEC
LinkedIn : linkedin.com/in/krazatec
Email    : subham.t.patro.2005@gmail.com

PROFILE SUMMARY:
Building enterprise-grade AI systems at the intersection of
machine learning, generative AI, MLOps, and cybersecurity.
Currently contributing to Sense AI in the BFSI domain.
`.trim();

function getCommandOutput(cmd: string): TerminalLine[] {
  const trimmed = cmd.trim().toLowerCase();

  if (trimmed === "help") {
    return [{ type: "output", content: HELP_TEXT }];
  }
  if (trimmed === "about") {
    return [{ type: "success", content: ABOUT_TEXT }];
  }
  if (trimmed === "clear") {
    return [{ type: "system", content: "__CLEAR__" }];
  }
  if (trimmed === "projects") {
    const lines = PORTFOLIO_DATA.projects.map(
      (p, i) => `  ${String(i + 1).padStart(2, "0")}. ${p.name.padEnd(30)} [${p.category}]  — ${p.tagline}`
    );
    return [{ type: "output", content: `PROJECT NODES (${PORTFOLIO_DATA.projects.length} ACTIVE):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}` }];
  }
  if (trimmed === "skills") {
    const lines = PORTFOLIO_DATA.skills.map(
      (s) => `  ${s.category.padEnd(28)} → ${s.items.join(", ")}`
    );
    return [{ type: "output", content: `INTELLIGENCE MATRIX:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}` }];
  }
  if (trimmed === "experience") {
    const lines = PORTFOLIO_DATA.experience.map(
      (e) => `  ● ${e.company} (${e.role})\n    ${e.period} — ${e.location}\n    ${e.achievements[0]}`
    );
    return [{ type: "success", content: `MISSION LOGS:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n\n")}` }];
  }
  if (trimmed === "certifications") {
    const lines = PORTFOLIO_DATA.certifications.map(
      (c) => `  [${c.code}] ${c.name} — ${c.issuer} — ${c.status}`
    );
    return [{ type: "success", content: `CREDENTIAL VAULT (${PORTFOLIO_DATA.certifications.length} VERIFIED):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}` }];
  }
  if (trimmed === "contact") {
    return [{ type: "success", content: `COMM TERMINAL — SECURE CHANNEL:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  Email    : subham.t.patro.2005@gmail.com\n  GitHub   : github.com/KRAZATEC\n  LinkedIn : linkedin.com/in/krazatec\n  Phone    : +91-7440146537\n  Location : Bengaluru, India` }];
  }
  if (trimmed === "education") {
    return [{ type: "output", content: `EDUCATION ARCHIVE:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  Institution : Gitam University, Bengaluru\n  Degree      : B.Tech — Computer Science and Business Systems\n  GPA         : 8.13\n  Period      : August 2023 — Present` }];
  }
  if (trimmed === "sudo reveal-secret") {
    return [{ type: "success", content: `CLASSIFIED — LEVEL 5 CLEARANCE GRANTED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDecrypting hidden project file...\n\n[PROJECT X — REDACTED]\nStatus    : EXPERIMENTAL\nDomain    : Autonomous AI Security Agent\nStack     : LangGraph + LLM + Real-time Threat Intel\nDeployment: Classified Infrastructure\n\nNote: Some projects are too dangerous to show publicly.\nHandle with care. You've been warned.` }];
  }
  if (trimmed === "sudo matrix") {
    return [{ type: "system", content: "__MATRIX__" }];
  }
  if (trimmed === "") {
    return [];
  }
  return [{ type: "error", content: `Command not found: '${cmd}'\nType 'help' for available commands.` }];
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", content: "SUBHAM OS v2.0.26 — Secure Terminal" },
    { type: "output", content: "Type 'help' for available commands." },
    { type: "output", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [matrixActive, setMatrixActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = () => {
    if (!input.trim() && input !== "") {
      setInput("");
      return;
    }
    const cmd = input;
    const output = getCommandOutput(cmd);

    if (output.some((l) => l.content === "__CLEAR__")) {
      setLines([{ type: "system", content: "Terminal cleared." }, { type: "output", content: "" }]);
    } else if (output.some((l) => l.content === "__MATRIX__")) {
      setMatrixActive(true);
      setLines((prev) => [
        ...prev,
        { type: "input", content: cmd },
        { type: "success", content: "INITIALIZING MATRIX PROTOCOL...\nΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣΣ\n01001000 01100101 01101100 01101100 01101111\nMatrix rain active for 5 seconds..." },
      ]);
      setTimeout(() => setMatrixActive(false), 5000);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "input", content: cmd },
        ...output,
        { type: "output", content: "" },
      ]);
    }

    if (cmd.trim()) {
      setHistory((h) => [cmd, ...h].slice(0, 50));
    }
    setHistIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const lineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input": return "#00f5ff";
      case "success": return "#00ff88";
      case "error": return "#ff4444";
      case "system": return "#8b5cf6";
      default: return "rgba(255,255,255,0.7)";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {matrixActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, opacity: 1 }}
                  animate={{ y: window.innerHeight + 100, opacity: 0 }}
                  transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity }}
                  className="absolute terminal-text text-[#00ff88] text-xs"
                  style={{ left: `${(i / 20) * 100}%` }}
                >
                  {Array.from({ length: 20 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join("\n")}
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-3xl rounded border overflow-hidden"
            style={{ borderColor: "rgba(0,245,255,0.3)", background: "#050508", boxShadow: "0 0 60px rgba(0,245,255,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ borderColor: "rgba(0,245,255,0.15)", background: "rgba(0,245,255,0.03)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff8c00]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
              </div>
              <div className="terminal-text text-xs text-[#00f5ff]/60 tracking-widest">
                SUBHAM@KRAZATEC:~$
              </div>
              <button
                onClick={onClose}
                data-testid="button-close-terminal"
                className="terminal-text text-xs text-white/30 hover:text-white/70 transition-colors px-2 py-0.5"
              >
                ESC
              </button>
            </div>

            <div
              className="h-96 overflow-y-auto p-4 space-y-1 scanline"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i}>
                  {line.type === "input" && (
                    <div className="flex gap-2">
                      <span className="terminal-text text-[#00f5ff]/60 text-sm shrink-0">
                        subham@krazatec:~$
                      </span>
                      <span className="terminal-text text-sm" style={{ color: lineColor(line.type) }}>
                        {line.content}
                      </span>
                    </div>
                  )}
                  {line.type !== "input" && (
                    <pre
                      className="terminal-text text-sm whitespace-pre-wrap leading-relaxed"
                      style={{ color: lineColor(line.type), fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {line.content}
                    </pre>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div
              className="flex items-center gap-2 px-4 py-3 border-t"
              style={{ borderColor: "rgba(0,245,255,0.1)" }}
            >
              <span className="terminal-text text-[#00f5ff]/60 text-sm shrink-0">
                subham@krazatec:~$
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="enter command..."
                data-testid="input-terminal"
                className="flex-1 bg-transparent terminal-text text-sm text-[#00f5ff] outline-none placeholder-[#00f5ff]/20 caret-[#00f5ff]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "system" | "warn";
  content: string;
}

const HELP_TEXT = `
SUBHAM OS v2.0.26 — Command Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  about              — System profile
  projects           — Neural node registry
  skills             — Intelligence matrix
  experience         — Mission logs
  certifications     — Credential vault
  contact            — Open comm channel
  education          — Education records
  architecture       — Project architecture overview
  deploy             — Simulate deployment pipeline
  open <app>         — Launch: neostats | aisoc | healthai | pii
  initialize system  — Run system initialization
  launch security    — Activate security mode
  clear              — Clear terminal buffer
  help               — Show this menu

Hidden Protocols:
  sudo reveal-secret         — Classified data access
  sudo matrix                — Initialize matrix protocol
  override security          — [CLASSIFIED]
  activate quantum mode      — [EXPERIMENTAL]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`.trim();

const ARCH_TEXT = `
PROJECT ARCHITECTURE REGISTRY — SUBHAM OS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[NEO-STATS]
  User → Streamlit → Query Processor → ChromaDB
       ↓
  LLM Router → [ GPT-4 | Groq | Gemini ] → Aggregator → Response

[AI-NIDS]
  Network Traffic → Feature Extractor → [ Random Forest | SVM | Neural Net ]
                                        ↓
                                   Ensemble → Alert / Block / Log

[AI-SOC-PLATFORM]
  Events → Collector → Normalizer → ML Anomaly Engine
                                    ↓
                         [ Threat Classifier → Dashboard → IR ]

[PRESIDIO-PII-DETECTOR]
  Input Text → spaCy NLP → Presidio Engine → [ NER | Pattern Match ]
                                              ↓
                                         Redactor → Clean Output

[PHIS-GUARD-AI]
  URL Input → Feature Engineering → ML Classifier → [ SAFE | PHISHING ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`.trim();

const DEPLOY_LINES = [
  "[INIT] Starting deployment pipeline...",
  "[GIT]  Pulling latest from main branch...",
  "[TEST] Running pytest suite... 47/47 passed",
  "[LINT] Code quality check... PASSED",
  "[SEC]  Security scan... 0 vulnerabilities",
  "[BUILD] docker build -t subham-ai:latest .",
  "[PUSH]  Pushing to container registry...",
  "[K8S]   kubectl apply -f deployment.yaml",
  "[SCALE] HPA configured: 2-10 replicas",
  "[HEALTH] Probes OK: /healthz 200 OK",
  "[DNS]   Service endpoint registered",
  "[DONE]  Deployment successful — 0 downtime",
];

const QUANTUM_TEXT = `
QUANTUM MODE ACTIVATED — EXPERIMENTAL PROTOCOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌─────────────────────────────────┐
    │   |ψ⟩ = α|0⟩ + β|1⟩           │
    │   Superposition: MAINTAINED     │
    │   Entanglement: 8 qubits        │
    │   Decoherence: 42μs             │
    │   Error correction: ACTIVE      │
    └─────────────────────────────────┘

    Q-Register: [+] [+] [+] [-] [+] [-] [+] [+]
    Hadamard gates applied...
    CNOT entanglements established...
    Quantum circuit depth: 24

WARNING: This system is not actually quantum.
But Subham is researching quantum ML integration.
`.trim();

const SECURITY_TEXT = `
SECURITY MODE — LEVEL 5 CLEARANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Activating enhanced security protocols...

[SCAN]   Scanning all processes...      OK
[FW]     Firewall rules loaded...       OK
[THREAT] Threat detection ACTIVE...     OK
[IDS]    Intrusion detection ON...      OK
[CRYPTO] Encryption layer verified...  OK
[AUDIT]  Audit logging enabled...       OK

SECURITY POSTURE: HARDENED
All systems operating within secure parameters.
Threat level: NOMINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`.trim();

function getCommandOutput(cmd: string): TerminalLine[] {
  const trimmed = cmd.trim().toLowerCase();

  if (trimmed === "help") {
    return [{ type: "output", content: HELP_TEXT }];
  }
  if (trimmed === "about") {
    return [{ type: "success", content: `SYSTEM PROFILE — SUBHAM PATRO\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRole     : AI/ML Engineer | Generative AI | MLOps | Cybersecurity\nStatus   : ACTIVE — JMR Infotech (BFSI AI, Sense AI Platform)\nLocation : Bengaluru, Karnataka, India\nGitHub   : github.com/KRAZATEC\nLinkedIn : linkedin.com/in/krazatec\nEmail    : subham.t.patro.2005@gmail.com\n\nBuilding enterprise-grade AI systems at the intersection of\nmachine learning, generative AI, MLOps, and cybersecurity.` }];
  }
  if (trimmed === "clear") {
    return [{ type: "system", content: "__CLEAR__" }];
  }
  if (trimmed === "architecture") {
    return [{ type: "output", content: ARCH_TEXT }];
  }
  if (trimmed === "deploy") {
    return [{ type: "system", content: "__DEPLOY__" }];
  }
  if (trimmed === "initialize system") {
    return [{ type: "system", content: "__INIT__" }];
  }
  if (trimmed === "launch security" || trimmed === "launch security mode") {
    return [{ type: "warn", content: SECURITY_TEXT }];
  }
  if (trimmed.startsWith("open ")) {
    const app = trimmed.replace("open ", "").trim();
    const appMap: Record<string, string> = {
      neostats: "Neo-Stats — Multi-LLM Intelligence Hub",
      "neo-stats": "Neo-Stats — Multi-LLM Intelligence Hub",
      aisoc: "AI-SOC-Platform — Security Operations Center",
      "ai-soc": "AI-SOC-Platform — Security Operations Center",
      healthai: "Healthcare-Agent — Multimodal Medical AI",
      pii: "Presidio-PII-Detector — PII Redaction API",
      nova: "Nova Desktop Voice Assistant",
    };
    const found = appMap[app];
    if (found) {
      return [{ type: "success", content: `LAUNCHING APPLICATION: ${found}\nScrolling to Projects section... Done.\nClick the project card to expand details.` }];
    }
    return [{ type: "error", content: `Unknown app '${app}'. Available: neostats, aisoc, healthai, pii, nova` }];
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
  if (trimmed === "sudo reveal-secret" || trimmed === "sudo reveal-secret-project") {
    return [{ type: "success", content: `CLASSIFIED — LEVEL 5 CLEARANCE GRANTED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDecrypting hidden project file...\n\n[PROJECT X — REDACTED]\nStatus    : EXPERIMENTAL\nDomain    : Autonomous AI Security Agent\nStack     : LangGraph + LLM + Real-time Threat Intel\nDeployment: Classified Infrastructure\nCode Name : GHOST-LAYER\n\nNote: Some projects are too dangerous to show publicly.\nHandle with care. You've been warned.` }];
  }
  if (trimmed === "sudo matrix") {
    return [{ type: "system", content: "__MATRIX__" }];
  }
  if (trimmed === "override security") {
    return [{ type: "warn", content: `ACCESS DENIED\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nUnauthorized override attempt logged.\nIP traced. Incident report filed.\n\n...just kidding.\n\nBut seriously — Subham built AI-NIDS and AI-SOC specifically\nto detect and block exactly this type of intrusion attempt.\nThe systems would have caught you. :)` }];
  }
  if (trimmed === "activate quantum mode") {
    return [{ type: "success", content: QUANTUM_TEXT }];
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
  const [deployIdx, setDeployIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const runDeploy = () => {
    setDeployIdx(0);
    let i = 0;
    const go = () => {
      if (i >= DEPLOY_LINES.length) return;
      setLines((prev) => [...prev, { type: "output", content: DEPLOY_LINES[i] }]);
      i++;
      setTimeout(go, 280 + Math.random() * 150);
    };
    go();
  };

  const runInit = () => {
    const initLines = [
      "[BOOT] SUBHAM OS v2.0.26 initializing...",
      "[MEM]  Allocating 32GB neural memory...",
      "[AI]   Loading LLM modules... OK",
      "[SEC]  Initializing security layer... OK",
      "[NET]  Establishing secure connections... OK",
      "[GPU]  CUDA cores activated... OK",
      "[MLOps] Pipeline health check... OK",
      "[DONE] All systems nominal. Welcome, operator.",
    ];
    let i = 0;
    const go = () => {
      if (i >= initLines.length) return;
      setLines((prev) => [...prev, { type: "system", content: initLines[i] }]);
      i++;
      setTimeout(go, 300);
    };
    go();
  };

  const handleSubmit = () => {
    if (!input.trim() && input !== "") { setInput(""); return; }
    const cmd = input;
    const output = getCommandOutput(cmd);

    if (output.some((l) => l.content === "__CLEAR__")) {
      setLines([{ type: "system", content: "Terminal cleared." }, { type: "output", content: "" }]);
    } else if (output.some((l) => l.content === "__MATRIX__")) {
      setMatrixActive(true);
      setLines((prev) => [
        ...prev,
        { type: "input", content: cmd },
        { type: "success", content: "INITIALIZING MATRIX PROTOCOL...\n01001000 01100101 01101100 01101100 01101111\nMatrix rain active for 5 seconds..." },
      ]);
      setTimeout(() => setMatrixActive(false), 5000);
    } else if (output.some((l) => l.content === "__DEPLOY__")) {
      setLines((prev) => [
        ...prev,
        { type: "input", content: cmd },
        { type: "system", content: "INITIATING DEPLOYMENT PIPELINE..." },
        { type: "output", content: "" },
      ]);
      setTimeout(runDeploy, 200);
    } else if (output.some((l) => l.content === "__INIT__")) {
      setLines((prev) => [
        ...prev,
        { type: "input", content: cmd },
        { type: "output", content: "" },
      ]);
      setTimeout(runInit, 200);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "input", content: cmd },
        ...output,
        { type: "output", content: "" },
      ]);
    }

    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
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
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = ["about", "projects", "skills", "experience", "certifications", "contact", "education", "architecture", "deploy", "initialize system", "launch security", "help", "clear"];
      const match = commands.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const lineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input": return "#00f5ff";
      case "success": return "#00ff88";
      case "error": return "#ff4444";
      case "warn": return "#ff8c00";
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
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, opacity: 1 }}
                  animate={{ y: window.innerHeight + 100, opacity: 0 }}
                  transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity }}
                  className="absolute terminal-text text-[#00ff88] text-xs leading-tight"
                  style={{ left: `${(i / 24) * 100}%` }}
                >
                  {Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join("\n")}
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
                SUBHAM@KRAZATEC:~$ — v2.0.26
              </div>
              <div className="flex items-center gap-3">
                <div className="terminal-text text-[10px] text-white/20">TAB=autocomplete ↑↓=history</div>
                <button
                  onClick={onClose}
                  data-testid="button-close-terminal"
                  className="terminal-text text-xs text-white/30 hover:text-white/70 transition-colors px-2 py-0.5"
                >
                  ESC
                </button>
              </div>
            </div>

            <div
              className="h-96 overflow-y-auto p-4 space-y-1 scanline"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i}>
                  {line.type === "input" && (
                    <div className="flex gap-2">
                      <span className="terminal-text text-[#00f5ff]/60 text-sm shrink-0">subham@krazatec:~$</span>
                      <span className="terminal-text text-sm text-[#00f5ff]">{line.content}</span>
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
              <span className="terminal-text text-[#00f5ff]/60 text-sm shrink-0">subham@krazatec:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="enter command... (type 'help')"
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

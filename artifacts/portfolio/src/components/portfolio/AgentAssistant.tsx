import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: string;
  greeting: string;
  responses: Record<string, string>;
}

const AGENTS: Agent[] = [
  {
    id: "security",
    name: "SEC-AI",
    role: "Security Intelligence",
    color: "#ff4444",
    icon: "⬡",
    greeting: "Security AI online. I specialize in cybersecurity, threat detection, and AI-powered SOC systems. How can I assist?",
    responses: {
      default: "My security systems are analyzing your query... Subham has built AI-powered security tools including network intrusion detection, anti-phishing systems, and a full SOC platform. These use ML classifiers to detect threats in real time.",
      nids: "AI NIDS uses Scikit-learn classifiers to detect anomalous network traffic. It processes packet features in real time, comparing against baseline profiles. Trained on the NSL-KDD dataset with Random Forest achieving 97.8% accuracy.",
      soc: "The AI-SOC Platform is a Docker-containerized security operations center with ML-based anomaly detection. It features a real-time dashboard, threat classification engine, and automated incident response workflows.",
      phishing: "Phis-Guard-AI uses a ML classifier trained on URL features — domain age, HTTPS usage, URL length, special characters. Deployed on Railway with a JavaScript browser integration for real-time scanning.",
      pii: "Presidio-PII-Detector uses Microsoft Presidio + spaCy NLP to identify and redact 18+ entity types including names, emails, SSNs, credit cards. Served as a FastAPI endpoint with Docker containerization.",
    },
  },
  {
    id: "research",
    name: "RESEARCH-AI",
    role: "AI Research Intelligence",
    color: "#8b5cf6",
    icon: "◈",
    greeting: "Research AI initialized. I have deep knowledge of AI/ML architecture, RAG systems, and generative AI. What would you like to explore?",
    responses: {
      default: "Processing research query... Subham has deep expertise in LLM orchestration, RAG pipelines, and multi-agent architectures using LangChain and LangGraph.",
      rag: "Neo-Stats implements a multi-domain RAG system: documents are chunked and embedded using OpenAI embeddings, stored in ChromaDB vector store. At query time, semantic search retrieves top-k chunks which are injected into the LLM context window.",
      langchain: "Subham uses LangChain for LLM chaining and LangGraph for stateful multi-agent workflows. LangGraph enables cyclic execution graphs where agents can loop back based on tool outputs.",
      llm: "The multi-LLM orchestrator in Neo-Stats routes queries to the optimal model: GPT-4 for complex reasoning, Groq for speed, Gemini for multimodal. A meta-agent evaluates response quality and routes accordingly.",
      multimodal: "Healthcare-Agent uses Groq's multimodal capabilities — medical images are base64-encoded and passed alongside text queries. The LLM provides diagnosis suggestions grounded in the image content.",
    },
  },
  {
    id: "cloud",
    name: "CLOUD-AI",
    role: "MLOps & Cloud Intelligence",
    color: "#00f5ff",
    icon: "⬢",
    greeting: "Cloud AI connected. Specializing in MLOps, Kubernetes orchestration, and cloud deployment pipelines. What infrastructure questions do you have?",
    responses: {
      default: "Analyzing cloud infrastructure... Subham has certified expertise across AWS, GCP, and Azure, with hands-on MLOps experience using MLflow, Docker, and Kubernetes.",
      docker: "The PII Detector and AI-SOC platform are fully containerized with Docker. Multi-stage builds keep images small. Docker Compose orchestrates the service stack locally; Kubernetes manages production deployments.",
      mlops: "Subham's MLOps stack: MLflow for experiment tracking and model registry, Weights & Biases for training visualization, GitHub Actions for CI/CD, Docker for containerization, Kubernetes for orchestration.",
      kubernetes: "K8s configuration includes HPA (Horizontal Pod Autoscaler) for ML inference workloads, resource limits per container, rolling deployments for zero-downtime updates, and persistent volume claims for model storage.",
      pipeline: "The ML pipeline: data ingestion → feature engineering (Pandas/NumPy) → model training (PyTorch/TF) → evaluation → MLflow registration → Docker build → CI/CD deploy → monitoring (W&B).",
    },
  },
  {
    id: "recruiter",
    name: "RECRUITER-AI",
    role: "Talent Intelligence",
    color: "#00ff88",
    icon: "◉",
    greeting: "Recruiter AI ready. I have full access to Subham's profile, achievements, and capabilities. What would you like to know?",
    responses: {
      default: "Accessing talent profile... T Subham Patro is a 3rd-year B.Tech CS student at Gitam University with a 8.13 GPA, currently interning at JMR Infotech building the Sense AI BFSI platform.",
      experience: "Subham has 2 internships: (1) AI Intern at Springer Capital (Feb–May 2026) — built Investment Sentiment Analysis, improved accuracy 10-15%, managed 5+ data pipelines. (2) AI/ML Intern at JMR Infotech (May 2026–present) — building Sense AI BFSI platform, 3+ AI workflows, ~50% deployment time reduction.",
      skills: "Core strengths: LLM engineering (LangChain, LangGraph), ML (PyTorch, TensorFlow, Scikit-learn), MLOps (Docker, K8s, MLflow), Cybersecurity (threat detection, SOC), and full-stack AI app development.",
      projects: "8 production-grade AI projects spanning: RAG systems, network security, PII detection, voice assistants, healthcare AI, customer support agents, and SOC platforms. All deployed and functional.",
      certifications: "9 verified certifications: Azure Security Engineer (AZ-500), Google Cloud Cybersecurity, IBM AI Fundamentals, INE Cloud Associate, C3SA, ServiceNow, VOIS GenAI, Azure Virtual Internship, IBM ML Virtual Internship.",
      hire: "Subham is an ideal candidate for AI/ML engineering roles. He combines strong theoretical foundations (ML, deep learning, NLP) with practical deployment experience (MLOps, cloud, security). Available for full-time roles from 2027 post-graduation.",
    },
  },
];

interface Message {
  role: "user" | "agent";
  content: string;
  agentId: string;
}

function getResponse(agent: Agent, input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("nids") || lower.includes("intrusion") || lower.includes("network")) return agent.responses.nids || agent.responses.default;
  if (lower.includes("soc") || lower.includes("security operations")) return agent.responses.soc || agent.responses.default;
  if (lower.includes("phishing") || lower.includes("url")) return agent.responses.phishing || agent.responses.default;
  if (lower.includes("pii") || lower.includes("presidio") || lower.includes("redact")) return agent.responses.pii || agent.responses.default;
  if (lower.includes("rag") || lower.includes("retrieval") || lower.includes("vector")) return agent.responses.rag || agent.responses.default;
  if (lower.includes("langchain") || lower.includes("langgraph") || lower.includes("agent")) return agent.responses.langchain || agent.responses.default;
  if (lower.includes("llm") || lower.includes("gpt") || lower.includes("groq")) return agent.responses.llm || agent.responses.default;
  if (lower.includes("multimodal") || lower.includes("healthcare") || lower.includes("medical")) return agent.responses.multimodal || agent.responses.default;
  if (lower.includes("docker") || lower.includes("container")) return agent.responses.docker || agent.responses.default;
  if (lower.includes("mlops") || lower.includes("mlflow") || lower.includes("pipeline")) return agent.responses.mlops || agent.responses.default;
  if (lower.includes("kubernetes") || lower.includes("k8s")) return agent.responses.kubernetes || agent.responses.default;
  if (lower.includes("experience") || lower.includes("intern") || lower.includes("work")) return agent.responses.experience || agent.responses.default;
  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack")) return agent.responses.skills || agent.responses.default;
  if (lower.includes("project")) return agent.responses.projects || agent.responses.default;
  if (lower.includes("cert")) return agent.responses.certifications || agent.responses.default;
  if (lower.includes("hire") || lower.includes("recruit") || lower.includes("job")) return agent.responses.hire || agent.responses.default;
  return agent.responses.default;
}

function TypingMessage({ text, color }: { text: string; color: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);
  return <span style={{ color }}>{displayed}<span className="animate-pulse">▌</span></span>;
}

export function AgentAssistant() {
  const [open, setOpen] = useState(false);
  const [activeAgentIdx, setActiveAgentIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agent = AGENTS[activeAgentIdx];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "agent", content: agent.greeting, agentId: agent.id }]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const switchAgent = (idx: number) => {
    setActiveAgentIdx(idx);
    const newAgent = AGENTS[idx];
    setMessages([{ role: "agent", content: newAgent.greeting, agentId: newAgent.id }]);
  };

  const sendMessage = () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg, agentId: agent.id }]);
    setTyping(true);
    setTimeout(() => {
      const response = getResponse(agent, userMsg);
      setMessages((prev) => [...prev, { role: "agent", content: response, agentId: agent.id }]);
      setTyping(false);
    }, 800 + Math.random() * 400);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 z-40 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${agent.color}30, ${agent.color}10)`,
          border: `1px solid ${agent.color}60`,
          boxShadow: `0 0 30px ${agent.color}30`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: [`0 0 20px ${agent.color}30`, `0 0 40px ${agent.color}60`, `0 0 20px ${agent.color}30`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ fontSize: 22, color: agent.color }}>{agent.icon}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 w-80 rounded-lg overflow-hidden"
            style={{
              background: "rgba(5,5,8,0.97)",
              border: `1px solid ${agent.color}40`,
              boxShadow: `0 0 60px ${agent.color}20`,
            }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: `linear-gradient(90deg, ${agent.color}15, transparent)`, borderBottom: `1px solid ${agent.color}20` }}
            >
              <div>
                <div className="terminal-text text-xs font-bold" style={{ color: agent.color }}>{agent.name}</div>
                <div className="terminal-text text-[9px] text-white/40">{agent.role}</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70 terminal-text text-xs">✕</button>
            </div>

            <div className="flex gap-1 p-2 border-b border-white/5">
              {AGENTS.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => switchAgent(i)}
                  className="flex-1 py-1.5 rounded terminal-text text-[9px] tracking-widest transition-all"
                  style={{
                    background: activeAgentIdx === i ? `${a.color}20` : "transparent",
                    color: activeAgentIdx === i ? a.color : "rgba(255,255,255,0.3)",
                    border: `1px solid ${activeAgentIdx === i ? a.color + "40" : "transparent"}`,
                  }}
                >
                  {a.name.split("-")[0]}
                </button>
              ))}
            </div>

            <div className="h-64 overflow-y-auto p-3 space-y-3 scanline">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%] p-2.5 rounded text-xs leading-relaxed"
                    style={{
                      background: msg.role === "user" ? `${agent.color}15` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${msg.role === "user" ? agent.color + "30" : "rgba(255,255,255,0.08)"}`,
                      color: msg.role === "user" ? "white" : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {msg.role === "agent" && i === messages.length - 1 && !typing ? (
                      <TypingMessage text={msg.content} color={agent.color} />
                    ) : (
                      <span style={{ color: msg.role === "agent" ? agent.color : "white" }}>
                        {msg.content}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="p-2.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="terminal-text" style={{ color: agent.color }}>● ● ●</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 p-2 border-t border-white/5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={`Ask ${agent.name}...`}
                className="flex-1 bg-transparent terminal-text text-xs text-white/80 outline-none placeholder-white/20 px-2"
              />
              <button
                onClick={sendMessage}
                disabled={typing}
                className="px-3 py-1.5 rounded terminal-text text-[10px] transition-all"
                style={{
                  background: `${agent.color}20`,
                  border: `1px solid ${agent.color}40`,
                  color: agent.color,
                  opacity: typing ? 0.5 : 1,
                }}
              >
                SEND
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

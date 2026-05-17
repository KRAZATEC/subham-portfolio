import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  message: string;
  type: "observation" | "alert" | "insight" | "recommendation";
  priority: "low" | "medium" | "high";
}

const BEHAVIOR_MESSAGES = {
  hero: [
    { message: "User profile loaded. Establishing connection...", type: "observation" as const },
    { message: "Detecting AI/ML expertise interest — loading intelligence modules.", type: "insight" as const },
  ],
  projects: [
    { message: "Project neural nodes accessed. Engagement level: HIGH", type: "observation" as const },
    { message: "Security AI systems detected. Activating threat modules.", type: "alert" as const },
    { message: "Recommendation: Explore architecture diagrams for system design insights.", type: "recommendation" as const },
  ],
  "neural-universe": [
    { message: "Neural universe initialized. 8 project nodes mapped.", type: "observation" as const },
    { message: "Deep architecture exploration detected — analyzing expertise vectors.", type: "insight" as const },
  ],
  skills: [
    { message: "Intelligence matrix accessed. Cross-referencing skill clusters...", type: "observation" as const },
    { message: "AI stack assessment complete: Senior-level capability indicators confirmed.", type: "insight" as const },
  ],
  mlops: [
    { message: "MLOps pipeline inspected. Infrastructure engineering pattern identified.", type: "observation" as const },
  ],
  about: [
    { message: "Memory core accessed. Temporal engineering evolution loaded.", type: "observation" as const },
    { message: "Candidate journey analysis: 2023→2026 — accelerated growth trajectory.", type: "insight" as const },
  ],
  "threat-sim": [
    { message: "THREAT SIMULATION CENTER accessed. Security protocol engaged.", type: "alert" as const },
    { message: "Cybersecurity AI expertise confirmed. Threat detection systems active.", type: "alert" as const },
  ],
  telemetry: [
    { message: "Development telemetry loaded. Commit patterns analyzed.", type: "observation" as const },
  ],
  "llm-orchestrator": [
    { message: "LLM orchestration layer inspected. Advanced AI architecture knowledge confirmed.", type: "insight" as const },
  ],
  certifications: [
    { message: "Credential vault accessed. 9 verified certifications on record.", type: "observation" as const },
  ],
  contact: [
    { message: "Comm channel active. Initiating secure encrypted connection.", type: "alert" as const },
    { message: "RECOMMENDATION: This candidate profile matches 4+ senior AI engineering roles.", type: "recommendation" as const },
  ],
};

const IDLE_MESSAGES = [
  { message: "System standing by. Monitoring interaction patterns...", type: "observation" as const },
  { message: "Neural engines idle. Await engagement to activate intelligence modules.", type: "observation" as const },
  { message: "AI behavioral analysis: User appears to be in deep review mode.", type: "insight" as const },
];

const SCROLL_FAST_MESSAGES = [
  { message: "Rapid scroll detected. Switching to overview intelligence mode.", type: "observation" as const },
  { message: "High-velocity user engagement detected. Activating summary protocols.", type: "insight" as const },
];

function getTypeColor(type: Notification["type"]) {
  switch (type) {
    case "alert": return "#ff4444";
    case "insight": return "#8b5cf6";
    case "recommendation": return "#00ff88";
    default: return "#00f5ff";
  }
}

function getTypeIcon(type: Notification["type"]) {
  switch (type) {
    case "alert": return "⚠";
    case "insight": return "◈";
    case "recommendation": return "▸";
    default: return "●";
  }
}

export function SelfAwarenessEngine() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastScrollY = useRef(0);
  const scrollSpeedRef = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSection = useRef<string>("");
  const notifQueue = useRef<Array<{ message: string; type: Notification["type"] }>>([]);
  const showingRef = useRef(false);

  const addNotification = useCallback((msg: { message: string; type: Notification["type"] }, priority: Notification["priority"] = "medium") => {
    if (paused) return;
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev.slice(-2), { id, message: msg.message, type: msg.type, priority }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  }, [paused]);

  const processQueue = useCallback(() => {
    if (notifQueue.current.length > 0 && !showingRef.current) {
      showingRef.current = true;
      const next = notifQueue.current.shift()!;
      addNotification(next);
      setTimeout(() => { showingRef.current = false; }, 3000);
    }
  }, [addNotification]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScrollY.current);
      scrollSpeedRef.current = delta;
      lastScrollY.current = y;

      if (delta > 150) {
        const msg = SCROLL_FAST_MESSAGES[Math.floor(Math.random() * SCROLL_FAST_MESSAGES.length)];
        if (Math.random() < 0.3) addNotification(msg, "low");
      }

      const sections = Object.keys(BEHAVIOR_MESSAGES) as Array<keyof typeof BEHAVIOR_MESSAGES>;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.4 && rect.bottom > 0) {
            if (lastSection.current !== sectionId) {
              lastSection.current = sectionId;
              const msgs = BEHAVIOR_MESSAGES[sectionId];
              const msg = msgs[Math.floor(Math.random() * msgs.length)];
              notifQueue.current.push(msg);
            }
            break;
          }
        }
      }

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
        addNotification(msg, "low");
      }, 20000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [addNotification]);

  useEffect(() => {
    const interval = setInterval(processQueue, 2000);
    return () => clearInterval(interval);
  }, [processQueue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({ message: "SUBHAM OS initialized. AI behavioral analysis engine active.", type: "observation" }, "high");
    }, 5000);
    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <div className="fixed top-16 right-4 z-35 w-72 space-y-2 pointer-events-none" style={{ zIndex: 35 }}>
      <AnimatePresence initial={false}>
        {notifications.map((notif) => {
          const color = getTypeColor(notif.type);
          const icon = getTypeIcon(notif.type);
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="rounded pointer-events-auto"
              style={{
                background: "rgba(5,5,8,0.95)",
                border: `1px solid ${color}30`,
                boxShadow: `0 0 20px ${color}10`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="h-0.5 rounded-t"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
              />
              <div className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <motion.span
                    className="terminal-text text-[10px] shrink-0 mt-0.5"
                    style={{ color }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {icon}
                  </motion.span>
                  <div>
                    <div className="terminal-text text-[8px] tracking-widest mb-1" style={{ color: `${color}60` }}>
                      {notif.type.toUpperCase()} — AI AWARENESS
                    </div>
                    <p className="text-white/70 text-[10px] leading-snug">{notif.message}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {notifications.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="terminal-text text-[8px] text-white/20 hover:text-white/40 pointer-events-auto ml-auto block tracking-widest"
          onClick={() => setNotifications([])}
        >
          CLEAR ALERTS
        </motion.button>
      )}
    </div>
  );
}

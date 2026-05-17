import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mood = "CALM" | "ENGAGED" | "CYBER" | "STEALTH" | "RESEARCH";

interface MoodState {
  mood: Mood;
  intensity: number;
}

const MoodContext = createContext<MoodState>({ mood: "CALM", intensity: 0.5 });

export function useMood() {
  return useContext(MoodContext);
}

const MOOD_CONFIG: Record<Mood, {
  label: string;
  color: string;
  description: string;
  particleColor: string;
  glowIntensity: number;
}> = {
  CALM: {
    label: "CALM EXPLORATION",
    color: "#00f5ff",
    description: "Standard analytical mode",
    particleColor: "#00f5ff",
    glowIntensity: 0.5,
  },
  ENGAGED: {
    label: "ENGAGED",
    color: "#8b5cf6",
    description: "Deep engagement detected",
    particleColor: "#8b5cf6",
    glowIntensity: 0.8,
  },
  CYBER: {
    label: "CYBER MODE",
    color: "#ff4444",
    description: "High velocity — security protocols active",
    particleColor: "#ff4444",
    glowIntensity: 1.0,
  },
  STEALTH: {
    label: "STEALTH MODE",
    color: "#00ff88",
    description: "Low-light operations active",
    particleColor: "#00ff88",
    glowIntensity: 0.3,
  },
  RESEARCH: {
    label: "RESEARCH MODE",
    color: "#00e5ff",
    description: "Deep analysis underway",
    particleColor: "#00e5ff",
    glowIntensity: 0.6,
  },
};

function detectMood(
  mouseVelocity: number,
  scrollSpeed: number,
  isNight: boolean,
  isIdle: boolean,
  dwellTime: number
): Mood {
  if (isIdle) return "STEALTH";
  if (isNight) return "STEALTH";
  if (mouseVelocity > 300 || scrollSpeed > 200) return "CYBER";
  if (dwellTime > 4000) return "RESEARCH";
  if (mouseVelocity > 100 || scrollSpeed > 80) return "ENGAGED";
  return "CALM";
}

export function AIMoodProvider({ children }: { children: React.ReactNode }) {
  const [moodState, setMoodState] = useState<MoodState>({ mood: "CALM", intensity: 0.5 });
  const [showIndicator, setShowIndicator] = useState(false);
  const lastMoodRef = useRef<Mood>("CALM");
  const mouseVelRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0, t: 0 });
  const scrollSpeedRef = useRef(0);
  const lastScrollRef = useRef({ y: 0, t: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdleRef = useRef(false);
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellTimeRef = useRef(0);
  const dwellStartRef = useRef(0);

  const updateMood = useCallback(() => {
    const now = Date.now();
    const hour = new Date().getHours();
    const isNight = hour >= 22 || hour <= 5;
    const dwell = dwellStartRef.current ? now - dwellStartRef.current : 0;

    const newMood = detectMood(
      mouseVelRef.current,
      scrollSpeedRef.current,
      isNight,
      isIdleRef.current,
      dwell
    );

    if (newMood !== lastMoodRef.current) {
      lastMoodRef.current = newMood;
      const config = MOOD_CONFIG[newMood];
      setMoodState({ mood: newMood, intensity: config.glowIntensity });
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 4000);

      document.documentElement.style.setProperty("--mood-color", config.particleColor);
      document.documentElement.style.setProperty("--mood-intensity", config.glowIntensity.toString());
    }

    setTimeout(() => {
      mouseVelRef.current = Math.max(0, mouseVelRef.current - 50);
      scrollSpeedRef.current = Math.max(0, scrollSpeedRef.current - 30);
    }, 500);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMouseRef.current.t;
      if (dt > 0) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouseVelRef.current = (dist / dt) * 1000;
      }
      lastMouseRef.current = { x: e.clientX, y: e.clientY, t: now };

      isIdleRef.current = false;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => { isIdleRef.current = true; }, 30000);
    };

    const handleScroll = () => {
      const now = Date.now();
      const y = window.scrollY;
      const dt = now - lastScrollRef.current.t;
      if (dt > 0) {
        scrollSpeedRef.current = (Math.abs(y - lastScrollRef.current.y) / dt) * 1000;
      }
      lastScrollRef.current = { y, t: now };
    };

    const handleMouseEnter = () => { dwellStartRef.current = Date.now(); };
    const handleMouseLeave = () => { dwellStartRef.current = 0; };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const interval = setInterval(updateMood, 1000);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(interval);
    };
  }, [updateMood]);

  const config = MOOD_CONFIG[moodState.mood];

  return (
    <MoodContext.Provider value={moodState}>
      {children}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-6 z-30 rounded"
            style={{
              background: "rgba(5,5,8,0.95)",
              border: `1px solid ${config.color}30`,
              boxShadow: `0 0 20px ${config.color}20`,
              pointerEvents: "none",
            }}
          >
            <div
              className="h-0.5 rounded-t"
              style={{ background: `linear-gradient(90deg, ${config.color}, transparent)` }}
            />
            <div className="px-3 py-2">
              <div className="terminal-text text-[8px] tracking-widest mb-0.5" style={{ color: `${config.color}60` }}>
                AI MOOD ENGINE
              </div>
              <div className="terminal-text text-xs font-bold" style={{ color: config.color }}>
                {config.label}
              </div>
              <div className="terminal-text text-[9px] text-white/30">{config.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="fixed bottom-6 left-6 z-25 flex items-center gap-2"
        style={{ zIndex: 25 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: config.color }}
          animate={{
            opacity: [1, 0.4, 1],
            boxShadow: [`0 0 4px ${config.color}`, `0 0 10px ${config.color}`, `0 0 4px ${config.color}`],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="terminal-text text-[8px] tracking-widest" style={{ color: `${config.color}60` }}>
          {config.label}
        </span>
      </div>
    </MoodContext.Provider>
  );
}

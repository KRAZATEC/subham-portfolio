import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const SAMPLE_URLS = [
  { url: "https://secure-bank-login.xyz/verify", threat: true, score: 94, type: "PHISHING" },
  { url: "https://github.com/KRAZATEC", threat: false, score: 2, type: "SAFE" },
  { url: "http://192.168.1.1/admin-panel-click", threat: true, score: 87, type: "SUSPICIOUS" },
  { url: "https://linkedin.com/in/krazatec", threat: false, score: 1, type: "SAFE" },
  { url: "http://free-crypto-wallet.ru/claim", threat: true, score: 98, type: "MALWARE" },
  { url: "https://gitam.edu/portal", threat: false, score: 5, type: "SAFE" },
];

const PACKET_TYPES = [
  { label: "HTTP GET", color: "#00f5ff", count: 0 },
  { label: "HTTP POST", color: "#8b5cf6", count: 0 },
  { label: "DNS QUERY", color: "#00ff88", count: 0 },
  { label: "ANOMALOUS", color: "#ff4444", count: 0 },
];

function ScanResult({ url, scanning }: { url: typeof SAMPLE_URLS[0] | null; scanning: boolean }) {
  if (!url && !scanning) return null;
  return (
    <AnimatePresence mode="wait">
      {scanning && (
        <motion.div
          key="scanning"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-3 p-3 rounded terminal-text text-xs"
          style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#00f5ff]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-[#00f5ff]">SCANNING URL...</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-[#00f5ff]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
      {url && !scanning && (
        <motion.div
          key={url.url}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 p-3 rounded"
          style={{
            background: url.threat ? "rgba(255,68,68,0.08)" : "rgba(0,255,136,0.08)",
            border: `1px solid ${url.threat ? "#ff444440" : "#00ff8840"}`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="terminal-text text-xs" style={{ color: url.threat ? "#ff4444" : "#00ff88" }}>
              {url.threat ? "⚠ THREAT DETECTED" : "✓ URL IS SAFE"}
            </div>
            <div
              className="terminal-text text-xs px-2 py-0.5 rounded"
              style={{
                background: url.threat ? "rgba(255,68,68,0.2)" : "rgba(0,255,136,0.2)",
                color: url.threat ? "#ff4444" : "#00ff88",
              }}
            >
              {url.type}
            </div>
          </div>
          <div className="terminal-text text-[10px] text-white/40 break-all mb-2">{url.url}</div>
          <div className="flex items-center gap-3">
            <span className="terminal-text text-[10px] text-white/40">THREAT SCORE</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${url.score}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ background: url.threat ? "#ff4444" : "#00ff88" }}
              />
            </div>
            <span className="terminal-text text-xs font-bold" style={{ color: url.threat ? "#ff4444" : "#00ff88" }}>
              {url.score}/100
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PacketStream() {
  const [packets, setPackets] = useState(PACKET_TYPES.map((p) => ({ ...p, count: Math.floor(Math.random() * 500) + 100 })));
  const [stream, setStream] = useState<Array<{ id: number; type: string; color: string; src: string; dst: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets((prev) => prev.map((p, i) => ({
        ...p,
        count: p.count + Math.floor(Math.random() * (i === 3 ? 2 : 15)),
      })));
      const type = PACKET_TYPES[Math.random() < 0.05 ? 3 : Math.floor(Math.random() * 3)];
      const src = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const dst = `192.168.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 255)}`;
      setStream((prev) => [
        { id: Date.now(), type: type.label, color: type.color, src, dst },
        ...prev.slice(0, 6),
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {packets.map((p) => (
          <div key={p.label} className="p-2.5 rounded" style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
            <div className="flex justify-between items-center">
              <span className="terminal-text text-[9px] text-white/40 tracking-widest">{p.label}</span>
              <motion.span
                key={p.count}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="terminal-text text-sm font-bold"
                style={{ color: p.color }}
              >
                {p.count.toLocaleString()}
              </motion.span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded overflow-hidden" style={{ background: "#020206", border: "1px solid rgba(0,245,255,0.1)" }}>
        <div className="px-3 py-1.5 border-b border-[#00f5ff]/10 terminal-text text-[9px] text-[#00f5ff]/60 tracking-widest">
          LIVE PACKET STREAM
        </div>
        <div className="p-2 h-36 overflow-hidden">
          <AnimatePresence initial={false}>
            {stream.map((pkt) => (
              <motion.div
                key={pkt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="terminal-text text-[9px] py-0.5 flex gap-2"
              >
                <span style={{ color: pkt.color }}>[{pkt.type}]</span>
                <span className="text-white/30">{pkt.src}</span>
                <span className="text-white/20">→</span>
                <span className="text-white/30">{pkt.dst}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ThreatHeatmap() {
  const days = 7;
  const hours = 12;
  const [cells] = useState(() =>
    Array.from({ length: days }, () =>
      Array.from({ length: hours }, () => Math.random())
    )
  );
  const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const hourLabels = Array.from({ length: hours }, (_, i) => `${(i * 2).toString().padStart(2, "0")}h`);

  return (
    <div>
      <div className="terminal-text text-[9px] text-white/30 tracking-widest mb-2">THREAT ACTIVITY HEATMAP (7 DAYS)</div>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-1">
            <div className="h-4" />
            {dayLabels.map((d) => (
              <div key={d} className="terminal-text text-[8px] text-white/20 h-5 flex items-center">{d}</div>
            ))}
          </div>
          <div>
            <div className="flex gap-1 mb-1">
              {hourLabels.map((h) => (
                <div key={h} className="terminal-text text-[7px] text-white/15 w-5 text-center">{h}</div>
              ))}
            </div>
            {cells.map((row, di) => (
              <div key={di} className="flex gap-1 mb-1">
                {row.map((val, hi) => (
                  <motion.div
                    key={hi}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (di * hours + hi) * 0.005 }}
                    className="w-5 h-5 rounded-sm"
                    style={{
                      background: val > 0.8 ? "#ff444440" : val > 0.5 ? "#ff8c0030" : val > 0.2 ? "#00f5ff15" : "#ffffff08",
                      border: val > 0.8 ? "1px solid #ff444440" : "1px solid transparent",
                    }}
                    title={`${(val * 100).toFixed(0)}% activity`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="terminal-text text-[8px] text-white/20">LOW</span>
          {["#ffffff08", "#00f5ff15", "#ff8c0030", "#ff444440"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          <span className="terminal-text text-[8px] text-white/20">HIGH</span>
        </div>
      </div>
    </div>
  );
}

export function ThreatSimulation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [scanUrl, setScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<typeof SAMPLE_URLS[0] | null>(null);
  const [alerts, setAlerts] = useState<Array<{ id: number; msg: string; level: string }>>([]);

  useEffect(() => {
    const messages = [
      { msg: "Anomaly detected in packet stream — flagged for review", level: "WARN" },
      { msg: "Phishing domain blocked: secure-bank-login.xyz", level: "ALERT" },
      { msg: "Network baseline updated — 14,293 packets/sec", level: "INFO" },
      { msg: "AI NIDS: 0 intrusions in last scan cycle", level: "OK" },
      { msg: "PII scan complete — 0 exposures found", level: "OK" },
      { msg: "Threat feed synchronized — 847 new indicators", level: "INFO" },
    ];
    let i = 0;
    const interval = setInterval(() => {
      setAlerts((prev) => [
        { id: Date.now(), msg: messages[i % messages.length].msg, level: messages[i % messages.length].level },
        ...prev.slice(0, 4),
      ]);
      i++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    if (!scanUrl.trim() || scanning) return;
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const match = SAMPLE_URLS.find((u) => scanUrl.toLowerCase().includes(u.url.split("//")[1]?.split("/")[0] || "NOMATCH"));
      const result = match || SAMPLE_URLS[Math.floor(Math.random() * SAMPLE_URLS.length)];
      setScanResult(result);
      setScanning(false);
    }, 1800);
  };

  const alertColors: Record<string, string> = { ALERT: "#ff4444", WARN: "#ff8c00", INFO: "#00f5ff", OK: "#00ff88" };

  return (
    <section id="threat-sim" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff4444]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="terminal-text text-[#ff4444]/40 text-xs tracking-[0.4em] mb-3">
            &gt; INITIALIZING THREAT SIMULATION CENTER...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            THREAT <span className="text-[#ff4444]" style={{ textShadow: "0 0 20px #ff444444" }}>SIMULATION</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            AI-POWERED SECURITY OPERATIONS CENTER
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-lg"
              style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(255,68,68,0.2)" }}
            >
              <div className="terminal-text text-xs text-[#ff4444]/70 tracking-widest mb-3">
                PHISHING URL SCANNER
              </div>
              <div className="flex gap-2">
                <input
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  placeholder="Enter URL to scan (e.g. http://suspicious-site.xyz)"
                  className="flex-1 bg-transparent terminal-text text-xs text-white/70 outline-none px-3 py-2 rounded"
                  style={{ background: "rgba(255,68,68,0.05)", border: "1px solid rgba(255,68,68,0.2)" }}
                />
                <button
                  onClick={handleScan}
                  disabled={scanning || !scanUrl.trim()}
                  className="terminal-text text-[10px] px-4 py-2 rounded transition-all"
                  style={{
                    background: "rgba(255,68,68,0.15)",
                    border: "1px solid rgba(255,68,68,0.4)",
                    color: "#ff4444",
                    opacity: scanning || !scanUrl.trim() ? 0.5 : 1,
                  }}
                >
                  SCAN
                </button>
              </div>
              <ScanResult url={scanResult} scanning={scanning} />
              <div className="flex gap-2 mt-3 flex-wrap">
                {SAMPLE_URLS.slice(0, 3).map((u) => (
                  <button
                    key={u.url}
                    onClick={() => { setScanUrl(u.url); setScanResult(null); }}
                    className="terminal-text text-[9px] px-2 py-0.5 rounded border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-all truncate max-w-[160px]"
                  >
                    {u.url.slice(8, 30)}...
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-lg"
              style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(0,245,255,0.15)" }}
            >
              <div className="terminal-text text-xs text-[#00f5ff]/60 tracking-widest mb-3">
                PACKET STREAM ANALYZER
              </div>
              <PacketStream />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-lg"
              style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(255,68,68,0.15)" }}
            >
              <div className="terminal-text text-xs text-[#ff4444]/60 tracking-widest mb-3">LIVE ALERTS</div>
              <div className="space-y-2 h-40 overflow-hidden">
                <AnimatePresence initial={false}>
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-2 rounded"
                      style={{ background: `${alertColors[alert.level]}08`, border: `1px solid ${alertColors[alert.level]}20` }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: alertColors[alert.level] }} />
                        <span className="terminal-text text-[9px]" style={{ color: alertColors[alert.level] }}>{alert.level}</span>
                      </div>
                      <p className="text-white/50 text-[10px] leading-snug">{alert.msg}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-lg"
              style={{ background: "rgba(5,5,8,0.8)", border: "1px solid rgba(0,245,255,0.1)" }}
            >
              <ThreatHeatmap />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface CloudNode {
  id: string;
  label: string;
  provider: "AWS" | "Azure" | "GCP";
  lat: number;
  lon: number;
  type: string;
  color: string;
}

const CLOUD_NODES: CloudNode[] = [
  { id: "aws-us-east", label: "AWS US-East", provider: "AWS", lat: 38, lon: -78, type: "Primary Region", color: "#ff8c00" },
  { id: "aws-eu-west", label: "AWS EU-West", provider: "AWS", lat: 51, lon: -1, type: "EU Region", color: "#ff8c00" },
  { id: "aws-ap-south", label: "AWS AP-South", provider: "AWS", lat: 19, lon: 73, type: "APAC Region", color: "#ff8c00" },
  { id: "azure-us-central", label: "Azure US-Central", provider: "Azure", lat: 40, lon: -97, type: "ML Cluster", color: "#0080ff" },
  { id: "azure-eu-north", label: "Azure EU-North", provider: "Azure", lat: 53, lon: 8, type: "AI Services", color: "#0080ff" },
  { id: "gcp-us-west", label: "GCP US-West", provider: "GCP", lat: 37, lon: -122, type: "LLM Inference", color: "#00f5ff" },
  { id: "gcp-ap-east", label: "GCP AP-East", provider: "GCP", lat: 35, lon: 137, type: "AI Platform", color: "#00f5ff" },
  { id: "gcp-india", label: "GCP Mumbai", provider: "GCP", lat: 19, lon: 73, type: "Edge Node", color: "#00ff88" },
  { id: "sec-node", label: "Threat Intel", provider: "AWS", lat: 25, lon: 55, type: "Security Hub", color: "#ff4444" },
  { id: "ai-node", label: "AI Inference Hub", provider: "GCP", lat: 1, lon: 103, type: "LLM Gateway", color: "#8b5cf6" },
];

const CONNECTIONS = [
  ["aws-us-east", "aws-eu-west"],
  ["aws-us-east", "azure-us-central"],
  ["aws-eu-west", "azure-eu-north"],
  ["azure-us-central", "gcp-us-west"],
  ["gcp-us-west", "gcp-ap-east"],
  ["aws-ap-south", "gcp-india"],
  ["sec-node", "aws-eu-west"],
  ["sec-node", "aws-ap-south"],
  ["ai-node", "gcp-ap-east"],
  ["ai-node", "gcp-india"],
];

const W = 700;
const H = 340;

function latLonToXY(lat: number, lon: number, rotation: number): { x: number; y: number; visible: boolean } {
  const lonRad = ((lon + rotation) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const cosLat = Math.cos(latRad);
  const x = W / 2 + (Math.sin(lonRad) * cosLat * W * 0.32);
  const y = H / 2 - (Math.sin(latRad) * H * 0.42);
  const visible = Math.cos(lonRad) * cosLat > -0.1;
  return { x, y, visible };
}

function GlobeCanvas({ rotation, selectedNode, onSelect }: {
  rotation: number;
  selectedNode: string | null;
  onSelect: (id: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = W / 2, cy = H / 2;
    const rx = W * 0.32, ry = H * 0.42;

    ctx.clearRect(0, 0, W, H);

    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    bgGrad.addColorStop(0, "rgba(0,10,30,0.8)");
    bgGrad.addColorStop(0.7, "rgba(0,5,20,0.6)");
    bgGrad.addColorStop(1, "transparent");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(0,245,255,0.06)";
    ctx.lineWidth = 0.5;
    for (let lat = -80; lat <= 80; lat += 20) {
      const latRad = (lat * Math.PI) / 180;
      const cosLat = Math.cos(latRad);
      const yPos = cy - Math.sin(latRad) * ry;
      const xRad = rx * cosLat;
      if (xRad > 5) {
        ctx.beginPath();
        ctx.ellipse(cx, yPos, xRad, ry * 0.05, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const lonRad = ((lon + rotation) * Math.PI) / 180;
      const visible = Math.cos(lonRad) > 0;
      if (visible) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const { x, y } = latLonToXY(lat, lon, rotation);
          if (lat === -90) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(0,245,255,0.04)";
        ctx.stroke();
      }
    }

    ctx.strokeStyle = "rgba(0,245,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    const glowGrad = ctx.createRadialGradient(cx - rx * 0.3, cy - ry * 0.3, 0, cx, cy, rx);
    glowGrad.addColorStop(0, "rgba(0,245,255,0.06)");
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    CONNECTIONS.forEach(([fromId, toId]) => {
      const n1 = CLOUD_NODES.find((n) => n.id === fromId)!;
      const n2 = CLOUD_NODES.find((n) => n.id === toId)!;
      const p1 = latLonToXY(n1.lat, n1.lon, rotation);
      const p2 = latLonToXY(n2.lat, n2.lon, rotation);
      if (!p1.visible || !p2.visible) return;
      const isSelected = selectedNode === fromId || selectedNode === toId;
      ctx.beginPath();
      const midX = (p1.x + p2.x) / 2;
      const midY = Math.min(p1.y, p2.y) - 30;
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.strokeStyle = isSelected ? "rgba(0,245,255,0.6)" : "rgba(0,245,255,0.12)";
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.stroke();
    });
  }, [rotation, selectedNode]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (const node of CLOUD_NODES) {
      const pos = latLonToXY(node.lat, node.lon, rotation);
      if (!pos.visible) continue;
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 16) {
        onSelect(selectedNode === node.id ? null : node.id);
        return;
      }
    }
    onSelect(null);
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full h-full cursor-crosshair"
        onClick={handleClick}
      />
      {CLOUD_NODES.map((node) => {
        const pos = latLonToXY(node.lat, node.lon, rotation);
        if (!pos.visible) return null;
        const isSelected = selectedNode === node.id;
        const left = `${(pos.x / W) * 100}%`;
        const top = `${(pos.y / H) * 100}%`;
        return (
          <motion.button
            key={node.id}
            className="absolute"
            style={{ left, top, transform: "translate(-50%,-50%)", zIndex: isSelected ? 20 : 5 }}
            onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : node.id); }}
          >
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ background: node.color, boxShadow: `0 0 ${isSelected ? 16 : 8}px ${node.color}` }}
              animate={{
                scale: isSelected ? [1, 1.5, 1] : [1, 1.2, 1],
                opacity: isSelected ? 1 : [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

export function GlobalNetworkMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [rotation, setRotation] = useState(20);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      frame++;
      if (frame % 3 === 0) {
        setRotation((r) => (r + 0.15) % 360);
      }
    };
    if (inView) animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [inView]);

  const selected = CLOUD_NODES.find((n) => n.id === selectedNode);
  const providerCounts = { AWS: 0, Azure: 0, GCP: 0 };
  CLOUD_NODES.forEach((n) => providerCounts[n.provider]++);

  return (
    <section id="global-map" className="py-24 px-4 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5ff]/2 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="terminal-text text-[#00f5ff]/40 text-xs tracking-[0.4em] mb-3">
            &gt; CONNECTING TO GLOBAL AI INFRASTRUCTURE...
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            GLOBAL AI <span className="text-[#00f5ff]" style={{ textShadow: "0 0 20px #00f5ff44" }}>NETWORK</span>
          </h2>
          <div className="mt-3 terminal-text text-xs text-white/30 tracking-widest">
            WORLDWIDE CLOUD INFRASTRUCTURE MAP — CLICK NODES TO INSPECT
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div
              className="rounded-lg overflow-hidden"
              style={{ background: "#020208", border: "1px solid rgba(0,245,255,0.15)" }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#00f5ff]/10">
                <div className="terminal-text text-[10px] text-[#00f5ff]/60 tracking-widest">GLOBAL INFRASTRUCTURE VIEW</div>
                <div className="flex items-center gap-3">
                  {(["AWS", "Azure", "GCP"] as const).map((p) => (
                    <div key={p} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: p === "AWS" ? "#ff8c00" : p === "Azure" ? "#0080ff" : "#00f5ff" }} />
                      <span className="terminal-text text-[8px] text-white/40">{p} {providerCounts[p]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <GlobeCanvas rotation={rotation} selectedNode={selectedNode} onSelect={setSelectedNode} />
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg"
                  style={{ background: `${selected.color}08`, border: `1px solid ${selected.color}30` }}
                >
                  <div className="terminal-text text-[8px] tracking-widest mb-1" style={{ color: `${selected.color}60` }}>
                    {selected.provider} NODE
                  </div>
                  <div className="terminal-text text-xs font-bold mb-1" style={{ color: selected.color }}>
                    {selected.label}
                  </div>
                  <div className="text-white/50 text-[11px] mb-2">{selected.type}</div>
                  <div className="space-y-1">
                    {["ONLINE", "99.99% SLA", "Auto-scaling ON", "Encryption: AES-256"].map((s) => (
                      <div key={s} className="terminal-text text-[9px] text-white/40 flex items-center gap-1.5">
                        <span style={{ color: "#00ff88" }}>●</span>{s}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="terminal-text text-[8px] text-white/20 hover:text-white/50 mt-2 block">
                    ✕ CLOSE
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="p-4 rounded-lg text-center"
                  style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}
                >
                  <div className="terminal-text text-[9px] text-white/20">CLICK A NODE TO INSPECT INFRASTRUCTURE</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <div className="terminal-text text-[9px] text-white/30 tracking-widest">NETWORK STATUS</div>
              {[
                { label: "TOTAL NODES", value: `${CLOUD_NODES.length}`, color: "#00f5ff" },
                { label: "CONNECTIONS", value: `${CONNECTIONS.length}`, color: "#8b5cf6" },
                { label: "UPTIME", value: "99.98%", color: "#00ff88" },
                { label: "LATENCY AVG", value: "12ms", color: "#ff8c00" },
              ].map((m) => (
                <div key={m.label} className="flex justify-between items-center p-2 rounded"
                  style={{ background: `${m.color}08`, border: `1px solid ${m.color}15` }}>
                  <span className="terminal-text text-[9px] text-white/40">{m.label}</span>
                  <span className="terminal-text text-xs font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg" style={{ background: "rgba(255,68,68,0.05)", border: "1px solid rgba(255,68,68,0.15)" }}>
              <div className="terminal-text text-[9px] text-[#ff4444]/60 tracking-widest mb-2">THREAT INTEL</div>
              {["0 active threats", "Monitoring: 24/7", "SOC: OPERATIONAL", "IDS: ACTIVE"].map((t) => (
                <div key={t} className="terminal-text text-[9px] text-white/30 py-0.5 flex items-center gap-1.5">
                  <span className="text-[#00ff88]">●</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

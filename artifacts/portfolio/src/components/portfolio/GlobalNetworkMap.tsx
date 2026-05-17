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
  { id: "aws-us-east",     label: "AWS Virginia",    provider: "AWS",   lat: 39,  lon: -77,  type: "Primary Region",   color: "#ff8c00" },
  { id: "aws-eu-west",     label: "AWS Ireland",     provider: "AWS",   lat: 53,  lon: -8,   type: "EU Region",        color: "#ff8c00" },
  { id: "aws-ap-south",    label: "AWS Singapore",   provider: "AWS",   lat: 1,   lon: 104,  type: "APAC Region",      color: "#ff8c00" },
  { id: "azure-us",        label: "Azure Texas",     provider: "Azure", lat: 33,  lon: -97,  type: "ML Cluster",       color: "#0080ff" },
  { id: "azure-eu",        label: "Azure Amsterdam", provider: "Azure", lat: 52,  lon: 5,    type: "AI Services",      color: "#0080ff" },
  { id: "gcp-us-west",     label: "GCP California",  provider: "GCP",   lat: 37,  lon: -122, type: "LLM Inference",    color: "#00f5ff" },
  { id: "gcp-ap-east",     label: "GCP Tokyo",       provider: "GCP",   lat: 35,  lon: 139,  type: "AI Platform",      color: "#00f5ff" },
  { id: "gcp-india",       label: "GCP Mumbai",      provider: "GCP",   lat: 19,  lon: 73,   type: "Edge Node",        color: "#00ff88" },
  { id: "sec-node",        label: "Threat Intel",    provider: "AWS",   lat: 25,  lon: 55,   type: "Security Hub",     color: "#ff4444" },
  { id: "ai-node",         label: "AI Hub",          provider: "GCP",   lat: -34, lon: 151,  type: "LLM Gateway",      color: "#8b5cf6" },
  { id: "aws-sa",          label: "AWS São Paulo",   provider: "AWS",   lat: -23, lon: -46,  type: "South America",    color: "#ff8c00" },
  { id: "azure-aus",       label: "Azure Sydney",    provider: "Azure", lat: -33, lon: 151,  type: "Pacific Node",     color: "#0080ff" },
];

const CONNECTIONS = [
  ["aws-us-east", "aws-eu-west"],
  ["aws-us-east", "azure-us"],
  ["aws-eu-west", "azure-eu"],
  ["azure-us", "gcp-us-west"],
  ["gcp-us-west", "gcp-ap-east"],
  ["aws-ap-south", "gcp-india"],
  ["sec-node", "aws-eu-west"],
  ["ai-node", "gcp-ap-east"],
  ["gcp-india", "aws-ap-south"],
  ["aws-sa", "aws-us-east"],
  ["azure-aus", "ai-node"],
];

const TILT = 23 * Math.PI / 180;

function orthoProject(
  lat: number, lon: number, rotation: number,
  cx: number, cy: number, R: number
) {
  const φ = lat * Math.PI / 180;
  const λ = (lon + rotation) * Math.PI / 180;
  const cosφ = Math.cos(φ), sinφ = Math.sin(φ);
  const cosλ = Math.cos(λ), sinλ = Math.sin(λ);
  const cosTilt = Math.cos(TILT), sinTilt = Math.sin(TILT);

  const x = R * cosφ * sinλ;
  const y = R * (sinφ * cosTilt - cosφ * cosλ * sinTilt);
  const z = sinφ * sinTilt + cosφ * cosλ * cosTilt;

  return { x: cx + x, y: cy - y, visible: z > 0.01, depth: z };
}

const W = 680;
const H = 360;

function GlobeCanvas({
  rotation, selectedNode, onSelect
}: {
  rotation: number;
  selectedNode: string | null;
  onSelect: (id: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) * 0.43;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // Sphere fill gradient
    const sphereGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
    sphereGrad.addColorStop(0, "rgba(0, 18, 60, 0.95)");
    sphereGrad.addColorStop(0.5, "rgba(0, 10, 35, 0.9)");
    sphereGrad.addColorStop(1, "rgba(0, 4, 18, 0.85)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    // Draw latitude grid lines
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 3) {
        const p = orthoProject(lat, lon, rotation, cx, cy, R);
        if (!p.visible) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = lat === 0 ? "rgba(0,245,255,0.18)" : "rgba(0,245,255,0.07)";
      ctx.lineWidth = lat === 0 ? 0.8 : 0.5;
      ctx.stroke();
    }

    // Draw longitude grid lines
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -85; lat <= 85; lat += 3) {
        const p = orthoProject(lat, lon, rotation, cx, cy, R);
        if (!p.visible) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(0,245,255,0.07)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw simplified continental dots/patches for visual texture
    const CONTINENTS = [
      // North America outline points
      ...[
        [50,-125],[60,-130],[70,-140],[75,-85],[65,-65],[50,-55],[45,-65],[40,-75],
        [30,-80],[25,-80],[25,-90],[30,-95],[35,-100],[40,-110],[45,-115],[50,-120],
      ].map(([lat,lon]) => ({lat, lon, a: 0.15})),
      // Europe
      ...[
        [58,5],[60,15],[65,25],[60,30],[55,25],[50,15],[45,10],[43,5],[48,2],[55,8],
      ].map(([lat,lon]) => ({lat, lon, a: 0.15})),
      // Asia
      ...[
        [55,40],[60,60],[65,80],[60,100],[55,120],[45,130],[35,120],[25,110],[20,100],[30,80],[40,70],[50,60],
      ].map(([lat,lon]) => ({lat, lon, a: 0.15})),
      // Africa
      ...[
        [35,10],[30,20],[20,35],[10,40],[0,40],[-10,35],[-20,35],[-30,28],[-20,15],[0,10],[10,5],[20,0],[30,5],
      ].map(([lat,lon]) => ({lat, lon, a: 0.12})),
      // South America
      ...[
        [10,-75],[5,-60],[0,-50],[-10,-40],[-20,-45],[-30,-52],[-40,-65],[-30,-70],[-20,-70],[-10,-75],[0,-80],[10,-75],
      ].map(([lat,lon]) => ({lat, lon, a: 0.13})),
      // Australia
      ...[
        [-15,130],[-25,130],[-35,140],[-35,150],[-30,155],[-20,150],[-15,140],
      ].map(([lat,lon]) => ({lat, lon, a: 0.12})),
    ];

    // Draw land as small filled areas
    for (const pt of CONTINENTS) {
      const p = orthoProject(pt.lat, pt.lon, rotation, cx, cy, R);
      if (!p.visible) continue;
      const alpha = pt.a * (0.5 + p.depth * 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,180,120,${alpha})`;
      ctx.fill();
    }

    // Draw connection arcs
    CONNECTIONS.forEach(([fromId, toId]) => {
      const n1 = CLOUD_NODES.find((n) => n.id === fromId)!;
      const n2 = CLOUD_NODES.find((n) => n.id === toId)!;
      const p1 = orthoProject(n1.lat, n1.lon, rotation, cx, cy, R);
      const p2 = orthoProject(n2.lat, n2.lon, rotation, cx, cy, R);
      if (!p1.visible || !p2.visible) return;
      const isSelected = selectedNode === fromId || selectedNode === toId;

      // Draw arc through midpoint on sphere
      const midLat = (n1.lat + n2.lat) / 2 + 5;
      const midLon = (n1.lon + n2.lon) / 2;
      const pm = orthoProject(midLat, midLon, rotation, cx, cy, R);

      ctx.beginPath();
      if (pm.visible) {
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(pm.x, pm.y, p2.x, p2.y);
      } else {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.strokeStyle = isSelected ? "rgba(0,245,255,0.7)" : "rgba(0,245,255,0.2)";
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.setLineDash(isSelected ? [] : [3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Sphere rim highlight
    const rimGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
    rimGrad.addColorStop(0, "rgba(0,245,255,0.06)");
    rimGrad.addColorStop(0.7, "transparent");
    rimGrad.addColorStop(1, "rgba(0,245,255,0.08)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // Sphere border
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,245,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [rotation, selectedNode]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    for (const node of CLOUD_NODES) {
      const pos = orthoProject(node.lat, node.lon, rotation, cx, cy, R);
      if (!pos.visible) continue;
      const dx = mx - pos.x, dy = my - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 14) {
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
        const pos = orthoProject(node.lat, node.lon, rotation, cx, cy, R);
        if (!pos.visible) return null;
        const isSelected = selectedNode === node.id;
        const brightness = 0.6 + pos.depth * 0.4;
        return (
          <motion.button
            key={node.id}
            className="absolute"
            style={{
              left: `${(pos.x / W) * 100}%`,
              top: `${(pos.y / H) * 100}%`,
              transform: "translate(-50%,-50%)",
              zIndex: isSelected ? 20 : 5,
              opacity: brightness,
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : node.id); }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: isSelected ? 14 : 10,
                height: isSelected ? 14 : 10,
                background: node.color,
                boxShadow: `0 0 ${isSelected ? 20 : 10}px ${node.color}`,
              }}
              animate={{
                scale: isSelected ? [1, 1.4, 1] : [1, 1.15, 1],
                opacity: isSelected ? 1 : [0.75, 1, 0.75],
              }}
              transition={{ duration: isSelected ? 1.5 : 2.5, repeat: Infinity }}
            />
            {isSelected && (
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-1 terminal-text text-[8px] whitespace-nowrap px-1.5 py-0.5 rounded"
                style={{ top: "100%", background: "rgba(5,5,8,0.9)", border: `1px solid ${node.color}40`, color: node.color }}
              >
                {node.label}
              </div>
            )}
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
  const frameRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      frameRef.current++;
      if (frameRef.current % 4 === 0) {
        setRotation((r) => (r + 0.12) % 360);
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="rounded-xl overflow-hidden"
              style={{ background: "#020510", border: "1px solid rgba(0,245,255,0.15)" }}
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
            </motion.div>
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
                  <div className="text-white/50 text-[11px] mb-3">{selected.type}</div>
                  <div className="space-y-1">
                    {["ONLINE", "99.99% SLA", "Auto-scaling ON", "Encryption: AES-256"].map((s) => (
                      <div key={s} className="terminal-text text-[9px] text-white/40 flex items-center gap-1.5">
                        <span style={{ color: "#00ff88" }}>●</span>{s}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="terminal-text text-[8px] text-white/20 hover:text-white/50 mt-3 block">
                    ✕ DESELECT
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="p-4 rounded-lg text-center"
                  style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}
                >
                  <div className="terminal-text text-[9px] text-white/20 leading-relaxed">CLICK A NODE ON THE GLOBE TO INSPECT INFRASTRUCTURE</div>
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

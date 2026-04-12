"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

// ─── Brand logos ──────────────────────────────────────────────────────────────

function JungleScoutLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
        <rect x="0"    y="10" width="7" height="12" rx="2" fill="#0B1C3D" />
        <rect x="10.5" y="5"  width="7" height="17" rx="2" fill="#0B1C3D" />
        <rect x="21"   y="0"  width="7" height="22" rx="2" fill="#0B1C3D" />
      </svg>
      <span style={{ fontFamily: "system-ui,sans-serif", fontWeight: 700, fontSize: 17, color: "#0B1C3D", letterSpacing: "-0.3px" }}>
        JungleScout
      </span>
    </div>
  );
}

function Helium10Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="26" height="22" viewBox="0 0 26 22" fill="none">
        <rect x="0"  y="4" width="5" height="18" rx="1.5" fill="#1E3A8A" />
        <rect x="7"  y="0" width="5" height="22" rx="1.5" fill="#3B82F6" />
        <rect x="14" y="6" width="5" height="16" rx="1.5" fill="#2563EB" />
        <rect x="21" y="2" width="5" height="20" rx="1.5" fill="#1D4ED8" />
      </svg>
      <span style={{ fontFamily: "system-ui,sans-serif", fontWeight: 700, fontSize: 17, color: "#0F172A", letterSpacing: "-0.3px" }}>
        Helium <span style={{ color: "#2563EB" }}>10</span>
      </span>
    </div>
  );
}

function AMZScoutLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
        <path d="M2 18L8 10L14 13L22 3" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="3" r="2.5" fill="#FF6B35" />
        <rect x="0" y="20" width="24" height="2" rx="1" fill="#E5E7EB" />
      </svg>
      <span style={{ fontFamily: "system-ui,sans-serif", fontWeight: 700, fontSize: 17, color: "#111827", letterSpacing: "-0.3px" }}>
        AMZ<span style={{ color: "#FF6B35" }}>Scout</span>
      </span>
    </div>
  );
}

// ─── Shard definitions ────────────────────────────────────────────────────────
// 8 clip-path polygons that together tile the full card rectangle

const SHARDS = [
  { clip: "polygon(0% 0%, 52% 0%, 38% 44%, 0% 32%)",          dx: -80, dy: -70, rot: -20 },
  { clip: "polygon(48% 0%, 60% 0%, 64% 36%, 36% 46%)",        dx:   0, dy: -90, rot:  10 },
  { clip: "polygon(57% 0%, 100% 0%, 100% 28%, 62% 38%)",      dx:  80, dy: -65, rot:  24 },
  { clip: "polygon(0% 30%, 40% 44%, 28% 74%, 0% 66%)",        dx: -85, dy:  20, rot: -24 },
  { clip: "polygon(36% 42%, 66% 40%, 60% 74%, 30% 70%)",      dx:   5, dy:  65, rot:  14 },
  { clip: "polygon(60% 36%, 100% 26%, 100% 70%, 62% 72%)",    dx:  85, dy:  22, rot:  22 },
  { clip: "polygon(0% 64%, 30% 72%, 20% 100%, 0% 100%)",      dx: -72, dy:  80, rot: -16 },
  { clip: "polygon(57% 72%, 100% 68%, 100% 100%, 46% 100%)",  dx:  70, dy:  85, rot:  18 },
];

// ─── Tool config ──────────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: "junglescout",
    logo: <JungleScoutLogo />,
    price: "$49",
    bg: "#ffffff",
    border: "#e8ecf4",
    priceColor: "#0B1C3D",
    features: ["Keyword Scout", "Product Database", "Supplier Database", "Sales Analytics", "Review Automation"],
    checkColor: "#0B1C3D",
    crackDelay: 600,
  },
  {
    id: "helium10",
    logo: <Helium10Logo />,
    price: "$99",
    bg: "#ffffff",
    border: "#dbeafe",
    priceColor: "#1D4ED8",
    features: ["Black Box", "Cerebro", "Magnet", "Frankenstein", "Scribbles"],
    checkColor: "#2563EB",
    crackDelay: 1300,
  },
  {
    id: "amzscout",
    logo: <AMZScoutLogo />,
    price: "$49",
    bg: "#ffffff",
    border: "#ffe4d6",
    priceColor: "#FF6B35",
    features: ["Product Tracker", "Keyword Explorer", "Sales Estimator", "Stock Stats", "Chrome Extension"],
    checkColor: "#FF6B35",
    crackDelay: 2000,
  },
];

// LM card entrance starts after last shard is gone: 2000 + 300 + 700 = ~3100ms
const LM_DELAY = 3100;

// ─── Crack SVG overlay ────────────────────────────────────────────────────────

function CrackOverlay() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 300 200" preserveAspectRatio="none">
      <path d="M150,0 L130,70 L80,90 L0,150"    stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M150,0 L165,80 L220,110 L300,80"  stroke="rgba(239,68,68,0.4)" strokeWidth="1"   fill="none" strokeLinecap="round" />
      <path d="M130,70 L90,160 L60,200"          stroke="rgba(239,68,68,0.35)"strokeWidth="1"   fill="none" strokeLinecap="round" />
      <path d="M165,80 L200,170 L240,200"        stroke="rgba(239,68,68,0.35)"strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M80,90 L50,130 L100,200"          stroke="rgba(239,68,68,0.3)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Shatter card ─────────────────────────────────────────────────────────────

function DisintegratingTool({ tool }: { tool: typeof TOOLS[0] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [phase, setPhase] = useState<"idle" | "crack" | "shatter">("idle");

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setPhase("crack"),   tool.crackDelay);
    const t2 = setTimeout(() => setPhase("shatter"), tool.crackDelay + 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView, tool.crackDelay]);

  return (
    <div ref={ref} className="relative" style={{ minHeight: 210 }}>

      {/* ── Main card ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl border p-5 overflow-hidden"
        style={{ background: tool.bg, borderColor: tool.border }}
        animate={
          phase === "crack"
            ? { x: [0, -4, 5, -3, 3, 0], scale: [1, 1.01, 1] }
            : phase === "shatter"
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {}
        }
        transition={phase === "crack" ? { duration: 0.4 } : {}}
      >
        {/* Flash on crack */}
        {phase === "crack" && (
          <motion.div
            className="absolute inset-0 bg-red-100 rounded-2xl z-10 pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Crack lines */}
        {(phase === "crack" || phase === "shatter") && <CrackOverlay />}

        {/* Content */}
        <div className="flex items-start justify-between mb-4">
          {tool.logo}
          <div className="text-right">
            <div className="text-xl font-bold font-mono" style={{ color: tool.priceColor }}>{tool.price}</div>
            <div className="text-[10px] text-gray-400">/month</div>
          </div>
        </div>
        <ul className="space-y-1.5">
          {tool.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs">
              <svg className="w-3 h-3 shrink-0" style={{ color: tool.checkColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-600">{f}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Glass shards ── */}
      {phase === "shatter" &&
        SHARDS.map((shard, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ clipPath: shard.clip, background: tool.bg, border: `1px solid ${tool.border}`, zIndex: 30 }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            animate={{
              x: shard.dx,
              y: shard.dy,
              rotate: shard.rot,
              opacity: 0,
              scale: 0.7,
            }}
            transition={{
              duration: 0.7,
              delay: i * 0.04,
              ease: [0.25, 0, 0.5, 1],
            }}
          />
        ))
      }
    </div>
  );
}

// ─── Rocket ───────────────────────────────────────────────────────────────────

function RocketIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3C20 3 13 10 13 20L20 23.5L27 20C27 10 20 3 20 3Z" fill="#f97316" />
      <circle cx="20" cy="15" r="3.5" fill="white" fillOpacity="0.9" />
      <path d="M13 20L8 27L15 25Z" fill="#fb923c" />
      <path d="M27 20L32 27L25 25Z" fill="#fb923c" />
      <path d="M17 23.5C17 23.5 18 30 20 32C22 30 23 23.5 23 23.5Z" fill="#fbbf24" opacity="0.95" />
      <path d="M18.5 23.5C18.5 23.5 19 28 20 30C21 28 21.5 23.5 21.5 23.5Z" fill="white" opacity="0.65" />
    </svg>
  );
}

// ─── ListingMaker card ────────────────────────────────────────────────────────

function ListingMakerCard({ triggerDelay }: { triggerDelay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const rocketCtrl = useAnimation();
  const cardCtrl   = useAnimation();
  const burstCtrl  = useAnimation();
  const glowCtrl   = useAnimation();

  const [rocketVisible, setRocketVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!isInView) return;

    const run = async () => {
      setRocketVisible(true);

      // Rocket sweeps in from top-right, lands on card center
      rocketCtrl.start({
        opacity: [0, 1, 1, 1, 0],
        x:      [180, 90, 10, -40, -130],
        y:      [-80, -50, -20,  10,   40],
        rotate: [ 40,  28,  12,  -2,  -18],
        scale:  [0.6, 0.8,  1,  1.05, 0.85],
        transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1], times: [0, 0.25, 0.55, 0.78, 1] },
      });

      // Landing burst
      burstCtrl.start({
        scale:   [0.1, 2.4],
        opacity: [1, 0],
        transition: { duration: 0.5, ease: "easeOut" },
      });

      // Secondary inner burst (smaller, faster)
      await new Promise(r => setTimeout(r, 80));

      // Card entrance: scale punch then settle
      cardCtrl.start({
        opacity: [0, 1, 1, 1],
        scale:   [0.88, 1.05, 0.98, 1],
        y:       [12, -4, 2, 0],
        transition: { duration: 0.65, ease: "easeOut", times: [0, 0.45, 0.75, 1] },
      });

      // Glow aura
      await glowCtrl.start({
        opacity:   [0, 1, 0.55],
        scale:     [0.8, 1.1, 1],
        transition: { duration: 0.9, ease: "easeOut" },
      });
    };

    const timer = setTimeout(run, triggerDelay);
    return () => clearTimeout(timer);
  }, [isInView, triggerDelay, rocketCtrl, cardCtrl, burstCtrl, glowCtrl]);

  return (
    <div ref={ref} className="relative flex justify-center items-center" style={{ minHeight: 130 }}>

      {/* Rocket */}
      {rocketVisible && (
        <motion.div
          animate={rocketCtrl}
          initial={{ opacity: 0, x: 180, y: -80, rotate: 40, scale: 0.6 }}
          className="absolute z-30 pointer-events-none drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]"
          style={{ top: "50%", left: "50%", marginLeft: -20, marginTop: -20 }}
        >
          <RocketIcon size={40} />
          {/* Flame trail */}
          <div className="absolute pointer-events-none" style={{
            top: "68%", left: "50%", transform: "translateX(-50%)",
            width: 8, height: 50,
            background: "linear-gradient(to bottom, rgba(251,146,60,0.8), transparent)",
            borderRadius: 4, filter: "blur(4px)",
          }} />
        </motion.div>
      )}

      {/* Landing burst ring */}
      <motion.div
        animate={burstCtrl}
        initial={{ scale: 0.1, opacity: 0 }}
        className="absolute z-20 pointer-events-none rounded-full border-2 border-orange-400/70"
        style={{ width: 90, height: 90, top: "50%", left: "50%", marginLeft: -45, marginTop: -45 }}
      />
      {/* Inner burst */}
      <motion.div
        animate={burstCtrl}
        initial={{ scale: 0.1, opacity: 0 }}
        className="absolute z-20 pointer-events-none rounded-full bg-orange-400/15"
        style={{ width: 60, height: 60, top: "50%", left: "50%", marginLeft: -30, marginTop: -30 }}
      />

      {/* The card */}
      <motion.div
        animate={cardCtrl}
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        className="relative w-full max-w-sm bg-[#0a0a10] rounded-2xl border border-orange-500/30 p-8 text-center overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.12)]"
      >
        {/* Top glow line */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        {/* Radial glow */}
        <motion.div
          animate={glowCtrl}
          initial={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(249,115,22,0.13) 0%, transparent 70%)" }}
        />

        <div className="relative z-10">
          <div className="font-display text-2xl font-bold text-white mb-1.5">
            Listing<span className="text-orange-400">Maker</span>
          </div>
          <div className="text-orange-400 font-mono text-2xl font-bold mb-2">{t.painPoints.replacementPrice}</div>
          <div className="text-gray-400 text-sm">{t.painPoints.replacement}</div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function PainPoints() {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });
  const { t }      = useI18n();

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Stop paying for tools you{" "}
            <span className="font-accent gradient-text">don&apos;t need.</span>
          </h2>
          <p className="text-gray-400 text-lg">{t.painPoints.subtitle}</p>
        </motion.div>

        {/* Grid + LM card in the same space */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-5">
            {TOOLS.map((tool) => (
              <DisintegratingTool key={tool.id} tool={tool} />
            ))}
          </div>

          {/* LM card sits in front, centered over the grid, from delay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full flex justify-center pointer-events-auto">
              <ListingMakerCard triggerDelay={LM_DELAY} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

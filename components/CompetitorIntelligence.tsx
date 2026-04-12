"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

// ── Counter animation ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, start }: { target: number; start: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let current = 0;
    const step = Math.ceil(target / 20);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(current);
      if (current >= target) clearInterval(iv);
    }, 50);
    return () => clearInterval(iv);
  }, [start, target]);

  return <span>{value}</span>;
}

// ── Typewriter line for terminal ───────────────────────────────────────────────
function TypewriterLine({ label, text, delay, active }: { label: string; text: string; delay: number; active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setStarted(false);
  }, [text]);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay, text]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [started, text]);

  return (
    <div className="flex gap-3 items-start font-mono text-xs">
      <span className="text-orange-500 shrink-0 w-16 text-right opacity-60">{label}</span>
      <span className="text-gray-300">
        {displayed}
        {started && displayed.length < text.length && (
          <span className="text-orange-400 animate-pulse">|</span>
        )}
      </span>
    </div>
  );
}

// ── SEO Coverage bar ───────────────────────────────────────────────────────────
function CoverageBar({ label, pct, color, animate }: { label: string; pct: number; color: string; animate: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className={`font-mono font-bold ${color}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color === "text-green-400" ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-white/20"}`}
          initial={{ width: 0 }}
          animate={animate ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function CompetitorIntelligence() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();
  const [terminalActive, setTerminalActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Start terminal after analysis phase completes (~3.8s)
  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setTerminalActive(true), 3800);
    // Success message after all lines finish (~3.8 + 5 lines × 1.1s = ~9.3s)
    const t2 = setTimeout(() => setShowSuccess(true), 10000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView]);

  const listingLines = [
    { label: t.demo.labelTitle,    text: t.demo.terminalTitle },
    { label: t.demo.labelBullet1,  text: t.demo.terminalBullet1 },
    { label: t.demo.labelBullet2,  text: t.demo.terminalBullet2 },
    { label: t.demo.labelBullet3,  text: t.demo.terminalBullet3 },
    { label: t.demo.labelKeywords, text: t.demo.terminalKeywords },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-500/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {t.competitorIntel.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight mt-4">
            {t.competitorIntel.title}{" "}
            <span className="font-accent gradient-text">{t.competitorIntel.titleAccent}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.competitorIntel.subtitle}
          </p>
        </motion.div>

        {/* Two-panel grid */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* ── Left: Analysis panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6 space-y-6"
          >
            {/* Counter */}
            <div className="flex items-center gap-4 pb-5 border-b border-white/5">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold font-display text-white">
                  <AnimatedCounter target={10} start={isInView} />
                </div>
                <div className="text-sm text-gray-500">{t.competitorIntel.competitorsLabel}</div>
              </div>
            </div>

            {/* Top keywords */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t.competitorIntel.topKeywordsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {t.competitorIntel.keywords.map((kw, i) => (
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.18 }}
                    className="text-xs font-mono px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300"
                  >
                    {kw}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Keyword gaps */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t.competitorIntel.gapsLabel}</p>
              <div className="space-y-2">
                {t.competitorIntel.gaps.map((gap, i) => (
                  <motion.div
                    key={gap}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 1.4 + i * 0.2 }}
                    className="flex items-center gap-2 text-xs text-gray-300"
                  >
                    <span className="w-4 h-4 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                    <span className="font-mono">{gap}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SEO Coverage bars */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">{t.competitorIntel.coverageLabel}</p>
              <div className="space-y-3">
                <CoverageBar
                  label={t.competitorIntel.coverageCompetitors}
                  pct={63}
                  color="text-gray-400"
                  animate={isInView}
                />
                <CoverageBar
                  label={t.competitorIntel.coverageYours}
                  pct={94}
                  color="text-green-400"
                  animate={isInView}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Right: Terminal ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-[#0a0a10] rounded-2xl border border-white/5 overflow-hidden shadow-2xl shadow-orange-500/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0d0d14]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-gray-500 text-xs ml-2 font-mono">{t.demo.terminalCommand}</span>
              </div>

              {/* Scanning line — shows during analysis phase */}
              <div className="px-5 pt-4 pb-2 border-b border-white/5">
                <div className="space-y-1.5">
                  {[
                    { label: "scan", text: `${t.competitorIntel.competitorsLabel}...`, delay: 200 },
                    { label: "extract", text: `${t.competitorIntel.keywords.slice(0,3).join(", ")}...`, delay: 900 },
                    { label: "gaps", text: `${t.competitorIntel.gaps.slice(0,2).join(", ")}...`, delay: 1700 },
                    { label: "coverage", text: "63% → 94% ↑", delay: 2500 },
                  ].map((line) => (
                    <TypewriterLine
                      key={line.label}
                      label={line.label}
                      text={line.text}
                      delay={line.delay}
                      active={isInView}
                    />
                  ))}
                </div>
              </div>

              {/* Output lines — start after analysis */}
              <div className="p-5 space-y-3">
                {listingLines.map((line, i) => (
                  <TypewriterLine
                    key={line.label}
                    label={line.label}
                    text={line.text}
                    delay={i * 1100}
                    active={terminalActive}
                  />
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={showSuccess ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5 }}
                  className="mt-4 pt-3 border-t border-white/5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-green-400">✓ {t.demo.terminalSuccess}</span>
                    <span className="text-gray-500">47s</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Flow arrow label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 2 }}
              className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-600"
            >
              <span className="font-mono text-orange-500/50">DATA</span>
              <span>→</span>
              <span className="font-mono text-blue-500/50">ANALYSIS</span>
              <span>→</span>
              <span className="font-mono text-green-500/50">OUTPUT</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

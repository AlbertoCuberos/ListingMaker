"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

function TypewriterLine({ label, text, delay }: { label: string; text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted]     = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Reset when text (language) changes
  useEffect(() => {
    setDisplayed("");
    setStarted(false);
  }, [text]);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [isInView, delay, text]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [started, text]);

  return (
    <div ref={ref} className="flex gap-3 items-start font-mono text-xs sm:text-sm">
      <span className="text-orange-500 shrink-0 w-16 sm:w-20 text-right opacity-60">{label}</span>
      <span className="text-gray-300">
        {displayed}
        {started && displayed.length < text.length && (
          <span className="text-orange-400 animate-pulse">|</span>
        )}
      </span>
    </div>
  );
}

export default function DemoPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const listingLines = [
    { label: t.demo.labelTitle,    text: t.demo.terminalTitle },
    { label: t.demo.labelBullet1,  text: t.demo.terminalBullet1 },
    { label: t.demo.labelBullet2,  text: t.demo.terminalBullet2 },
    { label: t.demo.labelBullet3,  text: t.demo.terminalBullet3 },
    { label: t.demo.labelKeywords, text: t.demo.terminalKeywords },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {t.demo.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight mt-4">
            {t.demo.title}{" "}
            <span className="font-accent gradient-text">{t.demo.titleAccent}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t.demo.subtitle}
          </p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
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
            <div className="p-5 space-y-3">
              {listingLines.map((line, i) => (
                <TypewriterLine key={line.label} label={line.label} text={line.text} delay={400 + i * 1100} />
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 6.2 }}
                className="mt-4 pt-3 border-t border-white/5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-green-400">✓ {t.demo.terminalSuccess}</span>
                  <span className="text-gray-500">47s</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

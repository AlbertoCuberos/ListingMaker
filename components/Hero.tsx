"use client";

import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const colorMap: Record<string, string> = {
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  blue:   "bg-blue-500/10   border-blue-500/20   text-blue-400",
  green:  "bg-green-500/10  border-green-500/20  text-green-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

function AnimatedText({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted]     = useState(false);

  // Reset and restart animation whenever the text (language) changes
  useEffect(() => {
    setDisplayed("");
    setStarted(false);
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, 7);
    return () => clearInterval(iv);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="text-orange-400 animate-pulse">|</span>
      )}
    </span>
  );
}

export default function Hero() {
  const { t, locale } = useI18n();
  const { setAuthModalOpen, setAuthView } = useAuth();

  const handleOpenAuth = () => {
    setAuthView("signup");
    setAuthModalOpen(true);
  };

  const fullListing = {
    title: t.heroDemo.listingTitle,
    bullets: [t.heroDemo.bullet1, t.heroDemo.bullet2, t.heroDemo.bullet3],
  };

  const floatingBadges = [
    { label: "SEO Score",                   value: "96 / 100",                   color: "orange", delay: 2.2, pos: "top-4  -right-4 lg:-right-28" },
    { label: "Rufus AI",                    value: "96 / 100",                   color: "blue",   delay: 3.0, pos: "top-32 -right-4 lg:-right-28" },
    { label: t.heroDemo.badgeKeywordsLabel, value: t.heroDemo.badgeKeywordsValue, color: "green",  delay: 3.8, pos: "top-60 -right-4 lg:-right-28" },
    { label: t.heroDemo.badgeGapsLabel,     value: t.heroDemo.badgeGapsValue,    color: "purple", delay: 4.5, pos: "top-88 -right-4 lg:-right-28" },
  ];

  const amazonTLD = locale === "en" ? "com" : locale;

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center pt-16 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-6"
            >
              <span className="section-label">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="font-display font-bold leading-[1.04] tracking-[-0.03em] mb-5"
            >
              <span className="text-white block text-4xl sm:text-5xl lg:text-[3.5rem]">
                {t.hero.title1}
              </span>
              <span className="font-accent gradient-text glow-text text-5xl sm:text-6xl lg:text-[4rem]">
                {t.hero.title2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-4"
            >
              <motion.button
                onClick={handleOpenAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all duration-300 shadow-[0_0_25px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] font-display cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                {t.hero.cta}
              </motion.button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto text-gray-400 hover:text-white font-medium px-7 py-3.5 text-base transition border border-white/10 rounded-xl hover:border-white/20 text-center"
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm text-gray-600"
            >
              {t.hero.noCreditCard}
            </motion.p>
          </motion.div>

          {/* ── Right: Amazon demo ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative"
          >
            {/* Floating metric badges — desktop only */}
            {floatingBadges.map((badge) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, delay: badge.delay }}
                className={`hidden lg:block absolute z-10 ${badge.pos}`}
              >
                <div
                  className={`rounded-xl border px-4 py-2.5 text-left backdrop-blur-sm ${colorMap[badge.color]}`}
                  style={{ minWidth: "160px" }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mb-0.5">{badge.label}</div>
                  <div className="text-sm font-bold">{badge.value}</div>
                </div>
              </motion.div>
            ))}

            {/* Browser mock */}
            <div className="rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.08)] border border-white/5">

              {/* Chrome bar */}
              <div className="bg-[#0f0f18] px-4 py-2.5 flex items-center gap-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#050508] rounded-md px-3 py-1.5 flex items-center gap-2">
                  <svg className="w-3 h-3 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-gray-500 text-xs font-mono">amazon.{amazonTLD}/dp/B0MIWLAB9X</span>
                </div>
              </div>

              {/* Amazon page */}
              <div className="bg-white">
                <div className="bg-[#131921] px-4 py-2 flex items-center gap-3">
                  <span className="text-[#ff9900] font-bold text-sm tracking-tight">amazon</span>
                  <div className="flex-1 bg-white rounded h-6 px-3 flex items-center">
                    <span className="text-gray-400 text-xs">{t.heroDemo.searchQuery}</span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="flex items-center gap-1 text-[10px] text-[#007185] mb-2.5">
                    <span>{t.heroDemo.breadcrumb1}</span><span className="text-gray-400">›</span>
                    <span>{t.heroDemo.breadcrumb2}</span><span className="text-gray-400">›</span>
                    <span>{t.heroDemo.breadcrumb3}</span>
                  </div>

                  <h3 className="text-sm font-medium text-[#0f1111] leading-snug mb-2.5">
                    <AnimatedText text={fullListing.title} delay={500} />
                  </h3>

                  <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                    <span className="text-[#007185] text-xs">{t.heroDemo.storeLink}</span>
                    <div className="flex items-center gap-1">
                      <div className="flex text-[#f90] text-xs">★★★★<span className="opacity-40">★</span></div>
                      <span className="text-[#007185] text-xs">4.6 (2,847)</span>
                    </div>
                    {/* Amazon's Choice badge — faithful recreation */}
                    <div className="flex items-center overflow-hidden rounded-sm shadow-sm" style={{ fontSize: 0 }}>
                      <div className="px-2 py-0.5" style={{ background: "#232F3E" }}>
                        <span className="text-white font-bold" style={{ fontSize: 10, letterSpacing: "0.01em" }}>Amazon&apos;s </span>
                        <span className="font-bold" style={{ fontSize: 10, color: "#F5A623", letterSpacing: "0.01em" }}>Choice</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex items-baseline gap-1">
                    <span className="text-xs text-[#565959]">{t.heroDemo.priceLabel} </span>
                    <span className="text-xs text-[#0f1111] self-start mt-1">{t.heroDemo.priceSymbol}</span>
                    <span className="text-lg font-medium text-[#0f1111]">{t.heroDemo.priceWhole}</span>
                    <span className="text-xs text-[#0f1111] self-start mt-1">{t.heroDemo.priceFraction}</span>
                    <span className="text-xs text-[#565959] ml-1">{t.heroDemo.unitPrice}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-[10px] font-bold text-[#0f1111] mb-2 uppercase tracking-wide">{t.heroDemo.aboutThisItem}</p>
                    <ul className="space-y-2">
                      {fullListing.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-2 text-[11px] text-[#0f1111] leading-relaxed">
                          <span className="text-[#555] mt-0.5 shrink-0">•</span>
                          <span><AnimatedText text={bullet} delay={1600 + i * 2400} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer bar */}
              <div className="bg-[#0a0a10] border-t border-orange-500/10 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-gray-400">{t.heroDemo.generatedBy} <span className="text-orange-400">ListingMaker</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-orange-500/50">COSMO</span>
                  <span className="text-[10px] text-gray-700">·</span>
                  <span className="text-[10px] font-mono text-blue-500/50">Semantic</span>
                  <span className="text-[10px] text-gray-700">·</span>
                  <span className="text-[10px] font-mono text-purple-500/50">Rufus AI</span>
                </div>
              </div>
            </div>

            {/* Mobile badges row */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mt-4">
              {floatingBadges.map((badge) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: badge.delay }}
                  className={`rounded-xl border px-3 py-2.5 text-center ${colorMap[badge.color]}`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mb-0.5">{badge.label}</div>
                  <div className="text-sm font-bold">{badge.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

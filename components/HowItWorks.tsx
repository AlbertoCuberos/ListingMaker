"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

const stepIcons = [
  // Camera / upload
  <svg key="1" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  // Clipboard / paste
  <svg key="2" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>,
  // Lightning / generate
  <svg key="3" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
];

// Node delays match card stagger (0.15s × i) + enough time to look intentional
const NODE_DELAYS = [0.3, 0.9, 1.5];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useI18n();

  const steps = [
    { number: "01", title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc, icon: stepIcons[0] },
    { number: "02", title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc, icon: stepIcons[1] },
    { number: "03", title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc, icon: stepIcons[2] },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            {t.howItWorks.title}{" "}
            <span className="font-accent gradient-text">{t.howItWorks.titleAccent}</span>
          </h2>
          <p className="text-gray-400 text-lg">{t.howItWorks.subtitle}</p>
        </motion.div>

        {/* ── Progress rail — desktop only ── */}
        {/* Sits in a zero-height row so cards start immediately below */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 mb-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex justify-center">
              {/* Track segment: right half of col 1, full col 2, left half of col 3 */}
              {i === 0 && (
                <div className="absolute top-[6px] left-1/2 right-0 h-px bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500/70 to-orange-400/50 rounded-full"
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.5, delay: 0.7, ease: "easeInOut" }}
                  />
                </div>
              )}
              {i === 1 && (
                <div className="absolute top-[6px] left-0 right-0 h-px bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400/50 to-orange-400/50 rounded-full"
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.5, delay: 1.1, ease: "easeInOut" }}
                  />
                </div>
              )}
              {i === 2 && (
                <div className="absolute top-[6px] left-0 right-1/2 h-px bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400/50 to-orange-500/70 rounded-full"
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.5, delay: 1.5, ease: "easeInOut" }}
                  />
                </div>
              )}

              {/* Node */}
              <motion.div
                className="relative flex flex-col items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.35, delay: NODE_DELAYS[i], type: "spring", stiffness: 300 }}
              >
                {/* Pulse ring */}
                <motion.div
                  className="absolute w-6 h-6 rounded-full bg-orange-500/20"
                  animate={isInView ? { scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] } : {}}
                  transition={{ duration: 2, delay: NODE_DELAYS[i] + 0.3, repeat: Infinity, repeatDelay: 3 }}
                />
                {/* Dot */}
                <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-[#06060c] shadow-[0_0_12px_rgba(249,115,22,0.9)] z-10" />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="relative group"
            >
              <div className="relative bg-[#0a0a10] rounded-2xl border border-white/5 p-7 h-full
                group-hover:border-orange-500/25 transition-all duration-300
                group-hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]">

                {/* Top accent line on hover */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                {/* Step number */}
                <div className="font-display font-bold text-[3.5rem] leading-none tracking-tighter mb-5
                  bg-gradient-to-br from-orange-500/25 to-orange-500/5 bg-clip-text text-transparent select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/15 to-orange-500/5
                  border border-orange-500/15 text-orange-400 flex items-center justify-center mb-6
                  group-hover:from-orange-500/20 group-hover:border-orange-500/25 transition-all duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

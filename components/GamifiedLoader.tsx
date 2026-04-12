"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function GamifiedLoader({ visible }: { visible: boolean }) {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % t.create.loadingMessages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [visible, t]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/90 backdrop-blur-xl px-4"
        >
          <div className="max-w-md w-full bg-[#0a0a10] border border-orange-500/20 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(249,115,22,0.1)] relative overflow-hidden">
            {/* Background scanner effect */}
            <motion.div 
              animate={{ 
                top: ["0%", "100%", "0%"],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent z-0"
            />

            <div className="relative z-10">
              <div className="relative w-20 h-20 mx-auto mb-8">
                {/* Advanced Spinner */}
                <svg className="absolute inset-0 w-full h-full text-orange-500/10 animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
                <svg className="absolute inset-0 w-full h-full text-orange-500 animate-spin" viewBox="0 0 100 100" style={{ animationDuration: "1.5s" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60 200" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.img 
                    src="/logo.png" 
                    alt="Logo" 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-4 tracking-tight">
                {t.create.loadingMessages[currentStep]}
              </h2>

              <div className="space-y-3 mb-8">
                {t.create.loaderSteps.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${idx === currentStep ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" : idx < currentStep ? "bg-orange-500/40" : "bg-white/5"}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${idx === currentStep ? "text-orange-400" : "text-gray-600"}`}>
                      {msg}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                ListingMaker Engine v1.5 — High Performance AI
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

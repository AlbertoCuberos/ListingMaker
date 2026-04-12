"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Pricing() {
  const { user, setAuthModalOpen, setAuthView } = useAuth();
  const { t, locale } = useI18n();

  const handleOpenAuth = () => {
    setAuthView("signup");
    setAuthModalOpen(true);
  };
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const symbol = ["es", "de"].includes(locale) ? "€" : locale === "en" ? "$" : "$"; 
  
  const plans = [
    {
      key: "starter",
      name: t.pricing.starter,
      price: `${symbol}29`,
      subtitle: t.pricing.oneTime,
      listings: `5 ${t.pricing.listings}`,
      perListing: `${symbol}5.80`,
      savingsPct: null as number | null,
      cheapest: false,
      highlighted: false,
      features: [
        t.pricing.features.fullListing,
        t.pricing.features.competitorAnalysis,
        t.pricing.features.allMarketplaces,
        t.pricing.features.exportFormats,
        t.pricing.features.a9Rufus,
      ],
      cta: `${t.pricing.starter} — ${symbol}29`,
    },
    {
      key: "business",
      name: t.pricing.business,
      price: `${symbol}79`,
      subtitle: t.pricing.oneTime,
      listings: `25 ${t.pricing.listings}`,
      perListing: `${symbol}3.16`,
      savingsPct: 46,
      cheapest: false,
      highlighted: true,
      features: [
        t.pricing.features.everythingStarter,
        t.pricing.features.prioritySpeed,
        t.pricing.features.optimizationSuggestions,
        t.pricing.features.keywordGap,
        t.pricing.features.aplusBrief,
      ],
      cta: `${t.pricing.business} — ${symbol}79`,
    },
    {
      key: "agency",
      name: t.pricing.pack100,
      price: `${symbol}199`,
      subtitle: t.pricing.oneTime,
      listings: `100 ${t.pricing.listings}`,
      perListing: `${symbol}1.99`,
      savingsPct: 66,
      cheapest: true,
      highlighted: false,
      features: [
        t.pricing.features.everythingPro,
        t.pricing.features.backendOptimization,
        t.pricing.features.bulkExport,
        t.pricing.features.aplusBrief,
      ],
      cta: `${t.pricing.pack100} — ${symbol}199`,
    },
  ];

  const handleBuyPlan = async (planKey: string) => {
    if (!user) return;
    setBuyingPlan(planKey);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, userId: user.uid }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        setBuyingPlan(null);
        return;
      }
      window.location.href = url;
    } catch {
      alert("Something went wrong. Please try again.");
      setBuyingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 border-glow ${
                plan.highlighted
                  ? "bg-[#0a0a10] border border-orange-500/40 shadow-[0_0_50px_rgba(249,115,22,0.12)] hover:shadow-[0_0_70px_rgba(249,115,22,0.18)]"
                  : "bg-[#0a0a10] border border-white/5 hover:border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              )}

              {/* Badge row */}
              <div className="flex items-center gap-2 mb-3 min-h-[28px]">
                {plan.highlighted && (
                  <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    {t.pricing.mostPopular}
                  </span>
                )}
                {plan.savingsPct && (
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    {t.pricing.savingsLabel} {plan.savingsPct}%
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-xl text-white tracking-tight">{plan.name}</h3>

              <div className="mt-3 mb-0.5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{plan.subtitle}</p>

              {/* Per-listing price block */}
              <div className={`rounded-xl px-3.5 py-2.5 mb-4 flex items-center justify-between ${
                plan.cheapest
                  ? "bg-gradient-to-r from-green-500/15 to-emerald-500/10 border border-green-500/30"
                  : plan.highlighted
                  ? "bg-orange-500/5 border border-orange-500/15"
                  : "bg-white/3 border border-white/8"
              }`}>
                <div>
                  <div className={`text-xl font-bold font-mono ${
                    plan.cheapest ? "text-green-400" : plan.highlighted ? "text-orange-300" : "text-gray-300"
                  }`}>
                    {plan.perListing}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">{t.pricing.perListingLabel}</div>
                </div>
                {plan.cheapest && (
                  <div className="flex flex-col items-end gap-0.5">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-[10px] text-green-400 font-semibold text-right leading-tight max-w-[56px]">
                      {t.pricing.cheapestPerListing}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm font-medium text-orange-400 mb-5">{plan.listings}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <svg className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-orange-400" : "text-orange-500/60"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {user ? (
                <button
                  onClick={() => handleBuyPlan(plan.key)}
                  disabled={buyingPlan !== null}
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition ${
                    plan.highlighted
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] hover:shadow-[0_0_36px_rgba(249,115,22,0.45)]"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {buyingPlan === plan.key ? "Redirecting..." : plan.cta}
                </button>
              ) : (
                <button
                  onClick={handleOpenAuth}
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                    plan.highlighted
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] hover:shadow-[0_0_36px_rgba(249,115,22,0.45)]"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Free listing note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleOpenAuth}
            className="text-sm text-gray-600 hover:text-gray-400 transition underline underline-offset-4 cursor-pointer"
          >
            {t.pricing.tryFreeNote} →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

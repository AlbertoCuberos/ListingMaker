"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ type }: { type: "bestseller" | "choice" | "bsr" | "time" | "agency" }) {
  const config = {
    bestseller: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", icon: "🏆" },
    choice: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", icon: "✓" },
    bsr: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400", icon: "📈" },
    time: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", icon: "⚡" },
    agency: { bg: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-400", icon: "🏢" },
  };
  const { t } = useI18n();
  const labels: Record<string, string> = {
    bestseller: t.testimonials.badgeBestseller,
    choice: t.testimonials.badgeChoice,
    bsr: t.testimonials.badgeBsr,
    time: t.testimonials.badgeTime,
    agency: t.testimonials.badgeAgency,
  };
  const c = config[type];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${c.bg} ${c.text}`}>
      <span>{c.icon}</span> {labels[type]}
    </span>
  );
}

function TestimonialCard({ testimonial, index, isInView }: {
  testimonial: { name: string; role: string; market: string; badge: "bestseller" | "choice" | "bsr" | "time" | "agency"; quote: string; metric: string };
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6 hover:border-orange-500/20 transition-all duration-300 flex flex-col"
    >
      <Badge type={testimonial.badge} />
      <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-5 flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="bg-orange-500/5 rounded-lg px-4 py-2.5 mb-5 border border-orange-500/10">
        <span className="text-orange-400 font-mono text-sm font-semibold">{testimonial.metric}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-medium text-sm">{testimonial.name}</div>
          <div className="text-gray-500 text-xs">{testimonial.role}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">{testimonial.market}</span>
          <StarRating />
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useI18n();

    const testimonials = [
    { name: "Laura M.", role: t.testimonials.role1, market: "Amazon.es", badge: "bestseller" as const, quote: t.testimonials.quote1, metric: t.testimonials.metric1 },
    { name: "Thomas K.", role: t.testimonials.role2, market: "Amazon.de", badge: "bsr" as const, quote: t.testimonials.quote2, metric: t.testimonials.metric2 },
    { name: "Sarah J.", role: t.testimonials.role3, market: "Amazon.com", badge: "time" as const, quote: t.testimonials.quote3, metric: t.testimonials.metric3 },
    { name: "Marco R.", role: t.testimonials.role4, market: "Amazon.it", badge: "choice" as const, quote: t.testimonials.quote4, metric: t.testimonials.metric4 },
    { name: "David & Co.", role: t.testimonials.role5, market: "Amazon.co.uk", badge: "agency" as const, quote: t.testimonials.quote5, metric: t.testimonials.metric5 },
    { name: "Pierre L.", role: t.testimonials.role6, market: "Amazon.fr", badge: "bestseller" as const, quote: t.testimonials.quote6, metric: t.testimonials.metric6 },
    { name: "Jessica T.", role: t.testimonials.role7, market: "Amazon.com", badge: "bsr" as const, quote: t.testimonials.quote7, metric: t.testimonials.metric7 },
    { name: "Andrés V.", role: t.testimonials.role8, market: "Amazon.es", badge: "bestseller" as const, quote: t.testimonials.quote8, metric: t.testimonials.metric8 },
    { name: "Lukas B.", role: t.testimonials.role9, market: "Amazon.de", badge: "agency" as const, quote: t.testimonials.quote9, metric: t.testimonials.metric9 },
    { name: "Carla M.", role: t.testimonials.role10, market: "Amazon.fr", badge: "choice" as const, quote: t.testimonials.quote10, metric: t.testimonials.metric10 },
    { name: "Roberto F.", role: t.testimonials.role11, market: "Amazon.it", badge: "time" as const, quote: t.testimonials.quote11, metric: t.testimonials.metric11 },
    { name: "Simon H.", role: t.testimonials.role12, market: "Amazon.co.uk", badge: "bsr" as const, quote: t.testimonials.quote12, metric: t.testimonials.metric12 },
  ];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-gray-400 text-lg">{t.testimonials.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} index={i} isInView={isInView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "2,400+", label: t.testimonials.statListings },
            { value: "98%", label: t.testimonials.statSatisfaction },
            { value: "47s", label: t.testimonials.statAvgTime },
            { value: "6", label: t.testimonials.statMarkets },
          ].map((stat, i) => (
            <div key={i} className="px-6">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

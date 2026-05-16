"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

export default function AffiliatePage() {
  const { t } = useI18n();
  const a = t.affiliate;

  const [form, setForm] = useState({
    name: "",
    email: "",
    channel: "",
    audience: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", channel: "", audience: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-medium bg-orange-500/10 border border-orange-500/20 text-orange-400">
            {a.badge}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            {a.title1}
            <br />
            <span className="text-orange-400">{a.title2}</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {a.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors text-lg"
            >
              {a.cta}
            </a>
            <a
              href="#how"
              className="px-8 py-4 border border-white/10 hover:border-white/30 text-gray-300 font-semibold rounded-xl transition-colors text-lg"
            >
              {a.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* Earnings example */}
      <section className="py-16 px-4 bg-white/2 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">{a.earningsTitle}</h2>
          <p className="text-center text-gray-400 mb-8">{a.earningsSubtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { plan: "Starter", price: "€29", commission: "€5.80" },
              { plan: "Professional", price: "€79", commission: "€15.80" },
              { plan: "Agency", price: "€199", commission: "€39.80" },
              { plan: "10 × Pro", price: "€790", commission: "€158" },
            ].map((row) => (
              <div key={row.plan} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-sm text-gray-500 mb-1">{row.plan}</div>
                <div className="text-lg font-semibold text-white mb-1">{row.price}</div>
                <div className="text-2xl font-bold text-orange-400">{row.commission}</div>
                <div className="text-xs text-gray-500 mt-1">/ venta</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">{a.howTitle}</h2>
          <p className="text-gray-400 text-center mb-14">{a.howSubtitle}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: a.step1Title, desc: a.step1Desc },
              { num: "02", title: a.step2Title, desc: a.step2Desc },
              { num: "03", title: a.step3Title, desc: a.step3Desc },
            ].map((s) => (
              <div key={s.num} className="relative">
                <div className="text-6xl font-bold text-green-400/80 mb-4">{s.num}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it converts */}
      <section className="py-16 px-4 bg-white/2 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">{a.whyTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[a.why1, a.why2, a.why3, a.why4].map((w, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                <span className="text-gray-300">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{a.faqTitle}</h2>
          <div className="space-y-4">
            {[
              { q: a.faq1Q, ans: a.faq1A },
              { q: a.faq2Q, ans: a.faq2A },
              { q: a.faq3Q, ans: a.faq3A },
              { q: a.faq4Q, ans: a.faq4A },
              { q: a.faq5Q, ans: a.faq5A },
            ].map((item, i) => (
              <details key={i} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium list-none">
                  {item.q}
                  <span className="ml-4 text-orange-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-5 pb-5 text-gray-400 leading-relaxed">{item.ans}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20 px-4 bg-white/2 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">{a.formTitle}</h2>
          <p className="text-gray-400 text-center mb-10">{a.formSubtitle}</p>

          {status === "success" ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-6 text-center text-lg font-medium">
              {a.formSuccess}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{a.formName}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{a.formEmail}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{a.formChannel}</label>
                <input
                  type="text"
                  required
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{a.formAudience}</label>
                <input
                  type="text"
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{a.formMessage}</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm">{a.formError}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-lg"
              >
                {status === "sending" ? "..." : a.formSubmit}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

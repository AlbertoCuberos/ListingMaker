"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBrowserFirestore } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { doc, getDoc, collection } from "firebase/firestore";
import { motion } from "framer-motion";
import { downloadMarkdown, downloadPDF } from "@/lib/export-utils";
import type { ListingResult, SEOAnalysis, APlusContent, APlusModule } from "@/lib/types";

function charCount(text: string) {
  return text.length;
}

function byteCount(text: string) {
  return new TextEncoder().encode(text).length;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-orange-400 transition" title={`Copy ${label}`}>
      {copied ? (
        <><svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-green-400">Copied</span></>
      ) : (
        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
      )}
    </button>
  );
}

function CountBadge({ current, max, unit }: { current: number; max: number; unit: string }) {
  const isOver = current > max;
  const isClose = current > max * 0.9;
  const color = isOver ? "text-red-400 bg-red-500/10 border-red-500/20" : isClose ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-gray-400 bg-white/5 border-white/10";
  return <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${color}`}>{current}/{max} {unit}</span>;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-2">{label}</span>
    </div>
  );
}

function FrequencyBar({ frequency, total }: { frequency: number; total: number }) {
  const pct = (frequency / total) * 100;
  const color = pct >= 70 ? "bg-green-500" : pct >= 30 ? "bg-amber-500" : "bg-gray-500";
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 font-mono w-8">{frequency}/{total}</span>
    </div>
  );
}

function ClassBadge({ classification }: { classification: string }) {
  const colors: Record<string, string> = {
    core: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    benefit: "bg-green-500/10 text-green-400 border-green-500/20",
    ingredient: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    problem: "bg-red-500/10 text-red-400 border-red-500/20",
    use_case: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    long_tail: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${colors[classification] || "bg-white/5 text-gray-400 border-white/10"}`}>
      {classification.replace("_", " ")}
    </span>
  );
}

function CompetitionBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "text-red-400 bg-red-500/10",
    medium: "text-amber-400 bg-amber-500/10",
    low: "text-green-400 bg-green-500/10",
  };
  return <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${colors[level] || ""}`}>{level}</span>;
}

// Tab system for the result page
type Tab = "listing" | "diagnostic" | "aplus";

function ResultPageInner() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const [result, setResult] = useState<ListingResult | null>(null);
  const [copyAllDone, setCopyAllDone] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("listing");

  const searchParams = useSearchParams();
  const db = getBrowserFirestore();

  useEffect(() => {
    const listingId = searchParams.get("id");
    if (listingId && user) {
      const listingRef = doc(collection(db, "users", user.uid, "listings"), listingId);
      getDoc(listingRef).then((docSnap) => {
        if (docSnap.exists()) {
          setResult(docSnap.data() as ListingResult);
        } else {
          router.push("/dashboard");
        }
      });
      return;
    }
    const stored = sessionStorage.getItem("listing-result");
    if (!stored) { router.push("/create"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.error) { alert(parsed.error); router.push("/create"); return; }
      setResult(parsed);
    } catch { router.push("/create"); }
  }, [router, searchParams, user, db]);

  const handleCopyAll = async () => {
    if (!result) return;
    const full = [
      `TITLE:\n${result.title}`,
      `\nBULLET POINTS:`,
      ...result.bullets.map((b, i) => `${i + 1}. ${b}`),
      `\nDESCRIPTION:\n${result.description}`,
      `\nBACKEND KEYWORDS:\n${result.backendKeywords}`,
    ].join("\n");
    await navigator.clipboard.writeText(full);
    setCopyAllDone(true);
    setTimeout(() => setCopyAllDone(false), 2500);
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-400">Generating your listing...</span>
        </div>
      </div>
    );
  }

  const analysis: SEOAnalysis | undefined = result.analysis;

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Header */}
      <header className="bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110">
              <img 
                src="/logo.png" 
                alt="ListingMaker Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Listing<span className="text-orange-400">Maker</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadMarkdown(result)}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold rounded-xl transition border border-white/10"
              title="Descargar contexto para IA"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              AI Context (.md)
            </button>
            <button
              onClick={() => downloadPDF("full-report", `listing-${(result.productName ?? "product").toLowerCase().replace(/\s+/g, "-")}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition shadow-[0_0_15px_rgba(249,115,22,0.3)] ring-1 ring-orange-400/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Descargar PDF
            </button>
            <button 
              onClick={handleCopyAll} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium rounded-xl transition border border-white/10"
            >
              {copyAllDone ? (
                <><svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copiado</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copiar Todo</>
              )}
            </button>
            <Link href="/create" className="text-gray-400 hover:text-orange-400 text-sm font-medium transition ml-2">
               + Nuevo Listing
            </Link>
          </div>
         </div>
       </header>
 
       <div className="max-w-5xl mx-auto px-4 py-8">
         {/* Demo Notice */}
         {result.isDemo && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-500 font-medium">{t.result.demoNotice}</p>
            </div>
            <Link 
              href="/#pricing" 
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition text-center"
            >
              🚀 {["es", "it"].includes(locale) ? "Recargar Créditos" : "Buy Credits"}
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0a0a10] rounded-xl p-1 mb-8 border border-white/5 w-fit">
          <button
            onClick={() => setActiveTab("listing")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "listing" ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]" : "text-gray-400 hover:text-white"}`}
          >
            {t.result.listingTab}
          </button>
          <button
            onClick={() => setActiveTab("diagnostic")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "diagnostic" ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]" : "text-gray-400 hover:text-white"}`}
          >
            {t.result.seoDiagnostic}
          </button>
          {result.aplusContent && result.aplusContent.modules && result.aplusContent.modules.length > 0 && (
            <button
              onClick={() => setActiveTab("aplus")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "aplus" ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]" : "text-gray-400 hover:text-white"}`}
            >
              {t.result.aplusTab || "A+ Premium"}
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* ACTIVE TAB DISPLAY (UI ONLY) ═══════════ */}
        <div id="active-tab-container">
          {activeTab === "diagnostic" && RenderDiagnostic(analysis, t)}
          {activeTab === "listing" && RenderListing(result, t)}
          {activeTab === "aplus" && result.aplusContent && RenderAPlusContent(result.aplusContent, t)}
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* HIDDEN FULL REPORT FOR PDF ═════════════ */}
        <div id="full-report" className="fixed top-0 left-[-9999px] w-[1000px] bg-[#050508] p-10 pointer-events-none opacity-0">
          <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Listing<span className="text-orange-400">Maker</span> Report</h1>
                <p className="text-gray-500 text-sm">Professional Amazon Listing Optimization</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-bold">{result.productName}</p>
              <p className="text-gray-600 text-xs">Marketplace: Amazon.{result.marketplace}</p>
            </div>
          </div>
          <div className="space-y-12">
            {RenderListing(result, t)}
            <div className="page-break" />
            {analysis && RenderDiagnostic(analysis, t)}
            {result.aplusContent && result.aplusContent.modules && result.aplusContent.modules.length > 0 && (
              <>
                <div className="page-break" />
                {RenderAPlusContent(result.aplusContent, t)}
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-10">
          <div className="flex items-center justify-center gap-3">
            <Link href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition shadow-[0_0_20px_rgba(249,115,22,0.2)]">
              Create Another Listing
            </Link>
            <Link href="/#pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition border border-white/10">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE RENDER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function RenderListing(result: ListingResult, t: any) {
  return (
    <div className="space-y-6">
      <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
          <h2 className="font-semibold text-green-300">{t.result.readyTitle}</h2>
          <p className="text-sm text-green-400/70 mt-1">{t.result.readySubtitle}</p>
        </div>
      </div>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">{t.result.sections.title}</h3>
          <CopyButton text={result.title || ""} label="title" />
        </div>
        <p className="text-gray-300 leading-relaxed">{result.title}</p>
      </section>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">{t.result.sections.bullets}</h3>
          <CopyButton text={(result.bullets || []).join("\n\n")} label="bullets" />
        </div>
        <div className="space-y-4">
          {(result.bullets || []).map((bullet, i) => (
            <div key={i} className="group/bullet">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 opacity-0 group-hover/bullet:opacity-100 transition-opacity">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Bullet {i+1}</span>
                    <CopyButton text={bullet} label={`bullet ${i+1}`} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{bullet}</p>
                </div>
              </div>
              {i < result.bullets.length - 1 && <hr className="mt-4 border-white/5" />}
            </div>
          ))}
        </div>
      </section>

      {/* New Benefits / Claims Section */}
      {result.benefits && result.benefits.length > 0 && (
        <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">{t.result.sections.benefits}</h3>
            <CopyButton text={result.benefits.join("\n")} label="benefits" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5 group/benefit transition hover:border-orange-500/20">
                <div className="w-2 h-2 rounded-full bg-orange-500/40" />
                <p className="text-gray-300 text-sm font-medium flex-1">{benefit}</p>
                <div className="opacity-0 group-hover/benefit:opacity-100 transition-opacity">
                  <CopyButton text={benefit} label={benefit} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">{t.result.sections.description}</h3>
          <CopyButton text={result.description || ""} label="description" />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{result.description}</p>
      </section>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">{t.result.sections.backend}</h3>
          <CopyButton text={result.backendKeywords} label="backend keywords" />
        </div>
        <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
          <p className="text-gray-300 text-sm font-mono leading-relaxed break-all">{result.backendKeywords}</p>
        </div>
      </section>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4">{t.result.sections.strategy}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t.result.sections.primary}</p>
            <span className="inline-block bg-orange-500/10 text-orange-400 text-sm font-medium px-3 py-1 rounded-lg border border-orange-500/20">{result.keywordsUsed.primary}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t.result.sections.secondary}</p>
            <div className="flex flex-wrap gap-1.5">
              {result.keywordsUsed.secondary.map((kw, i) => (
                <span key={i} className="inline-block bg-blue-500/10 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-blue-500/20">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Backend</p>
            <div className="flex flex-wrap gap-1.5">
              {result.keywordsUsed.backend.map((kw, i) => (
                <span key={i} className="inline-block bg-white/5 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-lg border border-white/10">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RenderDiagnostic(analysis: SEOAnalysis, t: any) {
  return (
    <div className="space-y-6">
      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-center mb-8">
          <ScoreRing score={analysis.seoScore} label={t.result.performance.seoScore} color="#f97316" />
          <ScoreRing score={analysis.rufusScore} label={t.result.performance.rufusScore} color="#3b82f6" />
        </div>
        <div className="bg-[#12121a] rounded-xl p-5 border border-white/5">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">{t.result.performance.strategySummary}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{analysis.strategySummary}</p>
        </div>
      </section>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs">T</span>
          {t.result.performance.titleAnalysis}
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-[#12121a] rounded-xl p-4 border border-white/5 text-center">
            <div className="text-2xl font-bold text-white">{analysis.titleAnalysis.charCount}</div>
            <div className="text-xs text-gray-500">/ 200 {t.result.performance.chars}</div>
          </div>
          <div className="bg-[#12121a] rounded-xl p-4 border border-white/5 text-center">
            <div className="text-2xl font-bold text-white">#{analysis.titleAnalysis.primaryKeywordPosition}</div>
            <div className="text-xs text-gray-500">{t.result.performance.keywordPosition}</div>
          </div>
          <div className="bg-[#12121a] rounded-xl p-4 border border-white/5 text-center">
            <div className={`text-2xl font-bold ${analysis.titleAnalysis.keywordDensity === "optimal" ? "text-green-400" : "text-amber-400"}`}>
              {analysis.titleAnalysis.keywordDensity}
            </div>
            <div className="text-xs text-gray-500">{t.result.performance.density}</div>
          </div>
        </div>
        <div className="bg-[#12121a] rounded-xl p-4 border border-white/5 text-sm text-gray-300 leading-relaxed">
          <strong>{t.result.performance.verdict}:</strong> {analysis.titleAnalysis.verdict}
        </div>
      </section>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">K</span>
          {t.result.performance.competitorMap}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5 text-left">
                <th className="py-3 pr-4">{t.result.performance.keyword}</th>
                <th className="py-3 pr-4">{t.result.performance.frequency}</th>
                <th className="py-3 pr-4">{t.result.performance.type}</th>
                <th className="py-3">{t.result.performance.placement}</th>
              </tr>
            </thead>
            <tbody>
              {analysis.competitorKeywordMap.map((kw, i) => (
                <tr key={i} className="border-b border-white/[0.03]">
                  <td className="py-2.5 pr-4 text-gray-300 font-medium">{kw.keyword}</td>
                  <td className="py-2.5 pr-4"><FrequencyBar frequency={kw.frequency} total={kw.totalCompetitors} /></td>
                  <td className="py-2.5 pr-4"><ClassBadge classification={kw.classification} /></td>
                  <td className="py-2.5 text-gray-500 text-xs">{kw.placement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[#0a0a10] rounded-2xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-green-500/10 text-green-400 flex items-center justify-center text-xs">!</span>
          {t.result.performance.keywordGaps}
        </h3>
        <div className="space-y-3">
          {analysis.keywordGaps.map((gap, i) => (
            <div key={i} className="flex items-start gap-3 bg-green-500/[0.03] rounded-xl p-4 border border-green-500/10 text-sm text-gray-300">
              <span className="text-green-400 mt-0.5 shrink-0">+</span>
              {gap}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// A+ PREMIUM CONTENT BRIEFING
// ─────────────────────────────────────────────────────────────────────────────

const moduleTypeIcons: Record<string, { icon: string; color: string }> = {
  "Hero Banner": { icon: "H", color: "bg-orange-500/10 text-orange-400" },
  "4 Key Differentiators": { icon: "4", color: "bg-blue-500/10 text-blue-400" },
  "Ingredients / Specifications": { icon: "S", color: "bg-green-500/10 text-green-400" },
  "How to Use": { icon: "U", color: "bg-purple-500/10 text-purple-400" },
  "Comparison Table": { icon: "C", color: "bg-cyan-500/10 text-cyan-400" },
  "Brand Story": { icon: "B", color: "bg-amber-500/10 text-amber-400" },
  "Visual FAQ": { icon: "?", color: "bg-red-500/10 text-red-400" },
};

function RenderAPlusContent(aplusContent: APlusContent, t: any) {
  const aplus = t.result?.aplus || {};
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-purple-300">{aplus.title || "A+ Premium Content Briefing"}</h2>
          <p className="text-sm text-purple-400/70 mt-1">{aplus.subtitle || "7-module content brief ready for your design team."}</p>
        </div>
      </div>

      {/* Modules */}
      {aplusContent.modules.map((mod, i) => {
        const iconConfig = moduleTypeIcons[mod.moduleType] || { icon: `${mod.moduleNumber}`, color: "bg-white/5 text-gray-400" };
        return (
          <section key={i} className="bg-[#0a0a10] rounded-2xl border border-white/5 overflow-hidden">
            {/* Module header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${iconConfig.color}`}>
                {iconConfig.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {aplus.moduleLabel || "Module"} {mod.moduleNumber}
                  </span>
                  <span className="text-[10px] text-gray-600">•</span>
                  <span className="text-xs font-medium text-gray-400">{mod.moduleType}</span>
                </div>
              </div>
              <CopyButton
                text={`${mod.headline}\n\n${mod.bodyText}\n\nImage: ${mod.imageDescription}`}
                label={`module ${mod.moduleNumber}`}
              />
            </div>

            {/* Module content */}
            <div className="p-6 space-y-5">
              {/* Headline */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{aplus.headline || "Headline"}</p>
                <p className="text-white font-semibold text-lg leading-snug">{mod.headline}</p>
              </div>

              {/* Body Text */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{aplus.bodyText || "Body Text"}</p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{mod.bodyText}</p>
              </div>

              {/* Image Direction */}
              <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{aplus.imageDirection || "Image Direction"}</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">{mod.imageDescription}</p>
              </div>

              {/* Strategic Purpose */}
              <div className="flex items-start gap-2.5 bg-orange-500/[0.04] rounded-xl px-4 py-3 border border-orange-500/10">
                <svg className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold text-orange-400/60 uppercase tracking-wider mb-0.5">{aplus.strategicPurpose || "Strategic Purpose"}</p>
                  <p className="text-orange-300/80 text-sm">{mod.strategicPurpose}</p>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    }>
      <ResultPageInner />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050508] flex flex-col">
      <header className="bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-110">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-white">ListingMaker</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-24 w-full flex-grow text-center">
        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-orange-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">¿Hablamos?</h1>
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto">Nuestro equipo de soporte está listo para ayudarte con tus listings o cualquier duda técnica.</p>
        
        <a 
          href="mailto:support@listingmaker.ai" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105"
        >
          support@listingmaker.ai
        </a>
      </div>

      <Footer />
    </div>
  );
}

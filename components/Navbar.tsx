"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, setAuthModalOpen, setAuthView } = useAuth();
  const { t } = useI18n();

  const handleOpenAuth = (view: "login" | "signup") => {
    setAuthView(view);
    setAuthModalOpen(true);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/70 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-110">
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

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition">{t.nav.howItWorks}</Link>
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-white transition">{t.nav.pricing}</Link>
            <Link href="/#faq" className="text-sm text-gray-400 hover:text-white transition">{t.nav.faq}</Link>
            <LanguageSwitcher />
            {!loading && (
              user ? (
                <Link href="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-[0_0_20px_rgba(249,115,22,0.3)]">{t.nav.dashboard}</Link>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => handleOpenAuth("login")} className="text-sm text-gray-400 hover:text-white font-medium transition cursor-pointer">{t.nav.signIn}</button>
                  <button onClick={() => handleOpenAuth("signup")} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer">{t.nav.tryFree}</button>
                </div>
              )
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button className="p-2 text-gray-400" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a10]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-3">
          <Link href="/#how-it-works" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>{t.nav.howItWorks}</Link>
          <Link href="/#pricing" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>{t.nav.pricing}</Link>
          <Link href="/#faq" className="block text-sm text-gray-400" onClick={() => setMobileOpen(false)}>{t.nav.faq}</Link>
          {!loading && (
            user ? (
              <Link href="/dashboard" className="block text-center bg-orange-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>{t.nav.dashboard}</Link>
            ) : (
              <>
                <button onClick={() => handleOpenAuth("login")} className="block w-full text-left text-sm text-gray-400" >{t.nav.signIn}</button>
                <button onClick={() => handleOpenAuth("signup")} className="block w-full text-center bg-orange-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg" >{t.nav.tryFree}</button>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}

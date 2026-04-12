"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050508] border-t border-white/5 py-12 px-4 mt-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-110">
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
            <p className="text-gray-500 text-sm">
              © {year} ListingMaker. {t.footer.rights}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-gray-400">
            <Link href="/legal" className="hover:text-orange-400 transition">
              {t.footer.legalNotice}
            </Link>
            <Link href="/privacy" className="hover:text-orange-400 transition">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/contact" className="hover:text-orange-400 transition">
              {t.footer.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

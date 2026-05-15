"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050508] border-t border-white/5 pt-16 pb-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
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
            <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
              {t.footer.tagline}
            </p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {t.footer.builtBy}
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://twitter.com/listingmakerai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition"
                aria-label="Twitter/X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/listingmakerai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@listingmakerai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {t.footer.product}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.footer.createListing, href: "/create" },
                { label: t.footer.pricing, href: "/#pricing" },
                { label: t.footer.howItWorks, href: "/#how-it-works" },
                { label: t.footer.dashboard, href: "/dashboard" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-orange-400 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.footer.faq, href: "/#faq" },
                { label: t.footer.blog, href: "/blog" },
                { label: t.footer.amazonSeoGuide, href: "/blog/amazon-seo-guide" },
                { label: t.footer.rufusGuide, href: "/blog/rufus-ai" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-orange-400 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {t.footer.company}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.footer.contact, href: "/contact" },
                { label: t.footer.affiliate, href: "/affiliate" },
                { label: t.footer.legalNotice, href: "/legal" },
                { label: t.footer.privacyPolicy, href: "/privacy" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-orange-400 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Markets strip */}
        <div className="border-t border-white/5 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{t.footer.markets}</span>
              <span className="text-[11px] text-gray-500">{t.footer.marketsDesc}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {["🇪🇸","🇩🇪","🇫🇷","🇮🇹","🇬🇧","🇺🇸"].map((flag, i) => (
                <span key={i} className="text-base leading-none">{flag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-600">
            © {year} ListingMaker.AI — {t.footer.rights}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <span>Made with</span>
            <span className="text-orange-500">♥</span>
            <span>for Amazon sellers worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

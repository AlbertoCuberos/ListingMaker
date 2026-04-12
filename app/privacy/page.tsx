"use client";

import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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

      <div className="max-w-3xl mx-auto px-4 py-16 w-full flex-grow">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Política de Privacidad</h1>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-6">
          <p>En ListingMaker, la privacidad de nuestros usuarios es una prioridad. Esta política describe cómo recopilamos y usamos tus datos.</p>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Recopilación de Datos</h2>
            <p>Recopilamos tu email y nombre a través de Google Sign-In para gestionar tu cuenta y créditos. No compartimos estos datos con terceros externos con fines comerciales.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Tus Imágenes y Textos</h2>
            <p>Las imágenes que subas se procesan temporalmente para el análisis de IA y no se almacenan permanentemente en nuestros servidores públicos sin tu consentimiento.</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

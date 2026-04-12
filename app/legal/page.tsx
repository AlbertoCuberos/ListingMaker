"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

export default function LegalPage() {
  const { t } = useI18n();

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
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Aviso Legal</h1>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Datos Identificativos</h2>
            <p>En cumplimiento con el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se hace constar que ListingMaker es una plataforma operada por [Nombre de tu Empresa/Tú], con domicilio en [Tu Dirección], y correo electrónico de contacto: [Tu Email].</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Propiedad Intelectual</h2>
            <p>El código fuente, los diseños gráficos, las imágenes, las fotografías, los sonidos, las animaciones, el software, los textos, así como la información y los contenidos que se recogen en el presente sitio web están protegidos por la legislación española sobre los derechos de propiedad intelectual e industrial a favor de ListingMaker.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Uso de la IA</h2>
            <p>ListingMaker utiliza tecnologías de Inteligencia Artificial para la generación de contenido. El usuario es el único responsable de verificar la veracidad y legalidad de los textos generados antes de su publicación en plataformas de terceros como Amazon.</p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

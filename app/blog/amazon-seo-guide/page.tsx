import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía SEO Amazon 2026: Algoritmo COSMO, Rufus AI y Listings que Venden",
  description:
    "Guía completa de SEO para Amazon en 2026. Aprende a optimizar títulos, bullets, keywords y contenido A+ para el algoritmo COSMO, Rufus AI y el motor semántico. Más conversiones, menos ACoS.",
  keywords: [
    "SEO Amazon 2026",
    "algoritmo Amazon 2026",
    "COSMO Amazon",
    "Rufus AI Amazon",
    "optimizar listing Amazon",
    "keywords Amazon España",
    "A+ content Amazon",
    "posicionamiento Amazon",
    "amazon SEO español",
    "listing Amazon optimizado",
  ],
  openGraph: {
    title: "Guía SEO Amazon 2026: COSMO, Rufus AI y Listings que Venden",
    description:
      "Todo lo que necesitas saber para posicionarte en Amazon en 2026: algoritmo COSMO, Rufus AI, optimización de títulos, bullets y keywords backend.",
    type: "article",
    url: "https://listingmaker.app/blog/amazon-seo-guide",
  },
  alternates: {
    canonical: "https://listingmaker.app/blog/amazon-seo-guide",
  },
};

export default function AmazonSEOGuide() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0a0a14] to-[#050508] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
          <div className="flex items-center gap-2 text-sm text-orange-400 mb-4">
            <Link href="/" className="hover:text-orange-300 transition">ListingMaker</Link>
            <span className="text-gray-600">/</span>
            <span>Guía SEO Amazon 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            SEO para Amazon en 2026:{" "}
            <span className="text-orange-400">COSMO, Rufus AI</span> y Listings que Venden
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            El algoritmo de Amazon ya no premia el relleno de keywords. En 2026, tres capas de inteligencia artificial — COSMO, el motor semántico y Rufus AI — deciden qué productos aparecen primero. Esta guía te explica exactamente cómo optimizar cada campo de tu listing para ganar visibilidad orgánica, reducir tu ACoS y vender más.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              Actualizado mayo 2026
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              Lectura: 18 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              Mercados: ES · DE · FR · IT · UK · US
            </span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-bold mb-4 text-orange-400">Índice de contenidos</h2>
          <ol className="space-y-2 text-sm text-gray-300">
            {[
              ["1", "Las tres capas del algoritmo Amazon 2026", "#tres-capas"],
              ["2", "COSMO: el grafo de conocimiento que cambia todo", "#cosmo"],
              ["3", "Rufus AI: optimiza para el asistente de compras", "#rufus"],
              ["4", "El título perfecto: 200 caracteres que venden", "#titulo"],
              ["5", "Bullet points que convierten en 2026", "#bullets"],
              ["6", "Keywords backend: 500 bytes bien utilizados", "#backend"],
              ["7", "Contenido A+ Premium y su impacto en COSMO", "#aplus"],
              ["8", "PPC vs. orgánico: la estrategia ganadora", "#ppc"],
              ["9", "Optimización multi-mercado Europa", "#multimercado"],
              ["10", "Investigación de keywords sin Helium 10", "#keywords"],
            ].map(([num, label, href]) => (
              <li key={href}>
                <a href={href} className="flex items-center gap-2 hover:text-orange-400 transition group">
                  <span className="text-orange-400/50 font-mono group-hover:text-orange-400">{num}.</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* CONTENT */}
        <article className="prose prose-invert prose-orange max-w-none">

          {/* Sección 1 */}
          <section id="tres-capas" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">01</span>
              Las tres capas del algoritmo Amazon 2026
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Si sigues optimizando listings como en 2022 — repitiendo keywords al máximo, usando pipes para separar frases, y rellenando cada campo con la keyword principal diez veces — estás perdiendo posiciones activamente. El motor de búsqueda de Amazon ha evolucionado en tres grandes saltos desde 2023, y los tres están activos simultáneamente en 2026.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {[
                {
                  title: "COSMO",
                  since: "Activo desde 2024",
                  desc: "Sistema de IA que entiende la INTENCIÓN de compra, no solo las keywords. Transforma el matching clásico Query→Producto en Query→Producto→INTENCIÓN.",
                  color: "orange",
                },
                {
                  title: "Motor Semántico",
                  since: "Dominante desde 2023",
                  desc: "Entiende sinónimos, contexto y relaciones semánticas. Ya no necesitas repetir la keyword exacta: el lenguaje natural funciona mejor.",
                  color: "blue",
                },
                {
                  title: "Rufus AI",
                  since: "Europa desde 2025",
                  desc: "Asistente de compras conversacional que lee TODO tu listing y recomienda productos según preguntas en lenguaje natural.",
                  color: "purple",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="text-xs text-gray-500 mb-1">{item.since}</div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-6">
              <p className="text-orange-200 font-medium mb-1">El cambio fundamental</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Bajo el antiguo A9, la estrategia era maximizar cobertura de keywords. Bajo COSMO + semántica + Rufus, la estrategia es: <strong className="text-white">mencionar cada keyword importante UNA VEZ en la ubicación más relevante</strong>, y usar cada carácter restante para cubrir el máximo de relaciones de intención (para quién es, cómo se usa, qué problema resuelve, qué ocasión, qué estilo de vida).
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed">
              El 52% de los consumidores inician sus búsquedas de producto directamente en Amazon (no en Google), y el 55% investigan en Amazon antes de comprar en cualquier canal. Aparecer en las primeras posiciones ya no es opcional: es la diferencia entre existir y no existir como producto.
            </p>
          </section>

          {/* Sección 2 */}
          <section id="cosmo" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">02</span>
              COSMO: el grafo de conocimiento que cambia todo
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              COSMO (Common Sense Knowledge Generation) es el sistema de inteligencia artificial que Amazon presentó en el congreso académico SIGMOD 2024. No es marketing — es un paper científico real, con once investigadores firmantes y resultados A/B testeados en producción. Su impacto en el ranking orgánico ya es medible.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">Cómo funciona COSMO</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              El problema que resuelve COSMO es simple de enunciar pero complejo de resolver: los sistemas anteriores entendían <em>qué</em> buscaba un usuario, pero no <em>por qué</em> lo buscaba. Cuando alguien escribe "zapatos para embarazada", COSMO infiere que necesita suela antideslizante y soporte para el tobillo — aunque el listing no mencione explícitamente "embarazada".
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              El sistema construye grafos de conocimiento que conectan productos, atributos e intención del comprador. Cubre 18 categorías principales de producto y genera millones de relaciones de sentido común a partir de un proceso de tres etapas: extracción de seeds desde LLMs, refinamiento con clasificadores entrenados y escalado con COSMO-LM.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-orange-400 mb-3">Lo que COSMO evalúa en tu listing</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {[
                  "Para quién es el producto (audiencia, demografía, estilo de vida)",
                  "Cómo se usa (instrucciones, contexto de uso, ocasión)",
                  "Qué problema resuelve (dolor que alivia, necesidad que cubre)",
                  "Qué atributos tiene (ingredientes, materiales, especificaciones técnicas)",
                  "Con qué se usa (compatibilidades, complementos, pairings)",
                  "Las primeras 5 palabras del título (máximo peso de señal de intención)",
                  "El contenido A+ completo incluyendo alt-text de imágenes",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
              <p className="text-blue-200 font-medium mb-1">Timing importante</p>
              <p className="text-gray-300 text-sm">
                Las actualizaciones del grafo COSMO tardan entre 7 y 14 días en reflejarse en los rankings. Si cambias tu listing hoy, no esperes ver resultados mañana.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Cómo optimizar para COSMO</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              La política de títulos de Amazon de enero 2025 establece explícitamente que <strong className="text-white">ninguna palabra puede aparecer más de dos veces en todo el listing</strong>. Esto es COSMO en acción: el algoritmo ya no necesita que repitas la keyword para indexarla.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Rellena los atributos de backend de Seller Central al máximo: "intended use", "target audience", "subject matter", "occasion". Estos campos alimentan directamente la categorización COSMO y son los más infrautilizados por los sellers europeos.
            </p>
          </section>

          {/* Sección 3 */}
          <section id="rufus" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">03</span>
              Rufus AI: optimiza para el asistente de compras
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Rufus es el asistente de compras conversacional de Amazon. Lanzado en EE.UU. en 2024 y activo en Europa desde 2025, en 2026 está operativo en todos los mercados incluyendo Amazon.es, Amazon.de, Amazon.fr y Amazon.it. Cuando un comprador pregunta "¿qué suplemento es mejor para articulaciones de perros mayores?", Rufus lee los listings completos y recomienda los que mejor responden la pregunta.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">Qué lee Rufus de tu listing</h3>
            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              {[
                { field: "Título", note: "Primera señal de relevancia" },
                { field: "Bullet points", note: "Respuestas a preguntas de compradores" },
                { field: "Descripción", note: "Peso especial aunque no sea visible con A+" },
                { field: "A+ Content completo", note: "Incluyendo alt-text de imágenes" },
                { field: "Reseñas de clientes", note: "Lenguaje real, casos de uso, objeciones" },
                { field: "Q&A del listing", note: "Cada pregunta respondida suma" },
              ].map((item) => (
                <div key={item.field} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                  <span className="text-orange-400 font-medium text-sm min-w-[90px]">{item.field}</span>
                  <span className="text-gray-400 text-sm">{item.note}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Cómo escribir bullets para Rufus</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              El SEO tradicional de Amazon escribía bullets como listas de características. Rufus los necesita como respuestas a preguntas reales. Antes de escribir cada bullet, pregúntate: ¿qué pregunta concreta responde esto?
            </p>

            <div className="space-y-3 mb-8">
              {[
                { q: "¿Es seguro para mi mascota?", approach: "Certificaciones, tests de laboratorio, vet-formulated" },
                { q: "¿Cuánto dura el producto?", approach: "Número de días, dosis exacta, precio por unidad de uso" },
                { q: "¿Cómo se usa?", approach: "Instrucciones simples, integración en rutina diaria" },
                { q: "¿Qué lo diferencia de otros?", approach: "Diferencial vs. alternativas convencionales, proof points" },
                { q: "¿Para qué perfil es ideal?", approach: "Audiencia específica, casos de uso, ocasión de compra" },
              ].map((item) => (
                <div key={item.q} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-300 mb-1">Pregunta que responde: "{item.q}"</p>
                    <p className="text-sm text-gray-400">{item.approach}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
              <p className="text-purple-200 font-medium mb-2">El truco que pocos sellers conocen</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                La <strong className="text-white">descripción del producto</strong> tiene peso especial para Rufus aunque no sea visible en el frontend cuando tienes A+ activo. Rufus la lee igualmente. Escribe la descripción pensando en Rufus: usa lenguaje natural, responde objeciones frecuentes y cubre casos de uso que no encajan en los bullets.
              </p>
            </div>
          </section>

          {/* Sección 4 */}
          <section id="titulo" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">04</span>
              El título perfecto: 200 caracteres que venden
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              El título es el campo más valioso de tu listing. Es el primer contacto del algoritmo con tu producto, la primera impresión del comprador en resultados de búsqueda, y la señal de intención más fuerte para COSMO. Aquí no hay espacio para desperdiciar un carácter.
            </p>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-8">
              <p className="text-orange-200 font-bold mb-2">Regla de oro: usa los 200 caracteres completos</p>
              <p className="text-gray-300 text-sm">
                Cada carácter que no usas es una keyword perdida y contexto que Rufus no puede procesar. Un título de 120 caracteres deja el 40% del potencial de indexación sobre la mesa. En 2026, los listings top siempre usan entre 185 y 200 caracteres.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Estructura probada del título</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 font-mono text-sm">
              <p className="text-orange-400 mb-1">Formato:</p>
              <p className="text-gray-300">[MARCA] [Tipo Producto] [Audiencia] — [Beneficio Principal] — [Ingredientes/Diferencial] — [Certificación] — [Cantidad]</p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Lo que el algoritmo prohíbe en 2026</h3>
            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-300 font-medium mb-2">❌ Prohibido</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>Pipes <code className="text-gray-300">|</code> como separadores</li>
                  <li>Caracteres especiales: !, ~, $, *</li>
                  <li>Repetir la misma palabra más de 2 veces</li>
                  <li>Superlativos sin respaldo (#1, el mejor)</li>
                  <li>Claims de salud no verificados</li>
                  <li>Títulos inferiores a 185 caracteres</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-300 font-medium mb-2">✓ Recomendado</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>Guión largo <code className="text-gray-300">—</code> como separador principal</li>
                  <li>Keyword principal en posiciones 1-5</li>
                  <li>Audiencia específica + contexto de uso</li>
                  <li>Certificaciones reales (GMP, ISO, etc.)</li>
                  <li>Cantidad/variante en el título</li>
                  <li>Beneficio antes que característica</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Recuerda que en móvil solo son visibles los primeros 60-80 caracteres sin hacer clic. Los primeros 80 caracteres deben resolver la duda principal del comprador y contener la keyword con mayor intención de compra.
            </p>
          </section>

          {/* Sección 5 */}
          <section id="bullets" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">05</span>
              Bullet points que convierten en 2026
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Tienes 5 bullets y 500 caracteres por bullet. Son los responsables principales de la conversión: si el título genera el clic, los bullets generan la compra. En 2026 deben cumplir simultáneamente tres funciones: indexar keywords para A9, responder intenciones para COSMO, y resolver preguntas de compradores para Rufus.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">La estructura que funciona</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <p className="text-orange-400 font-mono text-sm mb-2">Estructura por bullet:</p>
              <p className="text-gray-300 text-sm"><strong className="text-white">BENEFICIO EN MAYÚSCULAS</strong> — Desarrollo en prosa natural: característica + prueba verificable + contexto de uso específico</p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                {
                  pos: "Bullet 1",
                  focus: "Diferencial de marca",
                  desc: "Tu ventaja competitiva principal frente a la competencia. Lo que solo tú tienes. Certificación, formulación exclusiva, tecnología propia.",
                },
                {
                  pos: "Bullet 2",
                  focus: "Beneficio funcional primario",
                  desc: "El resultado más tangible para el comprador. Con números concretos: '60 perlas para 30-60 días', no 'suministro de un mes'.",
                },
                {
                  pos: "Bullet 3",
                  focus: "Beneficio secundario + objeción principal",
                  desc: "Segundo beneficio relevante + respuesta a la objeción más frecuente en reseñas de competidores.",
                },
                {
                  pos: "Bullet 4",
                  focus: "Ingredientes / especificaciones clave",
                  desc: "Prueba técnica de la promesa: ingredientes activos con cantidades exactas, materiales, compatibilidades.",
                },
                {
                  pos: "Bullet 5",
                  focus: "Promesa de marca + confianza",
                  desc: "Historia de marca condensada, expertise, trust signals (años de experiencia, número de clientes, garantía de satisfacción).",
                },
              ].map((item) => (
                <div key={item.pos} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-orange-400 font-bold text-sm min-w-[60px]">{item.pos}</span>
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{item.focus}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white font-medium mb-3">Reglas de copywriting que el algoritmo premia</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">Beneficio antes que característica.</strong> "Tu perro recupera la energía de cachorro" antes que "contiene 1000mg de Omega-3"</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">Números concretos siempre.</strong> El motor semántico extrae cantidades y los usa para comparativas</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">El comprador es el héroe.</strong> El producto es el aliado, no el protagonista</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">Frases naturales indexan mejor que listas de keywords.</strong> "Ideal para perros que rechazan el cepillo" indexa para "sin cepillo perros" automáticamente</li>
              </ul>
            </div>
          </section>

          {/* Sección 6 */}
          <section id="backend" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">06</span>
              Keywords backend: 500 bytes bien utilizados
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              En 2024 Amazon expandió el campo de Search Terms de 249 a <strong className="text-white">500 bytes</strong> para la mayoría de categorías. Es el doble de espacio invisible que pocos sellers están aprovechando correctamente.
            </p>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
              <p className="text-red-300 font-bold mb-2">⚠ CRÍTICO: Bytes, no caracteres</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Las letras estándar cuentan como 1 byte. Los caracteres especiales del español y alemán (ñ, ü, ö, ä, é, á, í, ó, ú) cuentan como <strong className="text-white">2 bytes cada uno</strong>. Si te pasas en 1 solo byte del límite, Amazon puede desindexar <strong className="text-white">TODO el campo</strong> sin aviso. Cuenta los bytes, no los caracteres, antes de guardar.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Qué poner en el campo Search Terms</h3>
            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {[
                { title: "Sinónimos del producto", desc: "Nombres alternativos, términos coloquiales, variaciones regionales" },
                { title: "Errores tipográficos frecuentes", desc: "Los compradores cometen errores — Amazon los indexa pero tú debes incluirlos" },
                { title: "Términos en otros idiomas", desc: "En Amazon.es: equivalentes en inglés. En Amazon.de: términos en inglés muy usados" },
                { title: "Long-tails sin cobertura", desc: "Frases de 4+ palabras con alta intención de compra que no caben en el título" },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white font-medium text-sm mb-1">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white font-medium mb-2">Reglas que la mayoría ignora</p>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> Sin comas: separa palabras con espacios</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> Sin repetir palabras que ya están en título, bullets o descripción (ya están indexadas)</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> Sin nombres de marca competidores ni ASINs</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> Sin palabras prohibidas: "mejor", "oferta", "precio", "envío gratis"</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">→</span> Todo en minúsculas, sin artículos ni preposiciones</li>
              </ul>
            </div>
          </section>

          {/* Sección 7 */}
          <section id="aplus" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">07</span>
              Contenido A+ Premium y su impacto en COSMO
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              El A+ Premium (antes Enhanced Brand Content para los más veteranos) aumenta la tasa de conversión una media del <strong className="text-white">5,6%</strong>, con rangos que van del 3% al 10% según la calidad de implementación y la categoría. En categorías competitivas con CVRs del 10-15%, ese 5,6% adicional puede ser la diferencia entre perder y ganar la Buy Box.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">A+ y COSMO: la conexión que cambia la estrategia</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Hay una verdad que los tutoriales de A+ no cuentan: el contenido A+ <strong className="text-white">no está indexado por el buscador interno de Amazon</strong>. Las keywords que pones en los módulos A+ no contribuyen al ranking de búsqueda directamente. Sin embargo:
            </p>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">COSMO sí parsea el A+ completo</strong>, incluyendo el alt-text de las imágenes y los módulos de comparativa. Esto impacta directamente en la categorización y relevancia semántica.</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">Rufus lee el A+ entero</strong>. Módulos bien estructurados (FAQ visual, instrucciones de uso, comparativa) aumentan las probabilidades de recomendación.</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">→</span> <strong className="text-white">Google indexa el A+</strong>. El SEO externo que atrae tráfico a tu listing es señal de ranking para el A10.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-white">Estructura A+ recomendada para 2026</h3>
            <div className="space-y-2 mb-6">
              {[
                ["Hero banner", "Full-width con claim principal. Usa el alt-text para incluir keywords que no están en el título."],
                ["4 diferenciales clave", "Iconos + texto corto (≤50 caracteres). COSMO extrae estos atributos para la categorización."],
                ["Ingredientes / especificaciones", "Tabla de transparencia. Las tablas son especialmente eficientes para el parsing de COSMO."],
                ["Instrucciones de uso", "Pasos visuales + guía de dosificación. Rufus los usa para responder '¿cómo se usa?'"],
                ["Comparativa", "Tu producto vs. 'alternativas convencionales'. Aumenta el CVR en un 8-12% extra."],
                ["Historia de marca", "Origen, valores, certificaciones, expertise. Rufus valora la autoridad de marca."],
                ["FAQ visual", "4-5 preguntas extraídas de reseñas de competidores. El campo donde Rufus más se apoya."],
              ].map(([title, desc], i) => (
                <div key={title} className="flex gap-3 bg-white/5 rounded-xl p-3">
                  <span className="text-orange-400/60 font-mono text-xs mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
              <p className="text-blue-200 font-medium mb-1">A+ Premium es actualmente gratuito</p>
              <p className="text-gray-300 text-sm">Para acceder necesitas: Brand Registry activo + Brand Story publicado en todos tus ASINs + mínimo 5 proyectos A+ aprobados en los últimos 12 meses. Si cumples los requisitos, actívalo inmediatamente — los 19 módulos premium ofrecen más espacio, imágenes más grandes y módulos de comparativa con precios.</p>
            </div>
          </section>

          {/* Sección 8 */}
          <section id="ppc" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">08</span>
              PPC vs. orgánico: la estrategia ganadora en 2026
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              El A10 cambió las reglas del juego respecto al A9: el PPC ya no tiene el mismo peso en el ranking orgánico. Las ventas orgánicas ranquean mejor que las generadas por publicidad. El tráfico externo (influencers, SEO, redes sociales) es ahora señal directa de ranking. Esto no significa que el PPC sea inútil — significa que se usa diferente.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                <h4 className="text-green-300 font-semibold mb-3">Keywords para orgánico</h4>
                <p className="text-gray-300 text-sm mb-2">Competencia media-baja. Posicionamiento en 30-90 días con listing optimizado.</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Long-tails de 3-4 palabras</li>
                  <li>• Keywords de nicho con alta intención</li>
                  <li>• Términos de uso específico</li>
                  <li>• Audiencias específicas</li>
                </ul>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
                <h4 className="text-orange-300 font-semibold mb-3">Keywords para PPC</h4>
                <p className="text-gray-300 text-sm mb-2">Alta competencia y volumen. Necesitas pagar para aparecer mientras construyes el orgánico.</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Keywords genéricas de categoría</li>
                  <li>• Términos de alto volumen</li>
                  <li>• Marcas competidoras (si permite)</li>
                  <li>• Keywords de lanzamiento (primeras 4 semanas)</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">
              Un listing bien optimizado reduce directamente tu ACoS: mejor CTR (el título y la imagen principal hacen su trabajo) + mejor tasa de conversión (los bullets y el A+ hacen el cierre) = menos gasto publicitario por venta generada. El CPM en Amazon en 2026 ronda los $0,85-$1,10 — optimizar el orgánico es la palanca con mejor ROI.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white font-medium mb-2">Brand Analytics como guía de optimización</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Si tienes Brand Registry, revisa semanalmente el dashboard de Search Query Performance. Queries con muchas impresiones pero bajo CTR → problema en título o imagen principal. Queries con muchos clics pero bajo Purchase Share → problema en bullets, precio o descripción. Estos son los datos más precisos que puedes tener sobre qué campo está fallando.
              </p>
            </div>
          </section>

          {/* Sección 9 */}
          <section id="multimercado" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">09</span>
              Optimización multi-mercado Europa
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              El 90% de las herramientas de SEO para Amazon están diseñadas para el mercado americano. Los sellers europeos — especialmente los que venden en ES, DE, FR e IT — enfrentan un reto diferente: no solo traducir, sino <strong className="text-white">adaptar el copy a la psicología de compra de cada mercado</strong>.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-orange-400">Mercado</th>
                    <th className="text-left py-3 px-4 text-gray-400">El comprador valora</th>
                    <th className="text-left py-3 px-4 text-gray-400">Enfoque del copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["🇪🇸 Amazon.es", "Precio-calidad, ingredientes naturales, confianza cercana", "Emocional + técnico equilibrado"],
                    ["🇩🇪 Amazon.de", "Especificaciones técnicas, certificaciones, precisión alemana", "Técnico primero. Sin superlativos sin respaldo"],
                    ["🇫🇷 Amazon.fr", "Origen, calidad artesanal, elegancia", "Narrativo, storytelling de marca, origen natural"],
                    ["🇮🇹 Amazon.it", "Diseño, bienestar holístico, naturalidad", "Lifestyle + estética + bienestar"],
                    ["🇬🇧 Amazon.co.uk", "Value for money, practicidad, transparencia", "Directo, claims verificables, humor sutil"],
                    ["🇺🇸 Amazon.com", "Resultados, cantidad/precio, social proof", "FOMO, números grandes, storytelling de resultados"],
                  ].map(([market, values, copy]) => (
                    <tr key={market} className="hover:bg-white/5 transition">
                      <td className="py-3 px-4 font-medium text-white">{market}</td>
                      <td className="py-3 px-4 text-gray-400">{values}</td>
                      <td className="py-3 px-4 text-gray-300">{copy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Compliance por mercado: lo que no puedes ignorar</h3>
            <div className="space-y-2 mb-6">
              {[
                { market: "🇩🇪 Alemania", note: "El más estricto. La palabra 'gesund' (saludable) requiere base científica verificable. Sin superlativos sin respaldo." },
                { market: "🇫🇷 Francia", note: "'Complément alimentaire' es obligatorio en suplementos. Evitar claims médicos directos." },
                { market: "🇮🇹 Italia", note: "'Integratore alimentare' obligatorio en suplementos." },
                { market: "🇪🇸 España", note: "'Complemento alimenticio' si aplica. Prohibido afirmar que 'cura' o 'trata' enfermedades." },
                { market: "🇬🇧 Reino Unido", note: "Post-Brexit: no asumir las mismas regulaciones que la UE. Inglés británico obligatorio." },
                { market: "🇺🇸 EE.UU.", note: "FDA disclaimer obligatorio en suplementos: 'These statements have not been evaluated by the FDA...'", },
              ].map((item) => (
                <div key={item.market} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-sm min-w-[90px] font-medium text-white">{item.market}</span>
                  <span className="text-sm text-gray-400">{item.note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Sección 10 */}
          <section id="keywords" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-orange-400 font-mono text-lg">10</span>
              Investigación de keywords sin Helium 10
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Solo el 22% de las búsquedas en Amazon incluyen un nombre de marca. El 78% restante son búsquedas genéricas donde cualquier producto bien posicionado puede aparecer. Investigar esas keywords no requiere Helium 10 ni Jungle Scout — Amazon te da las herramientas directamente.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {[
                {
                  title: "Amazon Autocomplete",
                  badge: "Gratuito · Ilimitado",
                  desc: "El orden del autocomplete = popularidad relativa. Scrapea variantes a-z de tu seed keyword y obtienes 100-300 keywords reales con volumen implícito.",
                  tip: "Ejemplo: 'omega 3 perros a', 'omega 3 perros b'... hasta z. Repite con variaciones.",
                },
                {
                  title: "Análisis de competidores",
                  badge: "Gratuito · Requiere tiempo",
                  desc: "Keywords en los títulos de tus 10 mejores competidores = las que convierten en tu nicho. Keyword en 7/10 listings = alta demanda.",
                  tip: "Las keywords en posiciones 1-3 del título de la competencia son las más valiosas.",
                },
                {
                  title: "Product Opportunity Explorer",
                  badge: "Gratuito en Seller Central",
                  desc: "Herramienta oficial de Amazon. Da datos de demanda por nicho, tendencias y nivel de competencia. Infrautilizada por el 90% de sellers.",
                  tip: "Usa los 'Related searches' de cada nicho para descubrir keywords no obvias.",
                },
                {
                  title: "Brand Analytics",
                  badge: "Brand Registry requerido",
                  desc: "Search Query Performance: los datos más fiables del mercado. Volumen relativo, CTR, conversión — todo sobre tus productos y categoría.",
                  tip: "El SQFR (Search Query Frequency Rank) es el volumen real de búsqueda en Amazon.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-white">{item.title}</p>
                    <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">{item.badge}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                  <p className="text-xs text-gray-500 border-t border-white/5 pt-2">{item.tip}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4 text-white">Cómo clasificar las keywords que encuentres</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-orange-400">Categoría</th>
                    <th className="text-left py-2 px-3 text-gray-400">Criterio</th>
                    <th className="text-left py-2 px-3 text-gray-400">Destino</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Core", "Término principal de categoría", "Título, posición 1-3"],
                    ["Beneficio", "Lo que el cliente quiere conseguir", "Título + bullet 1-2"],
                    ["Ingrediente", "Compuesto o especificación clave", "Bullets 2-4 + backend"],
                    ["Problema", "Lo que el cliente quiere evitar", "Bullets + backend"],
                    ["Long-tail SEO", "4+ palabras, alta intención, baja competencia", "Backend + descripción"],
                    ["PPC bridge", "Alto volumen, alta competencia", "Campañas PPC exclusivamente"],
                  ].map(([cat, crit, dest]) => (
                    <tr key={cat} className="hover:bg-white/5 transition">
                      <td className="py-2 px-3 text-white font-medium">{cat}</td>
                      <td className="py-2 px-3 text-gray-400">{crit}</td>
                      <td className="py-2 px-3 text-orange-400">{dest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">¿Listo para aplicarlo a tu producto?</h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                ListingMaker aplica automáticamente toda esta metodología — COSMO, Rufus AI, motor semántico y compliance por mercado — para generar tu listing completo en menos de 60 segundos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/create"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition"
                >
                  Crea tu primer listing gratis
                </Link>
                <Link
                  href="/#how-it-works"
                  className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3 rounded-xl transition"
                >
                  Ver cómo funciona
                </Link>
              </div>
              <p className="text-xs text-gray-500 mt-3">Sin tarjeta de crédito. Tu primer listing es completamente gratis.</p>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { getCurrencySymbol } from "@/lib/currency";
import Footer from "@/components/Footer";
import GamifiedLoader from "@/components/GamifiedLoader";

const marketplaces = (t: any) => [
  { code: "us", label: t.create.marketplaces.us },
  { code: "uk", label: t.create.marketplaces.uk },
  { code: "de", label: t.create.marketplaces.de },
  { code: "fr", label: t.create.marketplaces.fr },
  { code: "it", label: t.create.marketplaces.it },
  { code: "es", label: t.create.marketplaces.es },
];

const categories = (t: any): string[] => t.create.categories;

export default function CreatePage() {
  const router = useRouter();
  const { user, profile, isAdmin } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    marketplace: "us",
    category: "",
    price: "",
    competitorListings: "",
    additionalInfo: "",
  });
  const [uploadedPdfs, setUploadedPdfs] = useState<{ name: string; text: string }[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: File[] = [];
      
      for (const file of filesArray) {
        if (file.type === "application/pdf") {
          // Process PDF
          const formDataObj = new FormData();
          formDataObj.append("file", file);
          try {
            const res = await fetch("/api/parse-pdf", {
              method: "POST",
              body: formDataObj,
            });
            const { text, error } = await res.json();
            if (error) throw new Error(error);
            setUploadedPdfs(prev => [...prev, { name: file.name, text }]);
          } catch (err: any) {
            alert("Error parsing PDF: " + err.message);
          }
        } else {
          newImages.push(file);
        }
      }
      
      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file); // Fallback to original
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => resolve(file); // Fallback on error
    });
  };

  const handleSubmit = async () => {
    if (!isAdmin && profile && profile.creditsRemaining <= 0) {
      alert("No credits remaining. Please purchase a plan to continue.");
      router.push("/dashboard");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      const pdfContext = uploadedPdfs.map(p => `[CONTENT FROM PDF: ${p.name}]\n${p.text}`).join("\n\n");
      body.append("data", JSON.stringify({ 
        ...formData, 
        additionalInfo: `${formData.additionalInfo}\n\n${pdfContext}`.trim(),
        userId: user?.uid 
      }));
      
      // Compress images before sending
      const compressedBlobs = await Promise.all(images.map((img) => compressImage(img)));
      compressedBlobs.forEach((blob, i) => {
        const file = new File([blob], images[i].name, { type: "image/jpeg" });
        body.append("images", file);
      });

      const res = await fetch("/api/generate", { method: "POST", body });
      const result = await res.json();

      if (result.error) {
        alert(result.error);
        setLoading(false);
        return;
      }

      sessionStorage.setItem("listing-result", JSON.stringify(result));
      router.push(result.listingId ? `/result?id=${result.listingId}` : "/result");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-[#12121a] text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm transition-all";
  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-[#12121a] text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm cursor-pointer";

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col">
      <GamifiedLoader visible={loading} />
      
      {/* Header */}
      <header className="bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${step >= 1 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-white/5 text-gray-600"}`}>1</span>
            <div className={`w-6 h-0.5 rounded-full transition-all ${step >= 2 ? "bg-orange-500/40" : "bg-white/5"}`} />
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${step >= 2 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-white/5 text-gray-600"}`}>2</span>
            <div className={`w-6 h-0.5 rounded-full transition-all ${step >= 3 ? "bg-orange-500/40" : "bg-white/5"}`} />
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${step >= 3 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-white/5 text-gray-600"}`}>3</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-grow">
        {/* Step 1: Product Info */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.create.step1.title}</h1>
            <p className="text-gray-500 mb-10">{t.create.step1.subtitle}</p>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{t.create.step1.name}</label>
                  <input
                    type="text"
                    placeholder={t.create.step1.namePlaceholder}
                    className={inputClass}
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{t.create.step1.brand}</label>
                  <input
                    type="text"
                    placeholder={t.create.step1.brandPlaceholder}
                    className={inputClass}
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{t.create.step1.marketplace}</label>
                  <select
                    className={selectClass}
                    value={formData.marketplace}
                    onChange={(e) => setFormData({ ...formData, marketplace: e.target.value })}
                  >
                    {marketplaces(t).map((m) => (
                      <option key={m.code} value={m.code}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{t.create.step1.category}</label>
                  <select
                    className={selectClass}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">{t.create.step1.selectCategory}</option>
                    {categories(t).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{t.create.step1.price}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{getCurrencySymbol(formData.marketplace)}</span>
                  <input
                    type="text"
                    placeholder={t.create.step1.pricePlaceholder}
                    className={`${inputClass} !pl-8`}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.productName || !formData.brand || !formData.category}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-white/5 disabled:text-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-[1.01] active:scale-[0.99] mt-4"
              >
                {t.create.step1.next}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.create.step2.title}</h1>
            <p className="text-gray-500 mb-10">
              {t.create.step2.subtitle}
            </p>

            <div
              className="border-2 border-dashed border-white/5 rounded-3xl p-16 text-center hover:border-orange-500/30 transition-all cursor-pointer bg-white/[0.02] group"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-1">{t.create.step2.dropzone}</p>
              <p className="text-xs text-gray-500 tracking-wide uppercase">{t.create.step2.dropzoneHint}</p>
              <input
                id="file-input"
                type="file"
                accept="image/*,application/pdf"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {images.length > 0 && (
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#12121a]">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Product ${i + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-12 pt-8 border-t border-white/5">
              <button
                onClick={() => setStep(1)}
                className="px-8 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition border border-white/5"
              >
                {t.create.step2.back}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={images.length === 0}
                className="flex-grow bg-orange-500 hover:bg-orange-600 disabled:opacity-20 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition shadow-[0_0_20px_rgba(249,115,22,0.2)]"
              >
                {t.create.step2.next}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Magic Generation */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.create.step3.title}</h1>
            <p className="text-gray-500 mb-10">
              {t.create.step3.subtitle}
            </p>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                  {t.create.step3.context}
                </label>
                <textarea
                  rows={6}
                  placeholder={t.create.step3.contextPlaceholder}
                  className={`${inputClass} resize-none`}
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                />
              </div>

              {uploadedPdfs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedPdfs.map((pdf, i) => (
                    <div key={i} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 transition-all hover:bg-green-500/20">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-green-400 truncate max-w-[200px]">{pdf.name}</span>
                      <button 
                        onClick={() => setUploadedPdfs(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-green-500/40 hover:text-green-400 transition-colors ml-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 tracking-tight">{t.create.step3.readyTitle}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t.create.step3.readyDesc}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition border border-white/5"
                >
                  {t.create.step3.back}
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-grow bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {t.create.step3.generate}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

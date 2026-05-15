"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getBrowserFirestore } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { PLANS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    if (!user) return;
    const db = getBrowserFirestore();
    const q = query(
      collection(db, "users", user.uid, "listings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListings(docs);
      setLoadingListings(false);
    }, (error) => {
      console.error("Error fetching listings:", error);
      setLoadingListings(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleBuyPlan = async (plan: string) => {
    if (!user) return;
    setBuyingPlan(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: user.uid }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        setBuyingPlan(null);
        return;
      }
      window.location.href = url;
    } catch {
      alert("Error al procesar el pago. Por favor, inténtalo de nuevo.");
      setBuyingPlan(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-5 h-5 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-400">{t.auth.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] flex flex-col">
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
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-gray-400">
              <span className="font-medium text-white">{isAdmin ? "∞" : (profile?.creditsRemaining || 0)}</span> {t.dashboard.creditsRemaining}
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.dashboard.createListing}
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-white transition"
            >
              {t.dashboard.signOut}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 w-full flex-grow">
        {/* Welcome */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t.dashboard.welcome}{user?.displayName ? `, ${user.displayName}` : ""}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 text-sm">{t.dashboard.activePlan}:</span>
              {profile ? (
                <span className="text-sm font-medium">
                  <span className="text-orange-400 uppercase">{isAdmin ? "ADMIN" : profile.plan}</span>
                  <span className="text-gray-600 mx-2">·</span>
                  <span className="text-white text-lg">{isAdmin ? "∞" : profile.creditsRemaining}</span>
                  <span className="text-gray-500 ml-1">{t.dashboard.creditsRemaining}</span>
                </span>
              ) : (
                <div className="h-4 w-32 bg-white/5 animate-pulse rounded" />
              )}
            </div>
          </div>
        </div>

        {/* Buy More Credits - Integrated Premium Cards */}
        <div className="mb-14">
          <div className="flex flex-col mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">{t.dashboard.needMoreListings}</h2>
            <p className="text-sm text-gray-500">{t.dashboard.oneTimePurchase}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "starter", name: t.pricing.starter, price: "$29", listings: "5 listings", perListing: "$5.80", highlight: false },
              { key: "business", name: t.pricing.business, price: "$79", listings: "25 listings", perListing: "$3.16", highlight: true },
              { key: "agency", name: "Pack 100", price: "$199", listings: "100 listings", perListing: "$1.99", highlight: false }
            ].map((plan) => (
              <div
                key={plan.key}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 border-glow ${
                  plan.highlight
                    ? "bg-[#0a0a10] border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.08)]"
                    : "bg-[#0a0a10] border border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-4 min-h-[24px]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                      {t.pricing.mostPopular}
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white tracking-tighter">{plan.price}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter mt-1">{plan.listings}</div>
                </div>

                <div className="bg-white/[0.03] rounded-xl px-3 py-2 mb-6 flex items-center justify-between border border-white/5">
                  <span className="text-lg font-mono font-bold text-white/90">{plan.perListing}</span>
                  <span className="text-[9px] text-gray-600 uppercase font-bold tracking-tight">{t.pricing.perListingLabel}</span>
                </div>

                <button
                  onClick={() => handleBuyPlan(plan.key)}
                  disabled={buyingPlan !== null}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition relative overflow-hidden ${
                    plan.highlight
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {buyingPlan === plan.key ? t.dashboard.redirecting : `Comprar ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Listings History */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-white tracking-tight flex items-center gap-2">
            {t.dashboard.yourListings}
            <span className="bg-white/5 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{listings.length}</span>
          </h2>
        </div>

        {loadingListings ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl h-40 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <Link 
                key={listing.id} 
                href={`/result?id=${listing.id}`}
                className="bg-[#0a0a10] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 transition group relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/80 bg-orange-500/5 px-2 py-1 rounded-lg border border-orange-500/10">
                    Amazon.{listing.marketplace}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1 line-clamp-2 text-sm group-hover:text-orange-400 transition leading-snug">
                  {listing.productName}
                </h3>
                <p className="text-[11px] text-gray-600 font-medium uppercase tracking-tight">{listing.brand}</p>
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">SEO Score</span>
                      <span className="text-sm font-mono font-bold text-white">{listing.analysis?.seoScore || "--"}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#0a0a10] rounded-3xl border border-white/5 p-16 text-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium mb-8 max-w-xs mx-auto">{t.dashboard.noListings}</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl transition shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95"
            >
              {t.dashboard.createListing}
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

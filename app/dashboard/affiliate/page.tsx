"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AffiliateStats {
  isAffiliate: boolean;
  code?: string;
  referralLink?: string;
  clicks?: number;
  sales?: number;
  earningsTotal?: number;
  earningsPaid?: number;
  recentSales?: Array<{
    userId: string;
    amount: number;
    commission: number;
    date: string;
    plan: string;
    stripeSessionId: string;
    source?: string;
  }>;
}

export default function AffiliateDashboard() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const a = t.affiliate;

  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/affiliate/stats?userId=${user.uid}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));
  }, [user]);

  const copyToClipboard = async (text: string, type: "link" | "code") => {
    await navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-3xl font-bold mb-8">{a.dashTitle}</h1>

        {!stats?.isAffiliate ? (
          /* Not yet an affiliate */
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h2 className="text-xl font-semibold mb-3">{a.notAffiliate}</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">{a.notAffiliateDesc}</p>
            <Link
              href="/affiliate#apply"
              className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors"
            >
              {a.applyNow}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-sm text-gray-400 mb-2">{a.dashReferralLink}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-orange-300 bg-black/30 rounded-lg px-3 py-2 truncate">
                    {stats.referralLink}
                  </code>
                  <button
                    onClick={() => copyToClipboard(stats.referralLink!, "link")}
                    className="px-3 py-2 text-sm bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {copiedLink ? a.dashCopied : a.dashCopy}
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-sm text-gray-400 mb-2">{a.dashPromoCode}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-orange-300 bg-black/30 rounded-lg px-3 py-2 font-bold tracking-widest">
                    {stats.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(stats.code!, "code")}
                    className="px-3 py-2 text-sm bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {copiedCode ? a.dashCopied : a.dashCopy}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: a.dashClicks, value: stats.clicks ?? 0, color: "text-blue-400" },
                { label: a.dashSales, value: stats.sales ?? 0, color: "text-green-400" },
                { label: a.dashPending, value: `€${((stats.earningsTotal ?? 0) - (stats.earningsPaid ?? 0)).toFixed(2)}`, color: "text-orange-400" },
                { label: a.dashPaid, value: `€${(stats.earningsPaid ?? 0).toFixed(2)}`, color: "text-gray-400" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent sales */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">{a.dashRecentSales}</h2>
              {!stats.recentSales || stats.recentSales.length === 0 ? (
                <p className="text-gray-500 text-sm">{a.dashNoSales}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-white/5">
                        <th className="pb-2 pr-4">{a.dashDate}</th>
                        <th className="pb-2 pr-4">{a.dashPlan}</th>
                        <th className="pb-2 pr-4">{a.dashCommission}</th>
                        <th className="pb-2">{a.dashStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats.recentSales.map((sale, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-4 text-gray-400">
                            {new Date(sale.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4 capitalize">{sale.plan}</td>
                          <td className="py-3 pr-4 text-green-400 font-medium">€{sale.commission.toFixed(2)}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
                              {a.dashPendingBadge}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

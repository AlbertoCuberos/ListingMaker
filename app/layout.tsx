import type { Metadata } from "next";
import { DM_Sans, Syne, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n/provider";
import AuthModal from "@/components/AuthModal";
import DynamicSEO from "@/components/DynamicSEO";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ListingMaker — Create Amazon Listings That Sell. In 5 Minutes.",
  description:
    "The only tool you need to create professional Amazon listings. No subscriptions. Upload your product photos, paste competitor listings, and get a fully optimized listing in under 5 minutes.",
  keywords:
    "amazon listing, amazon listing tool, amazon seller tools, create amazon listing, optimize amazon listing, amazon SEO",
  openGraph: {
    title: "ListingMaker — Create Amazon Listings That Sell",
    description:
      "No subscriptions. No bloated suites. Just professional Amazon listings in 5 minutes.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${instrumentSerif.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-[#050508] text-[#e8e8ed] noise" suppressHydrationWarning>
        <I18nProvider>
          <DynamicSEO />
          <AuthProvider>
            <AuthModal />
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

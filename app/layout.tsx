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

const BASE_URL = "https://listingmaker.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ListingMaker — Amazon Listings That Sell. In 60 Seconds.",
    template: "%s | ListingMaker",
  },
  description:
    "Create fully optimized Amazon listings in 60 seconds. AI-powered title, bullets, backend keywords and A+ brief — optimized for COSMO algorithm + Rufus AI. No subscriptions.",
  keywords: [
    "amazon listing generator",
    "amazon listing optimization",
    "amazon SEO tool",
    "create amazon listing AI",
    "optimize amazon listing",
    "amazon seller tools",
    "amazon listing maker",
    "COSMO amazon algorithm",
    "Rufus AI amazon",
    "amazon keywords tool",
    "listing amazon españa",
    "herramienta listing amazon",
  ],
  authors: [{ name: "ListingMaker", url: BASE_URL }],
  creator: "ListingMaker",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "ListingMaker",
    title: "ListingMaker — Amazon Listings That Sell. In 60 Seconds.",
    description:
      "AI-powered Amazon listing generator. Optimized for COSMO + Rufus AI. No subscriptions — pay per listing. 6 markets.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ListingMaker — Create Amazon Listings That Sell",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ListingMaker — Amazon Listings That Sell. In 60 Seconds.",
    description:
      "AI-powered Amazon listing generator. Optimized for COSMO + Rufus AI. No subscriptions.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
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

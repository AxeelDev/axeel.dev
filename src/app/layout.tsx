import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { siteUrl } from "@/lib/env";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import "./globals.css";

const ICON_VERSION = 2;

// Self-hosted at build time and preloaded; the size-matched fallbacks keep text from jumping when the real fonts arrive.
// Only the Latin files are preloaded; Latin Extended (š, ž) still loads on demand when a page uses those letters.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    metadataBase: siteUrl(),
    title: { default: t.meta.title, template: "%s · Axel" },
    description: t.meta.description,
    // Bump ICON_VERSION after replacing the icon files; browsers cache favicons separately and ignore normal HTTP caching.
    icons: {
      icon: [{ url: `/favicon.ico?v=${ICON_VERSION}`, sizes: "48x48" }, { url: `/favicon.svg?v=${ICON_VERSION}`, type: "image/svg+xml" }, { url: `/favicon-32.png?v=${ICON_VERSION}`, sizes: "32x32", type: "image/png" }, { url: `/icon-192.png?v=${ICON_VERSION}`, sizes: "192x192", type: "image/png" }, { url: `/icon-512.png?v=${ICON_VERSION}`, sizes: "512x512", type: "image/png" }],
      apple: [{ url: `/apple-touch-icon.png?v=${ICON_VERSION}`, sizes: "180x180" }],
    },
  };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang={await getLocale()} className={`${inter.variable} ${dmSans.variable} ${plexMono.variable}`} suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}

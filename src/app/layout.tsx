import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const ICON_VERSION = 2;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "Axel Püss — developer", template: "%s · Axel" },
  description: "A developer in Estonia. Websites, tools, game experiments, and notes along the way.",
  // Bump ICON_VERSION after replacing the icon files; browsers cache favicons separately and ignore normal HTTP caching.
  icons: {
    icon: [{ url: `/favicon.ico?v=${ICON_VERSION}`, sizes: "48x48" }, { url: `/favicon.svg?v=${ICON_VERSION}`, type: "image/svg+xml" }, { url: `/favicon-32.png?v=${ICON_VERSION}`, sizes: "32x32", type: "image/png" }, { url: `/icon-192.png?v=${ICON_VERSION}`, sizes: "192x192", type: "image/png" }, { url: `/icon-512.png?v=${ICON_VERSION}`, sizes: "512x512", type: "image/png" }],
    apple: [{ url: `/apple-touch-icon.png?v=${ICON_VERSION}`, sizes: "180x180" }],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}

import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { siteUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "Axel Püss — developer", template: "%s · Axel" },
  description: "A developer in Estonia. Websites, tools, game experiments, and notes along the way.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}

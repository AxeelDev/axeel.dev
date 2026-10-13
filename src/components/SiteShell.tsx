import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSettings } from "@/features/content/repository";
import { Header } from "./Header";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <div className="landscape"><a className="skip-link" href="#main">Skip to content</a><div className="sheet">
    <Header />
    <main id="main" className="main-content">{children}</main>
    <footer className="site-footer">
      <p className="footer-call">Building something, or just want to <em>talk shop</em>?</p>
      <div className="footer-row">
        <div className="socials">
          {settings.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14} aria-hidden="true" /></a>}
          {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noreferrer">X / Twitter<ArrowUpRight size={14} aria-hidden="true" /></a>}
        </div>
        <span className="signoff">{settings.name}<span>Made in {settings.location}.</span></span>
      </div>
    </footer>
    <div className="colophon"><span>Next.js, Supabase &amp; Cloudflare. Drawings made in code.</span><Link href="/admin">Editor</Link></div>
  </div></div>;
}

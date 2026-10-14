import Link from "next/link";
import { preload } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { getSettings } from "@/features/content/repository";
import { Header } from "./Header";
import { LocalTime } from "./LocalTime";
import { ContactForm } from "@/features/contact/ContactForm";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  preload("/forest.webp", { as: "image", fetchPriority: "high" });
  const settings = await getSettings();
  return <div className="landscape"><a className="skip-link" href="#main">Skip to content</a><div className="sheet">
    <Header />
    <main id="main" className="main-content">{children}</main>
    <footer className="site-footer" id="contact">
      <p className="footer-call">Building something, or just want to <em>talk shop</em>?</p>
      <ContactForm />
      <div className="footer-row">
        <div className="socials">
          {settings.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14} aria-hidden="true" /></a>}
          {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noreferrer">X / Twitter<ArrowUpRight size={14} aria-hidden="true" /></a>}
        </div>
        <span className="signoff">{settings.name}<span>{settings.location}, <LocalTime /> right now.</span></span>
      </div>
    </footer>
    <div className="colophon"><span>Next.js, Supabase &amp; Cloudflare.</span><Link href="/admin">Editor</Link></div>
  </div></div>;
}

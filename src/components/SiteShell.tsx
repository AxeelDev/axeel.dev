import Link from "next/link";
import { preload } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { getSettings } from "@/features/content/repository";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fill } from "@/lib/i18n/config";
import { Header } from "./Header";
import { LocalTime } from "./LocalTime";
import { ContactForm } from "@/features/contact/ContactForm";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  preload("/forest.webp", { as: "image", fetchPriority: "high" });
  const [settings, t, locale] = await Promise.all([getSettings(), getDictionary(), getLocale()]);
  const [callBefore, callAfter] = t.shell.call.split("{em}");
  const [timeBefore, timeAfter] = fill(t.shell.localTime, { location: settings.location }).split("{time}");
  return <div className="landscape"><a className="skip-link" href="#main">{t.shell.skip}</a><div className="sheet">
    <Header locale={locale} labels={{ ...t.nav, theme: t.theme }} />
    <main id="main" className="main-content">{children}</main>
    <footer className="site-footer" id="contact">
      <p className="footer-call">{callBefore}<em>{t.shell.callEm}</em>{callAfter}</p>
      <ContactForm labels={{ message: t.contact.message, placeholder: t.contact.placeholder, email: t.contact.email, send: t.contact.send, sending: t.contact.sending }} />
      <div className="footer-row">
        <div className="socials">
          {settings.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14} aria-hidden="true" /></a>}
          {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noreferrer">X / Twitter<ArrowUpRight size={14} aria-hidden="true" /></a>}
        </div>
        <span className="signoff">{settings.name}<span>{timeBefore}<LocalTime />{timeAfter}</span></span>
      </div>
    </footer>
    <div className="colophon"><span>{t.shell.colophon}</span><Link href="/admin">{t.shell.editor}</Link></div>
  </div></div>;
}

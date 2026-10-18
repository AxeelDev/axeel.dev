import Link from "next/link";
import { preload } from "react-dom";
import { Clock } from "lucide-react";
import { getSettings } from "@/features/content/repository";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fill } from "@/lib/i18n/config";
import { Header } from "./Header";
import { BrandIcon } from "./BrandIcon";
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
      <div className="contact-intro">
        <p className="footer-call">{callBefore}<em>{t.shell.callEm}</em>{callAfter}</p>
        <p className="contact-note">{t.shell.callNote}</p>
      </div>
      <div className="contact-main">
        <ContactForm labels={{ message: t.contact.message, placeholder: t.contact.placeholder, email: t.contact.email, send: t.contact.send, sending: t.contact.sending }} />
        <div className="contact-meta">
          <span className="contact-time"><Clock size={15} aria-hidden="true" /><span className="sr-only">{t.shell.timeLabel}: </span>{timeBefore}<LocalTime />{timeAfter}</span>
          <span className="socials">
            {settings.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer"><BrandIcon name="github" />GitHub</a>}
            {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noreferrer"><BrandIcon name="x" />X</a>}
          </span>
        </div>
      </div>
    </footer>
    <div className="colophon"><span>{t.shell.colophon}</span><Link href="/admin">{t.shell.editor}</Link></div>
  </div></div>;
}

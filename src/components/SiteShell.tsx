import Link from "next/link";
import { Clock } from "lucide-react";
import { getSettings } from "@/features/content/repository";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fill } from "@/lib/i18n/config";
import { Header } from "./Header";
import { BrandIcon } from "./BrandIcon";
import { LocalTime } from "./LocalTime";
import { ContactForm } from "@/features/contact/ContactForm";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [settings, t, locale] = await Promise.all([getSettings(), getDictionary(), getLocale()]);
  const [callBefore, callAfter] = t.shell.call.split("{em}");
  const [timeBefore, timeAfter] = fill(t.shell.localTime, { location: settings.location }).split("{time}");
  return <div className="landscape">
    {/* The forest and this screen size's paper edges, fetched with the page instead of after the stylesheet asks for them. React hoists these into <head>. */}
    <link rel="preload" as="image" href="/forest.webp" fetchPriority="high" />
    {[["left", "right", "(min-width: 601px)"], ["top", "bottom", "(max-width: 600px)"]].flatMap(([a, b, media]) => [a, b].flatMap((side) => [
      <link key={`edge-${side}`} rel="preload" as="image" href={`/paper-edge-${side}.svg`} media={media} />,
      <link key={`rim-${side}`} rel="preload" as="image" href={`/paper-rim-${side}.svg`} media={media} />,
    ]))}
    <a className="skip-link" href="#main">{t.shell.skip}</a><div className="paper"><div className="sheet">
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
          <span className="contact-time"><Clock size={15} aria-hidden="true" /><span><span className="sr-only">{t.shell.timeLabel}: </span>{timeBefore}<LocalTime />{timeAfter}</span></span>
          <span className="socials">
            {settings.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer"><BrandIcon name="github" />GitHub</a>}
            {settings.twitter_url && <a href={settings.twitter_url} target="_blank" rel="noreferrer"><BrandIcon name="x" />X</a>}
          </span>
        </div>
      </div>
    </footer>
    <div className="colophon"><span>{t.shell.colophon}</span><Link href="/admin">{t.shell.editor}</Link></div>
  </div></div></div>;
}

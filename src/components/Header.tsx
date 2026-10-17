"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { ThemeToggle, type ThemeLabels } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type HeaderLabels = { home: string; main: string; work: string; writing: string; uses: string; language: string; theme: ThemeLabels };

export function Header({ locale, labels }: { locale: Locale; labels: HeaderLabels }) {
  const path = usePathname();
  return <header className="site-header">
    <Link prefetch className="wordmark" href="/" aria-label={labels.home}>ax<span>.</span></Link>
    <nav aria-label={labels.main}>
      {[['/projects', labels.work], ['/blog', labels.writing], ['/uses', labels.uses]].map(([href, label]) => <Link prefetch href={href} key={href} aria-current={path.startsWith(href) ? "page" : undefined}>{label}</Link>)}
      <LanguageSwitcher locale={locale} label={labels.language} />
      <ThemeToggle labels={labels.theme} />
    </nav>
  </header>;
}

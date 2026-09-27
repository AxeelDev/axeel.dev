"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const path = usePathname();
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="Axel, home">ax<span>.</span></Link>
    <nav aria-label="Main navigation">
      {[['/projects','Work'],['/blog','Writing'],['/uses','Uses']].map(([href,label]) => <Link href={href} key={href} aria-current={path.startsWith(href) ? "page" : undefined}>{label}</Link>)}
      <ThemeToggle />
    </nav>
  </header>;
}

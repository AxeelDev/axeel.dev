"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { useEffect, useState, type MouseEvent } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [changing, setChanging] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme === "dark";
  async function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (changing) return;
    const next = dark ? "light" : "dark";
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) { setTheme(next); return; }
    const box = event.currentTarget.getBoundingClientRect();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    setChanging(true);
    try {
      const transition = document.startViewTransition(() => { flushSync(() => setTheme(next)); });
      await transition.ready;
      await document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, {
        duration: 460, easing: "cubic-bezier(.22,.68,0,1)", pseudoElement: "::view-transition-new(root)",
      }).finished;
    } catch { setTheme(next); }
    finally { setChanging(false); }
  }
  return <button type="button" className="theme-toggle" onClick={toggle} disabled={!mounted || changing} aria-label={mounted ? `Switch to ${dark ? "light" : "dark"} theme` : "Change colour theme"} title="Change colour theme">
    <Sun className="theme-sun" size={18} aria-hidden="true" /><Moon className="theme-moon" size={18} aria-hidden="true" />
  </button>;
}

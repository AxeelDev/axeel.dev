"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [arrival, setArrival] = useState(false);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!sessionStorage.getItem("axel-arrived") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setArrival(true);
        sessionStorage.setItem("axel-arrived", "1");
        timeout = setTimeout(() => setArrival(false), 800);
      }
    } catch { /* The site still works when storage is disabled. */ }
    return () => { if (timeout) clearTimeout(timeout); };
  }, []);
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <div className={arrival ? "arrival" : undefined}>{children}</div>
  </ThemeProvider>;
}

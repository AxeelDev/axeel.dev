"use client";
import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Tallinn" });

// Rendered after hydration only, so the server and the visitor's clock never disagree.
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <time className="local-time" suppressHydrationWarning>{time ?? "--:--"}</time>;
}

"use client";
import { useEffect, useState } from "react";

// Error pages can't load the dictionaries, so they carry their own few lines and follow the page's lang attribute.
const text = {
  en: { title: "This page couldn’t load.", body: "Please try again in a moment.", retry: "Try again", home: "Go home" },
  et: { title: "Seda lehte ei õnnestunud laadida.", body: "Palun proovi hetke pärast uuesti.", retry: "Proovi uuesti", home: "Avalehele" },
  de: { title: "Diese Seite konnte nicht geladen werden.", body: "Bitte versuch es gleich noch einmal.", retry: "Erneut versuchen", home: "Zur Startseite" },
};
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [t, setT] = useState(text.en);
  useEffect(() => { const lang = document.documentElement.lang; if (lang === "et" || lang === "de") setT(text[lang]); }, []);
  return <main className="standalone-message"><h1>{t.title}</h1><p>{t.body}</p><button type="button" className="button" onClick={reset}>{t.retry}</button><a href="/">{t.home}</a></main>;
}

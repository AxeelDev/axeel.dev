"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, localeNames, locales, type Locale } from "@/lib/i18n/config";

// Saves the choice in a cookie, so it outranks the device language on every page from now on.
// The refresh re-renders the page and drops every page the router had cached in the old language.
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const [value, setValue] = useState(locale), [pending, startTransition] = useTransition();
  useEffect(() => setValue(locale), [locale]);
  return <select className="lang-switch" aria-label={label} title={label} value={value} disabled={pending} onChange={(event) => {
    const next = event.target.value as Locale;
    setValue(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
    startTransition(() => router.refresh());
  }}>
    {locales.map((code) => <option key={code} value={code} lang={code} title={localeNames[code]}>{code.toUpperCase()}</option>)}
  </select>;
}

// Shared by the server and the language switcher, so it holds no strings beyond the language names.
export const locales = ["en", "et", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const translatedLocales = ["et", "de"] as const satisfies readonly Locale[];
export type TranslatedLocale = (typeof translatedLocales)[number];

// A visitor's own choice. Without it, the device language decides on every request, so pages never disagree.
export const LOCALE_COOKIE = "lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeNames: Record<Locale, string> = { en: "English", et: "Eesti", de: "Deutsch" };
export const intlLocale: Record<Locale, string> = { en: "en-GB", et: "et-EE", de: "de-DE" };

export const isLocale = (value: unknown): value is Locale => typeof value === "string" && (locales as readonly string[]).includes(value);

// Picks Estonian or German only when the device prefers it over English; anything else stays English.
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  const preferred = header.split(",").map((part, index) => {
    const [tag, ...params] = part.trim().split(";");
    const q = Number(params.find((param) => param.trim().startsWith("q="))?.trim().slice(2) ?? 1);
    return { language: tag.trim().toLowerCase().split("-")[0], q: Number.isFinite(q) ? q : 0, index };
  }).filter((entry) => entry.q > 0).sort((a, b) => b.q - a.q || a.index - b.index);
  const match = preferred.find((entry) => isLocale(entry.language));
  return match ? (match.language as Locale) : defaultLocale;
}

// The {name}-style placeholders used in the dictionaries.
export const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (whole, key: string) => key in values ? String(values[key]) : whole);

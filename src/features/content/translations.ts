import { z } from "zod";
import { translatedLocales, type Locale } from "@/lib/i18n/config";
import type { Collection } from "./types";

// Fields that can have an Estonian and German version, with the same limits as the English ones.
// gallery_alts holds one screenshot description per line, in the same order as the gallery.
export const translationLimits = {
  projects: { title: 120, summary: 280, category: 80, period: 40, thumbnail_alt: 300, gallery_alts: 12 * 301, body: 200000, lessons: 5000 },
  posts: { title: 120, excerpt: 320, cover_alt: 300, body: 200000 },
  tools: { notes: 280 },
  "tool-groups": { label: 80, description: 280 },
  settings: { location: 100, headline: 280, introduction: 1000, about: 10000 },
} satisfies Record<Collection, Record<string, number>>;

export type TranslationFields = Partial<Record<string, string>>;
// { et: { title: "…" }, de: { … } }. A missing or empty field shows the English text.
export type Translations = Partial<Record<(typeof translatedLocales)[number], TranslationFields>>;

export const isTranslatable = (collection: Collection, key: string) => key in translationLimits[collection];

// Empty fields and languages are dropped, so the stored JSON only holds real translations.
export function translationSchema(collection: Collection) {
  const fields = z.object(Object.fromEntries(Object.entries(translationLimits[collection]).map(([key, max]) => [key, z.string().max(max, `Keep it under ${max} characters.`).optional()]))).strict();
  return z.object(Object.fromEntries(translatedLocales.map((locale) => [locale, fields.optional()]))).strict().default({}).transform((value) => {
    const clean: Translations = {};
    for (const locale of translatedLocales) {
      const entries = Object.entries((value as Translations)[locale] ?? {}).filter(([, text]) => typeof text === "string" && text.trim());
      if (entries.length) clean[locale] = Object.fromEntries(entries);
    }
    return clean;
  });
}

// The record as a visitor in this language should see it. Records from before the translation migration have no translations.
export function localize<T extends { translations?: Translations | null }>(record: T, locale: Locale): T {
  const fields = locale === "en" ? undefined : record.translations?.[locale];
  if (!fields) return record;
  const result: Record<string, unknown> = { ...record };
  for (const [key, text] of Object.entries(fields)) {
    if (!text?.trim()) continue;
    if (key === "gallery_alts" && Array.isArray(result.gallery)) {
      const alts = text.split("\n");
      result.gallery = (result.gallery as { src: string; alt: string }[]).map((image, index) => alts[index]?.trim() ? { ...image, alt: alts[index].trim() } : image);
    } else if (typeof result[key] === "string") result[key] = text;
  }
  return result as T;
}

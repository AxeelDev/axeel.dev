import { intlLocale, fill, type Locale } from "@/lib/i18n/config";

export function formatDate(value: string | null, locale: Locale = "en", draft = "Draft") {
  if (!value) return draft;
  return new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Tallinn" }).format(new Date(value));
}
export function readingTime(markdown: string, template = "{n} min read") {
  return fill(template, { n: Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 220)) });
}
export function pageNumber(value: string | string[] | undefined) {
  const n = typeof value === "string" ? Number(value) : 1;
  return Number.isSafeInteger(n) && n > 0 ? Math.min(n, 10000) : 1;
}

export function formatDate(value: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Tallinn" }).format(new Date(value));
}
export function readingTime(markdown: string) {
  return `${Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 220))} min read`;
}
export function pageNumber(value: string | string[] | undefined) {
  const n = typeof value === "string" ? Number(value) : 1;
  return Number.isSafeInteger(n) && n > 0 ? Math.min(n, 10000) : 1;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured. See .env.example and docs/SETUP.md.");
  const parsed = new URL(url);
  if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("Invalid Supabase URL.");
  if (key.startsWith("sb_secret_")) throw new Error("Use a Supabase publishable key, never a secret key.");
  return { url, key };
}

export function contentSource(): "demo" | "supabase" {
  const source = process.env.CONTENT_SOURCE;
  if (source === "demo") return "demo";
  if (source === "supabase" || isSupabaseConfigured()) { getSupabaseEnv(); return "supabase"; }
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") return "demo";
  throw new Error("Set CONTENT_SOURCE=supabase and configure Supabase, or explicitly choose CONTENT_SOURCE=demo.");
}

export function siteUrl() {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
}

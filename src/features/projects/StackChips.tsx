"use client";
import { useEffect, useState } from "react";

// Tool names as they appear in project stacks, mapped to the locally generated Simple Icons.
const icons: Record<string, string> = {
  "Next.js": "nextdotjs", React: "react", TypeScript: "typescript", Astro: "astro", "Tailwind CSS": "tailwindcss",
  Supabase: "supabase", PostgreSQL: "postgresql", Postgres: "postgresql", Drizzle: "drizzle", "Better Auth": "betterauth",
  Stripe: "stripe", Cloudflare: "cloudflare", Vercel: "vercel", Resend: "resend", Godot: "godotengine",
  "Unreal Engine 5": "unrealengine", "Unreal Engine": "unrealengine", "C++": "cplusplus",
  HTML: "html5", CSS: "css", JavaScript: "javascript", Python: "python",
};

type CatalogueIcon = { title: string; slug: string };
const exact = (text: string) => text.trim().toLowerCase();
const loose = (text: string) => exact(text).replace(/[^a-z0-9]/g, "");
// Fetched once per page, and only when some stack item has no built-in logo.
let catalogue: Promise<Map<string, string>> | null = null;
function loadCatalogue() {
  catalogue ??= fetch("/icons/catalogue.json").then((response) => response.ok ? response.json() as Promise<CatalogueIcon[]> : []).then((list) => {
    const bySlug = new Map<string, string>();
    // Exact titles win over slugs, which win over punctuation-free titles ("NextJS" → Next.js).
    for (const icon of list) if (loose(icon.title).length >= 3) bySlug.set(`~${loose(icon.title)}`, icon.slug);
    for (const icon of list) bySlug.set(`#${icon.slug}`, icon.slug);
    for (const icon of list) bySlug.set(`=${exact(icon.title)}`, icon.slug);
    return bySlug;
  }).catch(() => new Map());
  return catalogue;
}
const fromCatalogue = (map: Map<string, string>, name: string) =>
  map.get(`=${exact(name)}`) ?? map.get(`#${loose(name)}`) ?? (loose(name).length >= 3 ? map.get(`~${loose(name)}`) : undefined);

// Logo order: built-in mapping, then the icon library, then the matching tool from your own list, then the initial.
export function StackChips({ items, ownIcons = {} }: { items: string[]; ownIcons?: Record<string, string> }) {
  const [library, setLibrary] = useState<Record<string, string>>({});
  const missing = items.filter((item) => !icons[item]);
  const missingKey = missing.join("|");
  useEffect(() => {
    if (!missingKey) return;
    let live = true;
    loadCatalogue().then((map) => { if (live) setLibrary(Object.fromEntries(missingKey.split("|").flatMap((item) => { const slug = fromCatalogue(map, item); return slug ? [[item, `/icons/${slug}.svg`]] : []; }))); });
    return () => { live = false; };
  }, [missingKey]);
  return <ul className="stack-chips">{items.map((item) => {
    const src = icons[item] ? `/icons/${icons[item]}.svg` : library[item] ?? ownIcons[exact(item)];
    return <li key={item}><span className="tool-icon" aria-hidden="true">{src ? <img src={src} alt="" width={15} height={15} loading="lazy" /> : <span>{item.slice(0, 1)}</span>}</span>{item}</li>;
  })}</ul>;
}

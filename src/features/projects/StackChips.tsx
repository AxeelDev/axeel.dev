"use client";
import { useEffect, useState } from "react";
import { stackIcons, type StackTool } from "./stackIcons";

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
// A chip links to that tool's website when your list has one.
export function StackChips({ items, tools = {} }: { items: string[]; tools?: Record<string, StackTool> }) {
  const [library, setLibrary] = useState<Record<string, string>>({});
  const missingKey = items.filter((item) => !stackIcons[item]).join("|");
  useEffect(() => {
    if (!missingKey) return;
    let live = true;
    loadCatalogue().then((map) => { if (live) setLibrary(Object.fromEntries(missingKey.split("|").flatMap((item) => { const slug = fromCatalogue(map, item); return slug ? [[item, `/icons/${slug}.svg`]] : []; }))); });
    return () => { live = false; };
  }, [missingKey]);
  return <ul className="stack-chips">{items.map((item) => {
    const src = stackIcons[item] ? `/icons/${stackIcons[item]}.svg` : library[item] ?? tools[item]?.icon, url = tools[item]?.url;
    const contents = <><span className="tool-icon" aria-hidden="true">{src ? <img src={src} alt="" width={15} height={15} loading="lazy" /> : <span>{item.slice(0, 1)}</span>}</span>{item}</>;
    return <li key={item}>{url ? <a href={url} target="_blank" rel="noreferrer">{contents}</a> : contents}</li>;
  })}</ul>;
}

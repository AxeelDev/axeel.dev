"use client";
import { useEffect, useState } from "react";
type Icon = { title: string; slug: string };

export function IconPicker({ id, value, onChange }: { id: string; value: string | null; onChange: (value: string | null) => void }) {
  const [query, setQuery] = useState(""), [icons, setIcons] = useState<Icon[]>([]), [error, setError] = useState(false);
  useEffect(() => { const controller = new AbortController(); fetch("/icons/catalogue.json", { signal: controller.signal }).then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then(setIcons).catch((error) => { if (error.name !== "AbortError") setError(true); }); return () => controller.abort(); }, []);
  const matches = query.trim() ? icons.filter((icon) => `${icon.title} ${icon.slug}`.toLowerCase().includes(query.toLowerCase())).slice(0, 20) : [];
  return <div>{value && <div className="icon-selected"><img src={`/icons/${value}.svg`} alt="" /><span>{value}</span><button className="button" type="button" onClick={() => onChange(null)}>Remove</button></div>}
    <input id={id} className="icon-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the icon catalogue…" autoComplete="off" />
    <div className="icon-options">{matches.map((icon) => <button type="button" key={icon.slug} onClick={() => { onChange(icon.slug); setQuery(""); }}><img src={`/icons/${icon.slug}.svg`} alt="" />{icon.title}</button>)}</div>
    <small>{error ? "The catalogue could not load. You can still use a custom icon below." : query && !matches.length ? "No matching icon. Use a custom image below or keep the initial." : "Simple Icons, served locally. A catalogue icon is optional."}</small>
  </div>;
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { resourceConfig } from "./config";
export function AdminNav() { const path = usePathname(); return <nav className="admin-nav" aria-label="Editor sections">{Object.entries(resourceConfig).map(([key, value]) => <Link key={key} href={`/admin/${key}`} aria-current={path.startsWith(`/admin/${key}`) ? "page" : undefined}>{value.title}</Link>)}</nav>; }

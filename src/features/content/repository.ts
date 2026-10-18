import "server-only";
import { cache } from "react";
import { contentSource } from "@/lib/env";
import { getLocale } from "@/lib/i18n/server";
import { publicClient } from "@/lib/supabase/server";
import { stackIcons, type StackTool } from "@/features/projects/stackIcons";
import { demoGroups, demoPosts, demoProjects, demoSettings, demoTools } from "./demo";
import { localize } from "./translations";
import type { Post, Project, ToolGroupWithTools } from "./types";

function check(error: { message: string } | null, label: string) {
  if (error) { console.error(`Content read failed: ${label}`, error.message); throw new Error("Content is temporarily unavailable."); }
}

// Public content changes rarely, so each server instance keeps it for a short while.
// That keeps prefetches and page loads from waiting on the database. Editor saves clear it.
// Rows are kept in every language at once; each getter below picks the visitor's language.
const TTL = 60_000;
const remembered = new Map<string, { at: number; value: unknown }>();
async function remember<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = remembered.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  const value = await load();
  remembered.set(key, { at: Date.now(), value });
  return value;
}
export function forgetContent() { remembered.clear(); }

// Databases from before the listing/period and translation migrations still render.
const withDefaults = (project: Project): Project => ({ ...project, listing: project.listing ?? "selected", period: project.period ?? "", gallery: project.gallery ?? [], lessons: project.lessons ?? "", translations: project.translations ?? {} });

const loadSettings = () => contentSource() === "demo" ? Promise.resolve(demoSettings) : remember("settings", async () => {
  const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).single();
  check(error, "settings");
  if (!data) throw new Error("Site settings are missing. Apply the seed.");
  return data;
});
export const getSettings = cache(async () => localize(await loadSettings(), await getLocale()));

const loadProjects = () => contentSource() === "demo" ? Promise.resolve(demoProjects) : remember("projects", async () => {
  const { data, error } = await publicClient().from("projects").select("*").eq("published", true).order("sort_order").order("id").limit(100);
  check(error, "projects"); return (data ?? []).map(withDefaults);
});
export const getProjects = cache(async () => { const locale = await getLocale(); return (await loadProjects()).map((project) => localize(project, locale)); });

// Every published project is already in the list, so a project page needs no extra query.
export const getProject = cache(async (slug: string) => (await getProjects()).find((p) => p.slug === slug) ?? null);

export const getPosts = cache(async (page = 1, size = 8) => {
  const offset = (Math.max(1, page) - 1) * size, locale = await getLocale();
  const posts: { items: Post[]; total: number } = contentSource() === "demo" ? { items: demoPosts.slice(offset, offset + size), total: demoPosts.length } : await remember(`posts:${offset}:${size}`, async () => {
    const { data, error, count } = await publicClient().from("posts").select("*", { count: "exact" })
      .eq("published", true).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).order("id").range(offset, offset + size - 1);
    check(error, "posts"); return { items: data ?? [], total: count ?? 0 };
  });
  return { ...posts, items: posts.items.map((post) => localize(post, locale)) };
});

export const getPost = cache(async (slug: string) => {
  const post = contentSource() === "demo" ? demoPosts.find((p) => p.slug === slug) ?? null : await remember(`post:${slug}`, async () => {
    const { data, error } = await publicClient().from("posts").select("*").eq("slug", slug).eq("published", true).lte("published_at", new Date().toISOString()).maybeSingle();
    check(error, "post"); return data;
  });
  return post && localize(post, await getLocale());
});

type StackRow = { name: string; icon_slug: string | null; icon_url: string | null; url: string | null };
const iconOf = (row: StackRow) => row.icon_url || (row.icon_slug ? `/icons/${row.icon_slug}.svg` : undefined);
// For each stack item, the matching tool from your own list (drafts too): its icon and website.
// A tool matches by name, or by sharing the item's built-in logo ("Unreal Engine 5" → the Unreal Engine tool).
export const getStackTools = cache(async (items: string[]): Promise<Record<string, StackTool>> => {
  const names = [...new Set(items.map((item) => item.trim().toLowerCase()).filter(Boolean))].sort().slice(0, 50);
  const slugs = [...new Set(items.map((item) => stackIcons[item]).filter(Boolean))].sort();
  if (!names.length) return {};
  const rows: StackRow[] = contentSource() === "demo"
    ? demoTools.filter((tool) => names.includes(tool.name.trim().toLowerCase()) || (tool.icon_slug && slugs.includes(tool.icon_slug)))
    : await remember(`stack-tools:${names.join("|")}:${slugs.join("|")}`, async () => {
      const { data, error } = await publicClient().rpc("portfolio_stack_tools", { names, slugs });
      // Before the lookup migration is applied, stacks fall back to plain chips instead of failing the page.
      if (error) { console.error("Content read failed: stack tools", error.message); return []; }
      return data ?? [];
    });
  const exactMatch = (item: string) => rows.find((tool) => tool.name.trim().toLowerCase() === item.trim().toLowerCase()) ?? (stackIcons[item] ? rows.find((tool) => tool.icon_slug === stackIcons[item]) : undefined);
  // Failing that, a published tool from the same family: "Cloudflare" finds "Cloudflare Workers", by its name or its logo (cloudflare → cloudflareworkers).
  const unmatched = items.filter((item) => !exactMatch(item));
  const family: StackRow[] = unmatched.length ? (await getToolGroups()).flatMap((group) => group.tools) : [];
  const familyMatch = (item: string) => {
    const name = item.trim().toLowerCase(), slug = stackIcons[item];
    return family.find((tool) => tool.name.trim().toLowerCase().startsWith(`${name} `)) ?? (slug ? family.find((tool) => tool.icon_slug?.startsWith(slug)) : undefined);
  };
  return Object.fromEntries(items.flatMap((item) => {
    const row = exactMatch(item) ?? familyMatch(item);
    return row ? [[item, { icon: iconOf(row), url: row.url ?? undefined }]] : [];
  }));
});

export const getToolGroups = cache(async (): Promise<ToolGroupWithTools[]> => {
  const locale = await getLocale();
  const groups = contentSource() === "demo" ? demoGroups.map((group) => ({ ...group, tools: demoTools.filter((tool) => tool.group_id === group.id) })) : await remember("tools", async () => {
    const client = publicClient();
    const [groups, tools] = await Promise.all([
      client.from("tool_groups").select("*").eq("published", true).order("sort_order").order("id"),
      client.from("tools").select("*").eq("published", true).order("sort_order").order("id"),
    ]);
    check(groups.error, "tool groups"); check(tools.error, "tools");
    return (groups.data ?? []).map((group) => ({ ...group, tools: (tools.data ?? []).filter((tool) => tool.group_id === group.id) }));
  });
  return groups.map((group) => ({ ...localize(group, locale), tools: group.tools.map((tool) => localize(tool, locale)) }));
});

import "server-only";
import { cache } from "react";
import { contentSource } from "@/lib/env";
import { publicClient } from "@/lib/supabase/server";
import { demoGroups, demoPosts, demoProjects, demoSettings, demoTools } from "./demo";
import type { Project, ToolGroupWithTools } from "./types";

function check(error: { message: string } | null, label: string) {
  if (error) { console.error(`Content read failed: ${label}`, error.message); throw new Error("Content is temporarily unavailable."); }
}

// Public content changes rarely, so each server instance keeps it for a short while.
// That keeps prefetches and page loads from waiting on the database. Editor saves clear it.
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

// Databases from before the listing/period migration still render.
const withDefaults = (project: Project): Project => ({ ...project, listing: project.listing ?? "selected", period: project.period ?? "", gallery: project.gallery ?? [], lessons: project.lessons ?? "" });

export const getSettings = cache(async () => {
  if (contentSource() === "demo") return demoSettings;
  return remember("settings", async () => {
    const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).single();
    check(error, "settings");
    if (!data) throw new Error("Site settings are missing. Apply the seed.");
    return data;
  });
});

export const getProjects = cache(async () => {
  if (contentSource() === "demo") return demoProjects;
  return remember("projects", async () => {
    const { data, error } = await publicClient().from("projects").select("*").eq("published", true).order("sort_order").order("id").limit(100);
    check(error, "projects"); return (data ?? []).map(withDefaults);
  });
});

// Every published project is already in the list, so a project page needs no extra query.
export const getProject = cache(async (slug: string) => (await getProjects()).find((p) => p.slug === slug) ?? null);

export const getPosts = cache(async (page = 1, size = 8) => {
  const offset = (Math.max(1, page) - 1) * size;
  if (contentSource() === "demo") return { items: demoPosts.slice(offset, offset + size), total: demoPosts.length };
  return remember(`posts:${offset}:${size}`, async () => {
    const { data, error, count } = await publicClient().from("posts").select("*", { count: "exact" })
      .eq("published", true).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).order("id").range(offset, offset + size - 1);
    check(error, "posts"); return { items: data ?? [], total: count ?? 0 };
  });
});

export const getPost = cache(async (slug: string) => {
  if (contentSource() === "demo") return demoPosts.find((p) => p.slug === slug) ?? null;
  return remember(`post:${slug}`, async () => {
    const { data, error } = await publicClient().from("posts").select("*").eq("slug", slug).eq("published", true).lte("published_at", new Date().toISOString()).maybeSingle();
    check(error, "post"); return data;
  });
});

export const getToolGroups = cache(async (): Promise<ToolGroupWithTools[]> => {
  if (contentSource() === "demo") return demoGroups.map((group) => ({ ...group, tools: demoTools.filter((tool) => tool.group_id === group.id) }));
  return remember("tools", async () => {
    const client = publicClient();
    const [groups, tools] = await Promise.all([
      client.from("tool_groups").select("*").eq("published", true).order("sort_order").order("id"),
      client.from("tools").select("*").eq("published", true).order("sort_order").order("id"),
    ]);
    check(groups.error, "tool groups"); check(tools.error, "tools");
    return (groups.data ?? []).map((group) => ({ ...group, tools: (tools.data ?? []).filter((tool) => tool.group_id === group.id) }));
  });
});

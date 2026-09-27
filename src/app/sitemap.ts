import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/features/content/repository";
import { siteUrl } from "@/lib/env";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts(1, 1000)]);
  const base = siteUrl();
  return [...["/", "/projects", "/blog", "/uses"].map((path) => ({ url: new URL(path, base).href })),
    ...projects.map((project) => ({ url: new URL(`/projects/${project.slug}`, base).href, lastModified: project.updated_at })),
    ...posts.items.map((post) => ({ url: new URL(`/blog/${post.slug}`, base).href, lastModified: post.updated_at }))];
}

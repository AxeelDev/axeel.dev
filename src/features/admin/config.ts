import type { Collection } from "@/features/content/types";

export type EditorField = {
  key: string; label: string; type?: "text" | "textarea" | "markdown" | "checkbox" | "number" | "image" | "icon" | "datetime" | "list" | "group" | "select" | "url";
  help?: string; wide?: boolean; required?: boolean; options?: string[]; maxLength?: number;
};
const slug: EditorField = { key: "slug", label: "URL slug", required: true, help: "Lowercase words separated by hyphens. Changing this changes the page’s URL.", maxLength: 96 };
const body: EditorField = { key: "body", label: "Writing", type: "markdown", wide: true, help: "Markdown: headings, lists, links, images, tables, and code. Raw HTML is disabled." };
const order: EditorField = { key: "sort_order", label: "Order", type: "number", help: "Lower numbers appear first." };
const published: EditorField = { key: "published", label: "Published", type: "checkbox" };
export const resourceConfig: Record<Collection, { title: string; singular: string; table: "projects" | "posts" | "tools" | "tool_groups" | "site_settings"; fields: EditorField[]; defaults: Record<string, unknown> }> = {
  projects: { title: "Projects", singular: "project", table: "projects", fields: [
    { key: "title", label: "Project name", required: true, maxLength: 120 }, slug,
    { key: "summary", label: "Short description", type: "textarea", wide: true, required: true, maxLength: 280 },
    { key: "thumbnail_url", label: "Thumbnail", type: "image", wide: true, help: "A landscape image works best. Leave it empty for the typographic cover." },
    { key: "thumbnail_alt", label: "Thumbnail description", wide: true, maxLength: 300 },
    { key: "category", label: "Category", required: true, maxLength: 80 },
    { key: "status", label: "Status", type: "select", options: ["active", "experiment", "archived"] },
    { key: "stack", label: "Tools or topics", type: "list", help: "Separate with commas. Up to 20 items." }, order,
    { key: "website_url", label: "Website", type: "url" }, { key: "source_url", label: "Source code", type: "url" }, body,
    { key: "featured", label: "Use the larger featured layout", type: "checkbox" }, published,
  ], defaults: { title: "", slug: "", summary: "", body: "", thumbnail_url: null, thumbnail_alt: "", category: "", status: "active", stack: [], sort_order: 0, website_url: null, source_url: null, featured: false, published: false } },
  posts: { title: "Writing", singular: "post", table: "posts", fields: [
    { key: "title", label: "Title", required: true, maxLength: 120 }, slug,
    { key: "excerpt", label: "Excerpt", type: "textarea", wide: true, required: true, maxLength: 320 },
    { key: "cover_url", label: "Cover image", type: "image", wide: true, help: "Optional. Text-only posts work well too." },
    { key: "cover_alt", label: "Cover description", wide: true, maxLength: 300 }, body,
    { key: "tags", label: "Topics", type: "list", help: "Separate with commas." },
    { key: "published_at", label: "Publication date", type: "datetime", help: "Shown in your local timezone while editing. A future date schedules the post." }, published,
  ], defaults: { title: "", slug: "", excerpt: "", body: "", cover_url: null, cover_alt: "", tags: [], published_at: null, published: false } },
  tools: { title: "Tools", singular: "tool", table: "tools", fields: [
    { key: "name", label: "Tool or application name", required: true, maxLength: 80 },
    { key: "group_id", label: "Group", type: "group", required: true },
    { key: "url", label: "Website", type: "url", help: "Optional. A tool can exist without a public website." }, order,
    { key: "icon_slug", label: "Catalogue icon", type: "icon", wide: true },
    { key: "icon_url", label: "Custom icon", type: "image", wide: true, help: "Overrides the catalogue icon. Any tool is supported; without an icon, its initial is used." },
    { key: "notes", label: "Short note", type: "textarea", wide: true, maxLength: 280 }, published,
  ], defaults: { name: "", group_id: "", url: null, icon_slug: null, icon_url: null, notes: "", sort_order: 0, published: false } },
  "tool-groups": { title: "Tool groups", singular: "group", table: "tool_groups", fields: [
    { key: "label", label: "Group label", required: true, help: "For example: Building with, Working in, On my desk.", maxLength: 80 }, order,
    { key: "description", label: "Description", type: "textarea", wide: true, maxLength: 280 }, published,
  ], defaults: { label: "", description: "", sort_order: 0, published: false } },
  settings: { title: "Profile", singular: "profile", table: "site_settings", fields: [
    { key: "name", label: "Full name", required: true, maxLength: 120 }, { key: "first_name", label: "First name", required: true, maxLength: 60 },
    { key: "location", label: "Location", required: true, maxLength: 100 },
    { key: "headline", label: "Introduction headline", required: true, maxLength: 280 },
    { key: "introduction", label: "Introduction", type: "textarea", wide: true, maxLength: 1000 },
    { key: "about", label: "Away from the screen", type: "markdown", wide: true },
    { key: "github_url", label: "GitHub URL", type: "url" }, { key: "twitter_url", label: "X / Twitter URL", type: "url" },
  ], defaults: { name: "Axel Püss", first_name: "Axel", location: "Estonia", headline: "", introduction: "", about: "", github_url: null, twitter_url: null } },
};

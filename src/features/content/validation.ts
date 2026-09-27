import { z } from "zod";

export const safeLink = z.string().trim().max(2048).url().refine((value) => {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}, "Use a complete https:// URL without embedded credentials.").nullable();
export const safeImage = z.string().trim().max(2048).refine((value) => {
  if (/^\/[a-zA-Z0-9]/.test(value) && !value.includes("\\")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}, "Use an https:// image URL or a local /image path.").nullable();
const title = z.string().trim().min(1, "A title is required.").max(120);
const slug = z.string().trim().min(1).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");
const order = z.number().int().min(0).max(100000);
const list = z.array(z.string().trim().min(1).max(40)).max(20);
const imageFields = { thumbnail_url: safeImage, thumbnail_alt: z.string().trim().max(300) };

export const projectSchema = z.object({
  title, slug, summary: z.string().trim().min(1).max(280), body: z.string().max(200000),
  category: z.string().trim().min(1).max(80), status: z.enum(["active", "experiment", "archived"]),
  ...imageFields, website_url: safeLink, source_url: safeLink, stack: list,
  featured: z.boolean(), published: z.boolean(), sort_order: order,
}).strict().superRefine((value, ctx) => {
  if (value.thumbnail_url && !value.thumbnail_alt) ctx.addIssue({ code: "custom", path: ["thumbnail_alt"], message: "Add a description of the thumbnail." });
});
export const postSchema = z.object({
  title, slug, excerpt: z.string().trim().min(1).max(320), body: z.string().max(200000),
  cover_url: safeImage, cover_alt: z.string().trim().max(300), tags: list,
  published: z.boolean(), published_at: z.iso.datetime({ offset: true }).nullable(),
}).strict().superRefine((value, ctx) => {
  if (value.cover_url && !value.cover_alt) ctx.addIssue({ code: "custom", path: ["cover_alt"], message: "Add a description of the cover." });
  if (value.published && !value.published_at) ctx.addIssue({ code: "custom", path: ["published_at"], message: "Choose a publication date." });
  if (value.published && value.body.trim().length < 20) ctx.addIssue({ code: "custom", path: ["body"], message: "Add some writing before publishing." });
});
export const toolSchema = z.object({
  group_id: z.uuid(), name: z.string().trim().min(1).max(80), url: safeLink,
  icon_slug: z.string().max(100).regex(/^[a-z0-9-]+$/).nullable(), icon_url: safeImage,
  notes: z.string().trim().max(280), sort_order: order, published: z.boolean(),
}).strict();
export const groupSchema = z.object({ label: z.string().trim().min(1).max(80), description: z.string().trim().max(280), sort_order: order, published: z.boolean() }).strict();
export const settingsSchema = z.object({
  name: title, first_name: z.string().trim().min(1).max(60), location: z.string().trim().min(1).max(100),
  headline: z.string().trim().min(1).max(280), introduction: z.string().trim().max(1000), about: z.string().max(10000),
  github_url: safeLink, twitter_url: safeLink,
}).strict();
export const collectionSchema = z.enum(["projects", "posts", "tools", "tool-groups", "settings"]);
export const schemas = { projects: projectSchema, posts: postSchema, tools: toolSchema, "tool-groups": groupSchema, settings: settingsSchema };
export const recordIdSchema = z.uuid();
export const loginSchema = z.object({ email: z.email().max(254), password: z.string().min(1).max(1024) });
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

export function validateUpload(file: { size: number; type: string }) {
  if (!IMAGE_TYPES.includes(file.type as typeof IMAGE_TYPES[number])) return "Choose a JPEG, PNG, WebP, or AVIF image.";
  if (file.size < 1 || file.size > MAX_IMAGE_BYTES) return "Images must be between 1 byte and 5 MB.";
  return null;
}

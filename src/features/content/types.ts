export type Timestamps = { created_at: string; updated_at: string };
export type Project = Timestamps & {
  id: string; slug: string; title: string; summary: string; body: string;
  category: string; status: "active" | "experiment" | "archived";
  thumbnail_url: string | null; thumbnail_alt: string;
  website_url: string | null; source_url: string | null;
  stack: string[]; featured: boolean; published: boolean; sort_order: number;
};
export type Post = Timestamps & {
  id: string; slug: string; title: string; excerpt: string; body: string;
  cover_url: string | null; cover_alt: string; tags: string[];
  published: boolean; published_at: string | null;
};
export type ToolGroup = Timestamps & {
  id: string; label: string; description: string; sort_order: number; published: boolean;
};
export type Tool = Timestamps & {
  id: string; group_id: string; name: string; url: string | null;
  icon_slug: string | null; icon_url: string | null; notes: string;
  sort_order: number; published: boolean;
};
export type SiteSettings = Timestamps & {
  id: number; name: string; first_name: string; location: string;
  headline: string; introduction: string; about: string;
  github_url: string | null; twitter_url: string | null;
};
export type ToolGroupWithTools = ToolGroup & { tools: Tool[] };
export type Collection = "projects" | "posts" | "tools" | "tool-groups" | "settings";
export type ContentRecord = Project | Post | Tool | ToolGroup | SiteSettings;

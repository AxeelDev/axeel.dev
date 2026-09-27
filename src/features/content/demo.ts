import type { Post, Project, SiteSettings, Tool, ToolGroup } from "./types";

const timestamps = { created_at: "2026-09-26T12:00:00Z", updated_at: "2026-09-26T12:00:00Z" };
export const demoSettings: SiteSettings = {
  ...timestamps, id: 1, name: "Axel Püss", first_name: "Axel", location: "Estonia",
  headline: "I make websites, tools, and the occasional game experiment.",
  introduction: "Most days, I’m working on Casfyre, a freelance marketplace I’m building from the ground up.",
  about: "Away from the screen, I like hiking, nature, and the small things most people walk past. I also play the trombone.\n\nI speak Estonian and English, with German a work in progress.",
  github_url: "https://github.com/AxeelDev/", twitter_url: "https://x.com/axeeeeeel__",
};
export const demoProjects: Project[] = [
  {
    ...timestamps, id: "10000000-0000-4000-8000-000000000001", slug: "casfyre", title: "Casfyre",
    summary: "A home for freelance work, from the first conversation to the final delivery.",
    body: "## What I’m building\n\nCasfyre is the freelance marketplace I’m building. It brings discovery, conversations, offers, orders, and project updates into one place.\n\n## What I’m working on\n\nMost of my attention is here: making the experience feel coherent for both the buyer and the person doing the work.\n\nThis page is a starting point for a proper case study. Screenshots, decisions, and progress notes can be added from the editor.",
    category: "Freelance marketplace", status: "active", thumbnail_url: null, thumbnail_alt: "",
    website_url: "https://www.casfyre.com/", source_url: null,
    stack: ["Next.js", "Supabase", "Cloudflare"], featured: true, published: true, sort_order: 0,
  },
  {
    ...timestamps, id: "10000000-0000-4000-8000-000000000002", slug: "casmine", title: "Casmine",
    summary: "Worlds, blocks, and the feel of old console games.",
    body: "## The project\n\nCasmine is a voxel game project inspired by the look and feel of Minecraft’s Xbox 360 era. It’s a place to experiment with world generation, rendering, and game systems.\n\n## The part I care about\n\nHow the world feels to move through: the light, the colours, the controls, and the little interactions between them.",
    category: "Voxel game", status: "experiment", thumbnail_url: null, thumbnail_alt: "", website_url: null, source_url: null,
    stack: ["Rendering", "World generation"], featured: false, published: true, sort_order: 1,
  },
  {
    ...timestamps, id: "10000000-0000-4000-8000-000000000003", slug: "mazec", title: "MAZEC",
    summary: "A tool for making mazes, and somewhere to get lost in them.",
    body: "## The project\n\nMAZEC is a project for building and exploring 3D mazes, with an editor for assembling spaces and trying them from the inside.\n\n## What I’m exploring\n\nAn experiment in making a creative tool that stays approachable, even when the space you’re building gets complicated.",
    category: "3D maze builder", status: "experiment", thumbnail_url: null, thumbnail_alt: "", website_url: null, source_url: null,
    stack: ["3D", "Creative tools"], featured: false, published: true, sort_order: 2,
  },
];
// Sample writing is shown only in demo mode. The database seed leaves it unpublished.
export const demoPosts: Post[] = [
  { ...timestamps, id: "20000000-0000-4000-8000-000000000001", slug: "a-place-for-project-notes", title: "A place for project notes", excerpt: "Small decisions, things I’ve learned, and what I’m making next.", body: "This is a sample entry, here so you can try the writing section before connecting a database. Replace it with your own words in the editor.\n\n## A few things this space can hold\n\n- Progress on an ongoing project\n- An interesting problem and how you solved it\n- Something you tried that didn’t work\n\nYou can use **Markdown**, add links, write code, and include images.\n\n```ts\nconst smallThings = [\"build\", \"notice\", \"improve\"];\n```\n\nA post can stay as a draft until you’re ready to publish it.", cover_url: null, cover_alt: "", tags: ["Sample entry"], published: true, published_at: "2026-09-26T12:00:00Z" },
  { ...timestamps, id: "20000000-0000-4000-8000-000000000002", slug: "notes-from-the-workbench", title: "Notes from the workbench", excerpt: "A second sample entry for shorter updates and unfinished ideas.", body: "This is another sample entry. It shows how shorter notes sit alongside longer articles.\n\nThere doesn’t have to be a grand conclusion. Sometimes an observation is enough.\n\n> Replace these sample posts with your own writing, then publish them when they’re ready.", cover_url: null, cover_alt: "", tags: ["Sample entry"], published: true, published_at: "2026-09-20T12:00:00Z" },
];
export const demoGroups: ToolGroup[] = [
  { ...timestamps, id: "30000000-0000-4000-8000-000000000001", label: "Building with", description: "The main ingredients in my web projects.", sort_order: 0, published: true },
  { ...timestamps, id: "30000000-0000-4000-8000-000000000002", label: "Working in", description: "Tools for writing, keeping track, and shipping.", sort_order: 1, published: true },
  { ...timestamps, id: "30000000-0000-4000-8000-000000000003", label: "Every day", description: "A couple of things that are usually open.", sort_order: 2, published: true },
];
const toolInputs = [
  [0, "Next.js", "https://nextjs.org/", "nextdotjs", "Web framework"],
  [0, "React", "https://react.dev/", "react", "Interfaces"],
  [0, "TypeScript", "https://www.typescriptlang.org/", "typescript", "Typed JavaScript"],
  [0, "Supabase", "https://supabase.com/", "supabase", "Database and authentication"],
  [0, "Cloudflare", "https://www.cloudflare.com/", "cloudflare", "Hosting"],
  [1, "Cursor", "https://cursor.com/", "cursor", "Code editor"],
  [1, "Git", "https://git-scm.com/", "git", "Version control"],
  [1, "GitHub", "https://github.com/", "github", "Repositories"],
  [2, "macOS", "https://www.apple.com/macos/", "macos", "On a MacBook Air"],
  [2, "ChatGPT", "https://chatgpt.com/", null, "An extra pair of eyes"],
] as const;
export const demoTools: Tool[] = toolInputs.map(([group, name, url, icon_slug, notes], index) => ({
  ...timestamps, id: `40000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  group_id: demoGroups[group].id, name, url, icon_slug, notes, icon_url: null, sort_order: index, published: true,
}));

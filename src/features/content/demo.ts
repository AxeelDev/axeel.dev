import type { Post, Project, SiteSettings, Tool, ToolGroup } from "./types";

const timestamps = { created_at: "2026-09-26T12:00:00Z", updated_at: "2026-09-26T12:00:00Z" };
export const demoSettings: SiteSettings = {
  ...timestamps, id: 1, name: "Axel Püss", first_name: "Axel", location: "Estonia",
  headline: "I build websites, web apps and games, mostly the kind of things I'd actually want to use myself.",
  introduction: "Right now most of my days go into Casfyre, a freelance marketplace I'm building from scratch. Before the web stuff I spent a few years making games in Unreal Engine and C++, which is honestly where I learned most of what I know.",
  about: "Away from the screen I like hiking and being out in nature, and noticing the small stuff most people walk past. I also play the trombone and have a couple of small pets.\n\nI speak Estonian, English and German.",
  github_url: "https://github.com/AxeelDev/", twitter_url: "https://x.com/axeeeeeel__",
};

type ProjectInput = Pick<Project, "slug" | "title" | "summary" | "body" | "category" | "status" | "listing" | "period" | "stack"> & Partial<Pick<Project, "thumbnail_url" | "thumbnail_alt" | "website_url" | "source_url" | "featured" | "gallery">>;
const projectInputs: ProjectInput[] = [
  {
    slug: "casfyre", gallery: [{ src: "/projects/casfyre-2.jpg", alt: "A service page with the seller, delivery time and three packages to choose from" }, { src: "/projects/casfyre-3.jpg", alt: "Browsing every category, from design to music and audio" }, { src: "/projects/casfyre-4.jpg", alt: "The help page explaining Crafts, Calls and Casefiles" }],
    title: "Casfyre", category: "Freelance marketplace", status: "active", listing: "selected", period: "2026 – now", featured: true,
    summary: "A freelance marketplace I'm building from scratch. You find someone, talk it through, agree on the work, pay, and get it delivered, all in one place.",
    thumbnail_url: "/projects/casfyre.jpg", thumbnail_alt: "The Casfyre homepage, with a large search asking what you need done",
    website_url: "https://www.casfyre.com/", stack: ["Next.js", "Supabase", "Stripe", "Cloudflare"],
    body: "## What it is\n\nCasfyre is a freelance marketplace for digital services, based in Estonia. Sellers publish service packages, buyers can post briefs, and you can message someone before ordering anything. There's no platform fee on top of the price, and if a seller doesn't accept an order within 24 hours, the buyer gets their money back.\n\n## The part I care about\n\nFreelance work usually falls apart in the boring places. Scope that was never written down, files spread over three different apps, nobody remembering what was agreed. So every order on Casfyre gets a Casefile: the scope, milestones, files, deliveries, revisions and decisions all stay attached to the work they belong to.\n\n## What I'm working on\n\nPretty much everything. Search over 400+ kinds of services, messaging, offers, fixed-price, milestone and hourly orders, payments, translations, the legal side. It's the biggest thing I've built so far and it's where most of my time goes right now.",
  },
  {
    slug: "kanto", gallery: [{ src: "/projects/kanto-2.jpg", alt: "A thread with replies, sorted by best, with anonymous and signed-in posters" }, { src: "/projects/kanto-3.jpg", alt: "The community directory, sorted by recent activity" }],
    title: "Kanto", category: "Forum", status: "archived", listing: "selected", period: "2026",
    summary: "A forum and imageboard mix. Communities like Reddit, anonymous posting like an imageboard, and a lot of moderation tools in between.",
    thumbnail_url: "/projects/kanto.jpg", thumbnail_alt: "Kanto's trending feed with threads from different communities, running locally with sample posts",
    stack: ["Astro", "React", "Drizzle", "Postgres", "Better Auth"],
    body: "## What it is\n\nKanto is a forum where people make their own communities, each with its own rules, tags, layout and mod team. Threads and replies can be posted anonymously where the community allows it, and there's voting, mentions, notifications, DMs, follows and a personalised feed on top of that.\n\n## How it went\n\nI built it in about five weeks, close to 500 commits. A lot of that time went into the stuff nobody sees: moderation and reporting, rate limiting, privacy and data deletion, encrypted DMs, permissions, and a full admin panel. There's also a thing called micro-sites, where you can host a small single-file HTML/CSS/JS project in a sandbox right on the forum.\n\nIt's not online at the moment, but it taught me a ton about building something where other people's content and safety are part of the job.",
  },
  {
    slug: "vaikusruum", gallery: [{ src: "/projects/vaikusruum-2.jpg", alt: "The soft yoga and gong page, with a photo of the gong" }, { src: "/projects/vaikusruum-3.jpg", alt: "Private lessons, each with its length and a contact link" }, { src: "/projects/vaikusruum-4.jpg", alt: "The FAQ, with answers that open one at a time" }],
    title: "Vaikusruum", category: "Client website", status: "active", listing: "selected", period: "2026",
    summary: "A website for a yoga teacher and musician. Calm on the outside, and she can change everything on it herself.",
    thumbnail_url: "/projects/vaikusruum.jpg", thumbnail_alt: "The Vaikusruum homepage, with the name in a serif and the sun-like logo",
    website_url: "https://vaikusruum.ee/", source_url: "https://github.com/AxeelDev/Vaikusruum", stack: ["Next.js", "Supabase", "Vercel"],
    body: "## What it is\n\nVaikusruum is an Estonian site for kundalini yoga, soft yoga and gong sessions. It has pages for the classes, private lessons, an FAQ, contact and feedback forms, and an about page.\n\n## The part I care about\n\nThe person running it should never need me to change a sentence. So the whole site runs off its own admin panel, where she can edit texts, photos and even the typography without touching any code. I also spent a good amount of time on SEO, so the site actually shows up when people search for it or for the teacher behind it, without any fake filler pages.",
  },
  {
    slug: "the-last-customer", gallery: [{ src: "/projects/the-last-customer-2.jpg", alt: "A choice between two doors in a dark hallway" }, { src: "/projects/the-last-customer-3.jpg", alt: "A bathroom wall with COME HERE written on it" }, { src: "/projects/the-last-customer-4.jpg", alt: "Pushing a shopping cart down a dim store aisle" }],
    title: "The Last Customer", category: "Horror game", status: "archived", listing: "selected", period: "2024",
    summary: "A survival horror game on Steam about a gas station clerk whose customers aren't quite human. My first big project.",
    thumbnail_url: "/projects/the-last-customer.jpg", thumbnail_alt: "A dark gas station at night in The Last Customer, with the choice to explore or go to work",
    website_url: "https://store.steampowered.com/app/3249630/The_Last_Customer", stack: ["Unreal Engine 5"],
    body: "## The game\n\nYou work night shifts at a gas station. Your friend goes missing, and finding him takes you through liminal spaces, puzzles, and things that are pretending to be customers. It came out on Steam in October 2024.\n\n## Honestly\n\nIt was my first big project, and I worked on it for about half a year. It's rough in a lot of places and anything I'd make now would be way better. But that's kind of the point. It's where I actually learned game development: enemies, puzzles, choices, menus, lighting, and then the whole process of packaging a game and getting it released on Steam. Pretty much every mistake I made on it taught me something I still use.",
  },
  {
    slug: "casmine", title: "Casmine", category: "Voxel game", status: "active", listing: "small", period: "2026 – now",
    summary: "A voxel survival game going for the look and feel of Minecraft on the Xbox 360. Very early, mostly engine and world stuff so far.",
    stack: ["Godot", "Voxel Tools"],
    body: "## The project\n\nCasmine is a voxel survival game I'm building in Godot. The goal is the feel of the old Xbox 360 edition of Minecraft: the light, the colours, the menus, the split-screen nights.\n\nIt's very early. Right now it's mostly world generation, rendering and the foundations for multiplayer, so there isn't much to show yet.",
  },
  {
    slug: "snaibo", gallery: [{ src: "/projects/snaibo-2.jpg", alt: "A script running, with its output repeated in the output log" }, { src: "/projects/snaibo-3.jpg", alt: "Creating a new .snaibo script file" }],
    title: "Snaibo", category: "Scripting language", status: "experiment", listing: "small", period: "2025",
    summary: "A tiny scripting language. A text parser in C++ that runs .snaibo files with statements I made up myself.",
    thumbnail_url: "/projects/snaibo.jpg", thumbnail_alt: "The Snaibo code editor with a short script that repeats a hello world",
    stack: ["C++"],
    body: "Snaibo is a small project where I wrote a simple text parser in C++. I can add my own statements with different parameters, and then you can write .snaibo files and run them in a little code editor. It's unfinished, but it was a fun way to learn how a language actually gets read and run.",
  },
  {
    slug: "flappy-vhs", gallery: [{ src: "/projects/flappy-vhs-2.jpg", alt: "The start menu with three difficulty levels" }, { src: "/projects/flappy-vhs-3.jpg", alt: "The game over screen with the score and high score" }],
    title: "Flappy VHS", category: "Arcade game", status: "archived", listing: "small", period: "2025",
    summary: "Flappy Bird, but on an old VHS tape. Made in a single day, just to see what I could pull off in one.",
    thumbnail_url: "/projects/flappy-vhs.jpg", thumbnail_alt: "A small bird flying between green pipes with a VHS filter over everything",
    website_url: "https://www.youtube.com/watch?v=xMnPQxotlio", stack: ["Unreal Engine 5"],
    body: "A one-day project. I made it on my own, with a few textures and assets borrowed from Sketchfab, just to show what I can make in a day. Difficulty levels, a high score, and a VHS look over everything. I don't really plan to continue it.",
  },
  {
    slug: "invert-nest", gallery: [{ src: "/projects/invert-nest-2.jpg", alt: "A product page for an aquarium, with an order form" }, { src: "/projects/invert-nest-3.jpg", alt: "A category page for amphibian enclosures" }],
    title: "Invert Nest", category: "Webshop", status: "archived", listing: "small", period: "2025",
    summary: "A local webshop for pet supplies, mostly for invertebrates. It didn't really catch on, and it's offline now.",
    thumbnail_url: "/projects/invert-nest.jpg", thumbnail_alt: "The Invert Nest homepage with featured pet products",
    stack: ["HTML", "CSS", "JavaScript"],
    body: "Invert Nest was a webshop I made for my area, for animal supplies and mainly pet invertebrate supplies. I could add products dynamically and people could order them. All raw HTML, CSS and JavaScript. It didn't catch on as well as I hoped, so it's not running anymore.",
  },
  {
    slug: "jeopardy", gallery: [{ src: "/projects/jeopardy-2.jpg", alt: "The start screen, where you pick the number of teams" }, { src: "/projects/jeopardy-3.jpg", alt: "A question opened from the board" }],
    title: "Jeopardy", category: "Party game", status: "archived", listing: "small", period: "2025",
    summary: "A Jeopardy game with its own editor, so you can make your own boards and play them with friends. Built in a day.",
    thumbnail_url: "/projects/jeopardy.jpg", thumbnail_alt: "A Jeopardy board with four themes and point values from 100 to 500",
    stack: ["Unreal Engine 5", "C++"],
    body: "A simple Jeopardy game I made in a single day. You can make your own boards in the built-in editor and then play them with teams. Everything in it is built by me. It doesn't save boards to a file yet, which is the obvious next thing if I come back to it.",
  },
  {
    slug: "plus-one-speed-per-second", gallery: [{ src: "/projects/plus-one-speed-2.jpg", alt: "The start screen" }, { src: "/projects/plus-one-speed-3.jpg", alt: "Running across the map past a 400 meter dash minigame" }],
    title: "+1 Speed Per Second", category: "Game prototype", status: "experiment", listing: "small", period: "2025",
    summary: "Every second you get a bit faster. A remake of a Roblox game idea, made to try out different mechanics.",
    thumbnail_url: "/projects/plus-one-speed.jpg", thumbnail_alt: "A character standing in front of colourful doors in a Door of Fortune minigame",
    stack: ["Unreal Engine 5"],
    body: "A scrap project to try making different mechanics, based on a Roblox game that works kind of the same way. Every second you get +1 speed, and you can play minigames I built in there to win trophies, which give you even more speed per second.",
  },
  {
    slug: "crops-vs-creeps", gallery: [{ src: "/projects/crops-vs-creeps-2.jpg", alt: "Choosing a difficulty, with a walnut and a creep in the background" }],
    title: "Crops vs Creeps", category: "Tower defence", status: "archived", listing: "small", period: "",
    summary: "Basically a Plants vs Zombies clone I made from scratch for fun.",
    thumbnail_url: "/projects/crops-vs-creeps.jpg", thumbnail_alt: "A checkered green lawn with plants defending against creeps",
    stack: ["Game dev"],
    body: "Another small side project I made for fun. It's basically a Plants vs Zombies clone, built from scratch with some free assets I found. It was a really fun one to make.",
  },
];
export const demoProjects: Project[] = projectInputs.map((project, index) => ({
  ...timestamps, id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  thumbnail_url: null, thumbnail_alt: "", website_url: null, source_url: null, featured: false, gallery: [],
  ...project, published: true, sort_order: index,
}));
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

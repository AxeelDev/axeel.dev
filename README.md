# Axel’s portfolio

A standalone Next.js portfolio based on the forest direction from concept 04. One application, with a calm reading column, project covers, separate writing, grouped tools, and a private content editor.

## Run it locally

Use Node.js 24 (native Apple Silicon works on an M4 Mac).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Demo mode works without accounts. The sample posts are examples; the tool list is a starting point to edit. `/admin` explains the connection steps until Supabase is configured.

## What’s included

- `/` — introduction, selected projects, recent writing, grouped tools, and about text.
- `/projects` and `/projects/[slug]` — featured and regular layouts, optional thumbnails, project notes, and links.
- `/blog` and `/blog/[slug]` — paginated writing with Markdown, optional covers, drafts, and scheduled publication.
- `/uses` — arbitrary tools and applications in editable groups, with optional notes.
- `/admin` — authenticated editing for projects, posts, groups, tools, and profile text. Image uploads, Markdown preview, icon search, ordering, and publication controls are included.
- Persistent light/dark mode, an animated theme change, a brief first-visit entrance, and route loading feedback. Reduced-motion preferences are respected.

Tools can use one of 3,400+ bundled Simple Icons, a custom uploaded image or URL, or their initial. No catalogue match is required. Category labels such as “Building with” are editable records, not hard-coded sections.

## Connect and deploy

Follow [docs/SETUP.md](docs/SETUP.md) for Supabase, editor access, and GitHub-connected Cloudflare **Workers** deployment. The full Next.js app uses OpenNext; this is not a static Cloudflare Pages export.

The SQL migration, starter content, environment examples, Worker configuration, lockfile, and GitHub CI workflow are included. No external account has been configured or deployed by this project.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Next.js development |
| `npm run typecheck` | Generate route types and check TypeScript |
| `npm test` | Validate content rules and real PostgreSQL RLS policies with PGlite |
| `npm run build` | Build Next.js |
| `npm run build:cloudflare` | Build Next.js and its Cloudflare Worker |
| `npm run check:worker` | Bundle/size check without deploying |
| `npm run preview:cloudflare` | Run the built Worker locally |
| `npm run deploy` | Deploy the already-built Worker to your Cloudflare account |
| `npm run icons` | Regenerate local icons and the editor catalogue |

Icon generation also runs automatically before development and builds. `public/icons` is generated and intentionally excluded from Git. Keep `package-lock.json` committed and install dev dependencies during builds.

## Structure

| Directory | Responsibility |
| --- | --- |
| `src/app` | App Router pages, layouts, metadata, errors, and loading states |
| `src/components` | Shared site shell, navigation, Markdown, theme, and motion |
| `src/features/content` | Content types, validation, demo records, and data access |
| `src/features/projects`, `blog`, `tools` | Public feature components |
| `src/features/admin` | Editor configuration, forms, uploads, and server actions |
| `src/lib` | Environment handling, Supabase clients, authorization, and formatting |
| `supabase` | Versioned schema migration, seed data, and local CLI configuration |
| `tests` | Authorization, storage policy, and validation checks |
| `scripts` | Development entry point and local icon generation |

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before extending the data model.

## Assets

The forest image and `ax.` favicon carry over from concept 04. Project covers deliberately use typography until you upload real screenshots. Fonts are self-hosted through Fontsource; tool icons are generated locally from Simple Icons. Brand names and marks belong to their respective owners; inclusion does not imply endorsement. Review the Simple Icons package’s licensing and brand guidance when adding marks.

## Verification

The Next.js/OpenNext production build and Wrangler dry run were verified. The 14 automated checks exercise the migration’s database policies and content validation. Browser checks cover the public pages, responsive layouts, theme switching, and the unconfigured editor state. Hosted Supabase Auth, Storage HTTP uploads, and Cloudflare deployment must be checked after connecting your own project.

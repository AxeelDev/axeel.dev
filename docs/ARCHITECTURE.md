# Architecture and extension points

## Rendering and data access

Next.js App Router owns routes and page metadata. Public pages are Server Components with a request-scoped, anonymous Supabase client. They never inherit an editor’s session, so signing in cannot expose drafts through a public page. React `cache()` deduplicates data reads within a render, not across users or requests. Supabase fetches opt out of persistent caching.

`src/features/content/repository.ts` is the read boundary. The same typed records are supplied by demo fixtures or Supabase. Keep new data loading here instead of spreading queries across presentation components. The current project index loads up to 100 entries; add pagination here and in the projects route if the portfolio grows beyond that. Blog and editor lists are already paginated. The sitemap includes up to 1,000 blog entries; split it if the archive grows beyond that.

The site shell is shared by the public route group. Feature folders contain reusable rendering, while route files assemble pages and handle not-found states. Profile text and social links come from the singleton `site_settings` row. Site-wide title defaults and description are in `src/app/layout.tsx`; update those when changing the overall identity. Project and post detail metadata follows their content.

## Authorization and mutations

- `src/lib/auth.ts` validates the current user with Supabase Auth and verifies membership in `portfolio_admins`.
- Every server action calls that guard independently. A hidden button or protected layout is never the authorization boundary.
- Zod schemas whitelist every editable field and validate links, slugs, image descriptions, and publication requirements before writes.
- RLS enforces publication filters and editor membership again inside PostgreSQL. Anonymous users can read only public content; authenticated non-editors gain no mutation rights.
- Editor membership is not stored in user-editable metadata. The membership table offers authenticated users only a read of their own row; only trusted database access can add members.
- Conditional updates and deletes include `updated_at`; a trigger changes that timestamp on each edit. Stale tabs receive a conflict instead of silently overwriting newer content.
- Storage permits public image reads and editor-only writes in `portfolio-media`. The bucket limits accepted file types and size.

The middleware refreshes sessions only for `/admin` and `/login` and copies Supabase’s response headers. Admin responses are private and uncached. It intentionally uses the `middleware.ts` convention: the selected OpenNext adapter supports Edge middleware, while Next.js’s Node.js Proxy convention is not supported by this adapter version. Next.js reports a deprecation warning during a successful build; do not apply an automatic rename without checking OpenNext compatibility.

## Content models

| Table | Purpose |
| --- | --- |
| `projects` | Project summaries, Markdown details, optional covers, links, ordering, and visibility |
| `posts` | Markdown writing, excerpts, covers, publication timestamps, topics, and drafts |
| `tool_groups` | Category labels and ordering |
| `tools` | Arbitrary tool records, icons, notes, links, and group membership |
| `site_settings` | Single editable profile record with ID `1` |
| `portfolio_admins` | Allowlist of Auth user IDs permitted to edit |

Database row types are defined in `src/lib/supabase/database.types.ts`. After linking a Supabase project, `npm run db:types` can regenerate those types from its schema. Domain types, fixtures, and validation live beside the content repository.

## Extending a record

1. Create a new timestamped migration with the Supabase CLI. Preserve the existing migration once deployed.
2. Add the column, its constraints, and any necessary index or policy.
3. Update/regenerate database types and update the domain type and demo fixture.
4. Extend the corresponding schema in `features/content/validation.ts`.
5. Add an editor field in `features/admin/config.ts` and render the value in the public feature component.
6. Check any changed access policy with the security tests.

The editor configuration handles common scalar, Markdown, image, icon, date, list, and group fields. New content types need an explicit server-action insert path and table whitelist entry; there is deliberately no arbitrary client-controlled table access.

## Assets, motion, and themes

The forest is a shared background with an opaque reading surface. Design tokens and responsive rules live in `src/app/globals.css`. `next-themes` stores the appearance preference and resolves the system theme before hydration. The theme button uses a short View Transitions reveal when supported, with a direct switch otherwise. First-visit motion runs once per tab session; no artificial loading delay blocks content. Reduced-motion preferences disable movement.

Icons are generated from the installed `simple-icons` version by `scripts/generate-icons.mjs`. The browser loads the search catalogue only when needed in the editor. Public pages request only their selected local SVGs. Uploaded raster icons or external HTTPS images support tools outside the catalogue. Uploaded SVGs are excluded, while the generated package SVGs are trusted source assets.

## Test boundaries

`tests/security.test.ts` executes the real migration and seed against PostgreSQL in PGlite, with minimal Supabase Auth and Storage schema stand-ins. It verifies read/write policies for anonymous users, ordinary accounts, active editors, and revoked editors, as well as scheduling, hidden groups, and stale updates. It does not simulate Supabase’s HTTP API, password authentication, CDN, or file decoding.

`tests/validation.test.ts` covers unsafe URLs, required alt text, publication requirements, unknown-field rejection, arbitrary tools, and upload limits. TypeScript and the actual OpenNext build check the application integrations. The GitHub workflow repeats the tests and Worker build without hosted credentials.

After connecting a real Supabase project, verify login, image upload, save, publish, and signed-out visibility against that project. No external backend is silently provisioned or assumed by the source.

# Local setup, Supabase, and Cloudflare

## 1. Try the design

With Node.js 24 installed:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000. `CONTENT_SOURCE=demo` uses the included fixtures. Keep that value if you only want to try the design. No database connection is required to preview the site.

## 2. Prepare Supabase

Use a dedicated Supabase project for this portfolio. In its SQL Editor, run these files **in order**:

1. `supabase/migrations/20260926224729_portfolio_content.sql`
2. `supabase/seed.sql`

Run the migration once. The seed can be re-run: existing rows with the same IDs are preserved. It creates the profile, projects, tool groups, and tools; the two sample blog entries start as **unpublished drafts** in the database.

The migration creates all content tables, Row Level Security policies, the editor membership table, and the `portfolio-media` Storage bucket. No service-role key is needed by the application.

For teams using the Supabase CLI, this is a standard migration directory. You can apply the migration through your usual linked-project workflow instead of SQL Editor; avoid applying the same migration through both methods without reconciling migration history.

## 3. Create your editor account

In Supabase’s Authentication settings, disable new public signups. This site does not provide a registration flow. Create your own email/password user through Authentication → Users, using the Dashboard’s user creation flow; ensure the email is confirmed.

Copy that user’s UUID from the Dashboard. In SQL Editor, replace the placeholder and run:

```sql
insert into public.portfolio_admins (user_id)
values ('REPLACE_WITH_YOUR_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

Only trusted Dashboard/database access can grant membership. Merely having an authenticated account does not permit editing. To revoke access, delete that user’s row from `portfolio_admins`; do not delete the user’s content.

Set the Supabase Auth Site URL to your eventual portfolio origin. For this password-based editor there is no OAuth callback route to configure. The Supabase Dashboard can also send a password reset or manage an editor account if needed; the public portfolio has no account-management screens.

## 4. Connect locally

Copy the project URL and **publishable** key from your Supabase project’s Connect/API settings into `.env.local`:

```dotenv
CONTENT_SOURCE=supabase
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Restart `npm run dev` after editing environment variables. Visit `/login` and sign in, then open `/admin`.

The publishable key is intentionally public. Access is enforced by the user’s session and database policies. **Never use an `sb_secret_` or legacy `service_role` key in any `NEXT_PUBLIC_` variable.** The application has no reason to hold either key.

When `CONTENT_SOURCE=supabase`, database errors show an error state rather than silently serving demo content. If the homepage fails immediately, check that the migration and seed ran and that `site_settings` contains row `1`.

## 5. Edit content

| Editor page | What to change |
| --- | --- |
| Projects | Title, slug, summary, thumbnail and alt text, category, stack, links, project Markdown, order, featured layout, visibility |
| Writing | Title, slug, excerpt, optional cover and alt text, Markdown, topics, publication time, visibility |
| Tools | Name, group, optional website, catalogue or custom icon, notes, order, visibility |
| Tool groups | Arbitrary category label, description, order, visibility |
| Profile | Name, location, introduction, about text, and social links |

Lower order numbers appear first. A hidden group also hides its tools. Move or remove the tools before deleting their group. Future-dated posts stay private until their publication time; no cron job or rebuild is required. The editor displays times in your browser’s timezone; dates are stored in UTC.

Image uploads accept JPEG, PNG, WebP, and AVIF up to 5 MB. The media bucket is public, so images are accessible by URL even while their associated post is a draft. Use it for portfolio imagery, not private documents. Removing an image from a form detaches it; old files are not automatically deleted because another entry might still use them. Remove unused images through Supabase Storage.

Markdown is rendered with raw HTML disabled. Write image links in Markdown or use the thumbnail/cover upload fields. Use the preview tab to inspect formatting. Custom tool icons override catalogue icons; no icon uses the tool’s initial.

The editor checks the record’s last update when saving, so two open tabs cannot silently overwrite each other. If it reports a newer version, copy your unsaved text before reopening the record.

## 6. Push the source to GitHub

Create the repository you want to use and push this project at its root. Include the lockfile, migration, seed, and `.github/workflows/ci.yml`. Local environment files, dependency folders, generated icons, and build output are already ignored.

CI installs dependencies, runs the 14 checks, builds the Cloudflare Worker, and runs Wrangler’s dry run. CI uses demo content and needs no Supabase credentials.

## 7. Connect Cloudflare Workers to GitHub

Create a Worker with a connected Git repository in Cloudflare’s dashboard and select this repository and branch. Use these settings:

| Setting | Value |
| --- | --- |
| Project root | Repository root, or the directory containing this `package.json` |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy` |
| Node.js build version | `24` via `NODE_VERSION` |

The deploy command uses the existing build; it does not rebuild. The Worker name is `axeel-dev`, matching the Cloudflare project. If you change it in `wrangler.jsonc`, also change the `WORKER_SELF_REFERENCE` service name to match.

Set these in **both** the Worker’s build variables and its runtime Variables/Secrets:

| Variable | Production value |
| --- | --- |
| `CONTENT_SOURCE` | `supabase` |
| `NEXT_PUBLIC_SITE_URL` | Your final HTTPS portfolio origin, with no path |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your publishable key |

Next.js embeds `NEXT_PUBLIC_*` values in the browser bundle at build time. Runtime-only changes are insufficient: rebuild after changing them. Cloudflare build variables and runtime variables are separate settings. The app serves database content on request, so changing content through the editor does not require another deployment.

The Worker configuration includes the Node.js compatibility flag, asset binding, and self-service binding expected by OpenNext. No D1 database or R2 cache bucket is required for this configuration. Use **Workers**, not a static Pages deployment.

After deployment, attach your domain, update the site-origin variable and Supabase Auth Site URL, and rebuild if the origin changed. Check a public project page, sign in at `/login`, save a draft, upload a thumbnail, and publish the draft. A separate signed-out browser should see only published content.

## Optional: preview the Worker locally

```bash
cp .dev.vars.example .dev.vars
npm run build:cloudflare
npm run preview:cloudflare
```

The example uses demo mode. For database-backed preview, use matching Supabase values in `.env.local` and `.dev.vars`, set `CONTENT_SOURCE=supabase`, and rebuild. `NEXTJS_ENV=development` tells OpenNext’s preview to use the development environment files. Follow the local URL printed by Wrangler.

`npm run check:worker` only bundles and reports sizes; it never deploys. `npm run deploy` performs an actual deployment and requires your Cloudflare account authentication.

## Reference documentation

- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [OpenNext environment variables](https://opennext.js.org/cloudflare/howtos/env-vars)
- [Cloudflare Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Cloudflare Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

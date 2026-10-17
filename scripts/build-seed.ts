// Writes supabase/seed.sql from the demo content, so a fresh database starts with the same text, translations included.
// Run from the project root: node --import tsx scripts/build-seed.ts
import { writeFileSync } from "node:fs";
import { demoGroups, demoPosts, demoProjects, demoSettings, demoTools } from "../src/features/content/demo";

const literal = (rows: unknown[]) => `'${JSON.stringify(rows).replaceAll("'", "''")}'::jsonb`;
const insert = (table: string, rows: unknown[]) =>
  `insert into public.${table} select * from jsonb_populate_recordset(null::public.${table}, ${literal(rows)}) on conflict (id) do nothing;`;

const statements = [
  insert("site_settings", [demoSettings]),
  insert("projects", demoProjects),
  // Sample writing is shown in demo mode only; in a real database it starts as drafts.
  insert("posts", demoPosts.map((post) => ({ ...post, published: false }))),
  insert("tool_groups", demoGroups),
  insert("tools", demoTools),
];

writeFileSync("supabase/seed.sql", [
  "-- Optional starter content. Re-running this seed does not overwrite edited rows.",
  "-- Sample blog posts are drafts. No editor account or password is seeded.",
  "begin;",
  ...statements,
  "commit;",
].join("\n\n") + "\n");
console.log("Wrote supabase/seed.sql");

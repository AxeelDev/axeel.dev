import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// Real PostgreSQL/RLS execution in WASM. Supabase's Auth/Storage tables are stubbed;
// this deliberately does not claim to test the hosted Auth or Storage services.
let db: PGlite;
const admin = "a0000000-0000-4000-8000-000000000001";
const outsider = "a0000000-0000-4000-8000-000000000002";
async function asRole<T>(role: "anon" | "authenticated", user: string | null, fn: () => Promise<T>) {
  await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user ?? ""]);
  try { return await fn(); } finally { await db.exec("reset role"); }
}
before(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
    alter table storage.objects enable row level security;
    grant usage on schema public, auth, storage to anon, authenticated;
    grant select on storage.objects to anon;
    grant select, insert, update, delete on storage.objects to authenticated;
  `);
  for (const file of (await readdir("supabase/migrations")).filter((file) => file.endsWith(".sql")).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
  await db.exec(await readFile("supabase/seed.sql", "utf8"));
  await db.query("insert into auth.users(id) values ($1),($2)", [admin, outsider]);
  await db.query("insert into public.portfolio_admins(user_id) values ($1)", [admin]);
});
after(async () => { await db?.close(); });

test("all public application tables have RLS enabled", async () => {
  const { rows } = await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where oid in ('public.projects'::regclass,'public.posts'::regclass,'public.tools'::regclass,'public.tool_groups'::regclass,'public.site_settings'::regclass,'public.portfolio_admins'::regclass)");
  assert.equal(rows.length, 6); assert.ok(rows.every((row) => row.relrowsecurity));
});
test("anonymous readers see published projects but never sample blog drafts", async () => {
  await asRole("anon", null, async () => {
    assert.equal((await db.query("select id from public.projects")).rows.length, 3);
    assert.equal((await db.query("select id from public.posts")).rows.length, 0);
    await assert.rejects(db.query("insert into public.projects(slug,title) values ('intruder','Intruder')"), /permission denied|row-level security/i);
  });
});
test("signing in alone cannot grant editor membership or change content", async () => {
  await asRole("authenticated", outsider, async () => {
    assert.equal((await db.query("select * from public.portfolio_admins")).rows.length, 0);
    await assert.rejects(db.query("insert into public.portfolio_admins(user_id) values ($1)", [outsider]), /permission denied/i);
    await assert.rejects(db.query("insert into public.projects(slug,title) values ('intruder','Intruder')"), /row-level security/i);
    assert.equal((await db.query("update public.projects set title = 'Stolen' returning id")).rows.length, 0);
    assert.equal((await db.query("delete from public.projects returning id")).rows.length, 0);
  });
});
test("editors can create, update, publish, and delete; stale update versions fail", async () => {
  await asRole("authenticated", admin, async () => {
    const first = await db.query<{ id: string; updated_at: string }>("insert into public.projects(slug,title) values ('policy-test','Policy test') returning id,updated_at");
    const row = first.rows[0];
    assert.ok(row.id);
    const changed = await db.query("update public.projects set published = true where id = $1 and updated_at = $2 returning id", [row.id, row.updated_at]);
    assert.equal(changed.rows.length, 1);
    const stale = await db.query("update public.projects set title = 'stale' where id = $1 and updated_at = $2 returning id", [row.id, row.updated_at]);
    assert.equal(stale.rows.length, 0);
    assert.equal((await db.query("delete from public.projects where id = $1 returning id", [row.id])).rows.length, 1);
  });
});
test("scheduled posts stay private until their publication date", async () => {
  await db.exec("insert into public.posts(slug,title,published,published_at) values ('future','Future',true,now()+interval '1 day'),('past','Past',true,now()-interval '1 day')");
  await asRole("anon", null, async () => {
    assert.deepEqual((await db.query<{ slug: string }>("select slug from public.posts")).rows.map((row) => row.slug), ["past"]);
  });
});
test("hiding a tool group hides its tools and nonempty groups cannot be deleted", async () => {
  const group = "30000000-0000-4000-8000-000000000001";
  await asRole("authenticated", admin, async () => {
    await db.query("update public.tool_groups set published=false where id=$1", [group]);
    await assert.rejects(db.query("delete from public.tool_groups where id=$1", [group]), /foreign key/i);
  });
  await asRole("anon", null, async () => { assert.equal((await db.query("select id from public.tools where group_id=$1", [group])).rows.length, 0); });
  await db.query("update public.tool_groups set published=true where id=$1", [group]);
});
test("media uploads, replacement and deletion require current editor membership", async () => {
  await asRole("authenticated", outsider, async () => {
    await assert.rejects(db.exec("insert into storage.objects(bucket_id,name) values ('portfolio-media','blocked.png')"), /row-level security/i);
  });
  await asRole("authenticated", admin, async () => {
    await db.exec("insert into storage.objects(bucket_id,name) values ('portfolio-media','allowed.png')");
    assert.equal((await db.query("update storage.objects set name='updated.png' where name='allowed.png' returning id")).rows.length, 1);
    assert.equal((await db.query("delete from storage.objects where name='updated.png' returning id")).rows.length, 1);
  });
  const bucket = (await db.query<{ file_size_limit: number; allowed_mime_types: string[] }>("select file_size_limit,allowed_mime_types from storage.buckets where id='portfolio-media'")).rows[0];
  assert.equal(Number(bucket.file_size_limit), 5242880); assert.ok(!bucket.allowed_mime_types.includes("image/svg+xml"));
});
test("revoking membership removes edit access even with the same user ID", async () => {
  await db.query("delete from public.portfolio_admins where user_id=$1", [admin]);
  await asRole("authenticated", admin, async () => {
    await assert.rejects(db.exec("insert into public.projects(slug,title) values ('revoked','Revoked')"), /row-level security/i);
    await assert.rejects(db.exec("insert into storage.objects(bucket_id,name) values ('portfolio-media','revoked.png')"), /row-level security/i);
  });
});

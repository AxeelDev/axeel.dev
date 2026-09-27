-- A single-owner portfolio CMS. Apply to the portfolio's own Supabase project.
-- No service-role key is required by the application.
begin;

create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Editors can check their own membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));
-- Membership can only be granted/revoked through trusted database administration.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 96),
  title text not null check (length(trim(title)) between 1 and 120),
  summary text not null default '' check (length(summary) <= 280),
  body text not null default '' check (length(body) <= 200000),
  category text not null default '' check (length(category) <= 80),
  status text not null default 'active' check (status in ('active', 'experiment', 'archived')),
  thumbnail_url text check (thumbnail_url is null or length(thumbnail_url) <= 2048),
  thumbnail_alt text not null default '' check (length(thumbnail_alt) <= 300),
  website_url text check (website_url is null or (website_url ~ '^https://' and length(website_url) <= 2048)),
  source_url text check (source_url is null or (source_url ~ '^https://' and length(source_url) <= 2048)),
  stack text[] not null default '{}' check (cardinality(stack) <= 20),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 96),
  title text not null check (length(trim(title)) between 1 and 120),
  excerpt text not null default '' check (length(excerpt) <= 320),
  body text not null default '' check (length(body) <= 200000),
  cover_url text check (cover_url is null or length(cover_url) <= 2048),
  cover_alt text not null default '' check (length(cover_alt) <= 300),
  tags text[] not null default '{}' check (cardinality(tags) <= 20),
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_have_a_date check (not published or published_at is not null)
);

create table public.tool_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null check (length(trim(label)) between 1 and 80),
  description text not null default '' check (length(description) <= 280),
  sort_order integer not null default 0 check (sort_order between 0 and 100000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.tool_groups(id) on delete restrict,
  name text not null check (length(trim(name)) between 1 and 80),
  url text check (url is null or (url ~ '^https://' and length(url) <= 2048)),
  icon_slug text check (icon_slug is null or (icon_slug ~ '^[a-z0-9-]+$' and length(icon_slug) <= 100)),
  icon_url text check (icon_url is null or length(icon_url) <= 2048),
  notes text not null default '' check (length(notes) <= 280),
  sort_order integer not null default 0 check (sort_order between 0 and 100000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null default 'Axel Püss' check (length(name) between 1 and 120),
  first_name text not null default 'Axel' check (length(first_name) between 1 and 60),
  location text not null default 'Estonia' check (length(location) between 1 and 100),
  headline text not null default '' check (length(headline) <= 280),
  introduction text not null default '' check (length(introduction) <= 1000),
  about text not null default '' check (length(about) <= 10000),
  github_url text check (github_url is null or (github_url ~ '^https://' and length(github_url) <= 2048)),
  twitter_url text check (twitter_url is null or (twitter_url ~ '^https://' and length(twitter_url) <= 2048)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_order on public.projects(sort_order, id) where published;
create index posts_published_date on public.posts(published_at desc, id) where published;
create index tools_group_order on public.tools(group_id, sort_order, id);
create index tool_groups_published_order on public.tool_groups(sort_order, id) where published;

-- The trigger is invoker-mode, with an empty search path; it grants no privilege.
create function public.portfolio_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
revoke all on function public.portfolio_touch_updated_at() from public, anon, authenticated;

do $$
declare content_table text;
begin
  foreach content_table in array array['projects','posts','tools','tool_groups','site_settings'] loop
    execute format('alter table public.%I enable row level security', content_table);
    execute format('revoke all on public.%I from anon, authenticated', content_table);
    execute format('grant select on public.%I to anon, authenticated', content_table);
    execute format('grant insert, update, delete on public.%I to authenticated', content_table);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.portfolio_touch_updated_at()', content_table);
    execute format(
      'create policy "Editors manage content" on public.%I for all to authenticated using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))) with check (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())))',
      content_table
    );
  end loop;
end;
$$;

create policy "Public projects" on public.projects for select to anon, authenticated using (published);
create policy "Public posts" on public.posts for select to anon, authenticated
  using (published and published_at <= now());
create policy "Public tool groups" on public.tool_groups for select to anon, authenticated using (published);
create policy "Public tools in published groups" on public.tools for select to anon, authenticated
  using (published and exists (select 1 from public.tool_groups where id = tools.group_id and published));
create policy "Public profile" on public.site_settings for select to anon, authenticated using (true);

-- Images in this bucket are intentionally public, including images uploaded for drafts.
-- Do not upload confidential material. Draft TEXT remains protected by RLS.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']);

create policy "Public portfolio media" on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-media');
create policy "Editors upload portfolio media" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
create policy "Editors update portfolio media" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())))
  with check (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
create policy "Editors delete portfolio media" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));

commit;

-- Project stacks borrow icons from the tool list, drafts included.
-- Anonymous visitors can't read unpublished tools, so this returns only the icon for names the page already shows.
create function public.portfolio_tool_icons(names text[])
returns table (name text, icon_slug text, icon_url text)
language sql stable security definer set search_path = ''
as $$
  select distinct on (lower(trim(t.name))) lower(trim(t.name)), t.icon_slug, t.icon_url
  from public.tools t
  where cardinality(names) <= 50
    and lower(trim(t.name)) in (select lower(trim(n)) from unnest(names) n)
    and (t.icon_slug is not null or t.icon_url is not null)
  order by lower(trim(t.name)), t.published desc, t.sort_order, t.id;
$$;
revoke all on function public.portfolio_tool_icons(text[]) from public;
grant execute on function public.portfolio_tool_icons(text[]) to anon, authenticated;

-- Project stacks borrow icons and website links from the tool list, drafts included.
-- Anonymous visitors can't read unpublished tools, so this returns only the matches for what a project page already shows:
-- tools named like a stack item, or using the same catalogue icon as one. It replaces the icon-only lookup.
drop function if exists public.portfolio_tool_icons(text[]);
create function public.portfolio_stack_tools(names text[], slugs text[])
returns table (name text, icon_slug text, icon_url text, url text)
language sql stable security definer set search_path = ''
as $$
  select t.name, t.icon_slug, t.icon_url, t.url
  from public.tools t
  where cardinality(names) <= 50 and cardinality(slugs) <= 50
    and (lower(trim(t.name)) in (select lower(trim(n)) from unnest(names) n) or t.icon_slug = any(slugs))
  order by t.published desc, t.sort_order, t.id;
$$;
revoke all on function public.portfolio_stack_tools(text[], text[]) from public;
grant execute on function public.portfolio_stack_tools(text[], text[]) to anon, authenticated;

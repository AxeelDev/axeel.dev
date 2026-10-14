-- Splits projects into selected work and a compact index of smaller things, and adds a free-form time label.
alter table public.projects
  add column listing text not null default 'selected' check (listing in ('selected', 'small')),
  add column period text not null default '' check (length(period) <= 40);

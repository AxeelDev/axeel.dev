-- Messages from the contact form. Anyone may send one; only editors can read or delete them.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(email) between 3 and 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  message text not null check (length(trim(message)) between 1 and 5000),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;

-- Senders can only supply the two text fields, never ids or timestamps.
grant insert (email, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;

create policy "Anyone can send a message" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "Editors read messages" on public.contact_messages for select to authenticated
  using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
create policy "Editors delete messages" on public.contact_messages for delete to authenticated
  using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));

create index contact_messages_created on public.contact_messages(created_at desc);

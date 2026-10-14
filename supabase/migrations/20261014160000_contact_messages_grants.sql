-- Supabase grants every privilege on new public tables by default. Narrow contact_messages to exactly what the form and editor need.
revoke all on public.contact_messages from anon, authenticated;
grant insert (email, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;

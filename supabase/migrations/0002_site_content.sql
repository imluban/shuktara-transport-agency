create table site_content (key text primary key check (key in ('stats','testimonials','company')), value jsonb not null, updated_by uuid, updated_at timestamptz default now());
alter table site_content enable row level security;
-- Public pages read through server code (service role) with validated, whitelisted keys; no direct public access.
create policy admin_all on site_content for all using (is_admin()) with check (is_admin());

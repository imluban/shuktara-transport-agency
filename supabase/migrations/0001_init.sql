create extension if not exists pgcrypto;
create type shipment_status as enum ('booking_received','processing','dispatched','in_transit','arrived','out_for_delivery','delivered','delayed','cancelled');
create type app_role as enum ('admin','staff');
create type quote_status as enum ('new','in_review','quoted','closed');

create table user_roles (user_id uuid primary key references auth.users on delete cascade, role app_role not null, created_at timestamptz default now());
create or replace function is_admin() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin','staff')) $$;

create table shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique default 'SHK-' || upper(substr(translate(encode(gen_random_bytes(10),'base64'),'+/=OIl01',''),1,10)),
  shipment_type text not null, origin text not null, destination text not null,
  status shipment_status not null default 'booking_received',
  customer_name text, customer_phone text, -- private: never selectable by the public
  dispatch_date date, estimated_delivery_date date, delivered_at timestamptz,
  created_at timestamptz default now(), updated_at timestamptz default now());
create table shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references shipments on delete cascade,
  status shipment_status not null, location text, description text,
  event_time timestamptz not null default now(), created_at timestamptz default now());
create index on shipment_events (shipment_id, event_time desc);

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, company text, email text not null, phone text not null,
  service text not null, cargo_type text, pickup text not null, destination text not null,
  volume text, preferred_date date, details text,
  status quote_status not null default 'new', internal_notes text, created_at timestamptz default now());
create index on quote_requests (service, status);

create table admin_activity_logs (id bigserial primary key, user_id uuid, action text not null, entity text, entity_id text, created_at timestamptz default now());

alter table user_roles enable row level security;
alter table shipments enable row level security;
alter table shipment_events enable row level security;
alter table quote_requests enable row level security;
alter table admin_activity_logs enable row level security;
-- Public has NO direct table access. Public tracking and quote submission go through
-- server route handlers (service role), which validate input and whitelist columns.
create policy admin_all on shipments for all using (is_admin()) with check (is_admin());
create policy admin_all on shipment_events for all using (is_admin()) with check (is_admin());
create policy admin_all on quote_requests for all using (is_admin()) with check (is_admin());
create policy admin_read on admin_activity_logs for select using (is_admin());
create policy self_role on user_roles for select using (user_id = auth.uid());

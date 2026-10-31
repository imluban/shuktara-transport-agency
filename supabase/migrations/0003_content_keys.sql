alter table site_content drop constraint if exists site_content_key_check;
alter table site_content add constraint site_content_key_check check (key in ('stats','testimonials','company','services','fleet','industries'));

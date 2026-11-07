-- Vikas Web Studio database setup
-- Run this in Supabase Dashboard > SQL Editor.
-- This script creates tables and a public-read storage bucket.
-- Admin access is based only on auth.users.raw_app_meta_data.role = 'admin'.
-- Never assign roles through user_metadata (users can edit that themselves).

create extension if not exists pgcrypto;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  mobile text not null,
  service text not null,
  budget text not null,
  description text not null default '',
  source text not null default 'Vikas Web Studio website',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Creative',
  description text not null default '',
  image_url text,
  project_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists projects_published_created_at_idx on public.projects (published, created_at desc);

alter table public.enquiries enable row level security;
alter table public.projects enable row level security;

-- Public visitors can submit enquiries but cannot read or change enquiries.
drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
on public.enquiries for insert to anon, authenticated
with check (
  length(trim(name)) between 1 and 120
  and length(trim(email)) between 3 and 254
  and length(trim(mobile)) between 10 and 16
  and length(trim(service)) between 1 and 100
  and length(trim(budget)) between 1 and 80
  and length(description) <= 5000
);

-- Only an admin whose app_metadata contains role=admin can read enquiries.
drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
on public.enquiries for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Public visitors can see only published portfolio projects.
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
on public.projects for select to anon, authenticated
using (published = true);

-- Admins can manage all projects.
drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
on public.projects for all to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage bucket: public read, admin-only upload/update/delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'project-images');

drop policy if exists "Admins can upload project images" on storage.objects;
create policy "Admins can upload project images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-images'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "Admins can update project images" on storage.objects;
create policy "Admins can update project images"
on storage.objects for update to authenticated
using (
  bucket_id = 'project-images'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id = 'project-images'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "Admins can delete project images" on storage.objects;
create policy "Admins can delete project images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'project-images'
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Data API grants (RLS above still controls which rows can be accessed).
grant usage on schema public to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select on public.enquiries to authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;


-- Assign the existing Supabase Auth user as the website admin.
-- This UUID was supplied by the site owner.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where id = '8f43594f-2724-4140-9ebe-2038f9566229';

-- Confirm that exactly the intended user received the admin role:
select id, email, raw_app_meta_data ->> 'role' as app_role
from auth.users
where id = '8f43594f-2724-4140-9ebe-2038f9566229';

-- ==============================================================================
-- SOCIETY CLEAN-UP DATABASE SCHEMA & SECURITY POLICIES
-- Subject: Community Connect
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. ADMIN USERS TABLE & AUTHORIZATION
-- Protects admin dashboard operations securely on the database level
-- ==============================================================================
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admin_users enable row level security;

-- Function to check whether the current authenticated user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$;

-- Admin users table policy: admins can read their own admin record
create policy "Admins can view admin_users"
  on public.admin_users for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- ==============================================================================
-- 3. VOLUNTEERS TABLE
-- Stores community volunteer registrations
-- ==============================================================================
create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  flat_number text not null,
  phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint volunteers_name_not_empty check (length(trim(name)) > 0),
  constraint volunteers_flat_not_empty check (length(trim(flat_number)) > 0),
  constraint volunteers_phone_not_empty check (length(trim(phone)) >= 7)
);

alter table public.volunteers enable row level security;

-- Public visitors can register as volunteers
create policy "Public visitors can register as volunteers"
  on public.volunteers for insert
  to anon, authenticated
  with check (
    length(trim(name)) > 0 and
    length(trim(flat_number)) > 0 and
    length(trim(phone)) >= 7
  );

-- Only verified admins can read private volunteer records & phone numbers
create policy "Only admins can view volunteers"
  on public.volunteers for select
  to authenticated
  using (public.is_admin());

-- Only verified admins can remove test/inappropriate volunteer records
create policy "Only admins can delete volunteers"
  on public.volunteers for delete
  to authenticated
  using (public.is_admin());

-- ==============================================================================
-- 4. DIRTY SPOT REPORTS TABLE
-- Allows residents to report litter and dirty areas
-- ==============================================================================
create table if not exists public.dirty_spot_reports (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  description text not null,
  status text not null default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint dirty_spot_reports_status_check check (status in ('Pending', 'In Progress', 'Cleaned')),
  constraint dirty_spot_reports_location_not_empty check (length(trim(location)) > 0),
  constraint dirty_spot_reports_description_not_empty check (length(trim(description)) > 0)
);

alter table public.dirty_spot_reports enable row level security;

-- Public visitors can submit dirty spot reports
create policy "Public visitors can submit reports"
  on public.dirty_spot_reports for insert
  to anon, authenticated
  with check (
    length(trim(location)) > 0 and
    length(trim(description)) > 0
  );

-- Only authorized admins can view reports in the dashboard
create policy "Only admins can view reports"
  on public.dirty_spot_reports for select
  to authenticated
  using (public.is_admin());

-- Only authorized admins can update report status (Pending -> In Progress -> Cleaned)
create policy "Only admins can update reports"
  on public.dirty_spot_reports for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Only authorized admins can delete reports
create policy "Only admins can delete reports"
  on public.dirty_spot_reports for delete
  to authenticated
  using (public.is_admin());

-- ==============================================================================
-- 5. CLEAN-UP SCHEDULE TABLE
-- Date, time, and meeting point for clean-up drives
-- ==============================================================================
create table if not exists public.clean_up_schedule (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  meeting_point text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint clean_up_schedule_time_not_empty check (length(trim(time)) > 0),
  constraint clean_up_schedule_meeting_not_empty check (length(trim(meeting_point)) > 0)
);

alter table public.clean_up_schedule enable row level security;

-- Public visitors can view the schedule
create policy "Public visitors can view clean_up_schedule"
  on public.clean_up_schedule for select
  to anon, authenticated
  using (true);

-- Only authorized admins can create schedule items
create policy "Only admins can insert clean_up_schedule"
  on public.clean_up_schedule for insert
  to authenticated
  with check (public.is_admin());

-- Only authorized admins can update schedule items
create policy "Only admins can update clean_up_schedule"
  on public.clean_up_schedule for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Only authorized admins can delete schedule items
create policy "Only admins can delete clean_up_schedule"
  on public.clean_up_schedule for delete
  to authenticated
  using (public.is_admin());

-- ==============================================================================
-- 6. GALLERY TABLE
-- Stores Before & After photos of clean-up spots
-- ==============================================================================
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  type text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint gallery_type_check check (type in ('before', 'after')),
  constraint gallery_title_not_empty check (length(trim(title)) > 0),
  constraint gallery_url_not_empty check (length(trim(image_url)) > 0)
);

alter table public.gallery enable row level security;

-- Public visitors can view the gallery
create policy "Public visitors can view gallery"
  on public.gallery for select
  to anon, authenticated
  using (true);

-- Only authorized admins can insert gallery items
create policy "Only admins can insert gallery"
  on public.gallery for insert
  to authenticated
  with check (public.is_admin());

-- Only authorized admins can update gallery items
create policy "Only admins can update gallery"
  on public.gallery for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Only authorized admins can delete gallery items
create policy "Only admins can delete gallery"
  on public.gallery for delete
  to authenticated
  using (public.is_admin());

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET: gallery-images
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do update set public = true;

-- Storage policies for gallery-images bucket
create policy "Public can view gallery images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery-images');

create policy "Admins can upload gallery images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery-images' and public.is_admin());

create policy "Admins can delete gallery images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery-images' and public.is_admin());

-- ==============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ==============================================================================
create index if not exists idx_dirty_spot_reports_status on public.dirty_spot_reports(status);
create index if not exists idx_clean_up_schedule_date on public.clean_up_schedule(date);
create index if not exists idx_gallery_type on public.gallery(type);
create index if not exists idx_volunteers_created_at on public.volunteers(created_at desc);

-- ==============================================================================
-- 9. ADMIN SETUP INSTRUCTIONS (Example)
-- To create an admin:
-- 1. Sign up the user in Supabase Auth (e.g., admin@society.org).
-- 2. Copy the user's UUID from the Authentication -> Users dashboard.
-- 3. Run:
--    insert into public.admin_users (id, email)
--    values ('YOUR-USER-UUID-HERE', 'admin@society.org');
-- ==============================================================================

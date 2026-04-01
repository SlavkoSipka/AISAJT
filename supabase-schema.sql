-- ============================================================
-- AiSajt Client Portal — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. PROFILES (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('admin', 'client')) default 'client',
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete cascade,
  name text not null,
  domain text,
  netlify_preview_url text,
  status text check (status in ('active','paused','completed')) default 'active',
  package_name text,
  package_price numeric,
  created_at timestamptz default now()
);

-- 3. PROJECT STEPS
create table project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  position integer not null,
  title text not null,
  description text,
  status text check (status in ('pending','active','done')) default 'pending',
  completed_at timestamptz,
  estimated_date date,
  created_at timestamptz default now()
);

-- 4. MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  sender_id uuid references profiles(id),
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 5. PROJECT FILES
create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  uploaded_by uuid references profiles(id),
  file_name text not null,
  file_url text not null,
  file_type text,
  created_at timestamptz default now()
);

-- 6. PROJECT DEPLOYS (deploy log from Netlify webhooks)
create table project_deploys (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  deploy_id text,
  deploy_url text,
  commit_message text,
  admin_summary text,
  is_visible boolean default false,
  deployed_at timestamptz not null,
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Existing DBs: remove column if present
-- alter table projects drop column if exists package_renews_at;

-- Migration for existing DBs:
-- Run this manually if the table already exists without project_deploys:
-- The CREATE TABLE above handles new installs.

create index idx_projects_client_id on projects(client_id);
create index idx_project_steps_project_id on project_steps(project_id);
create index idx_messages_project_id on messages(project_id);
create index idx_messages_created_at on messages(created_at);
create index idx_project_files_project_id on project_files(project_id);
create index idx_project_deploys_project_id on project_deploys(project_id);
create index idx_project_deploys_deployed_at on project_deploys(deployed_at);

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_steps enable row level security;
alter table messages enable row level security;
alter table project_files enable row level security;
alter table project_deploys enable row level security;

-- ============================================================
-- HELPER: check if current user is admin
-- ============================================================

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ============================================================
-- RLS POLICIES — profiles
-- ============================================================

create policy "Users can read own profile"
  on profiles for select
  using (id = auth.uid());

create policy "Admins can read all profiles"
  on profiles for select
  using (is_admin());

create policy "Users can update own profile"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Service role inserts profiles"
  on profiles for insert
  with check (true);

-- ============================================================
-- RLS POLICIES — projects
-- ============================================================

create policy "Clients see own projects"
  on projects for select
  using (client_id = auth.uid());

create policy "Admins see all projects"
  on projects for select
  using (is_admin());

create policy "Admins can insert projects"
  on projects for insert
  with check (is_admin());

create policy "Admins can update projects"
  on projects for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete projects"
  on projects for delete
  using (is_admin());

-- ============================================================
-- RLS POLICIES — project_steps
-- ============================================================

create policy "Clients see own project steps"
  on project_steps for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_steps.project_id
        and projects.client_id = auth.uid()
    )
  );

create policy "Admins see all steps"
  on project_steps for select
  using (is_admin());

create policy "Admins can insert steps"
  on project_steps for insert
  with check (is_admin());

create policy "Admins can update steps"
  on project_steps for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete steps"
  on project_steps for delete
  using (is_admin());

-- ============================================================
-- RLS POLICIES — messages
-- ============================================================

create policy "Project participants can read messages"
  on messages for select
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from projects
      where projects.id = messages.project_id
        and projects.client_id = auth.uid()
    )
  );

create policy "Admins can read all messages"
  on messages for select
  using (is_admin());

create policy "Authenticated users can send messages"
  on messages for insert
  with check (sender_id = auth.uid());

create policy "Admins can update messages"
  on messages for update
  using (is_admin());

create policy "Message recipients can mark as read"
  on messages for update
  using (
    exists (
      select 1 from projects
      where projects.id = messages.project_id
        and projects.client_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES — project_files
-- ============================================================

create policy "Project participants can read files"
  on project_files for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_files.project_id
        and projects.client_id = auth.uid()
    )
  );

create policy "Admins can read all files"
  on project_files for select
  using (is_admin());

create policy "Authenticated users can upload files"
  on project_files for insert
  with check (uploaded_by = auth.uid());

create policy "Admins can delete files"
  on project_files for delete
  using (is_admin());

-- ============================================================
-- RLS POLICIES — project_deploys
-- ============================================================

create policy "Clients see visible deploys for own projects"
  on project_deploys for select
  using (
    is_visible = true
    and exists (
      select 1 from projects
      where projects.id = project_deploys.project_id
        and projects.client_id = auth.uid()
    )
  );

create policy "Admins see all deploys"
  on project_deploys for select
  using (is_admin());

create policy "Admins can insert deploys"
  on project_deploys for insert
  with check (is_admin());

create policy "Service role inserts deploys"
  on project_deploys for insert
  with check (true);

create policy "Admins can update deploys"
  on project_deploys for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can delete deploys"
  on project_deploys for delete
  using (is_admin());

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

create policy "Project participants can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'project-files'
    and auth.role() = 'authenticated'
  );

create policy "Project participants can read"
  on storage.objects for select
  using (
    bucket_id = 'project-files'
    and auth.role() = 'authenticated'
  );

create policy "Admins can delete storage files"
  on storage.objects for delete
  using (
    bucket_id = 'project-files'
    and exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- ENABLE REALTIME for messages table
-- ============================================================

alter publication supabase_realtime add table messages;

-- ============================================================
-- AUTO-CREATE PROFILE on signup (trigger)
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

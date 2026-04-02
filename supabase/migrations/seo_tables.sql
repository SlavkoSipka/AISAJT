-- ══════════════════════════════════════════════════════
-- SEO Panel tables
-- Run this in your Supabase SQL editor
-- ══════════════════════════════════════════════════════

-- SEO Projects
create table if not exists public.seo_projects (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.profiles(id) on delete cascade,
  domain        text not null,
  package_name  text,
  package_price numeric(10,2),
  renewal_date  date,
  created_at    timestamptz not null default now()
);

-- Monthly metrics (one row per project per month)
create table if not exists public.seo_metrics (
  id               uuid primary key default gen_random_uuid(),
  seo_project_id   uuid not null references public.seo_projects(id) on delete cascade,
  month            date not null,          -- always first day of month: 2025-01-01
  organic_visits   integer not null default 0,
  avg_position     numeric(6,2),
  new_backlinks    integer not null default 0,
  total_backlinks  integer not null default 0,
  created_at       timestamptz not null default now(),
  unique (seo_project_id, month)
);

-- Tracked keywords
create table if not exists public.seo_keywords (
  id                uuid primary key default gen_random_uuid(),
  seo_project_id    uuid not null references public.seo_projects(id) on delete cascade,
  keyword           text not null,
  current_position  integer,
  previous_position integer,
  created_at        timestamptz not null default now()
);

-- Monthly tasks
create table if not exists public.seo_tasks (
  id             uuid primary key default gen_random_uuid(),
  seo_project_id uuid not null references public.seo_projects(id) on delete cascade,
  title          text not null,
  subtitle       text,
  status         text not null default 'next'
                   check (status in ('done','wip','next','planned')),
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

-- SEO progress categories (progress bars)
create table if not exists public.seo_progress (
  id             uuid primary key default gen_random_uuid(),
  seo_project_id uuid not null references public.seo_projects(id) on delete cascade,
  category       text not null,
  percentage     integer not null default 0 check (percentage between 0 and 100),
  color          text not null default 'cyan',
  position       integer not null default 0
);

-- Alert/warning messages shown to client
create table if not exists public.seo_alerts (
  id             uuid primary key default gen_random_uuid(),
  seo_project_id uuid not null references public.seo_projects(id) on delete cascade,
  message        text not null,
  created_at     timestamptz not null default now()
);

-- ── Row-level security ────────────────────────────────────────────────────────
-- Clients can only read their own SEO project data.
-- Admins (service role) have full access.

alter table public.seo_projects    enable row level security;
alter table public.seo_metrics     enable row level security;
alter table public.seo_keywords    enable row level security;
alter table public.seo_tasks       enable row level security;
alter table public.seo_progress    enable row level security;
alter table public.seo_alerts      enable row level security;

-- seo_projects: client can read own row
create policy "client read own seo_project"
  on public.seo_projects for select
  using (client_id = auth.uid());

create policy "admin full access seo_projects"
  on public.seo_projects for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Helper: check if current user owns the seo project
create or replace function public.owns_seo_project(project_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.seo_projects
    where id = project_id and client_id = auth.uid()
  );
$$;

-- Apply read policy for all child tables
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'seo_metrics','seo_keywords','seo_tasks','seo_progress','seo_alerts'
  ] loop
    execute format('
      create policy "client read own %1$s"
        on public.%1$s for select
        using (public.owns_seo_project(seo_project_id));

      create policy "admin full access %1$s"
        on public.%1$s for all
        using (exists (
          select 1 from public.profiles where id = auth.uid() and role = ''admin''
        ));
    ', tbl);
  end loop;
end $$;

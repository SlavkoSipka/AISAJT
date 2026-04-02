-- ══════════════════════════════════════════════════════
-- SEO GSC columns — run in Supabase SQL editor
-- ══════════════════════════════════════════════════════

-- Add GSC fields to seo_projects
alter table public.seo_projects
  add column if not exists gsc_property_id  text,
  add column if not exists gsc_auto_update  boolean not null default false;

-- Add GSC metric fields to seo_metrics
alter table public.seo_metrics
  add column if not exists clicks        integer not null default 0,
  add column if not exists impressions   integer not null default 0,
  add column if not exists is_gsc_synced boolean not null default false;

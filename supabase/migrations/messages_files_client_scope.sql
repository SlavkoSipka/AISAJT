-- ══════════════════════════════════════════════════════════════════════════
-- Re-scope messages + project_files from project_id to client_id
--
-- Zašto: klijent može imati SEO projekat bez website projekta (i obrnuto).
-- Chat i fajlovi su sada po klijentu — jedan razgovor po klijentu,
-- bez obzira na tip projekta.
--
-- Pokrenuti u Supabase SQL editoru. Idempotentno (add column if not exists).
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. MESSAGES ────────────────────────────────────────────────────────────

alter table public.messages
  add column if not exists client_id uuid references public.profiles(id) on delete cascade;

-- Backfill iz projects.client_id za postojeće redove
update public.messages m
set client_id = p.client_id
from public.projects p
where m.project_id = p.id
  and m.client_id is null;

-- Posle backfill-a napraviti NOT NULL + index
alter table public.messages
  alter column client_id set not null;

-- project_id postaje nullable (SEO-only klijenti neće imati projects red)
alter table public.messages
  alter column project_id drop not null;

create index if not exists idx_messages_client_id on public.messages(client_id);

-- ── 2. PROJECT_FILES ───────────────────────────────────────────────────────

alter table public.project_files
  add column if not exists client_id uuid references public.profiles(id) on delete cascade;

update public.project_files f
set client_id = p.client_id
from public.projects p
where f.project_id = p.id
  and f.client_id is null;

alter table public.project_files
  alter column client_id set not null;

alter table public.project_files
  alter column project_id drop not null;

create index if not exists idx_project_files_client_id on public.project_files(client_id);

-- ══════════════════════════════════════════════════════════════════════════
-- RLS POLICIES — messages
-- ══════════════════════════════════════════════════════════════════════════

drop policy if exists "Project participants can read messages" on public.messages;
drop policy if exists "Message recipients can mark as read" on public.messages;

create policy "Clients can read own messages"
  on public.messages for select
  using (client_id = auth.uid() or sender_id = auth.uid());

create policy "Clients can mark own messages as read"
  on public.messages for update
  using (client_id = auth.uid());

-- "Admins can read all messages", "Admins can update messages",
-- "Authenticated users can send messages" ostaju iste — već su ispravne.

-- ══════════════════════════════════════════════════════════════════════════
-- RLS POLICIES — project_files
-- ══════════════════════════════════════════════════════════════════════════

drop policy if exists "Project participants can read files" on public.project_files;

create policy "Clients can read own files"
  on public.project_files for select
  using (client_id = auth.uid());

-- "Admins can read all files", "Authenticated users can upload files",
-- "Admins can delete files" ostaju iste.

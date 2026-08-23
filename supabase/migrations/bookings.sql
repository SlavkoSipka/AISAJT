-- ══════════════════════════════════════════════════════
-- Zakazivanje poziva (kalendar na /izrada-sajta-detalji)
-- Pokrenuti u Supabase SQL editoru.
-- ══════════════════════════════════════════════════════

-- ── 1. Podešavanja radnog vremena ─────────────────────────────────────────────
-- Jedan jedini red (id = 1). Menja se iz portala: /portal/admin/termini
create table if not exists public.booking_settings (
  id              smallint primary key default 1 check (id = 1),
  -- ISO dan u nedelji: 1 = ponedeljak … 7 = nedelja
  weekday_start   smallint not null default 1 check (weekday_start between 1 and 7),
  weekday_end     smallint not null default 6 check (weekday_end   between 1 and 7),
  -- Sat početka prvog termina i sat posle poslednjeg (24 = ponoć).
  start_hour      smallint not null default 8  check (start_hour between 0 and 23),
  end_hour        smallint not null default 24 check (end_hour   between 1 and 24),
  slot_minutes    smallint not null default 60 check (slot_minutes in (30, 60)),
  -- Koliko sati unapred najranije može da se zakaže.
  lead_time_hours smallint not null default 2  check (lead_time_hours >= 0),
  -- Koliko dana unapred kalendar prikazuje.
  days_ahead      smallint not null default 21 check (days_ahead between 1 and 90),
  timezone        text     not null default 'Europe/Belgrade',
  updated_at      timestamptz not null default now(),
  check (end_hour > start_hour)
);

insert into public.booking_settings (id) values (1)
on conflict (id) do nothing;

-- ── 2. Ručno blokirani periodi ────────────────────────────────────────────────
-- Godišnji odmor, zauzet dan, pauza — sve što nije rezervacija klijenta.
create table if not exists public.booking_blocks (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  reason     text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists booking_blocks_range_idx
  on public.booking_blocks (starts_at, ends_at);

-- ── 3. Rezervacije ────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id         uuid primary key default gen_random_uuid(),
  slot_at    timestamptz not null,
  first_name text not null,
  last_name  text not null,
  phone      text not null,
  email      text,
  note       text,
  status     text not null default 'confirmed'
               check (status in ('confirmed', 'cancelled', 'done')),
  source     text,
  created_at timestamptz not null default now()
);

-- Jedan aktivan termin po slotu — baza je ta koja sprečava duplo zakazivanje,
-- čak i ako dva korisnika kliknu u isto vreme.
create unique index if not exists bookings_active_slot_idx
  on public.bookings (slot_at)
  where status <> 'cancelled';

create index if not exists bookings_slot_idx on public.bookings (slot_at);

-- ── 4. RLS ────────────────────────────────────────────────────────────────────
-- Tabele su zatvorene za javnost. Sajt komunicira isključivo kroz dve
-- security-definer funkcije ispod, tako da anon nikada ne vidi tuđe ime i
-- telefon — samo koji su termini zauzeti.
alter table public.booking_settings enable row level security;
alter table public.booking_blocks   enable row level security;
alter table public.bookings         enable row level security;

-- Admin politike zavise od portal tabele `public.profiles`. Ako portal još nije
-- postavljen u ovom projektu, tabele ostaju dostupne samo service_role ključu —
-- migracija svejedno prolazi, a booking na sajtu radi (ide kroz funkcije ispod).
-- Kad kasnije napravite `profiles`, samo ponovo pokrenite ovaj fajl.
do $$
declare
  has_profiles boolean;
  t text;
begin
  select exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) into has_profiles;

  foreach t in array array['bookings','booking_blocks','booking_settings'] loop
    execute format('drop policy if exists "admin full access %1$s" on public.%1$s', t);

    if has_profiles then
      execute format($f$
        create policy "admin full access %1$s"
          on public.%1$s for all
          using (exists (select 1 from public.profiles
                         where id = auth.uid() and role = 'admin'))
          with check (exists (select 1 from public.profiles
                              where id = auth.uid() and role = 'admin'))
      $f$, t);
    end if;
  end loop;

  if not has_profiles then
    raise notice 'Tabela public.profiles ne postoji — admin politike su preskocene. Pokrenite supabase-schema.sql pa ponovo ovaj fajl da bi portal mogao da upravlja terminima.';
  end if;
end $$;

-- ── 5. Slobodni termini ───────────────────────────────────────────────────────
-- Vraća sve termine u zadatom rasponu i da li su slobodni. Ne otkriva ništa
-- o osobi koja je zakazala.
create or replace function public.get_available_slots(
  p_from date default null,
  p_to   date default null
)
returns table (slot_at timestamptz, is_free boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.booking_settings%rowtype;
  v_from date;
  v_to   date;
begin
  select * into s from public.booking_settings where id = 1;

  v_from := coalesce(p_from, (now() at time zone s.timezone)::date);
  v_to   := least(
              coalesce(p_to, v_from + s.days_ahead),
              (now() at time zone s.timezone)::date + s.days_ahead
            );

  return query
  with days as (
    select d::date as day
    from generate_series(v_from, v_to, interval '1 day') d
    where extract(isodow from d) between s.weekday_start and s.weekday_end
  ),
  slots as (
    select ((day + make_interval(mins => m)) at time zone s.timezone) as slot_at
    from days
    cross join generate_series(
      s.start_hour * 60,
      s.end_hour   * 60 - s.slot_minutes,
      s.slot_minutes
    ) m
  )
  select
    sl.slot_at,
    (
      sl.slot_at >= now() + make_interval(hours => s.lead_time_hours)
      and not exists (
        select 1 from public.bookings b
        where b.slot_at = sl.slot_at and b.status <> 'cancelled'
      )
      and not exists (
        select 1 from public.booking_blocks bl
        where sl.slot_at >= bl.starts_at and sl.slot_at < bl.ends_at
      )
    ) as is_free
  from slots sl
  order by sl.slot_at;
end;
$$;

-- ── 6. Kreiranje rezervacije ──────────────────────────────────────────────────
-- Sve provere su na serveru: termin mora biti u radnom vremenu, u budućnosti,
-- neblokiran i slobodan. Klijent ne može da ih zaobiđe.
create or replace function public.create_booking(
  p_slot_at    timestamptz,
  p_first_name text,
  p_last_name  text,
  p_phone      text,
  p_email      text default null,
  p_note       text default null,
  p_source     text default 'izrada-sajta-detalji'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  s       public.booking_settings%rowtype;
  v_local timestamp;
  v_mins  int;
  v_id    uuid;
begin
  select * into s from public.booking_settings where id = 1;

  if coalesce(trim(p_first_name), '') = ''
     or coalesce(trim(p_last_name), '') = ''
     or coalesce(trim(p_phone), '') = '' then
    raise exception 'Ime, prezime i broj telefona su obavezni'
      using errcode = 'check_violation';
  end if;

  if p_slot_at < now() + make_interval(hours => s.lead_time_hours) then
    raise exception 'Termin je prošao ili je prerano'
      using errcode = 'check_violation';
  end if;

  v_local := p_slot_at at time zone s.timezone;
  v_mins  := extract(hour from v_local)::int * 60 + extract(minute from v_local)::int;

  if extract(isodow from v_local) not between s.weekday_start and s.weekday_end
     or v_mins < s.start_hour * 60
     or v_mins > s.end_hour * 60 - s.slot_minutes
     or mod(v_mins - s.start_hour * 60, s.slot_minutes) <> 0 then
    raise exception 'Termin nije u radnom vremenu'
      using errcode = 'check_violation';
  end if;

  if exists (
    select 1 from public.booking_blocks bl
    where p_slot_at >= bl.starts_at and p_slot_at < bl.ends_at
  ) then
    raise exception 'Termin nije dostupan'
      using errcode = 'check_violation';
  end if;

  insert into public.bookings (slot_at, first_name, last_name, phone, email, note, source)
  values (p_slot_at, trim(p_first_name), trim(p_last_name), trim(p_phone),
          nullif(trim(p_email), ''), nullif(trim(p_note), ''), p_source)
  returning id into v_id;

  return v_id;
exception
  when unique_violation then
    -- Neko je zauzeo isti termin u međuvremenu.
    raise exception 'Termin je upravo zauzet' using errcode = 'unique_violation';
end;
$$;

-- Sajt (anon) sme samo ove dve funkcije, ništa direktno nad tabelama.
revoke all on function public.get_available_slots(date, date) from public;
revoke all on function public.create_booking(timestamptz, text, text, text, text, text, text) from public;

grant execute on function public.get_available_slots(date, date) to anon, authenticated;
grant execute on function public.create_booking(timestamptz, text, text, text, text, text, text) to anon, authenticated;

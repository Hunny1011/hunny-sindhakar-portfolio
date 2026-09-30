-- Portfolio schema: content tables, admin access, contact messages, media storage.
-- Public visitors can read published/visible rows only. Writes require an admin user.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table if not exists public.profile (
  id int primary key default 1 check (id = 1),
  name text not null,
  alternate_names text[] not null default '{}',
  headline text not null,
  role text not null,
  company text,
  company_url text,
  location text not null,
  country text not null default 'India',
  email text not null,
  short_bio text not null,
  long_bio text not null,
  answer_block text not null,
  photo_url text,
  resume_url text,
  availability text not null default 'open' check (availability in ('open', 'freelance', 'busy')),
  availability_note text,
  languages text[] not null default '{}',
  core_skills text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  url text not null,
  handle text,
  sort_order int not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  category text not null,
  kind text not null default 'case-study' check (kind in ('case-study', 'concept', 'graphic')),
  company text,
  client text,
  role text,
  year int,
  platforms text[] not null default '{}',
  summary text not null,
  problem text,
  process text,
  solution text,
  outcome text,
  highlights text[] not null default '{}',
  metrics jsonb not null default '[]'::jsonb,
  cover_url text,
  cover_alt text,
  accent text,
  gallery jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  tools text[] not null default '{}',
  external_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,
  summary text,
  bullets text[] not null default '{}',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'degree' check (kind in ('degree', 'certification')),
  title text not null,
  institution text not null,
  location text,
  start_year int,
  end_year int,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  name text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  quote text not null,
  avatar_url text,
  visible boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  visible boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  source text not null default 'medium',
  excerpt text,
  cover_url text,
  published_at timestamptz,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url_template text not null,
  enabled boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  intent text not null default 'hello' check (intent in ('hiring', 'freelance', 'hello')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  user_agent text,
  created_at timestamptz not null default now()
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['profile','social_links','projects','experiences','education','skills','testimonials','faqs','posts','ai_links','site_settings']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.profile enable row level security;
alter table public.social_links enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.posts enable row level security;
alter table public.ai_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.messages enable row level security;

-- admins: an admin can see the admin list; no one writes through the API
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins for select using (public.is_admin());

-- public read policies
drop policy if exists public_read on public.profile;
create policy public_read on public.profile for select using (true);

drop policy if exists public_read on public.social_links;
create policy public_read on public.social_links for select using (visible or public.is_admin());

drop policy if exists public_read on public.projects;
create policy public_read on public.projects for select using (status = 'published' or public.is_admin());

drop policy if exists public_read on public.experiences;
create policy public_read on public.experiences for select using (true);

drop policy if exists public_read on public.education;
create policy public_read on public.education for select using (true);

drop policy if exists public_read on public.skills;
create policy public_read on public.skills for select using (true);

drop policy if exists public_read on public.testimonials;
create policy public_read on public.testimonials for select using (visible or public.is_admin());

drop policy if exists public_read on public.faqs;
create policy public_read on public.faqs for select using (visible or public.is_admin());

drop policy if exists public_read on public.posts;
create policy public_read on public.posts for select using (visible or public.is_admin());

drop policy if exists public_read on public.ai_links;
create policy public_read on public.ai_links for select using (enabled or public.is_admin());

drop policy if exists public_read on public.site_settings;
create policy public_read on public.site_settings for select using (true);

-- admin write policies
do $$
declare t text;
begin
  foreach t in array array['profile','social_links','projects','experiences','education','skills','testimonials','faqs','posts','ai_links','site_settings']
  loop
    execute format('drop policy if exists admin_write on public.%I', t);
    execute format('create policy admin_write on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- messages: inserted by the server (service role) only; admins read and update
drop policy if exists admin_read on public.messages;
create policy admin_read on public.messages for select using (public.is_admin());
drop policy if exists admin_update on public.messages;
create policy admin_update on public.messages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_delete on public.messages;
create policy admin_delete on public.messages for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

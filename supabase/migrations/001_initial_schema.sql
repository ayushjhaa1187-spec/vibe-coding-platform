-- ============================================================
-- Vibe Coding Platform - Initial Database Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- Updated_at trigger function
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- Profiles table
-- ============================================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null unique,
  display_name text,
  avatar_url text,
  bio text,
  github_url text,
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view any profile"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- Projects table
-- ============================================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  language text,
  code_content text,
  is_public boolean default true,
  fork_count integer default 0,
  like_count integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

alter table public.projects enable row level security;

create policy "Public projects are viewable by everyone"
  on public.projects for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Snippets table
-- ============================================================
create table public.snippets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  project_id uuid references public.projects on delete set null,
  title text not null,
  code text not null,
  language text,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger snippets_updated_at
  before update on public.snippets
  for each row execute function public.handle_updated_at();

alter table public.snippets enable row level security;

create policy "Users can view own snippets"
  on public.snippets for select
  using (auth.uid() = user_id);

create policy "Users can insert own snippets"
  on public.snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snippets"
  on public.snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete own snippets"
  on public.snippets for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Chat history table
-- ============================================================
create table public.chat_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  messages jsonb not null default '[]'::jsonb,
  title text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger chat_history_updated_at
  before update on public.chat_history
  for each row execute function public.handle_updated_at();

alter table public.chat_history enable row level security;

create policy "Users can view own chat history"
  on public.chat_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat history"
  on public.chat_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chat history"
  on public.chat_history for update
  using (auth.uid() = user_id);

create policy "Users can delete own chat history"
  on public.chat_history for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_profiles_user_id on public.profiles (user_id);
create index idx_projects_user_id on public.projects (user_id);
create index idx_projects_is_public on public.projects (is_public);
create index idx_snippets_user_id on public.snippets (user_id);
create index idx_snippets_project_id on public.snippets (project_id);
create index idx_chat_history_user_id on public.chat_history (user_id);

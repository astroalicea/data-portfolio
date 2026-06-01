-- PinPoint Supabase schema
-- Run this once in the Supabase SQL Editor for a fresh project.
--
-- Auth is handled by Supabase's built-in auth.users table. The three
-- tables below extend it with PinPoint's own data, all locked down via
-- Row Level Security so one user's data is never visible to another.

-- ─────────────────────────────────────────────────────────────
-- profiles: one row per user, extends auth.users with onboarding answers
-- ─────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  belt_level text not null,
  months_training integer not null,
  training_frequency text not null,
  primary_goal text not null,
  gi_or_nogi text,
  top_guard text,
  body_size text,
  extended_at timestamptz,
  extended_dismissed_until timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- check_ins: one row per post-class 4-tap submission
-- ─────────────────────────────────────────────────────────────
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  got_tapped boolean not null,
  position_lost text,
  attempted_focus text not null,
  overall_feeling text not null,
  created_at timestamptz not null default now()
);

create index if not exists check_ins_user_created_idx
  on check_ins (user_id, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- focus_history: one row per focus we delivered to a user
-- ─────────────────────────────────────────────────────────────
create table if not exists focus_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  focus_text text not null,
  focus_area text not null,
  belt_level text not null,
  delivered_at timestamptz not null default now()
);

create index if not exists focus_history_user_delivered_idx
  on focus_history (user_id, delivered_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security: users can only read/write their own rows.
-- ─────────────────────────────────────────────────────────────
alter table profiles       enable row level security;
alter table check_ins      enable row level security;
alter table focus_history  enable row level security;

create policy "users read their own profile"
  on profiles for select using (auth.uid() = id);
create policy "users insert their own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "users update their own profile"
  on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "users read their own check_ins"
  on check_ins for select using (auth.uid() = user_id);
create policy "users insert their own check_ins"
  on check_ins for insert with check (auth.uid() = user_id);

create policy "users read their own focus_history"
  on focus_history for select using (auth.uid() = user_id);
create policy "users insert their own focus_history"
  on focus_history for insert with check (auth.uid() = user_id);

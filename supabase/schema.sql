-- AnimID initial schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 24),
  display_name text not null default 'Anime Fan',
  bio text not null default '' check (char_length(bio) <= 240),
  avatar_url text,
  banner_url text,
  border_key text not null default 'default',
  title_key text not null default 'member',
  level integer not null default 1 check (level >= 1),
  exp bigint not null default 0 check (exp >= 0),
  coins bigint not null default 0 check (coins >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','premium','moderator','admin','owner')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table if not exists public.anime_catalog (
  id text primary key,
  title text not null,
  poster_url text,
  cover_url text,
  synopsis text,
  genres text[] not null default '{}',
  release_year integer,
  status text,
  source text not null default 'animein',
  source_updated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_anime_lists (
  user_id uuid not null references auth.users(id) on delete cascade,
  anime_id text not null,
  list_type text not null check (list_type in ('favorite','watchlist')),
  created_at timestamptz not null default now(),
  primary key (user_id, anime_id, list_type)
);

create table if not exists public.watch_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  anime_id text not null,
  episode_id text not null default '',
  progress_seconds integer not null default 0 check (progress_seconds >= 0),
  completed boolean not null default false,
  watched_at timestamptz not null default now(),
  primary key (user_id, anime_id, episode_id)
);

create table if not exists public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  item_key text unique not null,
  name text not null,
  description text not null default '',
  item_type text not null check (item_type in ('banner','border','title','badge','avatar_frame')),
  acquisition text not null check (acquisition in ('free','coins','premium','level','event')),
  coin_price bigint not null default 0 check (coin_price >= 0),
  price_minor bigint not null default 0 check (price_minor >= 0),
  asset_url text,
  required_level integer not null default 1,
  premium_only boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_cosmetics (
  user_id uuid not null references auth.users(id) on delete cascade,
  cosmetic_id uuid not null references public.cosmetics(id) on delete cascade,
  acquired_at timestamptz not null default now(),
  equipped boolean not null default false,
  primary key (user_id, cosmetic_id)
);

create table if not exists public.premium_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  source text not null check (source in ('purchase','admin_grant','gift','giveaway')),
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (expires_at > starts_at)
);

create table if not exists public.premium_gifts (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  duration_days integer not null check (duration_days between 1 and 3650),
  status text not null default 'pending' check (status in ('pending','claimed','cancelled','expired')),
  message text not null default '' check (char_length(message) <= 180),
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  check (sender_id <> recipient_id)
);

create table if not exists public.giveaways (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null,
  description text not null default '',
  premium_days integer not null check (premium_days between 1 and 3650),
  max_claims integer not null check (max_claims between 1 and 10000),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  verified_only boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.giveaway_claims (
  id uuid primary key default gen_random_uuid(),
  giveaway_id uuid not null references public.giveaways(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  claimed_at timestamptz not null default now(),
  unique (giveaway_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  anime_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table if not exists public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  status text not null default 'open' check (status in ('open','reviewed','dismissed','actioned')),
  created_at timestamptz not null default now(),
  unique (comment_id, reporter_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null default '',
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_key text unique not null,
  name text not null,
  description text not null default '',
  exp_reward integer not null default 0 check (exp_reward >= 0),
  coin_reward integer not null default 0 check (coin_reward >= 0),
  badge_cosmetic_id uuid references public.cosmetics(id) on delete set null,
  active boolean not null default true
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  transaction_type text not null check (transaction_type in ('premium','cosmetic','coins')),
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null default 'IDR',
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','cancelled')),
  provider text,
  provider_reference text unique,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Row Level Security: users may manage their own private collections and profile only.
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.user_anime_lists enable row level security;
alter table public.watch_history enable row level security;
alter table public.user_cosmetics enable row level security;
alter table public.premium_subscriptions enable row level security;
alter table public.premium_gifts enable row level security;
alter table public.giveaways enable row level security;
alter table public.giveaway_claims enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;
alter table public.comment_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.user_achievements enable row level security;
alter table public.transactions enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.anime_catalog enable row level security;
alter table public.cosmetics enable row level security;
alter table public.achievements enable row level security;

create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own basic profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "roles visible to self" on public.user_roles for select using (auth.uid() = user_id);
create policy "own lists select" on public.user_anime_lists for select using (auth.uid() = user_id);
create policy "own lists insert" on public.user_anime_lists for insert with check (auth.uid() = user_id);
create policy "own lists delete" on public.user_anime_lists for delete using (auth.uid() = user_id);
create policy "own history select" on public.watch_history for select using (auth.uid() = user_id);
create policy "own history insert" on public.watch_history for insert with check (auth.uid() = user_id);
create policy "own history update" on public.watch_history for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own cosmetics select" on public.user_cosmetics for select using (auth.uid() = user_id);
create policy "own subscriptions select" on public.premium_subscriptions for select using (auth.uid() = user_id);
create policy "gift sender or recipient select" on public.premium_gifts for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "giveaways readable when active" on public.giveaways for select using (active = true);
create policy "own claims select" on public.giveaway_claims for select using (auth.uid() = user_id);
create policy "comments readable when visible" on public.comments for select using (hidden = false);
create policy "users create own comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "users edit own comments" on public.comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own comments" on public.comments for delete using (auth.uid() = user_id);
create policy "likes readable" on public.comment_likes for select using (true);
create policy "users like as self" on public.comment_likes for insert with check (auth.uid() = user_id);
create policy "users remove own like" on public.comment_likes for delete using (auth.uid() = user_id);
create policy "users submit own report" on public.comment_reports for insert with check (auth.uid() = reporter_id);
create policy "users read own reports" on public.comment_reports for select using (auth.uid() = reporter_id);
create policy "users read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "users update own notifications" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users read own achievements" on public.user_achievements for select using (auth.uid() = user_id);
create policy "users read own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "anime catalog readable" on public.anime_catalog for select using (true);
create policy "active cosmetics readable" on public.cosmetics for select using (active = true);
create policy "active achievements readable" on public.achievements for select using (active = true);

-- NOTE: Never grant users direct update access to role, EXP, coin balance, subscription, giveaway claims,
-- transaction status, or admin audit tables. Awarding EXP/coins and claiming giveaways must use
-- authenticated server-side RPC/Edge Functions with atomic transactions and role checks.

-- Create a minimal profile automatically on signup. A random suffix avoids collisions.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_name text;
  safe_name text;
begin
  base_name := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(coalesce(new.email, 'member'), '@', 1)), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base_name) < 3 then base_name := 'member'; end if;
  safe_name := left(base_name, 15) || '_' || substr(replace(new.id::text, '-', ''), 1, 6);
  insert into public.profiles (id, username, display_name)
  values (new.id, safe_name, coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), 'Anime Fan'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_animid on auth.users;
create trigger on_auth_user_created_animid
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Restrict profile updates to user-editable columns; role/EXP/coins remain server-managed.
revoke update on public.profiles from anon, authenticated;
grant update (username, display_name, bio, avatar_url, updated_at) on public.profiles to authenticated;

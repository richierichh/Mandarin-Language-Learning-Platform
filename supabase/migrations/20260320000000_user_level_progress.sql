-- Per-user, per-level checkpoint to support "continue where you left off"
create table if not exists public.user_level_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  level int not null,
  current_index int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, category, level),
  constraint user_level_progress_level_positive check (level > 0),
  constraint user_level_progress_index_non_negative check (current_index >= 0)
);

create index if not exists idx_user_level_progress_user_updated
  on public.user_level_progress (user_id, updated_at desc);

alter table public.user_level_progress enable row level security;

drop policy if exists "Users can manage own level progress" on public.user_level_progress;
create policy "Users can manage own level progress"
  on public.user_level_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

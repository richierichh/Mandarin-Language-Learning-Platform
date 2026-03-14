-- User progress & session history schema for Mandarin language learning
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- =============================================================================
-- 1. user_word_progress — per-user, per-word stats (words completed, attempts)
-- =============================================================================
-- word_id matches your app vocabulary IDs (e.g. "g-1", "f-1", "d-1", "t-1", "s-1")
create table if not exists public.user_word_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  completed_count int not null default 0,
  total_attempts int not null default 0,
  correct_attempts int not null default 0,
  last_seen_at timestamptz,
  mastered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id),
  constraint user_word_progress_completed_non_negative check (completed_count >= 0),
  constraint user_word_progress_attempts_non_negative check (total_attempts >= 0 and correct_attempts >= 0),
  constraint user_word_progress_correct_lte_total check (correct_attempts <= total_attempts)
);

comment on table public.user_word_progress is 'Per-user progress per vocabulary word (e.g. times completed, attempts, mastered)';
comment on column public.user_word_progress.completed_count is 'Number of times the user successfully completed this word (e.g. in a session)';
comment on column public.user_word_progress.total_attempts is 'Total number of quiz/attempt events for this word';
comment on column public.user_word_progress.correct_attempts is 'Number of correct answers for this word';
comment on column public.user_word_progress.mastered_at is 'When the user marked or qualified as "mastered" for this word';

create index if not exists idx_user_word_progress_user_id on public.user_word_progress(user_id);
create index if not exists idx_user_word_progress_last_seen on public.user_word_progress(user_id, last_seen_at desc nulls last);

-- =============================================================================
-- 2. study_sessions — session history (when they studied, high-level stats)
-- =============================================================================
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  total_cards int not null default 0,
  correct_count int not null default 0,
  mode text,
  created_at timestamptz not null default now(),
  constraint study_sessions_counts_non_negative check (total_cards >= 0 and correct_count >= 0),
  constraint study_sessions_correct_lte_total check (correct_count <= total_cards)
);

comment on table public.study_sessions is 'One row per study session (e.g. one "study now" or "quiz" run)';
comment on column public.study_sessions.mode is 'Optional: e.g. learn, review, quiz';

create index if not exists idx_study_sessions_user_id on public.study_sessions(user_id);
create index if not exists idx_study_sessions_started_at on public.study_sessions(user_id, started_at desc);

-- =============================================================================
-- 3. session_attempts — per-card attempts inside a session (drill-down history)
-- =============================================================================
create table if not exists public.session_attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  word_id text not null,
  correct boolean not null,
  responded_at timestamptz not null default now(),
  response_time_ms int,
  constraint session_attempts_response_time_non_negative check (response_time_ms is null or response_time_ms >= 0)
);

comment on table public.session_attempts is 'One row per card/word attempt within a study session';

create index if not exists idx_session_attempts_session_id on public.session_attempts(session_id);
create index if not exists idx_session_attempts_word_id on public.session_attempts(word_id);

-- =============================================================================
-- 4. Row Level Security (RLS) — users can only see/edit their own data
-- =============================================================================
alter table public.user_word_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.session_attempts enable row level security;

-- user_word_progress: user can only access their own rows
create policy "Users can manage own word progress"
  on public.user_word_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- study_sessions: user can only access their own sessions
create policy "Users can manage own study sessions"
  on public.study_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- session_attempts: user can access only attempts for their own sessions
create policy "Users can manage own session attempts"
  on public.session_attempts
  for all
  using (
    exists (
      select 1 from public.study_sessions s
      where s.id = session_attempts.session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.study_sessions s
      where s.id = session_attempts.session_id and s.user_id = auth.uid()
    )
  );

-- =============================================================================
-- 5. updated_at trigger for user_word_progress
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_user_word_progress_updated_at on public.user_word_progress;
create trigger set_user_word_progress_updated_at
  before update on public.user_word_progress
  for each row execute function public.set_updated_at();

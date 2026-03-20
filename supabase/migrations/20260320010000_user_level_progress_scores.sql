-- Store in-progress score counters so "Continue" restores visible progress.
alter table public.user_level_progress
  add column if not exists correct_count int not null default 0,
  add column if not exists incorrect_count int not null default 0;

alter table public.user_level_progress
  drop constraint if exists user_level_progress_correct_non_negative,
  add constraint user_level_progress_correct_non_negative check (correct_count >= 0);

alter table public.user_level_progress
  drop constraint if exists user_level_progress_incorrect_non_negative,
  add constraint user_level_progress_incorrect_non_negative check (incorrect_count >= 0);

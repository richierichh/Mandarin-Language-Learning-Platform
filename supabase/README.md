# Supabase schema – user progress & session history

## Overview

| Table | Purpose |
|-------|--------|
| **user_word_progress** | One row per user per word: completed count, total/correct attempts, last seen, mastered. |
| **study_sessions** | One row per study session: when, duration, total cards, correct count, optional mode. |
| **session_attempts** | One row per card attempt inside a session: which word, correct or not, optional response time. |

Vocabulary stays in your app (`src/data/mandarin-vocabulary.ts`). `word_id` in the DB matches those IDs (e.g. `g-1`, `f-1`).

## How to apply

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor** → **New query**.
3. Paste the contents of `migrations/20250307000000_user_progress_schema.sql`.
4. Run the query.

## Tables in detail

### user_word_progress

- **user_id** – from `auth.uid()`.
- **word_id** – from your vocabulary (e.g. `"g-1"`).
- **completed_count** – e.g. “times completed in a session” or “times correct in a row” (you define the rule).
- **total_attempts** / **correct_attempts** – for accuracy.
- **last_seen_at** – last time this word was shown (for spacing/scheduling).
- **mastered_at** – when the user mastered the word (nullable).

Use this table to drive “words learned”, “words mastered”, and “next review” logic.

### study_sessions

- **started_at** / **ended_at** – session window.
- **total_cards** / **correct_count** – session summary.
- **mode** – optional, e.g. `'learn' | 'review' | 'quiz'`.

Use for “session history” and simple stats (e.g. sessions per day, accuracy per session).

### session_attempts

- **session_id** – links to `study_sessions.id`.
- **word_id** – which word was tested.
- **correct** – whether the answer was correct.
- **response_time_ms** – optional.

Use for per-session drill-down and analytics.

## Row Level Security (RLS)

- All three tables have RLS enabled.
- Users can only read/insert/update/delete their own `user_word_progress` and `study_sessions`.
- Users can only access `session_attempts` for their own sessions (via the join to `study_sessions`).

## Example app usage

- **Record progress after a card:** upsert `user_word_progress` (increment `total_attempts`, maybe `correct_attempts`, set `last_seen_at`).
- **Start a session:** insert `study_sessions` (set `started_at`, leave `ended_at` null).
- **Record each attempt:** insert `session_attempts` (link to current `session_id`, set `word_id`, `correct`, optional `response_time_ms`); optionally update `user_word_progress` in the same flow.
- **End session:** update `study_sessions` with `ended_at`, `total_cards`, `correct_count` (and optionally `mode`).

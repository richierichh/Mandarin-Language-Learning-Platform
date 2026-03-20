"use server";

import { createClient } from "@/lib/supabase/server";

export type SaveProgressInput = {
  category: string;
  level: number;
  startedAt: number;
  attempts: { wordId: string; correct: boolean }[];
  currentIndex: number;
  currentCorrect: number;
  currentIncorrect: number;
  markComplete?: boolean;
};

export async function saveProgressAndExit(input: SaveProgressInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const {
    category,
    level,
    startedAt,
    attempts,
    currentIndex,
    currentCorrect,
    currentIncorrect,
    markComplete,
  } = input;
  const correctCount = attempts.filter((a) => a.correct).length;

  const { data: session, error: sessionError } = await supabase
    .from("study_sessions")
    .insert({
      user_id: user.id,
      started_at: new Date(startedAt).toISOString(),
      ended_at: new Date().toISOString(),
      total_cards: attempts.length,
      correct_count: correctCount,
      mode: "flashcard",
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    return { error: sessionError?.message ?? "Failed to save session" };
  }

  for (const a of attempts) {
    await supabase.from("session_attempts").insert({
      session_id: session.id,
      word_id: a.wordId,
      correct: a.correct,
    });
  }

  const byWord = new Map<string, { total: number; correct: number }>();
  for (const a of attempts) {
    const cur = byWord.get(a.wordId) ?? { total: 0, correct: 0 };
    cur.total += 1;
    if (a.correct) cur.correct += 1;
    byWord.set(a.wordId, cur);
  }

  const wordIds = [...byWord.keys()];
  const { data: existing } = await supabase
    .from("user_word_progress")
    .select("word_id, total_attempts, correct_attempts")
    .eq("user_id", user.id)
    .in("word_id", wordIds);

  const existingByWord = new Map(
    (existing ?? []).map((r) => [
      r.word_id,
      { total: r.total_attempts, correct: r.correct_attempts },
    ])
  );

  const now = new Date().toISOString();
  for (const [wordId, { total, correct }] of byWord) {
    const prev = existingByWord.get(wordId);
    const newTotal = (prev?.total ?? 0) + total;
    const newCorrect = (prev?.correct ?? 0) + correct;
    await supabase.from("user_word_progress").upsert(
      {
        user_id: user.id,
        word_id: wordId,
        total_attempts: newTotal,
        correct_attempts: newCorrect,
        last_seen_at: now,
        updated_at: now,
      },
      { onConflict: "user_id,word_id" }
    );
  }

  if (markComplete) {
    await supabase
      .from("user_level_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("category", category)
      .eq("level", level);
  } else {
    await supabase.from("user_level_progress").upsert(
      {
        user_id: user.id,
        category,
        level,
        current_index: currentIndex,
        correct_count: currentCorrect,
        incorrect_count: currentIncorrect,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,category,level" }
    );
  }

  return { ok: true };
}
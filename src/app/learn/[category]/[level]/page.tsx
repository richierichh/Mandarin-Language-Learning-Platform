import { notFound } from "next/navigation";
import Link from "next/link";
import {
  allCategories,
  categoryLabels,
  getCardsForLevel,
  getLevelCount,
  LEVELS_PER_CATEGORY,
} from "@/data";
import type { VocabularyCategory } from "@/data";
import { FlashcardSession } from "@/components/flashcard-session";
import { createClient } from "@/lib/supabase/server";

interface Params {
  category: string;
  level: string;
}

export function generateStaticParams() {
  const params: Params[] = [];
  for (const cat of allCategories) {
    for (let lvl = 1; lvl <= LEVELS_PER_CATEGORY; lvl++) {
      params.push({ category: cat, level: String(lvl) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, level } = await params;
  const label = categoryLabels[category as VocabularyCategory] ?? category;
  return { title: `${label} — Level ${level} — Mandarin Learn` };
}

export default async function LevelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, level: levelStr } = await params;
  const level = Number(levelStr);

  if (
    !allCategories.includes(category as VocabularyCategory) ||
    isNaN(level) ||
    level < 1 ||
    level > getLevelCount(category as VocabularyCategory)
  ) {
    notFound();
  }

  const cards = getCardsForLevel(category as VocabularyCategory, level);
  const label = categoryLabels[category as VocabularyCategory];
  const nextLevel = level + 1;
  const hasNext = nextLevel <= LEVELS_PER_CATEGORY;
  let initialIndex = 0;
  let initialCorrect = 0;
  let initialIncorrect = 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data } = await supabase
      .from("user_level_progress")
      .select("current_index, correct_count, incorrect_count")
      .eq("user_id", user.id)
      .eq("category", category)
      .eq("level", level)
      .maybeSingle();
    if (data?.current_index != null) {
      initialIndex = Math.max(0, Math.min(data.current_index, cards.length - 1));
    }
    if (data?.correct_count != null) initialCorrect = Math.max(0, data.correct_count);
    if (data?.incorrect_count != null) initialIncorrect = Math.max(0, data.incorrect_count);
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold tracking-tight text-zinc-800">
            Mandarin Learn
          </span>
          <span className="text-sm text-zinc-500">
            {label} &middot; Level {level}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <FlashcardSession
          cards={cards}
          backHref="/learn"
          nextHref={hasNext ? `/learn/${category}/${nextLevel}` : undefined}
          category={category}
          level={level}
          initialIndex={initialIndex}
          initialCorrect={initialCorrect}
          initialIncorrect={initialIncorrect}
        />
      </main>
    </div>
  );
}

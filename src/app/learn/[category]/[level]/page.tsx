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

  return (
    <div className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/learn"
            className="text-lg font-semibold tracking-tight text-zinc-800"
          >
            Mandarin Learn
          </Link>
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
        />
      </main>
    </div>
  );
}

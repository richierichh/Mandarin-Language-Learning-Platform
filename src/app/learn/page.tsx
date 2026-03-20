import Link from "next/link";
import {
  allCategories,
  categoryLabels,
  categoryDescriptions,
  LEVELS_PER_CATEGORY,
} from "@/data";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Learn — Mandarin Learn",
};

const categoryIcons: Record<string, string> = {
  greetings: "👋",
  food: "🍜",
  directions: "🧭",
  places: "🏬",
};

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const continueByCategory = new Map<string, number>();

  if (user) {
    const { data } = await supabase
      .from("user_level_progress")
      .select("category, level, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    for (const row of data ?? []) {
      if (!continueByCategory.has(row.category)) {
        continueByCategory.set(row.category, row.level);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-800"
          >
            Mandarin Learn
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">Choose a course</span>
            {user ? (
              <Link
                href="/auth/signout"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign out
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Courses
        </h1>
        <p className="mt-2 text-zinc-500">
          Pick a category and work through 10 levels — 5 new words each.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {allCategories.map((cat) => (
            <div
              key={cat}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {categoryIcons[cat]}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-800">
                    {categoryLabels[cat]}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {categoryDescriptions[cat]}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {Array.from({ length: LEVELS_PER_CATEGORY }, (_, i) => i + 1).map(
                  (lvl) => (
                    <Link
                      key={lvl}
                      href={`/learn/${cat}/${lvl}`}
                      className="flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
                    >
                      {lvl}
                    </Link>
                  ),
                )}
              </div>
              {continueByCategory.has(cat) && (
                <div className="mt-4">
                  <Link
                    href={`/learn/${cat}/${continueByCategory.get(cat)}`}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Continue level {continueByCategory.get(cat)}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#faf9f7] text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold tracking-tight text-zinc-800">
            Mandarin Learn
          </span>
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
      </header>

      <main>
        {/* Hero + Tool description */}
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 text-center md:pt-24 md:pb-28">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
            Learn Mandarin,{" "}
            <span className="text-amber-600">one step at a time</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 sm:text-xl">
            A focused language tool that utilizes the best learning strategies to teach you vocabulary,
            and practice so you build real skills.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
            Track your progress, review what you’ve learned, and keep your streak
            going with a simple flow designed for busy learners.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Start Learning
            </Link>
          </div>
        </section>

        {/* Learning flow overview */}
        <section className="border-y border-zinc-200/80 bg-white/50">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
            <h2 className="text-center text-2xl font-semibold text-zinc-800 sm:text-3xl">
              How learning works
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-zinc-500">
              A clear path from new words to lasting recall.
            </p>
            <ul className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Discover",
                  description:
                    "See new words and characters with pinyin and meanings so you learn in context.",
                },
                {
                  step: "2",
                  title: "Practice",
                  description:
                    "Answer prompts and exercises to reinforce what you just learned.",
                },
                {
                  step: "3",
                  title: "Review",
                  description:
                    "Revisit past lessons and weak spots so they stick in long-term memory.",
                },
                {
                  step: "4",
                  title: "Track",
                  description:
                    "Watch your progress and streaks so you stay motivated and consistent.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="relative rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm"
                >
                  <span
                    className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white"
                    aria-hidden
                  >
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

      <footer className="border-t border-zinc-200/80 py-6 text-center text-sm text-zinc-400">
        <div className="mx-auto max-w-5xl px-4">
          Mandarin Learn — build your vocabulary and confidence, step by step.
        </div>
      </footer>
    </div>
  );
}
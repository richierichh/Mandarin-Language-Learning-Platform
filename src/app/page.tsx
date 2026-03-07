import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-4 dark:bg-black">
      <main className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Next.js + Supabase + OAuth
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          TypeScript, Tailwind, and Google sign-in are set up.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {user ? (
            <>
              <p className="text-sm text-zinc-500">
                Signed in as{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {user.email}
                </span>
              </p>
              <Link
                href="/auth/signout"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign in with Google
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

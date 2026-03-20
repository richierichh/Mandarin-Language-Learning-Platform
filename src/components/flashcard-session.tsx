"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { VocabularyEntry } from "@/data/vocabulary.types";
import { Flashcard } from "./flashcard";
import { ProgressBar } from "./progress-bar";
import Link from "next/link";
import { saveProgressAndExit } from "@/app/learn/actions";

interface FlashcardSessionProps {
  cards: VocabularyEntry[];
  backHref?: string;
  nextHref?: string;
  category?: string;
  level?: number;
  initialIndex?: number;
  initialCorrect?: number;
  initialIncorrect?: number;
}

export function FlashcardSession({
  cards,
  backHref = "/",
  nextHref,
  category,
  level,
  initialIndex = 0,
  initialCorrect = 0,
  initialIncorrect = 0,
}: FlashcardSessionProps) {
  const router = useRouter();
  const [index, setIndex] = useState(initialIndex);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(initialCorrect);
  const [incorrect, setIncorrect] = useState(initialIncorrect);
  const [answered, setAnswered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const sessionStartedAt = useRef(Date.now());
  const [attempts, setAttempts] = useState<{ wordId: string; correct: boolean }[]>([]);
  const finished = index >= cards.length;

  const handleFlip = useCallback(() => {
    if (!answered) setFlipped((f) => !f);
  }, [answered]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (answered) return;
      const card = cards[index];
      if (card) setAttempts((a) => [...a, { wordId: card.id, correct: isCorrect }]);
      if (isCorrect) setCorrect((c) => c + 1);
      else setIncorrect((c) => c + 1);
      setAnswered(true);
    },
    [answered, cards, index],
  );

  const handleNext = useCallback(() => {
    setIndex((i) => i + 1);
    setFlipped(false);
    setAnswered(false);
  }, []);

  const handleRestart = useCallback(() => {
    setIndex(0);
    setFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setAnswered(false);
    setAttempts([]);
    setFinalized(false);
  }, []);

  const handleSaveAndExit = useCallback(async () => {
    if (exiting) return;
    setExiting(true);
    if (category != null && level != null) {
      const result = await saveProgressAndExit({
        category,
        level,
        startedAt: sessionStartedAt.current,
        attempts,
        currentIndex: index,
        currentCorrect: correct,
        currentIncorrect: incorrect,
      });
      if (result?.error) {
        setExiting(false);
        return;
      }
    }
    router.push(backHref);
  }, [backHref, category, level, attempts, exiting, index, correct, incorrect]);

  useEffect(() => {
    if (!finished || finalized || category == null || level == null) return;

    let cancelled = false;
    const persistCompletion = async () => {
      const result = await saveProgressAndExit({
        category,
        level,
        startedAt: sessionStartedAt.current,
        attempts,
        currentIndex: cards.length,
        currentCorrect: correct,
        currentIncorrect: incorrect,
        markComplete: true,
      });
      if (!cancelled && !result?.error) setFinalized(true);
    };
    void persistCompletion();

    return () => {
      cancelled = true;
    };
  }, [finished, finalized, category, level, attempts, cards.length, correct, incorrect]);

  if (cards.length === 0) {
    return (
      <p className="py-20 text-center text-zinc-500">
        No cards available. Try another category.
      </p>
    );
  }

  if (finished) {
    const total = correct + incorrect;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h2 className="text-3xl font-bold text-zinc-900">Level complete!</h2>
        <p className="mt-4 text-lg text-zinc-600">
          You scored{" "}
          <span className="font-semibold text-amber-600">{pct}%</span> —{" "}
          {correct} correct out of {total}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={handleSaveAndExit}
            disabled={exiting}
            className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            {exiting ? "Saving…" : "All courses"}
          </button>
          {nextHref && (
            <Link
              href={nextHref}
              className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-amber-600"
            >
              Next level
            </Link>
          )}
        </div>
      </div>
    );
  }

  const card = cards[index];

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Save and exit — back to course page */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveAndExit}
          disabled={exiting}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
        >
          {exiting ? "Saving…" : "Save and exit"}
        </button>
      </div>

      {/* Score counters */}
      <div className="flex items-center justify-center gap-6 text-sm font-medium">
        <span className="flex items-center gap-1.5 text-emerald-600">
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {correct}
        </span>
        <span className="flex items-center gap-1.5 text-rose-500">
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {incorrect}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <ProgressBar current={index} total={cards.length} />
      </div>

      {/* Flashcard */}
      <div className="mt-8">
        <Flashcard
          chinese={card.chinese}
          pinyin={card.pinyin}
          english={card.english}
          flipped={flipped}
          onFlip={handleFlip}
        />
      </div>

      {/* Answer buttons — visible once card is flipped */}
      {flipped && !answered && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Incorrect
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-100"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Correct
          </button>
        </div>
      )}

      {/* Next button — visible after answering */}
      {answered && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white shadow transition hover:bg-amber-600"
          >
            {index + 1 < cards.length ? "Next card" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}

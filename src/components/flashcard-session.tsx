"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { VocabularyEntry } from "@/data/vocabulary.types";
import {
  Flashcard,
  PRONUNCIATION_PASS_SCORE,
  PRONUNCIATION_STRICT,
  type PronunciationGradeResult,
} from "./flashcard";
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
  const [deck, setDeck] = useState<VocabularyEntry[]>(() => [...cards]);
  const [index, setIndex] = useState(initialIndex);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(initialCorrect);
  const [incorrect, setIncorrect] = useState(initialIncorrect);
  const [answered, setAnswered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const sessionStartedAt = useRef(Date.now());
  const [attempts, setAttempts] = useState<{ wordId: string; correct: boolean }[]>([]);
  const missCountRef = useRef<Map<string, number>>(new Map());
  const [pronunciationGrade, setPronunciationGrade] =
    useState<PronunciationGradeResult | null>(null);
  /** How many scaffold steps to show (1 = first step only); reset when a new grade arrives. */
  const [scaffoldVisibleSteps, setScaffoldVisibleSteps] = useState(1);
  const [pronunciationPrep, setPronunciationPrep] = useState(false);
  const finished = index >= deck.length;
  const isRetryCard = index >= cards.length;

  useEffect(() => {
    if (pronunciationGrade != null) setScaffoldVisibleSteps(1);
  }, [pronunciationGrade]);

  const handleFlip = useCallback(() => {
    if (!answered) setFlipped((f) => !f);
  }, [answered]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (answered) return;
      const card = deck[index];
      if (!card) return;
      setAttempts((a) => [...a, { wordId: card.id, correct: isCorrect }]);
      if (isCorrect) {
        setCorrect((c) => c + 1);
      } else {
        const misses = (missCountRef.current.get(card.id) ?? 0) + 1;
        missCountRef.current.set(card.id, misses);
        if (misses >= 2) {
          setIncorrect((c) => c + 1);
        } else {
          setDeck((d) => [...d, card]);
        }
      }
      setAnswered(true);
    },
    [answered, deck, index],
  );

  const handleNext = useCallback(() => {
    setIndex((i) => i + 1);
    setFlipped(false);
    setAnswered(false);
    setPronunciationGrade(null);
    setScaffoldVisibleSteps(1);
  }, []);

  const handleRestart = useCallback(() => {
    setDeck([...cards]);
    setIndex(0);
    setFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setAnswered(false);
    setAttempts([]);
    missCountRef.current.clear();
    setFinalized(false);
    setPronunciationGrade(null);
    setScaffoldVisibleSteps(1);
  }, [cards]);

  const handlePronunciationGraded = useCallback(
    (result: PronunciationGradeResult) => {
      setPronunciationGrade(result);
      handleAnswer(result.correct);
    },
    [handleAnswer],
  );

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
        currentIndex: deck.length,
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
  }, [finished, finalized, category, level, attempts, deck.length, correct, incorrect]);

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
          <span className="font-semibold text-amber-600">{pct}%</span>.{" "}
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

  const card = deck[index];

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Save and exit: back to course page */}
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
        <ProgressBar current={correct + incorrect} total={cards.length} />
      </div>

      {isRetryCard && (
        <p className="mt-3 text-center text-xs font-medium text-amber-600">
          Retry — try this word once more
        </p>
      )}

      {/* Flashcard */}
      <div className="mt-8">
        <Flashcard
          chinese={card.chinese}
          pinyin={card.pinyin}
          english={card.english}
          flipped={flipped}
          onFlip={handleFlip}
          pronunciationDisabled={answered}
          onPronunciationGraded={handlePronunciationGraded}
          onPronunciationFeedbackLoading={setPronunciationPrep}
        />
      </div>

      {pronunciationPrep && (
        <p className="mt-4 text-center text-sm text-zinc-500" aria-live="polite">
          Connecting to speech service…
        </p>
      )}

      {pronunciationGrade != null && (
        <div
          className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-5 py-5 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <p
            className={`text-center text-lg font-semibold ${
              pronunciationGrade.correct ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {pronunciationGrade.correct ? "Correct!" : "Incorrect"}
          </p>

          {pronunciationGrade.score != null ? (
            <div className="mt-3 space-y-3">
              {pronunciationGrade.recognizedText && (
                <p className="text-center text-sm text-zinc-500">
                  You said: <span className="font-medium text-zinc-700">{pronunciationGrade.recognizedText}</span>
                </p>
              )}

              <div className="flex items-center justify-center gap-1.5 text-sm text-zinc-600">
                <span>Overall:</span>
                <span className="font-semibold tabular-nums text-zinc-900">
                  {Math.round(pronunciationGrade.score)}
                </span>
                <span className="text-zinc-400">/ 100</span>
                <span className="text-zinc-400 text-xs">(pass: {PRONUNCIATION_PASS_SCORE})</span>
              </div>

              {pronunciationGrade.azurePronScore != null &&
                Math.round(pronunciationGrade.azurePronScore) !==
                  Math.round(pronunciationGrade.score ?? 0) && (
                  <p className="text-center text-xs text-zinc-500">
                    Weakest segment (Azure):{" "}
                    <span className="tabular-nums font-medium text-zinc-700">
                      {Math.round(pronunciationGrade.azurePronScore)}
                    </span>
                    {" · "}
                    Adjusted for grading:{" "}
                    <span className="tabular-nums font-medium text-zinc-700">
                      {Math.round(pronunciationGrade.score ?? 0)}
                    </span>
                  </p>
                )}

              {pronunciationGrade.usedMinAcrossSegments && (
                <p className="text-center text-xs text-zinc-400">
                  Several phrases were detected in one recording; the score reflects the weakest part.
                </p>
              )}

              {PRONUNCIATION_STRICT &&
                (pronunciationGrade.lexicalGateFailed || pronunciationGrade.wordGateFailed) && (
                  <p className="text-center text-xs font-medium text-rose-600/90">
                    {pronunciationGrade.lexicalGateFailed
                      ? "What we heard didn’t match this card’s Chinese text. "
                      : ""}
                    {pronunciationGrade.wordGateFailed
                      ? "At least one syllable was below the strict word threshold or marked mispronounced."
                      : ""}
                  </p>
                )}

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {pronunciationGrade.accuracyScore != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Accuracy</span>
                    <span className="font-medium tabular-nums text-zinc-800">
                      {Math.round(pronunciationGrade.accuracyScore)}
                    </span>
                  </div>
                )}
                {pronunciationGrade.fluencyScore != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Fluency</span>
                    <span className="font-medium tabular-nums text-zinc-800">
                      {Math.round(pronunciationGrade.fluencyScore)}
                    </span>
                  </div>
                )}
                {pronunciationGrade.completenessScore != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Completeness</span>
                    <span className="font-medium tabular-nums text-zinc-800">
                      {Math.round(pronunciationGrade.completenessScore)}
                    </span>
                  </div>
                )}
                {pronunciationGrade.prosodyScore != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Prosody</span>
                    <span className="font-medium tabular-nums text-zinc-800">
                      {Math.round(pronunciationGrade.prosodyScore)}
                    </span>
                  </div>
                )}
              </div>

              {pronunciationGrade.scaffold?.levels?.length ? (
                <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
                  {pronunciationGrade.scaffold.levels.slice(0, scaffoldVisibleSteps).map((step) => (
                    <div key={step.level} className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700/90">
                        Step {step.level}: {step.headline}
                      </p>
                      {step.errorExplanation ? (
                        <p className="text-sm leading-relaxed text-zinc-700 border-l-2 border-amber-400 pl-3">
                          {step.errorExplanation}
                        </p>
                      ) : null}
                      <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600">
                        {step.hints.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      {step.weakSyllables?.length ? (
                        <p className="text-sm font-medium text-zinc-800">
                          Target syllable:{" "}
                          <span className="text-amber-700">
                            {step.weakSyllables.map((w) => w.expected).join(", ")}
                          </span>
                          {step.weakSyllables[0]?.issue === "tone" ? (
                            <span className="ml-2 font-normal text-xs text-zinc-500">
                              (tone)
                            </span>
                          ) : null}
                          {step.weakSyllables[0]?.issue === "vowel" ? (
                            <span className="ml-2 font-normal text-xs text-zinc-500">
                              (vowel)
                            </span>
                          ) : null}
                          {step.weakSyllables[0]?.issue === "omission" ? (
                            <span className="ml-2 font-normal text-xs text-zinc-500">
                              (missing / quiet)
                            </span>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                  ))}
                  {scaffoldVisibleSteps < pronunciationGrade.scaffold.levels.length && (
                    <button
                      type="button"
                      className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
                      onClick={() =>
                        setScaffoldVisibleSteps((n) =>
                          Math.min(n + 1, pronunciationGrade.scaffold!.levels.length),
                        )
                      }
                    >
                      Show more help
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-center text-sm text-zinc-500">
              {pronunciationGrade.errorReason ??
                "No speech detected. Make sure your microphone is allowed and speak clearly before the silence timeout."}
            </p>
          )}
        </div>
      )}

      {/* Answer buttons: visible once card is flipped */}
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

      {/* Next button: visible after answering */}
      {answered && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white shadow transition hover:bg-amber-600"
          >
            {index + 1 < deck.length ? "Next card" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}

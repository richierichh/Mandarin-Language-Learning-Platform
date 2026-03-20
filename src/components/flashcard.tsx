"use client";

import { useCallback, useRef, useState } from "react";

interface FlashcardProps {
  chinese: string;
  pinyin: string;
  english: string;
  flipped: boolean;
  onFlip: () => void;
}

const audioCache = new Map<string, string>();
const fetchingFor = new Map<string, Promise<string>>();

async function getAudioUrl(text: string): Promise<string> {
  const cached = audioCache.get(text);
  if (cached) return cached;

  const pending = fetchingFor.get(text);
  if (pending) return pending;

  const promise = (async () => {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("TTS request failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioCache.set(text, url);
    return url;
  })();

  fetchingFor.set(text, promise);
  try {
    return await promise;
  } finally {
    fetchingFor.delete(text);
  }
}

function PlayButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (state === "playing") {
        audioRef.current?.pause();
        setState("idle");
        return;
      }

      if (state === "loading") return;

      setState("loading");
      try {
        const url = await getAudioUrl(text);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setState("idle");
        audio.onerror = () => setState("idle");
        await audio.play();
        setState("playing");
      } catch {
        setState("idle");
      }
    },
    [state, text],
  );

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={state === "playing" ? "Stop audio" : "Play pronunciation"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 transition hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 active:scale-95"
    >
      {state === "loading" ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : state === "playing" ? (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <rect x="5" y="4" width="3" height="12" rx="1" />
          <rect x="12" y="4" width="3" height="12" rx="1" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.784L4.13 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.13l4.253-3.784A1 1 0 019.383 3.076zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10a7.971 7.971 0 00-2.343-5.657 1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" />
        </svg>
      )}
    </button>
  );
}

export function Flashcard({
  chinese,
  pinyin,
  english,
  flipped,
  onFlip,
}: FlashcardProps) {
  return (
    <div className="perspective-[800px] w-full max-w-md mx-auto">
      <button
        type="button"
        onClick={onFlip}
        className="relative w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative w-full transition-transform duration-500 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front — Chinese character */}
          <div
            className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-16 shadow-md sm:py-20"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-7xl font-bold text-zinc-900 sm:text-8xl">
              {chinese}
            </p>
            <p className="mt-4 text-xl text-zinc-400">{pinyin}</p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <PlayButton text={chinese} />
              <span className="text-xs text-zinc-400">AI audio</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">Tap to reveal</p>
          </div>

          {/* Back — English translation */}
          <div
            className="absolute inset-0 w-full rounded-2xl border border-zinc-200 bg-white px-6 py-16 shadow-md sm:py-20"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-5xl font-bold text-amber-600 sm:text-6xl">
              {chinese}
            </p>
            <p className="mt-2 text-lg text-zinc-400">{pinyin}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <PlayButton text={chinese} />
              <span className="text-xs text-zinc-400">AI audio</span>
            </div>
            <p className="mt-6 text-2xl font-semibold text-zinc-700 sm:text-3xl">
              {english}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

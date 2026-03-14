"use client";

interface FlashcardProps {
  chinese: string;
  pinyin: string;
  english: string;
  flipped: boolean;
  onFlip: () => void;
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
            <p className="mt-8 text-sm text-zinc-400">Tap to reveal</p>
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
            <p className="mt-6 text-2xl font-semibold text-zinc-700 sm:text-3xl">
              {english}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

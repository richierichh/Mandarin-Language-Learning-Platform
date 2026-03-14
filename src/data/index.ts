export type { VocabularyEntry, VocabularyCategory } from "./vocabulary.types";
export { mandarinVocabulary } from "./mandarin-vocabulary";

import type { VocabularyCategory, VocabularyEntry } from "./vocabulary.types";
import { mandarinVocabulary } from "./mandarin-vocabulary";

export const LEVELS_PER_CATEGORY = 10;

export const categoryLabels: Record<VocabularyCategory, string> = {
  greetings: "Greetings",
  food: "Food & Drink",
  directions: "Directions",
  places: "Places",
};

export const categoryDescriptions: Record<VocabularyCategory, string> = {
  greetings: "Hello, thank you, introductions, and polite phrases",
  food: "Ordering food, drinks, dietary needs, and restaurant phrases",
  directions: "Left, right, asking for directions, and getting around",
  places: "Hotels, malls, washrooms, stations, and landmarks",
};

export const allCategories: VocabularyCategory[] = [
  "greetings",
  "food",
  "directions",
  "places",
];

export function getCardsForLevel(
  category: VocabularyCategory,
  level: number,
): VocabularyEntry[] {
  return mandarinVocabulary.filter(
    (e) => e.category === category && e.level === level,
  );
}

export function getLevelCount(category: VocabularyCategory): number {
  const levels = new Set(
    mandarinVocabulary
      .filter((e) => e.category === category)
      .map((e) => e.level),
  );
  return levels.size;
}

export function getLevelLabel(level: number): string {
  return `Level ${level}`;
}

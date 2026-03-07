export type { VocabularyEntry, VocabularyCategory } from "./vocabulary.types";
export { mandarinVocabulary } from "./mandarin-vocabulary";

import type { VocabularyCategory } from "./vocabulary.types";
import { mandarinVocabulary } from "./mandarin-vocabulary";

/** Get vocabulary filtered by category (or all if no category). */
export function getVocabularyByCategory(
  category?: VocabularyCategory
): typeof mandarinVocabulary {
  if (!category) return mandarinVocabulary;
  return mandarinVocabulary.filter((e) => e.category === category);
}

/** Category labels for UI. */
export const categoryLabels: Record<VocabularyCategory, string> = {
  greetings: "Greetings",
  food: "Food & drink",
  directions: "Directions & places",
  transport: "Transport",
  shopping: "Shopping & money",
};

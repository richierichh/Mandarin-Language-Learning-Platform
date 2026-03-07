/**
 * Vocabulary entry for Mandarin language learning.
 * Pinyin uses tone marks (e.g. nǐ hǎo); optional toneNumbers for display/quiz.
 */
export type VocabularyCategory =
  | "greetings"
  | "food"
  | "directions"
  | "transport"
  | "shopping";

export interface VocabularyEntry {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  category: VocabularyCategory;
  /** Optional: phrase vs single word, or notes for learners */
  notes?: string;
}

export type VocabularyCategory =
  | "greetings"
  | "food"
  | "directions"
  | "places";

export interface VocabularyEntry {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  category: VocabularyCategory;
  /** 1-based level within this category */
  level: number;
  notes?: string;
}

/**
 * Learner-facing scaffolding from Azure Pronunciation Assessment JSON.
 * Note: Azure scores speech against reference Chinese (Hanzi); pinyin here is our
 * curriculum string aligned to syllables/words for hints, not passed to Azure as referenceText.
 */

export type WeakSyllableIssue = "tone" | "vowel" | "omission" | "other";

export interface WeakSyllableHint {
  expected: string;
  issue: WeakSyllableIssue;
  score?: number;
}

export interface PronunciationScaffoldLevelContent {
  level: 1 | 2 | 3;
  headline: string;
  hints: string[];
  weakSyllables?: WeakSyllableHint[];
  /** Short “what went wrong” copy (tone vs vowel vs omission); shown above bullet hints. */
  errorExplanation?: string;
}

export interface AssessmentUnit {
  /** Surface form from Azure (character, word fragment, or phoneme label). */
  text: string;
  accuracyScore?: number;
  pronScore?: number;
  errorType?: string;
}

export interface PronunciationScaffold {
  /** Ordered steps; session UI may reveal 1 → 2 → 3 via “More help”. */
  levels: PronunciationScaffoldLevelContent[];
  /** Finest-grain units extracted from NBest for optional UI/diagnostics. */
  units?: AssessmentUnit[];
}

/**
 * Sample JsonResult shape (NBest[0]):
 * @see https://learn.microsoft.com/azure/ai-services/speech-service/how-to-pronunciation-assessment
 */
export interface AzureAssessmentWord {
  Word?: string;
  Phonemes?: Array<{
    Phoneme?: string;
    PronunciationAssessment?: {
      AccuracyScore?: number;
      PronScore?: number;
      ErrorType?: string;
    };
  }>;
  PronunciationAssessment?: {
    AccuracyScore?: number;
    PronScore?: number;
    ErrorType?: string;
  };
}

export function parseAssessmentNBest(jsonResult: string): {
  words?: AzureAssessmentWord[];
} | null {
  try {
    const parsed = JSON.parse(jsonResult) as {
      NBest?: Array<{ Words?: AzureAssessmentWord[] }>;
    };
    const words = parsed.NBest?.[0]?.Words;
    return words?.length ? { words } : { words: undefined };
  } catch {
    return null;
  }
}

/** NFC + strip whitespace for comparing ASR transcript to reference Hanzi. */
export function normalizeForLexicalComparison(s: string): string {
  return s.normalize("NFC").replace(/\s+/g, "").trim();
}

export interface PronunciationSegmentSnapshot {
  pronScore: number;
  recognizedText: string;
  jsonResult: string;
  words?: AzureAssessmentWord[];
  assessment: {
    AccuracyScore?: number;
    FluencyScore?: number;
    CompletenessScore?: number;
    ProsodyScore?: number;
    PronScore?: number;
  };
}

export interface StrictGradingOptions {
  strictMode: boolean;
  passScore: number;
  /** Fail word-level gate when any word AccuracyScore is below this (strict only). */
  minWordAccuracy: number;
  /** When lexical transcript ≠ reference, cap effective score at this value. */
  lexicalMismatchCap: number;
}

export interface StrictGradingResult {
  /** Score after segment-min, word-min, and lexical cap (used for pass/fail and scaffold). */
  effectiveScore: number;
  /** Azure aggregate PronScore before client gates (after multi-segment min only). */
  azurePronScore: number;
  correct: boolean;
  lexicalMatch: boolean;
  lexicalGateFailed: boolean;
  wordGateFailed: boolean;
  anyWordMispronunciation: boolean;
  minWordAccuracy: number | null;
  segmentCount: number;
  /** True when multiple `recognized` events were merged using min(PronScore). */
  usedMinAcrossSegments: boolean;
  /** Snapshot used for word breakdown (lowest segment PronScore). */
  detailSnapshot: PronunciationSegmentSnapshot;
  joinedRecognizedText: string;
}

/** Collect per-word scores from Azure Words[] (word-level row, not phoneme rows). */
export function wordLevelMetricsFromAzureWords(words: AzureAssessmentWord[] | undefined): {
  minAccuracy: number | null;
  anyMispronunciation: boolean;
} {
  if (!words?.length) return { minAccuracy: null, anyMispronunciation: false };
  let minAcc = Infinity;
  let anyMispronunciation = false;
  for (const w of words) {
    const pa = w.PronunciationAssessment;
    if (pa?.AccuracyScore != null && pa.AccuracyScore < minAcc) minAcc = pa.AccuracyScore;
    const et = (pa?.ErrorType ?? "").toLowerCase();
    if (et.includes("mispronunciation")) anyMispronunciation = true;
  }
  return {
    minAccuracy: minAcc === Infinity ? null : minAcc,
    anyMispronunciation,
  };
}

/**
 * Stricter pass/fail than raw PronScore alone: optional lexical transcript gate, word-level floor,
 * and min(PronScore) across continuous-recognition segments. zh-CN tone discrimination is still
 * bounded by the Azure model (prosody nuances are documented for en-US).
 */
export function computeStrictPronunciationGrade(
  expectedChinese: string,
  segments: PronunciationSegmentSnapshot[],
  options: StrictGradingOptions,
): StrictGradingResult | null {
  if (!segments.length) return null;

  let worstIdx = 0;
  let minPron = segments[0].pronScore;
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].pronScore < minPron) {
      minPron = segments[i].pronScore;
      worstIdx = i;
    }
  }

  const detail = segments[worstIdx];
  const joinedRecognized = segments.map((s) => s.recognizedText).join("");
  const refNorm = normalizeForLexicalComparison(expectedChinese);
  const recNorm = normalizeForLexicalComparison(joinedRecognized);
  const lexicalMatch = !recNorm || recNorm === refNorm;

  const { minAccuracy, anyMispronunciation } = wordLevelMetricsFromAzureWords(detail.words);
  let effectiveScore = minPron;

  let lexicalGateFailed = false;
  let wordGateFailed = false;

  if (options.strictMode) {
    if (minAccuracy != null) {
      effectiveScore = Math.min(effectiveScore, minAccuracy);
    }
    if (recNorm && refNorm && recNorm !== refNorm) {
      lexicalGateFailed = true;
      effectiveScore = Math.min(effectiveScore, options.lexicalMismatchCap);
    }
    if (anyMispronunciation) wordGateFailed = true;
    if (minAccuracy != null && minAccuracy < options.minWordAccuracy) wordGateFailed = true;
  }

  const correct =
    effectiveScore >= options.passScore && !lexicalGateFailed && !wordGateFailed;

  return {
    effectiveScore,
    azurePronScore: minPron,
    correct,
    lexicalMatch,
    lexicalGateFailed,
    wordGateFailed,
    anyWordMispronunciation: anyMispronunciation,
    minWordAccuracy: minAccuracy,
    segmentCount: segments.length,
    usedMinAcrossSegments: segments.length > 1,
    detailSnapshot: detail,
    joinedRecognizedText: joinedRecognized,
  };
}

function splitExpectedPinyin(expectedPinyin: string): string[] {
  return expectedPinyin
    .trim()
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function ordinal(n: number): string {
  const labels = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
  if (n >= 0 && n < labels.length) return labels[n];
  return `${n + 1}th`;
}

function pinyinHasToneMark(syllable: string): boolean {
  return /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛ]/.test(
    syllable,
  );
}

/** Map Azure ErrorType + our pinyin to a coarse issue for learner copy. */
function issueFromErrorType(
  errorType: string | undefined,
  expectedSyllable?: string,
): WeakSyllableIssue {
  const t = (errorType ?? "").toLowerCase();
  if (t.includes("omit")) return "omission";
  if (t.includes("mispronunciation") || t.includes("mispron")) {
    if (expectedSyllable && pinyinHasToneMark(expectedSyllable)) return "tone";
    return "other";
  }
  return "other";
}

/** 1–4 from tone diacritics; neutral / unknown → null. */
export function detectToneNumber(syllable: string): 1 | 2 | 3 | 4 | null {
  if (/[āēīōūǖĀĒĪŌŪǕ]/.test(syllable)) return 1;
  if (/[áéíóúǘÁÉÍÓÚǗ]/.test(syllable)) return 2;
  if (/[ǎěǐǒǔǚǍĚǏǑǓǙ]/.test(syllable)) return 3;
  if (/[àèìòùǜÀÈÌÒÙǛ]/.test(syllable) || /4$/.test(syllable.trim())) return 4;
  return null;
}

/**
 * Learner-facing explanation for the weak syllable (no abstract “contour” jargon).
 * Azure does not report “wrong tone vs wrong vowel”; we infer tone focus when pinyin has tone marks.
 */
export function buildPronunciationErrorExplanation(
  issue: WeakSyllableIssue,
  expectedSyllable: string,
): string {
  switch (issue) {
    case "tone": {
      const n = detectToneNumber(expectedSyllable);
      if (n === 1) {
        return "First tone is high and level. Keep pitch steady through the whole syllable, like humming on one note.";
      }
      if (n === 2) {
        return "Second tone rises in pitch (like the “what?” in English). If it sounds flat, the word won’t match what listeners expect.";
      }
      if (n === 3) {
        return "Third tone usually dips then rises; in fast speech it can sound low. It’s often confused with second tone. Compare carefully with the model.";
      }
      if (n === 4) {
        return "Fourth tone falls sharply from high to low. A weak or rising ending here often reads as a different word.";
      }
      return `Mandarin uses tone on every full syllable. Practice **${expectedSyllable}** with the model until the pitch pattern feels natural.`;
    }
    case "vowel":
      return "The vowel quality or length in this syllable didn’t match closely enough. Watch lip/jaw position on the model audio, not only loudness.";
    case "omission":
      return "This chunk was missing or too quiet. Say the whole word smoothly without cutting off early.";
    default:
      return `This part scored lowest. Try **${expectedSyllable}** on its own with the speaker, then put it back in the full phrase.`;
  }
}

/** Flatten Words → phoneme-level units when present, else one unit per word. */
export function assessmentUnitsFromWords(words: AzureAssessmentWord[] | undefined): AssessmentUnit[] {
  if (!words?.length) return [];
  const out: AssessmentUnit[] = [];
  for (const w of words) {
    const phonemes = w.Phonemes;
    if (phonemes?.length) {
      for (const p of phonemes) {
        const pa = p.PronunciationAssessment;
        out.push({
          text: (p.Phoneme ?? "").trim() || (w.Word ?? "?"),
          accuracyScore: pa?.AccuracyScore,
          pronScore: pa?.PronScore,
          errorType: pa?.ErrorType,
        });
      }
    } else {
      const pa = w.PronunciationAssessment;
      out.push({
        text: (w.Word ?? "").trim() || "?",
        accuracyScore: pa?.AccuracyScore,
        pronScore: pa?.PronScore,
        errorType: pa?.ErrorType,
      });
    }
  }
  return out;
}

function weakestUnitIndex(units: AssessmentUnit[]): number {
  let bestIdx = 0;
  let worstScore = Infinity;
  units.forEach((u, i) => {
    const s = u.accuracyScore ?? u.pronScore ?? 100;
    if (s < worstScore) {
      worstScore = s;
      bestIdx = i;
    }
  });
  return bestIdx;
}

/** Map assessment unit index to expected pinyin syllable (by character count or even spread). */
function expectedSyllableForUnitIndex(
  unitIndex: number,
  unitCount: number,
  syllables: string[],
): string | undefined {
  if (!syllables.length) return undefined;
  if (syllables.length === 1) return syllables[0];
  if (unitCount <= 0) return syllables[0];
  const charLen = syllables.length;
  if (unitCount === charLen) return syllables[unitIndex] ?? syllables[syllables.length - 1];
  const ratio = unitIndex / Math.max(1, unitCount - 1);
  const idx = Math.min(charLen - 1, Math.round(ratio * (charLen - 1)));
  return syllables[idx];
}

export function buildPronunciationScaffold(input: {
  expectedChinese: string;
  expectedPinyin: string;
  recognizedText?: string;
  overallPronScore: number;
  passScore: number;
  completenessScore?: number;
  words?: AzureAssessmentWord[];
  /** Optional client-side gates for clearer copy (strict grading). */
  strictDiagnostics?: {
    lexicalMismatch?: boolean;
    wordGateFailed?: boolean;
  };
}): PronunciationScaffold {
  const syllables = splitExpectedPinyin(input.expectedPinyin);
  const units = assessmentUnitsFromWords(input.words);
  const passed = input.overallPronScore >= input.passScore;

  if (passed) {
    return {
      levels: [
        {
          level: 1,
          headline: "Nice pronunciation!",
          hints: [
            "Your score met the pass threshold. Keep using the model audio to stay consistent.",
          ],
        },
      ],
      units: units.length ? units : undefined,
    };
  }

  const weakIdx = units.length ? weakestUnitIndex(units) : -1;
  const weakUnit = weakIdx >= 0 ? units[weakIdx] : undefined;
  const expectedWeak = weakIdx >= 0
    ? expectedSyllableForUnitIndex(weakIdx, units.length, syllables)
    : undefined;
  const weakIssue = issueFromErrorType(weakUnit?.errorType, expectedWeak);
  const comp = input.completenessScore;
  const completenessLow = comp != null && comp < 60;

  const level1Hints: string[] = [];
  if (input.strictDiagnostics?.lexicalMismatch) {
    level1Hints.push(
      "We heard different words than this card. Listen to the model audio and match the phrase.",
    );
  }
  if (input.strictDiagnostics?.wordGateFailed) {
    level1Hints.push(
      "At least one syllable scored low. Slow down and exaggerate the tone on each part.",
    );
  }
  level1Hints.push(
    "You’re close. Try once more with relaxed jaw and a clear final vowel.",
    "Pay extra attention to tones, especially on the stressed syllable.",
  );
  if (completenessLow) {
    level1Hints.push(
      "It sounds like part of the word was cut off. Say the full phrase smoothly before you stop.",
    );
  }

  const level1: PronunciationScaffoldLevelContent = {
    level: 1,
    headline: "Keep going",
    hints: level1Hints,
  };

  const levels: PronunciationScaffoldLevelContent[] = [level1];

  if (units.length && weakIdx >= 0 && expectedWeak) {
    const ord = ordinal(weakIdx);
    levels.push({
      level: 2,
      headline: "Where to focus",
      hints: [
        `The ${ord} part of the word scored lowest. Listen to the model audio and exaggerate that syllable slightly.`,
      ],
    });
    levels.push({
      level: 3,
      headline: weakIssue === "tone" ? "Tone" : "What to fix",
      errorExplanation: buildPronunciationErrorExplanation(weakIssue, expectedWeak),
      hints: [
        "Play the model audio, say this syllable alone, then the whole word again.",
      ],
      weakSyllables: [
        { expected: expectedWeak, issue: weakIssue, score: weakUnit?.accuracyScore },
      ],
    });
  } else {
    const rt = (input.recognizedText ?? "").replace(/\s/g, "");
    const ex = (input.expectedChinese ?? "").replace(/\s/g, "");
    const level2Hints: string[] = [];
    if (rt && ex && rt.length < ex.length) {
      level2Hints.push(
        "Try saying every character in the word. Your recording sounds shorter than the target.",
      );
    } else if (rt && ex && rt.length > ex.length) {
      level2Hints.push(
        "Try not to add extra syllables. Match the model exactly.",
      );
    } else {
      level2Hints.push(
        "Focus on matching the model clip one syllable at a time, then blend them together.",
      );
    }
    levels.push({
      level: 2,
      headline: "Next step",
      hints: level2Hints,
    });
    if (syllables.length) {
      levels.push({
        level: 3,
        headline: "Full pinyin",
        errorExplanation:
          "Azure didn’t return syllable-level detail for this clip. Say the full phrase with the model, matching each syllable, including tone, in order.",
        hints: [`Target: ${syllables.join(" ")}`],
        weakSyllables: syllables.map((s) => ({ expected: s, issue: "other" as const })),
      });
    }
  }

  return { levels, units: units.length ? units : undefined };
}

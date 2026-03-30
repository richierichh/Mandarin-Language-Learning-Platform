"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildPronunciationScaffold,
  computeStrictPronunciationGrade,
  parseAssessmentNBest,
  type AzureAssessmentWord,
  type PronunciationScaffold,
  type PronunciationSegmentSnapshot,
} from "@/lib/pronunciation-scaffold";

const rawPass = Number(process.env.NEXT_PUBLIC_PRONUNCIATION_PASS_SCORE);
/** Default pass threshold (0–100) for pronunciation vs reference text. */
export const PRONUNCIATION_PASS_SCORE = Number.isFinite(rawPass) ? rawPass : 60;

const strictEnv = process.env.NEXT_PUBLIC_PRONUNCIATION_STRICT;
/** Lexical + word-level gates (on only if NEXT_PUBLIC_PRONUNCIATION_STRICT=1|true). */
export const PRONUNCIATION_STRICT =
  strictEnv === "1" || strictEnv === "true";

const rawMinWord = Number(process.env.NEXT_PUBLIC_PRONUNCIATION_MIN_WORD_ACCURACY);
const PRONUNCIATION_MIN_WORD_ACCURACY = Number.isFinite(rawMinWord) ? rawMinWord : 50;

const rawLexCap = Number(process.env.NEXT_PUBLIC_PRONUNCIATION_LEXICAL_MISMATCH_CAP);
const PRONUNCIATION_LEXICAL_CAP = Number.isFinite(rawLexCap) ? rawLexCap : 40;

/** Single-utterance path: closes push stream on stop so `recognizeOnceAsync` completes; enables EnableMiscue in SDK. */
const USE_RECOGNIZE_ONCE = process.env.NEXT_PUBLIC_PRONUNCIATION_RECOGNIZE_ONCE === "1";

export interface PronunciationGradeResult {
  correct: boolean;
  /** Effective score after segment/word/lexical gates (same as historical `score` for pass/fail). */
  score: number | null;
  /** Raw Azure PronScore for the weakest segment before lexical/word fail flags. */
  azurePronScore?: number;
  accuracyScore?: number;
  fluencyScore?: number;
  completenessScore?: number;
  prosodyScore?: number;
  recognizedText?: string;
  /** When Azure returns NoMatch / Canceled / error, this explains what happened. */
  errorReason?: string;
  /** Stepped hints aligned to expected pinyin and Azure unit scores (client-built). */
  scaffold?: PronunciationScaffold;
  /** Word/phoneme rows from the last assessment JSON when present. */
  assessmentWords?: AzureAssessmentWord[];
  lexicalMatch?: boolean;
  lexicalGateFailed?: boolean;
  wordGateFailed?: boolean;
  /** Number of Azure `recognized` segments in this tap (continuous mode may be >1). */
  segmentCount?: number;
  usedMinAcrossSegments?: boolean;
}

interface FlashcardProps {
  chinese: string;
  pinyin: string;
  english: string;
  flipped: boolean;
  onFlip: () => void;
  /** When recording stops, pass/fail from Azure pronunciation scores (threshold). */
  onPronunciationGraded?: (result: PronunciationGradeResult) => void;
  onPronunciationFeedbackLoading?: (loading: boolean) => void;
  onPronunciationFeedbackMessage?: (message: string | null, error: string | null) => void;
  /** Block recording after the card is answered. */
  pronunciationDisabled?: boolean;
  passScore?: number;
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

interface PronunciationScore {
  AccuracyScore?: number;
  FluencyScore?: number;
  CompletenessScore?: number;
  ProsodyScore?: number;
  PronScore?: number;
}

function parseSegmentFromRecognizerResult(
  sdk: typeof import("microsoft-cognitiveservices-speech-sdk"),
  result: {
    reason: number;
    text: string;
    properties: { getProperty: (key: unknown) => string | undefined };
  },
): PronunciationSegmentSnapshot | null {
  if (result.reason !== sdk.ResultReason.RecognizedSpeech) return null;
  const spoken = result.text ?? "";
  const jsonResult =
    result.properties?.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult) ?? "";
  if (!jsonResult) return null;
  try {
    const parsed = JSON.parse(jsonResult) as {
      NBest?: Array<{
        PronunciationAssessment?: PronunciationScore;
        Words?: AzureAssessmentWord[];
      }>;
    };
    const n0 = parsed.NBest?.[0];
    const assessment = n0?.PronunciationAssessment;
    if (assessment?.PronScore == null) return null;
    return {
      pronScore: assessment.PronScore,
      recognizedText: spoken,
      jsonResult,
      words: n0?.Words,
      assessment: {
        AccuracyScore: assessment.AccuracyScore,
        FluencyScore: assessment.FluencyScore,
        CompletenessScore: assessment.CompletenessScore,
        ProsodyScore: assessment.ProsodyScore,
        PronScore: assessment.PronScore,
      },
    };
  } catch {
    return null;
  }
}

function PronunciationButton({
  /** Reference Chinese for Azure PronunciationAssessmentConfig (Hanzi). */
  text,
  expectedPinyin,
  passScore,
  disabled,
  onGraded,
  onFeedbackLoading,
  onFeedbackMessage,
}: {
  text: string;
  expectedPinyin: string;
  passScore: number;
  disabled?: boolean;
  onGraded?: (result: PronunciationGradeResult) => void;
  onFeedbackLoading?: (loading: boolean) => void;
  onFeedbackMessage?: (message: string | null, error: string | null) => void;
}) {
  const recognizerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioPipeRef = useRef<{
    processorNode: ScriptProcessorNode;
    recorderSource: MediaStreamAudioSourceNode;
    recorderAudioCtx: AudioContext;
    pushStream: any;
  } | null>(null);
  const rafRef = useRef<number>(0);
  const lastAssessmentRef = useRef<PronunciationScore | null>(null);
  const lastWordsRef = useRef<AzureAssessmentWord[] | undefined>(undefined);
  const lastJsonResultRef = useRef<string | null>(null);
  const lastRecognizedTextRef = useRef<string | null>(null);
  /** Each Azure `recognized` event (continuous mode may yield several per tap). */
  const segmentsRef = useRef<PronunciationSegmentSnapshot[]>([]);
  const recognitionKindRef = useRef<"continuous" | "once">("continuous");
  const cancelledRef = useRef(false);
  const [state, setState] = useState<"idle" | "starting" | "recording">("idle");
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState(0);

  const stopMicMonitor = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    analyserRef.current = null;
    setMicLevel(0);
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stopAudioPipe = useCallback(() => {
    const pipe = audioPipeRef.current;
    if (!pipe) return;
    audioPipeRef.current = null;
    try { pipe.processorNode.disconnect(); } catch { /* ignore */ }
    try { pipe.recorderSource.disconnect(); } catch { /* ignore */ }
    try { pipe.pushStream.close(); } catch { /* ignore */ }
    void pipe.recorderAudioCtx.close().catch(() => {});
  }, []);

  const closeAll = useCallback((opts?: { silent?: boolean }) => {
    stopMicMonitor();
    stopAudioPipe();
    stopStream();
    const r = recognizerRef.current;
    if (!r) return;
    recognizerRef.current = null;
    if (opts?.silent) {
      try { r.close(); } catch { /* ignore */ }
      return;
    }
    if (recognitionKindRef.current === "once") {
      try { r.close(); } catch { /* ignore */ }
      return;
    }
    r.stopContinuousRecognitionAsync(
      () => { try { r.close(); } catch { /* ignore */ } },
      () => { try { r.close(); } catch { /* ignore */ } },
    );
  }, [stopMicMonitor, stopAudioPipe, stopStream]);

  /** End mic → push stream so `recognizeOnceAsync` can finish (once mode only). */
  const finalizeOnceRecording = useCallback(() => {
    stopMicMonitor();
    const pipe = audioPipeRef.current;
    audioPipeRef.current = null;
    if (pipe) {
      try { pipe.processorNode.disconnect(); } catch { /* ignore */ }
      try { pipe.recorderSource.disconnect(); } catch { /* ignore */ }
      try { pipe.pushStream.close(); } catch { /* ignore */ }
      void pipe.recorderAudioCtx.close().catch(() => {});
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopMicMonitor]);

  const applyPronunciationGrade = useCallback(
    (
      segments: PronunciationSegmentSnapshot[],
      fallback?: {
        assessment: PronunciationScore | null;
        recognized: string | null;
        json: string | null;
        words: AzureAssessmentWord[] | undefined;
      },
    ) => {
      let segs = [...segments];
      if (segs.length === 0 && fallback?.assessment?.PronScore != null) {
        segs = [
          {
            pronScore: fallback.assessment.PronScore,
            recognizedText: fallback.recognized ?? "",
            jsonResult: fallback.json ?? "",
            words: fallback.words,
            assessment: {
              AccuracyScore: fallback.assessment.AccuracyScore,
              FluencyScore: fallback.assessment.FluencyScore,
              CompletenessScore: fallback.assessment.CompletenessScore,
              ProsodyScore: fallback.assessment.ProsodyScore,
              PronScore: fallback.assessment.PronScore,
            },
          },
        ];
      }
      if (!segs.length) {
        setError(null);
        setScore({ PronScore: 0, AccuracyScore: 0, FluencyScore: 0, CompletenessScore: 0 });
        const scaffold = buildPronunciationScaffold({
          expectedChinese: text,
          expectedPinyin,
          overallPronScore: 0,
          passScore,
          completenessScore: 0,
        });
        onGraded?.({
          correct: false,
          score: 0,
          azurePronScore: 0,
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          recognizedText: undefined,
          errorReason: "No speech matched the reference text.",
          scaffold,
          segmentCount: 0,
        });
        onFeedbackMessage?.(null, null);
        return;
      }
      const strict = computeStrictPronunciationGrade(text, segs, {
        strictMode: PRONUNCIATION_STRICT,
        passScore,
        minWordAccuracy: PRONUNCIATION_MIN_WORD_ACCURACY,
        lexicalMismatchCap: PRONUNCIATION_LEXICAL_CAP,
      });
      if (!strict) {
        setError(null);
        setScore({ PronScore: 0, AccuracyScore: 0, FluencyScore: 0, CompletenessScore: 0 });
        const scaffold = buildPronunciationScaffold({
          expectedChinese: text,
          expectedPinyin,
          overallPronScore: 0,
          passScore,
          completenessScore: 0,
        });
        onGraded?.({
          correct: false,
          score: 0,
          azurePronScore: 0,
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          recognizedText: undefined,
          errorReason: "No speech matched the reference text.",
          scaffold,
          segmentCount: 0,
        });
        onFeedbackMessage?.(null, null);
        return;
      }
      setError(null);
      const d = strict.detailSnapshot;
      const parsedWords =
        d.words ?? (d.jsonResult ? parseAssessmentNBest(d.jsonResult)?.words : undefined);
      setScore(d.assessment);
      const scaffold = buildPronunciationScaffold({
        expectedChinese: text,
        expectedPinyin,
        recognizedText: strict.joinedRecognizedText || undefined,
        overallPronScore: strict.effectiveScore,
        passScore,
        completenessScore: d.assessment.CompletenessScore,
        words: parsedWords,
        strictDiagnostics:
          PRONUNCIATION_STRICT ?
            {
              lexicalMismatch: strict.lexicalGateFailed,
              wordGateFailed: strict.wordGateFailed,
            }
          : undefined,
      });
      onGraded?.({
        correct: strict.correct,
        score: strict.effectiveScore,
        azurePronScore: strict.azurePronScore,
        accuracyScore: d.assessment.AccuracyScore,
        fluencyScore: d.assessment.FluencyScore,
        completenessScore: d.assessment.CompletenessScore,
        prosodyScore: d.assessment.ProsodyScore,
        recognizedText: strict.joinedRecognizedText || undefined,
        scaffold,
        assessmentWords: parsedWords,
        lexicalMatch: strict.lexicalMatch,
        lexicalGateFailed: strict.lexicalGateFailed,
        wordGateFailed: strict.wordGateFailed,
        segmentCount: strict.segmentCount,
        usedMinAcrossSegments: strict.usedMinAcrossSegments,
      });
      onFeedbackMessage?.(null, null);
    },
    [text, expectedPinyin, passScore, onGraded, onFeedbackMessage],
  );

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      closeAll({ silent: true });
    };
  }, [closeAll]);

  const handleStop = useCallback(() => {
    const segs = [...segmentsRef.current];
    const fallbackAssessment = lastAssessmentRef.current;
    const fallbackRecognized = lastRecognizedTextRef.current;
    const fallbackJson = lastJsonResultRef.current;
    const fallbackWords = lastWordsRef.current;

    closeAll();
    onFeedbackLoading?.(false);

    applyPronunciationGrade(segs, {
      assessment: fallbackAssessment,
      recognized: fallbackRecognized,
      json: fallbackJson,
      words: fallbackWords,
    });
    setState("idle");
  }, [closeAll, onFeedbackLoading, applyPronunciationGrade]);

  const handleRecord = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;

      if (state === "recording") {
        if (recognitionKindRef.current === "once") {
          finalizeOnceRecording();
          return;
        }
        handleStop();
        return;
      }
      if (state === "starting") {
        cancelledRef.current = true;
        closeAll({ silent: true });
        setState("idle");
        return;
      }

      setError(null);
      setScore(null);
      lastAssessmentRef.current = null;
      lastWordsRef.current = undefined;
      lastJsonResultRef.current = null;
      lastRecognizedTextRef.current = null;
      segmentsRef.current = [];
      cancelledRef.current = false;
      onFeedbackMessage?.(null, null);
      setState("starting");

      try {
        onFeedbackLoading?.(true);
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        streamRef.current = micStream;

        // Audio level monitor
        const audioCtx = new AudioContext();
        const monitorSource = audioCtx.createMediaStreamSource(micStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        monitorSource.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const poll = () => {
          if (!analyserRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
          rafRef.current = requestAnimationFrame(poll);
        };
        poll();

        const tokenRes = await fetch("/api/azure-speech-token", { cache: "no-store" });
        if (!tokenRes.ok) throw new Error("Failed to get Azure speech token");
        const tokenData = (await tokenRes.json()) as {
          token: string;
          region: string;
          language: string;
        };

        const sdk = await import("microsoft-cognitiveservices-speech-sdk");
        const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
          tokenData.token,
          tokenData.region,
        );
        const lang = tokenData.language ?? "zh-CN";
        speechConfig.speechRecognitionLanguage = lang;

        // PCM push stream from explicit mic capture
        const pushStream = sdk.AudioInputStream.createPushStream(
          sdk.AudioStreamFormat.getDefaultInputFormat(),
        );
        const recorderAudioCtx = new AudioContext({ sampleRate: 16000 });
        const recorderSource = recorderAudioCtx.createMediaStreamSource(micStream);
        const processorNode = recorderAudioCtx.createScriptProcessor(2048, 1, 1);
        processorNode.onaudioprocess = (ev: AudioProcessingEvent) => {
          const float32 = ev.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(float32.length);
          for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          pushStream.write(int16.buffer);
        };
        recorderSource.connect(processorNode);
        processorNode.connect(recorderAudioCtx.destination);
        audioPipeRef.current = { processorNode, recorderSource, recorderAudioCtx, pushStream };

        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        recognizerRef.current = recognizer;

        // Reference text must stay as expected Chinese (Hanzi) for zh-CN assessment.
        recognitionKindRef.current = USE_RECOGNIZE_ONCE ? "once" : "continuous";
        const paConfig = new sdk.PronunciationAssessmentConfig(
          text,
          sdk.PronunciationAssessmentGradingSystem.HundredMark,
          sdk.PronunciationAssessmentGranularity.Phoneme,
          USE_RECOGNIZE_ONCE,
        );
        paConfig.applyTo(recognizer);

        recognizer.canceled = (_sender: unknown, event: any) => {
          if (cancelledRef.current) return;
          const detail = event?.errorDetails;
          if (detail) setError(String(detail));
        };

        if (USE_RECOGNIZE_ONCE) {
          recognizer.recognizeOnceAsync(
            (result: any) => {
              if (cancelledRef.current) {
                try { recognizer.close(); } catch { /* ignore */ }
                recognizerRef.current = null;
                setState("idle");
                return;
              }
              recognizerRef.current = null;
              try { recognizer.close(); } catch { /* ignore */ }
              onFeedbackLoading?.(false);
              const snap = parseSegmentFromRecognizerResult(sdk, result);
              segmentsRef.current = snap ? [snap] : [];
              if (!snap) {
                applyPronunciationGrade([]);
                setState("idle");
                return;
              }
              applyPronunciationGrade(segmentsRef.current);
              setState("idle");
            },
            (err: string) => {
              recognizerRef.current = null;
              try { recognizer.close(); } catch { /* ignore */ }
              onFeedbackLoading?.(false);
              setError(err ?? "Recognition failed.");
              setState("idle");
            },
          );
          onFeedbackLoading?.(false);
          setState("recording");
        } else {
          recognizer.recognized = (_sender: unknown, event: any) => {
            const snap = parseSegmentFromRecognizerResult(sdk, event.result);
            if (!snap) return;
            segmentsRef.current.push(snap);
            lastRecognizedTextRef.current = snap.recognizedText;
            lastJsonResultRef.current = snap.jsonResult;
            lastWordsRef.current = snap.words;
            lastAssessmentRef.current = snap.assessment;
            setScore(snap.assessment);
          };

          recognizer.startContinuousRecognitionAsync(
            () => {
              onFeedbackLoading?.(false);
              setState("recording");
            },
            (err: string) => {
              closeAll({ silent: true });
              onFeedbackLoading?.(false);
              setError(err ?? "Could not start microphone recording.");
              setState("idle");
            },
          );
        }
      } catch (err) {
        closeAll({ silent: true });
        onFeedbackLoading?.(false);
        setError(err instanceof Error ? err.message : "Failed to start assessment.");
        setState("idle");
      }
    },
    [
      disabled,
      state,
      closeAll,
      handleStop,
      finalizeOnceRecording,
      text,
      expectedPinyin,
      passScore,
      applyPronunciationGrade,
      onGraded,
      onFeedbackLoading,
      onFeedbackMessage,
    ],
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleRecord}
        disabled={disabled}
        aria-label={state === "recording" ? "Stop and grade" : "Record pronunciation"}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
          state === "recording"
            ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
        }`}
      >
        {state === "starting" ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : state === "recording" ? (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="4" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a3 3 0 00-3 3v5a3 3 0 106 0V5a3 3 0 00-3-3zm-5 8a1 1 0 012 0 3 3 0 006 0 1 1 0 112 0 5 5 0 01-4 4.9V17h2a1 1 0 110 2H7a1 1 0 110-2h2v-2.1A5 5 0 015 10z" />
          </svg>
        )}
      </button>

      {state === "recording" && (
        <div className="flex flex-col items-center gap-1">
          {USE_RECOGNIZE_ONCE ? (
            <p className="text-[10px] text-zinc-500 text-center max-w-[200px]">
              Say the word once, then tap stop. (Single-utterance mode, miscue enabled.)
            </p>
          ) : null}
          <p className="text-[11px] text-rose-600 font-medium">Recording… tap to stop</p>
          <div className="h-1.5 w-24 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-75"
              style={{ width: `${micLevel}%` }}
            />
          </div>
          {score?.PronScore != null && (
            <p className="text-[11px] text-zinc-500">
              Live: <span className="font-medium text-zinc-700">{Math.round(score.PronScore)}</span>
            </p>
          )}
        </div>
      )}
      {score?.PronScore != null && state === "idle" && (
        <p className="text-[11px] text-zinc-400">
          Score: <span className="font-medium text-zinc-600">{Math.round(score.PronScore)}</span>
        </p>
      )}
      {error && state === "idle" && (
        <p className="max-w-[200px] text-center text-[11px] text-rose-500">{error}</p>
      )}
    </div>
  );
}

export function Flashcard({
  chinese,
  pinyin,
  english,
  flipped,
  onFlip,
  onPronunciationGraded,
  onPronunciationFeedbackLoading,
  onPronunciationFeedbackMessage,
  pronunciationDisabled,
  passScore = PRONUNCIATION_PASS_SCORE,
}: FlashcardProps) {
  return (
    <div className="perspective-[800px] w-full max-w-md mx-auto">
      <div
        role="button"
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFlip(); } }}
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
          {/* Front: Chinese character (centered), details below */}
          <div
            className="flex min-h-[22rem] w-full flex-col rounded-2xl border border-zinc-200 bg-white px-6 shadow-md sm:min-h-[26rem]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex flex-1 flex-col items-center justify-center px-2 py-8">
              <p className="text-center text-7xl font-bold leading-none text-zinc-900 sm:text-8xl">
                {chinese}
              </p>
            </div>
            <div className="flex flex-col items-center pb-8 pt-2">
              <p className="text-center text-xl text-zinc-400">{pinyin}</p>
              <p className="mt-3 max-w-sm text-center text-base font-medium leading-snug text-zinc-600">
                {english}
              </p>
              <div className="mt-6 flex items-start justify-center gap-3">
                <PlayButton text={chinese} />
                <PronunciationButton
                  text={chinese}
                  expectedPinyin={pinyin}
                  passScore={passScore}
                  disabled={pronunciationDisabled}
                  onGraded={onPronunciationGraded}
                  onFeedbackLoading={onPronunciationFeedbackLoading}
                  onFeedbackMessage={onPronunciationFeedbackMessage}
                />
              </div>
              <div className="mt-1 flex items-center justify-center gap-4">
                <span className="text-xs text-zinc-400">AI audio</span>
                <span className="text-xs text-zinc-400">Record</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">Tap to reveal</p>
            </div>
          </div>

          {/* Back: Chinese centered, English below */}
          <div
            className="absolute inset-0 flex min-h-[22rem] w-full flex-col rounded-2xl border border-zinc-200 bg-white px-6 shadow-md sm:min-h-[26rem]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex flex-1 flex-col items-center justify-center px-2 py-8">
              <p className="text-center text-5xl font-bold leading-none text-amber-600 sm:text-6xl">
                {chinese}
              </p>
            </div>
            <div className="flex flex-col items-center pb-8 pt-2">
              <p className="text-center text-lg text-zinc-400">{pinyin}</p>
              <div className="mt-4 flex items-start justify-center gap-3">
                <PlayButton text={chinese} />
                <PronunciationButton
                  text={chinese}
                  expectedPinyin={pinyin}
                  passScore={passScore}
                  disabled={pronunciationDisabled}
                  onGraded={onPronunciationGraded}
                  onFeedbackLoading={onPronunciationFeedbackLoading}
                  onFeedbackMessage={onPronunciationFeedbackMessage}
                />
              </div>
              <div className="mt-1 flex items-center justify-center gap-4">
                <span className="text-xs text-zinc-400">AI audio</span>
                <span className="text-xs text-zinc-400">Record</span>
              </div>
              <p className="mt-6 text-center text-2xl font-semibold text-zinc-700 sm:text-3xl">
                {english}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

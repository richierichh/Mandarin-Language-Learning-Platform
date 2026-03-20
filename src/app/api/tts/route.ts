import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const inflight = new Map<string, Promise<Buffer>>();
const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "coral";
const TTS_RESPONSE_FORMAT = "mp3";
const TTS_INSTRUCTIONS =
  "Speak in native Mandarin Chinese. Use clear, natural pronunciation at a moderate pace suitable for language learners.";
const CACHE_VERSION = "v1";
const CACHE_BUCKET = process.env.SUPABASE_TTS_CACHE_BUCKET ?? "tts-cache";

function cacheKey(text: string): string {
  return createHash("sha256")
    .update(
      [
        CACHE_VERSION,
        TTS_MODEL,
        TTS_VOICE,
        TTS_RESPONSE_FORMAT,
        TTS_INSTRUCTIONS,
        text,
      ].join("|"),
    )
    .digest("hex");
}

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey);
}

async function readCache(key: string): Promise<Buffer | null> {
  const supabase = getStorageClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(CACHE_BUCKET)
    .download(`tts/${key}.mp3`);

  if (error || !data) {
    return null;
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function writeCache(key: string, data: Buffer): Promise<void> {
  const supabase = getStorageClient();
  if (!supabase) return;

  const { error } = await supabase.storage
    .from(CACHE_BUCKET)
    .upload(`tts/${key}.mp3`, data, {
      contentType: "audio/mpeg",
      upsert: false,
      cacheControl: "31536000",
    });

  // Another request may have written the same key first; that's fine.
  if (error && !error.message.toLowerCase().includes("already exists")) {
    console.error("Supabase cache write error:", error);
  }
}

async function generateSpeech(text: string): Promise<Buffer> {
  const key = cacheKey(text);

  const cached = await readCache(key);
  if (cached) return cached;

  // Deduplicate concurrent requests for the same text
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const mp3 = await openai.audio.speech.create({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      instructions: TTS_INSTRUCTIONS,
      response_format: TTS_RESPONSE_FORMAT,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await writeCache(key, buffer);
    return buffer;
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text?: string };

    if (!text || text.length > 200) {
      return NextResponse.json(
        { error: "text is required and must be ≤ 200 characters" },
        { status: 400 },
      );
    }

    const buffer = await generateSpeech(text);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 },
    );
  }
}

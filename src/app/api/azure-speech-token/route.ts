import { NextResponse } from "next/server";

export async function GET() {
  const region = process.env.AZURE_SPEECH_REGION;
  const key = process.env.AZURE_SPEECH_KEY;

  if (!region || !key) {
    return NextResponse.json(
      { error: "Missing AZURE_SPEECH_REGION or AZURE_SPEECH_KEY" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": "0",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const details = await res.text();
      return NextResponse.json(
        { error: "Failed to obtain Azure speech token", details },
        { status: 502 },
      );
    }

    const token = await res.text();
    return NextResponse.json(
      {
        token,
        region,
        language: process.env.AZURE_SPEECH_LANGUAGE ?? "zh-CN",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected error obtaining Azure speech token",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

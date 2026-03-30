import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies pronunciation results to your Azure API (Function App, APIM, etc.).
 * Configure AZURE_FEEDBACK_API_URL (required). Optional auth via AZURE_FEEDBACK_API_KEY.
 */
export async function POST(req: NextRequest) {
  const url = process.env.AZURE_FEEDBACK_API_URL;
  if (!url) {
    return NextResponse.json(
      { error: "AZURE_FEEDBACK_API_URL is not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const key = process.env.AZURE_FEEDBACK_API_KEY;
  const headerName = process.env.AZURE_FEEDBACK_API_KEY_HEADER;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (key) {
    if (headerName) {
      headers[headerName] = key;
    } else {
      headers.Authorization = `Bearer ${key}`;
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await res.json()
      : { raw: await res.text() };

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Azure feedback API returned an error",
          status: res.status,
          details: payload,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reach Azure feedback API",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}

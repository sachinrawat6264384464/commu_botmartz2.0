import { NextRequest, NextResponse } from "next/server";

const DEFAULT_INDEXNOW_KEY = "8f4e2b9c1a7d4e6f9b2c3d5e7a1f8c4b";

const DEFAULT_CORE_PATHS = [
  "/",
  "/virtual-ai-internship",
  "/arena",
  "/arena/roadmaps",
  "/arena/bounties",
  "/showcase",
  "/challenges",
  "/discussions",
  "/events",
  "/workshops",
  "/certificates",
  "/leaderboard",
];

function getSiteConfig() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://commu-botmartz2-0.vercel.app").replace(/\/+$/, "");
  const key = process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY;
  const host = new URL(baseUrl).host;
  const keyLocation = `${baseUrl}/${key}.txt`;
  return { baseUrl, key, host, keyLocation };
}

export async function GET() {
  const { host, keyLocation } = getSiteConfig();
  return NextResponse.json({
    ok: true,
    host,
    keyLocation,
    endpoints: ["https://api.indexnow.org/indexnow"],
  });
}

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET || process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD;
  if (expectedSecret) {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { baseUrl, key, host, keyLocation } = getSiteConfig();

  let urlList: string[] = DEFAULT_CORE_PATHS.map((p) => `${baseUrl}${p}`);
  try {
    const body = await req.json();
    if (Array.isArray(body?.urls) && body.urls.length > 0) {
      urlList = body.urls
        .filter((u: unknown): u is string => typeof u === "string" && u.trim().length > 0)
        .map((u: string) => (u.startsWith("http") ? u : `${baseUrl}${u.startsWith("/") ? u : `/${u}`}`));
    }
  } catch {
    // Empty or non-JSON body defaults to submitting core routes
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        submittedCount: urlList.length,
        host,
        keyLocation,
        response: text || null,
      },
      { status: res.ok ? 200 : 502 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "IndexNow request failed" },
      { status: 500 }
    );
  }
}

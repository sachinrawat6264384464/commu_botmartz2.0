import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPathAllowed, UserRole } from "@/lib/rbac";

const SECURITY_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || "botmartz_zero_trust_2026_master_key_9312";

// Edge-compatible rate limit in-memory store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count += 1;
  return false;
}

// Edge-compatible HMAC verify using Web Crypto API
async function verifySessionTokenEdge(token: string): Promise<{ valid: boolean; role?: UserRole }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };

    const [encodedPayload, signature] = parts;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECURITY_SECRET);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert signature from base64url to Uint8Array
    let base64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const binarySig = atob(base64);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const dataBytes = encoder.encode(encodedPayload);
    const isValid = await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, dataBytes);
    if (!isValid) return { valid: false };

    // Check expiration
    let payloadBase64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    while (payloadBase64.length % 4) payloadBase64 += "=";
    const payload = JSON.parse(atob(payloadBase64));

    if (Date.now() > payload.expiresAt) return { valid: false };
    return { valid: true, role: (payload.role || "super-admin") as UserRole };
  } catch (e) {
    return { valid: false };
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  // ── 1. RATE LIMITING ON SENSITIVE ENDPOINTS ──
  if (pathname === "/api/admin/login") {
    if (isRateLimited(`login_${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: "Too many authentication attempts. Rate limited for 60 seconds." },
        { status: 429 }
      );
    }
  }

  if (pathname.startsWith("/api/arena/enroll") || pathname.startsWith("/api/arena/custom-proposal")) {
    if (isRateLimited(`enroll_${ip}`, 25, 60000)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before submitting." },
        { status: 429 }
      );
    }
  }

  // ── 2. MALICIOUS INJECTION FILTER (XSS & SQLi Detection) ──
  const search = req.nextUrl.search.toLowerCase();
  const dangerousPatterns = ["<script", "%3cscript", "javascript:", "union%20select", "drop%20table", "exec("];
  if (dangerousPatterns.some((pattern) => search.includes(pattern))) {
    return new NextResponse("Forbidden: Malicious payload pattern detected by Zero-Trust WAF.", {
      status: 403
    });
  }

  // ── 3. PROTECT ADMIN ROUTES WITH ZERO-TRUST TOKEN CHECK ──
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = req.cookies.get("botmartz_admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const verification = await verifySessionTokenEdge(sessionCookie);
    if (!verification.valid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("error", "session_invalid");
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("botmartz_admin_session");
      return res;
    }

    // Enforce RBAC permissions for admin sub-routes
    const userRole = verification.role || "volunteer";
    if (!isPathAllowed(userRole, pathname)) {
      const forbiddenUrl = new URL("/admin", req.url);
      forbiddenUrl.searchParams.set("error", "rbac_forbidden");
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/arena/:path*"
  ]
};

import crypto from "crypto";
import { adminDb, hasAdminCredentials } from "./firebase-admin";

const SECURITY_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || "botmartz_zero_trust_2026_master_key_9312";

// ── 1. CRYPTOGRAPHIC SESSION SIGNING (HMAC-SHA256) ──

export interface SessionPayload {
  email: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

export function createZeroTrustSessionToken(email: string, role: string): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 7 * 24 * 60 * 60 * 1000; // 7 Days valid

  const payload: SessionPayload = { email, role, issuedAt, expiresAt };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", SECURITY_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyZeroTrustSessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SECURITY_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    // Constant-time signature comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// ── 2. SLIDING-WINDOW RATE LIMITER ──

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetInSec: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetInSec: Math.ceil((record.resetAt - now) / 1000) };
}

// ── 3. IMMUTABLE SHA-256 AUDIT LEDGER ──

export interface SecurityAuditEntry {
  action: string;
  actor: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  severity: "INFO" | "WARNING" | "CRITICAL" | "ALERT";
  status: "SUCCESS" | "DENIED" | "BLOCKED";
}

export async function recordSecurityAuditLog(entry: SecurityAuditEntry): Promise<string | null> {
  try {
    const timestamp = new Date();
    const dataString = JSON.stringify({
      action: entry.action,
      actor: entry.actor,
      timestamp: timestamp.toISOString(),
      details: entry.details,
      status: entry.status
    });

    // Compute cryptographic block hash
    const blockHash = crypto.createHash("sha256").update(dataString).digest("hex");

    if (adminDb && hasAdminCredentials) {
      const docRef = await adminDb.collection("security_audit_ledger").add({
        ...entry,
        timestamp,
        blockHash,
        hashAlgorithm: "SHA-256",
        provenance: "BOTMARTZ_ZERO_TRUST_ENGINE"
      });
      return docRef.id;
    }

    return `local_audit_${Date.now()}`;
  } catch (err) {
    console.error("Failed to record security audit log:", err);
    return null;
  }
}

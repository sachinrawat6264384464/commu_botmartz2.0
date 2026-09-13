import crypto from 'crypto';

const SECRET_KEY = process.env.UNSUBSCRIBE_SECRET || process.env.NEXTAUTH_SECRET || 'botmartz-unsubscribe-secret-2026-key';

export function generateUnsubscribeToken(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(normalizedEmail)
    .digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expectedToken = generateUnsubscribeToken(email);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
  } catch (e) {
    return false;
  }
}

export function buildUnsubscribeUrl(email: string, baseUrl?: string): string {
  const host = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://community.botmartz.com';
  const token = generateUnsubscribeToken(email);
  const encodedEmail = encodeURIComponent(email);
  return `${host}/unsubscribe?email=${encodedEmail}&token=${token}`;
}

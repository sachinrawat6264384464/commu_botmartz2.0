import { adminDb } from '@/lib/firebase-admin';

export type DayName = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

const DAY_INDEX_MAP: Record<number, DayName> = {
  0: 'SUN',
  1: 'MON',
  2: 'TUE',
  3: 'WED',
  4: 'THU',
  5: 'FRI',
  6: 'SAT',
};

export function getSystemAllowedDays(): DayName[] {
  const envDays = process.env.EMAIL_ALLOWED_DAYS;
  if (envDays) {
    return envDays.split(',').map((d) => d.trim().toUpperCase() as DayName);
  }
  return ['MON', 'WED', 'FRI'];
}

export function calculateNextEligibleSendDate(
  fromTimestamp: number = Date.now(),
  delayDays: number = 0,
  allowedDays: DayName[] = getSystemAllowedDays(),
  targetHourUtc: number = 10
): number {
  const date = new Date(fromTimestamp);

  // Add initial delay days
  if (delayDays > 0) {
    date.setUTCDate(date.getUTCDate() + delayDays);
  }

  // Set target hour (default 10:00 AM UTC / ~3:30 PM IST)
  date.setUTCHours(targetHourUtc, 0, 0, 0);

  // Weekend & Allowed Day Check Loop
  let safetyCounter = 0;
  while (safetyCounter < 14) {
    const dayOfWeek = date.getUTCDay(); // 0 = Sun, 6 = Sat
    const dayName = DAY_INDEX_MAP[dayOfWeek];

    // Rule: Skip Saturday (6) & Sunday (0) and any day not in allowedDays
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isAllowed = allowedDays.includes(dayName) && !isWeekend;

    if (isAllowed && date.getTime() > Date.now()) {
      return date.getTime();
    }

    // Move to next calendar day
    date.setUTCDate(date.getUTCDate() + 1);
    safetyCounter++;
  }

  return date.getTime();
}

export async function checkCollisionAndReschedule(
  recipient: string,
  scheduledAt: number,
  allowedDays: DayName[] = getSystemAllowedDays()
): Promise<number> {
  if (!adminDb) return scheduledAt;

  try {
    const recipientClean = recipient.trim().toLowerCase();
    const targetDateStr = new Date(scheduledAt).toISOString().slice(0, 10);

    // Query existing jobs for the recipient
    const existingSnap = await adminDb
      .collection('email_jobs')
      .where('recipient', '==', recipientClean)
      .get();

    let hasCollision = false;
    existingSnap.forEach((doc) => {
      const data = doc.data();
      if (['NEWSLETTER', 'DRIP', 'LIFECYCLE'].includes(data.emailType) && data.status !== 'CANCELLED') {
        const jobDateStr = new Date(data.scheduledAt || data.createdAt).toISOString().slice(0, 10);
        if (jobDateStr === targetDateStr) {
          hasCollision = true;
        }
      }
    });

    if (hasCollision) {
      console.log(`[SmartScheduler] Collision detected for ${recipientClean} on ${targetDateStr}. Rescheduling...`);
      // Shift to next eligible send date
      return calculateNextEligibleSendDate(scheduledAt, 1, allowedDays);
    }
  } catch (err) {
    console.warn('[SmartScheduler] Collision check warning:', err);
  }

  return scheduledAt;
}

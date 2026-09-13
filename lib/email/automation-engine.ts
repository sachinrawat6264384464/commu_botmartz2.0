import { adminDb } from '@/lib/firebase-admin';
import { enqueueEmailJob } from './queue';
import { calculateNextEligibleSendDate, checkCollisionAndReschedule } from './smart-scheduler';

export type AutomationEvent =
  | 'USER_SIGNED_UP'
  | 'USER_FIRST_LOGIN'
  | 'NEWSLETTER_SUBSCRIBED'
  | 'NEWSLETTER_UNSUBSCRIBED'
  | 'USER_COMPLETED_ACTION'
  | 'USER_INACTIVE';

export interface EventPayload {
  userId?: string;
  email: string;
  name?: string;
  firstLoginAt?: number | null;
  metadata?: Record<string, any>;
}

export async function emitEvent(event: AutomationEvent, payload: EventPayload): Promise<{ success: boolean; jobsQueued: number }> {
  const recipient = payload.email.trim().toLowerCase();
  const name = payload.name || 'Builder';
  let jobsQueued = 0;

  console.log(`[AutomationEngine] Event emitted: ${event} for ${recipient}`);

  try {
    switch (event) {
      case 'USER_SIGNED_UP': {
        // 1. Welcome Email (Immediate)
        const welcomeRes = await enqueueEmailJob({
          recipient,
          templateId: 'WELCOME',
          variables: { user_name: name, user_email: recipient, ...payload.metadata },
          emailType: 'LIFECYCLE',
          priority: 'HIGH',
          idempotencyKey: `welcome_signup_${payload.userId || recipient}`,
        });
        if (welcomeRes.success && !welcomeRes.skipped) jobsQueued++;

        // 2. Calculate Next Eligible Business Send Dates (MON, WED, FRI with weekend skipping & collision checks)
        const now = Date.now();
        const step1TargetDate = calculateNextEligibleSendDate(now, 2); // 2 days out on MON/WED/FRI
        const step2TargetDate = calculateNextEligibleSendDate(step1TargetDate, 2); // Next allowed business day

        const step1ScheduledAt = await checkCollisionAndReschedule(recipient, step1TargetDate);
        const step2ScheduledAt = await checkCollisionAndReschedule(recipient, step2TargetDate);

        // Drip Step 1 (Features Deep Dive)
        const step1Res = await enqueueEmailJob({
          recipient,
          templateId: 'DRIP_STEP_1_FEATURES',
          variables: { user_name: name, user_email: recipient },
          emailType: 'DRIP',
          scheduledAt: step1ScheduledAt,
          idempotencyKey: `drip_onboarding_step1_${payload.userId || recipient}`,
        });
        if (step1Res.success && !step1Res.skipped) jobsQueued++;

        // Drip Step 2 (Getting Started Roadmaps)
        const step2Res = await enqueueEmailJob({
          recipient,
          templateId: 'DRIP_STEP_2_GETTING_STARTED',
          variables: { user_name: name, user_email: recipient },
          emailType: 'DRIP',
          scheduledAt: step2ScheduledAt,
          idempotencyKey: `drip_onboarding_step2_${payload.userId || recipient}`,
        });
        if (step2Res.success && !step2Res.skipped) jobsQueued++;

        // Record enrollment in Firestore
        if (adminDb && payload.userId) {
          await adminDb.collection('email_enrollments').doc(`${payload.userId}_onboarding`).set({
            userId: payload.userId,
            email: recipient,
            campaignId: 'ONBOARDING_DRIP',
            status: 'ACTIVE',
            enrolledAt: now,
            currentStep: 1,
            nextStepAt: step1ScheduledAt,
          }, { merge: true });
        }
        break;
      }

      case 'NEWSLETTER_SUBSCRIBED': {
        const subRes = await enqueueEmailJob({
          recipient,
          templateId: 'NEWSLETTER_WELCOME',
          variables: { user_name: name, user_email: recipient, ...payload.metadata },
          emailType: 'NEWSLETTER',
          priority: 'NORMAL',
          idempotencyKey: `newsletter_confirm_${recipient}`,
        });
        if (subRes.success && !subRes.skipped) jobsQueued++;
        break;
      }

      case 'USER_FIRST_LOGIN': {
        // Enforce: ONLY trigger if firstLoginAt was previously NULL
        if (adminDb && payload.userId) {
          const userDocRef = adminDb.collection('users').doc(payload.userId);
          const userSnap = await userDocRef.get();
          
          if (userSnap.exists) {
            const userData = userSnap.data();
            if (userData?.first_login_at) {
              console.log(`[AutomationEngine] User ${payload.userId} already has first_login_at set. Skipping duplicate first-login email.`);
              break;
            }
          }

          // Mark first_login_at timestamp
          await userDocRef.set({ first_login_at: Date.now() }, { merge: true });

          const firstLoginRes = await enqueueEmailJob({
            recipient,
            templateId: 'WELCOME',
            variables: { user_name: name, user_email: recipient, title: 'First Login Confirmed' },
            emailType: 'LIFECYCLE',
            idempotencyKey: `first_login_${payload.userId}`,
          });
          if (firstLoginRes.success && !firstLoginRes.skipped) jobsQueued++;
        }
        break;
      }

      case 'USER_INACTIVE': {
        const reengageRes = await enqueueEmailJob({
          recipient,
          templateId: 'DRIP_STEP_1_FEATURES',
          variables: { user_name: name, user_email: recipient, badge: 'RE-ENGAGEMENT' },
          emailType: 'DRIP',
          idempotencyKey: `reengage_${payload.userId || recipient}_${new Date().toISOString().slice(0, 7)}`,
        });
        if (reengageRes.success && !reengageRes.skipped) jobsQueued++;
        break;
      }

      default:
        console.log(`[AutomationEngine] No handlers for event: ${event}`);
        break;
    }
  } catch (err) {
    console.error(`[AutomationEngine] Error processing event ${event}:`, err);
  }

  return { success: true, jobsQueued };
}

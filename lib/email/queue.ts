import { adminDb } from '@/lib/firebase-admin';
import { emailProvider } from './provider';
import { compileTemplate } from './template-engine';

export interface EmailJobData {
  id?: string;
  recipient: string;
  templateId: string;
  variables: Record<string, any>;
  emailType: 'NEWSLETTER' | 'DRIP' | 'TRANSACTIONAL' | 'SECURITY' | 'LIFECYCLE';
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  scheduledAt?: number;
  retryCount?: number;
  maxRetries?: number;
  status?: 'QUEUED' | 'PROCESSING' | 'SENT' | 'FAILED' | 'RETRY';
  idempotencyKey?: string;
  createdAt?: number;
  error?: string;
}

export async function enqueueEmailJob(jobData: EmailJobData): Promise<{ success: boolean; jobId?: string; skipped?: boolean }> {
  try {
    if (!adminDb) {
      console.warn('[EmailQueue] adminDb not initialized, attempting direct send fallback');
      const compiled = compileTemplate(jobData.templateId, jobData.variables);
      const res = await emailProvider.sendEmail({
        to: jobData.recipient,
        subject: compiled.subject,
        html: compiled.html,
        text: compiled.text,
      });
      return { success: res.success };
    }

    const recipient = jobData.recipient.trim().toLowerCase();
    const idempotencyKey = jobData.idempotencyKey || `${jobData.templateId}_${recipient}_${Date.now()}`;

    // Check Idempotency protection
    if (jobData.idempotencyKey) {
      const existing = await adminDb
        .collection('email_jobs')
        .where('idempotencyKey', '==', jobData.idempotencyKey)
        .limit(1)
        .get();

      if (!existing.empty) {
        console.log(`[EmailQueue] Idempotency key match found (${jobData.idempotencyKey}). Skipping duplicate email.`);
        return { success: true, skipped: true };
      }
    }

    // Check subscriber preference / unsub status for marketing/newsletter/drip
    if (['NEWSLETTER', 'DRIP', 'LIFECYCLE'].includes(jobData.emailType)) {
      const prefDoc = await adminDb.collection('email_preferences').doc(recipient).get();
      if (prefDoc.exists) {
        const pref = prefDoc.data();
        if (pref?.unsubscribed || pref?.marketing_emails === false) {
          console.log(`[EmailQueue] Recipient ${recipient} has unsubscribed. Skipping ${jobData.emailType} email.`);
          return { success: true, skipped: true };
        }
      }

      const subDoc = await adminDb.collection('newsletter_subscribers').doc(recipient).get();
      if (subDoc.exists && subDoc.data()?.status === 'UNSUBSCRIBED') {
        console.log(`[EmailQueue] Recipient ${recipient} status is UNSUBSCRIBED. Skipping email.`);
        return { success: true, skipped: true };
      }
    }

    const now = Date.now();
    const jobRecord = {
      recipient,
      templateId: jobData.templateId,
      variables: jobData.variables || {},
      emailType: jobData.emailType,
      priority: jobData.priority || 'NORMAL',
      scheduledAt: jobData.scheduledAt || now,
      retryCount: 0,
      maxRetries: jobData.maxRetries || 3,
      status: 'QUEUED',
      idempotencyKey,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('email_jobs').add(jobRecord);

    // Track QUEUED event
    await adminDb.collection('email_events').add({
      jobId: docRef.id,
      recipient,
      templateId: jobData.templateId,
      emailType: jobData.emailType,
      eventType: 'QUEUED',
      timestamp: now,
    });

    console.log(`[EmailQueue] Queued job ${docRef.id} for ${recipient} (Template: ${jobData.templateId})`);

    // Trigger non-blocking worker flush
    processEmailQueue().catch((err) => console.error('[EmailWorker] Async worker flush failed:', err));

    return { success: true, jobId: docRef.id };
  } catch (err: any) {
    console.error('[EmailQueue] Error queueing email job:', err);
    return { success: false };
  }
}

export async function processEmailQueue(limit: number = 10): Promise<{ processed: number; success: number; failed: number }> {
  if (!adminDb) return { processed: 0, success: 0, failed: 0 };

  const now = Date.now();
  let processedCount = 0;
  let successCount = 0;
  let failedCount = 0;

  try {
    // Fetch pending jobs ready to be processed
    const snapshot = await adminDb
      .collection('email_jobs')
      .where('status', 'in', ['QUEUED', 'RETRY'])
      .where('scheduledAt', '<=', now)
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return { processed: 0, success: 0, failed: 0 };
    }

    for (const doc of snapshot.docs) {
      processedCount++;
      const jobId = doc.id;
      const job = doc.data() as EmailJobData;

      // Mark job as PROCESSING
      await doc.ref.update({ status: 'PROCESSING', updatedAt: now });

      const compiled = compileTemplate(job.templateId, job.variables || {});
      const sendRes = await emailProvider.sendEmail({
        to: job.recipient,
        subject: compiled.subject,
        html: compiled.html,
        text: compiled.text,
      });

      if (sendRes.success) {
        successCount++;
        await doc.ref.update({
          status: 'SENT',
          providerMessageId: sendRes.messageId || null,
          sentAt: Date.now(),
          updatedAt: Date.now(),
        });

        await adminDb.collection('email_events').add({
          jobId,
          recipient: job.recipient,
          templateId: job.templateId,
          emailType: job.emailType,
          eventType: 'SENT',
          providerMessageId: sendRes.messageId || null,
          timestamp: Date.now(),
        });
      } else {
        failedCount++;
        const currentRetry = (job.retryCount || 0) + 1;
        const maxRetries = job.maxRetries || 3;

        if (currentRetry < maxRetries) {
          // Exponential backoff: retry in 5 min, 15 min, 45 min
          const backoffDelay = Math.pow(3, currentRetry) * 1000 * 60 * 2;
          const nextSchedule = Date.now() + backoffDelay;

          await doc.ref.update({
            status: 'RETRY',
            retryCount: currentRetry,
            scheduledAt: nextSchedule,
            error: sendRes.error,
            updatedAt: Date.now(),
          });

          console.warn(`[EmailWorker] Job ${jobId} failed (Attempt ${currentRetry}/${maxRetries}). Retrying in ${backoffDelay / 1000}s`);
        } else {
          await doc.ref.update({
            status: 'FAILED',
            retryCount: currentRetry,
            error: sendRes.error,
            updatedAt: Date.now(),
          });

          await adminDb.collection('email_events').add({
            jobId,
            recipient: job.recipient,
            templateId: job.templateId,
            emailType: job.emailType,
            eventType: 'FAILED',
            error: sendRes.error || 'Max retries reached',
            timestamp: Date.now(),
          });

          console.error(`[EmailWorker] Job ${jobId} permanently failed after ${maxRetries} attempts: ${sendRes.error}`);
        }
      }
    }
  } catch (err) {
    console.error('[EmailWorker] Queue processing error:', err);
  }

  return { processed: processedCount, success: successCount, failed: failedCount };
}

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { enqueueEmailJob } from '@/lib/email/queue';
import { emailProvider } from '@/lib/email/provider';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'soham@botmartz.com';

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 });
    }

    // 1. Fetch Subscriber Counts
    const activeSubscribersSnap = await adminDb
      .collection('newsletter_subscribers')
      .where('status', '==', 'ACTIVE')
      .get();
    
    const unsubscribedSnap = await adminDb
      .collection('newsletter_subscribers')
      .where('status', '==', 'UNSUBSCRIBED')
      .get();

    // 2. Fetch Email Job Statistics
    const queuedJobsSnap = await adminDb.collection('email_jobs').where('status', '==', 'QUEUED').get();
    const sentJobsSnap = await adminDb.collection('email_jobs').where('status', '==', 'SENT').get();
    const failedJobsSnap = await adminDb.collection('email_jobs').where('status', '==', 'FAILED').get();

    // 3. Fetch Recent Email Events Log
    const recentEventsSnap = await adminDb
      .collection('email_events')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const events = recentEventsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 4. Test SMTP Transporter Health
    const smtpHealth = await emailProvider.verifyConnection();

    return NextResponse.json({
      success: true,
      stats: {
        activeSubscribers: activeSubscribersSnap.size,
        unsubscribed: unsubscribedSnap.size,
        queuedJobs: queuedJobsSnap.size,
        sentJobs: sentJobsSnap.size,
        failedJobs: failedJobsSnap.size,
        smtpConfigured: smtpHealth,
      },
      events,
    });
  } catch (err: any) {
    console.error('[AdminEmailAPI] GET Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, recipient, subject, content, templateId } = body || {};

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 });
    }

    if (action === 'TEST_SMTP') {
      const isConnected = await emailProvider.verifyConnection();
      return NextResponse.json({ success: true, isConnected });
    }

    if (action === 'SEND_BROADCAST') {
      if (!subject || !content) {
        return NextResponse.json({ success: false, error: 'Subject and Content required' }, { status: 400 });
      }

      // Fetch all active subscribers
      const subscribersSnap = await adminDb
        .collection('newsletter_subscribers')
        .where('status', '==', 'ACTIVE')
        .get();

      let queued = 0;
      for (const doc of subscribersSnap.docs) {
        const subData = doc.data();
        await enqueueEmailJob({
          recipient: subData.email,
          templateId: 'TRANSACTIONAL',
          variables: {
            subject,
            content,
            is_marketing: true,
            user_name: subData.name || 'Builder',
            user_email: subData.email,
          },
          emailType: 'NEWSLETTER',
          priority: 'NORMAL',
        });
        queued++;
      }

      return NextResponse.json({
        success: true,
        message: `Broadcast campaign queued for ${queued} active subscribers.`,
        queuedCount: queued,
      });
    }

    if (action === 'SEND_TEST_EMAIL') {
      if (!recipient) {
        return NextResponse.json({ success: false, error: 'Recipient email required' }, { status: 400 });
      }

      const res = await enqueueEmailJob({
        recipient,
        templateId: templateId || 'WELCOME',
        variables: { user_name: 'Test Admin', user_email: recipient },
        emailType: 'TRANSACTIONAL',
        priority: 'HIGH',
        idempotencyKey: `test_send_${Date.now()}`,
      });

      return NextResponse.json({
        success: true,
        message: `Test email queued to ${recipient}`,
        result: res,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('[AdminEmailAPI] POST Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

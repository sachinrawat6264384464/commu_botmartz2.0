import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyUnsubscribeToken } from '@/lib/email/tokens';

export async function GET(req: NextRequest) {
  return handleUnsubscribe(req);
}

export async function POST(req: NextRequest) {
  return handleUnsubscribe(req);
}

async function handleUnsubscribe(req: NextRequest) {
  try {
    const url = new URL(req.url);
    let email = url.searchParams.get('email');
    let token = url.searchParams.get('token');

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        email = body.email || email;
        token = body.token || token;
      } catch (e) {}
    }

    if (!email || !token) {
      return NextResponse.json(
        { success: false, error: 'Invalid unsubscribe request link.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify token validity
    const isValidToken = verifyUnsubscribeToken(normalizedEmail, token);
    if (!isValidToken) {
      return NextResponse.json(
        { success: false, error: 'Unsubscribe signature is invalid or expired.' },
        { status: 403 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Database unavailable.' },
        { status: 500 }
      );
    }

    const now = Date.now();

    // 1. Update newsletter_subscribers
    const subRef = adminDb.collection('newsletter_subscribers').doc(normalizedEmail);
    await subRef.set(
      {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    // 2. Update email_preferences (Marketing & Newsletter turned OFF; Transactional & Security remain ON)
    const prefRef = adminDb.collection('email_preferences').doc(normalizedEmail);
    await prefRef.set(
      {
        email: normalizedEmail,
        newsletter: false,
        marketing_emails: false,
        onboarding_emails: false,
        transactional_emails: true,
        security_emails: true,
        updatedAt: now,
      },
      { merge: true }
    );

    // Track UNSUBSCRIBED event
    await adminDb.collection('email_events').add({
      recipient: normalizedEmail,
      emailType: 'NEWSLETTER',
      eventType: 'UNSUBSCRIBED',
      timestamp: now,
    });

    console.log(`[UnsubscribeAPI] Recipient ${normalizedEmail} successfully unsubscribed.`);

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from newsletter and marketing emails.',
    });
  } catch (err: any) {
    console.error('[UnsubscribeAPI] Error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during unsubscribe.' },
      { status: 500 }
    );
  }
}

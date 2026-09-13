import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { emitEvent } from '@/lib/email/automation-engine';
import { generateUnsubscribeToken } from '@/lib/email/tokens';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = name ? String(name).trim() : 'Subscriber';
    const unsubToken = generateUnsubscribeToken(normalizedEmail);
    const now = Date.now();

    if (!adminDb) {
      return NextResponse.json(
        { success: false, error: 'Database instance unavailable.' },
        { status: 500 }
      );
    }

    const subRef = adminDb.collection('newsletter_subscribers').doc(normalizedEmail);
    const subSnap = await subRef.get();

    let isAlreadyActive = false;

    if (subSnap.exists) {
      const existingData = subSnap.data();
      if (existingData?.status === 'ACTIVE') {
        isAlreadyActive = true;
      } else {
        // Re-activate previously unsubscribed user
        await subRef.set(
          {
            status: 'ACTIVE',
            resubscribedAt: now,
            unsubToken,
            updatedAt: now,
          },
          { merge: true }
        );
      }
    } else {
      // New Subscriber
      await subRef.set({
        email: normalizedEmail,
        name: displayName,
        status: 'ACTIVE',
        subscribedAt: now,
        unsubToken,
        source: source || 'footer_form',
        createdAt: now,
        updatedAt: now,
      });
    }

    // Ensure email preferences exist and are active
    const prefRef = adminDb.collection('email_preferences').doc(normalizedEmail);
    await prefRef.set(
      {
        email: normalizedEmail,
        newsletter: true,
        marketing_emails: true,
        product_updates: true,
        onboarding_emails: true,
        updatedAt: now,
      },
      { merge: true }
    );

    if (isAlreadyActive) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to the newsletter!',
      });
    }

    // Emit event to trigger welcome email
    await emitEvent('NEWSLETTER_SUBSCRIBED', {
      email: normalizedEmail,
      name: displayName,
      metadata: { source: source || 'footer' },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
    });
  } catch (err: any) {
    console.error('[NewsletterSubscribeAPI] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}

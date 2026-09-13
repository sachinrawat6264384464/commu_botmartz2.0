import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, payload } = body || {};

    if (!eventName || typeof eventName !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid eventName' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 });
    }

    const now = Date.now();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    const sanitizedPayload = payload && typeof payload === 'object' ? payload : {};
    delete sanitizedPayload.password;
    delete sanitizedPayload.token;
    delete sanitizedPayload.secret;

    try {
      await adminDb.collection('analytics_events').add({
        eventName,
        anonymousId: sanitizedPayload.anonymous_id || 'unknown',
        userId: sanitizedPayload.user_id || null,
        pagePath: sanitizedPayload.page_path || '/',
        pageTitle: sanitizedPayload.page_title || '',
        properties: sanitizedPayload,
        ip,
        userAgent,
        timestamp: sanitizedPayload.timestamp || now,
        createdAt: now,
      });
    } catch (dbErr: any) {
      console.warn('[AnalyticsEventsAPI] Firestore write skipped:', dbErr?.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[AnalyticsEventsAPI] Error:', err);
    return NextResponse.json({ success: true, warning: 'Telemetry processed with fallback' });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { recordLiveTelemetryEvent } from '@/lib/analytics/telemetry-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, payload } = body || {};

    if (!eventName || typeof eventName !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid eventName' }, { status: 400 });
    }

    const now = Date.now();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';

    const sanitizedPayload = payload && typeof payload === 'object' ? payload : {};
    delete sanitizedPayload.password;
    delete sanitizedPayload.token;
    delete sanitizedPayload.secret;

    // 1. Record event in live in-memory telemetry store
    recordLiveTelemetryEvent({
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

    // 2. Persist in Firestore if adminDb is initialized
    if (adminDb) {
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
        // Silent catch for local environments without service account keys
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: true, warning: 'Telemetry processed' });
  }
}

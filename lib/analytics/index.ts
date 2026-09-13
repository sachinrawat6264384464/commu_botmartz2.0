import { pushToDataLayer } from './gtm';
import { sendGa4Event, sendGa4PageView } from './ga4';
import { logFirebaseEvent } from './firebase-analytics';
import { hasConsent } from './consent';
import { EventName, BaseEventProperties } from './types';

let currentUserId: string | null = null;
let currentUserProperties: Record<string, any> = {};

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return 'server_side';
  try {
    let id = localStorage.getItem('botmartz_anon_id');
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('botmartz_anon_id', id);
    }
    return id;
  } catch (e) {
    return 'anon_fallback';
  }
}

export function sanitizeProperties(props: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  const forbiddenKeys = ['password', 'secret', 'otp', 'token', 'auth', 'card_number', 'cvv', 'key'];

  for (const [key, val] of Object.entries(props)) {
    if (forbiddenKeys.some((fk) => key.toLowerCase().includes(fk))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

export class AnalyticsService {
  private isDebug: boolean = process.env.NODE_ENV === 'development';

  identify(userId: string, userProps?: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    try {
      currentUserId = userId;
      if (userProps) {
        currentUserProperties = { ...currentUserProperties, ...userProps };
      }

      pushToDataLayer({
        event: 'user_identified',
        user_id: userId,
        ...currentUserProperties,
      });

      if (this.isDebug) {
        console.log(`[Analytics] Identified user: ${userId}`, currentUserProperties);
      }
    } catch (e) {
      console.warn('[Analytics] identify error:', e);
    }
  }

  track(eventName: EventName | string, properties?: BaseEventProperties): void {
    if (typeof window === 'undefined') return;
    if (!hasConsent()) return;

    try {
      const anonId = getAnonymousId();
      const payload: Record<string, any> = {
        event: eventName,
        anonymous_id: anonId,
        user_id: currentUserId || undefined,
        page_path: window.location.pathname,
        page_title: document.title,
        timestamp: Date.now(),
        ...currentUserProperties,
        ...sanitizeProperties(properties || {}),
      };

      // 1. Push to GTM dataLayer
      pushToDataLayer(payload);

      // 2. Send to GA4
      sendGa4Event(eventName, payload);

      // 3. Send to Firebase Analytics
      logFirebaseEvent(eventName, payload);

      // 4. Send to Internal Telemetry API (non-blocking)
      this.sendToCustomTelemetry(eventName, payload);

      if (this.isDebug) {
        console.log(`[Analytics Track] ${eventName}:`, payload);
      }
    } catch (err) {
      console.warn('[Analytics] track error:', err);
    }
  }

  pageView(pagePath?: string, pageTitle?: string): void {
    if (typeof window === 'undefined') return;
    if (!hasConsent()) return;

    try {
      const path = pagePath || window.location.pathname;
      const title = pageTitle || document.title;

      sendGa4PageView(path, title);

      this.track('page_view', {
        page_path: path,
        page_title: title,
        referrer: document.referrer || '',
      });
    } catch (err) {
      console.warn('[Analytics] pageView error:', err);
    }
  }

  trackError(errorType: string, message: string, metadata?: Record<string, any>): void {
    try {
      this.track('application_error', {
        error_type: errorType,
        error_message: message,
        ...metadata,
      });
    } catch (err) {}
  }

  private async sendToCustomTelemetry(eventName: string, payload: Record<string, any>): Promise<void> {
    try {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          payload,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {}
  }
}

export const analytics = new AnalyticsService();

import { app } from '@/lib/firebase';

let analyticsInstance: any = null;

export async function getFirebaseAnalyticsInstance() {
  if (typeof window === 'undefined') return null;

  if (!analyticsInstance) {
    try {
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      const supported = await isSupported();
      if (supported && app) {
        analyticsInstance = getAnalytics(app);
      }
    } catch (err) {
      console.warn('[FirebaseAnalytics] Initialization skipped:', err);
    }
  }

  return analyticsInstance;
}

export async function logFirebaseEvent(eventName: string, eventParams?: Record<string, any>): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const analytics = await getFirebaseAnalyticsInstance();
    if (analytics) {
      const { logEvent } = await import('firebase/analytics');
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.warn('[FirebaseAnalytics] logEvent error:', err);
  }
}

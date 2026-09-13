export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
  'G-85BJ8BEJLF';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function sendGa4Event(eventName: string, properties?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, properties || {});
    }
  } catch (err) {
    console.warn('[GA4] Failed to send event:', err);
  }
}

export function sendGa4PageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  } catch (err) {
    console.warn('[GA4] Failed to record page view:', err);
  }
}

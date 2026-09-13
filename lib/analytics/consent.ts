export type ConsentState = 'granted' | 'denied' | 'pending';

const CONSENT_STORAGE_KEY = 'botmartz_analytics_consent';

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return 'pending';
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
  } catch (e) {}
  return 'granted'; // Default to granted for public analytics
}

export function setConsentState(state: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, state);
  } catch (e) {}
}

export function hasConsent(): boolean {
  return getConsentState() === 'granted';
}

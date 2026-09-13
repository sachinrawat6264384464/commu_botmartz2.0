# ANALYTICS_ARCHITECTURE.md — System Design & Ownership Model

## 1. Overview
The Botmartz Analytics Engine uses a single ownership model centered around the `analytics` SDK (`lib/analytics/index.ts`). Instead of scattering direct `gtag()` or `logEvent()` calls throughout UI components, all tracking calls flow through `analytics.track()` or `analytics.pageView()`.

## 2. Event Dispatch Flow

```
UI Action / Route Change (usePathname, useSearchParams)
                    │
                    ▼
       analytics.track(eventName, properties)
                    │
   ┌────────────────┼────────────────┬────────────────┐
   ▼                ▼                ▼                ▼
pushToDataLayer  sendGa4Event   logFirebaseEvent  sendToCustomTelemetry
 (GTM dataLayer) (GA4 gtag.js)  (Firebase JS SDK) (POST /api/analytics/events)
```

## 3. Destination Responsibilities
- **GTM (`window.dataLayer`)**: Central Tag Manager for custom HTML tags, conversion pixels, and marketing tags.
- **GA4 (`G-85BJ8BEJLF`)**: Product analytics, user acquisition funnels, and retention cohort reporting.
- **Firebase Analytics**: Ingests browser analytics natively within the Firebase project ecosystem.
- **Custom Admin Telemetry**: Server-side Firestore pipeline providing live 10s auto-refreshing admin metrics without GA4 reporting latency.

## 4. Privacy & Fail-Safe Protection
- **No Sensitive Leakage**: Passwords, auth tokens, OTPs, and payment card numbers are automatically sanitized to `[REDACTED]`.
- **Fail-Safe Wrappers**: All analytics dispatches are wrapped in silent `try/catch` handlers. Script blockages (e.g. ad-blockers) will never break navigation or app functionality.

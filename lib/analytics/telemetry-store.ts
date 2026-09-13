export interface TelemetryEvent {
  id: string;
  eventName: string;
  anonymousId: string;
  userId?: string | null;
  pagePath: string;
  pageTitle?: string;
  properties?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: number;
  createdAt: number;
}

interface TelemetryState {
  events: TelemetryEvent[];
  basePageViews: number;
  baseEventsCount: number;
  topPages: Record<string, number>;
}

const initialTopPages: Record<string, number> = {
  '/': 142,
  '/virtual-ai-internship': 86,
  '/arena': 64,
  '/bootcamps': 50,
  '/workshops': 28,
};

// Use globalThis singleton pattern so Next.js HMR fast-refresh never resets live events
const g = globalThis as unknown as {
  _botmartz_telemetry_state?: TelemetryState;
};

if (!g._botmartz_telemetry_state) {
  const now = Date.now();
  g._botmartz_telemetry_state = {
    events: [
      { id: 'ev_init_1', eventName: 'page_view', pagePath: '/', anonymousId: 'anon_builder_101', timestamp: now - 300000, createdAt: now - 300000 },
      { id: 'ev_init_2', eventName: 'arena_prd_viewed', pagePath: '/arena', anonymousId: 'anon_builder_101', timestamp: now - 240000, createdAt: now - 240000 },
      { id: 'ev_init_3', eventName: 'newsletter_subscribed', pagePath: '/', anonymousId: 'anon_subscriber_55', timestamp: now - 180000, createdAt: now - 180000 },
    ],
    basePageViews: 370,
    baseEventsCount: 370,
    topPages: { ...initialTopPages },
  };
}

export function recordLiveTelemetryEvent(event: Omit<TelemetryEvent, 'id'>): TelemetryEvent {
  const state = g._botmartz_telemetry_state!;

  const fullEvent: TelemetryEvent = {
    id: `ev_live_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...event,
  };

  // Add event to the top of live stream
  state.events.unshift(fullEvent);

  // Increment live telemetry metrics
  state.baseEventsCount += 1;
  if (event.eventName === 'page_view' || event.pagePath) {
    state.basePageViews += 1;
    const path = event.pagePath || '/';
    state.topPages[path] = (state.topPages[path] || 0) + 1;
  }

  // Keep last 500 events
  if (state.events.length > 500) {
    state.events.pop();
  }

  console.log(`[TelemetryStore] Logged live event: ${event.eventName} on ${event.pagePath}. Total PageViews: ${state.basePageViews}`);

  return fullEvent;
}

export function getLiveTelemetryData() {
  return g._botmartz_telemetry_state!;
}

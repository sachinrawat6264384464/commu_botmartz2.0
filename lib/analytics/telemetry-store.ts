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

// Use globalThis singleton pattern so Next.js HMR fast-refresh never resets live events
const g = globalThis as unknown as {
  _botmartz_telemetry_state?: TelemetryState;
};

if (!g._botmartz_telemetry_state) {
  g._botmartz_telemetry_state = {
    events: [],
    basePageViews: 0,
    baseEventsCount: 0,
    topPages: {},
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

  // Keep last 1000 events
  if (state.events.length > 1000) {
    state.events.pop();
  }

  console.log(`[TelemetryStore] Logged live event: ${event.eventName} on ${event.pagePath}. Total PageViews: ${state.basePageViews}`);

  return fullEvent;
}

export function getLiveTelemetryData() {
  return g._botmartz_telemetry_state!;
}

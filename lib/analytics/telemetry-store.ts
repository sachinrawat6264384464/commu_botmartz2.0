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

// In-memory global store to hold live runtime events across requests
const globalTelemetryStore: TelemetryEvent[] = [];

export function recordLiveTelemetryEvent(event: Omit<TelemetryEvent, 'id'>): TelemetryEvent {
  const fullEvent: TelemetryEvent = {
    id: `ev_live_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...event,
  };

  globalTelemetryStore.unshift(fullEvent);

  // Keep last 1000 events in memory
  if (globalTelemetryStore.length > 1000) {
    globalTelemetryStore.pop();
  }

  return fullEvent;
}

export function getLiveTelemetryEvents(): TelemetryEvent[] {
  return globalTelemetryStore;
}

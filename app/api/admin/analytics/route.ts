import { NextRequest, NextResponse } from 'next/server';
import { adminDb, hasAdminCredentials } from '@/lib/firebase-admin';
import { getLiveTelemetryData } from '@/lib/analytics/telemetry-store';

export async function GET(req: NextRequest) {
  try {
    const now = Date.now();
    const thirtyMinAgo = now - 30 * 60 * 1000;
    const telemetryData = getLiveTelemetryData();

    let dbEvents: any[] = [];

    if (adminDb && hasAdminCredentials) {
      try {
        const recentEventsSnap = await adminDb
          .collection('analytics_events')
          .orderBy('timestamp', 'desc')
          .limit(500)
          .get();

        if (recentEventsSnap && recentEventsSnap.docs && recentEventsSnap.docs.length > 0) {
          dbEvents = recentEventsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      } catch (dbErr) {}
    }

    const allEvents = [...telemetryData.events, ...dbEvents];

    // Compute Active Users in last 30 minutes
    const activeUsersSet = new Set<string>();
    const eventCounts: Record<string, number> = {};

    allEvents.forEach((ev: any) => {
      const evTime = ev.timestamp || ev.createdAt;
      if (evTime >= thirtyMinAgo) {
        if (ev.userId) activeUsersSet.add(`user_${ev.userId}`);
        else if (ev.anonymousId) activeUsersSet.add(`anon_${ev.anonymousId}`);
      }

      eventCounts[ev.eventName] = (eventCounts[ev.eventName] || 0) + 1;
    });

    const funnel = {
      landingPageViews: telemetryData.topPages['/'] || 0,
      internshipViews: (telemetryData.topPages['/virtual-ai-internship'] || 0) + (telemetryData.topPages['/arena'] || 0),
      arenaViews: telemetryData.topPages['/arena'] || 0,
      bootcampViews: telemetryData.topPages['/bootcamps'] || 0,
      signups: eventCounts['signup_completed'] || 0,
      newsletterSubs: eventCounts['newsletter_subscribed'] || 0,
      dailyLogs: eventCounts['daily_log_submitted'] || 0,
    };

    return NextResponse.json({
      success: true,
      metrics: {
        activeUsers30m: activeUsersSet.size,
        totalEventsRecorded: telemetryData.baseEventsCount + dbEvents.length,
        totalPageViews: telemetryData.basePageViews,
        eventCounts,
        topPages: telemetryData.topPages,
        funnel,
      },
      recentEvents: allEvents.slice(0, 30),
    });
  } catch (err: any) {
    const telemetryData = getLiveTelemetryData();
    return NextResponse.json({
      success: true,
      metrics: {
        activeUsers30m: 0,
        totalEventsRecorded: telemetryData.baseEventsCount,
        totalPageViews: telemetryData.basePageViews,
        eventCounts: {},
        topPages: telemetryData.topPages,
        funnel: {
          landingPageViews: telemetryData.topPages['/'] || 0,
          internshipViews: 0,
          arenaViews: 0,
          bootcampViews: 0,
          signups: 0,
          newsletterSubs: 0,
          dailyLogs: 0,
        },
      },
      recentEvents: telemetryData.events.slice(0, 30),
    });
  }
}

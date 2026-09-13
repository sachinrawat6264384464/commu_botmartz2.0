import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 });
    }

    const now = Date.now();
    const thirtyMinAgo = now - 30 * 60 * 1000;

    // 1. Fetch recent events (last 500)
    const recentEventsSnap = await adminDb
      .collection('analytics_events')
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();

    const events = recentEventsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Compute Active Users in last 30 minutes
    const activeUsersSet = new Set<string>();
    let totalViews = 0;
    const eventCounts: Record<string, number> = {};
    const topPages: Record<string, number> = {};

    events.forEach((ev: any) => {
      const evTime = ev.timestamp || ev.createdAt;
      if (evTime >= thirtyMinAgo) {
        if (ev.userId) activeUsersSet.add(`user_${ev.userId}`);
        else if (ev.anonymousId) activeUsersSet.add(`anon_${ev.anonymousId}`);
      }

      eventCounts[ev.eventName] = (eventCounts[ev.eventName] || 0) + 1;

      if (ev.eventName === 'page_view' && ev.pagePath) {
        totalViews++;
        topPages[ev.pagePath] = (topPages[ev.pagePath] || 0) + 1;
      }
    });

    // 3. Compute Funnel Breakdown
    const funnel = {
      landingPageViews: topPages['/'] || 0,
      internshipViews: topPages['/virtual-ai-internship'] || 0,
      arenaViews: topPages['/arena'] || 0,
      bootcampViews: topPages['/bootcamps'] || 0,
      signups: eventCounts['signup_completed'] || 0,
      newsletterSubs: eventCounts['newsletter_subscribed'] || 0,
      dailyLogs: eventCounts['daily_log_submitted'] || 0,
    };

    return NextResponse.json({
      success: true,
      metrics: {
        activeUsers30m: activeUsersSet.size,
        totalEventsRecorded: events.length,
        totalPageViews: totalViews,
        eventCounts,
        topPages,
        funnel,
      },
      recentEvents: events.slice(0, 30),
    });
  } catch (err: any) {
    console.error('[AdminAnalyticsAPI] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

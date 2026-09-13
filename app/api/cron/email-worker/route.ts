import { NextRequest, NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/email/queue';

export async function GET(req: NextRequest) {
  return runWorker(req);
}

export async function POST(req: NextRequest) {
  return runWorker(req);
}

async function runWorker(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Validate secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(req.url);
      const key = url.searchParams.get('key');
      if (key !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized worker invocation' }, { status: 401 });
      }
    }

    const result = await processEmailQueue(20);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: result,
    });
  } catch (err: any) {
    console.error('[CronEmailWorkerAPI] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

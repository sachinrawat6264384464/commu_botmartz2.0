import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { eventType, userEmail, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 });
    }

    const eventRecord = {
      eventType,
      userEmail: userEmail?.toLowerCase()?.trim() || "anonymous_student",
      metadata: metadata || {},
      timestamp: new Date(),
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || ""
    };

    if (adminDb) {
      await adminDb.collection("arena_analytics_events").add(eventRecord);
    }

    return NextResponse.json({
      success: true,
      loggedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email || !adminDb || !hasAdminCredentials) {
      return NextResponse.json({
        preferences: {
          deadlineWarnings: true,
          dailyStandupReminder: true,
          walletAlerts: true,
          discussionAlerts: true,
          saturdayMeetups: true,
          recruiterAlerts: true
        }
      });
    }

    const doc = await adminDb.collection("notification_preferences").doc(email).get();
    if (doc.exists) {
      return NextResponse.json({ preferences: doc.data() });
    }

    return NextResponse.json({
      preferences: {
        deadlineWarnings: true,
        dailyStandupReminder: true,
        walletAlerts: true,
        discussionAlerts: true,
        saturdayMeetups: true,
        recruiterAlerts: true
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, preferences } = body;

    if (!email || !adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: true, message: "Notification preferences updated (local dev mode)." });
    }

    const cleanEmail = email.toLowerCase().trim();

    await adminDb.collection("notification_preferences").doc(cleanEmail).set(
      {
        ...preferences,
        email: cleanEmail,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, message: "Notification preferences updated." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

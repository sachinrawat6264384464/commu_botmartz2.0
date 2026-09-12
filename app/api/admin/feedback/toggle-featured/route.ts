import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feedbackId, isFeatured } = body;

    if (!feedbackId) {
      return NextResponse.json({ success: false, error: "feedbackId is required." }, { status: 400 });
    }

    await adminDb.collection("event_feedbacks").doc(feedbackId).set(
      {
        isFeatured: Boolean(isFeatured),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      feedbackId,
      isFeatured: Boolean(isFeatured),
      message: `Feedback display status updated to ${isFeatured ? "Public (Featured)" : "Hidden"}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to toggle featured status." },
      { status: 500 }
    );
  }
}

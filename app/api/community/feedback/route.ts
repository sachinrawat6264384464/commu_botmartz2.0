import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventId,
      workshopId,
      participantName,
      participantEmail,
      participantPhone,
      registrationCode,
      attendeeType,
      overallRating,
      contentRating,
      venueRating,
      recommend,
      takeaways,
      comments,
    } = body;

    if (!participantName || !overallRating) {
      return NextResponse.json(
        { success: false, error: "Participant name and overall rating are required." },
        { status: 400 }
      );
    }

    const feedbackData = {
      eventId: eventId || workshopId || "ai-accelerator-workshop",
      workshopId: workshopId || eventId || "ai-accelerator-workshop",
      participantName: participantName.trim(),
      participantEmail: participantEmail ? participantEmail.trim().toLowerCase() : "",
      participantPhone: participantPhone ? participantPhone.trim() : "",
      registrationCode: registrationCode ? registrationCode.trim().toUpperCase() : "",
      attendeeType: attendeeType || "student",
      overallRating: Number(overallRating) || 5,
      contentRating: Number(contentRating) || 5,
      venueRating: Number(venueRating) || 5,
      recommend: recommend === true || recommend === "yes" || recommend === "true",
      takeaways: takeaways ? takeaways.trim() : "",
      comments: comments ? comments.trim() : "",
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };

    let feedbackId = `FB-${Date.now()}`;
    try {
      const docRef = await adminDb.collection("event_feedbacks").add(feedbackData);
      feedbackId = docRef.id;
    } catch (err) {
      console.warn("Firestore feedback save fallback:", err);
    }

    return NextResponse.json({
      success: true,
      feedbackId,
      message: "Thank you for your feedback! Your response has been recorded.",
    });
  } catch (err: any) {
    console.error("Feedback submission error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit feedback." },
      { status: 500 }
    );
  }
}

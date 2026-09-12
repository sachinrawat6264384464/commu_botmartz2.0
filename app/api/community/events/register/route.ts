import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventSlug, name, email, phone, attendeeType, plan } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    const registrationCode = `BMZ-${(eventSlug || "EVT").substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const checkInCode = `CHK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const registrationData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      attendeeType: attendeeType || "student",
      registrationCode,
      checkInCode,
      eventSlug: eventSlug || "ai-frontier-2026",
      plan: plan || "single",
      checkedIn: false,
      certificateSent: false,
      createdAt: new Date().toISOString(),
    };

    let id = registrationCode;
    try {
      const docRef = await adminDb.collection("event_registrations").add(registrationData);
      id = docRef.id;
    } catch (dbErr) {
      console.warn("Firestore save fallback to code:", dbErr);
    }

    return NextResponse.json({
      success: true,
      registration: {
        id,
        ...registrationData,
      },
    });
  } catch (err: any) {
    console.error("Event registration error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process registration." },
      { status: 500 }
    );
  }
}

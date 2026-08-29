import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { 
      utrNumber, 
      attendeeName, 
      attendeeEmail, 
      attendeePhone, 
      ticketType, 
      amount,
      eventId
    } = await request.json();

    if (!utrNumber || !attendeeEmail) {
      return NextResponse.json({ error: "UTR Number and Email are required." }, { status: 400 });
    }

    const checkInCode = `UTR-${Math.floor(1000 + Math.random() * 9000)}`;

    const docRef = await adminDb.collection("attendees").add({
      name: attendeeName || "Attendee",
      email: attendeeEmail.toLowerCase(),
      phone: attendeePhone || "",
      tier: ticketType || "Standard Pass",
      amount: amount || 0,
      paymentMethod: "Manual UPI / Bank Transfer",
      utrNumber: utrNumber.trim(),
      checkInCode,
      status: "pending_review",
      attended: false,
      eventId: eventId || "ai-frontier-2026",
      eventTitle: "AI Frontier 2026 Summit",
      submittedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      registrationId: docRef.id,
      checkInCode,
      message: "UTR submitted successfully! Once staff verifies your transfer in the ledger, your pass will be activated."
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit UTR transfer" }, { status: 500 });
  }
}

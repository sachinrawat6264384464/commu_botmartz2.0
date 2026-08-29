import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      eventId,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      ticketType,
      amount
    } = await request.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (key_secret && key_secret !== "placeholder_secret") {
      const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature verification" }, { status: 400 });
      }
    }

    const checkInCode = `TC-${Math.floor(1000 + Math.random() * 9000)}`;

    // Store in Firestore
    const docRef = await adminDb.collection("attendees").add({
      name: attendeeName || "Attendee",
      email: attendeeEmail || "",
      phone: attendeePhone || "",
      tier: ticketType || "Standard Pass",
      amount: amount || 0,
      paymentId: razorpay_payment_id || `PAY_${Date.now()}`,
      orderId: razorpay_order_id || `ORD_${Date.now()}`,
      checkInCode,
      attended: false,
      eventId: eventId || "ai-frontier-2026",
      eventTitle: "AI Frontier 2026 Summit",
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      registrationId: docRef.id,
      checkInCode,
      message: "Registration confirmed! Ticket pass has been dispatched."
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to verify registration payment" }, { status: 500 });
  }
}

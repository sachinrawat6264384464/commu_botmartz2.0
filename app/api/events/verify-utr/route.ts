import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { 
      utrNumber, 
      attendeeName, 
      attendeeEmail, 
      attendeePhone, 
      ticketType, 
      amount,
      eventId,
      appliedCoupon
    } = await request.json();

    if (!utrNumber || !attendeeEmail) {
      return NextResponse.json({ error: "UTR Number and Email are required." }, { status: 400 });
    }

    const checkInCode = `UTR-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanCoupon = (appliedCoupon || "").trim().toUpperCase();

    if (adminDb && hasAdminCredentials) {
      if (cleanCoupon) {
        try {
          const couponQuery = await adminDb
            .collection("coupons")
            .where("code", "==", cleanCoupon)
            .limit(1)
            .get();

          if (!couponQuery.empty) {
            const cDoc = couponQuery.docs[0];
            const currentCount = Number(cDoc.data().currentUses) || 0;
            await cDoc.ref.update({
              currentUses: currentCount + 1,
              lastUsedAt: new Date().toISOString()
            });
          }
        } catch (cErr) {
          console.warn("Coupon usage increment warning in UTR:", cErr);
        }
      }

      const docRef = await adminDb.collection("attendees").add({
        name: attendeeName || "Attendee",
        email: attendeeEmail.toLowerCase(),
        phone: attendeePhone || "",
        tier: ticketType || "Standard Pass",
        amount: amount || 0,
        appliedCoupon: cleanCoupon,
        paymentMethod: "Manual UPI / Bank Transfer",
        utrNumber: utrNumber.trim(),
        checkInCode,
        status: "pending_review",
        attended: false,
        eventId: eventId || "ai-frontier-2026",
        eventTitle: "AI Frontier 2026 Summit",
        submittedAt: new Date()
      });

      // Also record in bootcamp_registrations for admin tracking
      await adminDb.collection("bootcamp_registrations").add({
        registrationId: `REG_${Date.now().toString().slice(-6)}`,
        name: attendeeName || "Attendee",
        email: attendeeEmail.toLowerCase(),
        phone: attendeePhone || "",
        plan: ticketType || "bundle",
        amount: amount || 0,
        appliedCoupon: cleanCoupon,
        status: "pending_utr",
        checkInCode,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        registrationId: docRef.id,
        checkInCode,
        message: "UTR submitted successfully! Once staff verifies your transfer in the ledger, your pass will be activated."
      });
    }

    return NextResponse.json({
      success: true,
      checkInCode,
      message: "UTR submitted successfully! Once verified, your pass will be activated."
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit UTR transfer" }, { status: 500 });
  }
}


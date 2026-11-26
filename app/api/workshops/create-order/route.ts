import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { DEFAULT_WORKSHOPS, ManagedWorkshop } from "@/lib/workshops";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const workshopId = String(body?.workshopId || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!workshopId || !email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Workshop ID and valid email are required." },
        { status: 400 }
      );
    }

    let workshop: ManagedWorkshop | undefined;
    if (adminDb) {
      const docSnap = await adminDb.collection("managed_workshops").doc(workshopId).get();
      if (docSnap.exists) {
        workshop = docSnap.data() as ManagedWorkshop;
      }

      // Prevent duplicate registration for the same email + workshop
      const existingSnap = await adminDb
        .collection("managed_workshops")
        .doc(workshopId)
        .collection("registrations")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        const existing = existingSnap.docs[0].data();
        return NextResponse.json(
          {
            success: false,
            alreadyRegistered: true,
            ticketCode: existing.ticketCode,
            error: `You are already registered for this workshop (Ticket: ${existing.ticketCode}).`,
          },
          { status: 409 }
        );
      }
    }

    if (!workshop) {
      workshop = DEFAULT_WORKSHOPS.find((w) => w.id === workshopId);
    }

    if (!workshop) {
      return NextResponse.json({ success: false, error: "Workshop not found." }, { status: 404 });
    }

    if (!workshop.isPaid || Number(workshop.price) <= 0) {
      return NextResponse.json({
        success: true,
        isFree: true,
        amount: 0,
        workshopTitle: workshop.title,
      });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay keys are not configured on server." },
        { status: 500 }
      );
    }

    const amountInPaise = Math.round(Number(workshop.price) * 100);
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `ws_${workshopId.slice(0, 12)}_${Date.now().toString().slice(-6)}`,
        notes: {
          workshopId,
          workshopTitle: workshop.title,
          email,
        },
      }),
    });

    const rzpData = await rzpRes.json();
    if (!rzpRes.ok || !rzpData.id) {
      return NextResponse.json(
        { success: false, error: rzpData?.error?.description || "Failed to create Razorpay order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isFree: false,
      orderId: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency || "INR",
      keyId,
      workshopTitle: workshop.title,
      displayPrice: Number(workshop.price),
    });
  } catch (err: any) {
    console.error("[Workshops CreateOrder] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to initialize payment." },
      { status: 500 }
    );
  }
}

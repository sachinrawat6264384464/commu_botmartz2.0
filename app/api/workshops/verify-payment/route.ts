import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { emailProvider } from "@/lib/email/provider";
import { sanitizeInput, wrapInBaseLayout } from "@/lib/email/template-engine";
import { DEFAULT_WORKSHOPS, ManagedWorkshop, WorkshopRegistration } from "@/lib/workshops";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const workshopId = String(body?.workshopId || "").trim();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const organization = String(body?.organization || "").trim() || "Independent Builder";
    const experienceLevel = String(body?.experienceLevel || "Intermediate").trim();
    const razorpayOrderId = String(body?.razorpayOrderId || "");
    const razorpayPaymentId = String(body?.razorpayPaymentId || "");
    const razorpaySignature = String(body?.razorpaySignature || "");

    if (!workshopId || !name || !email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Name, valid email, and workshop are required." },
        { status: 400 }
      );
    }

    let workshop: ManagedWorkshop | undefined;
    if (adminDb) {
      const wsSnap = await adminDb.collection("managed_workshops").doc(workshopId).get();
      if (wsSnap.exists) {
        workshop = wsSnap.data() as ManagedWorkshop;
      }
    }
    if (!workshop) {
      workshop = DEFAULT_WORKSHOPS.find((w) => w.id === workshopId);
    }
    if (!workshop) {
      return NextResponse.json({ success: false, error: "Workshop not found." }, { status: 404 });
    }

    const requiresPayment = Boolean(workshop.isPaid && Number(workshop.price) > 0);
    if (requiresPayment) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json(
          { success: false, error: "Razorpay secret not configured." },
          { status: 500 }
        );
      }

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json(
          { success: false, error: "Missing Razorpay payment verification fields." },
          { status: 400 }
        );
      }

      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (expectedSig !== razorpaySignature) {
        return NextResponse.json(
          { success: false, error: "Payment signature verification failed." },
          { status: 400 }
        );
      }
    }

    const now = Date.now();
    const registrationId = `WSREG_${now}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const ticketCode = `BM-WS-${Math.floor(100000 + Math.random() * 900000)}`;
    const amountPaid = requiresPayment ? Number(workshop.price) : 0;

    const record: WorkshopRegistration = {
      registrationId,
      workshopId,
      workshopTitle: workshop.title,
      name,
      email,
      phone,
      organization,
      experienceLevel,
      amountPaid,
      currency: "INR",
      razorpayOrderId: razorpayOrderId || (requiresPayment ? "" : `FREE_${now}`),
      razorpayPaymentId: razorpayPaymentId || (requiresPayment ? "" : `FREE_PASS_${now}`),
      paymentStatus: requiresPayment ? "PAID" : "FREE",
      ticketCode,
      registeredAt: now,
    };

    if (adminDb) {
      // 1. Store inside this workshop's OWN dedicated registration table
      await adminDb
        .collection("managed_workshops")
        .doc(workshopId)
        .collection("registrations")
        .doc(registrationId)
        .set(record);

      // 2. Increment workshop registrationCount
      await adminDb
        .collection("managed_workshops")
        .doc(workshopId)
        .set(
          {
            ...workshop,
            registrationCount: FieldValue.increment(1),
            updatedAt: now,
          },
          { merge: true }
        );

      // 3. Mirror in global workshop_registrations ledger
      await adminDb.collection("workshop_registrations").doc(registrationId).set(record);

      // 4. Mirror in orders & payments if paid
      if (requiresPayment) {
        await adminDb.collection("orders").add({
          orderId: record.razorpayOrderId,
          paymentId: record.razorpayPaymentId,
          itemName: workshop.title,
          itemCategory: "WORKSHOP_PASS",
          amount: amountPaid,
          currency: "INR",
          email,
          name,
          phone,
          status: "PAID",
          paymentMethod: "RAZORPAY",
          createdAt: new Date(now).toISOString(),
        });

        await adminDb.collection("payments").add({
          paymentId: record.razorpayPaymentId,
          orderId: record.razorpayOrderId,
          amount: amountPaid,
          currency: "INR",
          email,
          name,
          method: "Razorpay",
          status: "COMPLETED",
          createdAt: new Date(now).toISOString(),
        });
      }
    }

    // 5. Send Confirmation Email via Hostinger SMTP
    const contentHtml = `
      <h1 style="margin:0 0 10px 0;font-size:22px;font-weight:800;color:#FFFFFF;">
        Workshop Registration Confirmed
      </h1>
      <p style="margin:0 0 18px 0;font-size:14px;color:#CBD5E1;line-height:1.6;">
        Hi <strong style="color:#FFFFFF;">${sanitizeInput(name)}</strong>, your seat for <strong style="color:#D9F83B;">${sanitizeInput(workshop.title)}</strong> is officially confirmed!
      </p>
      <div style="background:#0F172A;border:1px solid #1E293B;border-left:3px solid #D9F83B;border-radius:12px;padding:16px;margin-bottom:20px;font-size:13px;color:#E2E8F0;line-height:1.8;">
        <div><strong style="color:#94A3B8;">Ticket Code:</strong> <span style="color:#D9F83B;font-weight:800;">${sanitizeInput(ticketCode)}</span></div>
        <div><strong style="color:#94A3B8;">Workshop:</strong> ${sanitizeInput(workshop.title)}</div>
        <div><strong style="color:#94A3B8;">Schedule:</strong> ${sanitizeInput(workshop.scheduleDate)} (${sanitizeInput(workshop.duration)})</div>
        <div><strong style="color:#94A3B8;">Instructor:</strong> ${sanitizeInput(workshop.instructor)}</div>
        <div><strong style="color:#94A3B8;">Amount Paid:</strong> ${requiresPayment ? `₹${amountPaid} INR (Paid)` : "Free"}</div>
        <div><strong style="color:#94A3B8;">Payment ID:</strong> ${sanitizeInput(record.razorpayPaymentId)}</div>
      </div>
      <div style="background:#162774;border:1px solid #1D3189;border-radius:12px;padding:16px;font-size:13px;color:#F8FAFC;line-height:1.6;">
        <strong style="color:#D9F83B;">Joining Instructions:</strong><br/>
        You will receive a dedicated email with the live joining link and starter repository before the workshop starts. Simply click that link when the session goes live to join!
      </div>
    `;

    try {
      const html = wrapInBaseLayout({
        title: `Registration Confirmed: ${workshop.title}`,
        badge: "WORKSHOP PASS",
        contentHtml,
      });

      await emailProvider.sendEmail({
        to: email,
        subject: `Seat Confirmed: ${workshop.title} (${ticketCode})`,
        html,
        text: `Hi ${name}, your seat for ${workshop.title} is confirmed! Ticket: ${ticketCode}. Schedule: ${workshop.scheduleDate}. Amount: ${requiresPayment ? `INR ${amountPaid}` : "Free"}. You will receive the live joining link on your email before the workshop starts.`,
      });
    } catch (mailErr) {
      console.warn("[Workshops Verify] Email dispatch warning:", mailErr);
    }

    return NextResponse.json({
      success: true,
      registration: record,
      message: `Seat confirmed! Ticket ${ticketCode} & confirmation details sent to ${email}.`,
    });
  } catch (err: any) {
    console.error("[Workshops Verify] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Registration failed." },
      { status: 500 }
    );
  }
}

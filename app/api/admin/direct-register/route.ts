import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { emitEvent } from "@/lib/email/automation-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, organization, plan } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required." }, { status: 400 });
    }

    const checkInCode = `ADM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const amountMap: Record<string, number> = {
      "bootcamp-01": 199,
      "bootcamp-02": 199,
      "bootcamp-03": 199,
      "bundle": 299
    };

    const newReg = {
      id: `bc-reg-dir-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      organization: organization ? organization.trim() : "",
      plan: plan || "bundle",
      amount: amountMap[plan] || 299,
      appliedCoupon: "ADMIN-DIRECT",
      status: "paid",
      attendance: true,
      attended: true,
      checkInCode,
      regDateStr: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      certificateSent: false,
      createdAt: new Date().toISOString()
    };

    if (adminDb && hasAdminCredentials) {
      try {
        await adminDb.collection("bootcamp_registrations").doc(newReg.id).set(newReg, { merge: true });
      } catch (e) {
        console.warn("Direct register Firestore write notice:", e);
      }
    }

    // Trigger Welcome Email & Drip Email Automation Sequence
    try {
      await emitEvent("USER_SIGNED_UP", {
        email: newReg.email,
        name: newReg.name,
        userId: newReg.id,
        metadata: {
          checkInCode,
          plan: newReg.plan
        }
      });
    } catch (eErr) {
      console.warn("Drip email automation emitEvent warning:", eErr);
    }

    return NextResponse.json({
      success: true,
      registration: newReg,
      message: `Direct registration created for ${newReg.name} (${newReg.checkInCode}). Ticket email queued.`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { emitEvent } from "@/lib/email/automation-engine";

// In-memory set to prevent duplicate emails during runtime
const registeredEmailsSet = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, organization, plan } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Full name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone && phone.trim() && phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Mobile phone must contain at least 10 digits." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check for duplicate email in in-memory cache
    if (registeredEmailsSet.has(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    // 2. Check for duplicate email in Firestore (bootcamp_registrations & users collections)
    if (adminDb && hasAdminCredentials) {
      try {
        const [regSnap, userSnap] = await Promise.all([
          adminDb.collection("bootcamp_registrations").where("email", "==", normalizedEmail).limit(1).get(),
          adminDb.collection("users").where("email", "==", normalizedEmail).limit(1).get()
        ]);

        if (!regSnap.empty || !userSnap.empty) {
          registeredEmailsSet.add(normalizedEmail);
          return NextResponse.json(
            { success: false, error: "An account with this email address already exists. Please sign in instead." },
            { status: 400 }
          );
        }
      } catch (checkErr) {
        console.warn("Direct register duplicate check notice:", checkErr);
      }
    }

    // 3. Create new registration object
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
      email: normalizedEmail,
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

    // Store in Firestore
    if (adminDb && hasAdminCredentials) {
      try {
        await adminDb.collection("bootcamp_registrations").doc(newReg.id).set(newReg, { merge: true });
        await adminDb.collection("users").doc(newReg.id).set({
          uid: newReg.id,
          displayName: newReg.name,
          email: newReg.email,
          organization: newReg.organization,
          createdAt: newReg.createdAt
        }, { merge: true });
      } catch (e) {
        console.warn("Direct register Firestore write notice:", e);
      }
    }

    // Register email in memory cache
    registeredEmailsSet.add(normalizedEmail);

    // 4. Trigger Welcome Email & Automation Sequence (Non-blocking for fast UI response)
    emitEvent("USER_SIGNED_UP", {
      email: newReg.email,
      name: newReg.name,
      userId: newReg.id,
      metadata: {
        checkInCode,
        plan: newReg.plan
      }
    }).catch((eErr) => console.warn("Drip email automation emitEvent warning:", eErr));

    return NextResponse.json({
      success: true,
      registration: newReg,
      message: `Account created for ${newReg.name} (${newReg.checkInCode}). Welcome email sent to ${newReg.email}.`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


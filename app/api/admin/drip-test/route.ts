import { NextRequest, NextResponse } from "next/server";
import { emailProvider } from "@/lib/email/provider";
import { compileTemplate } from "@/lib/email/template-engine";
import { emitEvent } from "@/lib/email/automation-engine";
import { saveDocToFirestoreRest } from "@/lib/firestore-rest";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  return handleDripTest(req);
}

export async function POST(req: NextRequest) {
  return handleDripTest(req);
}

async function handleDripTest(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    
    const email = (searchParams.get("email") || body.email || "").trim().toLowerCase();
    const step = (searchParams.get("step") || body.step || "ALL").toUpperCase(); // "WELCOME" | "STEP_1" | "STEP_2" | "ALL"
    const name = (searchParams.get("name") || body.name || "Builder Candidate").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Query param ?email=your_email@gmail.com or JSON body email is required." },
        { status: 400 }
      );
    }

    const results: any[] = [];

    // Save subscriber record to DB via Admin DB or Firestore REST fallback
    const subscriberData = {
      email,
      name,
      status: "ACTIVE",
      subscribedAt: Date.now(),
      source: "drip_test_trigger",
      updatedAt: Date.now()
    };

    if (adminDb) {
      try {
        await adminDb.collection("newsletter_subscribers").doc(email).set(subscriberData, { merge: true });
        await adminDb.collection("email_preferences").doc(email).set({
          email,
          newsletter: true,
          marketing_emails: true,
          product_updates: true,
          onboarding_emails: true,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore Admin DB write warning during drip test:", dbErr);
      }
    }
    await saveDocToFirestoreRest("newsletter_subscribers", email.replace(/[^a-zA-Z0-9]/g, "_"), subscriberData);

    // Trigger Drip Steps via Direct SMTP Dispatch to guarantee delivery
    if (step === "WELCOME" || step === "ALL") {
      const welcomeTemplate = compileTemplate("NEWSLETTER_WELCOME", { user_name: name, user_email: email });
      const res = await emailProvider.sendEmail({
        to: email,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
        text: welcomeTemplate.text
      });
      results.push({ step: "NEWSLETTER_WELCOME", success: res.success, messageId: res.messageId, error: res.error });
    }

    if (step === "STEP_1" || step === "ALL") {
      const step1Template = compileTemplate("DRIP_STEP_1_FEATURES", { user_name: name, user_email: email });
      const res = await emailProvider.sendEmail({
        to: email,
        subject: step1Template.subject,
        html: step1Template.html,
        text: step1Template.text
      });
      results.push({ step: "DRIP_STEP_1_FEATURES", success: res.success, messageId: res.messageId, error: res.error });
    }

    if (step === "STEP_2" || step === "ALL") {
      const step2Template = compileTemplate("DRIP_STEP_2_GETTING_STARTED", { user_name: name, user_email: email });
      const res = await emailProvider.sendEmail({
        to: email,
        subject: step2Template.subject,
        html: step2Template.html,
        text: step2Template.text
      });
      results.push({ step: "DRIP_STEP_2_GETTING_STARTED", success: res.success, messageId: res.messageId, error: res.error });
    }

    // Also emit automation event
    await emitEvent("USER_SIGNED_UP", {
      email,
      name,
      metadata: { source: "drip_test_manual_dispatch" }
    });

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `🚀 Drip Email sequence triggered for ${email}! ${successCount}/${results.length} email steps dispatched directly to SMTP inbox.`,
      targetEmail: email,
      results
    });
  } catch (err: any) {
    console.error("[DripTestAPI] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute drip email test." },
      { status: 500 }
    );
  }
}

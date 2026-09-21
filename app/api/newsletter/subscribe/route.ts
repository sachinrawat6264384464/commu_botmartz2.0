import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { emitEvent } from "@/lib/email/automation-engine";
import { generateUnsubscribeToken } from "@/lib/email/tokens";
import { saveDocToFirestoreRest } from "@/lib/firestore-rest";
import { emailProvider } from "@/lib/email/provider";
import { compileTemplate } from "@/lib/email/template-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, source } = body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = name ? String(name).trim() : "Subscriber";
    const unsubToken = generateUnsubscribeToken(normalizedEmail);
    const now = Date.now();

    let isAlreadyActive = false;

    // 1. Try Firestore Admin DB first if available
    if (adminDb) {
      try {
        const subRef = adminDb.collection("newsletter_subscribers").doc(normalizedEmail);
        const subSnap = await subRef.get();

        if (subSnap.exists) {
          const existingData = subSnap.data();
          if (existingData?.status === "ACTIVE") {
            isAlreadyActive = true;
          } else {
            await subRef.set(
              {
                status: "ACTIVE",
                resubscribedAt: now,
                unsubToken,
                updatedAt: now,
              },
              { merge: true }
            );
          }
        } else {
          await subRef.set({
            email: normalizedEmail,
            name: displayName,
            status: "ACTIVE",
            subscribedAt: now,
            unsubToken,
            source: source || "footer_form",
            createdAt: now,
            updatedAt: now,
          });
        }

        const prefRef = adminDb.collection("email_preferences").doc(normalizedEmail);
        await prefRef.set(
          {
            email: normalizedEmail,
            newsletter: true,
            marketing_emails: true,
            product_updates: true,
            onboarding_emails: true,
            updatedAt: now,
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn("[NewsletterSubscribeAPI] Firestore Admin DB write warning:", dbErr);
      }
    }

    // 2. Direct Firestore REST fallback to guarantee database persistence
    const docId = normalizedEmail.replace(/[^a-zA-Z0-9]/g, "_");
    await saveDocToFirestoreRest("newsletter_subscribers", docId, {
      email: normalizedEmail,
      name: displayName,
      status: "ACTIVE",
      subscribedAt: now,
      unsubToken,
      source: source || "footer_form",
      createdAt: now,
      updatedAt: now,
    });

    if (isAlreadyActive) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You are already subscribed to the newsletter!",
      });
    }

    // 3. Immediate SMTP Dispatch of Welcome & Onboarding Drip Email
    (async () => {
      try {
        const welcomeCompiled = compileTemplate("NEWSLETTER_WELCOME", {
          user_name: displayName,
          user_email: normalizedEmail
        });

        await emailProvider.sendEmail({
          to: normalizedEmail,
          subject: welcomeCompiled.subject,
          html: welcomeCompiled.html,
          text: welcomeCompiled.text
        });

        // Emit automation event for queue tracking
        await emitEvent("NEWSLETTER_SUBSCRIBED", {
          email: normalizedEmail,
          name: displayName,
          metadata: { source: source || "footer" }
        });
      } catch (eErr) {
        console.warn("[NewsletterSubscribeAPI] Email dispatch warning:", eErr);
      }
    })();

    return NextResponse.json({
      success: true,
      message: "🎉 Successfully subscribed! Check your inbox for your welcome email.",
    });
  } catch (err: any) {
    console.error("[NewsletterSubscribeAPI] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { email, badgeId } = await request.json();

    if (!email || !badgeId) {
      return NextResponse.json(
        { success: false, error: "Email and badge ID are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    if (adminDb) {
      try {
        const userRef = adminDb.collection("users").doc(cleanEmail);
        const userDoc = await userRef.get();

        let currentClaimed: string[] = [];
        if (userDoc.exists) {
          currentClaimed = userDoc.data()?.claimedBadges || [];
        }

        if (!currentClaimed.includes(badgeId)) {
          currentClaimed.push(badgeId);
          await userRef.set(
            {
              claimedBadges: currentClaimed,
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          );
        }

        // Also add to audit collection
        await adminDb.collection("claimed_badges").add({
          email: cleanEmail,
          badgeId,
          claimedAt: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          claimedBadges: currentClaimed,
          message: `Badge ${badgeId} successfully claimed!`
        });
      } catch (dbErr) {
        console.warn("Firestore badge claim warning:", dbErr);
      }
    }

    // Fallback response if offline/emulator
    return NextResponse.json({
      success: true,
      claimedBadges: [badgeId],
      message: `Badge ${badgeId} claimed locally.`
    });
  } catch (err: any) {
    console.error("Badge claim error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to claim badge." },
      { status: 500 }
    );
  }
}
